# Brand — template style (make it yours with `/brand-setup`)

> Style contract for every video this repo produces (long-form and Shorts). Every step-2+ skill (TSX overlays,
> full-screen animations, diagrams, SFX) reads this file so all videos feel like one channel.
> Set via `/brand-setup`. If you change it, also update `remotion/src/brand.ts` (the same tokens, as
> code). A calm, premium, **credible-and-quick** aesthetic: authoritative navy visuals, edited with
> punchier pacing than a typical calm/premium channel.

## 1. Identity & voice

- **Channel:** *(placeholder — `/brand-setup` asks you)* — e.g. "practical career strategy for
  people stuck in the application grind". The template below is written for an educational,
  credibility-first channel; change the wording, keep the structure.
- **Positioning:** credible, premium, navy-forward — trust and authority in the visuals, energy in the
  cut. Light, airy base (warm gray, not stark white), soft depth, tasteful motion — but pacing runs
  quicker than a typical calm/premium channel. Credibility in the visuals, energy in the pacing.
- **Voice:** direct, confident, generous (free resources), personal (the presenter in the loop). No
  hype-filler. On-screen text deliberately **avoids em-dashes** — keep that in overlays too.
- **Energy for video:** clean and premium, not MrBeast-loud, but cut quicker than the calm/premium
  norm — punchier cuts, tighter holds. Motion is *tasteful*, not bouncy/cartoonish. (No hard offset
  shadows, thick black borders, or sticker-pop "Memphis" looks — that style is retired.)

## 2. Logo / wordmark

- **Wordmark:** ships as `Your Channel` (`['Your', 'Channel', '']` in `remotion/src/brand.ts`; the MIDDLE
  slot renders in the accent colour). Replace it with your own name via `/brand-setup`, in Space Grotesk, tight.
- **Sign-off (end card):** "See you in the next one" (placeholder — set your own line).
- No standalone logo mark is required (a favicon is enough). Use the wordmark as the lockup.
- Drop any portrait / brand-bumper assets you want to reuse under `media/library/` (e.g. a `logos/`
  or `faces/` entry) and reference them from shots via `staticFile('library/...')`.

## 3. Color palette (exact hex)

| Role | Name | Hex | Use in video |
|---|---|---|---|
| **Primary accent** | navy | `#1B3B6F` | key words, highlights, active state, progress, CTAs, the wordmark |
| Secondary accent | mid-blue | `#4A6FA5` | pairs with navy in gradients, secondary emphasis |
| Success / positive | teal-green | `#22815F` | "free", confirms, checkmarks, positive callouts |
| Success alt | teal-green (light) | `#2E9678` | teal-green companion for gradients/success |
| Warn / attention | amber | `#A6710E` | highlight sweeps, "watch this", attention pops |
| Danger / contrast | brick red | `#B33F52` | errors, "the hard/expensive way", negative contrast |
| Ink (text/dark) | ink | `#1D2939` | primary text on light; base dark bg |
| Muted text | muted | `#5B6472` | secondary text, captions |
| Surface (paper) | paper | `#F5F5F4` | light full-screen bg, cards — warm gray, not stark white |
| Surface 2 (cream) | cream | `#ECEAE6` | alt light band |
| Border | line | `#DEDAD3` | 1px borders on light |

Contrast-gate check (chroma-js, against `paper`): ink 13.48:1, muted 5.48:1, accent 10.12:1 (and
`paper` on `accent` 10.12:1), accent2 4.69:1, signal 4.40:1, signalAlt 3.35:1, warn 3.86:1, danger
5.13:1 — every role clears the ≥3:1 floor, with the required ink/muted/accent gates well past their
higher bars.

**Dark UI / terminal scale** (GitHub-ink — for Claude Code terminal & code mockups):
`#0d1117` (bg) · `#161b22` (panel) · `#30363d` (border) · `#8b949e` (dim text) · `#c9d1d9` (text).
Unchanged — this scale is pipeline chrome, not brand identity.

**Signature gradient:** navy → mid-blue → teal-green (`#1B3B6F → #4A6FA5 → #22815F`). Used for
dividers and full-screen animated backgrounds.

## 4. Typography (3-font system)

