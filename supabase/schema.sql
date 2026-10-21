create table if not exists public.questions (
  id text primary key,
  domain text not null check (domain in ('cloud', 'architecture', 'management')),
  objective text not null,
  prompt text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 4),
  correct_index smallint not null check (correct_index between 0 and 3),
  explanation text not null,
  source_url text not null,
  outline_version date not null default date '2026-07-20',
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists questions_domain_published_idx
  on public.questions (domain, is_published);

alter table public.questions enable row level security;
drop policy if exists "Published questions are readable" on public.questions;
create policy "Published questions are readable"
  on public.questions for select to anon, authenticated
  using (is_published);
grant select on public.questions to anon, authenticated;

create table if not exists public.attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null references public.questions (id) on delete cascade,
  selected_index smallint not null check (selected_index between 0 and 3),
  is_correct boolean not null,
  attempted_at timestamptz not null default now()
);

create index if not exists attempts_user_time_idx
  on public.attempts (user_id, attempted_at desc);

alter table public.attempts enable row level security;
drop policy if exists "Learners can read their own attempts" on public.attempts;
create policy "Learners can read their own attempts"
  on public.attempts for select to authenticated
  using ((select auth.uid()) = user_id);
revoke all on public.attempts from anon, authenticated;
grant select on public.attempts to authenticated;

create or replace function public.record_attempt(p_question_id text, p_selected_index smallint)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  learner_id uuid := auth.uid();
  answer_index smallint;
  answer_is_correct boolean;
begin
  if learner_id is null then
    raise exception 'Sign in is required to save an attempt';
  end if;

  select q.correct_index into answer_index
  from public.questions as q
  where q.id = p_question_id and q.is_published;

  if not found then
    raise exception 'Question not found';
  end if;

  answer_is_correct := answer_index = p_selected_index;

  insert into public.attempts (user_id, question_id, selected_index, is_correct)
  values (learner_id, p_question_id, p_selected_index, answer_is_correct);

  return answer_is_correct;
end;
$$;

revoke all on function public.record_attempt(text, smallint) from public, anon;
grant execute on function public.record_attempt(text, smallint) to authenticated;
