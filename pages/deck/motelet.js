// pages/deck/motelet.js
// 슬라이드 덱 매니페스트 — Motelet (개발 중 · 3인).
//
// ⚠️ 사실을 만들지 않는다. pages/motelet/data.js 를 참조만 한다.
//    문장을 복사해 넣지 않는다 — 잘라 쓰고(앞 N문장), 라벨만 명사구로 덮는다.
//
// ── 2026-08-16 재조립(4차). 앞 두 장을 **문서 양식**에 맞췄다(사용자 지시).
//    표지는 프로젝트 **이름**을 세우고, 소개를 그다음 한 장으로 뗀다 — CM 덱과 같은 꼴.
//
// ── 5장. 무엇을 어디에 썼나 ────────────────────────────────────────────────
//   1 표지    cover        meta + hook + pills + 링크 둘(상세 페이지 · Steam) + hero
//   2 소개    columns 3    무슨 게임 / 내 작업 / 팀원 작업 — 색으로 경계가 갈린다
//   3 밸런싱  diagram      MTGoldDecompViz 전폭 — **식이 먼저 보여야 하는 장**
//   4 밸런싱  diagram      heatmap 전폭 + 요점 셋 (★ 이 절이 핵심 판단)
//   5 런타임  step+viz     MTGeoArchViz + 요점 셋
//
// ── 앞 두 장의 양식 (CM 덱이 먼저 쓴 것 — 여기서 뒤집지 않는다) ─────────────
//   1장 cover  = 프로젝트 **이름**(주장 아님) · subtitle(스펙 줄) · hook 한 줄 ·
//                pills(목차 태그로도 쓰인다) · links(상세 페이지 hero + 스토어) · hero 이미지
//   2장 소개   = "무슨 게임이고 어디까지가 내 것인가". 30초에 **역할 경계**가 잡혀야 한다.
//   → 표지 큰 글자를 주장으로 쓰면 스캔 점수는 오르지만(실측 A 4→6) 제출 문서로서
//     첫 장이 이름을 안 말하게 된다. 문서 규약이 이긴다.
//
// ── 페이지에는 있는데 덱에 안 넣은 것과 이유 ────────────────────────────────
//   **§05 재지 않은 것(cost) 통째로** — 사용자 판단. 제출용 덱은 결과만 싣는다.
//     빼도 사실 규칙에 안 걸린다 — 이 덱은 애초에 성능·정도 주장을 하나도 하지 않는다.
//   **코드 블록 둘(BalanceSimCore · GeoWorldRegistry)** — 3·5 장이 그림 장이 되면서
//     자리가 없다. ⚠️ `step` 은 오른쪽에 **그림 또는 코드 하나만** 그린다(viz > mermaid > code).
//     한 장에 둘 다는 공유 렌더러가 지원하지 않아 그림을 골랐다 — 구조를 보이는 쪽이
//     30초 문서에서 값이 크고, 코드는 표지의 상세 페이지 링크가 받는다.
//     실코드의 흔적은 요점 안 인라인(`Geo2D.CircleOverlap` 등)으로 남긴다.
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
//   · sl-h 는 renderInline 을 안 거친다 — **제목에 백틱·별표를 쓰지 않는다.**