| Role | Font | Weights | Use |
|---|---|---|---|
| **Display / headlines** | **Space Grotesk** | 500 / 600 / 700 | titles, big statements, section cards, the wordmark |
| **Body / UI** | **Inter** | 400 / 500 / 600 | subtitles, labels, body text, lower-third detail |
| **Code / mono** | **JetBrains Mono** | 400 / 500 / 700 | terminal mockups, code, prompts, file paths, tech labels |
| **Claude wordmark serif** | **Source Serif 4** (`FONT_EDITORIAL`) | 600 | "Claude …" wordmark clones (Claude Editor, Claude Code) — the Copernicus stand-in |

**Kept as default at brand setup** — Space Grotesk / Inter / JetBrains Mono were confirmed to already
match the brief (clean, professional, easy to read, nothing decorative or playful); no swap needed.

All load from `@remotion/google-fonts` (see `remotion/src/fonts.ts`) — nothing to install.
Headlines tight tracking; body normal; mono for anything literally code/terminal/paths.
**Wordmark rule (creator feedback on the long-form reference video):** Claude wordmarks use Source Serif 4 at 600 — Spectral
(`FONT_SERIF`) reads too thin/bookish next to the real Copernicus and is retired for wordmarks.

## 5. Shape & depth

- **Radius:** ~14px (cards/panels), pills fully rounded. Terminal/code windows: ~10px with a title bar.
- **Depth:** **soft shadows** (e.g. `0 8px 32px rgba(0,0,0,.10)`), 1px light borders. Airy.
- **Never:** hard offset shadows (`4px 4px 0 #000`), 3px black borders, sticker/pop look → retired.
- **Window chrome** (browser/terminal mockups): rounded panel, top bar with 3 traffic-light dots
  + a mono label; content on the dark ink scale.

## 6. Motion language  ← *calm & premium, cut punchier*

Translated to video (Remotion, 30fps). Visual language stays restrained; **pacing runs quicker** than
the typical calm/premium reference — credibility in the visuals, energy in the cut:

- **Entrances:** fade + rise. `opacity 0→1` and `translateY 24px→0` over ~10–12 frames (~0.33–0.4s at
  30fps), ease-out (or spring: damping 200, mass 0.8, stiffness 120). Calm, no overshoot/bounce — just
  tighter than the reference ~14-frame default.
- **Exits:** fade + fall ~7–8 frames.
- **Emphasis:** navy highlight/underline wipe behind a key word over ~6–7 frames; scale pop max 1.03.
- **Stagger:** 2–3 frames between list items / lines (tighter than the 3–4 reference default).
- **Backgrounds:** slow drifting navy/mid-blue/teal-green gradient blobs + a faint dotted grid, 8–20s
  loops — the backgrounds stay slow even as foreground cuts run quicker.
- **Feel:** premium and restrained, but quicker-cut than "Linear/Anthropic" — shorter holds, faster
  turnover between beats. No spins, no elastic, no hard snaps.

**Hook-beat exception (first ~10s + intro cutaways — long-form reference video feedback).** The opening
sequence runs HOTTER than the body: branded app-UI spectacle (e.g. the Claude Editor shell) with
the creator's REAL footage inside, editing visibly happening ON the footage (auto-captions,
punch-in + flash, color-grade wipe, lower-third, SFX chip, ripple-deletes on a timeline), overshoot
pops allowed, and a climax stamp. The discipline that keeps it premium instead of chaotic:
**one readable editing event at a time**, each synced to its narration word — never two headline
events at once. Escalate: scan → cut → punch-in → grade → fly-in → stamp.

