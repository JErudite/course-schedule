begin;

alter table public.students
  drop constraint if exists students_pet_check,
  add constraint students_pet_check check (
    pet is null or pet = any (array[
      'cat', 'dog', 'rabbit', 'hamster', 'fox', 'panda', 'bear', 'frog',
      'lion', 'tiger', 'leopard', 'elephant', 'giraffe', 'zebra',
      'monkey', 'gorilla', 'giant-panda', 'red-panda', 'koala', 'kangaroo',
      'alpaca', 'deer', 'hippo', 'rhino', 'crocodile', 'polar-bear',
      'seal', 'dolphin', 'flamingo', 'peacock', 'parrot', 'owl',
      'raccoon', 'camel', 'wolf', 'snake', 'milk_dragon'
    ])
  );

alter table public.pet_foods
  drop constraint if exists pet_foods_pet_type_check,
  add constraint pet_foods_pet_type_check check (
    pet_type = any (array[
      'cat', 'dog', 'rabbit', 'hamster', 'fox', 'panda', 'bear', 'frog',
      'lion', 'tiger', 'leopard', 'elephant', 'giraffe', 'zebra',
      'monkey', 'gorilla', 'giant-panda', 'red-panda', 'koala', 'kangaroo',
      'alpaca', 'deer', 'hippo', 'rhino', 'crocodile', 'polar-bear',
      'seal', 'dolphin', 'flamingo', 'peacock', 'parrot', 'owl',
      'raccoon', 'camel', 'wolf', 'snake', 'milk_dragon'
    ])
  );

with animal_foods (pet_type, small_food, medium_food, large_food) as (
  values
    ('lion', '肉干', '牛肉块', '豪华肉排'),
    ('tiger', '鸡肉条', '牛肉块', '鲜肉拼盘'),
    ('leopard', '肉干', '鸡胸肉', '鲜肉拼盘'),
    ('elephant', '嫩草', '苹果篮', '甘蔗捆'),
    ('giraffe', '嫩树叶', '苹果篮', '金合欢叶篮'),
    ('zebra', '青草', '胡萝卜', '优质干草'),
    ('monkey', '花生', '香蕉', '热带果篮'),
    ('gorilla', '芹菜', '香蕉串', '森林果盘'),
    ('giant-panda', '小竹笋', '鲜竹叶', '竹笋大餐'),
    ('red-panda', '甜果', '鲜竹叶', '森林果篮'),
    ('koala', '桉树嫩芽', '桉树叶', '精选桉叶篮'),
    ('kangaroo', '青草', '苹果片', '蔬果大餐'),
    ('alpaca', '嫩草', '苹果片', '优质干草'),
    ('deer', '青草', '苹果', '橡果篮'),
    ('hippo', '青草', '西瓜', '蔬果大餐'),
    ('rhino', '嫩草', '苹果篮', '优质干草'),
    ('crocodile', '小鱼', '鸡肉', '鲜肉拼盘'),
    ('polar-bear', '小鱼', '鲑鱼', '鳕鱼大餐'),
    ('seal', '小虾', '沙丁鱼', '鲑鱼大餐'),
    ('dolphin', '小鱼', '鱿鱼', '海鲜拼盘'),
    ('flamingo', '小虾', '藻类', '磷虾大餐'),
    ('peacock', '谷粒', '浆果', '鲜果拼盘'),
    ('parrot', '瓜子', '坚果', '热带果盘'),
    ('owl', '小虫干', '肉干', '营养肉餐'),
    ('raccoon', '浆果', '坚果', '森林果篮'),
    ('camel', '嫩草', '椰枣', '优质干草'),
    ('wolf', '肉干', '鸡肉', '牛肉大餐'),
    ('snake', '鹌鹑蛋', '鸡肉', '营养肉餐')
), food_rows as (
  select pet_type || '-snack' as id, pet_type, small_food as name, 2 as experience, 2 as coin_cost, 1 as sort_order from animal_foods
  union all
  select pet_type || '-meal', pet_type, medium_food, 5, 5, 2 from animal_foods
  union all
  select pet_type || '-feast', pet_type, large_food, 10, 10, 3 from animal_foods
)
insert into public.pet_foods (id, pet_type, name, experience, coin_cost, sort_order)
select id, pet_type, name, experience, coin_cost, sort_order
from food_rows
on conflict (id) do update
set pet_type = excluded.pet_type,
    name = excluded.name,
    experience = excluded.experience,
    coin_cost = excluded.coin_cost,
    sort_order = excluded.sort_order;

