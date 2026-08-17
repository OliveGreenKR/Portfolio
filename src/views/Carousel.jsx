// JCH Portfolio — Carousel.jsx
// 가로로 넘기는 목록. 메인 표지와 Labs 카드가 같은 것을 쓴다.
//
// 순환 · 관성 · 리사이즈 재측정 · 터치는 Embla 가 한다(vendor/embla-carousel.umd.js, 6KB gzip).
// 여기서 더하는 것은 사이트 고유의 것뿐이다 — 번호 레일, 옆 카드 클릭, 무대 효과, 방향키.
//
// props
//   items    배열
//   render   (item, i, n) => JSX — 캐러셀은 무엇을 그리는지 모른다
//   perView  한 화면에 몇 칸 — 폭 계산은 CSS 가 하고 여기서는 개수만 안다
//   stage    가운데 한 장만 앞으로 세울지 (좌우는 물러난다)
//   autoScale 표지 축척(--cs)을 칸 폭에서 계산해 넣을지 — 표지 카드용
//   head     ({sel, go, n}) => JSX — 섹션 머리글. 본문 폭 안에 남는다
//   label    스크린리더용 이름

(function defineCarousel() {
  const { useEffect, useRef, useState, useCallback } = React;

  function Carousel({ items, render, stage = false, autoScale = false, head, label, className = '' }) {
    const vpRef = useRef(null);
    const stageRef = useRef(null);
    const apiRef = useRef(null);
    const [sel, setSel] = useState(0);

    // 무대 효과 — 스크롤 위치 → 중심까지의 거리 → 크기 · 투명도 · 흐림 · 깊이.
    // Embla 의 진행값 대신 **화면상 위치**로 계산한다. 순환 경계에서 카드가 반대편으로
    // 넘어가도 좌표는 항상 맞다. transform-origin 이 가로 가운데라 되먹임도 없다.
    // 표지 축척(--cs)을 **실제 칸 폭 ÷ 덱 본문 폭(1752)** 으로 넣는다 —
    // 손으로 박으면 창 크기가 바뀔 때마다 표지가 제 설계폭과 어긋나 줄이 접힌다.
    //
    // 트랙을 화면 전체 폭으로 빼는 길도 만들어 봤지만 되돌렸다: 카드가 화면 폭을 따라
    // 커지고, 머리글은 본문 칸에 남아 중앙선이 어긋나고, 화살표가 화면 끝으로 밀렸다.
    // 지금은 트랙도 본문 칸 안이라 머리글 · 카드 · 화살표의 중심이 하나다.
    const fit = useCallback(() => {
      const el = stageRef.current;
      if (!el || !autoScale) return;
      const cell = el.querySelector('.cr__cell');
      if (cell) el.style.setProperty('--cs', (cell.getBoundingClientRect().width / 1752).toFixed(4));
    }, [autoScale]);

    const paint = useCallback(() => {
      const vp = vpRef.current;
      if (!vp) return;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const box = vp.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      vp.querySelectorAll('.cr__cell').forEach((c) => {
        const r = c.getBoundingClientRect();
        const d = Math.min(1, Math.abs(r.left + r.width / 2 - cx) / (r.width * 0.9));
        c.classList.toggle('is-on', d < 0.14);
        if (!stage) return;
        const e = d * d * (3 - 2 * d); // smoothstep
        const s = c.firstElementChild.style;
        s.transform = `translate3d(0,${(reduce ? 0 : e * 18).toFixed(2)}px,0) scale(${(1 - e * 0.12).toFixed(4)})`;
        s.opacity = (1 - e * 0.6).toFixed(3);
        s.filter = !reduce && e > 0.02 ? `blur(${(e * 1.6).toFixed(2)}px)` : '';
        c.style.zIndex = String(100 - Math.round(e * 100));
      });
    }, [stage]);

    useEffect(() => {
      if (!window.EmblaCarousel || !vpRef.current) return;
      const api = window.EmblaCarousel(vpRef.current, {
        loop: true,              // 끝 다음이 처음 — 단방향으로 두면 마지막에서 막힌다
        align: 'center',
        slidesToScroll: 1,
        containScroll: false,
        duration: 24,
        // 마우스 드래그는 끈다. 카드가 눌리는 건지 끌리는 건지 손이 헷갈린다 —
        // 데스크톱은 화살표 · 번호 · 옆 카드 클릭으로 넘긴다. 터치는 그대로 둔다.
        watchDrag: (_, e) => e.pointerType !== 'mouse',
      });
      apiRef.current = api;

      // 선택 상태의 단일 소스는 Embla 다. 자체 계산을 따로 두면 레일과 실제가 어긋난다.
      const onSelect = () => setSel(api.selectedScrollSnap());
      let raf = 0;
      const tick = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; fit(); paint(); }); };
      api.on('select', onSelect).on('reInit', onSelect).on('reInit', tick)
         .on('scroll', tick).on('settle', tick);
      onSelect(); fit(); paint();
      // 폰트 · 이미지가 들어오면 칸 치수가 바뀐다 — 그때 다시 칠하지 않으면
      // 첫 화면만 배치가 어긋난 채로 남는다.
      if (document.fonts) document.fonts.ready.then(() => { api.reInit(); paint(); });
      addEventListener('resize', tick);
      return () => { removeEventListener('resize', tick); api.destroy(); };
    }, [items, paint, fit]);

    const go = (i) => apiRef.current && apiRef.current.scrollTo(i);

    // 옆으로 물러난 장을 누르면 먼저 가운데로 온다 — 안 보이는 카드의 링크를
    // 곧장 여는 건 오조작이다. 한 번 눌러 세우고, 그다음 눌러 들어간다.
    const onTrackClick = (e) => {
      if (!stage) return;
      const c = e.target.closest('.cr__cell');
      if (c && !c.classList.contains('is-on')) {
        e.preventDefault(); e.stopPropagation(); go(+c.dataset.i);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); apiRef.current.scrollNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); apiRef.current.scrollPrev(); }
    };

    return (
      // 머리글은 본문 폭 안에, 트랙만 화면 전체로. 둘을 한 상자에 두면 머리글까지
      // 화면 끝으로 밀려 프로필 · 다른 섹션과 왼쪽 선이 어긋난다.
      <div className={'carousel ' + className} tabIndex={0} role="group"
           aria-label={label} onKeyDown={onKeyDown}>
        {head && <div className="cr__head">{head({ sel, go, n: items.length })}</div>}
        <div className="cr__stage" ref={stageRef}>
          <div className="cr__vp" ref={vpRef}>
            <div className="cr__track" onClickCapture={onTrackClick}>
              {items.map((it, i) => (
                <div className="cr__cell" data-i={i} key={i}>
                  <div className="cr__inner">{render(it, i, items.length)}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="cr__arrow cr__arrow--prev" type="button" aria-label="이전"
                  onClick={() => apiRef.current && apiRef.current.scrollPrev()}>‹</button>
          <button className="cr__arrow cr__arrow--next" type="button" aria-label="다음"
                  onClick={() => apiRef.current && apiRef.current.scrollNext()}>›</button>
        </div>
      </div>
    );
  }

  // 번호 레일. 머리글이 직접 그린다 — 캐러셀은 현재 번호와 이동 함수만 넘긴다.
  function CarouselRail({ n, sel, go, labels }) {
    return (
      <div className="cr__rail" role="tablist">
        {Array.from({ length: n }, (_, i) => (
          <button key={i} type="button" role="tab" aria-current={String(i === sel)}
                  onClick={() => go(i)}>
            {labels ? labels[i] : String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </div>
    );
  }

  Object.assign(window, { Carousel, CarouselRail });
})();
