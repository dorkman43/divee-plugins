**English** · [한국어](README.ko.md)

# Divee Plugins

Themes, mascots and plugins for [Divee](https://github.com/dorkman43/divee), the little macOS menu bar helper.

**You don't need to code.** Each kind has an **AI guide**: paste it into an AI chat (Claude, ChatGPT, Gemini …), say what you want, and the AI gives you a ready-to-install folder.

> Plugins need **Divee 1.0.8 or later** — [download Divee](https://github.com/dorkman43/divee/releases/latest/download/Divee.dmg) (Settings › Plugins). Local network devices (`localNetwork`) need **1.0.9 or later**.

| Kind | Folder | AI guide | Status |
|---|---|---|---|
| 🎨 Themes — colors, font, text size, corners, spacing | [`themes/`](themes) | [AI-GUIDE-theme.md](guides/AI-GUIDE-theme.md) | ✅ open |
| 🐾 Mascots — replace the menu bar character | [`mascots/`](mascots) | [AI-GUIDE-mascot.md](guides/AI-GUIDE-mascot.md) | ✅ open |
| 🧩 Plugins — new commands and cards (JavaScript) | [`plugins/`](plugins) | [AI-GUIDE-plugin.md](guides/AI-GUIDE-plugin.md) | ✅ open |

## Themes

| Tokyo Night | Solarized Light |
|---|---|
| <img src="images/tokyo-night.png" width="300" alt="Tokyo Night theme"> | <img src="images/solarized-light.png" width="300" alt="Solarized Light theme"> |
| Colors only | Colors + font (Avenir Next), 110 % text, rounder corners, roomy rows |

## Mascots

<img src="images/blob.png" width="560" alt="Blob mascot: normal, happy, alert, sleepy">

**말랑이 (Blob)** — SVG drawings plus one PNG. Divee adds the bounce, the red-and-steam when your Mac is hot and the fade on low battery by itself; the pack only supplies the pictures.

Make one: paste [guides/AI-GUIDE-mascot.md](guides/AI-GUIDE-mascot.md) into an AI chat and describe the character (*"a sleepy orange cat"*, *"my white fluffy dog with a red collar"*). Install it the same way as a theme, then pick it in Settings › General › **Mascot**.

## Plugins

Plugins add commands and cards to Divee's quick input with a little JavaScript. Two official ones ship inside Divee and are here to read and adapt:

- **환율 (`divee.currency`)** — type `100달러`, `5만원 달러로` or `엔화 환율` and get a converted card at the European Central Bank rate. Permission: network to `api.frankfurter.dev` only.
- **특수문자 (`divee.symbols`)** — symbols like □ ● → ※ as chips in the panel; click to copy. No permissions.

**Plugins are code**, so Divee asks for the permissions a plugin needs (network hosts, clipboard, notifications, AI tools) when you install it. Read the list before you accept. Themes and mascots never ask.

Make one: paste [guides/AI-GUIDE-plugin.md](guides/AI-GUIDE-plugin.md) into an AI chat and describe what you want (*"a card that turns '3 miles' into km"*). To tweak an official plugin, download its folder, edit it and install it with **Install from Folder…** — with the same `id`, yours wins over the built-in one.

## Make your own theme with AI

1. Open [guides/AI-GUIDE-theme.md](guides/AI-GUIDE-theme.md), copy the whole file and paste it into an AI chat.
2. Say what you want, e.g. *"a Divee theme like Dracula"* or *"warm beige, bigger text, rounder corners"*.
3. The AI gives you a folder with `manifest.json` and `theme.json`. Save them in a folder named exactly like the `id`.
4. Install it (below), then pick it in Divee › Settings › General › **Theme**.

If anything is wrong, Divee › Settings › **Plugins** shows the problem in plain words. Press **Copy Fix Request for AI** and paste it back into the same chat.

Just want a slightly different look? Divee › Settings › General › Theme › **My Tweaks** changes font, text size, corners, spacing, background opacity and borders on top of any theme — no files needed.

## Install

1. Download this repository (**Code › Download ZIP**) or just the folder you want.
2. Divee › Settings › **Plugins** › **Install from Folder…** → choose the folder (e.g. `themes/dorkman.tokyo-night`, `mascots/dorkman.blob` or `plugins/divee.symbols`).
3. Settings › General › **Theme** (or **Mascot**) → select it.

Themes and mascots are data only — they can't run code or ask for permissions. Plugins run code and ask for their permissions at this step.

## Share yours

Pull requests are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Add your folder under `themes/`, `mascots/` or `plugins/` and an entry in [`index.json`](index.json).

## License

[MIT](LICENSE) — each item belongs to its author, listed in its `manifest.json`.
