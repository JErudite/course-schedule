begin;

create table if not exists public.students (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  login_email text not null unique,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  constraint students_username_check check (char_length(btrim(username)) between 1 and 40)
);

create unique index if not exists students_username_lower_key
  on public.students (lower(btrim(username)));

create table if not exists public.course_students (
  course_id text not null references public.courses(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (course_id, student_id)
);

create index if not exists course_students_student_id_idx
  on public.course_students (student_id, course_id);

update auth.users
set encrypted_password = extensions.crypt('88888888', extensions.gen_salt('bf')),
    updated_at = now()
where lower(email) = lower('703223232@qq.com');

insert into public.students (id, username, login_email, is_admin)
select id, '管理员', email, true
from auth.users
where lower(email) = lower('703223232@qq.com')
on conflict (id) do update
set username = excluded.username,
    login_email = excluded.login_email,
    is_admin = true;

create or replace function public.is_admin_account()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.students
    where id = auth.uid()
      and is_admin
  );
$$;

create or replace function public.can_edit_courses()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.is_admin_account();
$$;

create or replace function public.can_access_course(p_course_id text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.is_admin_account()
    or exists (
      select 1
      from public.course_students
      where course_id = p_course_id
        and student_id = auth.uid()
    );
$$;

create or replace function public.resolve_login_email(p_username text)
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select login_email
  from public.students
  where lower(btrim(username)) = lower(btrim(p_username))
  limit 1;
$$;

create or replace function public.create_student_account(p_username text)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions, pg_temp
as $$
declare
  cleaned_username text := btrim(p_username);
  new_user_id uuid := gen_random_uuid();
  generated_email text;
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  if char_length(cleaned_username) not between 1 and 40 then
    raise exception using errcode = '22023', message = 'username must contain 1 to 40 characters';
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
    extensions.crypt('88888888', extensions.gen_salt('bf')),
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

create or replace function public.delete_student_account(p_student_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  if exists (
    select 1 from public.students
    where id = p_student_id
      and is_admin
  ) then
    raise exception using errcode = '42501', message = 'administrator account cannot be deleted';
  end if;

  delete from auth.users where id = p_student_id;
end;
$$;

create or replace function public.prevent_course_series_conflicts()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  conflicting_course text;
begin
  select course.id
  into conflicting_course
  from public.courses as course
  where course.id <> new.id
    and new.start_time < course.start_time + course.duration
    and new.start_time + new.duration > course.start_time
    and case
      when new.repeat_interval_days is null and course.repeat_interval_days is null then
        new.start_date = course.start_date
      when new.repeat_interval_days is null then
        new.start_date >= course.start_date
        and (new.start_date - course.start_date) % course.repeat_interval_days = 0
      when course.repeat_interval_days is null then
        course.start_date >= new.start_date
        and (course.start_date - new.start_date) % new.repeat_interval_days = 0
      else
        (new.start_date - course.start_date)
          % gcd(new.repeat_interval_days::integer, course.repeat_interval_days::integer) = 0
    end
    and exists (
      select 1
      from public.course_students as current_assignment
      join public.course_students as other_assignment
        on other_assignment.student_id = current_assignment.student_id
      where current_assignment.course_id = new.id
        and other_assignment.course_id = course.id
    )
  limit 1;

  if conflicting_course is not null then
    raise exception using
      errcode = '23P01',
      message = 'course series conflicts for an assigned student',
      detail = format('Conflicting course id: %s', conflicting_course);
  end if;

  return new;
end;
$$;

create or replace function public.prevent_student_course_conflicts()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  selected_course public.courses%rowtype;
  conflicting_course text;
begin
  select * into selected_course
  from public.courses
  where id = new.course_id;

  select course.id
  into conflicting_course
  from public.courses as course
  join public.course_students as assignment
    on assignment.course_id = course.id
   and assignment.student_id = new.student_id
  where course.id <> selected_course.id
    and selected_course.start_time < course.start_time + course.duration
    and selected_course.start_time + selected_course.duration > course.start_time
    and case
      when selected_course.repeat_interval_days is null and course.repeat_interval_days is null then
        selected_course.start_date = course.start_date
      when selected_course.repeat_interval_days is null then
        selected_course.start_date >= course.start_date
        and (selected_course.start_date - course.start_date) % course.repeat_interval_days = 0
      when course.repeat_interval_days is null then
        course.start_date >= selected_course.start_date
        and (course.start_date - selected_course.start_date) % selected_course.repeat_interval_days = 0
      else
        (selected_course.start_date - course.start_date)
          % gcd(selected_course.repeat_interval_days::integer, course.repeat_interval_days::integer) = 0
    end
  limit 1;

  if conflicting_course is not null then
    raise exception using
      errcode = '23P01',
      message = 'student already has a conflicting course',
      detail = format('Conflicting course id: %s', conflicting_course);
  end if;

  return new;
end;
$$;

drop trigger if exists course_students_prevent_conflicts on public.course_students;
create trigger course_students_prevent_conflicts
before insert or update of course_id, student_id
on public.course_students
for each row
execute function public.prevent_student_course_conflicts();

create or replace function public.save_course(
  p_id text,
  p_start_date date,
  p_repeat_interval_days smallint,
  p_start_time smallint,
  p_duration smallint,
  p_name text,
  p_teacher text,
  p_notes text,
  p_student_ids uuid[],
  p_expected_version bigint default null
)
returns public.courses
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  saved_course public.courses%rowtype;
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  if exists (
    select 1
    from unnest(coalesce(p_student_ids, array[]::uuid[])) as requested(student_id)
    left join public.students on students.id = requested.student_id
    where students.id is null or students.is_admin
  ) then
    raise exception using errcode = '22023', message = 'invalid student assignment';
  end if;

  if p_expected_version is null then
    insert into public.courses (
      id, start_date, repeat_interval_days, start_time, duration, name, teacher, notes
    ) values (
      p_id, p_start_date, p_repeat_interval_days, p_start_time, p_duration, p_name, p_teacher, p_notes
    )
    returning * into saved_course;
  else
    delete from public.course_students where course_id = p_id;

    update public.courses
    set start_date = p_start_date,
        repeat_interval_days = p_repeat_interval_days,
        start_time = p_start_time,
        duration = p_duration,
        name = p_name,
        teacher = p_teacher,
        notes = p_notes
    where id = p_id
      and version = p_expected_version
    returning * into saved_course;

    if not found then
      raise exception using errcode = 'P0001', message = 'stale course version';
    end if;
  end if;

  insert into public.course_students (course_id, student_id)
  select p_id, requested.student_id
  from (
    select distinct student_id
    from unnest(coalesce(p_student_ids, array[]::uuid[])) as item(student_id)
  ) as requested;

  return saved_course;
end;
$$;

alter table public.students enable row level security;
alter table public.course_students enable row level security;

drop policy if exists "Public can read courses" on public.courses;
drop policy if exists "Owner can update courses" on public.courses;
drop policy if exists "Owner can insert courses" on public.courses;
drop policy if exists "Owner can delete courses" on public.courses;
drop policy if exists "Signed-in users can read assigned courses" on public.courses;
drop policy if exists "Administrator can insert courses" on public.courses;
drop policy if exists "Administrator can update courses" on public.courses;
drop policy if exists "Administrator can delete courses" on public.courses;

create policy "Signed-in users can read assigned courses"
on public.courses
for select
to authenticated
using (public.can_access_course(id));

create policy "Administrator can insert courses"
on public.courses
for insert
to authenticated
with check (public.is_admin_account());

create policy "Administrator can update courses"
on public.courses
for update
to authenticated
using (public.is_admin_account())
with check (public.is_admin_account());

create policy "Administrator can delete courses"
on public.courses
for delete
to authenticated
using (public.is_admin_account());

drop policy if exists "Users can read their profile and administrators can read all" on public.students;
create policy "Users can read their profile and administrators can read all"
on public.students
for select
to authenticated
using (id = auth.uid() or public.is_admin_account());

drop policy if exists "Users can read their assignments and administrators can read all" on public.course_students;
drop policy if exists "Administrator can insert assignments" on public.course_students;
drop policy if exists "Administrator can delete assignments" on public.course_students;

create policy "Users can read their assignments and administrators can read all"
on public.course_students
for select
to authenticated
using (student_id = auth.uid() or public.is_admin_account());

create policy "Administrator can insert assignments"
on public.course_students
for insert
to authenticated
with check (public.is_admin_account());

create policy "Administrator can delete assignments"
on public.course_students
for delete
to authenticated
using (public.is_admin_account());

revoke all on table public.courses from anon;
revoke all on table public.students from anon;
revoke all on table public.course_students from anon;

grant select, insert, update, delete on table public.courses to authenticated;
grant select on table public.students to authenticated;
grant select, insert, delete on table public.course_students to authenticated;

revoke all on function public.is_admin_account() from public;
revoke all on function public.can_edit_courses() from public;
revoke all on function public.can_access_course(text) from public;
revoke all on function public.resolve_login_email(text) from public;
revoke all on function public.create_student_account(text) from public;
revoke all on function public.delete_student_account(uuid) from public;
revoke all on function public.save_course(text, date, smallint, smallint, smallint, text, text, text, uuid[], bigint) from public;

grant execute on function public.is_admin_account() to authenticated;
grant execute on function public.can_edit_courses() to authenticated;
grant execute on function public.can_access_course(text) to authenticated;
grant execute on function public.resolve_login_email(text) to anon, authenticated;
grant execute on function public.create_student_account(text) to authenticated;
grant execute on function public.delete_student_account(uuid) to authenticated;
grant execute on function public.save_course(text, date, smallint, smallint, smallint, text, text, text, uuid[], bigint) to authenticated;

alter table public.course_students replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.course_students;
exception
  when duplicate_object then null;
end;
$$;

commit;
