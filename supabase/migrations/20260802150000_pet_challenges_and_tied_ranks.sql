begin;

-- Equal experience values share the same rank and the same weekly reward tier.
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
      rank() over (order by pet_experience desc)::integer as rank_position
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
      rank() over (order by student.pet_experience desc) as position,
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
  order by ranked.position, ranked.created_at, ranked.id;
end;
$$;

create table if not exists public.pet_challenge_questions (
  id text primary key,
  challenge_type text not null check (challenge_type in ('choice', 'word')),
  prompt text not null check (char_length(btrim(prompt)) between 1 and 300),
  options jsonb,
  correct_answer text not null check (char_length(btrim(correct_answer)) between 1 and 120),
  sort_order integer not null default 0,
  check (
    (challenge_type = 'choice' and options is not null and jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 4)
    or (challenge_type = 'word' and options is null)
  )
);

create table if not exists public.pet_challenge_attempts (
  id bigint generated always as identity primary key,
  student_id uuid not null references public.students(id) on delete cascade,
  question_id text not null references public.pet_challenge_questions(id) on delete restrict,
  challenge_type text not null check (challenge_type in ('choice', 'word')),
  challenge_date date not null default timezone('Asia/Shanghai', now())::date,
  prompt_snapshot text not null,
  submitted_answer text,
  is_correct boolean,
  reward_experience integer not null default 0 check (reward_experience between 0 and 10),
  started_at timestamptz not null default now(),
  answered_at timestamptz,
  duration_seconds integer,
  check (
    (answered_at is null and is_correct is null and submitted_answer is null and duration_seconds is null)
    or (answered_at is not null and is_correct is not null and submitted_answer is not null and duration_seconds is not null)
  )
);

create index if not exists pet_challenge_attempts_student_day_idx
  on public.pet_challenge_attempts (student_id, challenge_date, challenge_type, started_at desc);

create index if not exists pet_challenge_attempts_records_idx
  on public.pet_challenge_attempts (answered_at desc)
  where answered_at is not null;

create unique index if not exists pet_challenge_attempts_first_correct_idx
  on public.pet_challenge_attempts (student_id, question_id)
  where is_correct;

create table if not exists public.pet_challenge_daily_progress (
  student_id uuid not null references public.students(id) on delete cascade,
  challenge_date date not null,
  choice_correct_streak integer not null default 0 check (choice_correct_streak between 0 and 10),
  primary key (student_id, challenge_date)
);

-- Four days of non-repeating choice questions. Answers remain server-only.
with generated_questions as (
  select
    number,
    ((number - 1) % 20) + 1 as first_value,
    floor((number - 1) / 20)::integer + 1 as second_value
  from generate_series(1, 200) as number
)
insert into public.pet_challenge_questions (id, challenge_type, prompt, options, correct_answer, sort_order)
select
  'choice-math-' || number,
  'choice',
  format('%s + %s = ?', first_value, second_value),
  case number % 4
    when 0 then jsonb_build_array((first_value + second_value)::text, (first_value + second_value + 1)::text, (first_value + second_value + 2)::text, (first_value + second_value - 1)::text)
    when 1 then jsonb_build_array((first_value + second_value + 1)::text, (first_value + second_value)::text, (first_value + second_value - 1)::text, (first_value + second_value + 2)::text)
    when 2 then jsonb_build_array((first_value + second_value + 2)::text, (first_value + second_value - 1)::text, (first_value + second_value)::text, (first_value + second_value + 1)::text)
    else jsonb_build_array((first_value + second_value - 1)::text, (first_value + second_value + 2)::text, (first_value + second_value + 1)::text, (first_value + second_value)::text)
  end,
  (first_value + second_value)::text,
  number
from generated_questions
on conflict (id) do nothing;

