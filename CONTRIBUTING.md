# Contributing / 올리는 방법

## Themes / 테마

1. Make the theme with [guides/AI-GUIDE-theme.md](guides/AI-GUIDE-theme.md) (or by hand) and **install it in Divee first** — Settings › Plugins must show no red problem lines.
   [AI 지침서](guides/AI-GUIDE-theme.md)로 만들고 **먼저 Divee 에 설치해 보세요** — 설정 › 플러그인에 빨간 문제 줄이 없어야 해요.
2. Put the folder at `themes/<author>.<name>/` (folder name = `id`).
   폴더를 `themes/<작성자>.<이름>/` 에 넣으세요(폴더 이름 = `id`).
3. Add one entry to `index.json` (`id`, `type`, `name`, `author`, `version`, `path`; `preview` optional — a screenshot in `images/`, no personal data in it).
   `index.json` 에 한 줄 추가하세요(`preview` 스크린샷은 선택, 개인 정보가 보이지 않게).
4. Open a pull request.
   Pull request 를 여세요.

### Review checklist / 검토 기준

- [ ] `manifest.json`: `"type": "theme"`, `"apiVersion": 1`, no `permissions` / `main`
- [ ] `theme.json`: hex colors only, known tokens only, values in range
- [ ] `textPrimary` vs `background` contrast ≥ 4.5:1
- [ ] Bundled fonts (`fonts`) must be licensed for redistribution (e.g. SIL OFL) — include the license file
  함께 넣는 글꼴은 재배포가 허용된 라이선스(예: SIL OFL)여야 하고 라이선스 파일을 같이 넣어 주세요
- [ ] Name doesn't impersonate another brand's official product
  다른 브랜드의 공식 제품처럼 보이는 이름은 피해 주세요

## Mascots & plugins / 마스코트·플러그인

Coming soon — guides will be added here when Divee supports them.
준비 중이에요 — Divee 가 지원하면 지침서와 함께 열게요.
