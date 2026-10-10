# AI guide: making a Divee plugin

> **For the person reading this:** paste this whole file into an AI chat (Claude, ChatGPT, Gemini …), then describe what you want, e.g. *"a card that turns '3 miles' into kilometers"* or *"a command that copies today's date"*. The AI gives you two files (`manifest.json` and `main.js`). Put them in one folder and install it from Divee › Settings › Plugins › **Install from Folder…**. Divee shows the permissions the plugin asks for — read them before you accept.

---

## Your role

You are writing a **plugin** for Divee, a macOS menu bar app (needs Divee 1.0.8 or later). A plugin is a small JavaScript program that adds **commands** (things you run from the ⌥Space panel) and **cards** (answers shown under the quick input, like a unit converter) and can fill the panel's expandable section. Plugins draw nothing themselves: they return plain data and Divee draws it.

Reply to the user in **the language they write in**. Ask at most one short question if the request is too vague; otherwise just make it. Write the plugin's visible texts (titles, keywords) in the language the user will type in.

Ask for the **fewest permissions** that work. If a plugin can work without a permission, don't request it.

## What to output

Exactly **one folder with two files**. Show each file in its own code block with the file name above it.

```
<author>.<plugin-name>/
  manifest.json
  main.js
```

- The folder name **must equal** `id` in manifest.json. `id` = `author.name`, lowercase letters, digits and hyphens only, one dot (e.g. `jane.mile-converter`). If you don't know the user's name, use `me`.
- Allowed extra files: `.js .json .svg .png .ttf .otf .md .txt` only; no hidden files, no symlinks, at most 200 files / 10 MB. Normally you need just the two files.

## manifest.json

```json
{
  "id": "jane.mile-converter",
  "name": "Mile Converter",
  "version": "1.0.0",
  "type": "plugin",
  "apiVersion": 1,
  "author": "jane",
  "description": "One sentence: what it does.",
  "main": "main.js",
  "permissions": { "network": ["api.example.com"], "clipboard": true },
  "settings": [
    { "key": "unit", "title": "Unit", "type": "choice", "default": "km", "choices": ["km", "m"] }
  ]
}
```

Rules:
- `type` is `"plugin"`, `apiVersion` is `1`, `version` looks like `1.0` or `1.0.0`, `name` is 1–40 characters, `main` is a `.js` file in the same folder (default `main.js`).
- Optional `minDivee` (e.g. `"1.0.8"`).
- **Never add `defaultEnabled`** (only for plugins bundled inside Divee; it makes installation fail).
- `permissions` — leave the whole object out if nothing is needed. Keys (all optional):
  - `network`: list of **public** hosts `divee.fetch` may reach. Exact host `"api.example.com"` or `"*.example.com"`. Host names only: no `https://`, no path, no port, no bare `*`. **`*.example.com` matches subdomains only, not `example.com` itself** — list both if you need both. Too-broad wildcards are rejected: `*.com`, `*.co.kr`, `*.github.io` and other shared suffixes — name the real site (`*.mysite.github.io`). IP addresses, `localhost` and `.local` names are **not** allowed here — use `localNetwork`. Public hosts are **https only** with a normal certificate.
  - `localNetwork`: list of devices on the user's own network or Mac — only when the plugin is really for such a device (NAS, router, Home Assistant, a local server). Exact addresses only: a private IPv4 (`192.168.x.x`, `10.x.x.x`, `172.16–31.x.x`, `127.x.x.x`, `169.254.x.x`, `100.64–127.x.x`), `localhost`, or `name.local`. No `*`, no public IPs, no IPv6, no port/path/`http://` in the list. For these devices `fetch` may use **http or https (self-signed certificates are accepted)**, and the URL may include a port, e.g. `http://192.168.0.20:8123/api/states`. Divee shows the user a ⚠︎ warning for each device and asks again if you add one; on macOS 15+ the system also asks for “Local Network” access the first time. Redirects stay inside the same list: a public server can't send you to a local device and a device can't send you to a public host (that fetch fails). When a redirect changes scheme, host or port, `Authorization`/`Cookie` headers are dropped. Cautions: any device on the same network can answer for a `name.local` name, so send tokens over https and prefer a fixed IP; `100.64–127.x.x` is Tailscale but also ISP shared space — use it only for your Tailscale devices. Keep passwords and tokens in a `secret` setting.
  - `clipboard`: `true` → `divee.clipboard.write` (only inside a `run` — see Effects).
  - `notifications`: `true` → `divee.notify`.
  - `aiTools`: `true` → `divee.ai.registerTool`. (Divee always asks the user to confirm before a plugin's AI tool runs.)
  - `longRequests`: `true` → `fetch` may wait up to 600 s (and AI tools up to 620 s). Needs `network` or `localNetwork`. Only for slow servers.
- `settings` (optional): fields Divee draws in the plugin's settings. Each: `key` (starts with a letter, letters/digits/underscore, ≤ 40 chars, unique), `title`, `type` = `text` | `number` | `toggle` | `choice` | `secret`, optional `default` (text/choice → string, number → number, toggle → true/false; a `choice` default must be one of `choices`; `secret` can't have a default), `choices` (only for `choice`, non-empty, no duplicates), `placeholder`. Use `secret` for API keys (stored in the Keychain). Read values with `divee.settings.get(key)`.

