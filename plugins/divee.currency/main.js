// 환율 플러그인 — 즉석 입력창에 이렇게 치면 카드가 떠요.
//   "100달러"            → 100 USD → 134,149 KRW
//   "$100" · "100 usd in krw" · "5만원 달러로" · "1.5억원 달러로" · "3천엔"
//   "달러 환율" · "엔화 환율 어때?" → 1 단위 환율
//
// 환율은 유럽중앙은행 기준(api.frankfurter.dev, 키 없음)이에요. 밖으로 나가는 건 통화 코드 하나뿐이고,
// 기준 통화별로 6시간 동안 저장해 두고 다시 써요. 인터넷이 안 되면 저장해 둔 옛 값을 기준일과 함께 보여 줘요.
//
// 규칙(Divee 플러그인 공통):
// - 화면은 그리지 않아요. 카드 데이터 { title, value, subtitle, copy } 만 돌려주면 Divee 가 그려요.
// - match 는 질의에 keywords 중 하나가 들어 있을 때만 불려요. 이 플러그인은 통화 이름·기호·코드를 모두 keywords 로 둬요.
// - 네트워크는 manifest.json 의 permissions.network 에 적은 주소(api.frankfurter.dev)만 쓸 수 있어요.
// - 이 파일은 "보수적으로" 잡아요: 금액 + 통화가 문장 전체를 이룰 때만 카드를 내고,
//   "10km in mi" · "3만원 4명" 처럼 다른 말이 남으면 카드를 내지 않아요(null).

// ───────────── 통화 표 ─────────────

// 환율 서버(유럽중앙은행)가 지원하는 통화 코드.
var SUPPORTED = [
  'AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'ISK',
  'JPY', 'KRW', 'MXN', 'MYR', 'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'SEK', 'SGD', 'THB', 'TRY', 'USD', 'ZAR'
];

// 통화 코드 → 이름·기호(소문자). 새 이름을 더하려면 해당 코드 줄에 적으면 돼요. 코드 3글자(usd 등)는 자동으로 받아요.
var NAMES = {
  KRW: ['원', '원화', '한화', '한국돈', '우리돈', '₩', 'won'],
  USD: ['달러', '달러화', '불', '달라', '미국달러', '$', 'us$', 'dollar', 'dollars', 'us dollar'],
  EUR: ['유로', '유로화', '€', 'euro', 'euros'],
  JPY: ['엔', '엔화', '일본엔', '¥', '円', 'yen'],
  CNY: ['위안', '위안화', '중국위안', 'yuan', 'rmb'],
  GBP: ['파운드', '£', '영국파운드'],
  HKD: ['홍콩달러'],
  SGD: ['싱가포르달러', '싱가폴달러'],
  AUD: ['호주달러'],
  CAD: ['캐나다달러'],
  NZD: ['뉴질랜드달러'],
  CHF: ['스위스프랑', '프랑'],
  THB: ['바트', '태국바트'],
  INR: ['루피', '인도루피'],
  IDR: ['루피아'],
  PHP: ['필리핀페소'],
  MXN: ['멕시코페소'],
  BRL: ['헤알'],
  TRY: ['리라'],
  ZAR: ['랜드'],
  SEK: ['스웨덴크로나'],
  NOK: ['노르웨이크로네'],
  DKK: ['덴마크크로네'],
  PLN: ['즈워티'],
  CZK: ['코루나'],
  HUF: ['포린트'],
  ILS: ['셰켈'],
  MYR: ['링깃'],
  RON: ['레우'],
  ISK: ['아이슬란드크로나']
};

// 글자 나누기(이모지 같은 두 칸짜리도 한 글자로).
function charsOf(text) { return Array.from(text); }

// (이름, 코드) 목록 — 긴 이름 먼저(엔화가 엔보다, 홍콩달러가 달러보다 먼저 맞게).
var NAME_TABLE = (function () {
  var out = [];
  Object.keys(NAMES).forEach(function (code) {
    NAMES[code].forEach(function (name) { out.push({ name: name, code: code }); });
  });
  SUPPORTED.forEach(function (code) { out.push({ name: code.toLowerCase(), code: code }); });
  out.sort(function (a, b) { return charsOf(b.name).length - charsOf(a.name).length; });
  return out;
})();

