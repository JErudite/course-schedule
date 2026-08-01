begin;

alter table public.courses
  add column if not exists repeat_count integer,
  add column if not exists color text;

update public.courses
set repeat_count = 1
where repeat_interval_days is null
  and repeat_count is null;

alter table public.courses
  drop constraint if exists courses_repeat_count_check,
  add constraint courses_repeat_count_check check (
    (repeat_interval_days is null and repeat_count = 1)
    or (repeat_interval_days is not null and (repeat_count is null or repeat_count between 1 and 10000))
  ),
  drop constraint if exists courses_color_check,
  add constraint courses_color_check check (
    color is null or lower(color) = any (array[
      '#ffffff', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#00a6a6', '#4caf50', '#8bc34a',
      '#ffc107', '#ff9800', '#795548', '#607d8b'
    ])
  );

alter table public.students
  add column if not exists current_lesson_count integer not null default 0,
  add column if not exists required_lesson_count integer not null default 0,
  add column if not exists color text;

alter table public.students
  drop constraint if exists students_current_lesson_count_check,
  add constraint students_current_lesson_count_check
    check (current_lesson_count between 0 and 100000),
  drop constraint if exists students_required_lesson_count_check,
  add constraint students_required_lesson_count_check
    check (required_lesson_count between 0 and 100000),
  drop constraint if exists students_color_check,
  add constraint students_color_check check (
    color is null or lower(color) = any (array[
      '#ffffff', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#00a6a6', '#4caf50', '#8bc34a',
      '#ffc107', '#ff9800', '#795548', '#607d8b'
    ])
  );

create or replace function public.course_series_share_date(
  p_first_start date,
  p_first_interval smallint,
  p_first_count integer,
  p_second_start date,
  p_second_interval smallint,
  p_second_count integer
)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  occurrence_date date;
  occurrence_index integer;
begin
  if p_first_interval is null then
    if p_first_start < p_second_start then
      return false;
    end if;
    if p_second_interval is null then
      return p_first_start = p_second_start;
    end if;
    if (p_first_start - p_second_start) % p_second_interval <> 0 then
      return false;
    end if;
    return p_second_count is null
      or (p_first_start - p_second_start) / p_second_interval < p_second_count;
  end if;

  if p_second_interval is null then
    return public.course_series_share_date(
      p_second_start, p_second_interval, p_second_count,
      p_first_start, p_first_interval, p_first_count
    );
  end if;

  if p_first_count is null and p_second_count is null then
    return (p_first_start - p_second_start)
      % gcd(p_first_interval::integer, p_second_interval::integer) = 0;
  end if;

  if p_first_count is not null
    and (p_second_count is null or p_first_count <= p_second_count) then
    for occurrence_index in 0..p_first_count - 1 loop
      occurrence_date := p_first_start + occurrence_index * p_first_interval;
      if occurrence_date >= p_second_start
        and (occurrence_date - p_second_start) % p_second_interval = 0
        and (p_second_count is null
          or (occurrence_date - p_second_start) / p_second_interval < p_second_count) then
        return true;
      end if;
    end loop;
    return false;
  end if;

  for occurrence_index in 0..p_second_count - 1 loop
    occurrence_date := p_second_start + occurrence_index * p_second_interval;
    if occurrence_date >= p_first_start
      and (occurrence_date - p_first_start) % p_first_interval = 0
      and (p_first_count is null
        or (occurrence_date - p_first_start) / p_first_interval < p_first_count) then
      return true;
    end if;
  end loop;
  return false;
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
    and public.course_series_share_date(
      new.start_date, new.repeat_interval_days, new.repeat_count,
      course.start_date, course.repeat_interval_days, course.repeat_count
    )
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

drop trigger if exists courses_prevent_series_conflicts on public.courses;
create trigger courses_prevent_series_conflicts
before insert or update of start_date, repeat_interval_days, repeat_count, start_time, duration
on public.courses
for each row
execute function public.prevent_course_series_conflicts();

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
    and public.course_series_share_date(
      selected_course.start_date,
      selected_course.repeat_interval_days,
      selected_course.repeat_count,
      course.start_date,
      course.repeat_interval_days,
      course.repeat_count
    )
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

drop function if exists public.save_course(
  text, date, smallint, smallint, smallint, text, text, uuid[], bigint
);

create or replace function public.save_course(
  p_id text,
  p_start_date date,
  p_repeat_interval_days smallint,
  p_repeat_count integer,
  p_start_time smallint,
  p_duration smallint,
  p_name text,
  p_notes text,
  p_color text,
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
      id, start_date, repeat_interval_days, repeat_count,
      start_time, duration, name, notes, color
    ) values (
      p_id, p_start_date, p_repeat_interval_days, p_repeat_count,
      p_start_time, p_duration, p_name, p_notes, lower(p_color)
    )
    returning * into saved_course;
  else
    delete from public.course_students where course_id = p_id;

    update public.courses
    set start_date = p_start_date,
        repeat_interval_days = p_repeat_interval_days,
        repeat_count = p_repeat_count,
        start_time = p_start_time,
        duration = p_duration,
        name = p_name,
        notes = p_notes,
        color = lower(p_color)
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

drop function if exists public.set_student_lesson_count(uuid, integer);

create or replace function public.set_student_learning_profile(
  p_student_id uuid,
  p_current_count integer,
  p_required_count integer,
  p_lifetime_count integer,
  p_color text
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

  if p_current_count is null or p_current_count not between 0 and 100000
    or p_required_count is null or p_required_count not between 0 and 100000
    or p_lifetime_count is null or p_lifetime_count not between 0 and 100000 then
    raise exception using errcode = '22023', message = 'lesson counts must be between 0 and 100000';
  end if;

  update public.students
  set current_lesson_count = p_current_count,
      required_lesson_count = p_required_count,
      lesson_count = p_lifetime_count,
      color = lower(p_color)
  where id = p_student_id
    and not is_admin
  returning * into saved_student;

  if not found then
    raise exception using errcode = '22023', message = 'student account not found';
  end if;

  return saved_student;
end;
$$;

revoke all privileges on table public.courses from anon, authenticated;
revoke all privileges on table public.students from anon, authenticated;
revoke all privileges on table public.course_students from anon, authenticated;

grant select on table public.courses to authenticated;
grant select (
  id, username, is_admin, lesson_count, current_lesson_count,
  required_lesson_count, color, created_at
) on table public.students to authenticated;
grant select (course_id, student_id, created_at)
  on table public.course_students to authenticated;

revoke all on function public.course_series_share_date(date, smallint, integer, date, smallint, integer)
  from public, anon, authenticated;
revoke all on function public.prevent_course_series_conflicts()
  from public, anon, authenticated;
revoke all on function public.prevent_student_course_conflicts()
  from public, anon, authenticated;
revoke all on function public.save_course(
  text, date, smallint, integer, smallint, smallint, text, text, text, uuid[], bigint
) from public;
revoke all on function public.set_student_learning_profile(uuid, integer, integer, integer, text)
  from public;

grant execute on function public.save_course(
  text, date, smallint, integer, smallint, smallint, text, text, text, uuid[], bigint
) to authenticated;
grant execute on function public.set_student_learning_profile(uuid, integer, integer, integer, text)
  to authenticated;

commit;
