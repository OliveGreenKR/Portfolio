// pages/motelet/data.js
// Motelet (개발 코드명 CursorBlade) — 개발 중. 본인 = PM 겸 배틀씬 프로그래머.
//
// 상류 SSOT = knowledge_base/projects/cursorblade/research/portfolio/{claims.yaml,brief.md,gate.json}
// 실측 기준선 = D:/UnityProjects/CursorBlade · feat/stage03 @ 3571bfb3 (마지막 커밋 2026-08-15)
//
// ■ CORE — 주관이던 "성장 체감"을 계산 가능한 정의로 바꾸고,
//   그 계산이 보증하지 못하는 범위를 먼저 그어 읽는 대상을 상대 순위로 좁혔다.
// ■ 비중 8:2 — 02·03(밸런싱) = 8, 04(런타임) = 2.
//
// ■ 수치 규칙
//   ✅ 커널 7 · 질의 4종 · 점유율 1.5/2.5 · 개수 캡 10 · 커밋/파일 수(기준 커밋 명시)
//   ❌ 전역 커밋 비율 · 기간 숫자 · 탐색 runs/iterations/λ · reachCap · w_spawn · 프리셋 수치
//      · 프로파일러 수치 전량 · 캡처 안의 eGold·구간 분석 수치
//   ⚠️ 모델의 동시존재 상한과 런타임 스폰 캡을 나란히 쓰지 않는다 (같은 개념, 다른 값)
//
// ■ 문장 규칙
//   1. 정도 주장 금지(E0~E1). "성능 향상 / 끊김 없음 / 빠른 공간분할" ❌
//   2. 한계는 05 에만 모은다. 앞 절에서 미리 무너뜨리지 않는다.
//   3. "플레이 없이 밸런싱했다" ❌ — 시뮬은 참고용 검산.
//   4. 그림은 측정이 아니라 정의·경계·순서·구조를 인코딩한다. 없는 데이터를 그리지 않는다.
//
// ■ 덱 호환 — pages/deck/motelet.js 가 이 파일의 깊은 필드를 문자열 분해로 읽는다.
//   ownership / scale / minTable / why / queries / cap / vizCaption 의 형태는 덱 재작성 전까지 유지한다.
//
// renderInline: **굵게** / `코드` / *기울임* 만. 중첩 ❌.
// AsciiBlock 의 intro·result 는 renderInline 미경유 — 백틱 ❌.

/* 커밋 귀속 단일 소스 — [디렉터리, 무엇, 본인, 팀원(LBC), 공용 AI 계정, 그 밖]
   git log --all --no-merges --format=%an -- <dir> | sort | uniq -c  @ 3571bfb3
   본인 = Chul + OliveGreen 두 계정 합산. 공용 AI 계정(Claude)은 누구에게도 귀속하지 않는다. */
const MT_COMMITS = [
  ['CursorBlade', '배틀 런타임', 288, 1, 2, 5],
  ['CursorBladeExt', '밸런싱 에디터 · 도구', 104, 0, 4, 1],
  ['_Engine', '공용 엔진 모듈', 68, 0, 0, 0],
  ['JCH', 'VFX · 플랫폼', 38, 0, 0, 0],
  ['LBC_Scripts', '스킬트리 — 팀원 영역', 33, 54, 205, 2],
];

/* 코드 규모 단일 소스 — find <dir> -name "*.cs" | wc -l @ 3571bfb3 */
const MT_SCALE = [
  ['배틀 런타임', 195],
  ['스킬트리 (팀원 영역)', 127],
  ['재사용 엔진 모듈', 72],
  ['밸런싱 에디터 · 도구', 58],
  ['그 밖 (VFX · 아트 · 부팅 · 로컬)', 78],
];

