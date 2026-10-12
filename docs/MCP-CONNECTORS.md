# Optional connectors (MCP) for Shorts

**None of these are required.** The core pipeline (cut, build, sound, assemble) runs on the Python tools and Remotion in this repo.
Connectors give Claude extra reach: fetching footage, generating images or video, researching what to post, finding real assets.

Each connector has its own account, plan and limits. Several were on free tiers when we tried them, and that decided what we
could actually do.

## How to connect one

- **claude.ai connectors** (HeyGen, Canva, Figma, Notion, VidIQ and similar): enable them in your Claude connector settings and
  complete the sign-in yourself. In Claude Code, `/mcp` shows the state of each server.
- **Never paste tokens or authorisation codes into the chat.** Claude cannot start a sign-in for you, and it should not see your
  secrets. If a connector says it needs authorising, do that in the settings page it points to.
- A connector failing to connect (for example "Dynamic Client Registration rejected") is a connection problem, not proof the
  capability is missing. Retry or check the vendor's status.

## What we used, what we only explored

Honest accounting for the two reference Shorts:

| Connector | What it can do for a Short | Used in the example Shorts? |
|---|---|---|
| **HeyGen** | list avatars and voices, create avatar videos, upload assets, fetch a finished video's download URL | **Yes, for the source footage.** We used it to look up a finished avatar video and download it. Creating *new* videos failed on a free plan (see [AVATAR-FOOTAGE.md](AVATAR-FOOTAGE.md)) |
| **Claude's browser tools + Playwright** | open real pages, screenshot them, read their text | **Yes, for the real-asset workflow** ([REAL-ASSETS-BROLL.md](REAL-ASSETS-BROLL.md)); demonstrated on a real company site, then codified |
| **Web search / fetch** | find the real company, the real logo URL, current prices and free tiers | Yes |
| **OpenArt** | image models (several), video models including lip-sync with an audio reference, cost quotes | **Explored only.** We read the model list, forms and prices. The account had 40 credits, so nothing was generated |
| **VidIQ** | keyword research, trending and outlier search, title and thumbnail scoring and generation, script generation, B-roll and clip generation, voiceover, publishing helpers | Not used. Its tool names suggest it is useful for *choosing* topics and titles before you record |
| **Creative-generation connector** (tools named `creative_*`) | speech and voice design, image and video generation, transcription | Not used |
| **Canva** | generate and edit designs, remove backgrounds, export | Not used. Useful for thumbnail or cover assets |
| **Figma** | read designs, generate diagrams | Not used |
| **Gamma** | generate decks and pages | Not used. Not a Shorts tool |
| **Notion** | content tracker | Not used. The repo's own `tools/notion_sync.py` talks to the Notion API directly with your `NOTION_TOKEN` |
| **Adobe for creativity** (sign-in required) | quick-cut highlight reels, resizing and social variations | Not used |

"Not used" means exactly that: we did not run it for these videos, so we make no claim about quality.

## Where a connector would slot into the pipeline

```
 idea / topic ──▶ footage ──▶ cut ──▶ build ──▶ sound ──▶ assemble ──▶ upload
 VidIQ            HeyGen /     (local)  real assets:      (local)     (local)
 (research)       your camera           Playwright,
                                        browser, search,
                                        Canva / OpenArt
                                        for generated art
```

## Cost awareness

Connectors spend the connected account's credits. Before asking Claude to generate video or images, ask it to **quote the price
first** (OpenArt exposes a cost endpoint) and to check your balance. Video with lip-sync is by far the expensive case: see the
numbers in [AVATAR-FOOTAGE.md](AVATAR-FOOTAGE.md). Claude should never buy credits or change a plan for you. That is your action.
