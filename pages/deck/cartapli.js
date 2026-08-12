// pages/deck/cartapli.js
// 슬라이드 덱 매니페스트 — Cartapli: Fold Quest (PC · Steam 출시작).
//
// ⚠️ 사실을 만들지 않는다. pages/cartapli/data.js 를 참조만 한다.
//
// 이 프로젝트는 또 다른 모양이다 — meta 에 pills 가 없고(개별 필드), 요점이
// [라벨, 본문] 쌍이 아니라 문자열이며, 그림 대신 mermaid 다이어그램을 쓴다.
// 뷰는 그대로 두고 매니페스트가 맞춘다:
//   meta 개별 필드 -> pills / problem -> why / decision -> did / results -> points
//
// 뺀 것 (지면 경쟁에서 밀린 것):
//   systems 3.3 생명주기 · 3.5 SO+DB · 3.6 배틀 FSM · 3.7 데미지 분리
//     -> 셋 다 "책임을 나눈다" 는 같은 주장의 변주다. 3.1 이 그 주장의 최강 사례고,
//        3.2(확장성) · 3.4(이벤트 순서)가 서로 다른 각도를 더한다
//   metrics 표 · screenshots · systems[].table -> 표는 면접에서 꺼낸다

(function buildCartapliDeck() {
  const C = window.CARTAPLI_DATA;
  const sys = (no) => C.systems.find((s) => s.no === no);

  // 3.1 은 25노드짜리 의존 그래프다. 슬라이드에서는 어느 방향으로 눕혀도 못 읽는다 —
  // 실측: TB 1150x1427(세로 초과) · LR 2776x384(가로 초과). 둘 다 글자가 10px 이하로 떨어진다.
  // 그래서 그림 대신 **계층 카드 셋**으로 낸다. 문장을 새로 쓰지 않고 mermaid 소스의
  // subgraph 라벨과 노드 이름을 그대로 파싱해 쓴다 — data.js 가 바뀌면 카드도 따라간다.
  const layersFromMermaid = (src) => {
    const out = [];
    let cur = null;
    src.split(String.fromCharCode(10)).forEach((line) => {
      const g = line.match(/subgraph\s+\w+\["([^"]+)"\]/);
      if (g) { const [k, ...rest] = g[1].split(' · '); cur = { kind: k, title: rest.join(' · '), items: [] }; out.push(cur); return; }
      if (/^\s*end\s*$/.test(line)) { cur = null; return; }
      const n = line.match(/^\s*\w+\["([^"]+)"\]/);
      if (n && cur) cur.items.push(n[1].replace(/<br\s*\/?>/g, ' — ').replace(/\(([^)]*)\)/g, '$1'));
    });
    // System Layer 처럼 한 단어짜리 노드가 여럿이면 줄마다 한 칸씩 먹어 넘친다.
    // 짧은 항목만 모여 있으면 한 줄로 합친다 — 이름은 그대로다.
    return out.map((l) => (l.items.length > 4 && l.items.every((t) => t.length <= 14)
      ? Object.assign({}, l, { items: [l.items.join(' · ')] })
      : l));
  };

  // mermaid 가 있는 절은 그림이 주인공이다. 세로형(graph TB) 은 가로 슬라이드에서
  // 세로에 맞춰 19% 까지 줄어 글자가 3px 이 된다(실측) — 덱에서만 LR 로 눕힌다.
  //
  // ⚠️ 그림이 있는 절에서는 code 를 오른쪽에 붙이지 않는다. Step 은 viz/mermaid 를
  //    code 보다 먼저 고르므로 코드가 조용히 사라진다 — 코드 장(codeOf)으로 따로 낸다.
  const system = (no, pick, title) => {
    const s = sys(no);
    return {
      layout: s.mermaid ? 'diagram' : 'step',
      gist: s.lede,
      section: s.kind,
      no: s.no,
      title: title || s.title,
      // 세로형(graph TB) 은 가로 슬라이드에서 세로에 맞춰 줄어 글자가 3px 이 된다(실측:
      // TB 1150x1427 -> LR 2700x359). 배치 방향만 눕힌다 — 노드도 간선도 그대로다.
      step: { problem: s.problem, did: s.decision, points: [],
        mermaid: s.mermaid ? s.mermaid.replace(/^\s*graph\s+(TB|TD|BT)/m, 'graph LR') : null,
        code: s.mermaid ? null : s.code },
      points: pick ? pick.map((i) => s.results[i]) : s.results,
    };
  };

  // 코드 장. 그림 장과 나누는 이유는 DX11 과 같다 — 한 장에 그림 + 코드 + 요점을
  // 다 넣으면 셋 다 작아지고, 무엇보다 설계 설명만 있고 코드가 없는 장이 남는다.
  // 코드는 실제 레포(D:/UnityProjects/Cartapli)에서 뜬 것이고 data.js 가 갖는다.
  // lead(problem/did)를 안 준다 — 이유는 deck/dx11.js 의 같은 헬퍼 주석과 같다.
  // 절 요약(lede)도 안 준다. 바로 앞 그림 장이 같은 문장을 이미 머리에 달고 있다.
  const codeOf = (no, title, pick) => {
    const s = sys(no);
    return {
      layout: 'step', section: s.kind, no: s.no, title,
      step: { code: s.code, points: [] },
      points: pick.map((i) => s.results[i]),
    };
  };

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.cartapli = {
    proj: 'Cartapli: Fold Quest',
    slides: [
      // ─── 표지. meta 에 pills 배열이 없어 개별 필드로 만든다 ───
      {
        layout: 'cover',
        section: 'Main · Shipped',
        subtitle: C.meta.title,
        title: C.meta.oneLine,
        // roles.mine 전문은 항목 7개짜리 목록이라 표지에 안 맞고, 뒤 '역할 경계' 장과
        // 완전히 겹쳤다. 표지는 한 줄로 줄이고 전문은 그 장에서 쪼개 보인다.
        hook: '배틀씬 전체 시스템 설계·구현 — 턴 · 스킬 · AI · 스폰 · 데미지',
        pills: [
          { kind: 'accent', text: C.meta.period + ' · ' + C.meta.weeks },
          { kind: 'plain', text: C.meta.team },
          { kind: 'plain', text: C.meta.stack.slice(0, 4).join(' · ') },
          { kind: 'accent', text: C.meta.role },
        ],
        links: [{ label: 'Steam', v: C.meta.platform, href: C.meta.steam, tone: 'sage' }],
        hero: { img: C.heroImage, caption: C.meta.title + ' — ' + C.meta.oneLine },
      },

      // ─── 출시 결과. 이 프로젝트는 "끝까지 갔다" 가 주장이다 ───
      // 큰 수치 넷만 두면 세로가 절반 남는다(실측 42% — 덱 최저). heroMetrics 가
      // 안 쓴 metrics 행 둘과 규모 fact 를 아래 격자로 받고, Steam 링크를 붙인다.
      // 전부 data.js 가 이미 가진 값이다 — 새로 쓴 것은 없다.
      {
        layout: 'stats',
        section: '01 출시',
        title: '출시와 운영',
        bigs: C.heroMetrics,
        // 표의 라벨(영문)과 큰 수치의 라벨(국문)이 서로 달라 이름으로는 못 짝짓는다.
        // 값으로 짝짓는다 — 큰 수치에 이미 나온 행은 아래에 또 쓰지 않는다.
        // 기준일(r[2])은 안 붙인다 — 노트가 "그 외 지표 2026-05 둘째주 기준" 이라고
        // 한 번에 말한다. 행마다 붙이면 한 장에 같은 날짜가 여섯 번 찍힌다.
        pairs: [
          ...C.metrics.rows
            .filter((r) => !C.heroMetrics.some((b) => r[1].includes(b.n)))
            .map((r) => [r[0], r[1]]),
          C.facts.find((f) => f[0] === '규모'),
          C.facts.find((f) => f[0] === '스택'),
        ].filter(Boolean),
        // 라벨이 이미 Steam 이다. platform 을 그대로 쓰면 칩 하나에 Steam 이 두 번 —
        // 앞의 'Steam' 과 괄호만 벗겨 쓴다.
        links: [{ label: 'Steam', v: C.meta.platform.replace(/^Steam\s*\(?/, '').replace(/\)$/, ''),
                  href: C.meta.steam, tone: 'sage' }],
        note: '평가 2026-02 누적 · 그 외 지표 2026-05 둘째주 기준',
      },

      // ─── 역할 경계. 출시작이라 팀 작업이고, 무엇이 내 것인지 먼저 밝힌다 ───
      {
        layout: 'columns',
        section: '02 범위',
        title: '역할 경계 — 본인 / 팀원',
        cols: [
          // 중점으로 이어붙인 줄글은 훑는 눈에 덩어리 하나로 보인다. 항목으로 끊는다.
          { kind: 'MINE', tone: 'sage', title: '본인',
            items: C.roles.mine.split(' · ').map((t) => t.replace(/\.$/, '')) },
          { kind: 'TEAM', title: '팀원 — 종이접기 PoC 입안자', sub: C.roles.others },
        ],
      },

      // ─── 시스템 셋. 같은 "책임을 나눈다" 주장의 서로 다른 각도 ───
      // ─── 3.1 은 그림 대신 계층 카드 ───
      {
        layout: 'columns',
        section: sys('3.1').kind,
        no: '3.1',
        title: '배틀씬 아키텍처',
        gist: sys('3.1').lede,
        cols: layersFromMermaid(sys('3.1').mermaid).map((l, i) => ({
          kind: l.kind, tone: ['wheat', 'sage', 'blue'][i], title: l.title, items: l.items,
        })),
        note: sys('3.1').results[0],
      },
      // 3.1 에는 코드가 없다 — 아키텍처 절이라 인용할 단일 파일이 없다. 대신 싱글톤 표를
      // 싣는다. 실행 순서까지 박힌 구현 사실이라 설계 설명만 있는 장을 메운다.
      {
        layout: 'list',
        section: sys('3.1').kind,
        no: '3.1',
        title: '싱글톤 실행 순서',
        gist: sys('3.1').tableTitle || '초기화 순서를 ExecutionOrder 로 고정해 참조 시점을 보장한다.',
        pairs: sys('3.1').table.rows.map((r) => [r[0], r[1] + '  ·  ExecutionOrder ' + r[2]]),
        pairCols: 2,
      },
      // 3.2 는 그림 장 + 코드 장으로 나뉜다. 그림은 개발/추가 두 흐름을 보이고,
      // 코드는 그 흐름이 딛는 계약(불변 컨텍스트 · 오버라이드 한 점)을 보인다.
      system('3.2', [0, 1], '스킬 시스템'),
      codeOf('3.2', '실행 컨텍스트와 확장점', [2, 3]),
      // 3.4 는 mermaid 가 없어 오른쪽이 비어 있었다 — 코드가 그 자리를 받는다.
      // 제목은 data.js 원제목을 그대로 쓴다. '이벤트 패턴' 으로 줄이면 주제만 남고
      // 주장(2단계로 갈랐다)이 사라져, 제목만 훑어서는 무슨 얘긴지 모른다.
      // 요점 0("같은 프레임 충돌 해소")은 뺀다 — 절 요약 · 한 것 · 코드 소개가 이미 세 번 말했다.
      system('3.4', [1, 2], 'Pre / On 2단계 이벤트 패턴'),
    ],
  };
})();