create or replace function public.set_student_pet(
  p_student_id uuid,
  p_pet text
)
returns public.students
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  saved_student public.students%rowtype;
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  if p_pet is not null and p_pet <> all (array[
    'cat', 'dog', 'rabbit', 'hamster', 'fox', 'panda', 'bear', 'frog',
    'lion', 'tiger', 'leopard', 'elephant', 'giraffe', 'zebra',
    'monkey', 'gorilla', 'giant-panda', 'red-panda', 'koala', 'kangaroo',
    'alpaca', 'deer', 'hippo', 'rhino', 'crocodile', 'polar-bear',
    'seal', 'dolphin', 'flamingo', 'peacock', 'parrot', 'owl',
    'raccoon', 'camel', 'wolf', 'snake'
  ]) then
    raise exception using errcode = '22023', message = 'invalid pet';
  end if;

  update public.students
  set pet = p_pet
  where id = p_student_id
    and not is_admin
  returning * into saved_student;

  if not found then
    raise exception using errcode = '22023', message = 'student account not found';
  end if;

  return saved_student;
end;
$$;

alter table public.pet_battles
  add column if not exists challenger_pet text,
  add column if not exists opponent_pet text,
  add column if not exists challenger_pet_name text,
  add column if not exists opponent_pet_name text;

update public.pet_battles battle
set challenger_pet = coalesce(battle.challenger_pet, challenger.pet),
    opponent_pet = coalesce(battle.opponent_pet, opponent.pet),
    challenger_pet_name = coalesce(battle.challenger_pet_name, challenger.pet_name),
    opponent_pet_name = coalesce(battle.opponent_pet_name, opponent.pet_name)
from public.students challenger, public.students opponent
where challenger.id = battle.challenger_id
  and opponent.id = battle.opponent_id
  and (
    battle.challenger_pet is null or battle.opponent_pet is null
    or battle.challenger_pet_name is null or battle.opponent_pet_name is null
  );

create or replace function public.capture_pet_battle_snapshot()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  select pet, pet_name
  into new.challenger_pet, new.challenger_pet_name
  from public.students
  where id = new.challenger_id;

  select pet, pet_name
  into new.opponent_pet, new.opponent_pet_name
  from public.students
  where id = new.opponent_id;

  return new;
end;
$$;

drop trigger if exists pet_battles_capture_snapshot on public.pet_battles;
create trigger pet_battles_capture_snapshot
before insert on public.pet_battles
for each row execute function public.capture_pet_battle_snapshot();

create or replace function public.pet_level_for_experience(p_experience bigint)
returns integer
language sql
immutable
strict
parallel safe
as $$
  select floor((sqrt(1 + 0.8 * greatest(p_experience, 0)::numeric) - 1) / 2)::integer + 1;
$$;

create table if not exists public.pet_ranking_settings (
  singleton boolean primary key default true check (singleton),
  start_week date not null
);

insert into public.pet_ranking_settings (singleton, start_week)
values (
  true,
  timezone('Asia/Shanghai', now())::date
    - (extract(isodow from timezone('Asia/Shanghai', now())::date)::integer - 1)
)
on conflict (singleton) do nothing;

create table if not exists public.pet_weekly_settlements (
  id bigint generated always as identity primary key,
  week_start date not null unique,
  settled_at timestamptz not null default now()
);