## main.js — the `divee` API

`main.js` is plain JavaScript (ES5-style is safest; JavaScriptCore, no modules). The only global you get is `divee`. Everything else below is **all** there is.

### Commands — `divee.commands.register({ id, title, run, keywords?, icon? })`
A command appears in the panel's search. `id` and `title` required and non-empty; `id` unique in the plugin; `run` is a function called when the user picks it; `keywords` an array of strings (extra words that find it); `icon` an SF Symbols name (e.g. `"calendar"`).

### Cards — `divee.cards.register({ id, keywords, match })`
- `keywords` is **required and non-empty**. `match(query)` is **only called when the query contains one of the keywords** (case-insensitive substring). With no matching keyword your card never shows.
- `match` returns a **card**, `null` (no card), or a **Promise** of one (waits up to 5 s; use it for `divee.fetch`).
- A card: `{ title, value, subtitle?, rows?: [{ title, value }], copy?, open? }`. `title` non-empty string; `value` string or number; `copy` = text copied on Return; `open` = a `http://`, `https://` or `mailto:` URL opened on Return. Booleans/objects in text fields are errors.
- A synchronous `match` must finish within **30 ms**. Be conservative: return `null` unless the whole query clearly fits your pattern.

### Storage — `divee.storage.get(key)`, `.set(key, value)`, `.remove(key)`
Per-plugin, survives restarts. Values must be JSON-able (no functions/undefined). `get` returns `null` if missing. 1 MB total.

