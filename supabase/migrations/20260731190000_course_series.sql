begin;

alter table public.courses
  drop constraint if exists courses_day_int4range_excl;

alter table public.courses
  add column if not exists start_date date,
  add column if not exists repeat_interval_days smallint,
  add column if not exists notes text not null default '';

update public.courses
set start_date = date '2026-04-13' + (day - 1),
    repeat_interval_days = 7
where start_date is null;

alter table public.courses
  alter column start_date set not null,
  drop column day,
  drop column room,
  drop column type;

alter table public.courses
  add constraint courses_repeat_interval_check
    check (repeat_interval_days is null or repeat_interval_days between 1 and 365),
  add constraint courses_end_time_check
    check (start_time + duration <= 1260),
  add constraint courses_start_time_step_check
    check (start_time % 10 = 0),
  add constraint courses_teacher_check
    check (char_length(teacher) between 1 and 40),
  add constraint courses_notes_check
    check (char_length(notes) <= 500);

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
  limit 1;

  if conflicting_course is not null then
    raise exception using
      errcode = '23P01',
      message = 'course series conflicts with an existing course',
      detail = format('Conflicting course id: %s', conflicting_course);
  end if;

  return new;
end;
$$;

drop trigger if exists courses_prevent_series_conflicts on public.courses;
create trigger courses_prevent_series_conflicts
before insert or update of start_date, repeat_interval_days, start_time, duration
on public.courses
for each row
execute function public.prevent_course_series_conflicts();

drop policy if exists "Owner can insert courses" on public.courses;
create policy "Owner can insert courses"
on public.courses
for insert
to authenticated
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('703223232@qq.com')
);

drop policy if exists "Owner can delete courses" on public.courses;
create policy "Owner can delete courses"
on public.courses
for delete
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('703223232@qq.com')
);

grant insert, delete on table public.courses to authenticated;
revoke insert, delete on table public.courses from anon;

commit;