**Step markers & punchlines (long-form reference video feedback).** Every "step N" narration line gets the
full-screen StepTitle card (`remotion/src/lib/step-title.tsx`), label block-wiping on its word. When
a line turns personal or lands a punchline ("the only thing I record is my face", "sorry video
editors"), cut back to the creator FULL SCREEN with a slow punch-in — graphics never cover a
punchline. Face gags match the line's tone: playful joke = mime-bump squash; dry line = dry zoom,
no gag.

**Real assets over generic icons (creator feedback, 2026-09-03) — the DEFAULT, not an upgrade.**
When a beat names a real-world thing a viewer could recognize — a company, a person, a city/country,
a real product/app, a real job posting — the B-roll for that beat is a REAL photo or a REAL
screenshot of it, sourced live, not a generic lucide-icon graphic or a hand-drawn UI clone. Icon/text
cards (`TopCard`, the icon-based scenes in `lib/kit.tsx`) are the FALLBACK for abstract concepts only
(a stat, a process step, an emotion) that have no real-world image to show. Concretely, per beat:
  - **Company / person / place / logo** → search it, then pull the real asset: `WebSearch`/the Browser
    tool to find it (company site, Wikipedia, Wikimedia Commons, the company's own press/about page,
    LinkedIn/YC profile), then `curl`/download the actual file into `media/projects/<video>/real/`.
    Never redraw a company's logo or a city skyline from memory or an icon — fetch the real one.
  - **A real website / app / job posting** → capture it live with `tools/capture_web.py`
    (Playwright; installed 2026-09-03 — `playwright` is now in `requirements.txt`, run
    `playwright install chromium` once per machine) pointed at the REAL public URL, not a hand-coded
    clone. Saves real PNGs + `manifest.json` to `media/projects/<video>/real/`, which
    `lib/screencast.tsx` (via `/fake-screencast`) replays with a simulated cursor, scroll, and clicks —
    this is a real state capture, not a redrawn mockup. `WebBrowserFrame` (`lib/browser.tsx`) is the
    chrome to frame a single real screenshot when a beat only needs one static real page, not a
    click-through.
  - **Motion on a real photo** (no site to scroll, just a picture): Ken Burns — slow
    `scale 1.0→1.12` + a small `translateX/Y` drift over the beat's full hold, `EASINGS.easeOut`,
    same technique `screencast.tsx`'s payoff zoom already uses. Never a static, un-animated photo.
  - **Sourcing hygiene:** prefer official/openly-licensed sources (the entity's own site/press page,
    Wikimedia Commons, YC/Crunchbase-style profile pages) over random image-search results —
    especially for anything that leaves the editor's own machine (a pitch sent to the actual company,
    a public upload). A company's own logo/photo used to reference that company in an outreach video
    addressed to them is low-risk; a stranger's copyrighted stock photo is not worth the risk when an
    official source exists.
  - **Escalation is still real, not decorative.** The "hook-beat exception" above (spectacle, punch-in,
    stamp) still applies on TOP of real assets — a real screenshot can still get a punch-in + flash +
    ripple treatment; what changes is the *source* of the pixels (real capture vs. drawn icon), not
    whether motion is allowed.
See §10 for the sound this pairs with (`camera-snap`) and §8 for where captures live on disk.

## 7. Video delivery specs

- **Canvas:** 1080×1920 (vertical, 9:16), **30 fps** — this content ships to Reels, Shorts, and
  LinkedIn feed, not YouTube landscape. Matches the source (AI-avatar renders, not personal-camera
  footage), so 1080×1920 @30fps is the safe target (and must keep matching the master cut's real
  frame rate if the pipeline ever changes).
- **Safe margins:** keep text ≥ 5% from edges (title-safe ~7.5%) on the left/right — but top and
  bottom are governed by real platform UI overlap, not a design choice:
  - **Top ~10–14%** is where Reels/TikTok/Shorts place the account handle, follow button, and
    (on some surfaces) a pinned-comment or sound chip. Keep key text and the wordmark clear of it.
  - **Bottom ~18–22%** is the densest UI zone — caption stack, like/comment/share rail, "sound"
    ribbon — and on LinkedIn feed it's where the post-caption truncation line sits. Lower-thirds and
    end-card sign-off text land *above* this band, not inside it.
- **Talking head is CENTER-framed**, sized to leave the top and bottom UI-overlap zones clear.
  Overlays live in the safe middle band, or become **full-screen cutaways** (cut away from the
  presenter entirely to a full-screen TSX beat). Never cover the center-framed presenter, and never
  place a key readable element inside the top/bottom platform-UI zones above.
- **Overlay types:** lower-third (name/term), keyword callout, full-screen statement/section card,
  animated diagram, UI/terminal mockup (TSX-first).
