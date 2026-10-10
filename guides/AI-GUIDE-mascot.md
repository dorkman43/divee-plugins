# AI guide: making a Divee mascot

> **For the person reading this:** paste this whole file into an AI chat (Claude, ChatGPT, Gemini …), then describe the character, e.g. *"a sleepy orange cat mascot"* or *"my dog Coco: a white fluffy puppy with a red collar"*. The AI gives you a folder of small SVG drawings. Install it from Divee › Settings › Plugins › **Install from Folder…**, then pick it in Settings › General › Mascot.

---

## Your role

You are making a **mascot pack** for Divee, a macOS menu bar app. The mascot is a small character shown in the menu bar and at the top of Divee's panel. A mascot pack is **pictures only — no code**. Divee adds the reactions itself: it bounces, turns red with steam when the Mac is hot, fades when the battery is low, and switches to your expression pictures when it's happy, alert, sleepy and so on.

Reply to the user in **the language they write in**. If they describe a real pet or person, draw a simple cute cartoon, not a realistic portrait.

## What to output

One folder. Show each file in its own code block with the file name above it.

```
<author>.<mascot-name>/
  manifest.json
  normal.svg          ← required
  happy.svg  alert.svg  sleepy.svg  thinking.svg  sorry.svg  blink.svg   ← optional, recommended
  menubar-light.svg  menubar-dark.svg                                   ← optional
```

- The folder name **must equal** `id` in manifest.json. `id` = `author.name`, lowercase letters, digits and hyphens only (e.g. `jane.sleepy-cat`). Unknown name → use `me`.
- Make at least `normal`, `happy`, `sleepy` and `blink`. Missing expressions fall back to `normal` (Divee shows a gentle warning, that's fine).

## manifest.json

```json
{
  "id": "jane.sleepy-cat",
  "name": "Sleepy Cat",
  "version": "1.0.0",
  "type": "mascot",
  "apiVersion": 1,
  "author": "jane",
  "description": "One sentence about the character.",
  "images": {
    "normal": "normal.svg",
    "happy": "happy.svg",
    "alert": "alert.svg",
    "sleepy": "sleepy.svg",
    "thinking": "thinking.svg",
    "sorry": "sorry.svg",
    "blink": "blink.svg",
    "menubarLight": "menubar-light.svg",
    "menubarDark": "menubar-dark.svg"
  }
}
```

Rules: `type` is `"mascot"`, `apiVersion` is `1`, `version` like `1.0.0`, `name` 1–40 characters. **Never add `permissions` or `main`.** `images` keys may only be: `normal`, `happy`, `alert`, `sleepy`, `thinking`, `sorry`, `blink`, `menubarLight`, `menubarDark`. Values are file names in the same folder ending in `.svg` or `.png`. List only files you actually made. A `.png` must be at most 4096 px on each side and 5 MB (Divee shows it at up to 1024 px).

## Drawing rules (SVG)

1. **Same canvas for every picture.** Use `viewBox="0 0 200 180"` with `width="200" height="180"`, transparent background (no background rectangle). The character fills most of the canvas, centered, feet/bottom near the lower edge.
2. **Identical body in every expression.** Copy the exact same body shapes into each file; change only the face (eyes, mouth, small extras like "!" or "z"). Expressions are swapped instantly, so any change in body position looks like a jump.
3. **Simple and bold.** It's shown as small as 22 pt. Use a few large shapes, thick strokes (≥ 6 units), big eyes. No text, no thin details, no drop shadows.
4. **Plain SVG only:** `path`, `circle`, `ellipse`, `rect`, `polygon`, `line`, `g`, `linearGradient`/`radialGradient`. No `<image>`, no `<text>`, no `<foreignObject>`, no filters, no CSS animations, no scripts. No external references: `href`/`xlink:href` and `url(...)` may only point to `#id` inside the same file; no `@import`, no `<!ENTITY>`. Divee rejects an SVG that breaks this.
5. Expressions:
   - `normal` — calm, eyes open
   - `happy` — smiling, eyes as ^ ^ arcs
   - `alert` — eyes wide, small "!" allowed
   - `sleepy` — eyes half-closed or lines, small "z" allowed
   - `thinking` — eyes looking up/sideways
   - `sorry` — eyebrows tilted down, small frown
   - `blink` — like `normal` but eyes closed (curved lines)
6. **Menu bar pictures (optional):** a **single-color silhouette** of the head/body on a transparent background, `viewBox="0 0 200 180"`. `menubar-light.svg`: black shape (`#000000`) for light menu bars; `menubar-dark.svg`: white shape (`#ffffff`) for dark menu bars. Make the eyes **holes** (cut out — use `fill-rule="evenodd"` or a mask) so they read at 16 pt. If you skip these, Divee makes a silhouette from `normal` automatically.

## Before you answer, check

- [ ] Folder name = `id`; `id` is `author.name` (lowercase, digits, hyphens)
- [ ] manifest: `"type": "mascot"`, `"apiVersion": 1`, `images.normal` present, only allowed keys, no `permissions`
- [ ] every listed file is included; every SVG uses `viewBox="0 0 200 180"`, transparent background
- [ ] the body is identical in all expression files
- [ ] no `<image>`, `<text>`, filters, scripts or external links
- [ ] end with the install steps below

## Install steps to give the user

1. Make a folder named exactly like the `id` and save all files inside it (as plain text files with the given names).
2. Divee › Settings › **Plugins** › **Install from Folder…** → choose the folder.
3. Settings › General › **Mascot** → pick the new mascot.
4. If something is wrong, the Plugins tab says so in plain words — press **Copy Fix Request for AI** and paste the text back into this chat.
