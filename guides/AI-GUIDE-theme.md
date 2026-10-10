# AI guide: making a Divee theme

> **For the person reading this:** paste this whole file into an AI chat (Claude, ChatGPT, Gemini …), then describe the theme you want, e.g. *"Make a Divee theme that looks like Tokyo Night"* or *"a warm beige theme with bigger text and rounder corners"*. The AI will give you two files. Put them in one folder and install it from Divee › Settings › Plugins › **Install from Folder…**.

---

## Your role

You are making a **theme** for Divee, a macOS menu bar app. A theme is **data only — no code**. It changes the colors of Divee's panel (the ⌥Space panel, its side panels, the floating panel and speech bubbles) and, optionally, the font, text size, corner roundness and row spacing.

Reply to the user in **the language they write in**. Ask at most one short question if the request is too vague to pick colors; otherwise just make it.

## What to output

Exactly **one folder with two files**. Show each file in its own code block, with the file name above it.

```
<author>.<theme-name>/
  manifest.json
  theme.json
```

- The folder name **must equal** the `id` in manifest.json.
- `id` = `author.name`, lowercase letters, digits and hyphens only (e.g. `jane.tokyo-night`). If you don't know the user's name, use `me` and tell them they can change it.
- Optional third item: font files (`.ttf` / `.otf`) — only if the user has a font file and names it. Otherwise use a font that ships with macOS (see below). Divee asks the user before it installs a theme's fonts; until they approve, the theme shows with the system font.

## manifest.json

```json
{
  "id": "jane.tokyo-night",
  "name": "Tokyo Night",
  "version": "1.0.0",
  "type": "theme",
  "apiVersion": 1,
  "author": "jane",
  "description": "One sentence about the theme."
}
```

Rules: `type` is `"theme"`. `apiVersion` is `1`. `version` looks like `1.0` or `1.0.0`. `name` is 1–40 characters. **Never add `permissions` or `main`** — themes can't have them. If the theme bundles font files, add `"fonts": ["MyFont-Regular.otf"]` (file names in the same folder).

## theme.json

```json
{
  "appearance": "dark",
  "colors": { "background": "#1a1b26", "textPrimary": "#c0caf5", "accent": "#7aa2f7" },
  "shape": { "fontScale": 1.0, "panelRadius": 12, "density": "normal" }
}
```

- `appearance`: `"dark"`, `"light"` or `"system"`. It sets how macOS controls (text field, toggles) are drawn — match it to the background.
- Colors are `#rrggbb` or `#rrggbbaa` (hex only — no `rgb()`, no color names).
- Only `background`, `textPrimary` and `accent` are really needed; Divee derives the rest. Filling more tokens gives a more faithful theme.
- `shape` is optional. Leave it out for a colors-only theme.

### Color tokens (`colors`)

| token | where it shows |
|---|---|
| `background` | panel, side panels, floating panel, bubbles |
| `surface` | a slightly raised area inside cards (input field, sections) |
| `cardFill` | faint module card background |
| `hoverFill` | faint highlight of a row under the mouse |
| `border` | panel outline |
| `separator` | divider lines |
| `textPrimary` | main text |
| `textSecondary` | secondary text |
| `textTertiary` | faintest text (hints, captions) |
| `accent` | checkmarks, bars, links, the "on" state of buttons |
| `onAccent` | text/icons drawn on top of `accent` |
| `selectionFill` | the selected row's fill |
| `selectionText` | text on the selected row |
| `sliderTrack` | empty part of a slider |
| `sliderFill` | filled part of a slider |
| `sliderOnFill` | text/icon on the filled part |
| `sliderOnTrack` | text/icon on the empty part |
| `statusOK` / `statusWarn` / `statusDanger` / `statusActive` | status colors: fine · caution · danger · in progress |

### Shape tokens (`shape`, all optional)