### Effects
- `divee.clipboard.write(text)` — needs `permissions.clipboard`. **Only inside a `run`** (a command's, a menu action's or an AI tool's, including after `await divee.fetch(...)` there). Refused in card `match` and while loading.
- `divee.notify(title, body?)` — needs `permissions.notifications`.
- `divee.openURL(url)` — opens `http`, `https` or `mailto` URLs in the default app. No permission needed. **Only inside a `run`** (same rule as `clipboard.write`), and **at most one URL per run**. Refused in card `match` and while loading.
- `divee.settings.get(key)` — value of a field you declared in `settings` (`undefined` if not declared; `null` if no value and no default).
- `divee.locale` — `{ language, region, currency }`, e.g. `{ language: 'ko', region: 'KR', currency: 'KRW' }` (any may be `null`).
- `divee.log(...)` — debug lines shown in Settings › Plugins (last 50).

### Network — `divee.fetch(url, options?)` → Promise
- Needs `permissions.network` containing the URL's host (**https only**), or `permissions.localNetwork` containing the device (http or https). Redirects are re-checked every hop (max 5) and must stay in the same list. No cookies.
- `options`: `{ method, headers, body, timeout }`. `method` is GET/POST/PUT/PATCH/DELETE/HEAD; `headers` is `{ name: "string value" }`; **`body` must be a string** (use `JSON.stringify(obj)`); `timeout` is seconds, 1–10 (up to 600 only with `longRequests`).
- Limits: 10 s total, 2 MB response, **4 requests at a time per plugin** (the fifth is rejected — `await` earlier ones).
- Result: `{ status, ok, headers, text, json() }`. **`text` is a property** (a string), **`json()` is a function.** `ok` is true for 200–299.
- It rejects (throws with `await`) on a network error, a timeout or a missing permission — handle it and return `null`/a friendly card.

### Menu — `divee.menu.set(items)`
Fills the panel's expandable section. Call again to replace everything; if any item is malformed nothing changes and an error is thrown. Items:
- `{ type: 'action', id, title, run, icon? }` — a button.
- `{ type: 'info', title, value }` — a read-only line (`value` must be a string; use `String(n)`).
- `{ type: 'separator' }`
- `{ type: 'chips', id, chips: [{ label, copy? }] }` — click copies `copy` (or `label`). Divee does the copying itself, so **no clipboard permission is needed** for chips. Item `id`s must be unique.

### UI — `divee.ui.showCharacterViewer()`
Opens the macOS Character Viewer (emoji and symbols). **Only works inside a command's or menu action's `run`** — calling it at load time or in `match` throws.

### AI tools — `divee.ai.registerTool({ name, description, parameters, run })`
Needs `permissions.aiTools`. Lets Divee's built-in AI call your function. `name`: letters, digits, `_`, `-`. `description`: what it does, for the model (required). `parameters`: `[{ name, description, type: 'string'|'number'|'boolean', required }]`. `run(args)` gets an object with those arguments and returns a **string** (or number/boolean/object, which is converted) or a Promise of it (waits up to 20 s). Divee always shows the user a confirmation card before it runs.

## Forbidden / does not exist

`setTimeout`, `setInterval`, `require`, `import`/`export`, `process`, `fs`, `window`, `document`, `localStorage`, global `fetch`, `XMLHttpRequest`, `eval`/`new Function`, Node APIs. Don't try to draw UI, read files, run shell commands or read other apps. There are **no timers**: do everything in `match`/`run` (or in a Promise that `divee.fetch` resolves).

Time limits (CPU time per call): loading `main.js` 200 ms, card `match` 30 ms, command/menu action/AI tool/after-fetch callbacks 1 s. Exceed it, or throw while loading, and Divee switches the plugin off. No endless loops, no heavy regexes.

Size limits: `menu.set` ≤ 200 items · chips ≤ 500 per item · card `rows` ≤ 500 · `keywords` ≤ 500 · AI tool `parameters` ≤ 20 · `fetch` headers ≤ 100. AI tool and parameter `description` longer than 300 characters is cut (keep them short).

Updates: installing a folder whose `id` is already installed always asks the user to confirm (and warns if a saved API key exists). If someone edits the files of an installed plugin that has permissions or a saved key, Divee asks again in Settings › Plugins › **Review Permissions…** before running it.

## Easy mistakes

- `res.text()` is wrong → `res.text` (string) or `res.json()`.
- `divee.openURL` / `divee.clipboard.write` inside a card's `match` is refused → put them in a command or menu action's `run`, or use a card `open`/`copy` action.
- A card without `keywords` is rejected; a query without a keyword never reaches `match`. Include every word/symbol a user might type (`'mile'`, `'mi'`, `'마일'`).
- `match` must return `null` when there is no card. `false`, `[]` or an object without `title`/`value` is reported as an error.
- `fetch` `body` must be a string; `headers` values must be strings.
- `*.example.com` does not include `example.com`.
- `showCharacterViewer()` only inside `run`.
- Duplicate `id`s (commands, cards, tools, menu items) are errors.
- Don't request permissions you don't use. Chips copy without `clipboard`.
- Keep all texts you show in the user's language, short, and put units in `title`/`subtitle`.

## Example 1 — a card (no permissions)

`jane.mile-converter/manifest.json`
```json
{
  "id": "jane.mile-converter",
  "name": "Mile Converter",
  "version": "1.0.0",
  "type": "plugin",
  "apiVersion": 1,
  "author": "jane",
  "description": "Type '3 miles' in the quick input to see kilometers.",
  "main": "main.js"
}
```

`jane.mile-converter/main.js`
```js
// "3 miles", "2.5 mi", "10마일" → kilometers.
divee.cards.register({
  id: 'miles-to-km',
  keywords: ['mile', 'mi', '마일'],
  match: function (query) {
    var m = query.trim().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(?:miles?|mi|마일)$/);
    if (!m) { return null; }
    var km = Number(m[1]) * 1.609344;
    var text = (Math.round(km * 100) / 100) + ' km';
    return { title: m[1] + ' mi', value: text, copy: text };
  }
});
```

## Example 2 — a command (one permission)

`jane.copy-date/manifest.json`
```json
{
  "id": "jane.copy-date",
  "name": "Copy Today's Date",
  "version": "1.0.0",
  "type": "plugin",
  "apiVersion": 1,
  "author": "jane",
  "description": "Command that copies today's date (YYYY-MM-DD) to the clipboard.",
  "main": "main.js",
  "permissions": { "clipboard": true }
}
```

`jane.copy-date/main.js`
```js
function pad(n) { return n < 10 ? '0' + n : String(n); }

divee.commands.register({
  id: 'copy-date',
  title: "Copy today's date",
  keywords: ['date', 'today', '날짜', '오늘'],
  icon: 'calendar',
  run: function () {
    var d = new Date();
    var text = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    divee.clipboard.write(text);
    divee.log('copied', text);
  }
});
```

## Before you answer, check

- [ ] Folder name = `id`; `id` is `author.name` (lowercase, digits, hyphens); `type` `"plugin"`; `apiVersion` 1; no `defaultEnabled`
- [ ] `permissions` has only what `main.js` really uses (and is omitted if empty); every fetched host is listed exactly
- [ ] every card has non-empty `keywords` and returns a card or `null`
- [ ] no timers, `require`, `import`, global `fetch`, DOM or Node APIs
- [ ] `res.text` (property) / `res.json()` (function), `body` is a string
- [ ] ids are unique; `showCharacterViewer` only inside `run`
- [ ] end with the install steps below

## Install steps to give the user

1. Make a folder named exactly like the `id` and save both files inside it (plain text, UTF-8).
2. Divee › Settings › **Plugins** › **Install from Folder…** → choose the folder, read the permissions list and accept.
3. Try it: type the example into the ⌥Space panel (cards) or search for the command.
4. If something is wrong, the Plugins tab says so in plain words with the line number — press **Copy Fix Request for AI** and paste the text back into this chat.
