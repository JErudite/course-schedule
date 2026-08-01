begin;

alter table public.students
  add column if not exists lesson_count integer not null default 0;

alter table public.students
  drop constraint if exists students_lesson_count_check,
  add constraint students_lesson_count_check
    check (lesson_count between 0 and 100000);

create or replace function public.set_student_lesson_count(
  p_student_id uuid,
  p_lesson_count integer
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  saved_lesson_count integer;
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  if p_lesson_count is null or p_lesson_count not between 0 and 100000 then
    raise exception using errcode = '22023', message = 'lesson count must be between 0 and 100000';
  end if;

  update public.students
  set lesson_count = p_lesson_count
  where id = p_student_id
    and not is_admin
  returning lesson_count into saved_lesson_count;

  if not found then
    raise exception using errcode = '22023', message = 'student account not found';
  end if;

  return saved_lesson_count;
end;
$$;

revoke all privileges on table public.students from anon, authenticated;
grant select (id, username, is_admin, lesson_count, created_at)
  on table public.students to authenticated;

revoke all on function public.set_student_lesson_count(uuid, integer) from public;
grant execute on function public.set_student_lesson_count(uuid, integer) to authenticated;

alter table public.students replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.students;
exception
  when duplicate_object then null;
end;
$$;

commit;
