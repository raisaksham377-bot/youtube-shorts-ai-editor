# Prompt cookbook

Claude Code reads `CLAUDE.md` and the skills, so you do not need magic words. You do need to give it **context**. The more of the
checklist below you put in one message, the more of the Short it can build without stopping to ask.

## What to put in your prompt

| Give Claude | Why it matters |
|---|---|
| **Footage path** and its kind (your camera, or AI avatar) | decides the crop strategy ([AVATAR-FOOTAGE](AVATAR-FOOTAGE.md)) |
| **Topic, audience, goal** of the Short | beats and tone follow from it |
| **The script**, or "transcribe the footage" | the beats are timed to the real words |
| **Names of real things** you mention (companies, places, apps, people) | a precise name is what makes a real photo or page findable |
| **Length** (60–90 s) | sets the beat count |
| **What you do NOT want shown** | avoids private data and unwanted logos |
| **Which steps to stop at** | the sound cue sheet and the music bed are audit gates by design |

## The master prompt

Copy, fill the brackets, paste into Claude Code in the repo folder.

```text
Make a YouTube Short with this repo. Run the whole Shorts pipeline and stop at each audit gate to show me.

FOOTAGE
- [videos/video-1/avatar.mp4]  ([AI avatar read, 9:16]  OR  [my camera clip, static, face centred])

TOPIC
- Topic: [what the Short is about]
- Audience: [who watches it]
- Goal: [what they should think, feel or do at the end]
- Script: [it is spoken in the footage, so transcribe it]  OR  [paste the script here]

LOOK AND LENGTH
- Use the brand in brand.md (I already ran /brand-setup).
- 60 to 90 seconds. About one B-roll beat every 5 to 6 seconds.

B-ROLL (important)
- Every company, person, place, app or job posting I name must be a REAL photo or REAL screenshot. Find it with web search
  and live page capture (tools/capture_web.py). Official or openly licensed sources only. Do not publish other people's
  private data.
- Photos get a slow Ken Burns push. Web pages become a simulated screen recording.
- Icons or text cards only for abstract ideas that have nothing real to show.
- Put the camera-snap sound on each real photo or screenshot reveal.

SOUND
- Do the SFX pass from the shared library and show me the cue sheet BEFORE you mix.
- Then /assemble: show me two music beds ([ambient-pad] and [tech-pulse]); I will pick. Finish at -14 LUFS.

RULES
- Render and LOOK at a still at every beat. Run every verify gate. If something fails, tell me. Do not hide it.
- Do not spend credits, buy anything or change any plan without asking me first.
- Do not put keys in the chat. I edit .env myself.
```

## Step prompts

**Brand (once)**
> set up my brand

**Cut**
> Clean-cut videos/video-1. It is a single AI-avatar take, so keep it as one span, but still run the QA and verify gates.

**Build the Short**
> Build the vertical Short for videos/video-1 with /build-vertical-reel. Find the face crop by rendering stills, then plan the
> beats from edited-transcript.json and show me the beat list before you author the scenes.

**Real assets only**
> For the beat about [Company X], fetch their real logo and a real screenshot of [their careers page], capture it with
> capture_web.py, and animate it. Show me the files you found and where each came from.

**Sound**
> Suggest SFX for videos/video-1 and print the cue sheet. I will approve it before you mix.

**Assemble**
> Run /assemble on the SFX-mixed file. Audition ambient-pad and tech-pulse, then finalise the one I pick.

## Edits to an existing Short

> Re-time the "chain" beat so it lands on the word "dies".

> Replace the globe icon beat with a real map photo of [region], Ken Burns toward [city].

> The longest caption word touches the chin. Re-check bottomPad against the longest and shortest words.

> Make a 30-second cut: keep the hook, the two strongest beats and the call to action.

> Swap the music bed to lofi-warm and re-finalise. Keep the SFX mix as is.

## A good first exercise

> Take `examples/shorts/outreach-pitch/` and rebuild its top half with **real** assets: the company's real logo, a real capture of its
> job page, real photos for each country named. Keep the timings and captions, and tell me what you changed.

## When you want to learn what Claude can do here

> List every skill in this repo and the one-line job of each. Then tell me which ones a Short uses and in what order.

## Pitfalls

- Naming a place or company vaguely ("a big bank") gives Claude nothing to fetch. Say which.
- If you ask for "everything", say which gates you still want to review. By default the sound cue sheet and the music bed are
  stop-and-ask points.
- Keys go in `.env`, edited by you, never in the chat.
