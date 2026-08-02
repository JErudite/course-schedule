begin;

create or replace function public.add_student_pet_resources(
  p_student_id uuid,
  p_experience_gain bigint,
  p_coins bigint
)
returns table (student_id uuid, experience bigint, coins bigint)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin_account() then
    raise exception using errcode = '42501', message = 'administrator access required';
  end if;

  if p_experience_gain is null or p_experience_gain < 0
    or p_coins is null or p_coins < 0 then
    raise exception using errcode = '22023', message = 'experience gain and coins must be non-negative integers';
  end if;

  return query
  update public.students
  set pet_experience = pet_experience + p_experience_gain,
      pet_coins = p_coins
  where id = p_student_id
    and pet is not null
  returning id, pet_experience, pet_coins;

  if not found then
    raise exception using errcode = '22023', message = 'pet owner not found';
  end if;
end;
$$;

revoke all on function public.add_student_pet_resources(uuid, bigint, bigint) from public, anon, authenticated;
grant execute on function public.add_student_pet_resources(uuid, bigint, bigint) to authenticated;

-- Keep completed challenge history through its prompt snapshot while removing
-- the seeded question bank. Unanswered attempts cannot be completed after the
-- referenced question is removed, so discard only those pending records.
delete from public.pet_challenge_attempts
where answered_at is null;

alter table public.pet_challenge_attempts
  alter column question_id drop not null;

alter table public.pet_challenge_attempts
  drop constraint if exists pet_challenge_attempts_question_id_fkey;

alter table public.pet_challenge_attempts
  add constraint pet_challenge_attempts_question_id_fkey
  foreign key (question_id)
  references public.pet_challenge_questions(id)
  on delete set null;

delete from public.pet_challenge_questions;

notify pgrst, 'reload schema';

commit;
