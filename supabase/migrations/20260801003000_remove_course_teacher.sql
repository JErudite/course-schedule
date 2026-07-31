begin;

drop function if exists public.save_course(
  text, date, smallint, smallint, smallint, text, text, text, uuid[], bigint
);

alter table public.courses
  drop constraint if exists courses_teacher_check,
  drop column if exists teacher;

do $$
declare
  duration_constraint record;
begin
  for duration_constraint in
    select constraint_name.conname
    from pg_constraint as constraint_name
    where constraint_name.conrelid = 'public.courses'::regclass
      and constraint_name.contype = 'c'
      and pg_get_constraintdef(constraint_name.oid) ilike '%duration%'
  loop
    execute format('alter table public.courses drop constraint %I', duration_constraint.conname);
  end loop;
end;
$$;

alter table public.courses
  add constraint courses_duration_check
    check (duration between 10 and 780),
  add constraint courses_duration_step_check
    check (duration % 10 = 0),
  add constraint courses_end_time_check
    check (start_time + duration <= 1260);

create or replace function public.save_course(
  p_id text,
  p_start_date date,
  p_repeat_interval_days smallint,
  p_start_time smallint,
  p_duration smallint,
  p_name text,
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
      id, start_date, repeat_interval_days, start_time, duration, name, notes
    ) values (
      p_id, p_start_date, p_repeat_interval_days, p_start_time, p_duration, p_name, p_notes
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

revoke all on function public.save_course(
  text, date, smallint, smallint, smallint, text, text, uuid[], bigint
) from public;

grant execute on function public.save_course(
  text, date, smallint, smallint, smallint, text, text, uuid[], bigint
) to authenticated;

commit;
