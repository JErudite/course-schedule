begin;

update public.students
set username = '曾老师'
where is_admin;

update auth.users as account
set encrypted_password = extensions.crypt('88888888', extensions.gen_salt('bf')),
    raw_user_meta_data = coalesce(account.raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('username', '曾老师'),
    updated_at = now()
where exists (
  select 1
  from public.students profile
  where profile.id = account.id
    and profile.is_admin
);

with student_passwords(username, login_password) as (
  values
    ('陈奕舟', 'CYZ'),
    ('刘云川', 'LYC'),
    ('叶凌菲', 'YLF'),
    ('李桓宇', 'LHY'),
    ('晏墨汐', 'YMX'),
    ('张歆晨', 'ZXC'),
    ('杨依卓', 'YYZ'),
    ('晏墨菲', 'YMF')
)
update auth.users as account
set encrypted_password = extensions.crypt(credentials.login_password, extensions.gen_salt('bf')),
    updated_at = now()
from public.students profile
join student_passwords credentials
  on credentials.username = profile.username
where account.id = profile.id
  and not profile.is_admin;

drop function if exists public.create_student_account(text);

create function public.create_student_account(p_username text, p_password text)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions, pg_temp
as $$
declare
  cleaned_username text := btrim(p_username);
  cleaned_password text := upper(btrim(p_password));
  new_user_id uuid := gen_random_uuid();
  generated_email text;
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  if char_length(cleaned_username) not between 1 and 40 then
    raise exception using errcode = '22023', message = 'username must contain 1 to 40 characters';
  end if;

  if cleaned_password !~ '^[A-Z]{1,12}$' then
    raise exception using errcode = '22023', message = 'password must contain 1 to 12 uppercase letters';
  end if;

  if exists (
    select 1 from public.students
    where lower(btrim(username)) = lower(cleaned_username)
  ) then
    raise exception using errcode = '23505', message = 'username already exists';
  end if;

  generated_email := 'student-' || replace(new_user_id::text, '-', '') || '@course.local';

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    email_change_token_current,
    email_change_confirm_status,
    reauthentication_token,
    is_sso_user,
    is_anonymous
  ) values (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    generated_email,
    extensions.crypt(cleaned_password, extensions.gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object(
      'sub', new_user_id::text,
      'email', generated_email,
      'username', cleaned_username,
      'email_verified', true,
      'phone_verified', false
    ),
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    0,
    '',
    false,
    false
  );

  insert into auth.identities (
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    new_user_id::text,
    new_user_id,
    jsonb_build_object(
      'sub', new_user_id::text,
      'email', generated_email,
      'username', cleaned_username,
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    now(),
    now(),
    now()
  );

  insert into public.students (id, username, login_email, is_admin)
  values (new_user_id, cleaned_username, generated_email, false);

  return new_user_id;
end;
$$;

revoke all on function public.create_student_account(text, text) from public, anon, authenticated;
grant execute on function public.create_student_account(text, text) to authenticated;

alter table public.pet_challenge_questions
  add column if not exists is_active boolean not null default true,
  add column if not exists source_name text not null default '系统题库',
  add column if not exists created_at timestamptz not null default now();

alter table public.pet_challenge_questions
  drop constraint if exists pet_challenge_questions_source_name_check;

alter table public.pet_challenge_questions
  add constraint pet_challenge_questions_source_name_check
  check (char_length(btrim(source_name)) between 1 and 160);

create or replace function public.import_pet_challenge_questions(
  p_questions jsonb,
  p_source_name text default 'Word 导入'
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  item jsonb;
  question_type text;
  question_prompt text;
  question_options jsonb;
  question_answer text;
  cleaned_source_name text := left(coalesce(nullif(btrim(p_source_name), ''), 'Word 导入'), 160);
  next_sort_order integer;
  inserted_count integer := 0;
  skipped_count integer := 0;
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  if p_questions is null or jsonb_typeof(p_questions) <> 'array'
    or jsonb_array_length(p_questions) not between 1 and 500 then
    raise exception using errcode = '22023', message = 'question import must contain 1 to 500 items';
  end if;

  select coalesce(max(sort_order), 0) into next_sort_order
  from public.pet_challenge_questions;

  for item in select value from jsonb_array_elements(p_questions)
  loop
    question_type := lower(btrim(coalesce(item->>'challenge_type', '')));
    question_prompt := left(btrim(coalesce(item->>'prompt', '')), 300);
    question_answer := left(btrim(coalesce(item->>'correct_answer', '')), 120);
    question_options := case when question_type = 'choice' then item->'options' else null end;

    if question_type not in ('choice', 'word')
      or question_prompt = ''
      or question_answer = '' then
      raise exception using errcode = '22023', message = 'question type, prompt and answer are required';
    end if;

    if question_type = 'choice' then
      if question_options is null
        or jsonb_typeof(question_options) <> 'array'
        or jsonb_array_length(question_options) <> 4
        or exists (
          select 1
          from jsonb_array_elements_text(question_options) option_value
          where btrim(option_value) = '' or char_length(btrim(option_value)) > 120
        )
        or not exists (
          select 1
          from jsonb_array_elements_text(question_options) option_value
          where lower(btrim(option_value)) = lower(question_answer)
        ) then
        raise exception using errcode = '22023', message = 'choice questions require four options and a matching answer';
      end if;
    else
      question_options := null;
    end if;

    if exists (
      select 1
      from public.pet_challenge_questions existing
      where existing.challenge_type = question_type
        and lower(btrim(existing.prompt)) = lower(question_prompt)
        and lower(btrim(existing.correct_answer)) = lower(question_answer)
        and coalesce(existing.options, 'null'::jsonb) = coalesce(question_options, 'null'::jsonb)
    ) then
      skipped_count := skipped_count + 1;
      continue;
    end if;

    next_sort_order := next_sort_order + 1;
    insert into public.pet_challenge_questions (
      id,
      challenge_type,
      prompt,
      options,
      correct_answer,
      sort_order,
      is_active,
      source_name
    ) values (
      'custom-' || replace(gen_random_uuid()::text, '-', ''),
      question_type,
      question_prompt,
      question_options,
      question_answer,
      next_sort_order,
      true,
      cleaned_source_name
    );
    inserted_count := inserted_count + 1;
  end loop;

  return jsonb_build_object('inserted', inserted_count, 'skipped', skipped_count);
end;
$$;

create or replace function public.get_admin_pet_challenge_question_bank()
returns table (
  question_id text,
  challenge_type text,
  prompt text,
  options jsonb,
  correct_answer text,
  sort_order integer,
  is_active boolean,
  source_name text,
  created_at timestamptz
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
    question.id,
    question.challenge_type,
    question.prompt,
    question.options,
    question.correct_answer,
    question.sort_order,
    question.is_active,
    question.source_name,
    question.created_at
  from public.pet_challenge_questions question
  order by question.created_at desc, question.sort_order desc;
end;
$$;

create or replace function public.set_pet_challenge_question_active(
  p_question_id text,
  p_is_active boolean
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  update public.pet_challenge_questions
  set is_active = coalesce(p_is_active, true)
  where id = p_question_id;

  return found;
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
    and question.is_active
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

revoke all on function public.import_pet_challenge_questions(jsonb, text) from public, anon, authenticated;
revoke all on function public.get_admin_pet_challenge_question_bank() from public, anon, authenticated;
revoke all on function public.set_pet_challenge_question_active(text, boolean) from public, anon, authenticated;
revoke all on function public.get_next_pet_challenge_question(text) from public, anon, authenticated;

grant execute on function public.import_pet_challenge_questions(jsonb, text) to authenticated;
grant execute on function public.get_admin_pet_challenge_question_bank() to authenticated;
grant execute on function public.set_pet_challenge_question_active(text, boolean) to authenticated;
grant execute on function public.get_next_pet_challenge_question(text) to authenticated;

notify pgrst, 'reload schema';

commit;