var AMOUNT_CHARS = '0123456789.,조억만천백 ';
var CONNECTORS = ['into', 'in', 'to', '->', '→', '=', '에서', '를', '을'];
var TAILS = ['환산', '환전', '바꾸면', '바꿔줘', '얼마', '계산', '환율', 'rate'];
var RATE_WORDS = ['환율', '시세', 'rate', 'exchange rate', '환율 얼마', '환율 알려줘'];
// 금액·통화·대상 통화를 뺀 나머지가 이런 질문 꼬리뿐일 때만 질의로 본다(아무 말이나 남으면 null).
var FILLER = new RegExp(
  '^(?:\\s*(?:으로는|로는|으로|로|은|는|얼마(?:야|예요|에요|지|인가요|죠|입니까|나)?|몇\\s*원|환전(?:하면|해줘)?|환산|바꾸면|바꿔줘|계산|환율|시세|rate|어때|어떄|알려줘|되나요|돼요|돼|인가요|이야|야|예요|에요|일까|이지|지))*\\s*[?!.？！]*$');
var LEAD_WORDS = ['오늘 ', '지금 ', '현재 ', 'how much is ', 'how much are ', 'what is ', "what's ", 'convert '];
var KOREAN_ALIASES = [['한국 돈', '한국돈'], ['우리 돈', '우리돈']];
var SPACED_PLACE = /(홍콩|싱가포르|싱가폴|호주|캐나다|뉴질랜드|미국|스위스|일본|중국|영국|멕시코|필리핀|인도|태국|유럽|스웨덴|노르웨이|덴마크|아이슬란드) +/g;

// ───────────── 작은 도구 ─────────────

function trimSpaces(text) { return text.replace(/^[ \t ]+|[ \t ]+$/g, ''); }
function startsWith(text, prefix) { return text.indexOf(prefix) === 0; }
function isAsciiLetter(ch) { return /^[A-Za-z]$/.test(ch); }
function includes(list, item) { return list.indexOf(item) >= 0; }
function fillerOnly(text) { return FILLER.test(trimSpaces(text)); }

// ───────────── 질의 해석 ─────────────

// 질의를 해석해 { amount, from, to } 를 돌려줘요. 환율 질의가 아니면 null.
// defaultTarget 은 "바꿀 통화를 안 적었을 때" 쓸 통화(원화가 아닌 쪽 기본값).
function parseQuery(query, defaultTarget) {
  var s = String(query).trim().toLowerCase();
  if (s === '' || charsOf(s).length > 60) { return null; }
  s = s.replace(SPACED_PLACE, '$1');
  KOREAN_ALIASES.forEach(function (pair) { s = s.split(pair[0]).join(pair[1]); });
  for (var i = 0; i < LEAD_WORDS.length; i++) {
    if (startsWith(s, LEAD_WORDS[i])) { s = trimSpaces(s.slice(LEAD_WORDS[i].length)); break; }
  }

  // 금액 없이 "달러 환율" · "엔화 환율" = 1 단위.
  var head = takeCurrency(s);
  if (head && (includes(RATE_WORDS, head.rest) || isRateQuestion(head.rest) || isPriceQuestion(head.rest))) {
    return build(1, head.code, null, defaultTarget);
  }

  var found = takeAmountAndCurrency(s);
  if (!found || !(found.amount > 0 && found.amount < 1e15)) { return null; }
  var target = takeTarget(found.rest);
  if (!target) { return null; }
  return build(found.amount, found.from, target.code, defaultTarget);
}

// 금액과 통화를 읽는다. "$100"(기호가 앞) 또는 "100 usd" · "5만원"(금액이 앞). { amount, from, rest } 또는 null.
function takeAmountAndCurrency(s) {
  var first = charsOf(s)[0];
  if (first !== undefined && '$€£¥₩'.indexOf(first) >= 0) {
    var sym = takeCurrency(s);
    var money = sym && takeAmount(sym.rest);
    if (money) { return { amount: money.value, from: sym.code, rest: money.rest }; }
  }
  var amount = takeAmount(s);
  var cur = amount && takeCurrency(amount.rest);
  if (cur) { return { amount: amount.value, from: cur.code, rest: cur.rest }; }
  return null;
}

