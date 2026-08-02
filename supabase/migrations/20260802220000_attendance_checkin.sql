begin;

create table if not exists public.student_attendance (
  id bigint generated always as identity primary key,
  student_id uuid not null references public.students(id) on delete cascade,
  attendance_date date not null,
  status text not null check (status in ('present', 'leave')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, attendance_date)
);

create index if not exists student_attendance_date_idx
  on public.student_attendance (attendance_date, student_id);

alter table public.student_attendance enable row level security;
revoke all privileges on table public.student_attendance from public, anon, authenticated;

create or replace function public.get_today_attendance()
returns table (
  student_id uuid,
  username text,
  current_lesson_count integer,
  status text,
  course_names text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  today_china date := timezone('Asia/Shanghai', now())::date;
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  return query
  with today_courses as (
    select
      cs.student_id,
      string_agg(distinct c.name, '、' order by c.name) as names
    from public.courses c
    join public.course_students cs on cs.course_id = c.id
    where c.start_date <= today_china
      and ((c.repeat_interval_days is null and c.start_date = today_china)
        or (c.repeat_interval_days is not null
          and (today_china - c.start_date) % c.repeat_interval_days = 0
          and (c.repeat_count is null
            or (today_china - c.start_date) / c.repeat_interval_days < c.repeat_count)))
    group by cs.student_id
  )
  select
    s.id,
    s.username,
    s.current_lesson_count,
    a.status,
    today_courses.names
  from today_courses
  join public.students s on s.id = today_courses.student_id and not s.is_admin
  left join public.student_attendance a
    on a.student_id = s.id and a.attendance_date = today_china
  order by s.sort_order, s.created_at, s.id;
end;
$$;

create or replace function public.set_today_attendance(
  p_student_id uuid,
  p_status text
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  today_china date := timezone('Asia/Shanghai', now())::date;
  previous_status text;
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;
  if p_status not in ('present', 'leave') then
    raise exception using errcode = '22023', message = 'invalid attendance status';
  end if;
  if not exists (
    select 1
    from public.courses c
    join public.course_students cs on cs.course_id = c.id
    where cs.student_id = p_student_id
      and c.start_date <= today_china
      and ((c.repeat_interval_days is null and c.start_date = today_china)
        or (c.repeat_interval_days is not null
          and (today_china - c.start_date) % c.repeat_interval_days = 0
          and (c.repeat_count is null
            or (today_china - c.start_date) / c.repeat_interval_days < c.repeat_count)))
  ) then
    raise exception using errcode = '22023', message = 'student has no course today';
  end if;

  perform 1 from public.students where id = p_student_id and not is_admin for update;
  if not found then
    raise exception using errcode = '22023', message = 'student not found';
  end if;

  select status into previous_status
  from public.student_attendance
  where student_id = p_student_id and attendance_date = today_china
  for update;

  insert into public.student_attendance (student_id, attendance_date, status)
  values (p_student_id, today_china, p_status)
  on conflict (student_id, attendance_date)
  do update set status = excluded.status, updated_at = now();

  if previous_status is distinct from p_status then
    if p_status = 'present' and previous_status is distinct from 'present' then
      update public.students set current_lesson_count = current_lesson_count + 1 where id = p_student_id;
    elsif p_status = 'leave' and previous_status = 'present' then
      update public.students set current_lesson_count = greatest(0, current_lesson_count - 1) where id = p_student_id;
    end if;
  end if;
  return true;
end;
$$;

create or replace function public.mark_all_today_attendance_present()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  student_row record;
  changed_count integer := 0;
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;
  for student_row in
    select student_id from public.get_today_attendance()
  loop
    perform public.set_today_attendance(student_row.student_id, 'present');
    changed_count := changed_count + 1;
  end loop;
  return changed_count;
end;
$$;

revoke all on function public.get_today_attendance() from public, anon, authenticated;
revoke all on function public.set_today_attendance(uuid, text) from public, anon, authenticated;
revoke all on function public.mark_all_today_attendance_present() from public, anon, authenticated;
grant execute on function public.get_today_attendance() to authenticated;
grant execute on function public.set_today_attendance(uuid, text) to authenticated;
grant execute on function public.mark_all_today_attendance_present() to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.student_attendance;
exception
  when duplicate_object then null;
end;
$$;

do $$
declare
  existing_job_id bigint;
begin
  begin
    create extension if not exists pg_cron;
  exception when others then
    raise notice 'pg_cron unavailable; skip attendance migration cron refresh';
    return;
  end;
  select jobid into existing_job_id from cron.job where jobname = 'course-schedule-pet-ranking' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
  perform cron.schedule('course-schedule-pet-ranking', '0 16 * * 0', 'select public.settle_pet_weekly_ranking();');
exception when others then
  raise notice 'weekly cron refresh skipped: %', sqlerrm;
end;
$$;

notify pgrst, 'reload schema';
commit;
