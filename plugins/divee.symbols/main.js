// 특수문자 플러그인 — 맥 키보드로 치기 어려운 기호(□ ● → ※ …)를 패널 펼침에 칩으로 두어요.
// 칩을 누르면 Divee 가 그 기호를 클립보드에 넣어요(⌘V 로 붙여넣기). 사용자가 직접 누르는 복사라
// 이 플러그인은 clipboard 권한이 필요 없어요 — 권한이 하나도 없어요.
//
// 고쳐 쓰는 법: 기호 목록은 코드가 아니라 설정(Divee 설정 → 플러그인 → 특수문자 → 설정…)에서 바꿔요.
// 띄어쓰기·줄바꿈으로 구분하고, 여러 글자를 붙여 쓰면 한 덩어리로 복사돼요.
// 기본 목록 마지막 줄은 Mac 키 표시(⌘ ⌥ ⌃ ⇧ …) — 설명서·메시지에 붙여 넣기용이에요.

// 설정 글자 → 기호 목록. 공백·줄바꿈으로 나누고, 같은 기호가 또 나오면 앞의 것만 남겨요.
function parseSymbols(text) {
  var seen = {};
  var out = [];
  var parts = String(text || '').split(/\s+/);
  for (var i = 0; i < parts.length; i++) {
    var s = parts[i];
    if (s && !seen[s]) {
      seen[s] = true;
      out.push(s);
    }
  }
  return out;
}

var symbols = parseSymbols(divee.settings.get('symbols'));

// 패널 펼침 — 칩 격자 하나. 목록이 비었으면 안내 한 줄.
// (설정을 바꾸면 Divee 가 이 파일을 다시 불러와 메뉴가 새 목록으로 바뀌어요.)
if (symbols.length > 0) {
  divee.menu.set([
    { type: 'chips', id: 'symbols', chips: symbols.map(function (s) { return { label: s }; }) }
  ]);
} else {
  divee.menu.set([{ type: 'info', title: '설정에서 기호를 추가하세요', value: '' }]);
}

// 더 많은 기호·이모지는 macOS 문자 뷰어로 — 패널을 열기 전에 쓰던 앱에 바로 입력돼요.
divee.commands.register({
  id: 'character-viewer',
  title: '이모지·기호 보기(문자 뷰어)',
  icon: 'face.smiling',
  keywords: ['이모지', 'emoji', '이모티콘', '기호', '특수문자 입력'],
  run: function () {
    divee.ui.showCharacterViewer();
  }
});
