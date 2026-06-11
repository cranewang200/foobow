-- Foobow focus-session draft schema.
-- Adds Calm Ritual persistence without requiring provider setup yet.

create table focus_soundscapes (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  category text not null check (category in ('water', 'rain', 'forest', 'street', 'silence')),
  description text not null,
  status text not null default 'active' check (status in ('draft', 'active', 'retired')),
  created_at timestamptz not null default now()
);

create table focus_sessions (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  user_id bigint not null references users(id) on delete cascade,
  deed_action_id bigint references deed_actions(id) on delete set null,
  soundscape_id bigint references focus_soundscapes(id) on delete set null,
  target_duration_seconds integer not null default 20 check (target_duration_seconds between 5 and 1800),
  elapsed_seconds integer not null default 0 check (elapsed_seconds >= 0),
  completion_threshold_percent integer not null default 100 check (completion_threshold_percent between 50 and 100),
  reduced_motion boolean not null default false,
  status text not null default 'started' check (status in ('started', 'completed', 'abandoned', 'expired')),
  completion_idempotency_key text unique,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  metadata jsonb not null default '{}'
);

create index focus_sessions_user_started_idx on focus_sessions (user_id, started_at desc);
create index focus_sessions_deed_action_idx on focus_sessions (deed_action_id);
create index focus_sessions_status_expires_idx on focus_sessions (status, expires_at);

create table focus_reflections (
  id bigint generated always as identity primary key,
  public_id text not null unique,
  user_id bigint not null references users(id) on delete cascade,
  focus_session_id bigint not null references focus_sessions(id) on delete cascade,
  mood text not null check (mood in ('calm', 'lighter', 'same', 'heavy', 'grateful', 'hopeful')),
  body text,
  visibility text not null default 'private' check (visibility in ('private', 'exported', 'deleted')),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index focus_reflections_user_created_idx on focus_reflections (user_id, created_at desc);
create index focus_reflections_session_idx on focus_reflections (focus_session_id);

alter table karma_events
  add column focus_session_id bigint references focus_sessions(id) on delete set null,
  add column source_type text,
  add column source_public_id text;

create index karma_events_focus_session_idx on karma_events (focus_session_id);

create unique index karma_events_source_unique
  on karma_events (source_type, source_public_id)
  where source_type is not null and source_public_id is not null;