window.MOTELET_DATA = {
  meta: {
    eyebrow: 'PROJECT / MOTELET',
    subtitle: '인크레멘탈 · Unity 6.0 · 팀 3인 · 개발 진행 중',
    title: 'Motelet',
    facts: ['Unity 6.0 · C# 10', '팀 3인 · PM 겸 배틀씬', '2026-05 ~ 진행 중', '실측 기준 커밋 3571bfb3'],
    // 기간 · 스택 · 스토어는 덱(표제지 이력 · 목차 · 표지 링크)이 읽는 필드다.
    // facts 문자열을 덱이 쪼개 읽던 것을 필드로 올렸다 — 표기가 갈릴 자리를 없앤다.
    period: '2026.05 ~ 진행 중',
    team: '팀 3인',
    stack: ['Unity 6.0', 'C# 10', 'UniTask', 'DOTween'],
    // 스토어 페이지 공개 (2026-08, 사용자 확인). 출시 전이라 '개발 중' 으로만 쓴다.
    steam: 'https://store.steampowered.com/app/4850970/Motelet/',
    boundary:
      '맡은 것은 **전투씬 전반과 그 기반 리소스 시스템**, 그리고 **밸런싱 모델과 전용 에디터**다. ' +
      '스킬트리 데이터 · DB는 팀원 작업이다.',
  },

  /* ── 01 게임 루프 ─────────────────────────────────────
     뒤의 밸런싱 절이 "판과 판 사이" 를 다루므로, 그 판이 무엇인지를 먼저 세운다. */
  cycle: {
    gist: '한 판은 스태미나가 떨어지면 끝난다. **성장은 판 안이 아니라 판과 판 사이에서 일어난다.**',
    title: '게임 한 판과 그다음 판',
    steps: ['전투', '골드', '업그레이드 구매', '다음 판'],
    subs: ['스태미나 소진까지', '처치한 적만큼', '스킬 노드 한 칸', '더 강한 적'],
    loopLabel: '반복',
    watch: '성장 = 판과 판 사이의 변화',
    caption:
      '골드는 이번 판의 성과이자 다음 판의 입력이다. 그래서 밸런싱이 답해야 할 질문은 ' +
      '"이 스킬이 재미있나" 가 아니라 **"이 노드 한 칸이 다음 판을 얼마나 세게 만드나"** 가 된다.',
    body:
      '적은 판이 올라갈수록 세지고, 스태미나는 계속 닳는다. ' +
      '그래서 한 판의 성과는 **얼마나 오래 버티며 얼마나 많이 처치했나**로 수렴한다.',
  },

  // hook 이 먼저다. 게임 설명은 그다음 한 줄.
  hook:
    '밸런싱 기준이 "성장이 잘 느껴지나" 였다. **주관이다.** ' +
    '그 체감을 **계산으로 바꿔** 판단으로 만들었다.',

  what:
    '커서로 로봇청소기를 몰아 먼지떼를 쓸어 담는다. ' +
    '**한 판은 스태미나가 떨어지면 끝나고**, 번 골드로 스킬을 사서 다음 판을 시작한다.',

  hero: {
    img: 'motelet/assets/gameplay.png',
    caption: '한 판의 전투. 여기서 번 골드가 다음 판의 스킬이 된다.',
  },

  built: [
    { kind: 'MAIN · §02', href: '#tool', title: '밸런싱 에디터',
      sub: '노드 편집 · 성장 곡선 · 노드별 상대 순위가 한 창에' },
    // 제목이 곧 배지다(덱 표지 pill · 목차 태그). "정의" 는 무엇을 했는지를 안 말한다 —
    // 읽는 쪽이 한 눈에 무엇이 걸린 항목인지 알게 방법(수학적 모델링)을 제목에 올린다.
    { kind: 'MODEL · §02-A', href: '#model', title: '성장 체감의 수학적 모델링',
      sub: '한 판의 기대 골드 · 노드 한 칸의 증가분 · 두 개의 `min`' },
    { kind: 'RUNTIME · §03', href: '#runtime', title: '물리 엔진 없이',
      sub: '주입 계약 · 필요한 것만 적재 · 단발 질의 · 배치 렌더' },
  ],

  /* ── 맡은 범위 ────────────────────────────────────────
     페이지에는 히어로의 한 줄(meta.boundary)로만 나온다.
     아래 표들은 덱이 읽는 사실이라 남긴다 — 페이지는 렌더하지 않는다. */
  scope: {
    gist:
      '**배틀 런타임 · 엔진 모듈 · 밸런싱 모델과 에디터**가 내 작업. ' +
      '**스킬트리 데이터 · DB**는 팀원 작업.',

    // ── 덱 호환 (페이지 미사용) ───────────────────────────
    ownership: {
      title: '디렉터리별 커밋 — 2026-05-13 ~ 08-15 · 전 브랜치 · 머지 제외',
      headers: ['디렉터리', '무엇', '본인', '팀원'],
      rows: MT_COMMITS.map(([dir, what, mine, mate]) => [
        '`' + dir + '`',
        dir === 'LBC_Scripts' ? '스킬트리 — *팀원 영역*' : what,
        dir === 'LBC_Scripts' ? String(mine) : '**' + mine + '**',
        String(mate),
      ]),
    },
    note: '팀 공용 AI 계정 커밋은 귀속 불가라 제외. `LBC_Scripts` 는 그 비중이 크다.',
    scale: {
      title: '코드 규모 — 같은 커밋에서 `*.cs` 실측',
      headers: ['영역', 'C# 파일'],
      rows: MT_SCALE.map(([label, files]) => [label, String(files)]),
    },
  },

  /* ── 02 성장 체감의 수학적 모델링 ─────────────────────────────── */
  model: {
    gist:
      '성장 = **한 판의 기대 골드**. 성장 체감 = **노드 한 칸의 증가분**.',
    problem:
      '수치를 하나 바꿀 때마다 플레이해서 확인했다. 두 값을 정의하면 노드 전부를 같은 자로 잰다.',

    decomp: {
      title: '한 판의 골드를 무엇으로 쪼갰나',
      caption:
        '스킬이 무엇을 올리든 **이 잎 중 하나를 움직인다.** 그래서 노드 하나의 값을 같은 단위로 잰다. ' +
        '잎까지 내려가면 남는 연산은 곱셈과 `min` 둘뿐이다.',
      nodes: {
        root: '한 판의 골드',
        kills: '처치 수',
        goldPerKill: ['처치당 골드', '적 분포의 기대값'],
        killRate: '처치율',
        survived: ['버틴 시간', '스태미나 ÷ 소모'],
        atk: '공격력 항',
        spawn: '스폰 항',
      },
    },

    // 트리가 안 그리는 잎 두 줄. 덱이 lines[0][1] 을 '   ←' 로 자른다.
    formula: {
      title: '트리의 잎 — 그림이 안 그리는 두 줄',
      intro: null,
      lines: [
        ['치사율', 'min( 1 , 데미지 / 적 HP )   ← 한 방 초과분은 버린다'],
        ['공격력 항', 'Σ(공격원) 발동빈도 × 동시타격 수 × 치사율'],
      ],
      result: '공격원은 평타 · 대시 · 능력 셋.',
    },

    // 두 min 도해가 이 표를 그림으로 옮긴 것이다. 표는 덱 호환용으로 남긴다.
    minTable: {
      title: '`min` 두 개가 이 식의 전부다',
      headers: ['어디', '무엇을 버리나', '그래서'],
      rows: [
        ['치사율의 `min`', '한 방에 죽는 적에 쏟은 **초과 공격력**', '과잉 화력이 골드로 안 환산된다'],
        ['처치율의 `min`', '스폰이 병목인 구간의 **공격력 증가분**', '**DPS 를 기준 지표로 안 쓴 이유**'],
      ],
    },

    mins: {
      title: '`min` 두 개가 이 식의 전부다',
      clamp: {
        tag: 'A · 치사율의 min',
        head: '한 방을 넘는 데미지는 골드로 안 바뀐다',
        xLabel: '데미지 ÷ 적 HP',
        yLabel: '치사율',
        mark: '1',
        cut: '버려지는 초과 공격력',
        foot: '과잉 화력이 골드로 안 환산된다.',
      },
      gate: {
        tag: 'B · 처치율의 min',
        head: '공격력을 올려도 스폰이 병목이면 출력이 안 움직인다',
        aLabel: '공격력 항',
        bLabel: '스폰 항',
        outLabel: '처치율 = 작은 쪽',
        foot: '**DPS 를 기준 지표로 안 쓴 이유다.**',
      },
      caption:
        '두 `min` 이 이 모델의 성격을 정한다 — 하나는 **한 방 초과분**을, 다른 하나는 **스폰 병목 구간의 공격력 증가분**을 버린다. ' +
        '모델은 버린 자리를 세어서 보고한다.',
    },

    code: {
      title: 'BalanceSimCore.cs — 병목을 세어 보고한다',
      intro: '작은 쪽을 취하는 데서 끝내지 않고 어느 쪽이 병목이었는지를 남긴다.',
      code:
        'float dpsTerm = KillRate(sources, hLv);\n' +
        'float spawnTerm = inp.spawnSupplyWeight / spawnInt;\n' +
        'float kr = Mathf.Min(dpsTerm, spawnTerm);\n' +
        'if (kr <= 0f) break;\n' +
        'if (spawnTerm < dpsTerm) spawnCount++; else dpsCount++;',
      result: '"20레벨 중 12레벨이 스폰 병목" 같은 진단이 그대로 나온다.',
    },
  },

  /* ── 03 시뮬레이터를 쓴 방식 ─────────────────────────── */
  sim: {
    // §02 도구 절의 요지 — 캡처를 먼저 놓고 그다음 상세로 내려간다.
    toolGist:
      '그 질문에 답하려고 **팀원의 스킬 자산을 읽는 밸런싱 에디터**를 따로 만들었다. ' +
      '노드를 고치면 같은 창에서 성장 곡선과 노드별 상대 순위가 즉시 다시 계산된다.',

    gist:
      '이 모델은 게임을 그대로 재현하지 않는다. 그래서 **절대 골드를 안 믿고 ' +
      '노드끼리의 상대 순위만** 읽었다.',

    boundary: {
      title: '어디까지가 게임 값이고 어디부터 내 가정인가',
      sourceHead: '게임 자산에서 읽는다',
      assumeHead: '내가 정한 가정값',
      simLabel: '기대 골드 모델',
      outputs: [
        { label: '절대 기대 골드', note: '가정값에 통째로 딸려 있다', taken: false },
        { label: '노드 간 순위 · 기울기', note: '가정을 흔들어도 잘 안 뒤집힌다', taken: true },
      ],
      caption:
        '두 입력을 **자산 단위로 갈라 놨다.** 오른쪽 열은 밸런스 시뮬 전용 자산 하나에 모여 있고, ' +
        '필드 주석이 스스로 **"가정값"**, **"과소평가 보정"** 이라고 적혀 있다. ' +
        '실제와 어긋나면 식이 아니라 이 노브를 당긴다.',
    },

    split: {
      title: '섞이면 어디까지가 게임이고 어디부터가 가정인지 알 수 없어진다',
      headers: ['소스에서 읽는 값', '내가 정한 가정값'],
      rows: [
        ['적 HP · 처치 골드 · 스폰 가중치', '평균 대시 거리'],
        ['플레이어 · 배틀 · 능력 base 스탯', '화면 동시존재 적 수'],
        ['노드 수치 · 비용 · 선행', '범위 → 동시타격 환산 지수'],
        ['아이템 스폰 가중치', '공격원별 중요도 · 스폰 공급 배율'],
      ],
    },
    splitNote:
      '오른쪽 열은 전부 `BalanceSimConfigSO` 한 자산에 있다. ' +
      '필드 주석이 스스로 **"가정값"**, **"과소평가 보정"** 이라고 적혀 있다. ' +
      '실제와 어긋나면 **식이 아니라 이 노브를 당긴다.**',

    points: [
      ['절대값은 가정에 딸려 있다',
        '기대 골드의 절대량은 위 오른쪽 열에 통째로 의존한다. ' +
        '반대로 **같은 가정 아래 노드 간 순위**는 가정을 흔들어도 잘 안 뒤집힌다.'],
      ['그래서 읽는 대상을 바꿨다',
        '값이 아니라 **순위와 기울기**. "이 노드가 저 노드보다 몇 배 세다" 가 판단 단위다.'],
      ['비교 기준은 완전체가 아니라 진행형',
        '모든 노드를 켠 빌드는 데미지 과포화로 **거의 모든 값이 0 에 수렴**한다. ' +
        '그 노드의 **선행 경로만 켠 상태**를 기준으로 잡았다.'],
    ],

    code: {
      title: 'BalanceSimCore · HeatmapCalculator — 값이 아니라 순위',
      intro: '선행만 충족한 상태에서 그 노드만 한 칸 올린 차이를 비용으로 나누고, 그 값을 이번 실행 안에서 정규화한다.',
      code:
        '// BalanceSimCore.ComputeNodeValues\n' +
        'double g0 = Eval(inp, b0).eGold;\n' +
        'double d = Eval(inp, b1).eGold - g0;\n' +
        'double cost = node.baseCost\n' +
        '    * System.Math.Pow(node.costMult, lf);\n' +
        '\n' +
        '// HeatmapCalculator — 값이 아니라 이번 실행 안의 상대 순위\n' +
        'float norm = (float)(System.Math.Log(1d\n' +
        '    + System.Math.Max(0d, v)) / logMax);',
      result: '색은 절대량이 아니라 이번 판의 상대 순위. 다른 프리셋과 색을 비교하면 안 된다.',
    },

    // 곡선은 §01 의 게임 루프를 그대로 돌려서 나온다 — 그림을 다시 그리지 않는다.
    policy: {
      title: '곡선은 §01 의 루프를 그대로 돌려서 나온다',
      body:
        '다른 점은 **구매를 사람이 아니라 정책이 한다**는 것뿐이다. 정책은 ' +
        '**투자 대비 증가분 최대** 또는 **최저가** 둘 — 플레이 재현이 아니라 곡선의 위아래 감각이다. ' +
        '구매 한 칸마다 직전·직후 차이를 기록해서, 실제로 본 것은 **증가분이 갑자기 뛰는 판**과 ' +
        '그 판에서 무엇을 샀는지다. 초기 과성장을 그걸로 잡았다.',
    },

    host: {
      title: '이 여섯이 창 하나 안에 있다',
      chips: ['노드 편집', '히트맵', '성장 곡선', '구간 분석', '모델 노브', '되쓰기'],
      body:
        '따로 만든 이유는 **왕복 때문**이다. 편집 창과 검산 창이 갈라져 있으면 수치 하나 고칠 때마다 창을 오간다. ' +
        '대신 저작 사고를 막을 장치를 안에 뒀다 — 편집은 버퍼에서만 일어나고, 팀 자산에 쓰는 것은 명시적 버튼뿐이다.',
    },

    shot: {
      img: 'motelet/assets/heatmap.png',
      alt: '스킬트리 노드 에디터 — 가운데 방사형 그래프, 왼쪽 성장 곡선과 구간 분석, 오른쪽 시뮬 소스 패널',
      caption:
        '번호가 이 창의 여섯 기능과 **소스/가정 경계**가 실제로 놓인 자리다. 아래 두 절이 ⑤ 와 ③ 을 각각 펼친 것이다.',
      note:
        '2026-06 편집 상태. **화면의 수치는 읽지 않는다** — 그때 프리셋 기준이고 지금 값이 아니다.',
      callouts: [
        { n: 1, x: 48, y: 52, label: '노드 편집', body: '방사형 그래프에서 노드와 선행 간선을 직접 잡는다' },
        { n: 2, x: 37.5, y: 21, label: '히트맵', body: '노드 테두리 색 = 그 실행 안의 상대 순위' },
        { n: 3, x: 10, y: 74, label: '성장 곡선', body: '판별 기대 골드 증가율' },
        { n: 4, x: 10, y: 92, label: '구간 분석', body: '어느 판에서 무엇을 사서 얼마나 뛰었는지' },
        { n: 5, x: 89, y: 19, label: '소스 / 가정 경계', body: '위는 게임 자산, 표시된 한 줄만 내 가정 자산' },
        { n: 6, x: 91, y: 66, label: '모델 노브', body: '읽어 들인 base 스탯과 시뮬 입력' },
        { n: 7, x: 13.5, y: 3.5, label: '되쓰기', body: '편집은 버퍼, 자산 기록은 이 버튼에서만' },
      ],
    },
  },

  /* ── 04 물리 엔진 없이 ───────────────────────────────── */
  runtime: {
    gist:
      '인크레멘탈은 같은 화면에 적·효과·UI 가 계속 뜨고 진다. ' +
      '**그 반복을 감당하는 쪽으로 전투씬 구조를 짰다** — 주입 계약 · 필요한 것만 적재 · 단발 질의 · 메시 하나.',

    /* 03-A 주입형 부팅 파이프라인 */
    pipeline: {
      title: '전투씬은 계약 하나로만 열린다',
      outside: { tag: '외부', items: ['메타 진행 · 스킬 결과를 아는 Provider', '씬 단독 실행용 Mock Provider'] },
      entry: { tag: '진입점', title: 'SubmitInitData', sub: 'BattleInitData 1회 주입' },
      boot: { tag: '부팅 지휘', title: 'SceneBootstrapper', sub: '주입값 setter push' },
      phases: [
        ['Core', '외부 의존 없는 데이터 · I/O'],
        ['Infrastructure', 'Core 완료 후 미들웨어'],
        ['Gameplay', '앞 단계를 참조하는 인게임 객체'],
      ],
      phaseNote: '페이즈마다 인터페이스 구현을 씬에서 모아 한꺼번에 기다린다',
      state: { tag: '상태', title: 'Playing 전이' },
      caption:
        '**전투씬은 메타도 스킬트리도 모른다.** 아는 것은 주입 계약 하나뿐이고, ' +
        '외부가 넘기는 값은 **절대값만**이다 — 배율·Rate 를 주입에서 없앴다. ' +
        '그래서 같은 씬을 Mock Provider 로 단독 실행할 수 있고, 밸런싱 도구가 만든 값도 같은 통로로 들어온다.',
      rules: [
        ['주입은 절대값만', '배율·Rate 를 주면 같은 수치가 두 곳에서 곱해진다'],
        ['테마가 전투 사이클의 단일 데이터', '몬스터 · 레벨 · 보스를 한 자산이 소유한다'],
        ['부팅 완료 전까지 Playing 아님', '누락되면 조용히 멈추지 않고 진입점이 오류를 남긴다'],
      ],
    },

    /* 03-B 적재 정책 */
    residency: {
      title: '필요한 묶음만, 필요한 동안만',
      lanes: [
        { tag: 'Always', note: '가동 시 동기 상주', steps: ['취득', '즉시 프리워밍', '상주'] },
        { tag: 'Preloadable', note: '취득 시점 비동기 로드', steps: ['취득', '비동기 로드', '프레임 분산 프리워밍', '사용'] },
      ],
      release: ['반납', '유예 대기', '참조 0 유지 → 언로드'],
      caption:
        '풀은 프리팹 하나가 아니라 **묶음(라이브러리) 단위로 참조수를 센다.** ' +
        '테마·해금에 걸린 묶음만 취득하므로 **다른 테마의 풀은 아예 만들어지지 않는다.** ' +
        '프리워밍은 꺼진 채로, 프레임에 나눠서 한다 — 워밍이 화면이나 이벤트에 노출되지 않는다.',
      invariants: [
        ['전투 중 생성 0', '핫패스에서 새 인스턴스를 만들지 않는다'],
        ['중복 로드 0', '같은 자산의 동시 요청은 한 로드에 합류한다'],
        ['미사용 구간 비상주', '반납 뒤 유예가 지나면 내려간다'],
      ],
      note: '**측정치가 아니라 구조가 보장하는 불변식**이다. 프레임·메모리 수치는 이 페이지에 없다.',
    },

    /* 03-C 기하 월드 아키텍처 */
    geo: {
      title: '바디는 스스로 등록하고, 밖에서는 질의만 들어온다',
      worldTitle: 'Geo World',
      worldSub: '활성 바디 집합 · 질의 4종이 전부인 진입점',
      bodyHead: '바디 쪽 — 스스로 들어오고 나간다',
      bodies: ['적 · 보스', '아이템', '분신', '장판 · 위험 지대'],
      bodyEdge: '활성/비활성에 맞춰 자기 등록 · 해제',
      callerHead: '호출자 쪽 — 아는 것은 질의뿐',
      callers: ['블레이드 (매 프레임)', '대시 스윕 (1회)', '장판 · 밀대', '스폰 · 배치'],
      callerEdge: '모양 + 대상 필터로 한 번 물어본다',
      caption:
        '호출자는 **누가 월드에 있는지 모른다.** 바디도 **누가 자기를 찾는지 모른다.** ' +
        '둘을 잇는 것은 월드 하나이고, 그래서 풀에서 꺼내 쓰고 되돌려도 등록 상태가 저절로 맞는다 — ' +
        '비활성이면 질의에서 빠지고, 재활성이면 다시 들어온다.',
      note:
        '분류를 저작하지 않은 바디는 **어떤 질의에도 안 잡힌다.** 우회로를 일부러 두지 않아서, ' +
        '빠뜨리면 "적이 안 맞는다"로 즉시 드러난다.',
    },

    /* 03-C 등록·질의 계약 코드 — 위 geo 도식이 말하는 구조의 실코드.
       출처(기준 커밋 3571bfb3, Assets/Scripts/CursorBlade/Runtime/Geo/):
         IGeoBody.cs:13  ·  GeoBodyMB.cs:93-94  ·  GeoWorldRegistry.cs:50-51
       원문의 XML doc 주석은 한 줄 인라인으로 줄여 인용했고, OverlapCircle 은 인자 줄바꿈만
       옮기고 null 가드 두 줄(`if (output == null) return;` · `if (b == null) continue;`)을
       생략했다. 그 밖의 시그니처·본문은 원문 그대로다.
       현재 페이지는 안 쓰고 덱(pages/deck/motelet.js)이 쓴다. */
    contract: {
      title: 'IGeoBody · GeoBodyMB · GeoWorldRegistry — 등록과 질의를 잇는 계약',
      intro: '월드에 들어오는 조건은 이 인터페이스를 구현하는 것 하나다.',
      code:
        '// IGeoBody.cs — 월드에 등록되는 바디 계약\n' +
        'public interface IGeoBody\n' +
        '{\n' +
        '    BodyShape GetHitShape();          // 원 / 캡슐 태그드\n' +
        '    GeoCategory Category { get; }     // 질의가 거르는 분류\n' +
        '    IDamageable? Damageable { get; }  // 없으면 데미지 소비자 skip\n' +
        '    CharacterMotor2D? Motor { get; }  // 없으면 외력장 소비자 skip\n' +
        '    GameObject GameObject { get; }\n' +
        '}\n' +
        '\n' +
        '// GeoBodyMB.cs — 등록은 수명이 한다\n' +
        'private void OnEnable()  => TryRegister();\n' +
        'private void OnDisable() => TryUnregister();\n' +
        '\n' +
        '// GeoWorldRegistry.cs — 밖에서 들어오는 것은 질의뿐\n' +
        'public void OverlapCircle(Vector2 center, float radius, List<IGeoBody> output,\n' +
        '                          int layerMask = ~0, GeoCategory required = GeoCategory.All)\n' +
        '{\n' +
        '    output.Clear();\n' +
        '    foreach (var b in _all)\n' +
        '    {\n' +
        '        if (!Passes(b, layerMask, required)) continue;\n' +
        '        if (HitsCircle(b.GetHitShape(), center, radius)) output.Add(b);\n' +
        '    }\n' +
        '}',
      result:
        '호출자가 아는 타입은 `IGeoBody` 하나뿐이다 — 적인지 아이템인지 분신인지는 모른다.',
    },

    /* 03-C 왜 자체 기하인가 */
    why2: {
      title: '왜 물리 엔진을 안 썼나',
      lead: '성능 때문이 아니다. **정답의 조건이 달랐다.**',
      cols: [
        { head: 'Unity 2D Physics', tone: 'drop' },
        { head: '자체 기하 월드', tone: 'take' },
      ],
      rows: [
        ['판정이 도는 시계', '물리 고정 스텝', '게임과 같은 프레임'],
        ['한 프레임당 판정', '0~2회', '1회'],
        ['필요했던 것', '정밀 충돌 · 연속 충돌 · 물리 반응', '이 프레임에 이 모양 안에 누가 있나'],
      ],
      decisive: 2,
      foot:
        '두 시계가 다르면 **그 순서를 맞추는 일이 게임 로직에 계속 샌다.** ' +
        '반대로 이 게임이 물리에서 필요로 한 것은 단발 질의 하나뿐이었다 — 그래서 그것만 만들었다.',
    },

    /* 03-D 배치 렌더 */
    batch: {
      title: 'HP 바 · 데미지 텍스트를 메시 하나로',
      beforeHead: '기존 · 요청자마다 계층',
      afterHead: '개선 · 등록만 하고 한 번에 그린다',
      beforeItems: ['적마다 월드 캔버스 + 이미지', '타격마다 텍스트 오브젝트', '요청자 수만큼 제출'],
      afterItems: ['등록된 목록을 LateUpdate 에 순회', '정점 버퍼 하나에 이어붙임', '메시 1개 업로드'],
      keyLabel: '배치 키 = 머티리얼 · 소팅 레이어 · 순서',
      result: '요청자가 늘어도 제출은 배치 키 조합 수만큼만 는다',
      caption:
        '데미지 텍스트는 **GameObject 가 아예 없다** — 구조체 목록만 들고, 뜨고 사라지는 연출을 ' +
        '**시간의 순수 함수**로 다시 계산한다. 저작한 곡선(ease)은 원래 쓰던 트윈 함수를 그대로 호출해 룩을 유지했다. ' +
        '소팅은 정점에 실을 수 없는 렌더러 속성이라, 그것만 배치를 가른다.',
      code: {
        title: 'QuadBatchRenderer.cs — 배치가 갈리는 조건',
        intro: '소팅은 정점이 아니라 렌더러 속성이다. 그래서 이 셋이 다르면 메시가 갈린다.',
        code:
          'public readonly struct QuadBatchKey\n' +
          '{\n' +
          '    public readonly Material Material;\n' +
          '    public readonly int SortingLayerId;\n' +
          '    public readonly int SortingOrder;\n' +
          '}',
        result: '요청자 수가 아니라 이 조합 수가 드로우콜을 정한다.',
      },
    },

    vizCaption:
      '물리 엔진 자리에 들어간 것 전부 — 순수 함수 커널 일곱, 월드 질의 넷. ' +
      '질의 넷 중 모양이 다른 것은 셋이고, 캡슐 다발은 캡슐 경로를 그대로 쓴다.',

    matrix: {
      title: '바디 모양 × 질의 모양 → 커널',
      queryHead: '월드 질의 4종',
      bodyHead: '바디 2종',
      queries: ['원', '캡슐', '회전 사각', '캡슐 다발'],
      bodies: ['원', '캡슐'],
      cells: [
        ['CircleOverlap', 'CircleVsCapsule', 'CircleVsRect', '캡슐 열 반복'],
        ['CircleVsCapsule', 'CapsuleVsCapsule', 'CapsuleVsRect', '캡슐 열 반복'],
      ],
      helpers: '거리 커널 2 — `SegmentToSegmentDistance` · `PointToSegmentDistance` 가 캡슐 판정 안에서 쓰인다',
      caption:
        '**커널 7 = 겹침 5 + 거리 2.** 캡슐 다발은 새 커널이 아니라 캡슐 열을 반복하고, 그 앞에 사각 프리필터만 붙는다. ' +
        '물리 엔진 자리에 들어간 것이 이게 전부다.',
    },

    why: {
      title: 'Unity 2D Physics 를 안 쓴 이유',
      headers: ['', 'Unity 물리', '자체 기하'],
      rows: [
        ['판정이 도는 시계', '고정 스텝', '**프레임**'],
        ['한 프레임당 판정', '0~2회 (프레임률에 따라)', '**1회**'],
        ['이 게임의 요구', '정밀 충돌 — 요구 아님', '**프레임 결정성** — 요구'],
      ],
    },
    whyNote:
      '두 시계가 다르면 그 순서를 맞추는 일이 게임 로직에 계속 샌다.',

    queries: {
      title: '범위 질의 둘 — 전수 비교를 피하는 방법이 다르다',
      headers: ['질의', '방법', '정확도'],
      rows: [
        ['적이 가장 몰린 지점', '셀 한 변 = 반경인 격자, 이웃 칸만 셈',
         '후보 집합 안에서 **전수 비교와 같은 답**'],
        ['겹치지 않는 자리', '칸마다 후보 하나를 뿌려 여유로 점수',
         '배치라 **근사로 충분**'],
      ],
    },

    cap: {
      title: '스폰 상한 — 개수가 아니라 면적',
      intro: '개수로 막으면 작은 적 10마리와 큰 적 10마리가 같은 취급을 받는다.',
      lines: [
        ['점유율', 'Σ(적 판정 면적) ÷ 화면 면적'],
        ['≤ 1.5', '그대로 통과'],
        ['1.5 ~ 2.5', '선형으로 확률 감소'],
        ['≥ 2.5', '스폰 0'],
      ],
      result: '계단이 아니라 기울기다. 분모(화면 면적)는 한 번만 잰다.',
    },

    code: {
      title: 'GeoWorldRegistry.cs — 바디 모양 × 질의 모양',
      intro: '원 질의가 들어왔을 때 바디가 원이냐 캡슐이냐로 커널이 갈린다.',
      code:
        'private static bool HitsCircle(\n' +
        '    in BodyShape s, Vector2 center, float radius) => s.Kind switch\n' +
        '{\n' +
        '    BodyShapeKind.Circle =>\n' +
        '        Geo2D.CircleOverlap(\n' +
        '            center, radius, s.Circle.Center, s.Circle.Radius),\n' +
        '    BodyShapeKind.Capsule =>\n' +
        '        Geo2D.CircleVsCapsule(\n' +
        '            center, radius, s.Capsule.A, s.Capsule.B, s.Capsule.Radius),\n' +
        '    _ => false,\n' +
        '};',
      result: '질의 넷 중 모양이 다른 것은 셋 — 캡슐 다발은 캡슐 경로를 그대로 쓴다.',
    },
  },

  /* ── 05 재지 않은 것 ─────────────────────────────────── */
  cost: {
    gist: '세 묶음으로 갈라 적는다 — **구조 · 모델 · 측정.** 마지막 묶음이 이 페이지에 성능 수치가 없는 이유다.',
    groups: [
      {
        head: '구조로 남은 것',
        lead: '고치려면 자료구조를 바꿔야 한다',
        items: [
          ['기하 월드는 선형 스캔',
            '등록된 바디를 전부 훑는다. 공간 분할이 아니다 — 스윕 질의에만 사각 프리필터.'],
          ['화면 면적을 한 번만 잰다',
            '해상도·화면비가 실행 중에 바뀌면 분모가 낡는다. 다시 재는 경로가 없다.'],
        ],
      },
      {
        head: '모델이 근사인 자리',
        lead: '숫자를 손으로 정했고 근거를 안 남겼다',
        items: [
          ['상수는 전부 손으로 맞췄다',
            '모델 환산 계수 · 런타임 상한 1.5·2.5 · 탐색 후보 수 — 셋 다 측정이 아니라 눈으로.'],
          ['보정 계수의 근거 기록이 없다',
            '노브를 플레이 감각에 맞춰 당겼는데 **무엇에 맞춰 얼마를 당겼는지** 남긴 문서가 없다. 지금 값을 재현할 수 없다.'],
          ['모델이 보는 공격원이 게임보다 적다',
            '효과 종류 11개를 클래스 8개가 나눠 받는데 **모델에 들어간 공격원은 셋뿐**이다.'],
        ],
      },
      {
        head: '재지 않은 것',
        lead: '이 페이지에 성능 수치가 없는 이유',
        items: [
          ['시뮬이 플레이를 대체하지 않았다',
            '체감은 플레이로 판단했다. 시뮬은 "어느 노드가 상대적으로 센가" 를 답하는 검산이다.'],
          ['자동 탐색을 결정에 못 썼다',
            '만들어 놓고 안 썼다. 전후 오차 기록도 없어 **이 도구가 얼마나 좋게 만들었나는 말할 수 없다.**'],
          ['빌드에서 프레임을 잰 적이 없다',
            '비동기 로드와 풀링은 **상주 메모리** 목적이었다. 구조가 보장하는 것만 적었다 — ' +
            '전투 중 생성 0 · 중복 로드 0 · 미사용 구간 비상주.'],
        ],
      },
    ],
    close: '다음에 잴 것 — **보정 계수를 무엇에 맞췄는지의 기록**, 그리고 **빌드에서 프레임**.',
  },
};
