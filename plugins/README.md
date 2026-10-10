# Plugins / 플러그인

One folder per plugin (`<author>.<name>/` with `manifest.json` + `main.js`). How to make one: [AI guide](../guides/AI-GUIDE-plugin.md).
Plugins are code, so Divee asks for the permissions they need when you install them.

플러그인 하나 = 폴더 하나. 만드는 방법은 [AI 지침서](../guides/AI-GUIDE-plugin.md)를 보세요.
플러그인은 코드라서 설치할 때 필요한 권한을 물어요.

- [`divee.currency`](divee.currency) — 환율 · network: `api.frankfurter.dev`
- [`divee.symbols`](divee.symbols) — 특수문자 · no permissions

Both are already built into Divee; they are here to read and adapt (same `id` → yours wins).
둘 다 Divee 에 이미 들어 있어요. 읽고 고쳐 쓰라고 둔 예제예요(같은 id 면 내 것이 이겨요).
