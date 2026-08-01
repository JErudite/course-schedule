begin;

alter table public.students
  add column if not exists sort_order integer not null default 0;

with ranked as (
  select id, row_number() over (order by created_at, id)::integer as position
  from public.students
  where not is_admin
)
update public.students
set sort_order = ranked.position
from ranked
where students.id = ranked.id
  and students.sort_order = 0;

create or replace function public.assign_new_student_sort_order()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if not new.is_admin and new.sort_order = 0 then
    select coalesce(max(sort_order), 0) + 1
    into new.sort_order
    from public.students
    where not is_admin;
  end if;
  return new;
end;
$$;

drop trigger if exists students_assign_sort_order on public.students;
create trigger students_assign_sort_order
before insert on public.students
for each row
execute function public.assign_new_student_sort_order();

create or replace function public.reorder_students(p_student_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  expected_count integer;
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  select count(*) into expected_count
  from public.students
  where not is_admin;

  if coalesce(array_length(p_student_ids, 1), 0) <> expected_count
    or (select count(distinct id) from unnest(coalesce(p_student_ids, array[]::uuid[])) as item(id)) <> expected_count
    or exists (
      select 1
      from unnest(coalesce(p_student_ids, array[]::uuid[])) as item(id)
      left join public.students on students.id = item.id and not students.is_admin
      where students.id is null
    ) then
    raise exception using errcode = '22023', message = 'student order must include every visitor exactly once';
  end if;

  update public.students
  set sort_order = requested.position
  from unnest(p_student_ids) with ordinality as requested(id, position)
  where students.id = requested.id;
end;
$$;

create or replace function public.delete_course_occurrence(
  p_course_id text,
  p_occurrence_date date,
  p_mode text,
  p_expected_version bigint
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  selected_course public.courses%rowtype;
  occurrence_index integer;
  following_course_id text;
  following_repeat_count integer;
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  if p_mode <> all (array['single', 'future']) then
    raise exception using errcode = '22023', message = 'invalid deletion mode';
  end if;

  select * into selected_course
  from public.courses
  where id = p_course_id
    and version = p_expected_version
  for update;

  if not found then
    raise exception using errcode = 'P0001', message = 'stale course version';
  end if;

  if selected_course.repeat_interval_days is null then
    if p_occurrence_date <> selected_course.start_date then
      raise exception using errcode = '22023', message = 'course occurrence not found';
    end if;
    delete from public.courses where id = selected_course.id;
    return true;
  end if;

  if p_occurrence_date < selected_course.start_date
    or (p_occurrence_date - selected_course.start_date) % selected_course.repeat_interval_days <> 0 then
    raise exception using errcode = '22023', message = 'course occurrence not found';
  end if;

  occurrence_index := (p_occurrence_date - selected_course.start_date)
    / selected_course.repeat_interval_days;

  if selected_course.repeat_count is not null
    and occurrence_index >= selected_course.repeat_count then
    raise exception using errcode = '22023', message = 'course occurrence not found';
  end if;

  if p_mode = 'future' then
    if occurrence_index = 0 then
      delete from public.courses where id = selected_course.id;
    else
      update public.courses
      set repeat_count = occurrence_index
      where id = selected_course.id;
    end if;
    return true;
  end if;

  if selected_course.repeat_count = 1 then
    delete from public.courses where id = selected_course.id;
    return true;
  end if;

  if occurrence_index = 0 then
    update public.courses
    set start_date = selected_course.start_date + selected_course.repeat_interval_days,
        repeat_count = case
          when selected_course.repeat_count is null then null
          else selected_course.repeat_count - 1
        end
    where id = selected_course.id;
    return true;
  end if;

  if selected_course.repeat_count is not null
    and occurrence_index = selected_course.repeat_count - 1 then
    update public.courses
    set repeat_count = occurrence_index
    where id = selected_course.id;
    return true;
  end if;

  following_course_id := gen_random_uuid()::text;
  following_repeat_count := case
    when selected_course.repeat_count is null then null
    else selected_course.repeat_count - occurrence_index - 1
  end;

  update public.courses
  set repeat_count = occurrence_index
  where id = selected_course.id;

  insert into public.courses (
    id, start_date, repeat_interval_days, repeat_count,
    start_time, duration, name, notes, color
  ) values (
    following_course_id,
    p_occurrence_date + selected_course.repeat_interval_days,
    selected_course.repeat_interval_days,
    following_repeat_count,
    selected_course.start_time,
    selected_course.duration,
    selected_course.name,
    selected_course.notes,
    selected_course.color
  );

  insert into public.course_students (course_id, student_id)
  select following_course_id, student_id
  from public.course_students
  where course_id = selected_course.id;

  return true;
end;
$$;

revoke all privileges on table public.students from anon, authenticated;
grant select (
  id, username, is_admin, lesson_count, current_lesson_count,
  required_lesson_count, color, pet, pet_name, pet_experience,
  pet_coins, pet_checkin_date, pet_checkin_streak, sort_order, created_at
) on table public.students to authenticated;

revoke all on function public.assign_new_student_sort_order() from public, anon, authenticated;
revoke all on function public.reorder_students(uuid[]) from public, anon, authenticated;
revoke all on function public.delete_course_occurrence(text, date, text, bigint) from public, anon, authenticated;

grant execute on function public.reorder_students(uuid[]) to authenticated;
grant execute on function public.delete_course_occurrence(text, date, text, bigint) to authenticated;

commit;