with words(english, chinese, position) as (
  values
    ('apple', '苹果', 1), ('banana', '香蕉', 2), ('orange', '橙子', 3), ('grape', '葡萄', 4), ('watermelon', '西瓜', 5),
    ('cat', '猫', 6), ('dog', '狗', 7), ('rabbit', '兔子', 8), ('bird', '鸟', 9), ('fish', '鱼', 10),
    ('book', '书', 11), ('pen', '钢笔', 12), ('pencil', '铅笔', 13), ('school', '学校', 14), ('teacher', '老师', 15),
    ('student', '学生', 16), ('classroom', '教室', 17), ('homework', '作业', 18), ('lesson', '课程', 19), ('question', '问题', 20),
    ('sun', '太阳', 21), ('moon', '月亮', 22), ('star', '星星', 23), ('sky', '天空', 24), ('cloud', '云', 25),
    ('red', '红色', 26), ('blue', '蓝色', 27), ('green', '绿色', 28), ('yellow', '黄色', 29), ('white', '白色', 30),
    ('one', '一', 31), ('two', '二', 32), ('three', '三', 33), ('four', '四', 34), ('five', '五', 35),
    ('morning', '早晨', 36), ('afternoon', '下午', 37), ('evening', '傍晚', 38), ('today', '今天', 39), ('tomorrow', '明天', 40),
    ('happy', '开心', 41), ('kind', '善良', 42), ('brave', '勇敢', 43), ('small', '小的', 44), ('big', '大的', 45),
    ('eat', '吃', 46), ('drink', '喝', 47), ('read', '阅读', 48), ('write', '书写', 49), ('play', '玩耍', 50)
), seeded_questions as (
  select
    'word-cn-' || position as id,
    'word'::text as challenge_type,
    format('“%s”的英文是？', chinese) as prompt,
    english as correct_answer,
    position * 2 - 1 as sort_order
  from words
  union all
  select
    'word-en-' || position,
    'word'::text,
    format('“%s”的中文是？', english),
    chinese,
    position * 2
  from words
)
insert into public.pet_challenge_questions (id, challenge_type, prompt, options, correct_answer, sort_order)
select id, challenge_type, prompt, null, correct_answer, sort_order
from seeded_questions
on conflict (id) do nothing;

alter table public.pet_challenge_questions enable row level security;
alter table public.pet_challenge_attempts enable row level security;
alter table public.pet_challenge_daily_progress enable row level security;

