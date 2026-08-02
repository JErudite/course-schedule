begin;

drop function if exists public.match_pet_battle();

create function public.match_pet_battle()
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
  challenger_experience bigint,
  battles_used_today integer,
  battles_remaining_today integer
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
  v_battles_used integer;
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

  -- Serialize each student's match requests so concurrent clicks cannot exceed
  -- the three-battle daily limit.
  perform pg_advisory_xact_lock(hashtextextended(v_challenger.id::text, 20260802));

  select count(*)::integer into v_battles_used
  from public.pet_battles battle
  where battle.challenger_id = v_challenger.id
    and timezone('Asia/Shanghai', battle.created_at)::date = timezone('Asia/Shanghai', now())::date;

  if v_battles_used >= 3 then
    raise exception using errcode = 'P0001', message = 'daily battle limit reached';
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

  select * into v_challenger from public.students where id = auth.uid();
  select * into v_opponent from public.students where id = v_opponent_id;

  if v_challenger.pet is null or v_opponent.pet is null or v_opponent.is_admin then
    raise exception using errcode = 'P0001', message = 'no battle opponent available';
  end if;

  v_challenger_level := public.pet_level_for_experience(v_challenger.pet_experience);
  v_opponent_level := public.pet_level_for_experience(v_opponent.pet_experience);

  if v_challenger_level <> v_opponent_level then
    v_battle_method := 'level';
    v_winner_id := case when v_challenger_level > v_opponent_level then v_challenger.id else v_opponent.id end;
  else
    v_battle_method := 'rps';
    v_challenger_move_index := floor(random() * 3)::integer + 1;
    v_opponent_move_index := ((v_challenger_move_index - 1 + case when random() < 0.5 then 1 else 2 end) % 3) + 1;
    v_challenger_move := v_moves[v_challenger_move_index];
    v_opponent_move := v_moves[v_opponent_move_index];
    v_winner_id := case
      when (v_challenger_move = 'rock' and v_opponent_move = 'scissors')
        or (v_challenger_move = 'paper' and v_opponent_move = 'rock')
        or (v_challenger_move = 'scissors' and v_opponent_move = 'paper')
      then v_challenger.id else v_opponent.id
    end;
  end if;

  -- A level needs level * 10 XP. Winners receive 10%, losers 5%, rounded
  -- upward so every completed battle grants at least one XP.
  v_challenger_reward := greatest(1, ceil(v_challenger_level * 10 * case when v_winner_id = v_challenger.id then 0.10 else 0.05 end)::integer);
  v_opponent_reward := greatest(1, ceil(v_opponent_level * 10 * case when v_winner_id = v_opponent.id then 0.10 else 0.05 end)::integer);

  update public.students
  set pet_experience = pet_experience + v_challenger_reward
  where id = v_challenger.id
  returning pet_experience into v_challenger_experience;

  update public.students
  set pet_experience = pet_experience + v_opponent_reward
  where id = v_opponent.id;

  insert into public.pet_battles (
    challenger_id, opponent_id, challenger_level, opponent_level,
    battle_method, challenger_move, opponent_move, winner_id,
    challenger_reward, opponent_reward
  ) values (
    v_challenger.id, v_opponent.id, v_challenger_level, v_opponent_level,
    v_battle_method, v_challenger_move, v_opponent_move, v_winner_id,
    v_challenger_reward, v_opponent_reward
  ) returning id into v_battle_id;

  v_battles_used := v_battles_used + 1;

  return query select
    v_battle_id,
    left(v_opponent.username, 1) || '同学',
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
    v_challenger_experience,
    v_battles_used,
    greatest(0, 3 - v_battles_used);
end;
$$;

create or replace function public.get_my_pet_battle_summary()
returns table (battles_used_today integer, battles_remaining_today integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  used_count integer;
begin
  if auth.uid() is null then
    raise exception using errcode = '42501', message = 'authentication required';
  end if;

  select count(*)::integer into used_count
  from public.pet_battles battle
  where battle.challenger_id = auth.uid()
    and timezone('Asia/Shanghai', battle.created_at)::date = timezone('Asia/Shanghai', now())::date;

  return query select used_count, greatest(0, 3 - used_count);
end;
$$;

create or replace function public.get_pet_leaderboard()
returns table (
  rank_position bigint,
  owner_username text,
  is_self boolean,
  pet_type text,
  pet_name text,
  pet_experience bigint,
  pet_level integer,
  level_progress bigint,
  level_required integer,
  next_reward_percent integer,
  last_reward_experience bigint
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_is_admin boolean;
begin
  if auth.uid() is null then
    raise exception using errcode = '42501', message = 'authentication required';
  end if;

  perform public.settle_pet_weekly_ranking();
  caller_is_admin := public.is_admin_account();

  return query
  with latest_settlement as (
    select id from public.pet_weekly_settlements order by week_start desc limit 1
  ), ranked as (
    select
      student.*,
      rank() over (order by student.pet_experience desc) as position,
      public.pet_level_for_experience(student.pet_experience) as level_value
    from public.students student
    where not student.is_admin and student.pet is not null
  )
  select
    ranked.position,
    case
      when caller_is_admin or ranked.id = auth.uid() then ranked.username
      else left(ranked.username, 1) || '同学'
    end,
    ranked.id = auth.uid(),
    ranked.pet,
    coalesce(nullif(btrim(ranked.pet_name), ''), '未命名宠物'),
    ranked.pet_experience,
    ranked.level_value,
    ranked.pet_experience - 5 * (ranked.level_value - 1)::bigint * ranked.level_value,
    ranked.level_value * 10,
    case
      when ranked.position = 1 then 100
      when ranked.position <= 11 then greatest(0, 110 - ranked.position::integer * 10)
      else 0
    end,
    coalesce(reward.reward_experience, 0)
  from ranked
  left join latest_settlement on true
  left join public.pet_weekly_rewards reward
    on reward.settlement_id = latest_settlement.id and reward.student_id = ranked.id
  order by ranked.position, ranked.created_at, ranked.id;
end;
$$;

revoke all on function public.match_pet_battle() from public, anon, authenticated;
revoke all on function public.get_my_pet_battle_summary() from public, anon, authenticated;
grant execute on function public.match_pet_battle() to authenticated;
grant execute on function public.get_my_pet_battle_summary() to authenticated;

notify pgrst, 'reload schema';

commit;