// "환율 얼마야" · "환율 어때?" — 환율/시세/rate 로 시작하고 나머지가 질문 꼬리뿐.
function isRateQuestion(rest) {
  var words = ['환율', '시세', 'exchange rate', 'rate'];
  for (var i = 0; i < words.length; i++) {
    if (startsWith(rest, words[i])) { return fillerOnly(rest.slice(words[i].length)); }
  }
  return false;
}

// "엔화 지금 얼마야" · "유로 얼마야?" — 금액 없는 통화 뒤에 '얼마/몇 원' 질문 꼬리만. 통화 낱말만("달러")은 아니다.
function isPriceQuestion(rest) {
  var t = rest;
  for (var i = 0; i < LEAD_WORDS.length; i++) {
    if (startsWith(t, LEAD_WORDS[i])) { t = t.slice(LEAD_WORDS[i].length); break; }
  }
  if (t.indexOf('얼마') < 0 && t.indexOf('몇 원') < 0 && t.indexOf('몇원') < 0) { return false; }
  return fillerOnly(t);
}

// 앞의 금액을 읽는다. 한국어 수 단위(천·백·만·억·조)와 쉼표·소수점 허용. { value, rest } 또는 null.
function takeAmount(s) {
  var chars = charsOf(s);
  var end = 0;
  while (end < chars.length && AMOUNT_CHARS.indexOf(chars[end]) >= 0) { end++; }
  while (end > 0 && chars[end - 1] === ' ') { end--; }   // 뒤쪽 공백은 금액이 아니다.
  if (end === 0) { return null; }
  var value = koreanNumber(chars.slice(0, end).join(''));
  if (value === null) { return null; }
  return { value: value, rest: trimSpaces(chars.slice(end).join('')) };
}

// "1.5억" → 1.5e8, "5만 3천" → 53000, "만" → 10000, "1,000" → 1000. 숫자가 연달아 붙거나 형식이 틀리면 null.
function koreanNumber(text) {
  var total = 0, section = 0;
  var digits = '', pending = null, sawUnit = false, bad = false;
  function closeDigits() {
    if (digits === '') { return; }
    if (pending !== null || !validNumber(digits)) { bad = true; }
    pending = Number(digits.replace(/,/g, ''));
    digits = '';
  }
  var chars = charsOf(text);
  for (var i = 0; i < chars.length; i++) {
    var ch = chars[i];
    if (/^[0-9.,]$/.test(ch)) { digits += ch; continue; }
    closeDigits();
    if (ch === '천') { section += (pending === null ? 1 : pending) * 1000; pending = null; sawUnit = true; }
    else if (ch === '백') { section += (pending === null ? 1 : pending) * 100; pending = null; sawUnit = true; }
    else if (ch === '만' || ch === '억' || ch === '조') {
      section += pending === null ? 0 : pending; pending = null; sawUnit = true;
      total += (section === 0 ? 1 : section) * (ch === '만' ? 1e4 : ch === '억' ? 1e8 : 1e12);
      section = 0;
    }
    // 그 밖(공백)은 건너뛴다.
  }
  closeDigits();
  if (bad || (pending === null && !sawUnit)) { return null; }
  return total + section + (pending === null ? 0 : pending);
}

// "1000" · "1,000" · "1,234,567.5" · "0.5" 만 숫자로 인정한다(쉼표는 세 자리 묶음일 때만).
function validNumber(d) { return /^(\d{1,3}(,\d{3})+|\d+)(\.\d+)?$/.test(d); }

// 문자열 앞의 통화 이름(기호 포함)을 읽는다. 라틴 이름은 뒤가 영문자가 아니어야 한다. { code, rest } 또는 null.
function takeCurrency(s) {
  var trimmed = trimSpaces(s);
  for (var i = 0; i < NAME_TABLE.length; i++) {
    var entry = NAME_TABLE[i];
    if (!startsWith(trimmed, entry.name)) { continue; }
    var after = trimmed.slice(entry.name.length);
    var last = charsOf(entry.name).pop();
    var next = charsOf(after)[0];
    if (isAsciiLetter(last) && next !== undefined && isAsciiLetter(next)) { continue; }
    return { code: entry.code, rest: trimSpaces(after) };
  }
  return null;
}

