// JCH Portfolio — cover-parts.jsx
// 표지 부품. **도구지 양식이 아니다.**
//
// 프로젝트마다 강조할 것이 다르다 — CM 은 측정 조건이, DX11 은 구조가, Wobble 은
// 5주라는 시간이 생명이다. 그래서 표지는 필드 목록을 공유하지 않는다.
// 공유하는 것은 (1) 이 부품들과 (2) "주어진 상자 안에 그려라" 라는 계약뿐이다.
//
// 표지 하나의 계약 (pages/{slug}/cover.jsx 가 채운다):
//   window.COVERS[slug] = {
//     render: ({ density }) => JSX,   // density 는 힌트다. 무시해도 된다.
//     toc:    { title, period, tags } // 덱 목차(deck/engine.js)가 세어 가는 것
//   }
// density: 'deck' | 'card' | 'hero' — 크기가 아니라 **무엇을 뺄지**의 힌트다.
// 크기는 자리가 --cs 로 정하고 cover.css 가 곱한다.
//
// 여기에 부품을 더할 때: 실제로 두 프로젝트 이상이 같은 모양을 쓸 때만 뽑는다.
// 한 프로젝트만 쓰는 모양은 그 프로젝트 cover.jsx 안에 둔다 (CM 의 4단 수치처럼).

(function defineCoverParts() {
  const RI = (s) => (window.renderInline ? window.renderInline(s) : s);

  // 글 | 그림 2단. 표지 셋이 이 배치를 쓰지만 강제는 아니다.
  function CoverSplit({ main, art }) {
    return (
      <div className="cv-split">
        <div className="cv-split__main">{main}</div>
        {art && <div className="cv-split__art">{art}</div>}
      </div>
    );
  }

  // 위(글·그림) + 아래(큰 숫자) 2단. 수치가 주장인 표지가 쓴다.
  function CoverStack({ children }) {
    return <div className="cv-stack">{children}</div>;
  }

  function Eyebrow({ children }) {
    return <div className="cv-eyebrow">{children}</div>;
  }

  function CoverTitle({ children }) {
    return <h1 className="cv-title">{children}</h1>;
  }

  // 인라인 마크업(**굵게** · `코드`)을 해석한다 — data.js 원문을 그대로 넘길 수 있다.
  function Lede({ children }) {
    return <p className="cv-lede">{typeof children === 'string' ? RI(children) : children}</p>;
  }

  // items: [{ kind: 'accent' | 'plain', tone, text }] 또는 문자열 배열
  // tone 은 tokens.css 태그 팔레트 — sage(확보) · terra(한계) · wheat(측정) · blue(외부).
  function Pills({ items }) {
    if (!items || !items.length) return null;
    return (
      <div className="cv-pills">
        {items.map((p, i) => {
          const o = typeof p === 'string' ? { text: p } : p;
          return (
            <span key={i} data-tone={o.tone}
                  className={'cv-pill' + (o.kind === 'accent' ? ' cv-pill--accent' : '')}>
              {o.text}
            </span>
          );
        })}
      </div>
    );
  }

  // 역할 한 줄. 심사자가 가장 먼저 찾는 줄이라 스펙 목록 안에 두지 않는다.
  // ⚠️ <b>라벨</b><span>본문</span> 을 붙여서 내므로 본문 앞의 구분자는 호출자가 넣는다.
  function RoleLine({ label, children }) {
    return (
      <p className="cv-role"><b>{label}</b><span>{RI(children)}</span></p>
    );
  }

  // 만든 것 목록. 항목마다 인라인 마크업(**굵게** · `코드`)을 해석한다.
  function Specs({ items }) {
    if (!items || !items.length) return null;
    return (
      <ul className="cv-specs">
        {items.map((t, i) => <li key={i}>{RI(t)}</li>)}
      </ul>
    );
  }

  // links: [{ label, v, href, tone }] — v 는 선택이다.
  // <a> 로 낸다: PDF 로 뽑아도 눌린다. 텍스트로 두면 URL 을 손으로 쳐야 한다.
  function LinkRow({ links }) {
    if (!links || !links.length) return null;
    return (
      <div className="cv-links">
        {links.map((l, i) => (
          <a className="cv-link" key={i} href={l.href} data-tone={l.tone} target="_blank" rel="noopener">
            <span className="cv-link__k">{l.label}</span>
            {l.v && <span className="cv-link__v">{l.v}</span>}
            <span className="cv-link__go" aria-hidden="true">→</span>
          </a>
        ))}
      </div>
    );
  }

  // 큰 숫자 칸. items: [{ n, label, sub }] — data.js 의 heroMetrics 를 그대로 넘길 수 있다.
  // 수치가 주장인 표지에서만 쓴다. 기준일이 값마다 다르면 sub 에 값별로 적는다 —
  // 한 줄로 묶으면 어느 날짜가 어느 수치의 것인지 못 가른다.
  function BigStats({ items }) {
    if (!items || !items.length) return null;
    return (
      <div className="cv-bigs" style={{ '--bigs': items.length }}>
        {items.map((b, i) => (
          <div className="cv-big" key={i}>
            <div className="cv-big__n">{b.n}</div>
            <div className="cv-big__k">{b.label}</div>
            {b.sub && <div className="cv-big__s">{RI(b.sub)}</div>}
          </div>
        ))}
      </div>
    );
  }

  function Art({ img, caption, alt }) {
    if (!img) return null;
    return (
      <figure className="cv-art">
        <img src={img} alt={alt || ''} />
        {caption && <figcaption>{RI(caption)}</figcaption>}
      </figure>
    );
  }

  Object.assign(window, {
    CoverSplit, CoverStack, Eyebrow, CoverTitle, Lede, RoleLine, Pills, Specs, LinkRow, Art, BigStats,
  });
  window.COVERS = window.COVERS || {};
})();