- **Visual editing rules** (honored by `/make-tsx`): concept beats = full-screen cutaways; overlays only
  for small persistent CTAs/badges; visuals sync to narration and never pre-empt it; real UI / real pages
  for config and service facts.
- **Captions — long-form (16:9 landscape):** overlays only, not word-level captions. A caption is a
  single short phrase that fades/rises in as one unit, timed to a narration word — never a continuous
  per-word reveal through a sentence.
- **Captions — short-form (9:16 vertical, this channel's actual delivery format):** word-by-word bold
  captions ARE the expected look here, not an exception to avoid. Reels/Shorts/TikTok-native audiences
  read the format as default, not decoration. One active word at a time, bold monospace-style
  (`FONT_MONO`, weight 700), popping in exactly on its `edited-transcript.json` timestamp, replacing
  the previous word — not a rolling multi-word line. Sits just above the bottom platform-UI-reserved
  band (§7 safe zones), never inside it. This is a separate overlay layer from top-half statement-card
  graphics, not a replacement for them — captions track speech continuously; statement cards mark
  specific beats.

## 8. Asset & source locations

- Master (example): `videos/video-1/reference/<cut>.mp4` · edited transcript:
  `videos/video-1/work/edited-transcript.json` (word times in the master timeline).
- Reusable brand assets: `media/library/` (typed folders — `logos/ sfx/ music/ faces/` each with an
  index/catalog). Per-video generated assets: `media/projects/<video>/`, referenced from shots as
  `staticFile('projects/<video>/x')`.
- **Real-sourced assets for one video** (§6 "real assets over generic icons"): live under
  `media/projects/<video>/real/` — real photos/logos pulled via `curl`/the Browser tool, and real
  website captures from `tools/capture_web.py` (which also writes a `manifest.json` there mapping
  each PNG to its `url_label`/`title`, ready for `/fake-screencast`). Same `staticFile()` referencing
  as any other per-video asset; kept in its own `real/` subfolder just so it's obvious at a glance
  which assets are genuine captures vs. hand-drawn.
- Brand tokens as code: `remotion/src/brand.ts` (keep it in sync with this file).

## 9. Locked decisions & still-open

- **Brand = credible navy career-strategy look** — navy accent, warm-gray base, same 3-font system. ✓
- **Motion = calm & premium, cut punchier** — restrained fade-and-rise, no bounce, but tighter
  entrance/exit/stagger timing than the reference default (§6). ✓
- **Framing = centered** — overlays top/bottom band or full-screen cutaway; never cover center. ✓
- **Delivery = 1080p30**, matching the AI-avatar render pipeline (§7). ✓
- **SFX taste (step 4):** subtle premium accents, kept as default. See §10.
- **B-roll = real assets by default** (creator feedback, 2026-09-03) — a real photo/logo/screenshot
  of the actual thing named, not a generic icon or a hand-drawn clone; icons are the fallback only
  for abstract concepts with nothing real to show. See §6. ✓

*(Ships as a template brand — navy, credible-and-quick. Run `/brand-setup` to make it yours; re-run it any
time the brand changes.)*

## 10. Sound design — SFX

Same energy as the motion: **calm/premium, felt-not-heard.** Reference feel is Linear / Anthropic /
Vercel product sound, NOT MrBeast-loud. SFX are seasoning on the edit, never the show.

**Choose every cue by its FUNCTION** (the pro-editor model — 3+1 foundational sounds do the heavy
lifting; thousands of files are a trap). Ask what the beat needs:

| Function | Sound | Its job | Our (calm) sub-types |
|---|---|---|---|
| **Motion** | whoosh | direction/speed; carry one shot into the next | `whoosh-soft` (quick cut), `whoosh-wind` (soft, gliding) |
| **Tension** | riser | "something is coming"; hold on the edge before a reveal | `riser-soft` (gentle; NO cymbal-urgency riser) |
| **Emphasis** | impact / pop | "this moment matters"; lands as the new shot appears | `impact-soft`, `impact-deep-soft` (reveal, long tail), `pop-reveal` (UI reveal) |
| **Snap** | click | small, satisfying, alive; a sequence of related shots each on a click | `ui-click-soft`, `ui-toggle-on`, `ui-send` |

Plus two brand-specific extras: `page-flip` (storybook) and `chime-reward` (the "free"/gift moment).

**`camera-snap` — the real-asset reveal cue (creator feedback, 2026-09-03).** Pairs with §6's
"real assets over generic icons": the moment a REAL photo or REAL screenshot lands on screen (not a
drawn icon) gets a tick-click camera-shutter snap — the sound of a picture being taken, not a UI
click. Function = Snap, but its OWN sub-type (`camera-snap`), reserved for real-asset reveals so it
stays a distinct, recognizable signature and doesn't blur into `ui-click-soft`'s UI-interaction
meaning. Not yet in `media/library/sfx/catalog.json` — add a `camera-snap` recipe to
`media/library/sfx/palette.json` (prompt: crisp analog SLR shutter click + tiny mechanical
wind-on tick, ~0.5s — ElevenLabs' Sound Effects API floor, dry/close-mic'd, no reverb) and generate it with `python tools/gen_sfx.py`
before the first video that needs it; library-first afterward like every other clip.

- **Taste — subtle premium accents.** Quiet, tasteful, always UNDER the voice. Silence is part of
  the mix; never wall-to-wall. Nothing ever pops louder than the voice.
- **Layer for the big moments (build-and-drop).** The magic is in stacking: **riser → impact** on a
  scripted reveal (e.g. "wait a few minutes … *boom*"), **whoosh → pop/impact** so a cut stands out.
  In the plan a layer is just two events at the same/adjacent `at_s` that sum. Reserve layering for the
  2–3 biggest moments; keep everything else single and sparse.
- **Density — propose only what really matters.** Score the signature moment of a beat, not every
  sub-frame. A click-sequence (3–4 related shots each on a click) counts as ONE gesture. **There is no
  optional tier**: the long-form reference video shipped 131 cues with 31 flagged `optional`, and the creator cut the whole
  tier wholesale at first listen. A cue you would flag as deniable is a cue you don't propose.
- **What does NOT earn a cue** (each of these was proposed on the long-form reference video and cut):
  · **clicks on decorative animation** — card cascades, chip runs, hover pops. A click-sequence earns
  its clicks only when the narration ENUMERATES the items and each click lands on the word (the kept
  tile/row runs); a purely visual run gets silence.
  · **whooshes on secondary cutaways** — whoosh the cuts that change the argument (step titles, a
  scene the narration pivots into), never every mid-beat panel, scrub, or B-roll arrival.
  · **ambient texture under speech** — soft typing, pencil scribbles, shimmers, draw-along winds. The
  static/glitch rule generalizes: ALL decorative texture, not just noisy texture.
  · **a second sound inside one gesture** — the extra pop after a whoosh, a riser on a minor reveal.
  Layering stays reserved for the 2–3 hero moments.
- **Sync — to the VISUAL beat, and often the exact word.** A click on the toggle flip; a pop on the
  reveal; a whoosh on the cutaway; the impact on the drop word. Time off the shot's animation frames
  AND `edited-transcript.json` word times.
- **Levels.** Library clips are loudness-normalized to **~−20 LUFS** with a −1.5 dBFS peak ceiling, so a
  plan's per-cue `gain_db` is perceptually meaningful. The voice is ~−17 LUFS, so gain sets how far
  under it a cue sits: **payoffs ~−5/−6 · transitions ~−6/−8 · bed/texture ~−9/−11.** The SFX bus is
  **lightly ducked under the voice** (gentle sidechain, ~4 dB) in the audition mix; final
  polish/ducking/loudness is the final-mix step's job.
- **Signature motif.** Pick a recurring UI sound (the example uses a "Free Image Generator" toggle click
  — intro enable → later callback), the same `ui-toggle-on`, as a small sonic through-line.
- **Meme gags — the sanctioned exception.** A deliberate, self-aware meme effect (fisheye snap +
  `meme-boom`, mime bump, crash zoom — the library is `remotion/src/lib/effects.tsx` + SFX category
  `meme`) is allowed **at most 1–2 times per video**, only on a playful punchline line, never on a dry
  or informational one. Its sound is the one cue allowed to be deliberately LOUD (positive `gain_db`) —
  the loudness IS the joke — and it must land as a hard snap on the punchline word, paired with its
  visual. Grammar: snap, not morph. More than two per video and the premium feel of everything else
  erodes; at that point cut the weakest.
- **What we deliberately do NOT do** (take the pro's *structure*, not the drama): cymbal-urgency risers,
  trailer-slam impacts, a whoosh on every movement, "funny" click+whoosh gags. **No static/glitch
  textures under narration** — glitch reads as NOISE over the voice at any gain; error/delete moments
  during speech get silence or one clean mechanical snap, never sustained static (save glitch textures
  for gaps where the voice is silent).
- **Source.** ElevenLabs **Sound Effects API** is primary (owned, consistent, reusable); curated
  royalty-free is the fallback. Every clip's `source` + `license` is recorded in the catalog.
- **Music.** No music bed in the SFX pass. Music (track selection + auto-ducking) is the **`/assemble`**
  step (§11) (`tools/gen_music.py` + `tools/mix_music.py`, drawing from `media/library/music/`).
- **Library is the durable asset.** Shared, cross-project at **`media/library/sfx/`** (`catalog.json` +
  `clips/`), seeded from `palette.json`, organized by function. It GROWS every video — reuse before
  generating (library-first). SFX that must live *inside* a Remotion shot go in `media/library/sfx/` via
  `staticFile()`.

## 11. Music bed & final mix — the `/assemble` step

The step-4 SFX pass never adds music (§10). This is step 5, the LAST step before packaging/upload:
lay a continuous instrumental bed under the whole video, ducked under the voice, then normalize
loudness for delivery. This is the "soothing background sound" every finance/job-search/AI-tech
education Reel/Short has running underneath — it is an ADDED instrumental bed, not part of the
original recording; creators license or generate one and loop/duck it under narration. It reads as
"just there" specifically because it's felt-not-heard, same taste as §10.

**The library already has 6 real generated beds** (`media/library/music/catalog.json`, ElevenLabs
Music API, ~63s loops, loudness-normalized to ~−20 LUFS): `ambient-pad` (calm minimal pad, no
drums — the safe universal default for this channel's navy/premium identity), `tech-pulse` (gentle
pulsing synth arp, forward-motion — AI/tech/data content), `lofi-warm` (mellow Rhodes + soft drums —
friendly how-to/tutorial tone), `cinematic-min` (sparse felt-piano — reflective/story beats),
`docu-pluck` (pizzicato + marimba — curious explainer), `lullaby-tender` (music box — storybook only).
Library-first: reuse one of these; only add a palette recipe + `gen_sfx.py`-style generation via
`tools/gen_music.py` for a genuinely new mood.

**Bed choice by content** — pick ONE, matched to the video's register, not the loudest option:
`ambient-pad` default · `tech-pulse` for AI/build/product content · `lofi-warm` for a warmer
personal-story or tutorial register · `cinematic-min` for a reflective/emotional beat · `docu-pluck`
for a curious/explainer register.

**Workflow:**
1. Audition every bed over the SFX-mixed video: `python tools/mix_music.py --all --base
   <video>-sfx.mp4` → one file per bed. Defaults (`--bed-gain -7 --duck 9 --fade 1.5`) are the brand
   defaults — only override with a stated reason.
2. **User-audit gate (hard, same as every other step).** Present the bed options; the user picks one
   (or asks for a different mood/gain). Don't skip to final on your own taste alone.
3. **Final loudness normalization** (no dedicated tool yet — a two-pass EBU R128 `loudnorm` on the
   chosen mix): target **−14 LUFS integrated, −1.5 dBTP true-peak** (the common Reels/Shorts/YouTube
   loudness target — louder than the −17 LUFS voice-only reference because the platforms themselves
   normalize down to around there, and mixing to it here avoids an inconsistent extra pass on upload).
   `ffmpeg -i in.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null -` for pass 1 (read
   the measured values), then a second `loudnorm` pass with `measured_*` set from pass 1 for a
   sample-accurate result; re-encode video stream-copy, audio AAC. Output `<video>-final.mp4` —
   this is the file that goes to `/packaging` → `tools/yt_upload.py`.
4. **Re-verify** the A/V duration gate one more time (§ everywhere else in this pipeline) — a
   loudnorm re-encode must not shift the video track's length.
