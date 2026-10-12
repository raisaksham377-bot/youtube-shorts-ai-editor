# Sound and music

Two separate passes, in this order: **sound effects** (`/suggest-sfx`, step 3), then **music bed + final loudness**
(`/assemble`, step 4). The house taste is calm and premium: felt, not heard, always under the voice. Not MrBeast-loud.

## Where the "soothing background sound" comes from

Every finance, job-search or AI-tech education Reel you have seen has a soft instrumental running underneath. It is **not part of
the original recording.** Creators add an instrumental *music bed*, loop it for the whole video, and **duck** it (automatically lower
it) whenever they speak, so it breathes up in the pauses and recedes under the voice. It sounds like it was always there because it
is never loud.

That is exactly what `/assemble` does, using beds that already ship in `media/library/music/`. No song is involved.

## 1. Sound effects: `/suggest-sfx`

Pick every cue by its **function**, not by browsing for something that "feels right":

| Function | Sound | Job |
|---|---|---|
| Motion | `whoosh-soft`, `whoosh-wind` | carry one beat into the next |
| Tension | `riser-soft` | "something is coming" before a reveal |
| Emphasis | `impact-soft`, `impact-deep-soft`, `pop-reveal` | "this moment matters" |
| Snap | `ui-click-soft`, `ui-toggle-on`, `ui-send`, `trap-snap` | small, satisfying, alive |
| **Real-asset reveal** | **`camera-snap`** | a real photo or screenshot has just landed |
| Reward | `chime-reward` | a positive payoff |

The library has **36 clips** (`media/library/sfx/catalog.json`), loudness-normalised to about −20 LUFS with a −1.5 dBFS ceiling, so
a cue's `gain_db` is meaningful.

### The plan file

`videos/<video>/work/sfx-plan.json`: one event per cue, `at_s` on the master timeline.

```json
{
  "render": { "preview": "videos/video-1/output/video-1-full-reel.mp4",
              "out": "videos/video-1/output/video-1-full-reel-sfx.mp4", "end_s": 107.5, "duck": true },
  "events": [
    { "at_s": 20.57, "sfx_id": "impact-deep-soft", "gain_db": -5, "cue": "word \"costs\": the weeks stat lands" },
    { "at_s": 33.66, "sfx_id": "pop-reveal",       "gain_db": -6, "cue": "word \"20\": the big number appears" }
  ]
}
```

Time each cue to the **visual beat and, often, the exact word**. Take word times from `edited-transcript.json`. Being 100 ms off
reads as sloppy.

### Taste rules that earned their place

- Score the signature moment of a beat, not every sub-frame. Roughly 8–14 cues per minute is plenty.
- **Layer only the 2–3 hero moments** (a riser into an impact, a whoosh into a pop). Everything else gets a single sound and silence.
- No cue on purely decorative animation, no whoosh on every move, no ambient texture under speech, no static or glitch sounds under
  narration (they read as noise at any gain).
- An enumerated list is the one place a click sequence earns its clicks: when the narration names the items one by one
  ("Dubai, UK, Ireland, India"), put a click on each word. That counts as one gesture.

### Audit, mix, verify

```bash
python tools/mix_sfx.py videos/video-1/work/sfx-plan.json --print     # the cue sheet. You approve this first.
python tools/mix_sfx.py videos/video-1/work/sfx-plan.json             # mix (light sidechain duck under the voice)
```

**Verify audibility with numbers.** Compare mean/peak volume of the mixed file against the voice-only file in a *tight* window
(about 0.3–0.5 s) around a key cue:

```bash
ffmpeg -i voice-only.mp4 -ss 20.4 -t 0.6 -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
ffmpeg -i with-sfx.mp4   -ss 20.4 -t 0.6 -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
```

In our 107 s example the two hero cues raised the peak in that window from −7.0 dB to −0.6 dB and from −6.2 dB to −0.6 dB. Short
percussive clips peak before they reach the loudness target, so they need a few dB more gain than sustained clips. Cues that sit
fully under continuous speech will not measure at any gain; let them live in word gaps or cut them.

### Adding a sound

1. Add a recipe to `media/library/sfx/palette.json` (generic id, tags, `duration_s`, a prompt).
2. `python tools/gen_sfx.py --only <id>` (needs `ELEVENLABS_API_KEY`).

`duration_s` must be **≥ 0.5**. The API returns `HTTP 400` below that. Reuse before you generate; the library is the durable asset.

## 2. Music bed and final mix: `/assemble`

Six pre-generated instrumental beds (`media/library/music/catalog.json`, about 63 s loops, normalised to −20 LUFS):

| Bed | Character | Reach for it when |
|---|---|---|
| `ambient-pad` | calm minimal synth pads, no drums | the safe default; professional, personal, pitch-style Shorts |
| `tech-pulse` | gentle pulsing synth arpeggio, forward motion | AI, product, build and data content |
| `lofi-warm` | mellow Rhodes and soft drums | friendly how-to and personal-story tone |
| `cinematic-min` | sparse felt piano | reflective or emotional beats |
| `docu-pluck` | pizzicato and marimba | curious explainer tone |
| `lullaby-tender` | music box | storybook only |

```bash
# audition one bed (defaults: bed gain −7 dB, duck 9 dB, fade 1.5 s)
python tools/mix_music.py --bed ambient-pad --base videos/video-1/output/video-1-full-reel-sfx.mp4 \
       --out videos/video-1/output/video-1-audition.mp4
python tools/mix_music.py --all --base <same file>          # one output per bed, to compare
python tools/mix_music.py --bed tech-pulse --base <file> --print    # show resolved settings, render nothing
```

**You pick the bed.** The bed is looped or trimmed to the video length, high-passed a touch so it never muddies speech,
sidechain-ducked by the voice, faded in and out, and limited. Expect the whole-file loudness to rise only a little (we measured
about +0.7 dB mean). That is the point: it is felt, not heard.

### Final loudness: two-pass EBU R128 to −14 LUFS

Reels, Shorts and YouTube normalise to roughly −14 LUFS, so mixing to it here avoids a second, uncontrolled pass on upload.

```bash
# pass 1: measure
ffmpeg -i audition.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null -

# pass 2: apply, feeding pass 1's numbers back in (video stream copied, audio re-encoded)
ffmpeg -y -i audition.mp4 \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=-21.44:measured_TP=-0.57:measured_LRA=3.90:measured_thresh=-31.52:offset=0.79:linear=true:print_format=summary" \
  -c:v copy -c:a aac -b:a 192k videos/video-1/output/video-1-final.mp4
```

Replace the `measured_*` and `offset` values with what pass 1 printed for *your* file. Our example went from −21.4 LUFS to −14.2 LUFS at
−1.5 dBTP. Then re-run the A/V duration check (`ffprobe -show_entries stream=duration`): the video stream must not have moved.
`video-1-final.mp4` is the file you upload.

### Licensing note

The bundled beds and clips were generated with ElevenLabs and are redistributed with this repo; per-clip provenance is in the
catalogs. If you generate your own, commercial rights follow *your* ElevenLabs plan.
