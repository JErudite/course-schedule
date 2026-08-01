begin;

create table if not exists public.pet_battles (
  id bigint generated always as identity primary key,
  challenger_id uuid not null references public.students(id) on delete cascade,
  opponent_id uuid not null references public.students(id) on delete cascade,
  challenger_level integer not null check (challenger_level > 0),
  opponent_level integer not null check (opponent_level > 0),
  battle_method text not null check (battle_method in ('level', 'rps')),
  challenger_move text check (challenger_move is null or challenger_move in ('rock', 'paper', 'scissors')),
  opponent_move text check (opponent_move is null or opponent_move in ('rock', 'paper', 'scissors')),
  winner_id uuid not null references public.students(id) on delete cascade,
  challenger_reward integer not null check (challenger_reward > 0),
  opponent_reward integer not null check (opponent_reward > 0),
  created_at timestamptz not null default now(),
  constraint pet_battles_different_players check (challenger_id <> opponent_id),
  constraint pet_battles_winner_participated check (winner_id in (challenger_id, opponent_id)),
  constraint pet_battles_moves_match_method check (
    (battle_method = 'level' and challenger_move is null and opponent_move is null)
    or (battle_method = 'rps' and challenger_move is not null and opponent_move is not null)
  )
);

create index if not exists pet_battles_challenger_created_idx
  on public.pet_battles (challenger_id, created_at desc);

create index if not exists pet_battles_opponent_created_idx
  on public.pet_battles (opponent_id, created_at desc);

alter table public.pet_battles enable row level security;

drop policy if exists "Participants can read pet battles" on public.pet_battles;
create policy "Participants can read pet battles"
on public.pet_battles
for select
to authenticated
using (
  challenger_id = auth.uid()
  or opponent_id = auth.uid()
  or public.is_admin_account()
);

create or replace function public.match_pet_battle()
returns table (
  battle_id bigint,
  opponent_username text,
  opponent_pet text,
  opponent_pet_name text,
  challenger_level integer,
  opponent_level integer,
  battle_method text,
  challenger_move text,
  opponent_move text,
  winner text,
  challenger_reward integer,
  opponent_reward integer,
  challenger_experience bigint
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_challenger public.students%rowtype;
  v_opponent public.students%rowtype;
  v_opponent_id uuid;
  v_challenger_level integer;
  v_opponent_level integer;
  v_battle_method text;
  v_challenger_move_index integer;
  v_opponent_move_index integer;
  v_challenger_move text;
  v_opponent_move text;
  v_winner_id uuid;
  v_challenger_reward integer;
  v_opponent_reward integer;
  v_battle_id bigint;
  v_challenger_experience bigint;
  v_moves constant text[] := array['rock', 'paper', 'scissors'];
begin
  if auth.uid() is null then
    raise exception using errcode = '42501', message = 'authentication required';
  end if;

  select * into v_challenger
  from public.students
  where id = auth.uid();

  if not found or v_challenger.is_admin or v_challenger.pet is null then
    raise exception using errcode = '22023', message = 'student pet required';
  end if;

  select id into v_opponent_id
  from public.students
  where id <> v_challenger.id
    and not is_admin
    and pet is not null
  order by random()
  limit 1;

  if v_opponent_id is null then
    raise exception using errcode = 'P0001', message = 'no battle opponent available';
  end if;

  perform 1
  from public.students
  where id in (v_challenger.id, v_opponent_id)
  order by id
  for update;

  select * into v_challenger
  from public.students
  where id = auth.uid();

  select * into v_opponent
  from public.students
  where id = v_opponent_id;

  if v_challenger.pet is null or v_opponent.pet is null or v_opponent.is_admin then
    raise exception using errcode = 'P0001', message = 'no battle opponent available';
  end if;

  v_challenger_level := floor((sqrt(1 + 0.8 * v_challenger.pet_experience::numeric) - 1) / 2)::integer + 1;
  v_opponent_level := floor((sqrt(1 + 0.8 * v_opponent.pet_experience::numeric) - 1) / 2)::integer + 1;

  if v_challenger_level <> v_opponent_level then
    v_battle_method := 'level';
    v_winner_id := case
      when v_challenger_level > v_opponent_level then v_challenger.id
      else v_opponent.id
    end;
  else
    v_battle_method := 'rps';
    v_challenger_move_index := floor(random() * 3)::integer + 1;
    v_opponent_move_index := ((v_challenger_move_index - 1
      + case when random() < 0.5 then 1 else 2 end) % 3) + 1;
    v_challenger_move := v_moves[v_challenger_move_index];
    v_opponent_move := v_moves[v_opponent_move_index];
    v_winner_id := case
      when (v_challenger_move = 'rock' and v_opponent_move = 'scissors')
        or (v_challenger_move = 'paper' and v_opponent_move = 'rock')
        or (v_challenger_move = 'scissors' and v_opponent_move = 'paper')
      then v_challenger.id
      else v_opponent.id
    end;
  end if;

  v_challenger_reward := greatest(1, ceil(
    v_challenger_level * 10 * case when v_winner_id = v_challenger.id then 0.10 else 0.05 end
  )::integer);
  v_opponent_reward := greatest(1, ceil(
    v_opponent_level * 10 * case when v_winner_id = v_opponent.id then 0.10 else 0.05 end
  )::integer);

  update public.students
  set pet_experience = pet_experience + v_challenger_reward
  where id = v_challenger.id
  returning pet_experience into v_challenger_experience;

  update public.students
  set pet_experience = pet_experience + v_opponent_reward
  where id = v_opponent.id;

  insert into public.pet_battles (
    challenger_id,
    opponent_id,
    challenger_level,
    opponent_level,
    battle_method,
    challenger_move,
    opponent_move,
    winner_id,
    challenger_reward,
    opponent_reward
  ) values (
    v_challenger.id,
    v_opponent.id,
    v_challenger_level,
    v_opponent_level,
    v_battle_method,
    v_challenger_move,
    v_opponent_move,
    v_winner_id,
    v_challenger_reward,
    v_opponent_reward
  ) returning id into v_battle_id;

  return query select
    v_battle_id,
    v_opponent.username,
    v_opponent.pet,
    v_opponent.pet_name,
    v_challenger_level,
    v_opponent_level,
    v_battle_method,
    v_challenger_move,
    v_opponent_move,
    case when v_winner_id = v_challenger.id then 'challenger' else 'opponent' end,
    v_challenger_reward,
    v_opponent_reward,
    v_challenger_experience;
end;
$$;

revoke all privileges on table public.pet_battles from public, anon, authenticated;
grant select on table public.pet_battles to authenticated;

revoke all on function public.match_pet_battle() from public, anon, authenticated;
grant execute on function public.match_pet_battle() to authenticated;

notify pgrst, 'reload schema';

commit;
