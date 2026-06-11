# Calm Ritual Feature Spec

## Purpose

Calm Ritual is an optional focus layer before or after a virtual good deed. It turns a quick tap into a short intentional moment, helping Foobow feel comforting without becoming religious, superstitious, or casino-like.

This feature is inspired by common meditation-product patterns such as ambient audio, timers, guided steps, gentle completion feedback, and session records. Foobow adapts those patterns for secular symbolic kindness.

## Core Components

- Ambient soundscape: optional nature or city sound matched to the deed category, such as water for virtual release, wind for tree planting, soft rain for umbrella support, or quiet street ambience for lighting a lamp.
- Presence timer: a 15-30 second focus window before a deed can be completed.
- Guided steps: two or three short prompts such as breathe, notice intention, then complete the symbolic action.
- Hold-to-complete action: a long press or slow drag for the final deed interaction, with accessible alternatives.
- Gentle completion animation: ripple, glow, bloom, or lantern fade. Avoid fireworks, coins, jackpots, or high-arousal effects.
- Optional reflection: a private post-action mood check or one-line journal prompt.
- Quiet progress record: update karma history and category progress without oversized score celebrations.

## User Stories

- As a daily user, I want a short focus moment before completing a deed so that the action feels intentional instead of automatic.
- As a private user, I want ambient audio and reflection to be optional so that I can use the app quietly in public.
- As a sensitive user, I want reduced-motion support so that completion effects do not feel overwhelming.
- As a parent or family user, I want gentle guided language so that symbolic deeds feel emotionally safe for mixed audiences.
- As a skeptical user, I want clear copy stating that virtual actions are symbolic and do not guarantee luck, virtue, health, or real-world impact.

## Safety And Copy Rules

- Do not claim that users can earn real virtue, luck, merit, health outcomes, or spiritual results.
- Do not use language that pressures users to complete streaks.
- Do not connect donation amounts to better karma, blessing strength, or personal fortune.
- Use calm language: "take a moment", "complete your symbolic action", "record a reflection".
- Keep verified donation impact separate from virtual karma progress.

## Accessibility Requirements

- Audio must default to off or low volume and expose mute/volume controls.
- All timed interactions need a non-gesture accessible alternative.
- Hold-to-complete must not be the only completion path.
- Animation must respect reduced-motion settings.
- Progress and completion status must be announced through accessible labels/live regions where relevant.

## MVP Flow

1. User chooses a deed from Today, Map, or Deeds.
2. App opens Calm Ritual with the deed title, location, and one-sentence intention.
3. User optionally enables ambient sound.
4. A soft presence indicator runs for 15-30 seconds.
5. User completes the final symbolic action by hold, drag, or accessible button.
6. App records the deed and offers an optional private reflection.
7. App shows quiet progress: category stamp, journal entry, or small badge progress.

## API Shape To Add Later

The API should add focus-session support only after provider setup and Node runtime are stable.

- `POST /api/v1/focus-sessions/start`
- `POST /api/v1/focus-sessions/complete`
- Fields: `deed_action_id`, `duration_seconds`, `soundscape_id`, `completed_threshold`, `reflection_mood`, `reduced_motion`
- Completion must be idempotent with a client request key.

## QA Acceptance

- User can complete a deed without enabling audio.
- User can complete a deed with reduced motion enabled.
- Completion copy does not say or imply guaranteed karma, virtue, luck, or real-world impact.
- Donation prompts remain optional and separate.
- Timer and long-press behavior do not trap keyboard, switch-control, or screen-reader users.