create table if not exists public.pet_weekly_rewards (
  id bigint generated always as identity primary key,
  settlement_id bigint not null references public.pet_weekly_settlements(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  rank_position integer not null check (rank_position > 0),
  experience_before bigint not null check (experience_before >= 0),
  level_before integer not null check (level_before > 0),
  reward_percent integer not null check (reward_percent between 0 and 100),
  reward_experience bigint not null check (reward_experience >= 0),
  experience_after bigint not null check (experience_after >= experience_before),
  unique (settlement_id, student_id)
);

create index if not exists pet_weekly_rewards_student_idx
  on public.pet_weekly_rewards (student_id, settlement_id desc);

alter table public.pet_ranking_settings enable row level security;
alter table public.pet_weekly_settlements enable row level security;
alter table public.pet_weekly_rewards enable row level security;

drop policy if exists "Signed-in users can read pet settlement dates" on public.pet_weekly_settlements;
create policy "Signed-in users can read pet settlement dates"
on public.pet_weekly_settlements
for select
to authenticated
using (true);

drop policy if exists "Users can read own rewards and administrators can read all" on public.pet_weekly_rewards;
create policy "Users can read own rewards and administrators can read all"
on public.pet_weekly_rewards
for select
to authenticated
using (student_id = auth.uid() or public.is_admin_account());

create or replace function public.settle_pet_weekly_ranking()
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_china_date date := timezone('Asia/Shanghai', now())::date;
  current_week_start date;
  target_week_start date;
  ranking_start_week date;
  new_settlement_id bigint;
begin
  current_week_start := current_china_date
    - (extract(isodow from current_china_date)::integer - 1);
  target_week_start := current_week_start - 7;

  select start_week into ranking_start_week
  from public.pet_ranking_settings
  where singleton;

  if target_week_start < ranking_start_week then
    return false;
  end if;

  perform pg_advisory_xact_lock(hashtext('course-schedule-pet-weekly-ranking'));

  insert into public.pet_weekly_settlements (week_start)
  values (target_week_start)
  on conflict (week_start) do nothing
  returning id into new_settlement_id;

  if new_settlement_id is null then
    return false;
  end if;

  with ranked as materialized (
    select
      id as student_id,
      pet_experience as experience_before,
      public.pet_level_for_experience(pet_experience) as level_before,
      row_number() over (order by pet_experience desc, created_at, id)::integer as rank_position
    from public.students
    where not is_admin
      and pet is not null
  ), calculated as (
    select
      student_id,
      experience_before,
      level_before,
      rank_position,
      case
        when rank_position = 1 then 100
        when rank_position <= 11 then greatest(0, 110 - rank_position * 10)
        else 0
      end as reward_percent,
      case
        when rank_position = 1 then
          5 * level_before::bigint * (level_before + 1) - experience_before
        when rank_position between 2 and 10 then
          ceil(level_before * 10 * (110 - rank_position * 10) / 100.0)::bigint
        else 0
      end as reward_experience
    from ranked
    where rank_position <= 11
  ), saved_rewards as (
    insert into public.pet_weekly_rewards (
      settlement_id,
      student_id,
      rank_position,
      experience_before,
      level_before,
      reward_percent,
      reward_experience,
      experience_after
    )
    select
      new_settlement_id,
      student_id,
      rank_position,
      experience_before,
      level_before,
      reward_percent,
      reward_experience,
      experience_before + reward_experience
    from calculated
    returning student_id, reward_experience
  )
  update public.students student
  set pet_experience = student.pet_experience + reward.reward_experience
  from saved_rewards reward
  where student.id = reward.student_id
    and reward.reward_experience > 0;

  return true;
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
    select id
    from public.pet_weekly_settlements
    order by week_start desc
    limit 1
  ), ranked as (
    select
      student.*,
      row_number() over (order by student.pet_experience desc, student.created_at, student.id) as position,
      public.pet_level_for_experience(student.pet_experience) as level_value
    from public.students student
    where not student.is_admin
      and student.pet is not null
  )
  select
    ranked.position,
    case when caller_is_admin then ranked.username else null end,
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
    on reward.settlement_id = latest_settlement.id
   and reward.student_id = ranked.id
  order by ranked.position;
end;
$$;

create or replace function public.get_admin_pet_comparison()
returns table (
  pet_type text,
  pet_name text,
  pet_experience bigint,
  pet_coins bigint,
  pet_checkin_date date,
  pet_checkin_streak integer,
  pet_level integer,
  level_progress bigint,
  level_required integer
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise exception using errcode = '42501', message = 'authentication required';
  end if;

  return query
  select
    student.pet,
    coalesce(nullif(btrim(student.pet_name), ''), '奶龙'),
    student.pet_experience,
    student.pet_coins,
    student.pet_checkin_date,
    student.pet_checkin_streak,
    public.pet_level_for_experience(student.pet_experience),
    student.pet_experience
      - 5 * (public.pet_level_for_experience(student.pet_experience) - 1)::bigint
        * public.pet_level_for_experience(student.pet_experience),
    public.pet_level_for_experience(student.pet_experience) * 10
  from public.students student
  where student.is_admin
  limit 1;
end;
$$;

revoke all privileges on table public.pet_ranking_settings from public, anon, authenticated;
revoke all privileges on table public.pet_weekly_settlements from public, anon, authenticated;
revoke all privileges on table public.pet_weekly_rewards from public, anon, authenticated;
grant select (id, week_start, settled_at) on table public.pet_weekly_settlements to authenticated;
grant select on table public.pet_weekly_rewards to authenticated;

revoke all on function public.capture_pet_battle_snapshot() from public, anon, authenticated;
revoke all on function public.pet_level_for_experience(bigint) from public, anon, authenticated;
revoke all on function public.settle_pet_weekly_ranking() from public, anon, authenticated;
revoke all on function public.get_pet_leaderboard() from public, anon, authenticated;
revoke all on function public.get_admin_pet_comparison() from public, anon, authenticated;
revoke all on function public.set_student_pet(uuid, text) from public, anon, authenticated;

grant execute on function public.get_pet_leaderboard() to authenticated;
grant execute on function public.get_admin_pet_comparison() to authenticated;
grant execute on function public.set_student_pet(uuid, text) to authenticated;

do $$
declare
  existing_job_id bigint;
begin
  begin
    create extension if not exists pg_cron;
  exception when others then
    raise notice 'pg_cron is unavailable; leaderboard views will provide idempotent fallback settlement';
    return;
  end;

  select jobid into existing_job_id
  from cron.job
  where jobname = 'course-schedule-pet-ranking'
  limit 1;

  if existing_job_id is not null then
    perform cron.unschedule(existing_job_id);
  end if;

  perform cron.schedule(
    'course-schedule-pet-ranking',
    '5 16 * * 0',
    'select public.settle_pet_weekly_ranking();'
  );
exception when others then
  raise notice 'weekly cron setup skipped: %', sqlerrm;
end;
$$;

notify pgrst, 'reload schema';

commit;
