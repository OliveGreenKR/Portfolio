// pages/deck/motelet.js
// 슬라이드 덱 매니페스트 — Motelet (개발 중 · 3인).
//
// ⚠️ 사실을 만들지 않는다. pages/motelet/data.js 를 참조만 한다.
//    문장은 필드에서 잘라 쓰고(앞 N문장), 라벨·제목만 매니페스트가 소유한다.
//
// ── 2026-08-17 재작성(5차). 페이지 전면 재작성(site 611cd42) 뒤 처음 맞추는 판이다.
//    사용자 지시로 **4장까지 압축**하고 표지를 탑다운 요약으로 올렸다.
//
// ── 5장 ─────────────────────────────────────────────────────────────────────
//   1 표지    cover    이름 + 만든 것 3 + 역할 한 줄 + 링크 둘 + 게임 화면
//   2 밸런싱  diagram  전투 사이클 → 골드 분해 트리(수식화). MTPageDecompTree 전폭
//   3 도구    diagram  에디터 캡처 + 번호 핀·범례(MTDeckShot) + 소스/가정 · 상대 순위
//   4 런타임  diagram  MTPageGeoWorld + 왜 안 썼나 · 무엇이 들어갔나
//   5 런타임  step     등록·질의 계약 코드(runtime.contract) + 요점 셋
//
// ── 이전 판(5장)에서 바뀐 것과 이유 ──────────────────────────────────────────
//   · 2장 「프로젝트 소개」 columns 를 없앴다. 역할 경계·커밋·코드 규모는 정보량이 적어
//     한 장을 쓸 값이 아니다 — 표지의 role · scopes · note 로 흡수했다(사용자 판단).
//   · 옛 3·4장(분해 트리 / 히트맵)을 각각 2·3장으로 당기고, 2장이 사이클 개요까지 받는다.
//   · 그림을 **페이지 그림(MTPage*)으로 교체**했다. 덱 레거시(MTGoldDecompViz ·
//     MTGeoArchViz)는 사실이 컴포넌트 안에 박혀 있고, 캡션에는 data.js 에 없는 문장
//     ("스폰 항 = 공급량 ÷ 스폰 간격")까지 들어 있다 — 덱이 사이트보다 앞서 나가는 자리다.
//     MTPage* 는 data.js 를 읽으므로 사실이 갈릴 수 없다.
//   · 옛 판은 data.js 를 `split('   ←')` 같은 **문자열 분해**로 읽었다. 이번 판은 필드를
//     그대로 참조하고, 자르는 것은 문장 경계(S/S2)뿐이다.
//
// ── ⚠️ 그림을 쓸 때의 제약 (실측 근거) ──────────────────────────────────────
//   1. **한 슬롯에 그림 하나.** audit 은 svg 채움률을 슬롯(.sl-diagram__art) 전체 대비로
//      잰다. 두 그림을 세로로 쌓으면 각각 세로 0.4대가 되어 둘 다 FAIL 이다.
//      → 2장에서 사이클 스트립(MTPageCycle)을 포기하고 텍스트로 내린 이유.
//   2. **MTFigure 의 kicker · caption 을 넘기지 않는다.** page.css 가 각각 11.5px · 13px
//      로 고정하는데 덱 합격선은 16px 다. 넘기면 캡션 검사에서 바로 떨어진다.
//      → vizProps 에서 title/caption 을 null 로 덮고, 그 문장은 슬라이드 note·요점이 받는다.
//   3. **HTML 로 그린 것은 안 커진다.** MTPageWhyGeo(비교표) · MTPageMatrix(커널 행렬) ·
//      MTPageShot(핀 목록)은 SVG 가 아니라 글자가 13px 실픽셀 그대로다. 안 쓴다 —
//      히트맵 화면은 공용 sl-shot(캡션 22px)으로 싣는다.
//
// ── 페이지에는 있는데 덱에 안 넣은 것과 이유 ────────────────────────────────
//   **§05 재지 않은 것(cost) 통째로** — 사용자 판단. 제출용 덱은 결과만 싣는다.
//     빼도 사실 규칙에 안 걸린다 — 이 덱은 애초에 성능·정도 주장을 하나도 하지 않는다.
//   **런타임의 나머지 셋(주입 부팅 · 적재 정책 · 배치 렌더)** — 사용자 지시가
//     "기하엔진 구조 및 사용 이유 핵심만" 이다. 4장 덱에서 런타임은 한 장이고,
//     그 한 장은 기하 월드가 갖는다. 상세는 표지의 상세 페이지 링크가 받는다.
//   **코드 블록 전부(BalanceSimCore · HeatmapCalculator · GeoWorldRegistry · QuadBatch)** —
//     그림 장과 한 장에 못 들어간다(공유 렌더러는 오른쪽에 그림 또는 코드 하나만 그린다).
//     4장 예산에서 코드 전용 장을 못 뺀다 — 실코드의 흔적은 요점 안 인라인으로 남긴다.
//   **자동 수치 탐색** — 만들었지만 결정에 안 썼다. 페이지가 그 절을 지웠고 덱도 안 싣는다.
//     ⚠️ pill 은 engine.js 가 **목차 태그로 그대로 쓴다** — 지운 절의 pill 을 남기면 목차가 오염된다.
//   **skill-tree-editor.png · balance-sim.png** — data.js 가 안 가리키는 자산이다.
//     덱이 먼저 쓰면 사이트에 없는 사실이 덱에만 생긴다.
//
// ── 지면 규약 (페이지가 이미 내린 결정 — 덱이 뒤집지 않는다) ────────────────
//   · 정도 주장 금지. "성능 향상 / 끊김 없음 / 빠른 공간분할" 을 쓰지 않는다.
//   · 밸런싱 2장 : 런타임 1장. 런타임은 밸런싱의 근거가 아니라 병렬 작업이다.
//   · 밸런싱 에디터는 **따로 새로 만든 창**이다. "팀원 에디터 위에 얹었다" 는 틀린 문장.
//   · 히트맵 화면의 수치를 읽지 않는다 — 그때 프리셋 기준이다.
//   · 모델의 동시존재 상한과 런타임 스폰 캡을 나란히 쓰지 않는다(같은 개념, 다른 값).
//   · sl-h 는 renderInline 을 안 거친다 — **제목에 백틱·별표를 쓰지 않는다.**

