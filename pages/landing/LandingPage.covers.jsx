// pages/landing/LandingPage.covers.jsx
// 랜딩의 표지 카드 · Labs 카드. window.CoverCard, LabCard.
//
// 카드 한 장 = **덱 표지 한 장**이다. 여기서 다시 그리지 않는다 —
// pages/{slug}/cover.jsx 가 그린 것을 --cs 만 낮춰 그대로 쓴다(carousel.css).
// 그래서 표지를 고치면 덱 · 랜딩 · 상세 페이지가 함께 바뀐다.
//
// 카드가 표지에 더하는 것은 **자리의 것**뿐이다 — 번호 · 섹션 라벨 · 날짜 · 쪽수.
// 표지는 자기가 몇 번째인지 모른다.

function CoverCard({ p, i, n }) {
  const cover = (window.COVERS || {})[p.slug];
  return (
    // ⚠️ 카드 전체를 <a> 로 감싸면 표지 안의 링크와 중첩돼 HTML 이 깨진다.
    //    발치 링크 하나를 카드 전체로 늘리고(::after), 표지 링크는 그 위로 올린다.
    <div className="cr__card">
      <div className="cr__top">
        <b>{p.idx}</b><span>{p.code}</span>
        <span className="sp"></span><span>{p.date}</span>
      </div>
      <div className="cr__body">
        {cover
          ? cover.render({ density: 'card' })
          : <div className="cr__missing">표지 없음 — pages/{p.slug}/cover.jsx</div>}
      </div>
      <div className="cr__foot">
        <a className="cr__more" href={p.href}>상세 페이지 →</a>
        <span className="pg">{p.idx} / {String(n).padStart(2, '0')}</span>
      </div>
    </div>
  );
}

// Labs 는 표지가 없다. 한 줄 요약이 전부라 카드가 작고, 그래서 한 화면에 셋이 들어간다.
function LabCard({ l }) {
  return (
    <a className="lab-card" href={l.href || '#'}>
      <div className="lab-card__top">
        <span>{l.date ? l.date.slice(0, 7).replace('-', '.') : ''}</span>
        <span>{l.tag}</span>
      </div>
      <h3 className="lab-card__title">{l.title}</h3>
      <div className="lab-card__dur">{l.duration}</div>
      <p className="lab-card__line">{window.renderLandingInline(l.line)}</p>
      <div className="lab-card__go">{l.href ? 'read note →' : '— page pending'}</div>
    </a>
  );
}

Object.assign(window, { CoverCard, LabCard });
