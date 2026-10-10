# Currency / 환율 (`divee.currency`)

Type `100달러`, `$100`, `100 usd in krw`, `5만원 달러로` or `엔화 환율` in Divee's quick input and a card shows the converted amount at the European Central Bank rate.
즉석 입력창에 `100달러`, `5만원 달러로`, `엔화 환율` 처럼 치면 유럽중앙은행 기준 환율로 바꾼 값을 카드로 보여 줘요.

- **Permissions / 권한:** network → `api.frankfurter.dev` only (rates, no key). Only a currency code leaves your Mac. Rates are cached for 6 hours; offline, the last saved rate is shown with its date.
- **Setting / 설정:** the currency to convert to when you don't name one.

**It is already built into Divee** — you don't need to install it. To change it, download this folder, edit `main.js`, then Divee › Settings › Plugins › **Install from Folder…**. With the same `id`, yours wins over the built-in one.
**Divee 에 이미 들어 있어요** — 따로 설치할 필요 없어요. 고쳐 쓰고 싶으면 이 폴더를 받아 `main.js` 를 고친 뒤 '폴더에서 설치' 하세요. 같은 id 면 내 것이 이겨요.