(function buildMoteletDeck() {
  const M = window.MOTELET_DATA;

  // 앞 n문장만. 롱스크롤 본문이 슬라이드에서는 길다.
  // ⚠️ 분리자를 '. ' 로 두면 **문장 끝이 마크업으로 닫힌 곳에서 조용히 실패한다** —
  //    '상대 순위다.**' 는 마침표 뒤가 공백이 아니라 별표라 안 걸리고, 자르려던 두 문장이
  //    통째로 남는다(실측: 캡션 122자, 같은 문구가 두 번). 마침표 뒤 별표까지 경계로 본다.
  //    소수점·범위 표기는 뒤에 공백이 없어 여전히 안 잘린다 — 원래 의도 그대로다.
  const S = (t, n) => String(t).split(/(?<=\.\**)\s+/).slice(0, n).join(' ');

  const own = (dir) => M.scope.ownership.rows.find((r) => r[0] === '`' + dir + '`');
  const commits = (dir) => own(dir)[2].replace(/\*/g, '');

  // 사이트 주소는 data.js 에 없다(자기 주소를 자기가 안 갖는다) — outro.js · CM 덱과 같은 값.
  const SITE = 'https://olivegreenkr.github.io/Portfolio/';
  // ⚠️ 스토어 주소는 **사용자가 준 값**이다(2026-08-16). data.js 의 meta 에는 아직 없다 —
  //    페이지를 가진 세션이 `meta.steam` 으로 옮기면 그때 여기서도 M 을 참조하게 바꾼다.
  const STEAM = 'https://store.steampowered.com/app/4850970/Motelet/';

  window.DECK_PARTS = window.DECK_PARTS || {};
  window.DECK_PARTS.motelet = {
    proj: 'Motelet',
    slides: [
      // ─── 1. 표지 ───────────────────────────────────────────────────────────
      // 제출 문서의 첫 장이다 — 큰 글자는 **이름**을 말한다. 주장은 hook 이 진다.
      {
        layout: 'cover',
        section: '메인',
        subtitle: M.meta.subtitle,
        title: M.meta.title,
        // hook 셋째 문장(그래서 계산으로 바꿨다)까지 다 쓴다 — 여기가 이 절의 주장 자리다.
        hook: M.hook,
        // ⚠️ 공유 Cover 렌더러가 pills 를 무조건 map 한다 — 없으면 덱 전체가 깨진다.
        // 색이 경계다: sage = 내 작업 / wheat = 팀원 작업. 커밋 수는 그 근거로 붙인다.
        // 순서는 비중대로 — 밸런싱이 본체다.
        pills: [
          { text: 'PM 겸 배틀씬', kind: 'accent' },
          { text: '밸런싱 모델 · 에디터 — 커밋 ' + commits('CursorBladeExt'), tone: 'sage' },
          { text: '배틀 런타임 — 커밋 ' + commits('CursorBlade'), tone: 'sage' },
          { text: '공용 엔진 모듈 — 커밋 ' + commits('_Engine'), tone: 'sage' },
          { text: '스킬 데이터 · DB · 런타임 적용 프레임워크 — 팀원', tone: 'wheat' },
        ],
        // 표지에서 바로 닿을 곳 둘. 코드 블록을 뺀 장들의 상세가 저기 있다.
        links: [
          { label: '상세 페이지', v: '전체 서술 · 코드 · 다이어그램',
            href: SITE + 'pages/motelet.html', tone: 'sage', hero: true },
          { label: 'Steam', v: M.meta.title + ' (개발 중)', href: STEAM, tone: 'blue' },
        ],
        hero: { img: M.hero.img, caption: M.hero.caption },
      },

      // ─── 2. 프로젝트 소개 ───────────────────────────────────────────────────
      // 30초에 잡혀야 할 것은 "무슨 게임이고 어디까지가 내 것인가" 하나다.
      // 표가 아니라 카드 셋으로 놓는 이유 — 커밋 다섯 행을 한 장에 펴면 숫자만 남고
      // 경계가 안 보인다. 카드 **색**(sage/wheat)이 경계를 먼저 말하고 숫자는 그 안에 든다.
      {
        layout: 'columns',
        section: '소개',
        title: '프로젝트 소개 — 무슨 게임이고 어디까지가 내 것인가',
        gist: M.what,
        colCount: 3,
        cols: [
          {
            kind: 'GAME', tone: 'blue',
            title: '한 판이 끝나면 다음 판을 산다',
            sub: S(M.hook, 1),
            items: [
              '스태미나가 떨어지면 그 판이 끝난다',
              '번 골드로 스킬을 사서 다음 판을 시작한다',
              '그래서 **밸런싱의 단위가 「한 판」** 이 된다',
            ],
          },
          {
            kind: 'MINE', mark: '✓', tone: 'sage',
            title: '내 작업',
            sub: S(M.scope.gist, 1),
            pairs: M.scope.ownership.rows.slice(0, 4)
              .map((r) => [r[1], r[0] + ' · 커밋 ' + r[2].replace(/\*/g, '')]),
          },
          {
            kind: 'TEAM', tone: 'wheat',
            title: '팀원 작업',
            // 경계의 셋을 다 적는다. 앞 둘만 적으면 5장이 통째로 런타임인 이 덱에서
            // '런타임 적용 프레임워크' 까지 내 것으로 읽힌다.
            sub: M.scope.gist.split('. ')[1],
            pairs: [
              [M.scope.ownership.rows[4][1].replace(' — *팀원 영역*', ''),
                M.scope.ownership.rows[4][0] + ' · 팀원 ' + M.scope.ownership.rows[4][3]
                + ' · 본인 ' + M.scope.ownership.rows[4][2]],
              ['코드 규모', M.scope.scale.rows.slice(0, 2)
                .map((r) => r[0] + ' ' + r[1]).join(' · ') + ' 개 `*.cs`'],
            ],
          },
        ],
        note: M.scope.ownership.title + '. ' + M.scope.note,
      },

      // ─── 3. 수학적 모델링을 통한 밸런싱 ─────────────────────────────────────
      // **식이 가장 먼저 보여야 하는 장**이라 diagram 을 쓴다 — step 의 좌우 2단은
      // 그림에 절반 폭밖에 안 주고, 이 트리는 viewBox 760×268 이라 폭이 곧 글자 크기다.
      // 대가로 BalanceSimCore 코드 블록이 빠진다(한 장에 그림+코드 불가).
      {
        layout: 'diagram',
        section: '01 밸런싱',
        no: 'a',
        title: '수학적 모델링을 통한 밸런싱',
        lead: M.model.gist,
        step: { viz: 'gold' },
        vizComponent: 'MTGoldDecompViz',
        points: [
          ['왜 식으로 바꿨나', S(M.model.problem, 1) + ' 두 값을 정의하면 **노드 전부를 같은 자로** 잰다'],
          // 이 모델의 성격은 무엇을 **버리느냐**로 결정된다. min 둘이 그 자리다.
          ['치사율의 `min`', M.model.formula.lines[0][1].split('   ←')[0]
            + ' — 한 방 초과분을 버린다. ' + M.model.minTable.rows[0][2]],
          ['처치율의 `min`', M.model.minTable.rows[1][1] + '을 버린다 — ' + M.model.minTable.rows[1][2]],
        ],
        note: M.model.code.title.split(' — ')[0] + ' 는 작은 쪽을 취하는 데서 끝내지 않고 '
          + '어느 쪽이 병목이었는지를 센다 — ' + M.model.code.result,
      },

      // ─── 4. 상대 순위 ★ ─────────────────────────────────────────────────────
      // 이 프로젝트의 핵심 판단. 모델이 게임을 재현하지 않는다는 것을 인정한 위에서
      // **무엇을 읽을지**를 바꿨다. 근거는 화면 하나에 다 있다.
      {
        layout: 'diagram',
        section: '01 밸런싱',
        no: 'b',
        title: '읽은 것은 값이 아니라 노드 간 상대 순위',
        // 둘째 문장(절대 골드를 안 믿고 상대 순위만 읽었다)은 **제목이 그대로 하는 말**이라 자른다.
        lead: S(M.sim.gist, 1),
        // 캡션은 **그림을 읽는 열쇠**만. 원본 캡션 가운데(어느 config 가 소스인지)는
        // 요점 둘째 칸이 이미 말한다 — 두 번 쓰면 그만큼 그림이 작아진다.
        step: {
          img: {
            src: M.sim.shot.img,
            caption: '**노드 테두리 색이 그 판의 상대 순위다.** 왼쪽 아래가 구간 분석.',
          },
        },
        points: [
          // ⚠️ 역방향 오귀속 방지 — 이 창은 팀원 에디터의 확장이 아니라 새로 만든 독립 창이다.
          //    "따로 만들었다" 는 **라벨**이 진다 — 본문에 또 쓰면 같은 문장이 두 번 나온다.
          ['에디터를 따로 만들었다', '팀원의 스킬 자산을 읽어 온다. ' + M.sim.host.chips.join(' · ') + '가 한 창에'],
          // 네 행을 다 펴면 이 칸이 그림에서 세로를 뺏는다. 각 열 앞 둘만.
          ['소스와 가정을 갈랐다', M.sim.split.rows.slice(0, 2).map((r) => r[0]).join(' · ')
            + ' 는 게임에서 읽고, ' + M.sim.split.rows.slice(0, 2).map((r) => r[1]).join(' · ')
            + ' 는 내가 정했다. 어긋나면 **식이 아니라 노브를 당긴다**'],
          ['비교 기준은 진행형 빌드', S(M.sim.points[2][1], 1)
            + ' 그 노드의 **선행 경로만 켠 상태**를 기준으로 잡았다'],
        ],
        note: '화면은 2026-06 편집 상태라 수치는 읽지 않는다. 체감은 플레이로 판단했고, 시뮬은 검산이다.',
      },

      // ─── 5. 기하 시스템 ─────────────────────────────────────────────────────
      // 비중 1장. 제목은 "왜 안 썼나" 가 아니라 **무엇으로 대신했나** 를 말한다 —
      // 게임의 요구가 정밀 충돌이 아니었고, 그 요구에 맞는 크기의 것을 넣었다는 게 요점이다.
      // 그림이 네 겹(호출자 → 질의 4종 → 모양 디스패치 → 커널 7)을 그대로 보이므로
      // 코드 블록 대신 그림을 세우고, 실코드는 요점 안 인라인으로 남긴다.
      {
        layout: 'step',
        section: '02 런타임',
        title: '물리 엔진 대신 가벼운 기하 시스템을 직접',
        // ⚠️ runtime.gist 둘째 문장('감당 가능한 비용으로')은 **계측 없는 정도 주장**이다.
        //    이 프로젝트는 빌드에서 프레임을 잰 적이 없다 — 크롭한다.
        gist: S(M.runtime.gist, 1) + ' '
          + M.runtime.vizCaption.split('전부 — ')[1].split('. ')[0] + '.',
        step: { viz: 'geo', points: [] },
        vizComponent: 'MTGeoArchViz',
        vizProps: { caption: S(M.runtime.vizCaption, 1) },
        points: [
          // 결론(요구가 프레임 결정성이었다)이 이 장의 이유다. 제목은 '무엇으로 대신했나' 라
          // 여기서 '왜' 를 받는다 — 제목과 겹치지 않는다.
          ['게임의 요구가 정밀 충돌이 아니었다', '고정 스텝은 한 프레임당 판정이 '
            + M.runtime.why.rows[1][1].replace(' (프레임률에 따라)', '') + ', 자체 기하는 **'
            + M.runtime.why.rows[1][2].replace(/\*/g, '') + '**. 요구는 **'
            + M.runtime.why.rows[2][2].replace(/\*/g, '').replace(' — 요구', '') + '**이었다. '
            + M.runtime.whyNote],
          // 외부는 월드에 질의로만 묻고, 바디 모양 × 질의 모양으로 커널이 갈린다.
          // 실코드 블록 자리가 없으므로 실제 타입·함수 이름을 인라인으로 남긴다.
          ['외부는 질의로만 묻는다', '`GeoWorldRegistry` 가 등록된 `BodyShape` 를 훑고, '
            + '바디가 원이냐 캡슐이냐로 `Geo2D.CircleOverlap` · `Geo2D.CircleVsCapsule` 로 갈린다. '
            + M.runtime.code.result],
          ['스폰 상한은 개수가 아니라 면적', M.runtime.cap.lines[0][1]
            + ' — ' + M.runtime.cap.lines.slice(1)
              .map((l) => l[0] + ' ' + l[1].replace('그대로 ', '').replace('선형으로 확률 감소', '선형 감소')).join(' / ')
            + '. ' + S(M.runtime.cap.result, 1)],
        ],
        note: M.runtime.queries.rows[0][0].replace('적이 가장 ', '') + ' — '
          + M.runtime.queries.rows[0][1].replace(', 이웃 칸만 셈', '에서 이웃 칸만 셈')
          + ', ' + M.runtime.queries.rows[0][2].replace('후보 집합', '후보') + '. '
          + M.runtime.queries.rows[1][0] + ' — ' + M.runtime.queries.rows[1][2],
      },
    ],
  };
})();
