[English](README.md) · **한국어**

# Divee 플러그인

macOS 메뉴바 도우미 [Divee](https://github.com/dorkman43/divee) 용 테마·마스코트·플러그인 모음입니다.

**코딩을 몰라도 됩니다.** 종류마다 **AI 지침서**가 있어요. AI 채팅(Claude, ChatGPT, Gemini 등)에 붙여 넣고 원하는 걸 말하면, AI 가 바로 설치할 수 있는 폴더를 만들어 줍니다.

> 플러그인은 **Divee 1.0.8 이상**에서 쓸 수 있어요(곧 나와요).

| 종류 | 폴더 | AI 지침서 | 상태 |
|---|---|---|---|
| 🎨 테마 — 색·글꼴·글자 크기·모서리·간격 | [`themes/`](themes) | [AI-GUIDE-theme.md](guides/AI-GUIDE-theme.md) | ✅ 열림 |
| 🐾 마스코트 — 메뉴바 캐릭터 바꾸기 | [`mascots/`](mascots) | 준비 중 | 🚧 |
| 🧩 플러그인 — 새 명령·카드(JavaScript) | [`plugins/`](plugins) | 준비 중 | 🚧 |

## 테마

| Tokyo Night | Solarized Light |
|---|---|
| <img src="images/tokyo-night.png" width="300" alt="Tokyo Night 테마"> | <img src="images/solarized-light.png" width="300" alt="Solarized Light 테마"> |
| 색만 바꾼 예제 | 색 + 글꼴(Avenir Next)·글자 110%·둥근 모서리·여유 간격 |

## AI 로 내 테마 만들기

1. [guides/AI-GUIDE-theme.md](guides/AI-GUIDE-theme.md) 를 열어 전체를 복사해 AI 채팅에 붙여 넣으세요.
2. 원하는 걸 말하세요. 예: *"Dracula 같은 Divee 테마 만들어줘"*, *"따뜻한 베이지색, 글자 크게, 모서리 둥글게"*
3. AI 가 `manifest.json` 과 `theme.json` 두 파일을 줍니다. `id` 와 똑같은 이름의 폴더를 만들어 그 안에 저장하세요.
4. 아래처럼 설치하고, Divee › 설정 › 일반 › **테마**에서 고르세요.

문제가 있으면 Divee › 설정 › **플러그인**에 쉬운 말로 떠요. **AI에게 고쳐 달라기 복사**를 눌러 같은 AI 채팅에 붙여 넣으면 고쳐 줍니다.

살짝만 바꾸고 싶다면 Divee › 설정 › 일반 › 테마 › **내 맞춤**에서 파일 없이 글꼴·글자 크기·모서리·간격·배경 불투명도·테두리를 바꿀 수 있어요.

## 설치

1. 이 저장소를 내려받거나(**Code › Download ZIP**) 원하는 폴더만 받으세요.
2. Divee › 설정 › **플러그인** › **폴더에서 설치…** → 테마 폴더(예: `themes/dorkman.tokyo-night`)를 고르세요.
3. 설정 › 일반 › **테마**에서 고르세요.

테마는 데이터일 뿐이라 코드를 실행하거나 권한을 요청할 수 없어요.

## 내 테마 올리기

Pull request 를 환영해요 — [CONTRIBUTING.md](CONTRIBUTING.md) 를 봐 주세요. `themes/` 아래에 폴더를 넣고 [`index.json`](index.json) 에 한 줄 추가하면 됩니다.

## 라이선스

[MIT](LICENSE) — 각 작품의 저작권은 `manifest.json` 에 적힌 작성자에게 있어요.
