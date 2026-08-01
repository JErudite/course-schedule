begin;

alter table public.students
  add column if not exists pet_name text,
  add column if not exists pet_experience bigint not null default 0,
  add column if not exists pet_coins bigint not null default 0,
  add column if not exists pet_checkin_date date,
  add column if not exists pet_checkin_streak integer not null default 0;

alter table public.students
  drop constraint if exists students_pet_check,
  add constraint students_pet_check check (
    pet is null or pet = any (array[
      'cat', 'dog', 'rabbit', 'hamster',
      'fox', 'panda', 'bear', 'frog', 'milk_dragon'
    ])
  ),
  drop constraint if exists students_pet_name_check,
  add constraint students_pet_name_check check (
    pet_name is null or char_length(btrim(pet_name)) between 1 and 20
  ),
  drop constraint if exists students_pet_experience_check,
  add constraint students_pet_experience_check check (pet_experience >= 0),
  drop constraint if exists students_pet_coins_check,
  add constraint students_pet_coins_check check (pet_coins >= 0),
  drop constraint if exists students_pet_checkin_streak_check,
  add constraint students_pet_checkin_streak_check check (pet_checkin_streak >= 0);

create unique index if not exists students_unique_milk_dragon_idx
  on public.students (pet)
  where pet = 'milk_dragon';

update public.students
set pet = 'milk_dragon',
    pet_name = coalesce(nullif(btrim(pet_name), ''), '奶龙')
where is_admin;

create table if not exists public.pet_foods (
  id text primary key,
  pet_type text not null,
  name text not null,
  experience integer not null,
  coin_cost integer not null,
  sort_order integer not null default 0,
  constraint pet_foods_pet_type_check check (
    pet_type = any (array[
      'cat', 'dog', 'rabbit', 'hamster',
      'fox', 'panda', 'bear', 'frog', 'milk_dragon'
    ])
  ),
  constraint pet_foods_name_check check (char_length(btrim(name)) between 1 and 30),
  constraint pet_foods_experience_check check (experience > 0),
  constraint pet_foods_coin_cost_check check (coin_cost = experience)
);

insert into public.pet_foods (id, pet_type, name, experience, coin_cost, sort_order)
values
  ('cat-fish', 'cat', '小鱼干', 2, 2, 1),
  ('cat-can', 'cat', '猫罐头', 5, 5, 2),
  ('cat-tuna', 'cat', '金枪鱼', 10, 10, 3),
  ('dog-kibble', 'dog', '狗粮', 2, 2, 1),
  ('dog-stick', 'dog', '磨牙棒', 5, 5, 2),
  ('dog-bone', 'dog', '大骨头', 10, 10, 3),
  ('rabbit-grass', 'rabbit', '苜蓿草', 2, 2, 1),
  ('rabbit-apple', 'rabbit', '苹果片', 5, 5, 2),
  ('rabbit-carrot', 'rabbit', '胡萝卜篮', 10, 10, 3),
  ('hamster-seed', 'hamster', '瓜子', 2, 2, 1),
  ('hamster-cheese', 'hamster', '奶酪', 5, 5, 2),
  ('hamster-nuts', 'hamster', '坚果拼盘', 10, 10, 3),
  ('fox-pine', 'fox', '松子', 2, 2, 1),
  ('fox-hazelnut', 'fox', '榛果', 5, 5, 2),
  ('fox-fruit', 'fox', '森林果篮', 10, 10, 3),
  ('panda-shrimp', 'panda', '小虾', 2, 2, 1),
  ('panda-sardine', 'panda', '沙丁鱼', 5, 5, 2),
  ('panda-salmon', 'panda', '鲑鱼', 10, 10, 3),
  ('bear-cookie', 'bear', '小饼干', 2, 2, 1),
  ('bear-honey', 'bear', '蜂蜜', 5, 5, 2),
  ('bear-cake', 'bear', '甜点盒', 10, 10, 3),
  ('frog-lettuce', 'frog', '生菜叶', 2, 2, 1),
  ('frog-fish', 'frog', '小鱼', 5, 5, 2),
  ('frog-seaweed', 'frog', '海藻拼盘', 10, 10, 3),
  ('milk-dragon-candy', 'milk_dragon', '奶糖', 2, 2, 1),
  ('milk-dragon-milk', 'milk_dragon', '鲜牛奶', 5, 5, 2),
  ('milk-dragon-cake', 'milk_dragon', '奶香蛋糕', 10, 10, 3)
on conflict (id) do update
set pet_type = excluded.pet_type,
    name = excluded.name,
    experience = excluded.experience,
    coin_cost = excluded.coin_cost,
    sort_order = excluded.sort_order;

alter table public.pet_foods enable row level security;

