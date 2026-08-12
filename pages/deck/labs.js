// pages/deck/labs.js
// 슬라이드 덱 매니페스트 — Labs 다섯을 한 장으로.
//
// ⚠️ 사실을 만들지 않는다. 다섯 페이지의 data.js + landing/data.js 를 참조만 한다.
//
// 다섯이 **같은 모양**이라 한 장에 접힌다 — 전부 built = [{kind, title, sub}] × 3 을 갖는다.
// 그래서 랜딩의 요약 한 줄(labs[].line)로 줄일 필요가 없다. 각 페이지가 자기 손으로
// 쓴 "만든 것 셋"의 제목을 그대로 실으면 카드 하나에 세 줄이 들어간다.
// 잃는 것은 built[].sub 한 층뿐이고, 그건 사이트가 갖는다 (outro 장이 링크를 준다).
//
// 순서는 landing/data.js 의 labs[] 그대로다 — 거기서 date desc 로 매긴 L.01~L.05 이고,
// 각 페이지의 meta.eyebrow · html title 도 같은 번호다. 여기서 다시 매기면 갈라진다.
//
// 색조를 안 쓴다: sage(확보) · terra(한계) · wheat(측정) · blue(외부) 넷 중 어느 것도
// 다섯 실험을 가르는 축이 아니다. 뜻 없는 색은 뜻이 있는 것처럼 읽힌다.

(function buildLabsDeck() {
  const L = window.LANDING_DATA;
  // 페이지마다 전역 이름이 다르다. 랜딩의 slug 로 찾는다.
  const DATA = {
    'sound-system': window.SOUND_DATA,
    'multi-leg-creature': window.ML_DATA,
    'bbq-master': window.BBQ_DATA,
    'staring-fire': window.SF_DATA,
    'ue5-action': window.UA_DATA,
  };

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.labs = {
    proj: 'Labs',
    slides: [
      {
        layout: 'columns',
        section: 'Labs · 05',
        // 섹션 라벨과 러닝헤더가 이미 Labs 다. 제목에서 또 쓰지 않는다.
        title: 'PoC 다섯',
        // gist 를 안 쓴다. 랜딩의 labs 요약("1일 ~ 8주 · GPU 유체 · 볼류메트릭 · 재사용 시스템")은
        // 기간이 카드 배지마다 붙은 뒤로 겹치고, '볼류메트릭' 은 다섯 카드 어디에도 없는 낱말이라
        // 이 장 안에서 가리킬 대상이 없다.
        colCount: 3,
        cols: L.labs.map((lab) => {
          const d = DATA[lab.slug];
          return {
            // 기간은 배지에 붙인다. sub 자리에 두면 다섯 칸 중 넷은 기간인데
            // L.01 만 규모("모듈 하나 · 시스템 둘")라 같은 자리의 축이 어긋난다.
            // 구분자가 중점이면 "UE5 · C++ · 8주 · 1인" 처럼 태그와 기간의 경계가 사라진다.
            kind: lab.tag + ' — ' + lab.duration,
            title: lab.title,
            // built[].title 만 나열하면 "온도가 곧 색이다" 처럼 이 장 안에서 해독이 안 된다.
            // 랜딩 카드의 한 줄이 그 셋을 받는 문맥이 된다 — 둘 다 사이트가 가진 문장이다.
            sub: lab.line,
            items: d ? d.built.map((b) => b.title) : [],
          };
        }),
      },
    ],
  };
})();