// 금액·통화 뒤 꼬리 — 없거나, `in krw` · `to eur` · `달러로` · `달러` · `원 환산` · 끝에 매달린 `in`(입력 중).
// { code } 또는 null (code 가 null 이면 대상 생략).
function takeTarget(raw) {
  var rest = trimSpaces(raw);
  if (rest === '' || includes(TAILS, rest)) { return { code: null }; }
  // "5만원은 달러로?" · "100달러는 몇 원?" — 원본 바로 뒤 은/는과 꼬리뿐이면 대상 없음.
  var particles = ['은', '는'];
  for (var p = 0; p < particles.length; p++) {
    if (startsWith(rest, particles[p])) { rest = trimSpaces(rest.slice(particles[p].length)); break; }
  }
  if (fillerOnly(rest)) { return { code: null }; }
  for (var i = 0; i < CONNECTORS.length; i++) {
    var c = CONNECTORS[i];
    if (!startsWith(rest, c)) { continue; }
    var after = rest.slice(c.length);
    var next = charsOf(after)[0];
    if (isAsciiLetter(c.charAt(0)) && next !== undefined && isAsciiLetter(next)) { continue; }   // "into"/"in" 구분, "intl" 방지
    rest = trimSpaces(after);
    break;
  }
  if (rest === '') { return { code: null }; }
  var target = takeCurrency(rest);
  if (!target) { return null; }
  if (!(target.rest === '' || includes(TAILS, target.rest) || fillerOnly(target.rest))) { return null; }
  return { code: target.code };
}

// 대상 통화 정하기. 대상을 안 적으면: 원화는 USD, 나머지는 기본 통화(설정, 없으면 KRW).
function build(amount, from, to, defaultTarget) {
  var fallback = function () {
    if (from === 'KRW') { return 'USD'; }
    var d = String(defaultTarget || '').toUpperCase();
    return (d !== from && d !== 'KRW' && includes(SUPPORTED, d)) ? d : 'KRW';
  };
  var target = to || fallback();
  // "5만원 한화로는?" — 원본·대상이 모두 원화면 대상 생략과 같게 본다(원화 → USD). 다른 통화 중복("100 usd in usd")은 null.
  if (to === 'KRW' && from === 'KRW') { target = fallback(); }
  if (target === from) { return null; }
  return { amount: amount, from: from, to: target };
}

// ───────────── 환율 받기 · 저장 ─────────────

var RATES_URL = 'https://api.frankfurter.dev/v1/latest?base=';
var TTL_MS = 6 * 3600 * 1000;   // 6시간
var inflight = {};              // 같은 기준 통화를 동시에 두 번 받지 않게

// 저장해 둔 값이 아직 유효한가 — 받은 지 6시간 미만이고, 시계가 거꾸로 가 미래에 받은 값이 아니어야 해요.
function isFresh(fetchedAt, now) {
  var age = now - fetchedAt;
  return age >= 0 && age < TTL_MS;
}

// 응답 → 환율표. 기준 통화·기준일·rates 가 맞지 않으면 null.
function decodeRates(json, base, now) {
  if (!json || json.base !== base || typeof json.date !== 'string' || !json.rates || typeof json.rates !== 'object') { return null; }
  if (Object.keys(json.rates).length === 0) { return null; }
  return { base: base, date: json.date, rates: json.rates, fetchedAt: now };
}

// 저장해 둔 환율표(모양이 맞을 때만).
function readCache(base) {
  var saved = divee.storage.get('rates:' + base);
  if (saved && saved.base === base && typeof saved.date === 'string' && saved.rates && typeof saved.fetchedAt === 'number') { return saved; }
  return null;
}

function download(base) {
  return divee.fetch(RATES_URL + base).then(function (res) {
    if (!res.ok) { throw new Error('환율 서버가 ' + res.status + ' 로 답했어요.'); }
    var table = decodeRates(res.json(), base, Date.now());
    if (!table) { throw new Error('환율 서버의 답을 읽을 수 없어요.'); }
    try { divee.storage.set('rates:' + base, table); } catch (e) { /* 저장 실패는 무시: 이번 값은 그대로 쓴다 */ }
    return table;
  });
}

