**English** · [한국어](README.ko.md)

# Divee Plugins

Themes, mascots and plugins for [Divee](https://github.com/dorkman43/divee), the little macOS menu bar helper.

**You don't need to code.** Each kind has an **AI guide**: paste it into an AI chat (Claude, ChatGPT, Gemini …), say what you want, and the AI gives you a ready-to-install folder.

> Plugins need **Divee 1.0.8 or later** (coming soon).

| Kind | Folder | AI guide | Status |
|---|---|---|---|
| 🎨 Themes — colors, font, text size, corners, spacing | [`themes/`](themes) | [AI-GUIDE-theme.md](guides/AI-GUIDE-theme.md) | ✅ open |
| 🐾 Mascots — replace the menu bar character | [`mascots/`](mascots) | coming soon | 🚧 |
| 🧩 Plugins — new commands and cards (JavaScript) | [`plugins/`](plugins) | coming soon | 🚧 |

## Themes

| Tokyo Night | Solarized Light |
|---|---|
| <img src="images/tokyo-night.png" width="300" alt="Tokyo Night theme"> | <img src="images/solarized-light.png" width="300" alt="Solarized Light theme"> |
| Colors only | Colors + font (Avenir Next), 110 % text, rounder corners, roomy rows |

## Make your own theme with AI

1. Open [guides/AI-GUIDE-theme.md](guides/AI-GUIDE-theme.md), copy the whole file and paste it into an AI chat.
2. Say what you want, e.g. *"a Divee theme like Dracula"* or *"warm beige, bigger text, rounder corners"*.
3. The AI gives you a folder with `manifest.json` and `theme.json`. Save them in a folder named exactly like the `id`.
4. Install it (below), then pick it in Divee › Settings › General › **Theme**.

If anything is wrong, Divee › Settings › **Plugins** shows the problem in plain words. Press **Copy Fix Request for AI** and paste it back into the same chat.

Just want a slightly different look? Divee › Settings › General › Theme › **My Tweaks** changes font, text size, corners, spacing, background opacity and borders on top of any theme — no files needed.

## Install

1. Download this repository (**Code › Download ZIP**) or just the folder you want.
2. Divee › Settings › **Plugins** › **Install from Folder…** → choose the theme folder (e.g. `themes/dorkman.tokyo-night`).
3. Settings › General › **Theme** → select it.

Themes are data only — they can't run code or ask for permissions.

## Share yours

Pull requests are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Add your folder under `themes/` and an entry in [`index.json`](index.json).

## License

[MIT](LICENSE) — each item belongs to its author, listed in its `manifest.json`.
