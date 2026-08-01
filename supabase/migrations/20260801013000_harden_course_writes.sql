begin;

create or replace function public.delete_course(
  p_course_id text,
  p_expected_version bigint
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  deleted_course_id text;
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  delete from public.courses
  where id = p_course_id
    and version = p_expected_version
  returning id into deleted_course_id;

  return deleted_course_id is not null;
end;
$$;

revoke all privileges on table public.courses from anon, authenticated;
revoke all privileges on table public.students from anon, authenticated;
revoke all privileges on table public.course_students from anon, authenticated;

grant select on table public.courses to authenticated;
grant select (id, username, is_admin, created_at) on table public.students to authenticated;
grant select (course_id, student_id, created_at) on table public.course_students to authenticated;

revoke all on function public.delete_course(text, bigint) from public;
grant execute on function public.delete_course(text, bigint) to authenticated;

revoke all on function public.prevent_course_series_conflicts() from public, anon, authenticated;
revoke all on function public.prevent_student_course_conflicts() from public, anon, authenticated;

commit;
