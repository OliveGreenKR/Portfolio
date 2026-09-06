// pages/deck/motelet.js
// 슬라이드 덱 매니페스트 — Motelet 진행 템포 (2026.05 – 2026.09 · 2026-09-04 Steam 출시).
//
// ⚠️ 사실을 만들지 않는다. pages/progression-pacing/data.js 를 참조만 한다.
//    문장은 필드에서 잘라 쓰고(앞 N문장), 라벨·제목·순서만 매니페스트가 소유한다.
//
// ── 2026-09-06 재구성(7차). 사용자 지시로 **보여줄 성과 셋**을 축으로 다시 짰다.
//    ① 게임의 재미를 수치로 모델링해 분해·구조화했다
//    ② 그걸 잴 도구를 만들었다 — AI 를 붙이고 CLI 까지 만들어 워크플로우를 설계했다
//    ③ 그 결과 (페이스와 기여도를 읽을 수 있게 됐고 출시 빌드에 반영했다)
//
//    6차 판은 ①의 「어느 축으로 조정했는가」 가 통째로 빠져 있었다 — roles(처형·압축)과
//    equation 을 「30초에 안 걸린다」는 이유로 뺐는데, 그게 바로 사용자가 보여주려던
//    핵심이었다. 되살려 독립 장으로 세운다.
//    백업 = _archive/_portfolio_site/motelet/deck-before-rebuild-20260906-201436.zip
//
// ── 8장 ─────────────────────────────────────────────────────────────────────
//   1 표지    projectCover  progression-pacing/cover.jsx 가 소유
//   2 목표    diagram       PacingGoal — 완만 → 폭발 → 저항이 여러 번 반복
//   3 관찰    diagram       PacingProgress — 따로 움직이는 조건 넷을 진행도 한 축으로
//   4 조정    columns       처형 / 압축 — 어느 손잡이를 어느 방향으로 돌리는가 + 선택 식
//   5 반복    diagram       PacingFlow — AI 가 후보를 돌리고 사람이 판정하는 한 바퀴
//   6 도구    diagram       화면 여섯 장을 번호와 기능명으로 한 판에 (MTShots)
//   7 계산    step(code)    전투 시뮬레이터 + 유효 피해 절단 코드
//   8 결과    diagram       페이스 · 기여도 화면 두 장 + 도달 범위 (MTShots)
//
// ── 제목만 이어 읽었을 때 서는 흐름 ─────────────────────────────────────────
//   목표 → 재는 자 → 돌리는 손잡이 → 반복하는 방법 → 만든 도구 → 계산 → 결과.
//   ①은 2·3·4장, ②는 5·6·7장, ③은 8장이 받는다. 정체성은 표지가 낸다.
//
// ── ⚠️ 페이지 그림을 덱에 실을 때의 제약 (실측 근거) ────────────────────────
//   1. **Pacing* 은 인자를 안 받는다.** 여덟 개 전부 한 모양으로
//      `<Fig cls title caption>{wide}{narrow}</Fig>` 를 돌려준다. 그대로 실으면 둘이 깨진다.
//      (a) figcaption 이 page.css 의 15px 로 온다 — 덱 합격선은 16px 다.
//      (b) narrow SVG 는 `.mp-page .mp-svg-narrow{display:none}` 로만 숨는데,
//          audit 은 `.slide` 안 svg 를 **전수** 재므로 폭 0 짜리가 채움률 0 으로 잡힌다.
//      → MTFig 가 반환 엘리먼트의 children[0](wide)만 꺼내 쓴다. 그림의 제목·캡션은
//        슬라이드의 title · lead · note 가 받는다.
//   2. **`.mp-page` 조상이 있어야 한다.** SVG 글자 크기는 `.mp-page svg .mp-t-*` 가
//      갖는다(page.css 151~154). 감싸지 않으면 22/20/17/16px 이 통째로 사라진다.
//   3. **viz.jsx(HTML 도표)는 안 쓴다.** mp-reach(14px) · mp-equation(15px) ·
//      mp-f07(13.5px) 은 실픽셀이라 상자를 키워도 안 커진다. 같은 사실을 덱 레이아웃
//      (columns · MTShots)으로 다시 짜면 덱 글자 크기가 그대로 적용된다.
//      → 4장(처형·압축)이 mp-f07 대신 columns 를 쓰는 이유다.
//
// ── 페이지에는 있는데 덱에 안 넣은 것과 이유 ────────────────────────────────
//   **PacingF02(레벨 사다리)** — 「HP 250배 · 골드 50배」 는 **티어 1 → 6 전 구간**의
//     값이고 그 범위는 저 그림이 갖는다. 그림 없이 숫자만 실으면 어느 구간의 배수인지
//     없이 읽혀 주장이 넓어진다(1차 렌더 검수에서 빼기로 판정).
//   **adjust(조정 방향 4행)** — 4장이 「어느 손잡이인가」 까지 답하면 충분하다.
//     증상별 분기표는 30초 스캔이 읽을 밀도가 아니다. 상세 페이지가 받는다.
//   **PacingF05(유효 피해) · PacingF06(공간 적중) · PacingSim(틱 도해)** —
//     7장의 요점 한 줄과 코드가 같은 것을 말한다. 그림 장을 셋 더 쓰면 덱이
//     상세 페이지의 축소판이 된다.
//   **PacingF11 · decisions · f11.matrix(도구 배치·권한)** — 표 한 장은 30초에 안 읽힌다.
//     AI 요청 경계는 5장 요점(자동 레인)이 받는다.
//   **contribution(본인 담당 / 팀원 · AI 칸)** — 2026-09-06 사용자 판단. 이 덱이 서술하는
//     범위(진행 템포 모델 · 실험 도구)는 전부 개인 작업이라 담당을 가를 칸이 필요 없다.
//     8장은 그 자리에 프로젝트의 결과 요약을 쓴다. AI 활용 범위는 표지와 5장이 갖는다.
//
// ── 지면 규약 (페이지·KB 가 이미 내린 결정 — 덱이 뒤집지 않는다) ────────────
//   · 정도 주장 금지. 성능·개선률·완주율을 쓰지 않는다. 이 프로젝트에는 공개 가능한
//     계측이 없고, 화면 안 수치는 강제 클리어가 포함된 개발 빌드의 것이다.
//   · ⚠️ **「계단식 페이스를 완성했다」 · 「기여도 사이클을 만들어 냈다」 를 쓰지 않는다.**
//     claims.yaml 의 `forbidden_inferences` 가 「자산 반영만으로 재미·난이도 달성 입증」
//     「출시가 밸런스 목표 달성의 증거」 「모든 레벨이 이 순서를 실제로 따랐다는 주장」을
//     막는다. 덱이 쓸 수 있는 것은 **그 둘을 판정 축으로 정의하고 읽을 수 있게 만들었다**
//     까지다. 달성 주장을 쓰려면 자연 완주 실행의 전후 결과가 먼저 있어야 한다.
//   · 「출시했다」와 「의도한 리듬이 나왔다」를 붙여 쓰지 않는다.
//   · 후보 단계 측정치(c006 holdout 등)는 어디에도 안 쓴다.
//   · sl-h 는 renderInline 을 안 거친다 — **제목에 백틱·별표를 쓰지 않는다.**