| token | values | notes |
|---|---|---|
| `fontFamily` | a font name, e.g. `"Avenir Next"` | must be installed on the Mac or bundled via `fonts`; otherwise Divee falls back to the system font |
| `monoFamily` | font name for numbers/code | default: system monospaced |
| `fontScale` | `0.9` – `1.25` | text size multiplier |
| `panelRadius` | `0` – `20` | panel corners (default 12). Set only this one and cards (8) and buttons (6) follow proportionally |
| `cardRadius`, `controlRadius` | `0` – `20` | override individually if needed |
| `density` | `"compact"` · `"normal"` · `"comfortable"` | row height 26 / 30 / 34 |
| `backgroundOpacity` | `0.7` – `1.0` | panel background opacity |
| `borderWidth` | `0` – `2` | outline thickness (0 = none) |

Fonts that come with every Mac and work well: `Avenir Next`, `Helvetica Neue`, `Futura`, `Gill Sans`, `Optima`, `Menlo` (mono), `Courier New` (mono), `Apple SD Gothic Neo` (Korean).

## Rules for good results

1. **Contrast:** `textPrimary` vs `background` must be at least **4.5:1** (Divee warns below 3:1). `textSecondary` at least 3:1. `selectionText` vs `selectionFill` and `onAccent` vs `accent` at least 4.5:1.
2. `appearance` must match the background: dark background → `"dark"`, light → `"light"`.
3. Keep `hoverFill` subtle (a few steps from `background`) and `selectionFill` clearly visible.
4. Status colors must stay distinguishable from each other (green-ish / yellow-ish / red-ish / blue-ish), unless the user asks for a monochrome theme.
5. Don't invent keys. Unknown keys are ignored and shown as a warning.

## Converting a VS Code theme

If the user names a VS Code theme, map its colors like this:

| Divee token | VS Code color |
|---|---|
| `background` | `editor.background` |
| `surface` | `input.background` (or `sideBar.background`) |
| `cardFill` | `sideBar.background` |
| `hoverFill` | `list.hoverBackground` |
| `border` | `panel.border` (or `editorGroup.border`) |
| `separator` | `editorGroup.border` |
| `textPrimary` | `editor.foreground` |
| `textSecondary` | `descriptionForeground` (or `sideBar.foreground`) |
| `textTertiary` | `editorLineNumber.foreground` |
| `accent` | `button.background` (or `focusBorder`) |
| `onAccent` | `button.foreground` |
| `selectionFill` | `list.activeSelectionBackground` |
| `selectionText` | `list.activeSelectionForeground` |
| `statusOK` | `terminal.ansiGreen` |
| `statusWarn` | `editorWarning.foreground` |
| `statusDanger` | `editorError.foreground` |
| `statusActive` | `terminal.ansiCyan` (or `terminal.ansiBlue`) |

Use the real values from the theme if you know them; otherwise pick close colors and say so.

## Before you answer, check

- [ ] Folder name = `id`, `id` matches `author.name` (lowercase, digits, hyphens)
- [ ] manifest has `"type": "theme"`, `"apiVersion": 1`, no `permissions`
- [ ] every color is `#rrggbb` / `#rrggbbaa`; only tokens from the table
- [ ] contrast rules met; `appearance` matches the background
- [ ] shape numbers inside the ranges
- [ ] end with the install steps below

## Install steps to give the user

1. Make a folder named exactly like the `id` and save both files inside it.
2. Divee › Settings › **Plugins** › **Install from Folder…** → choose the folder.
3. Settings › General › Theme → pick the new theme.
4. If something is wrong, the Plugins tab shows it in plain words — press **Copy Fix Request for AI** and paste the copied text back into this chat.

## Full example (light theme with shape)

`jane.solarized-light/manifest.json`
```json
{ "id": "jane.solarized-light", "name": "Solarized Light", "version": "1.0.0", "type": "theme", "apiVersion": 1,
  "author": "jane", "description": "Warm cream background, bigger text, rounder corners." }
```

`jane.solarized-light/theme.json`
```json
{
  "appearance": "light",
  "colors": {
    "background": "#fdf6e3", "surface": "#eee8d5", "border": "#d9d2bd",
    "textPrimary": "#586e75", "textSecondary": "#657b83", "textTertiary": "#93a1a1",
    "accent": "#268bd2", "onAccent": "#fdf6e3",
    "statusOK": "#859900", "statusWarn": "#b58900", "statusDanger": "#dc322f", "statusActive": "#2aa198"
  },
  "shape": { "fontFamily": "Avenir Next", "fontScale": 1.1, "panelRadius": 16, "density": "comfortable" }
}
```