(function buildMoteletDeck() {
  const M = window.MOTELET_DATA;

  // 문장 경계로만 자른다. 마침표 뒤가 별표(**로 닫는 문장)여도 경계로 본다 —
  // '. ' 만 보면 '상대 순위다.**' 에서 조용히 실패해 두 문장이 통째로 남는다(실측).
  const sent = (t) => String(t).split(/(?<=\.\**)\s+/);
  const S = (t, n) => sent(t).slice(0, n).join(' ');
  const S2 = (t, a, b) => sent(t).slice(a, b).join(' ');
  const plain = (t) => String(t).replace(/\*\*/g, '');

  // 그림틀의 kicker·caption 을 떼고 넘긴다 — 위 제약 2.
  const bare = (obj) => Object.assign({}, obj, { title: null, caption: null });

  /* ── 덱용 캡처 배치 ────────────────────────────────────────────────────────
     페이지의 MTPageShot 을 그대로 못 쓴다 — 핀 목록·캡션이 page.css 의 13px 고정이라
     1920 슬라이드에서 안 읽히고, 안쪽 스크롤 컨테이너가 clip 검사에 걸린다.
     그림·핀 좌표·문구는 전부 data.js 의 sim.shot 그대로다. 여기서 정하는 것은 배치뿐 —
     왼쪽에 핀 얹은 캡처, 오른쪽에 같은 번호의 범례. 사실은 하나도 새로 만들지 않는다.
     ⚠️ 캡처 상자는 aspect-ratio 로 잡는다. object-fit 으로 줄이면 상자와 이미지 크기가
        갈라져 절대배치한 핀이 어긋난다. */
  const PIN = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 32, height: 32, borderRadius: '50%', flex: '0 0 auto',
    background: 'var(--terra-500)', color: 'var(--paper)',
    fontSize: 18, fontWeight: 700, lineHeight: 1,
  };

  function MTDeckShot({ shot }) {
    return (
      // ⚠️ flexDirection 을 명시한다 — 슬롯의 `.sl-diagram__art > *` 규칙이 column 을 걸어서
      //    빼먹으면 캡처가 전폭으로 늘어나 세로로 넘친다(실측 933px).
      <div style={{ display: 'flex', flexDirection: 'row', gap: 28, height: '100%', minHeight: 0, alignItems: 'stretch' }}>
        <div style={{ flex: '1 1 62%', minWidth: 0, display: 'flex' }}>
          <div style={{ position: 'relative', margin: 'auto', maxWidth: '100%', maxHeight: '100%',
                        aspectRatio: '2553 / 1362', border: '1px solid var(--rule)', background: 'var(--paper-3)' }}>
            <img src={shot.img} alt={shot.alt} style={{ width: '100%', height: '100%', display: 'block' }} />
            {shot.callouts.map((c) => (
              <span key={c.n} style={Object.assign({}, PIN, {
                position: 'absolute', left: c.x + '%', top: c.y + '%',
                transform: 'translate(-50%, -50%)', boxShadow: '0 0 0 2px var(--paper)',
              })}>{c.n}</span>
            ))}
          </div>
        </div>
        <ol style={{ flex: '1 1 38%', minWidth: 0, margin: 0, padding: 0, listStyle: 'none',
                     display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          {shot.callouts.map((c) => (
            <li key={c.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={PIN}>{c.n}</span>
              <span style={{ fontSize: 20, lineHeight: 1.4 }}>
                <b style={{ fontWeight: 600 }}>{c.label}</b>
                <span style={{ color: 'var(--ink-2)' }}>{' — ' + c.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  }
  window.MTDeckShot = MTDeckShot;

  // 사이트 주소는 data.js 에 없다(자기 주소를 자기가 안 갖는다) — outro.js · CM 덱과 같은 값.
  const SITE = 'https://olivegreenkr.github.io/Portfolio/';
  // ⚠️ 스토어 주소는 **사용자가 준 값**이다(2026-08-16). data.js 의 meta 에는 아직 없다 —
  //    페이지를 가진 세션이 `meta.steam` 으로 옮기면 그때 여기서도 M 을 참조하게 바꾼다.
  const STEAM = 'https://store.steampowered.com/app/4850970/Motelet/';

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.motelet = {
    proj: 'Motelet',
    slides: [
      // ─── 1. 표지 — 탑다운 요약 ──────────────────────────────────────────────
      // 제출 문서의 첫 장이다. 큰 글자는 **이름**을 말하고, 그 아래에서 이 절 전체가
      // 한 번에 요약된다 — 무슨 게임인가(hook) · 무엇을 만들었나(specs) ·
      // 어디까지가 내 것인가(role · scopes). 뒤의 세 장은 그중 셋을 펼친 것이다.
      {
        layout: 'cover',
        section: '메인',
        subtitle: M.meta.subtitle,
        title: M.meta.title,
        // 게임 한 줄 + 이 프로젝트의 주장. what 의 둘째 문장(한 판 규칙)은 2장이 받는다.
        hook: S(M.what, 1) + ' ' + M.hook,
        // 심사자가 가장 먼저 찾는 줄 — 스펙 목록 안에 두면 Unity 버전과 같은 무게가 된다.
        // ⚠️ 공유 Cover 렌더러는 <b>라벨</b><span>본문</span> 을 붙여서 낸다 — 사이에 여백이
        //    없어 "프로그래머맡은 것은" 으로 붙는다(실측). 본문 앞에 nbsp + 구분자를 넣는다.
        role: ['PM 겸 배틀씬 프로그래머', ' — ' + S(M.meta.boundary, 1)],
        // ⚠️ pills 는 engine.js 가 목차 태그로 그대로 쓴다 — 짧게 유지한다.
        pills: M.built.map((b) => ({ text: b.title, tone: 'sage' })),
        // 만든 것 셋. 2·3·4 장이 각각 이 줄 하나씩을 펼친다.
        specs: M.built.map((b) => '**' + b.title + '** — ' + b.sub),
        // 팀 경계 · 커밋 귀속 · 코드 규모를 뒀다가 전부 뺐다(사용자 지시). 제출용 포폴에서
        // 표지가 할 일은 "무엇을 만들었나" 지 "무엇이 남의 것인가" 가 아니다.
        // 역할은 위 role 한 줄이 진다.
        links: [
          { label: '상세 페이지', v: '전체 서술 · 코드 · 다이어그램',
            href: SITE + 'pages/motelet.html', tone: 'sage', hero: true },
          { label: 'Steam', v: M.meta.title + ' (개발 중)', href: STEAM, tone: 'blue' },
        ],
        hero: { img: M.hero.img, caption: M.hero.caption },
      },

      // ─── 2. 전투 사이클 → 수식화 ────────────────────────────────────────────
      // 한 장의 주장: 주관이던 "성장 체감" 을 계산 가능한 정의로 바꿨다.
      // 사이클은 그 정의의 전제라 리드와 첫 요점이 받고, 그림 자리는 **식**이 갖는다 —
      // 그림 둘을 쌓으면 채움률로 둘 다 떨어진다(위 제약 1).
      {
        layout: 'diagram',
        section: '01 밸런싱',
        no: 'a',
        title: '성장 체감을 계산 가능한 정의로',
        // ⚠️ 리드는 한 줄로 묶는다. 그림 높이는 슬롯 **폭**이 정하므로(svg width:100%),
        //    리드가 두 줄이 되면 그만큼 슬롯이 짧아져 그림이 제 상자 밖으로 잘린다(실측 57px).
        lead: M.cycle.gist,
        step: { viz: 'decomp' },
        vizComponent: 'MTPageDecompTree',
        vizProps: { decomp: bare(M.model.decomp) },
        points: [
          ['한 판이 도는 순서',
            M.cycle.steps.map((s, i) => s + '(' + M.cycle.subs[i] + ')').join(' → ')
            + '. ' + S(M.cycle.caption, 1)],
          ['왜 식으로 바꿨나', M.model.problem + ' ' + M.model.gist],
          ['식이 버리는 두 자리',
            M.model.minTable.rows[0][0] + ' 은 ' + M.model.minTable.rows[0][1] + '을, '
            + M.model.minTable.rows[1][0] + ' 은 ' + M.model.minTable.rows[1][1] + '을 버린다. '
            // rows[1][2] 는 '**DPS 를 기준 지표로 안 쓴 이유**' — 강조 표시 안에서 잘라내면
            // ** 짝이 깨진다. 강조를 벗겨 문장으로 세우고 다시 감싼다.
            + '그래서 **' + plain(M.model.minTable.rows[1][2]).replace('안 쓴 이유', '안 썼다') + '.**'],
        ],
        // 잎 두 줄 중 공격력 항만 싣는다. 치사율 쪽은 요점 셋째 칸이 말로 이미 말하고,
        // 둘 다 실으면 note 가 두 줄이 되어 그림이 제 상자에서 8px 잘렸다(실측).
        note: M.model.formula.lines[1][0] + ' = ' + M.model.formula.lines[1][1]
          + '. ' + M.model.formula.result,
      },

      // ─── 3. 에디터 시뮬레이터 ★ ─────────────────────────────────────────────
      // 이 프로젝트의 핵심 판단. 모델이 게임을 재현하지 않는다는 것을 인정한 위에서
      // **무엇을 읽을지**를 바꿨다. 근거는 화면 하나에 다 있다.
      // ⚠️ shot.caption 은 페이지의 번호 핀을 가리킨다 — 핀 없는 원본 이미지를 싣는
      //    이 장에서는 유령 참조가 된다. 캡션은 callouts 의 라벨에서 다시 짠다.
      {
        layout: 'diagram',
        section: '01 밸런싱',
        no: 'b',
        title: '노드별 상대 순위를 읽는 밸런싱 에디터',
        // toolGist 첫 문장은 "그 질문에 답하려고" 로 시작한다 — 페이지 앞 절을 가리키는
        // 유령 참조라 덱에서는 못 쓴다.
        lead: S2(M.sim.toolGist, 1, 2),
        // 창의 기능은 글이 아니라 **번호**가 설명한다 — 캡처 위 핀과 오른쪽 범례가 짝이다.
        // 「창 하나에 여섯 기능」 요점을 글로 뒀다가 뺐다. 같은 말을 그림과 글이 두 번 한다.
        step: { viz: 'shot' },
        vizComponent: 'MTDeckShot',
        vizProps: { shot: M.sim.shot },
        points: [
          ['소스와 가정을 갈랐다',
            M.sim.split.rows.slice(0, 2).map((r) => r[0]).join(' · ') + ' 는 게임 자산에서 읽고, '
            + M.sim.split.rows.slice(0, 2).map((r) => r[1]).join(' · ') + ' 는 내가 정했다. '
            + S2(M.sim.splitNote, 2, 3)],
          ['그래서 값이 아니라 순위를 읽는다',
            M.sim.code.intro + ' ' + M.sim.code.result],
        ],
        // shot.note(촬영 시점 · 화면 수치를 읽지 않는다)를 각주로 달았다가 뺐다 —
        // 제출용 포폴에서 필요한 단서가 아니다. 캡처의 수치를 문안이 인용하지도 않는다.
      },

      // ─── 4. 기하 월드 ───────────────────────────────────────────────────────
      // 비중 1장. 제목은 "왜 안 썼나" 가 아니라 **무엇으로 대신했나** 를 말한다 —
      // 게임의 요구가 정밀 충돌이 아니었고, 그 요구에 맞는 크기의 것을 넣었다는 게 요점이다.
      // 코드 블록 자리가 없으므로 실제 타입·함수 이름은 요점 안 인라인으로 남긴다.
      // ⚠️ step 이 아니라 diagram 이다. step 은 요점을 2열로 세로에 쌓아 그림 슬롯이
      //    337px 까지 줄었고, 그 상자에서 그림이 197px 잘렸다(실측). diagram 은 요점을
      //    아래 3열로 가로 배치해 세로를 그림에 돌려준다.
      {
        layout: 'diagram',
        section: '02 런타임',
        no: 'a',
        title: '물리 엔진 대신 넣은 기하 월드',
        // ⚠️ runtime.gist 둘째 문장은 감당 여부를 말한다 — 이 프로젝트는 빌드에서
        //    프레임을 잰 적이 없다. 정도 주장으로 읽히지 않게 첫 문장까지만 쓴다.
        lead: S(M.runtime.gist, 1),
        step: { viz: 'geo' },
        vizComponent: 'MTPageGeoWorld',
        vizProps: { geo: bare(M.runtime.geo) },
        points: [
          ['왜 물리 엔진을 안 썼나',
            M.runtime.why.rows[0][0] + '가 다르다 — ' + M.runtime.why.rows[0][1] + ' 대 **'
            + plain(M.runtime.why.rows[0][2]) + '**. ' + M.runtime.why.rows[1][0] + '도 '
            + M.runtime.why.rows[1][1].replace(' (프레임률에 따라)', '') + ' 대 **'
            + plain(M.runtime.why.rows[1][2]) + '**. 요구는 정밀 충돌이 아니라 **'
            + plain(M.runtime.why.rows[2][2]).replace(' — 요구', '') + '**이었다.'],
          ['들어간 것은 질의 넷과 커널 일곱',
            S(M.runtime.matrix.caption, 1) + ' ' + M.runtime.code.result
            + ' 바디 모양으로 `Geo2D.CircleVsCapsule` 같은 커널이 갈린다.'],
          // 「바디도 호출자도 서로를 모른다」는 요점을 뒀다가 뺐다. 그림이 점선(자기 등록)과
          // 실선(질의)으로 이미 그 말을 하고, 요점으로 다시 쓰면 같은 주장이 한 화면에 두 번이다.
        ],
        // 판단의 근거가 되는 한 줄을 note 가 받는다. geo.note(분류 저작 누락 시 어떤 질의에도
        // 안 잡힌다)는 다음 장 요점이 받는다.
        note: M.runtime.whyNote,
      },

      // ─── 5. 등록·질의 계약 코드 ─────────────────────────────────────────────
      // 앞 장이 그림으로 말한 구조를 코드가 증명한다 — 한 장에 그림+코드를 같이 넣으면
      // 둘 다 못 읽으므로(공유 렌더러도 오른쪽에 하나만 그린다) 장을 나눴다.
      // 코드는 data.js 의 runtime.contract 다. 실코드 인용이고 출처는 그 필드 주석에 있다.
      {
        layout: 'step',
        section: '02 런타임',
        no: 'b',
        title: '등록과 질의를 잇는 인터페이스 하나',
        // 절 요약(geo.title = "바디는 스스로 등록하고, 밖에서는 질의만 들어온다")을 얹었다가
        // 뺐다 — 제목과 같은 말인데 36px 을 먹어서 코드가 상자 밖으로 21px 밀렸다(실측).
        step: { code: M.runtime.contract },
        points: [
          ['등록은 수명이 한다', S2(M.runtime.geo.caption, 2, 3)],
          ['호출자가 아는 것은 질의뿐',
            M.runtime.geo.callerEdge + '. 모양과 분류 필터를 넘기면 월드가 '
            + '호출자가 준 `output` 리스트에 결과를 채운다.'],
          ['분류를 빠뜨리면 즉시 드러난다', M.runtime.geo.note],
        ],
        note: M.runtime.contract.result,
      },
    ],
  };
})();
