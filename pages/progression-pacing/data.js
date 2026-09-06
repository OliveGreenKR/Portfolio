// pages/progression-pacing/data.js
//
// 이 페이지의 최종 공개 문안은 전부 여기 있다. JSX 안에 문장을 박지 않는다.
//
// ⚠️ 사실을 만들지 않는다. 원천 = knowledge_base/projects/cursorblade/research/claims.yaml
//    전달 계약 = _portfolio_site/motelet/progression-pacing-design.md
//
// 표시 라벨(`40만`)과 원시값(`400000`)은 **쌍으로** 둔다.
// 좌표 계산은 raw, 화면 문자열은 label — JSX 에서 문자열끼리 더해 좌표가 날아가는 것을 막는다.

window.PACING_DATA = {
  meta: {
    title: "Motelet — 성장 리듬의 설계 · JCH Portfolio",
    brand: "JCH / PORTFOLIO",
    crumb: "projects / motelet",
    navLabel: "본문 목차",
    footer: "Motelet · 진행 템포 모델과 실험 도구",
    back: "처음으로",
    // rail 4그룹 — 8절을 덩이로 묶어 롱스크롤에서 위치감을 준다
    railGroups: [
      { label: "GAME", ids: ["game-loop", "growth"] },
      { label: "MODEL", ids: ["model", "space"] },
      { label: "JUDGMENT", ids: ["roles"] },
      { label: "EVIDENCE", ids: ["observation", "workflow", "outcome"] }
    ],
    nav: [
      ["game-loop", "GAME"],
      ["model", "MODEL"],
      ["roles", "JUDGMENT"],
      ["workflow", "EVIDENCE"]
    ]
  },

  // 히어로 직후 3칸 — 페이지 전체를 「결과 → 구조 → 상세」 순서로 만드는 자리
  scope: {
    label: "이 페이지가 다루는 것",
    cards: [
      {
        k: "정의",
        t: "무엇을 성장이라 부를 것인가",
        d: "자산에 적힌 HP·보상·요구 점수의 사다리에서 저항의 정체를 읽고, 역할과 조정 변수의 책임을 나눴습니다."
      },
      {
        k: "모델",
        t: "그 정의를 계산으로",
        d: "평균값 대신 고정 시간 간격마다 전장의 상태를 갱신하고, 원래 피해와 유효 피해를 나눠 기록했습니다."
      },
      {
        k: "구조",
        t: "판단을 반복할 수 있게",
        d: "사본이 아니라 원본 소스를 그대로 컴파일하고, 바꿀 수 있는 축의 목록 자체를 안전 경계로 삼았습니다."
      }
    ],
    role: "문제 해석 · 판단 기준 · 실험 방식 구성 / 구현과 검토에 AI 활용"
  },

  labels: {
    problem: "문제",
    concern: "우려",
    decision: "결정",
    evidence: "근거",
    tradeoff: "트레이드오프"
  },

  // ── 절 ────────────────────────────────────────────────────────
  // 8절 전부 같은 7슬롯을 쓴다: 제목 → lead → 주 시각자료 → prd → 보조 → 코드 → next
  // lead 와 prd 가 비어 있는 절을 만들지 않는다. 그게 지난 판이 겉핥기가 된 이유다.
  sections: [
    {
      id: "game-loop",
      nav: "01 · 게임과 한 런",
      kind: "GAME & RUN",
      title: "런은 끝나도 성장은 남습니다",
      lead: "한 번의 전투는 보스 처치나 스태미나 소진으로 끝나고 레벨은 처음으로 돌아갑니다. 그런데 **구매한 능력은 다음 런으로 넘어갑니다.** 성장은 전투 안이 아니라 런과 런 사이에서 일어납니다.",
      prd: [
        {
          kind: "problem",
          label: "문제",
          text: "성장이 런 **바깥**에 있다는 것이 밸런싱을 어렵게 만듭니다. 한 판을 아무리 자세히 들여다봐도 «이 강화가 다음 판을 얼마나 바꾸는가» 는 나오지 않습니다. 판단하려면 여러 런을 이어 붙여 구매 상태가 쌓이는 과정 전체를 봐야 합니다."
        },
        {
          kind: "decision",
          label: "결정",
          text: "골드와 처치 점수를 **서로 다른 자원으로** 나눠 봤습니다. 처치 점수는 런 안에서만 쓰이고 레벨을 올린 뒤 사라집니다. 골드는 런이 끝난 뒤 능력 구매로 이어져 다음 런의 전투 조건을 바꿉니다. 둘을 «성과» 하나로 합치면 «이번 판을 잘했다» 와 «다음 판이 쉬워졌다» 를 구분할 수 없습니다."
        }
      ],
      next: "이 반복 동안 어떤 성장 변화를 주려 했는가?"
    },
    {
      id: "growth",
      nav: "02 · 성장의 해석",
      kind: "WHAT COUNTS AS GROWTH",
      title: "저항은 어디서 오는가",
      lead: "상위로 갈수록 **HP는 250배 오르는데 기본 골드는 50배만 오릅니다.** 저항은 여기서 나오고, 그 격차를 메우는 것이 능력 구매입니다.",
      prd: [
        {
          kind: "problem",
          label: "문제",
          text: "성장에는 두 종류가 있습니다. **같은 적을 더 잘 잡게 되는 것**과 **더 큰 보상을 여는 새 적에 닿는 것.** 이 둘을 한 사건으로 묶으면 «레벨이 올랐다» 는 말이 «수입이 늘었다» 를 뜻하는지 «더 센 적을 만났다» 를 뜻하는지 알 수 없게 됩니다. 조정할 값을 고르는 단계에서 이미 길이 막힙니다."
        },
        {
          kind: "decision",
          label: "결정",
          text: "요구 점수 30 → 37,400 은 HP·보상과 **별개의 사다리**이고 체류 시간을 담당합니다. 그래서 새 구간 진입, 상위 몬스터 첫 처치, 반복 사냥을 서로 다른 사건으로 분리하고, 레벨과 요구 점수 충족 비율을 공통 관찰축으로 삼았습니다."
        },
        {
          kind: "tradeoff",
          label: "트레이드오프",
          text: "출현 가중치는 **스폰 선택 확률이지 실제 처치 구성이 아닙니다.** 표의 값은 보유 효과를 적용하기 전 기본값이고 최종 출시 수치도 아닙니다. 그래서 이 사다리에서 읽을 수 있는 것은 설계된 격차의 모양이지, 플레이어가 실제로 번 골드가 아닙니다."
        }
      ],
      next: "이 관계들을 어떻게 계산 가능한 모델로 나눴는가?"
    },
    {
      id: "model",
      nav: "03 · 계산 관계",
      kind: "SIMULATION MODEL",
      title: "평균이 아니라 상태를 굴렸습니다",
      lead: "평균 초당 피해 대신 **고정된 시간 간격마다 전장의 상태를 갱신**하고, 그 결과를 원래 피해와 유효 피해로 나눠 기록했습니다.",
      prd: [
        {
          kind: "problem",
          label: "문제",
          text: "총 피해량만 곱하면 **큰 한 방이 공격원 비교를 부풀립니다.** 남은 HP가 100인 몬스터에게 10,000의 피해를 넣어도 실제로 깎인 것은 100인데, 집계에서는 10,000을 낸 공격이 100배 기여한 것처럼 보입니다."
        },
        {
          kind: "decision",
          label: "결정",
          text: "**원래 피해와 유효 피해를 분리해 갖습니다.** 유효 피해는 남은 HP와 피해의 최솟값이고, 초과분은 버립니다. 처치하지 못한 몬스터에 넣은 피해는 «보류» 로 따로 남기고, 처치한 개체의 점수·골드만 유효 피해 비율로 배분합니다."
        },
        {
          kind: "evidence",
          label: "근거",
          text: "아래 세 발췌가 각 단계를 계산 소스 그대로 보여줍니다 — 한 틱의 갱신 순서, 유효 피해의 절단, 처치 여부에 따른 두 원장. 다만 이 배분은 **분석용 지표이지 보상을 더 주는 것이 아니고**, «그 공격을 빼면 어떻게 되는가» 의 답도 아닙니다."
        }
      ],
      next: "같은 공격력이어도 결과가 달라지는 이유는?"
    },
    {
      id: "space",
      nav: "04 · 공간과 적중",
      kind: "SPATIAL RESOLUTION",
      title: "같은 배치에서도 맞는 대상은 갈립니다",
      lead: "같은 자리, 같은 마릿수여도 **공격 방식에 따라 맞는 대상이 달라집니다.** 그래서 모든 공격에 하나의 밀도 배율을 적용할 수 없었습니다.",
      prd: [
        {
          kind: "problem",
          label: "문제",
          text: "«몬스터가 밀집하면 광역 공격이 강해진다» 를 하나의 배율로 뭉치면 직선 관통과 연쇄가 같은 방식으로 적중한다고 오해하게 됩니다. 관통은 **경로 위에 있느냐**로 갈리고, 연쇄는 **사거리 안에 아직 안 맞은 대상이 있느냐**로 갈립니다. 같은 군집을 경로 밖으로 옮기면 한쪽만 0이 됩니다."
        },
        {
          kind: "decision",
          label: "결정",
          text: "전장의 위치 상태를 먼저 만들고 **공격마다 다른 기하 조건**을 적용했습니다. 관통은 경로와 몬스터 반경의 교차, 연쇄는 이미 맞힌 대상을 제외한 사거리 안의 다음 대상, 몸통은 실제 접촉 반경입니다."
        },
        {
          kind: "tradeoff",
          label: "트레이드오프",
          text: "아래 선택 식은 **정적 비교용**입니다. 실제 처치 수나 처치 시간과 같지 않고, 한 번에 맞히는 대상 수를 다시 곱하지도 않습니다. 오른쪽 그림의 적중 수는 설명용 가정값이며 실게임 설정이나 측정값이 아닙니다."
        }
      ],
      next: "이 계산으로 실제로 무엇을 판단했는가?"
    },
    {
      id: "roles",
      nav: "05 · 역할과 조정 판단",
      kind: "DESIGN JUDGMENT",
      title: "두 역할이 함께 성립하는 범위에서만 고칩니다",
      lead: "공격을 **첫 돌파**와 **하위 정리**의 역할로 나누고, 두 역할이 **함께 성립하는 범위**에서만 조정 방향을 정했습니다.",
      prd: [
        {
          kind: "problem",
          label: "문제",
          text: "이전 구간을 빠르게 통과시키려고 압축 담당 공격을 강화하면, 그 공격이 현재 최상위 몬스터까지 정리해 버려 **남겨야 할 저항이 사라집니다.** 하위를 빠르게 만드는 일과 상위의 저항을 지키는 일이 같은 값 하나에 걸려 있습니다."
        },
        {
          kind: "concern",
          label: "우려",
          text: "반대 방향의 오판도 있습니다. 처형 계열의 강화 노드가 비어 있는 구간을 보고 «여기서 성장이 멈췄다» 고 단정하면, 그 사이 압축·스폰·경제 강화로 일어난 **하위 구간의 성장을 놓칩니다.** 강화 공백만으로 정체를 판단하지 않고 첫 처치·안정 처치·체류·하위 성장을 함께 봅니다."
        },
        {
          kind: "decision",
          label: "결정",
          text: "HP를 한 조건으로 정하지 않고 **여러 공격원의 목표 타격 수 조건이 겹치는 구간**으로 구합니다. 교집합이 있으면 그 범위 안에서 HP를 정하고, 교집합이 없으면 HP 숫자를 억지로 맞추는 대신 **역할·해금·노드 배치의 충돌로 다룹니다.** 관찰한 증상에 따라 건드릴 값도 달라집니다 — 아래 표가 그 갈림길입니다."
        },
        {
          kind: "tradeoff",
          label: "트레이드오프",
          text: "조정 축은 서로 독립이 아닙니다. 발동 빈도나 범위를 늘려도 상위 기여가 함께 커질 수 있어 «안전한 대체 수단» 이 아닙니다. 그리고 이 절이 설명하는 것은 **모델에 정의한 역할과 판단 방법**이지, 모든 병목이 실제로 발생하고 해소됐다는 주장이 아닙니다."
        }
      ],
      next: "이 기준으로 무엇을 관찰했는가?"
    },
    {
      id: "observation",
      nav: "06 · 관찰과 기준 보완",
      kind: "OBSERVATION",
      title: "같은 레벨에 도착해도 같은 성장이 아닙니다",
      lead: "진입·첫 처치·수입·재통과를 **네 개의 다른 사건으로** 기록하고, **관측이 없는 구간을 0으로 채우지 않았습니다.**",
      prd: [
        {
          kind: "problem",
          label: "문제",
          text: "Stage04 후보를 검토할 때 기준이 «구간을 통과하는 시간» 하나였습니다. 시간만 맞추면 스테이지 경계에서 **이전 성장이 이어지는지, 새 적의 저항이 서는지**를 검사하지 못합니다. 같은 시간에 도착해도 화력과 몬스터 HP의 관계가 전혀 다를 수 있습니다."
        },
        {
          kind: "decision",
          label: "결정",
          text: "손으로 조정한 Stage03을 **참조점으로 삼되 수치를 복사하지 않았습니다.** 대신 이어져야 할 관계를 찾아 진입 화력 ↔ 최하위 HP, 완료 화력 ↔ 최상위 HP, 화력의 성장 폭 ↔ HP 범위를 각각 대응시키고 HP 사다리의 조정 방향을 다시 정리했습니다."
        },
        {
          kind: "evidence",
          label: "근거",
          text: "Stage04 후보 검토 문서에 남은 진단과 수정 이유가 근거입니다. 확인된 것은 **기준의 보완**이며, 수정한 뒤 재미가 나아졌다거나 모든 시간 지표를 달성했다는 뜻은 아닙니다."
        }
      ],
      next: "이 관찰과 판단을 어떻게 반복할 수 있게 만들었는가?"
    },
    {
      id: "workflow",
      nav: "07 · 반복 실험 구조",
      kind: "SHARED CORE & CLI",
      title: "사본을 만들지 않고, 바꿀 수 있는 축을 경계로 삼았습니다",
      lead: "Unity 밖에서 실험하되 **사본이 아니라 원본 소스를 그대로 컴파일**하고, **바꿀 수 있는 축의 목록 자체를 안전 경계**로 삼았습니다.",
      prd: [
        {
          kind: "decision",
          label: "결정",
          text: "에디터에서 시나리오를 내보내고, 에디터 밖에서 **같은 계산 소스**로 캠페인을 반복 실행하고, 결과를 다음 후보 판단으로 되돌립니다. 요청은 자유 문장이 아니라 값이 적힌 JSON이고, 원본 자산은 건드리지 않고 메모리에서만 바꿔 돌립니다. 결정마다의 이유는 아래 표에 있습니다."
        },
        {
          kind: "tradeoff",
          label: "트레이드오프",
          text: "«독립 실행» 은 **에디터 조작 없이 내보낸 데이터로 실험한다**는 뜻입니다. 보안 격리도, Unity 설치 의존을 없앤 것도 아닙니다. 형식 검사가 밸런스의 적정성을 보증하지 않고, 소스 공유가 실게임의 완전한 재현을 보증하지도 않습니다. 결과 판정과 재미 확인은 사람과 실제 플레이의 몫입니다."
        }
      ],
      next: "그래서 무엇을 판단했고 어디까지 확인됐는가?"
    },
    {
      id: "outcome",
      nav: "08 · 확인된 범위",
      kind: "SCOPE & CONTRIBUTION",
      title: "확인된 것과 아직 아닌 것",
      lead: "확인된 것은 **모델 · 실험 도구 · 기준 보완**입니다. 실제 재미와 출시 성과는 별도의 검증 대상입니다.",
      prd: [
        {
          kind: "evidence",
          label: "근거",
          text: "판단 기준을 시간축 하나에서 전투 조건까지 넓힌 기록이 후보 검토 문서에 남아 있고, 그 판단을 반복할 계산 코어와 CLI가 동작하는 형태로 있습니다. 여기까지가 확인된 범위입니다."
        },
        {
          kind: "tradeoff",
          label: "트레이드오프",
          text: "**사본에서 실험 · 원본 반영 · 실제 플레이 · 출시는 서로 다른 상태입니다.** 시뮬레이션 결과나 자산 반영 기록만으로 최종 재미나 출시 성과가 증명되지 않습니다. 이 페이지에 성능 수치와 개선률이 없는 것은 그 근거가 확인되지 않았기 때문입니다."
        }
      ],
      next: null
    }
  ],

  // ── S02 사다리 데이터 ─────────────────────────────────────────
  // 원천: Stage03.asset (_monsters · _levels), 2026-09-06 확인. Claim MT-PACING-LADDER-001
  // F02 · F03 · F09 가 axisLevels 를 공유한다 — 축이 이어진 것을 문자열 동일성으로 보증한다.
  ladder: {
    axisLevels: ["Lv 1", "Lv 2", "Lv 3", "Lv 4", "Lv 5", "Lv 6"],
    tiers: [
      { tier: 1, id: "helmet", name: "헬멧", hp: 400000, hpL: "40만", score: 1, scoreL: "1", gold: 200000, goldL: "20만", ratio: 2.0 },
      { tier: 2, id: "box", name: "상자", hp: 1200000, hpL: "120만", score: 5, scoreL: "5", gold: 400000, goldL: "40만", ratio: 3.0 },
      { tier: 3, id: "battery", name: "배터리", hp: 3600000, hpL: "360만", score: 20, scoreL: "20", gold: 800000, goldL: "80만", ratio: 4.5 },
      { tier: 4, id: "gasolineCan", name: "기름통", hp: 6600000, hpL: "660만", score: 50, scoreL: "50", gold: 1800000, goldL: "180만", ratio: 3.7 },
      { tier: 5, id: "fireExtinguisher", name: "소화기", hp: 32000000, hpL: "3,200만", score: 240, scoreL: "240", gold: 4000000, goldL: "400만", ratio: 8.0 },
      { tier: 6, id: "vacuum", name: "청소기", hp: 100000000, hpL: "1억", score: 1200, scoreL: "1,200", gold: 10000000, goldL: "1,000만", ratio: 10.0 }
    ],
    levels: [
      { lv: 1, required: 30, requiredL: "30", weights: [{ id: "helmet", w: 1.0 }] },
      { lv: 2, required: 75, requiredL: "75", weights: [{ id: "helmet", w: 0.7 }, { id: "box", w: 0.3 }] },
      { lv: 3, required: 360, requiredL: "360", weights: [{ id: "helmet", w: 0.2 }, { id: "box", w: 0.4 }, { id: "battery", w: 0.4 }] },
      { lv: 4, required: 1700, requiredL: "1,700", weights: [{ id: "box", w: 0.3 }, { id: "battery", w: 0.4 }, { id: "gasolineCan", w: 0.3 }] },
      { lv: 5, required: 7300, requiredL: "7,300", weights: [{ id: "battery", w: 0.3 }, { id: "gasolineCan", w: 0.4 }, { id: "fireExtinguisher", w: 0.3 }] },
      { lv: 6, required: 37400, requiredL: "37,400", weights: [{ id: "gasolineCan", w: 0.3 }, { id: "fireExtinguisher", w: 0.4 }, { id: "vacuum", w: 0.3 }] }
    ],
    series: {
      hp: { label: "HP", group: "combat" },
      gold: { label: "기본 골드", group: "combat" },
      score: { label: "처치 점수", group: "progress" },
      required: { label: "요구 점수", group: "progress" }
    },
    groupLabels: { combat: "전투 조건", progress: "진행 조건" },
    multiples: [
      { series: "HP", value: "×250" },
      { series: "기본 골드", value: "×50" }
    ],
    axisNote: "로그 눈금 — 한 칸이 100배",
    xAxisLabel: "그 레벨에서 처음 등장하는 몬스터",
    ticks: [
      { v: 1, label: "1" },
      { v: 100, label: "100" },
      { v: 10000, label: "1만" },
      { v: 1000000, label: "100만" },
      { v: 100000000, label: "1억" }
    ],
    ladderTitle: "레벨이 오를수록 저항과 보상의 격차가 벌어집니다",
    ratioTitle: "체력당 보상 (HP ÷ 기본 골드) — 클수록 나쁨",
    ratioNote: "Level 4에서 4.5 → 3.7로 한 번 완화됩니다. 단조롭게 나빠지지 않습니다.",
    ratioEase: "한 번 완화",
    panelTop: "↑ 절대값 (로그)",
    panelBottom: "↓ 비율 (선형)",
    caption: "2026-09-06 확인한 Stage03 자산 설정값입니다. 보유 효과를 적용하기 전 기본값이며 최종 출시 수치가 아닙니다. 로그 눈금이라 한 칸이 100배입니다.",
    tierTableTitle: "일반 몬스터 6종 — 자산 설정값",
    tierHeaders: ["티어", "몬스터", "HP", "처치 점수", "기본 골드", "HP ÷ 골드"],
    levelTableTitle: "레벨 6개 — 요구 점수와 출현 가중치",
    levelHeaders: ["레벨", "요구 점수", "출현 가중치"],
    // F03
    overlapTitle: "레벨 3부터 세 티어가 겹쳐 등장합니다",
    overlapCaption: "채워진 칸만 그 레벨에 등장합니다. 비어 있음이 정보입니다. 가중치는 스폰 선택 확률이며 실제 처치 구성이 아닙니다.",
    overlapNote: "Level 4부터는 창의 모양이 완전히 같습니다 — 0.3 / 0.4 / 0.3 이 한 칸씩 오른쪽으로 미끄러집니다. 역할 격자의 N−2 · N−1 · N 은 설계상의 비유가 아니라 자산에 그렇게 적혀 있습니다.",
    windowLabels: ["N−2", "N−1", "N"],
    windowColumn: "그 레벨의 창",
    knobs: "테마 노브 · 기본 소모 100/초 · 레벨당 소모 증가 1.5배",
    lv3Note: "이제는 쉬워진 적과 새 저항이 한 화면에 같이 있습니다.",
    lv3Art: [
      { id: "box", name: "상자", image: "progression-pacing/assets/mon-box.png" },
      { id: "battery", name: "배터리", image: "progression-pacing/assets/mon-battery.png" }
    ]
  },

  // ── S01 F01 런 경계 타임라인 ──────────────────────────────────
  f01: {
    title: "한 런의 시간축과, 경계를 넘는 것 / 넘지 못하는 것",
    runA: "런 N",
    runB: "런 N+1",
    boundary: "런 종료 — 보스 처치 또는 스태미나 소진",
    laneScore: "처치 점수",
    laneScoreNodes: ["레벨 상승", "레벨 상승"],
    laneScoreEnd: "Level 1부터 다시",
    laneGold: "골드",
    laneGoldNode: "능력 구매",
    laneGoldEnter: "보유 능력",
    stamina: "스태미나 — 전투를 지속할 조건",
    staminaEnd: "소진",
    zoom: "§03에서 이 한 칸의 안쪽",
    caption: "개발 중 빌드 기준의 게임 규칙입니다. 런타임의 재시작 레벨 설정은 별도 예외이며 통상 진행은 Level 1부터입니다."
  },

  // ── S03 ────────────────────────────────────────────────────────
  f04: {
    title: "고정된 시간 간격 안에서 갱신되는 순서",
    dt: "dt (고정)",
    steps: [
      "스태미나 소모",
      "이동 · 필드 · 효과 · 분신",
      "스폰",
      "플레이어 공격",
      "자동 레벨 전환 검사"
    ],
    levelSwitch: "레벨 전환 — 전장을 비우고 초기 스폰을 다시 실행",
    monsterRow: "살아 있는 몬스터",
    energyRow: "스태미나 잔량",
    caption: "현재 계산 소스의 갱신 순서입니다. Unity 런타임의 모든 물리 현상을 재현하거나 실제 플레이 시간을 예측한다는 뜻은 아닙니다."
  },
  f05: {
    title: "들어온 피해와 실제로 깎인 HP",
    incoming: "들어온 피해",
    remaining: "남은 HP",
    wasted: "버려지는 초과분",
    effective: "유효 피해",
    killed: "처치 원장",
    killedNote: "점수 · 골드를 유효 피해 비율로 배분",
    pending: "미처치 보류",
    pendingNote: "처치하지 못한 몬스터에 넣은 피해",
    caption: "배분은 분석용 지표입니다. 보상을 더 주는 것이 아니고, 그 공격을 빼면 어떻게 되는가의 답도 아닙니다."
  },

  // ── S04 ────────────────────────────────────────────────────────
  f06: {
    title: "같은 배치 · 같은 마릿수 — 공격에 따라 갈리는 적중",
    rows: [
      { id: "on-path", name: "관통 경로 위의 군집" },
      { id: "off-path", name: "관통 경로 밖의 같은 군집" }
    ],
    cols: [
      { id: "linear", name: "직선 관통" },
      { id: "chain", name: "연쇄" },
      { id: "contact", name: "몸통 접촉" }
    ],
    hits: {
      "on-path": { linear: "6마리", chain: "3마리", contact: "접촉 반경 안" },
      "off-path": { linear: "0마리", chain: "3마리", contact: "접촉 반경 밖" }
    },
    excluded: "✓ 제외",
    caption: "설명용 배치입니다. 각 공격을 별도로 적용하며 관통 대상 제한 없음 · 연쇄 최대 3마리 · 모든 대상 도달 가능을 가정합니다. 실게임 설정이나 측정값이 아닙니다. 접촉은 자료에 적중 수가 없어 반경 안팎만 표시합니다.",
    contactRef: "몸통 접촉의 호출은 §03의 틱 발췌 마지막 부분에 있습니다."
  },
  equation: {
    label: "정적 비교용 선택 식",
    formula: "C = f × E[U] × E[B]",
    terms: [
      ["f", "초당 발동 횟수"],
      ["E[U]", "한 번에 맞히는 서로 다른 몬스터 수"],
      ["E[B]", "피해의 처치 환산량"]
    ],
    note: "실제 처치 수나 처치 시간과 같지 않습니다. E[U]에 든 대상 수를 다시 곱하지 않으며, 같은 대상을 여러 번 때리는 것과 서로 다른 대상을 맞히는 것은 다릅니다."
  },

  // ── S05 ────────────────────────────────────────────────────────
  roles: {
    title: "어느 공격이 어느 티어를 맡는가",
    axisLabel: "대상 티어",
    tiers: [
      { id: "older", code: "N−2", name: "두 단계 이전", goal: "빠른 재통과" },
      { id: "previous", code: "N−1", name: "이전 티어", goal: "다수 처치" },
      { id: "top", code: "N", name: "현재 최상위", goal: "첫 돌파의 저항" }
    ],
    matrix: [
      { attack: "처형 계열", cells: ["보조 가능", "보조 가능", "첫 돌파"], tones: ["quiet", "quiet", "break"] },
      { attack: "연쇄번개 · 낙뢰", cells: ["빠른 재통과", "다수 처치", "제한적 누적 기여"], tones: ["growth", "growth", "support"] }
    ],
    matrixNote: "주요 담당 관계입니다. 표시가 없는 대상에 피해를 주지 않는다는 뜻은 아니며, 몸통은 접촉·크기에 따른 하위 정리를 함께 검토합니다.",
    bandLabel: "현재 최상위 일반 몬스터 · 일반 1타 설계 목표",
    bandValue: "HP의 2~5%",
    bandNote: "연쇄번개 · 낙뢰의 설계 목표이며 특정 구매 시점의 달성값이 아닙니다.",
    caption: "설계 문서에 정의된 역할 배분입니다. 배경의 옅은 밴드는 §02에서 본 자산의 티어 겹침으로, 열 위치가 같습니다.",
    inheritNote: "열은 §02에서 본 자산의 겹침 창과 같은 세 티어입니다"
  },
  intersection: {
    title: "HP는 한 조건이 아니라 두 조건의 겹침으로 정합니다",
    axis: "← 낮은 HP        높은 HP →",
    okLabel: "교집합이 있을 때",
    noLabel: "교집합이 없을 때",
    barTop: "상위: 주 처형 역할 유지",
    barBottom: "하위: 목표 타격 수 달성",
    okResult: "검토할 HP 범위",
    noResult: "HP 숫자를 억지로 맞추지 않고 역할 · 해금 · 노드 배치의 충돌로 다룹니다",
    caption: "값이 아니라 조건의 겹침을 나타내는 판단 도식입니다. 축에 눈금이 없는 것은 의도적입니다 — 이 절의 근거는 측정값이 아니라 판단 방법입니다.",
    htk: "처치 타격 수 = ceil(HP ÷ 1회 피해)",
    htkNote: "ceil은 올림입니다. 일반과 치명타를 나누고, 발동 빈도와 실제 적중도 함께 봅니다."
  },
  adjust: {
    title: "관찰한 증상에 따라 달라지는 조정 방향",
    headers: ["관찰한 증상", "검토할 수단과 그 이유"],
    rows: [
      ["피해를 더 줘도 타격 수가 줄지 않을 때", "발동 빈도 · 고유 적중 수 · 공간 배치를 봅니다. 피해와 실제 처치 기회를 분리하기 위해서입니다."],
      ["빈 화면과 다음 몬스터 등장 대기가 문제일 때", "스폰 수 · 주기 · 가중치 · 개수와 점유 제한을 봅니다. 낮은 생존 수만으로 스폰 병목을 확정하지 않습니다."],
      ["전투 역할은 맞지만 레벨을 너무 빨리 통과할 때", "레벨의 요구 점수를 먼저 봅니다. HP로 전투 역할을 바꾸기 전에 체류 조건을 분리합니다."],
      ["다음 저항 전에 필요한 강화를 사지 못할 때", "가격 · 해금 · 누적 구매 순서를 봅니다. 강화의 최종값뿐 아니라 도달하는 시점이 중요합니다."]
    ]
  },
  stamina: {
    title: "스태미나 — 역할이 아니라 역할을 수행할 활동 조건",
    steps: ["이전 구간에서 소모", "새 레벨 진입 시 잔여량", "조건부 회복", "공략 또는 런 종료"],
    note: "세 번째 공격 역할이나 고정 시간 지급이 아닙니다. 첫 진입은 레벨업 회복에서 제외되고, 보스를 처치하면 런이 끝납니다. 이전 구간에서 아낀 시간이 새 구간의 활동 시간으로 그대로 전환되지도 않습니다."
  },

  // ── S06 ────────────────────────────────────────────────────────
  f09: {
    title: "하나의 진행도 축 위에서 네 사건을 따로 기록합니다",
    axisFormula: "진행도 = (레벨 − 1) + 처치 점수 ÷ 요구 점수",
    events: [
      { mark: "circle", name: "최초 진입", q: "새 저항에 언제 닿았는가" },
      { mark: "diamond", name: "상위 몬스터 첫 처치", q: "더 큰 보상을 언제 처음 얻었는가" },
      { mark: "triangle", name: "런당 골드 변화", q: "반복 전투의 수입이 어떻게 달라졌는가" },
      { mark: "square", name: "재통과 잔여 스태미나", q: "이전 구간을 지난 뒤 활동 여유가 남는가" }
    ],
    missing: "관측 없음 — 0으로 채우지 않습니다",
    caption: "사건의 종류를 구분한 관찰 설계입니다. 특정 실행의 측정 결과가 아니며, 마커 위치는 네 사건이 서로 다른 시점에 일어난다는 것만 말합니다. 보스는 별도의 HP · 시간 축으로 봅니다."
  },
  f10: {
    title: "Stage03의 관계를 참조해 Stage04에 추가한 검사",
    reference: "Stage03 · 수치 복사가 아닌 관계 참조",
    beforeLabel: "이전 기준",
    afterLabel: "보완한 기준",
    leftHead: "플레이어 화력 조건",
    rightHead: "몬스터 HP 조건",
    beforePair: ["구간 통과 시간", "—"],
    pairs: [
      { when: "진입 시점", left: "진입 화력", right: "최하위 몬스터 HP" },
      { when: "완료 시점", left: "완료 화력", right: "최상위 몬스터 HP" },
      { when: "성장 폭", left: "화력의 성장 폭", right: "몬스터 HP 범위" }
    ],
    caption: "시간 지표를 버린 것이 아니라, 시간만으로 보이지 않는 전투 조건을 더한 검토입니다. 후보 검토 문서에 남은 기준 보완이며 수정 뒤 재미 개선을 뜻하지 않습니다."
  },

  // ── S07 ────────────────────────────────────────────────────────
  f11: {
    title: "무엇을 함께 읽고, 무엇을 받아들이지 않는가",
    sourceNode: "Assets/*.cs · 계산 소스",
    sourceNote: "사본을 만들지 않습니다",
    consumers: ["Unity 에디터", "CLI"],
    runtimeNote: "ProjectVersion.txt → 프로젝트 버전의 Unity Mono",
    cliNode: "CLI",
    cliNote: "진입점 하나",
    inputs: [
      { id: "scenario", label: "시나리오 JSON", from: "에디터에서 내보냄" },
      { id: "request", label: "요청 JSON", from: "AI" }
    ],
    boundaryTitle: "바꿀 수 있는 축",
    inside: ["기존 항목의 값 변경"],
    insideNote: "메모리에서만 적용 — 원본 자산은 그대로",
    outside: ["노드 추가", "노드 삭제", "선행 연결 변경", "없는 항목의 값"],
    outsideNote: "표현 자체가 불가능합니다",
    output: "결과 JSON (표준출력)",
    outputNote: "보고에는 이름 대신 id",
    human: "결과 판정과 재미 확인 — 사람과 실제 플레이",
    caption: "왼쪽은 무엇을 함께 읽는가, 오른쪽은 무엇을 받아들이는가입니다. AI의 반복은 도구를 쓰는 작업 흐름이며 CLI 안의 자동 에이전트 기능이 아닙니다."
  },
  decisions: {
    title: "구조를 이렇게 정한 이유",
    headers: ["결정", "이유"],
    rows: [
      ["CLI가 원본 `.cs`를 그대로 컴파일합니다. 사본을 만들지 않습니다", "같은 파일을 컴파일해야 Unity와 CLI의 결과가 갈리지 않습니다. 예외는 UnityEngine 껍데기뿐입니다."],
      ["CLI는 프로젝트 버전의 Unity Mono로만 돌립니다", "시스템 .NET으로 돌리면 부동소수 처리가 달라 에디터와 다른 숫자가 나옵니다. 버전 경로를 손으로 적어 두면 에디터를 올릴 때 조용히 옛 런타임을 쓰게 되므로 프로젝트 설정에서 파생합니다."],
      ["진입점은 하나입니다 — 명령 JSON을 받아 결과 JSON을 표준출력으로만 냅니다", "진입점이 여럿이면 안전 검사가 그만큼 흩어지고, 하나를 빠뜨리면 그게 구멍입니다."],
      ["바꿀 수 있는 축의 목록이 곧 안전 경계입니다", "값 변경도 기존 항목만 허용합니다. 없는 항목을 적으면 «추가»가 되므로 거부합니다."],
      ["보고에는 사람이 읽는 이름 대신 id를 싣습니다", "이름은 저작 중에 바뀌지만 id는 바뀌지 않습니다. 몇 주 뒤에도 같은 대상을 가리켜야 합니다."]
    ]
  },

  // ── S08 ────────────────────────────────────────────────────────
  reach: {
    title: "네 상태는 서로 다릅니다",
    rows: [
      { name: "사본에서 실험", state: "confirmed", note: "모델과 CLI로 반복 실행" },
      { name: "원본 반영", state: "partial", note: "적용 기록은 있으나 캡처는 차이 없음 상태" },
      { name: "실제 플레이", state: "open", note: "별도의 검증 대상" },
      { name: "출시", state: "open", note: "별도의 검증 대상" }
    ],
    legend: [["confirmed", "확인됨"], ["partial", "경로만 확인"], ["open", "확인 안 됨"]]
  },
  contribution: {
    mineLabel: "본인이 정한 것",
    mine: ["성장 문제의 해석", "판단 기준의 설정", "실험 방식의 구성"],
    othersLabel: "본인 것이 아닌 것",
    others: ["구현의 상당 부분과 검토에 AI 활용", "스킬트리 데이터 · DB는 팀원 작업"]
  },

  // ── 코드 발췌 ─────────────────────────────────────────────────
  // 전부 현재 계산 소스의 연속 발췌다. 화면 캡처의 수치를 같은 코드·입력으로
  // 재현했다는 뜻은 아니다.
  code: {
    sourceNote: "현재 계산 소스의 연속 발췌입니다. 화면 캡처의 수치를 같은 코드·입력으로 재현했다는 뜻은 아닙니다.",
    tick: {
      label: "PacingRunSimulator.cs · Tick — 한 틱의 갱신 순서",
      intro: "그림의 다섯 단계가 이 순서 그대로입니다. 스태미나 소모부터 자동 레벨 전환 검사까지 연속 발췌입니다.",
      code: `float drain = theme.BaseDrainPerSecond /
    PacingMath.Max(0.0001f, 1f + _scenario.Build.EnergyEfficiency) *
    PacingMath.Pow(theme.DrainGrowth, PacingMath.Max(0, _level - 1));
drain = PacingMath.Max(_scenario.MinimumDrainPerSecond, drain);
_energy = PacingMath.Max(0f, _energy - drain * dt);

UpdateMonsters(dt);
UpdateFields(dt);
UpdateEffects(dt);
UpdateClones(dt);
UpdateInitialWave(dt);

_spawnTimer -= dt;
// 보스 구간에도 잡몹은 계속 나온다 — 런타임에 스폰을 멈추는 코드가 없다
// (SetSpawning(false) 는 보스 «사망 후» 정리와 레벨업 전환에서만 불린다).
if (_spawnTimer <= 0f)
{
    TrySpawnWeighted();
    _spawnTimer = PacingMath.Max(dt, _theme.HasStageSpawnOverride
        ? _theme.EnemySpawnIntervalSeconds : _scenario.Build.EnemySpawnIntervalSeconds);
}

if (_playerAttackTimer > 0f && _playerDashTravelRemaining <= 0f)
    DamageBodyContact(_playerPosition, _scenario.Build.BodyHitRadius,
        _scenario.Build.AttackDamage, null, null);
_playerAttackTimer -= dt;
_playerDashTravelRemaining = PacingMath.Max(0f, _playerDashTravelRemaining - dt);
if (_playerAttackTimer <= 0f)
{
    float travelSeconds = AttackWithPlayer();
    _playerDashTravelRemaining = travelSeconds;
    _playerAttackTimer = PacingMath.Max(dt, _scenario.Build.DashCooldownSeconds + travelSeconds);
}

TrySpawnNextBoss();
UpdateAutoLevel(dt);`
    },
    damage: {
      label: "PacingRunSimulator.cs · ApplyDamage — 유효 피해의 절단",
      intro: "그림 왼쪽의 «버려지는 초과분»이 첫 줄입니다. 남은 HP와 피해의 최솟값만 유효 피해로 셉니다.",
      code: `float effective = PacingMath.Min(damage, monster.Hp);
bool isBoss = monster.Data.IsBoss;
monster.Hp = PacingMath.Max(0f, monster.Hp - damage);

// … 발췌 사이의 공격 유형별 집계 생략 …
if (ledgerSource != null)
{
    SourceMonsterRunAggregate cross =
        GetSourceMonsterAggregate(ledgerSource, monster.Data.Id, isBoss);
    cross.HitCount++;
    cross.Damage += damage;
    cross.EffectiveDamage += effective;
    (int, string) perMonsterKey = (_level, ledgerSource);
    monster.SourceEffective.TryGetValue(perMonsterKey, out double soFar);
    monster.SourceEffective[perMonsterKey] = soFar + effective;
}`
    },
    ledger: {
      label: "PacingRunSimulator.cs · FlushMonsterLedger — 처치 여부에 따른 두 원장",
      intro: "그림 오른쪽의 두 갈래입니다. 처치하지 못했으면 보류로 빠지고, 처치했을 때만 유효 피해 비율로 배분합니다.",
      code: `if (!killed) { cross.PendingEffectiveDamage += pair.Value; continue; }
cross.KilledEffectiveDamage += pair.Value;
if (total <= 0d) continue;
double share = pair.Value / total;
cross.AllocatedScore += score * share;
cross.AllocatedGold += gold * share;`
    },
    dash: {
      label: "PacingRunSimulator.cs · AttackWithPlayer — 돌진 경로 판정",
      intro: "«관통» 열의 판정 기준입니다. 몬스터가 경로 선분에서 반경 안에 있는지를 봅니다.",
      code: `float hitRadius = radius + monster.Data.Radius;
if (DistancePointToSegmentSquared(monster.Position, start, end)
    > hitRadius * hitRadius) continue;
ApplyDamage(monster, dashDamage, false, null, GameIds.DamageSource.PlayerDash);`
    },
    chain: {
      label: "PacingRunSimulator.cs · FindNextChainTarget — 다음 연쇄 대상",
      intro: "«연쇄» 열의 판정 기준입니다. 이미 맞힌 대상을 제외하고 사거리 안에서 다음 대상을 찾습니다.",
      code: `MonsterState candidate = _monsters[i];
if (!candidate.IsAlive || excluded.Contains(candidate)) continue;
float squared = (candidate.Position - origin).sqrMagnitude;
if (squared > rangeSquared) continue;`
    },
    guards: {
      label: "Program.cs · Run — 요청 검사와 시나리오 읽기",
      intro: "경계 상자의 입구입니다. 키·허용 축·중복을 먼저 검사하고 나서야 시나리오를 읽습니다.",
      code: `StrictKeys.Check(commandJson);
var command = PacingJson.Read<PacingCliCommand>(commandJson);
Guards.Check(command);

string scenarioJson = File.ReadAllText(command.ScenarioPath);
var export = PacingJson.Read<PacingScenarioExport>(scenarioJson);`
    },
    override: {
      label: "Program.cs · Run — 식별자 검사 후 메모리에서만 적용",
      intro: "«원본 자산은 그대로»가 여기입니다. 없는 식별자를 거부한 뒤, 읽어 온 데이터에만 변경값을 얹습니다.",
      code: `Guards.CheckAgainstScenario(command, export.Database!, export.Table);

// 지문의 «출발점» 은 오버라이드 적용 전 값이어야 한다. 적용 후를 찍으면
// 대장에서 «어느 baseline 에서 출발했나» 를 복원할 수 없다.
string themeKnobBase = ThemeKnobDigest(export.Table);
string scenarioSha = Sha1(scenarioJson);

// ⚠️ 명령이 같으면 상태도 같아야 한다. describe/scenario 가 오버라이드를 건너뛰면
//    «오버라이드 넣고 확인» 이라는 가장 자연스러운 사용이 조용히 원본을 돌려준다.
ApplyOverrides(command, export.Database!, export.Table);`
    },
    campaign: {
      label: "PacingCampaignRunner.cs · 런이 끝난 뒤의 구매",
      intro: "런 경계를 넘는 쪽입니다. 살 수 있는 만큼 사고, 하나라도 샀으면 빌드가 바뀌었다고 표시합니다.",
      code: `PacingPurchaseBatch batch = PacingCheapestPurchasePolicy.BuyWhileAffordable(
    scenario, database, state, runNumber, request.MaxPurchasesPerRun, request.IsSkillVisible);
result.Purchases.AddRange(batch.Records);
if (batch.Records.Count > 0) buildDirty = true;`
    },
    rebuild: {
      label: "PacingCampaignRunner.cs · 다음 런의 전투 설정 재조립",
      intro: "구매로 빌드가 바뀌면 다음 런의 시나리오를 다시 만듭니다. §01에서 골드 레인이 경계를 넘던 그 지점입니다.",
      code: `if (buildDirty)
{
    scenario = scenarioProvider(state.SkillLevelById);
    buildDirty = false;
}`
    }
  },

  // ── 스크린샷 ──────────────────────────────────────────────────
  evidence: {
    zoom: "화면 확대 · 세부 글자 읽기",
    close: "닫기",
    pan: "원본 크기입니다. 화면을 가로·세로로 이동해 세부 항목을 읽을 수 있습니다.",
    boundary: "개발 중인 도구의 실제 화면입니다. 강제 클리어가 포함된 실행이라 수치는 관찰 기능의 예시이며, 자연 완주나 개선 성과로 해석하지 않습니다.",
    contribution: {
      image: "contribution.png",
      title: "어느 공격이 맡고 있는가",
      alt: "공격원별 피해 점유율과 구매 목록을 보여주는 시뮬레이터 화면",
      caption: "공격원별 피해 점유율입니다. 피해 비중은 그 공격을 빼면 어떻게 되는가의 답이 아닙니다."
    },
    grid: {
      image: "overview-grid.png",
      title: "레벨별 진입과 첫 처치 기록",
      alt: "스테이지와 레벨 격자 및 선택한 Stage03 Level 2의 최초 진입과 첫 처치 상세",
      caption: "왼쪽 그림의 네 사건을 도구가 실제로 이렇게 기록합니다. 설정 스펙과 실제 관측을 구분해 표시합니다.",
      crops: [
        { label: "스테이지 · 레벨별 최초 진입", x: 0, y: 650, w: 720, h: 470, full: 2540 },
        { label: "선택한 셀의 첫 처치 상세", x: 760, y: 650, w: 900, h: 470, full: 2540 }
      ]
    },
    pace: {
      image: "pace.png",
      title: "이전 구간은 빨라졌는가",
      alt: "레벨별 재통과 시간을 보여주는 시뮬레이터 화면",
      caption: "레벨별 재통과 시간입니다. 같은 구간을 다시 지나는 데 걸린 시간을 레벨마다 따로 봅니다.",
      crop: { x: 0, y: 300, w: 2540, h: 780, full: 2540 }
    },
    editor: {
      image: "editor.png",
      title: "실험 후보를 만드는 편집 환경",
      alt: "스킬 노드와 효과 값을 편집하는 시뮬레이터 화면",
      caption: "노드와 효과 값의 편집 화면입니다. 편집 버퍼의 값은 저장 전 결과에 자동으로 반영되지 않습니다.",
      crop: { x: 0, y: 300, w: 2540, h: 900, full: 2540 }
    },
    timeline: {
      image: "overview-timeline.png",
      title: "CLI가 낸 결과를 사람이 읽는 자리",
      alt: "진행도, 누적 골드, 종료 스태미나를 런 번호에 맞춰 보여주는 시뮬레이터 개요 화면",
      caption: "세 그래프의 가로축은 런 번호입니다. 같은 구간에서 진행과 수입, 남은 스태미나를 나란히 읽습니다.",
      crop: { x: 0, y: 390, w: 2540, h: 790, full: 2540 }
    },
    apply: {
      image: "apply.png",
      title: "사본과 원본의 차이를 확인한 뒤 반영",
      alt: "사본과 원본 자산의 차이를 비교하는 반영 화면",
      caption: "캡처는 차이가 없는 상태입니다. 특정 변경을 적용했다는 증거가 아닙니다."
    }
  },

  // ── 표지 ──────────────────────────────────────────────────────
  // 덱 슬라이드 · 랜딩 카드 · 이 페이지 히어로가 같은 것을 쓴다(cover.jsx).
  // 크기 규칙은 src/styles/cover.css 머리 주석이 원본이다.
  cover: {
    eyebrow: "진행 템포 · 밸런스 모델과 실험 도구",
    title: "Motelet",
    period: "2026.05 - 현재",
    lede: "한 번의 전투에서 얻은 보상으로 능력을 사고, 성장한 상태로 다시 도전하는 인크레멘탈 게임입니다. **주관이던 «성장 체감»을 자산에 적힌 값에서 읽어낸 정의로 바꾸고, 그 판단을 반복할 수 있는 계산 코어와 CLI까지 만들었습니다.**",
    roleLabel: "PM 겸 배틀씬 프로그래머",
    role: " — 이 페이지가 다루는 것은 **밸런스 모델과 실험 도구**입니다.",
    boundary: "스킬트리 데이터 · DB는 팀원 작업입니다. 구현의 상당 부분과 검토에 AI를 활용했습니다.",
    tags: [
      { text: "2026.05 - 현재" },
      { text: "판정 모델", tone: "sage" },
      { text: "런 시뮬레이터", tone: "sage" },
      { text: "공유 코어 · CLI", tone: "sage" },
      { text: "Unity 6.0 · C# 10" },
      { text: "UniTask · DOTween" }
    ],
    specs: [
      "**판정 모델** — 역할·타격 수·공간·조정 변수의 책임을 정의",
      "**런 시뮬레이터** — 고정 틱 상태 갱신과 구매를 잇는 캠페인 계산",
      "**공유 코어 · CLI** — 사본 없이 원본 소스를 컴파일해 에디터 밖에서 반복 실행"
    ],
    ai: "확인된 것은 모델 · 실험 도구 · 기준 보완입니다. 실제 재미와 출시 성과는 별도의 검증 대상입니다.",
    links: [
      { label: "Steam", v: "Motelet (개발 중)", href: "https://store.steampowered.com/app/4850970/Motelet/", tone: "blue" }
    ],
    caption: "개발 중 전투 화면입니다. 골드는 구매에, 처치 점수는 레벨 진행에 쓰입니다."
  },

  // 표지가 쓰는 값
  loop: {
    image: "progression-pacing/assets/gameplay.png",
    alt: "로봇 청소기 플레이어와 몬스터, 상단 스태미나가 보이는 개발 중 전투 화면"
  }
};
