begin;

alter table public.students
  add column if not exists pet text;

alter table public.students
  drop constraint if exists students_pet_check,
  add constraint students_pet_check check (
    pet is null or pet = any (array[
      'cat', 'dog', 'rabbit', 'hamster',
      'fox', 'panda', 'bear', 'frog'
    ])
  );

create or replace function public.set_student_pet(
  p_student_id uuid,
  p_pet text
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

  if p_pet is not null and p_pet <> all (array[
    'cat', 'dog', 'rabbit', 'hamster',
    'fox', 'panda', 'bear', 'frog'
  ]) then
    raise exception using errcode = '22023', message = 'invalid pet';
  end if;

  update public.students
  set pet = p_pet
  where id = p_student_id
    and not is_admin
  returning * into saved_student;

  if not found then
    raise exception using errcode = '22023', message = 'student account not found';
  end if;

  return saved_student;
end;
$$;

revoke all privileges on table public.students from anon, authenticated;
grant select (
  id, username, is_admin, lesson_count, current_lesson_count,
  required_lesson_count, color, pet, created_at
) on table public.students to authenticated;

revoke all on function public.set_student_pet(uuid, text) from public;
grant execute on function public.set_student_pet(uuid, text) to authenticated;

commit;