create or replace function public.get_my_challenge_summary()
returns table (
  choice_attempts integer,
  word_attempts integer,
  choice_streak integer,
  choice_remaining integer,
  word_remaining integer
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  today_in_china date := timezone('Asia/Shanghai', now())::date;
  used_choice integer;
  used_word integer;
  current_streak integer;
begin
  if auth.uid() is null then
    raise exception using errcode = '42501', message = 'authentication required';
  end if;

  select
    count(*) filter (where challenge_type = 'choice')::integer,
    count(*) filter (where challenge_type = 'word')::integer
  into used_choice, used_word
  from public.pet_challenge_attempts
  where student_id = auth.uid()
    and challenge_date = today_in_china;

  select choice_correct_streak into current_streak
  from public.pet_challenge_daily_progress
  where student_id = auth.uid()
    and challenge_date = today_in_china;

  return query select
    coalesce(used_choice, 0),
    coalesce(used_word, 0),
    coalesce(current_streak, 0),
    greatest(0, 50 - coalesce(used_choice, 0)),
    greatest(0, 50 - coalesce(used_word, 0));
end;
$$;

create or replace function public.get_next_pet_challenge_question(p_challenge_type text)
returns table (
  attempt_id bigint,
  challenge_type text,
  prompt text,
  options jsonb,
  attempts_used integer,
  attempts_remaining integer,
  choice_streak integer
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  owner public.students%rowtype;
  today_in_china date := timezone('Asia/Shanghai', now())::date;
  used_attempts integer;
  active_attempt public.pet_challenge_attempts%rowtype;
  next_question public.pet_challenge_questions%rowtype;
  current_streak integer;
begin
  if auth.uid() is null then
    raise exception using errcode = '42501', message = 'authentication required';
  end if;

  if p_challenge_type not in ('choice', 'word') then
    raise exception using errcode = '22023', message = 'invalid challenge type';
  end if;

  select * into owner
  from public.students
  where id = auth.uid()
  for update;

  if not found or owner.is_admin or owner.pet is null then
    raise exception using errcode = '22023', message = 'student pet required';
  end if;

  select * into active_attempt
  from public.pet_challenge_attempts
  where student_id = owner.id
    and challenge_date = today_in_china
    and challenge_type = p_challenge_type
    and answered_at is null
  order by started_at desc
  limit 1
  for update;

  select choice_correct_streak into current_streak
  from public.pet_challenge_daily_progress
  where student_id = owner.id
    and challenge_date = today_in_china;

  if active_attempt.id is not null then
    return query
    select
      active_attempt.id,
      question.challenge_type,
      question.prompt,
      question.options,
      (select count(*)::integer from public.pet_challenge_attempts where student_id = owner.id and challenge_date = today_in_china and challenge_type = p_challenge_type),
      greatest(0, 50 - (select count(*)::integer from public.pet_challenge_attempts where student_id = owner.id and challenge_date = today_in_china and challenge_type = p_challenge_type)),
      coalesce(current_streak, 0)
    from public.pet_challenge_questions question
    where question.id = active_attempt.question_id;
    return;
  end if;

  select count(*)::integer into used_attempts
  from public.pet_challenge_attempts
  where student_id = owner.id
    and challenge_date = today_in_china
    and challenge_type = p_challenge_type;

  if used_attempts >= 50 then
    raise exception using errcode = 'P0001', message = 'daily challenge limit reached';
  end if;

  select * into next_question
  from public.pet_challenge_questions question
  where question.challenge_type = p_challenge_type
    and not exists (
      select 1
      from public.pet_challenge_attempts attempt
      where attempt.student_id = owner.id
        and attempt.question_id = question.id
        and attempt.is_correct
    )
  order by random()
  limit 1;

  if not found then
    raise exception using errcode = 'P0001', message = 'challenge questions completed';
  end if;

  insert into public.pet_challenge_attempts (
    student_id,
    question_id,
    challenge_type,
    challenge_date,
    prompt_snapshot
  ) values (
    owner.id,
    next_question.id,
    next_question.challenge_type,
    today_in_china,
    next_question.prompt
  ) returning * into active_attempt;

  return query select
    active_attempt.id,
    next_question.challenge_type,
    next_question.prompt,
    next_question.options,
    used_attempts + 1,
    49 - used_attempts,
    coalesce(current_streak, 0);
end;
$$;

create or replace function public.answer_pet_challenge_question(
  p_attempt_id bigint,
  p_answer text
)
returns table (
  is_correct boolean,
  gained_experience integer,
  choice_streak integer,
  total_experience bigint,
  duration_seconds integer,
  attempts_used integer,
  attempts_remaining integer
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  owner public.students%rowtype;
  attempt public.pet_challenge_attempts%rowtype;
  question public.pet_challenge_questions%rowtype;
  today_in_china date := timezone('Asia/Shanghai', now())::date;
  cleaned_answer text := lower(btrim(coalesce(p_answer, '')));
  is_answer_correct boolean;
  has_previous_correct boolean;
  awarded_experience integer := 0;
  next_streak integer := 0;
  answer_duration integer;
  used_attempts integer;
  updated_experience bigint;
begin
  if auth.uid() is null then
    raise exception using errcode = '42501', message = 'authentication required';
  end if;

  if p_attempt_id is null or cleaned_answer = '' then
    raise exception using errcode = '22023', message = 'answer is required';
  end if;

  select * into owner
  from public.students
  where id = auth.uid()
  for update;

  if not found or owner.is_admin or owner.pet is null then
    raise exception using errcode = '22023', message = 'student pet required';
  end if;

  select * into attempt
  from public.pet_challenge_attempts
  where id = p_attempt_id
    and student_id = owner.id
  for update;

  if not found or attempt.answered_at is not null then
    raise exception using errcode = '22023', message = 'challenge attempt is unavailable';
  end if;

  select * into question
  from public.pet_challenge_questions
  where id = attempt.question_id;

  if not found then
    raise exception using errcode = '22023', message = 'challenge question is unavailable';
  end if;

  perform pg_advisory_xact_lock(hashtext(owner.id::text || ':' || question.id));

  select exists (
    select 1
    from public.pet_challenge_attempts prior_attempt
    where prior_attempt.student_id = owner.id
      and prior_attempt.question_id = question.id
      and prior_attempt.is_correct
  ) into has_previous_correct;

  is_answer_correct := cleaned_answer = lower(btrim(question.correct_answer));
  answer_duration := greatest(0, floor(extract(epoch from now() - attempt.started_at))::integer);

  insert into public.pet_challenge_daily_progress (student_id, challenge_date)
  values (owner.id, attempt.challenge_date)
  on conflict (student_id, challenge_date) do nothing;

  select choice_correct_streak into next_streak
  from public.pet_challenge_daily_progress
  where student_id = owner.id
    and challenge_date = attempt.challenge_date
  for update;

  if is_answer_correct and not has_previous_correct then
    if attempt.challenge_type = 'choice' then
      next_streak := least(10, next_streak + 1);
      awarded_experience := next_streak;
      update public.pet_challenge_daily_progress
      set choice_correct_streak = next_streak
      where student_id = owner.id
        and challenge_date = attempt.challenge_date;
    else
      awarded_experience := 1;
    end if;
  elsif attempt.challenge_type = 'choice' then
    next_streak := 0;
    update public.pet_challenge_daily_progress
    set choice_correct_streak = 0
    where student_id = owner.id
      and challenge_date = attempt.challenge_date;
  end if;

  update public.pet_challenge_attempts
  set submitted_answer = left(btrim(p_answer), 120),
      is_correct = is_answer_correct,
      reward_experience = awarded_experience,
      answered_at = now(),
      duration_seconds = answer_duration
  where id = attempt.id;

  update public.students
  set pet_experience = pet_experience + awarded_experience
  where id = owner.id
  returning pet_experience into updated_experience;

  select count(*)::integer into used_attempts
  from public.pet_challenge_attempts
  where student_id = owner.id
    and challenge_date = today_in_china
    and challenge_type = attempt.challenge_type;

  return query select
    is_answer_correct,
    awarded_experience,
    case when attempt.challenge_type = 'choice' and attempt.challenge_date = today_in_china then next_streak else 0 end,
    updated_experience,
    answer_duration,
    used_attempts,
    greatest(0, 50 - used_attempts);
end;
$$;

create or replace function public.get_admin_pet_challenge_records(p_limit integer default 500)
returns table (
  attempt_id bigint,
  student_id uuid,
  student_username text,
  pet_type text,
  pet_name text,
  challenge_type text,
  question_prompt text,
  submitted_answer text,
  is_correct boolean,
  reward_experience integer,
  duration_seconds integer,
  started_at timestamptz,
  answered_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  return query
  select
    attempt.id,
    owner.id,
    owner.username,
    owner.pet,
    coalesce(nullif(btrim(owner.pet_name), ''), owner.pet),
    attempt.challenge_type,
    attempt.prompt_snapshot,
    attempt.submitted_answer,
    attempt.is_correct,
    attempt.reward_experience,
    attempt.duration_seconds,
    attempt.started_at,
    attempt.answered_at
  from public.pet_challenge_attempts attempt
  join public.students owner on owner.id = attempt.student_id
  where attempt.answered_at is not null
  order by attempt.answered_at desc
  limit least(greatest(coalesce(p_limit, 500), 1), 1000);
end;
$$;

revoke all privileges on table public.pet_challenge_questions from public, anon, authenticated;
revoke all privileges on table public.pet_challenge_attempts from public, anon, authenticated;
revoke all privileges on table public.pet_challenge_daily_progress from public, anon, authenticated;

revoke all on function public.get_my_challenge_summary() from public, anon, authenticated;
revoke all on function public.get_next_pet_challenge_question(text) from public, anon, authenticated;
revoke all on function public.answer_pet_challenge_question(bigint, text) from public, anon, authenticated;
revoke all on function public.get_admin_pet_challenge_records(integer) from public, anon, authenticated;
revoke all on function public.settle_pet_weekly_ranking() from public, anon, authenticated;
revoke all on function public.get_pet_leaderboard() from public, anon, authenticated;

grant execute on function public.get_my_challenge_summary() to authenticated;
grant execute on function public.get_next_pet_challenge_question(text) to authenticated;
grant execute on function public.answer_pet_challenge_question(bigint, text) to authenticated;
grant execute on function public.get_admin_pet_challenge_records(integer) to authenticated;
grant execute on function public.get_pet_leaderboard() to authenticated;

notify pgrst, 'reload schema';

commit;