(function buildMoteletDeck() {
  const D = window.PACING_DATA;
  const F = D.flow, R = D.results, E = D.evidence, G = D.goal, PG = D.progress;
  const RO = D.roles, EQ = D.equation, SM = D.sim, FT = D.features, CD = D.code;
  const RH = D.reach;
  // 공용 뷰가 쓰는 인라인 강조 렌더러. 캡션이 **강조**를 그대로 받아야 한다.
  const RI = window.renderInline;

  const SEC = {};
  D.sections.forEach((s) => { SEC[s.id] = s; });
  // 절의 prd 는 kind 가 중복된다(decision 이 둘인 절이 있다) — 순번으로 집는다.
  const prd = (id, i) => SEC[id].prd[i].text;

  // 문장 경계로만 자른다. 마침표 뒤가 별표(**로 닫는 문장)여도 경계로 본다 —
  // '. ' 만 보면 '반영했다.**' 에서 조용히 실패해 두 문장이 통째로 남는다.
  const sent = (t) => String(t).split(/(?<=\.\**)\s+/);
  const S = (t, n) => sent(t).slice(0, n).join(' ');
  const S2 = (t, a, b) => sent(t).slice(a, b).join(' ');

  /* ── 페이지 그림을 덱 슬롯에 싣는 껍데기 ──────────────────────────────────
     Pacing* 은 인자가 없고 전부 `<Fig …>{wide}{narrow}</Fig>` 를 돌려준다.
     엘리먼트를 만들어 children[0](wide SVG)만 꺼내고, `.mp-page` 로 감싸
     page.css 의 SVG 글자 크기 규칙(.mp-page svg .mp-t-*)이 걸리게 한다.
     ⚠️ 렌더가 아니라 **함수 호출**이다 — Pacing* 은 훅을 쓰지 않으므로 안전하다. */
  function MTFig({ of }) {
    const el = window[of]();
    const kids = React.Children.toArray(el.props.children);
    return <div className="mp-page mt-fig">{kids[0]}</div>;
  }
  window.MTFig = MTFig;

  /* ── 도구 화면 여러 장을 번호 + 기능명과 함께 한 판에 ──────────────────────
     사용자 지시(2026-09-06): 「내부 편집툴 모습을 한 슬라이드에 여러 개 담아서 보여주고,
     각 편집툴에 번호와 함께 무슨 기능이 있는지 한번에 나타내라.」

     ⚠️ 자르는 구간은 페이지의 `evidence.*.crop` 을 **그대로** 쓴다. 원본 상단에는
        툴바(`Stage04 Draft v2_codex` · `비교: Stage04 Draft v2_Claude`)와 강제 클리어
        경고, 소진 Seed 아홉 줄이 들어 있다 — 폐기 후보와 그 사유 · 후보 탐색 실행자
        이름은 이 덱이 안 쓰기로 한 것들이다(파일 머리 지면 규약). 페이지가 이미 잘라
        내는 대역을 덱만 통째로 실으면 사이트보다 많이 말하게 된다.

     ⚠️ **두 축을 다른 방법으로 자른다.** 페이지(Page.jsx EvidenceCrop)처럼 큰 그림을
        음수 오프셋으로 밀면 img 가 상자 위아래로 삐져나가는데, audit 의 escapeOf 는
        그걸 «부모 밖으로 삐져나감» 으로 잡는다 — 의도한 크롭과 사고로 겹친 것을
        그 지표는 구분하지 못한다. 그런데 escapeOf 도 clipOf 도 **세로만 잰다.** 그래서
          · 세로 = img 자신의 `object-fit: cover` + `object-position` (요소 밖으로 안 나감)
          · 가로 = 요소를 넓게 잡고 `left` 음수 (가로 넘침은 검사 대상이 아니다)
        로 나눠 처리한다. 상자는 `overflow: clip` — hidden 은 스크롤 컨테이너를 만들어
        clipOf 에 걸린다.

        cover 가 고르는 배율은 max(elW/full, elH/natH) 인데 elW = boxW × full/w,
        elH = boxW × h/w 이므로 h ≤ natH 인 한 **항상 가로 주도**라 배율은 boxW/w 로
        고정된다. 곧 상자 폭이 crop.w 픽셀을 담는다 — 페이지와 같은 창이다.
        세로 오프셋만 natH 를 알아야 해서 onLoad 로 읽는다.

     번호는 `results.order` 의 순서다 — 페이지가 「판단하는 순서」로 정해 둔 배열이라
     덱이 다시 고르지 않는다.

     ⚠️ `apply`(반영 화면)만 페이지에 crop 이 없다. 그 원본은 상단 110px 이 툴바라
        `Stage04 Draft v2_codex` · `비교: Stage04 Draft v2_Claude` 가 그대로 보인다 —
        다른 다섯 장에서 잘라 낸 바로 그 대역이다. 덱만 거기서 예외를 두면 한 판 안에서
        규약이 갈린다. crop 은 매니페스트 소유(site-adapter)라 여기서 덱 몫으로 정한다.
        **사이트보다 적게** 보이는 방향이므로 새 사실이 생기지 않는다. */
  const DECK_CROP = { apply: { x: 0, y: 115, w: 1600, h: 410, full: 2556 } };

  function MTShots({ ids, cols }) {
    const [nat, setNat] = React.useState({});
    return (
      <div className="mt-shots" style={{ '--shot-cols': cols }}>
        {ids.map((id, i) => {
          const it = E[id];
          const c = it.crop || DECK_CROP[id];
          const natH = nat[id] || 0;
          const slack = c ? natH - c.h : 0;
          const box = c ? { aspectRatio: c.w + ' / ' + c.h } : null;
          const img = c ? {
            position: 'absolute', top: 0,
            left: (-c.x / c.w * 100) + '%',
            width: (c.full / c.w * 100) + '%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '0% ' + (slack > 0 ? (c.y / slack) * 100 : 0) + '%',
          } : { position: 'static', width: '100%', height: 'auto' };
          return (
            <figure className="mt-shots__item" key={id}>
              <span className="mt-shots__win" style={box}>
                <img src={'progression-pacing/assets/' + it.image} alt={it.alt} style={img}
                     onLoad={(e) => {
                       const h = e.currentTarget.naturalHeight;
                       setNat((p) => (p[id] === h ? p : Object.assign({}, p, { [id]: h })));
                     }} />
              </span>
              <figcaption><b>{i + 1}</b><span>{it.title}</span></figcaption>
            </figure>
          );
        })}
      </div>
    );
  }
  window.MTShots = MTShots;

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.motelet = {
    proj: 'Motelet',
    slides: [
      // ─── 1. 표지 ────────────────────────────────────────────────────────────
      // 표지는 **페이지가 소유한다** — pages/progression-pacing/cover.jsx.
      // 덱 · 랜딩 카드 · 상세 페이지 히어로가 같은 표지를 쓴다. 여기서 정하는 것은
      // 어느 자리에 놓을지(순서 · 섹션 라벨)뿐이고, 목차 재료는 표지의 `toc` 가 낸다.
      { layout: 'projectCover', section: '메인', slug: 'progression-pacing', cls: 'mt' },

      // ─── 2. 목표 ★ ──────────────────────────────────────────────────────────
      // 성과 ①의 출발점. 이 장이 먼저 오는 이유 — 뒤의 축·손잡이·도구가 전부
      // 「이 주기를 만들려고」 존재한다. 목표를 모르면 나머지가 도구 자랑이 된다.
      {
        layout: 'diagram',
        section: '01 목표',
        cls: 'mt',
        title: '한 스테이지 안에서 반복되는 성장 주기',
        lead: G.headline,
        step: { viz: 'goal' },
        vizComponent: 'MTFig',
        vizProps: { of: 'PacingGoal' },
        points: [
          // sourceNote 둘째 문장은 그림의 반복 라벨과 리드가 이미 말한다. 그림이 못
          // 하는 말은 첫 문장 — 이 주기가 내 해석이 아니라 설계 문서 둘에 적혀 있다는 근거.
          ['이 주기의 출처', S(G.sourceNote, 1)],
          [G.noveltyTitle, G.novelty],
          ['직접 정한 것', G.mine],
        ],
      },

      // ─── 3. 관찰 축 ★ ───────────────────────────────────────────────────────
      // 성과 ① — 「재미를 무엇으로 재는가」. 따로 움직이는 조건 넷을 한 축으로 모은 것이
      // 주관을 비교 가능하게 만든 자리다.
      {
        layout: 'diagram',
        section: '02 관찰',
        cls: 'mt',
        title: '조건이 달라도 같은 위치에서 비교하는 진행도 축',
        // PG.title 은 제목과 같은 말이라 안 쓴다. 리드는 이 축이 왜 필요했는지 —
        // 곧 조건들이 따로 움직인다는 사실 — 를 받는다.
        lead: S(prd('goal', 0), 1),
        step: { viz: 'progress' },
        vizComponent: 'MTFig',
        vizProps: { of: 'PacingProgress' },
        // 조건 넷 · 진행도 식 · 사건 넷은 그림이 라벨까지 똑같이 그린다. 요점은
        // 그림이 못 그리는 것만 — 이 축의 **성격**과 **답하지 않는 것**.
        points: [
          [PG.mergeLabel, PG.axisNote],
          ['이 그림을 읽는 조건', S2(PG.caption, 1, 3)],
        ],
      },

      // ─── 4. 조정 축 ★ ───────────────────────────────────────────────────────
      // 성과 ① 의 나머지 절반 — 「무엇을 돌려서 그 주기를 만드는가」.
      // 6차 판에서 통째로 빠졌던 자리다(파일 머리 참조).
      // 페이지의 mp-f07(13.5px 실픽셀)을 쓰지 않고 덱 columns 로 다시 짠다.
      {
        layout: 'columns',
        section: '03 조정',
        cls: 'mt',
        // 제목에 「처형 · 압축」 을 안 쓴다 — 이 게임의 내부 명칭이라 배경지식 없이는
        // 처형(죽이기) · 압축(데이터)으로 읽힌다. 이름은 카드가 즉시 정의한다.
        title: '한 번에 크게 넣는 공격과 자주 넓게 맞히는 공격',
        // 성과 ①의 «수치적 모델링» 을 한 줄로 보이는 자리. 항의 뜻까지 붙여
        // 식이 장식이 아니라 판정에 쓰인 도구임을 드러낸다.
        gist: EQ.label + ' — ' + EQ.formula + ' (' + EQ.terms.map((t) => t[0] + ' ' + t[1]).join(' · ') + ')',
        colCount: 2,
        cols: RO.cards.map((c, i) => ({
          kind: i === 0 ? RO.axisLeft : RO.axisRight,
          title: c.name,
          pairs: [['발동', c.freq], ['담당', c.job], ['대상 티어', c.target], ['해당 공격', c.attack]],
          tone: i === 0 ? 'mine' : undefined,
        })),
        // 역할 배분의 한정어. 이게 없으면 「처형이 항상 최상위를 뚫는다」로 읽힌다.
        note: RO.caption,
      },

      // ─── 5. 반복 방법 ★ ─────────────────────────────────────────────────────
      // 성과 ② — 「그 조정을 어떻게 반복했는가」. AI 가 값 후보를 돌리고 사람이
      // 판정하는 한 바퀴. 사용자 지시의 «AI 사이클의 도움을 받아 했다» 가 이 장이다.
      {
        layout: 'diagram',
        section: '04 반복',
        cls: 'mt',
        title: '자동 반복과 사람의 판단으로 나눈 밸런싱 한 바퀴',
        lead: F.caption,
        step: { viz: 'flow' },
        vizComponent: 'MTFig',
        vizProps: { of: 'PacingFlow' },
        // split 은 사람 → 자동 → 사람 순이다. k(사람/자동)를 라벨 앞에 세워
        // 세 칸을 훑을 때 담당이 먼저 읽히게 한다.
        points: F.split.map((x) => [x.k + ' — ' + x.t, x.d]),
        note: prd('workflow', 2),
      },

      // ─── 6. 도구 ★ ──────────────────────────────────────────────────────────
      // 성과 ② — 만든 것의 실물. 사용자 지시로 여섯 화면을 번호 + 기능명과 함께
      // 한 판에 올린다. 번호 순서 = results.order = 페이지가 정한 「판단하는 순서」.
      // ⚠️ 캡처 안 수치를 문안이 인용하지 않는다. note 의 경계 문장이 그 조건이다.
      {
        layout: 'diagram',
        section: '05 도구',
        cls: 'mt',
        title: '판단하는 순서대로 나눈 여섯 개의 도구 화면',
        lead: S(R.intro, 1),
        step: { viz: 'shots' },
        vizComponent: 'MTShots',
        vizProps: { ids: R.order, cols: 3 },
        // boundary 첫 문장은 리드가 이미 말한다. 남는 문장이 이 캡처들을 성과로
        // 읽지 않게 막는 경계다.
        note: S2(R.boundary, 1, 2),
      },

      // ─── 7. 계산 ────────────────────────────────────────────────────────────
      // 성과 ② 의 바닥 — 도구가 무엇을 계산하는가. step 은 오른쪽에 그림 또는 코드
      // **하나만** 그린다. 여기서는 코드다.
      // ⚠️ 코드는 요점 셋 중 하나를 실제로 증명하는 것으로 고른다. CD.campaign(런
      //    재조립)을 실었다가 갈았다 — BuyWhileAffordable · buildDirty 뿐이라 틱 순서도
      //    세 축도 유효 피해도 증명하지 않았다. CD.damage 는 셋째 요점의 그 문장이
      //    코드에서 어떻게 생기는지 그대로 보인다: effective = Min(damage, monster.Hp).
      {
        layout: 'step',
        section: '06 계산',
        cls: 'mt',
        title: '게임 루프를 그대로 돌린 전투 시뮬레이터',
        step: {
          // 왜 평균 모델이 아니어야 했는가. 셋째 문장(남은 HP 100 예시)은 셋째 요점과
          // 겹쳐 뺀다.
          problem: S(prd('simulation', 0), 2),
          points: [
            ['한 틱의 갱신 순서', SM.steps.join(' → ')],
            // energyNote 를 이었다가 뺐다 — 「세 번째 공격 역할이 아니라」 의 기준인
            // 두 공격 역할(4장의 처형 · 압축)이 세 장 앞이라, 앞의 세 축 나열과 붙으면
            // 「세 번째 = 스킬」 로 읽힌다.
            ['함께 들고 가는 세 축', SM.axes.map((a) => a.t).join(' · ')],
            ['유효 피해 분리', FT.items[1].d],
          ],
          code: Object.assign({ lang: 'csharp' }, CD.damage, { title: CD.damage.label }),
        },
        // CD.sourceNote 를 썼다가 뺐다 — 「화면 캡처의 수치를」 이 앞 장을 가리키는
        // 유령 참조다. 대신 이 장이 넘겨받아야 할 두 한정어를 싣는다:
        // 모델의 재현 범위(sim.caption)와 보상 배분의 성격(tradeoff).
        note: S2(SM.caption, 1, 2) + ' ' + S2(prd('simulation', 3), 1, 2),
      },

      // ─── 8. 결과 ★ ──────────────────────────────────────────────────────────
      // 성과 ③. 제목은 사용자 지정(「사람이 마감해…」 → 「결과」).
      // 판정 축 둘(진행도 페이스 · 기여도 교대)을 **읽을 수 있게 됐다** 까지가
      // 이 덱이 쓸 수 있는 결과다 — 파일 머리 지면 규약의 ⚠️ 항 참조.
      // 담당/팀원·AI 칸은 사용자 판단으로 뺐다. 이 범위는 전부 개인 작업이다.
      {
        layout: 'diagram',
        section: '07 결과',
        cls: 'mt',
        title: '결과',
        lead: SEC.outcome.lead,
        step: { viz: 'shots' },
        vizComponent: 'MTShots',
        vizProps: { ids: ['pace', 'contribution'], cols: 2 },
        // reach 네 행 중 앞 셋이 결과다. 넷째(플레이 확인)는 빼 둔다 — 출시 반영
        // 바로 옆에 같은 무게로 서면 「출시했고 체감까지 확인됐다」로 읽힌다.
        points: RH.rows.slice(0, 3).map((r) => [r.name, r.note]),
        note: prd('outcome', 1),
      },
    ],
  };
})();