// 기준 통화의 환율표 → { table, stale }. 신선한 저장값 → 네트워크 → (실패 시) 옛 저장값. 둘 다 없으면 거절.
function getRates(base) {
  var cached = readCache(base);
  if (cached && isFresh(cached.fetchedAt, Date.now())) { return Promise.resolve({ table: cached, stale: false }); }
  if (!inflight[base]) {
    inflight[base] = download(base).then(
      function (table) { delete inflight[base]; return table; },
      function (error) { delete inflight[base]; throw error; });
  }
  return inflight[base].then(
    function (table) { return { table: table, stale: false }; },
    function (error) {
      if (cached) { return { table: cached, stale: true }; }
      throw error;
    });
}

// ───────────── 표시 형식 ─────────────

// 천 단위 쉼표를 붙인 글자. digits 는 소수 자리, trim 이 true 면 끝의 0 을 뗀다.
function formatNumber(value, digits, trim) {
  if (!isFinite(value) || Math.abs(value) >= 1e21) { return String(value); }
  var text = value.toFixed(digits);
  if (trim && text.indexOf('.') >= 0) { text = text.replace(/0+$/, '').replace(/\.$/, ''); }
  var parts = text.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

// 통화 소수 자리: 원·엔 0자리, 나머지 2자리. "138,250" (통화 코드는 붙이지 않는다)
function formatAmount(value, code) { return formatNumber(value, (code === 'KRW' || code === 'JPY') ? 0 : 2, false); }

// 환율(1 단위당 값) — 큰 값은 소수 1자리, 작은 값은 유효 숫자가 보이게 자리를 늘린다. 끝의 0 은 뗀다.
function formatRate(value) {
  var digits = value >= 100 ? 1 : value >= 1 ? 2 : value >= 0.01 ? 4 : 6;
  return formatNumber(value, digits, true);
}

// 입력 수량 — 정수면 소수 없이, 아니면 최대 4자리.
function formatQuantity(value) { return formatNumber(value, 4, true); }

// 기준일 "2026-10-09" → "10/9". 형식이 다르면 원문.
function shortDate(iso) {
  var parts = String(iso).split('-');
  if (parts.length !== 3 || isNaN(parseInt(parts[1], 10)) || isNaN(parseInt(parts[2], 10))) { return iso; }
  return parseInt(parts[1], 10) + '/' + parseInt(parts[2], 10);
}

// ───────────── 카드 ─────────────

function failureCard(q) {
  return { title: '환율', value: '환율을 불러오지 못했어요', subtitle: formatQuantity(q.amount) + ' ' + q.from + ' → ' + q.to };
}

function resultCard(q, outcome) {
  var rate = outcome.table.rates[q.to];
  if (typeof rate !== 'number' || !(rate > 0)) { return failureCard(q); }
  var converted = formatAmount(q.amount * rate, q.to);
  var date = shortDate(outcome.table.date);
  var line = '1 ' + q.from + ' = ' + formatRate(rate) + ' ' + q.to;
  return {
    title: '환율',
    value: formatQuantity(q.amount) + ' ' + q.from + ' → ' + converted + ' ' + q.to,
    subtitle: line + (outcome.stale ? ' · 기준일 ' + date + ' (최신 환율을 못 받았어요)' : ' · 기준 ' + date + ' (유럽중앙은행)'),
    copy: converted + ' ' + q.to
  };
}

// 질의에 이 낱말 중 하나라도 있어야 match 가 불려요: 통화 이름·기호·코드와 "환율" 류.
var KEYWORDS = (function () {
  var words = ['환율', '시세', 'rate', '한국 돈', '우리 돈'];
  NAME_TABLE.forEach(function (entry) { if (!includes(words, entry.name)) { words.push(entry.name); } });
  return words;
})();

divee.cards.register({
  id: 'currency',
  keywords: KEYWORDS,
  match: function (query) {
    var q = parseQuery(query, divee.settings.get('defaultTarget'));
    if (!q) { return null; }
    // 환율은 네트워크에서 오니 Promise 로 돌려줘요(Divee 가 끝나길 기다려 카드를 그려요).
    return getRates(q.from).then(
      function (outcome) { return resultCard(q, outcome); },
      function () { return failureCard(q); });
  }
});
