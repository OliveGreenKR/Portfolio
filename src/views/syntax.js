// src/views/syntax.js
// 코드 블록 신택스 하이라이팅. 사이트(AsciiBlock)와 덱(SlideDeck)이 같이 쓴다.
// Prism CDN 스크립트 뒤, React/babel 앞에 평범한 <script> 로 넣는다.
//
// 색은 src/styles/syntax.css 가 갖는다 — 여기서는 토큰만 만든다.

(function () {
  var P = window.Prism;

  // Prism 의 C++/C# 문법은 프로젝트 정의 타입을 못 잡는다 (실측: XMVECTOR ·
  // FPhysicsStateArrays 전부 무색). 언리얼식 접두사(F/U/I/A/E) · XM*(DirectXMath) ·
  // std:: 를 타입으로 본다. class-name **앞에** 넣어야 다른 토큰이 먼저 먹지 않는다.
  var ENGINE_TYPE = /\b(?:XM[A-Z]\w*|[FUIAE][A-Z][A-Za-z0-9_]+|std::\w+)\b/;

  if (P) {
    ['cpp', 'csharp'].forEach(function (L) {
      if (!P.languages[L] || P.languages[L]['engine-type']) return;
      P.languages.insertBefore(L, 'class-name', {
        'engine-type': { pattern: ENGINE_TYPE, alias: 'class-name' },
      });
    });
  }

  // 페이지 기본 언어는 <body data-code-lang="..."> 가 정한다.
  // data.js 에 언어 필드가 없어서(39개 블록 전부) 페이지 단위로 준다.
  function pageLang() {
    var b = document.body;
    return (b && b.getAttribute('data-code-lang')) || 'csharp';
  }

  // 한 페이지 안에 언어가 섞이는 경우(외주 = Python + TypeScript)를 위한 최소 감별.
  // 확신이 서는 표식만 본다 — 애매하면 페이지 기본값을 쓴다.
  function sniff(code) {
    if (/#include|std::|template\s*<|->\s*\w+\s*\(|\bnullptr\b/.test(code)) return 'cpp';
    if (/^\s*(def|class)\s+\w+.*:\s*$|^\s*import\s+\w+|lambda_handler|boto3/m.test(code)) return 'python';
    if (/\busing\s+System\b|\bnamespace\s+\w+|\bpublic\s+(class|struct|readonly)\b|\[SerializeField\]/.test(code)) return 'csharp';
    if (/\b(?:const|let)\s+\w+\s*:\s*\w+|\binterface\s+\w+\s*\{|export\s+(default|const|function)/.test(code)) return 'typescript';
    return null;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // 반환값은 HTML 문자열이다. Prism 이 없거나 문법이 없으면 이스케이프만 해서 돌려준다 —
  // 그러면 색은 안 붙어도 내용은 그대로 나온다.
  window.highlightCode = function (code, langHint) {
    if (!P) return esc(code);
    var lang = langHint || sniff(code) || pageLang();
    var grammar = P.languages[lang] || P.languages.clike;
    if (!grammar) return esc(code);
    try {
      return P.highlight(code, grammar, lang);
    } catch (e) {
      return esc(code);
    }
  };
})();