drop policy if exists "Signed-in users can read pet foods" on public.pet_foods;
create policy "Signed-in users can read pet foods"
on public.pet_foods
for select
to authenticated
using (true);

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
    'cat', 'dog', 'rabbit', 'hamster',
    'fox', 'panda', 'bear', 'frog'
  ]) then
    raise exception using errcode = '22023', message = 'invalid pet';
  end if;

  update public.students
  set pet = p_pet,
      pet_name = case when pet is distinct from p_pet then null else pet_name end
  where id = p_student_id
    and not is_admin
  returning * into saved_student;

  if not found then
    raise exception using errcode = '22023', message = 'student account not found';
  end if;

  return saved_student;
end;
$$;

create or replace function public.set_student_pet_resources(
  p_student_id uuid,
  p_experience bigint,
  p_coins bigint
)
returns table (student_id uuid, experience bigint, coins bigint)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  if p_experience is null or p_experience < 0
    or p_coins is null or p_coins < 0 then
    raise exception using errcode = '22023', message = 'experience and coins must be non-negative integers';
  end if;

  return query
  update public.students
  set pet_experience = p_experience,
      pet_coins = p_coins
  where id = p_student_id
    and pet is not null
  returning id, pet_experience, pet_coins;

  if not found then
    raise exception using errcode = '22023', message = 'pet owner not found';
  end if;
end;
$$;

create or replace function public.rename_my_pet(p_name text)
returns table (pet_name text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  cleaned_name text := btrim(p_name);
begin
  if auth.uid() is null then
    raise exception using errcode = '42501', message = 'authentication required';
  end if;

  if char_length(cleaned_name) not between 1 and 20 then
    raise exception using errcode = '22023', message = 'pet name must contain 1 to 20 characters';
  end if;

  return query
  update public.students
  set pet_name = cleaned_name
  where id = auth.uid()
    and pet is not null
  returning students.pet_name;

  if not found then
    raise exception using errcode = '22023', message = 'pet not found';
  end if;
end;
$$;

create or replace function public.check_in_pet()
returns table (
  experience bigint,
  streak integer,
  gained_experience integer,
  checkin_date date
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  owner public.students%rowtype;
  today_in_china date := timezone('Asia/Shanghai', now())::date;
  next_streak integer;
  gained integer;
begin
  select * into owner
  from public.students
  where id = auth.uid()
  for update;

  if not found or owner.pet is null then
    raise exception using errcode = '22023', message = 'pet not found';
  end if;

  if owner.pet_checkin_date = today_in_china then
    raise exception using errcode = 'P0001', message = 'pet already checked in today';
  end if;

  next_streak := case
    when owner.pet_checkin_date = today_in_china - 1 then owner.pet_checkin_streak + 1
    else 1
  end;
  gained := next_streak + 1;

  return query
  update public.students
  set pet_experience = pet_experience + gained,
      pet_checkin_date = today_in_china,
      pet_checkin_streak = next_streak
  where id = auth.uid()
  returning pet_experience, pet_checkin_streak, gained, pet_checkin_date;
end;
$$;

create or replace function public.feed_my_pet(p_food_id text)
returns table (experience bigint, coins bigint, gained_experience integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  owner public.students%rowtype;
  selected_food public.pet_foods%rowtype;
begin
  select * into owner
  from public.students
  where id = auth.uid()
  for update;

  if not found or owner.pet is null then
    raise exception using errcode = '22023', message = 'pet not found';
  end if;

  select * into selected_food
  from public.pet_foods
  where id = p_food_id
    and pet_type = owner.pet;

  if not found then
    raise exception using errcode = '22023', message = 'food is not available for this pet';
  end if;

  if owner.pet_coins < selected_food.coin_cost then
    raise exception using errcode = 'P0001', message = 'not enough coins';
  end if;

  return query
  update public.students
  set pet_experience = pet_experience + selected_food.experience,
      pet_coins = pet_coins - selected_food.coin_cost
  where id = auth.uid()
  returning pet_experience, pet_coins, selected_food.experience;
end;
$$;

revoke all privileges on table public.students from anon, authenticated;
grant select (
  id, username, is_admin, lesson_count, current_lesson_count,
  required_lesson_count, color, pet, pet_name, pet_experience,
  pet_coins, pet_checkin_date, pet_checkin_streak, created_at
) on table public.students to authenticated;

revoke all privileges on table public.pet_foods from anon, authenticated;
grant select (id, pet_type, name, experience, coin_cost, sort_order)
  on table public.pet_foods to authenticated;

revoke all on function public.set_student_pet(uuid, text) from public, anon, authenticated;
revoke all on function public.set_student_pet_resources(uuid, bigint, bigint) from public, anon, authenticated;
revoke all on function public.rename_my_pet(text) from public, anon, authenticated;
revoke all on function public.check_in_pet() from public, anon, authenticated;
revoke all on function public.feed_my_pet(text) from public, anon, authenticated;

grant execute on function public.set_student_pet(uuid, text) to authenticated;
grant execute on function public.set_student_pet_resources(uuid, bigint, bigint) to authenticated;
grant execute on function public.rename_my_pet(text) to authenticated;
grant execute on function public.check_in_pet() to authenticated;
grant execute on function public.feed_my_pet(text) to authenticated;

commit;
