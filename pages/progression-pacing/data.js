// pages/progression-pacing/data.js
//
// 이 페이지의 최종 공개 문안은 전부 여기 있다. JSX 안에 문장을 박지 않는다.
//
// ⚠️ 사실을 만들지 않는다. 원천 = knowledge_base/projects/cursorblade/research/claims.yaml
//    전달 계약 = _portfolio_site/motelet/progression-pacing-design.md
//
// 표시 라벨(`40만`)과 원시값(`400000`)은 **쌍으로** 둔다.
// 좌표 계산은 raw, 화면 문자열은 label — JSX 에서 문자열끼리 더해 좌표가 날아가는 것을 막는다.
//
// ── 2026-09-06 5절 재구성 ────────────────────────────────────────
//   01 워크플로우 → 02 결과 → 03 밸런싱 목표 → 04 시뮬레이션 설계 → 05 확인된 범위
//   앞의 두 절이 «무엇을 어떻게 했고 무엇이 나왔는지» 를 먼저 끝낸다.
//   목표·모델·도구 설명은 그 뒤에 온다.

window.PACING_DATA = {
  meta: {
    title: "Motelet — 성장 리듬의 설계 · JCH Portfolio",
    brand: "JCH / PORTFOLIO",
    crumb: "projects / motelet",
    navLabel: "본문 목차",
    footer: "Motelet · 진행 템포 모델과 실험 도구",
    back: "처음으로",
    railGroups: [
      { label: "PROCESS", ids: ["workflow", "results"] },
      { label: "DESIGN", ids: ["goal"] },
      { label: "BUILD", ids: ["simulation", "outcome"] }
    ],
    nav: [
      ["workflow", "WORKFLOW"],
      ["results", "RESULT"],
      ["goal", "GOAL"],
      ["simulation", "SIMULATION"]
    ]
  },

  // 히어로 직후 한 줄 — 역할과 AI 활용 범위를 절에 들어가기 전에 못박는다
  scope: {
    role: "문제 해석 · 판단 기준 · 실험 방식 구성 / 구현과 후보 탐색에 AI 활용"
  },

  // ── S01 워크플로우 ────────────────────────────────────────────
  // 한 장으로 전체가 읽혀야 한다: 게임 자산을 읽어 → CLI 가 값 후보를 반복 계산하고
  // → 에디터에서 사람이 관찰·플레이로 확인한 뒤 → 원본 자산에 반영한다.
  flow: {
    title: "밸런싱 한 바퀴 — 자동으로 돌리는 구간과 사람이 판단하는 구간",
    assetLabel: "밸런스 대상 — 게임 자산",
    asset: "Stage 자산 · 스킬 노드 — HP · 보상 · 요구 점수 · 출현 구성 · 가격",
    readLabel: "① 읽는다",
    readNote: "에디터가 시나리오 사본으로 내보낸다",
    applyLabel: "⑤ 반영한다",
    applyNote: "사람이 확정한 값만 원본에 쓴다",
    lanes: [
      {
        id: "cli",
        label: "CLI — 자동 반복",
        actor: "AI 요청 · 무인 실행",
        steps: [
          { t: "② 값 후보 요청", d: "AI가 바꿀 값을 JSON으로 적어 보낸다" },
          { t: "③ 캠페인 반복 계산", d: "구매를 이어 여러 런을 돌려 결과 JSON을 낸다" }
        ]
      },
      {
        id: "human",
        label: "에디터 도구 — 사람이 판단",
        actor: "관찰 · 편집 · 플레이",
        steps: [
          { t: "④ 결과 관찰과 검토", d: "진행도 페이스와 공격별 기여를 화면에서 읽는다" },
          { t: "④′ 편집과 플레이 확인", d: "노드를 고치고 실제로 플레이해 체감을 본다" }
        ]
      }
    ],
    linkOut: "결과 JSON",
    linkBack: "다음 후보 조건",
    sameSource: "두 갈래 모두 같은 원본 계산 소스를 컴파일한다",
    caption: "밸런싱 작업의 실제 순서다. 자동 반복이 후보를 만들고, 채택과 마무리는 사람이 한다.",
    splitTitle: "무엇을 자동으로 돌리고 무엇을 사람이 정했는가",
    split: [
      { k: "사람", t: "목표와 판정 조건", d: "무엇을 성장이라 부를지, 어떤 축으로 후보를 고를지 직접 정했다.", tone: "mine" },
      { k: "자동", t: "값 후보의 반복 탐색", d: "CLI가 같은 계산으로 캠페인을 반복하고, 구현의 상당 부분과 후보 탐색에 AI를 활용했다.", tone: "auto" },
      { k: "사람", t: "채택과 마무리", d: "도구가 낸 값을 그대로 쓰지 않고 손으로 조정해 빌드에 반영했다.", tone: "mine" }
    ]
  },

  // ── S02 결과 ──────────────────────────────────────────────────
  results: {
    intro: "밸런싱을 위해 만든 도구의 실제 화면이다. 관찰 항목마다 화면을 따로 뒀다.",
    boundary: "밸런싱 작업에 실제로 쓴 도구 화면이다. 강제 클리어가 포함된 실행이라 화면의 수치는 관찰 기능의 예시이며, 자연 완주나 개선 성과로 해석하지 않는다.",
    order: ["timeline", "grid", "pace", "contribution", "editor", "apply"]
  },

  // ── S03 밸런싱 목표 ───────────────────────────────────────────
  // 3단은 원문 박자를 압축한 «읽기» 다. 박자는 원문대로 두고 3단은 묶음으로만 쓴다.
  goal: {
    headline: "완만 성장 → 폭발 성장 → 저항, 그리고 다시 완만 성장",
    figTitle: "한 스테이지 안에서 반복되는 성장 주기",
    repeat: "한 스테이지 안에서 여러 번 반복",
    cycle: [
      {
        id: "slow", name: "완만 성장",
        d: "성장이 완만해지고 다음 레벨에 일부 진입한다.",
        beats: ["완만한 성장", "다음 레벨 일부 진입"]
      },
      {
        id: "fast", name: "폭발 성장",
        d: "상위 적을 처음 돌파하고, 능력 강화로 이전 구간을 빠르게 통과한다.",
        beats: ["처형 첫 돌파 · 능력 강화 · 이전 구간 압축", "정착 · 하위 압축 · 밀도와 지속 보강"]
      },
      {
        id: "resist", name: "저항",
        d: "새 레벨의 적을 아직 안정적으로 잡지 못한다.",
        beats: ["새 레벨의 저항", "첫 진입 · 불안정한 사냥"]
      }
    ],
    beatSources: ["경험", "관찰"],
    sourceNote: "설계 문서 두 개가 같은 주기를 각각 적고 있다. 이 세 구간이 한 스테이지 안에서 여러 번 반복되는 것이 목표였다.",
    noveltyTitle: "반복이 지겨워지지 않게 하는 장치",
    novelty: "성장 구간마다 **주로 활약하는 공격이 달라지는 경험**을 목표로 삼았다. 특정 공격의 강화가 없는 구간도 다른 공격이 활약할 기회로 보았다.",
    badgeLabels: { resist: "저항", fast: "폭발 성장", slow: "완만 성장", novelty: "새로움" },
    badgeLegend: "이 절이 다루는 주기 구간",
    mine: "이 목표를 기준으로 전투·보상·구매의 관계를 나누고, 반복 전투에서 비교할 항목을 정했다."
  },

  // 여러 조건을 하나의 관찰 축으로 모은 자리
  progress: {
    title: "따로 움직이는 조건을 하나의 축으로 모은다",
    inputsLabel: "각각 다르게 움직이는 조건",
    inputs: [
      { t: "등장 몬스터 수", d: "스폰 주기와 출현 구성" },
      { t: "몬스터 체력", d: "티어별 HP 사다리" },
      { t: "공격 피해량", d: "구매 능력과 적중 대상 수" },
      { t: "레벨 요구 점수", d: "구간에 머무는 시간" }
    ],
    mergeLabel: "하나의 관찰 축",
    axisTitle: "진행도",
    axisFormula: "진행도 = (레벨 − 1) + 처치 점수 ÷ 요구 점수",
    axisNote: "레벨과 요구 점수 충족 비율을 이어 붙인 값이다. 같은 진행 위치끼리 비교하기 위한 축이며 시간이 아니다.",
    eventsLabel: "같은 축 위에서 네 사건을 따로 기록한다",
    events: [
      { mark: "circle", name: "최초 진입", q: "새 저항에 언제 닿았는가" },
      { mark: "diamond", name: "상위 몬스터 첫 처치", q: "더 큰 보상을 언제 처음 얻었는가" },
      { mark: "triangle", name: "런당 골드 변화", q: "반복 전투의 수입이 어떻게 달라졌는가" },
      { mark: "square", name: "재통과 잔여 스태미나", q: "이전 구간을 지난 뒤 활동 여유가 남는가" }
    ],
    missing: "관측 없음 — 0으로 채우지 않는다",
    caption: "진입·첫 처치·수입·재통과를 구분하는 관찰 설계다. 마커 위치는 특정 실행의 측정값이 아니다. 보스는 HP와 시간을 별도 축으로 본다."
  },

  labels: {
    problem: "문제",
    concern: "우려",
    decision: "결정",
    evidence: "근거",
    tradeoff: "트레이드오프"
  },

  // ── 절 ────────────────────────────────────────────────────────
  // 5절 전부 같은 슬롯을 쓴다: 제목 → lead → 주 시각자료 → 판단(prd) → 보조 → 코드 → next
  // lead 와 prd 가 비어 있는 절을 만들지 않는다.
  sections: [
    {
      id: "workflow",
      nav: "01 · 워크플로우",
      kind: "WORKFLOW",
      title: "워크플로우 — 자동 반복과 사람의 판단",
      goals: [],
      lead: "게임 자산을 시나리오로 내보내고, **CLI가 AI 요청을 받아 같은 계산으로 후보를 반복 실행하고**, 그 결과를 **에디터에서 사람이 관찰하고 플레이로 확인한 뒤** 원본 자산에 반영한다. 이 한 바퀴가 작업의 단위였다.",
      prd: [
        {
          kind: "problem",
          label: "문제",
          text: "성장 체감은 사람마다 다르게 말하는 대상이라 «이번 조정이 나아졌는가»를 같은 기준으로 비교하기 어렵다. 판단 기준을 먼저 정하고, 그 기준으로 여러 후보를 반복해 볼 수 있어야 했다."
        },
        {
          kind: "decision",
          label: "결정",
          text: "**자동으로 돌릴 구간과 사람이 판단할 구간을 나눴다.** 값 후보의 탐색과 반복 계산은 CLI가 맡고, 목표·판정 조건·최종 값은 사람이 정한다. 구조를 바꾸는 편집도 사람이 에디터에서 한다."
        },
        {
          kind: "tradeoff",
          label: "트레이드오프",
          text: "도구는 후보를 좁히는 데까지만 쓴다. 결과 판정과 실제 재미 확인은 사람과 플레이의 몫이며, 요청 형식 검사가 밸런스의 적정성을 보증하지는 않는다."
        }
      ],
      next: "그래서 무엇이 만들어졌는가?"
    },
    {
      id: "results",
      nav: "02 · 결과",
      kind: "TOOL SCREENS",
      title: "결과 — 실제 도구 화면",
      goals: [],
      lead: "런 전체의 흐름, 레벨별 최초 진입과 첫 처치, 재통과 시간, 공격원별 기여, 노드 편집, 원본 반영 — **판단에 필요한 관찰 항목마다 화면을 따로 만들었다.**",
      prd: [
        {
          kind: "decision",
          label: "결정",
          text: "화면을 **판단하는 순서대로** 나눴다. 런 전체의 흐름에서 시작해 레벨 격자로 문제 구간을 좁히고, 그 구간의 공격별 기여를 확인한 뒤, 편집과 반영으로 돌아온다."
        },
        {
          kind: "tradeoff",
          label: "트레이드오프",
          text: "화면의 수치는 **관찰 기능을 설명하기 위한 예시**다. 강제 클리어가 포함된 실행이므로 자연 완주나 개선 성과로 인용하지 않는다."
        }
      ],
      next: "이 화면들은 무엇을 판단하려고 만든 것인가?"
    },
    {
      id: "goal",
      nav: "03 · 밸런싱 목표",
      kind: "BALANCE GOAL",
      title: "밸런싱 목표 — 반복되는 성장 주기",
      goals: ["slow", "fast", "resist", "novelty"],
      lead: "**완만 성장 → 폭발 성장 → 저항**이 한 스테이지 안에서 여러 번 반복되게 하는 것이 목표였다. 따로 움직이는 조건들을 **진행도** 하나로 모아 같은 진행 위치끼리 비교했다.",
      prd: [
        {
          kind: "decision",
          label: "결정",
          text: "등장 몬스터 수, 몬스터 체력, 공격 피해량, 요구 점수는 각각 다르게 움직인다. 이것들을 **진행도 = (레벨 − 1) + 처치 점수 ÷ 요구 점수** 하나로 모아, 같은 진행 위치에서 최초 진입·첫 처치·런당 골드·재통과를 **네 사건으로 나눠** 기록했다. 관측이 없는 구간은 0으로 채우지 않는다."
        },
        {
          kind: "decision",
          label: "결정",
          text: "공격을 다 같이 강하게 만들지 않고 **두 용도로 갈랐다.** 낮은 빈도로 한 번에 크게 넣는 **처형**이 현재 최상위 적의 첫 돌파를 맡고, 높은 빈도로 여러 대상을 맞히는 **압축**이 성장 뒤 이전 구간의 재통과를 맡는다. 목표 타격 수와 HP의 조정 범위도 이 구분 위에서 정했다."
        },
        {
          kind: "evidence",
          label: "근거",
          text: "**어느 계열에 그 구간의 성장 노드가 없는 것도 수단으로 뒀다.** 그 자리는 다른 계열에 존재감을 넘기는 구간이며, 성장 노드는 타격 수·재통과 속도·활동 시간·화면 생존 수·크기비·구매 순서·보스 시도당 HP 감소량 중 하나 이상의 관찰 항목을 바꿔야 한다는 기준을 뒀다."
        },
        {
          kind: "tradeoff",
          label: "트레이드오프",
          text: "사다리의 값은 **설계된 격차의 모양**이지 플레이어가 실제로 번 골드가 아니다. 출현 가중치는 스폰 선택 확률이고, 역할 배분과 1타 목표 범위는 설계 목표이며 특정 구매 시점의 달성값이 아니다. 표의 값이 출시 빌드의 값과 같은지도 확인하지 않았다."
        }
      ],
      next: "이 목표를 무엇으로 계산했는가?"
    },
    {
      id: "simulation",
      nav: "04 · 시뮬레이션 설계",
      kind: "SIMULATION & CLI",
      title: "시뮬레이션 설계 — 툴과 CLI",
      goals: [],
      lead: "평균 초당 피해 대신 **가상의 전장에서 게임 루프를 그대로 돌렸다.** 고정된 시간 간격마다 스폰·이동·공격·적중·처치를 갱신하고, **같은 원본 계산 소스**를 Unity 에디터와 CLI가 함께 쓴다.",
      prd: [
        {
          kind: "problem",
          label: "문제",
          text: "평균값으로 계산하면 두 가지가 사라진다. **초과 피해까지 합산하면 공격별 기여가 과대평가되고**, 밀집도를 하나의 배율로 처리하면 관통과 연쇄의 적중 차이가 사라진다. 남은 HP가 100인 적에게 10,000을 넣어도 실제로 깎인 HP는 100이다."
        },
        {
          kind: "decision",
          label: "결정",
          text: "**전장의 위치 상태를 먼저 만들고 공격마다 다른 기하 조건을 적용했다.** 관통은 경로와 몬스터 반경의 교차, 연쇄는 이미 맞힌 대상을 제외한 사거리 안의 다음 대상, 몸통은 실제 접촉 반경이다. 피해는 원래 피해와 유효 피해로 나눠 기록하고, 처치한 개체의 점수·골드만 유효 피해 비율로 배분한다."
        },
        {
          kind: "decision",
          label: "결정",
          text: "에디터에서 시나리오를 내보내고, **같은 계산 소스**로 전투와 구매를 이어 실행하는 **캠페인**을 반복한다. AI는 JSON 요청으로 후보 값을 전달하고 변경값은 메모리에만 적용된다. **노드 추가·삭제와 선행 연결 변경은 요청 형식에 두지 않았고**, 그 편집은 사람이 에디터에서 사본에만 한 뒤 반영 단계를 거친다."
        },
        {
          kind: "tradeoff",
          label: "트레이드오프",
          text: "에디터 조작 없이 실험할 수 있지만 프로젝트의 Unity 런타임은 필요하다. 보상 배분은 **공격별 기여를 비교하는 분석 지표**이며 실제 지급량을 바꾸거나 «그 공격을 빼면 어떻게 되는가»를 답하지 않는다. 소스 공유만으로 실게임이 완전히 재현되지도 않는다."
        }
      ],
      next: "그래서 어디까지 확인됐는가?"
    },
    {
      id: "outcome",
      nav: "05 · 확인된 범위",
      kind: "SCOPE & CONTRIBUTION",
      title: "확인된 범위 — 어디까지 갔는가",
      goals: [],
      lead: "목표와 판정 조건을 직접 정하고 후보를 탐색했다. 선정한 후보의 **HP와 요구 점수를 추가 조정해 2026-09-04 출시 빌드에 반영했다.** 출시 이후의 플레이 결과로 체감을 검증하는 일은 남아 있다.",
      prd: [
        {
          kind: "evidence",
          label: "근거",
          text: "후보 선정 후 **두 차례 추가 조정**했다. HP와 요구 점수는 후보 보고서의 값과 다르며, 자산 변경 커밋에 이 과정이 남아 있다. 그 커밋 두 건은 **2026-09-04 출시 버전(1.2) 커밋의 조상**이다."
        },
        {
          kind: "decision",
          label: "결정",
          text: "실제 플레이로 확인하기 전에는 체감과 선택 수렴을 확정하지 않는다는 조건을 **착수 시점에** 세웠다. 후보 단계의 측정치는 현재 빌드의 성과로 사용하지 않는다."
        },
        {
          kind: "tradeoff",
          label: "트레이드오프",
          text: "**시나리오 데이터에서 실험 · 자산 반영 · 출시 빌드 반영 · 실플레이 체감 검증**을 구분했다. 적용은 출시 빌드까지 갔고, 출시 이후의 플레이 결과로 체감을 검증한 기록은 아직 없다."
        }
      ],
      next: null
    }
  ],

  // ── S03 사다리 데이터 ─────────────────────────────────────────
  // 원천: Stage03.asset (_monsters · _levels), 2026-09-06 확인. Claim MT-PACING-LADDER-001
  // 남은 소비자는 F02 하나다 — 티어·레벨 표와 겹침 행렬은 2026-09-06 편집에서 뺐다.
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
    ladderTitle: "레벨이 오를수록 체력과 보상이 급수적으로 커진다",
    panelTop: "↑ 절대값 (로그)",
    gap: "HP는 250배, 기본 골드는 50배 — 체력이 보상보다 빠르게 오른다.",
    caption: "2026-09-06 확인한 Stage03 자산 설정값이다. 보유 효과를 적용하기 전 기본값이며, 출시 빌드의 값과 같은지는 확인하지 않았다. 로그 눈금 한 칸은 100배 차이를 나타낸다."
  },

  // ── S03 조정 기준 ─────────────────────────────────────────────
  // 같은 공격을 다 강하게 만들지 않고 «두 용도» 로 갈라 개성을 줬다.
  roles: {
    title: "공격을 두 용도로 나눠 개성을 줬다",
    axisLeft: "한 번에 크게",
    axisRight: "자주 · 여러 대상에",
    cards: [
      {
        id: "exec", name: "처형",
        freq: "낮은 발동 빈도 · 한 번의 피해가 크다",
        job: "현재 최상위 적의 첫 돌파",
        target: "N — 현재 최상위 티어",
        attack: "처형 계열",
        note: "일반 타격과 치명타의 필요 타격 수를 나눠 보고, 발동 빈도와 실제 적중 조건을 함께 판단한다."
      },
      {
        id: "sweep", name: "압축",
        freq: "높은 발동 빈도 · 한 번에 여러 대상",
        job: "성장 뒤 이전 구간의 빠른 재통과",
        target: "N−1 · N−2 — 한 단계와 두 단계 아래 티어",
        attack: "연쇄번개 · 낙뢰",
        note: "빈도와 한 번에 맞히는 대상 수로 다수 처치와 골드 압축을 맡는다."
      }
    ],
    bandLabel: "연쇄번개 · 낙뢰 — 현재 최상위 일반 몬스터 대상 일반 1타 설계 목표",
    bandValue: "HP의 2~5%",
    bandNote: "설계 목표이며 특정 구매 시점의 달성값이 아니다.",
    caption: "모델에 정의한 역할 배분이다. 주요 담당을 나타내며 다른 티어에도 피해를 줄 수 있고, 발동 빈도만으로 돌파가 보장되지도 않는다.",
    emptyTitle: "빈칸도 수단이다",
    empty: "어느 계열에 그 구간의 성장 노드가 없는 것은 누락이 아니라 **다른 계열에 존재감을 넘기는 수단**으로 정의했다. 성장 노드는 타격 수, 재통과 속도, 활동 시간, 화면 생존 수, 크기비, 구매 순서, 보스 시도당 HP 감소량 중 하나 이상의 관찰 항목을 바꿔야 한다는 기준을 뒀다."
  },
  equation: {
    label: "정적 비교용 선택 식",
    formula: "C = f × E[U] × E[B]",
    terms: [
      ["f", "초당 발동 횟수"],
      ["E[U]", "한 번에 맞히는 서로 다른 몬스터 수"],
      ["E[B]", "피해의 처치 환산량"]
    ],
    note: "처형은 f가 낮고 E[B]가 크며, 압축은 f와 E[U]가 크다. 실제 처치 수나 처치 시간과 같지 않고, E[U]에 든 대상 수를 다시 곱하지 않는다."
  },
  htk: {
    label: "판단 기준",
    formula: "처치 타격 수 = ceil(HP ÷ 1회 피해)",
    note: "ceil은 올림이다. 일반과 치명타를 나누고, 발동 빈도와 실제 적중도 함께 본다."
  },
  adjust: {
    title: "관찰한 증상에 따라 달라지는 조정 방향",
    headers: ["관찰한 증상", "검토할 수단과 그 이유"],
    rows: [
      ["피해를 더 줘도 타격 수가 줄지 않을 때", "발동 빈도 · 고유 적중 수 · 공간 배치를 본다. 피해와 실제 처치 기회를 분리하기 위해서이다."],
      ["빈 화면과 다음 몬스터 등장 대기가 문제일 때", "스폰 수 · 주기 · 가중치 · 개수와 점유 제한을 본다. 낮은 생존 수만으로 스폰 병목을 확정하지 않는다."],
      ["전투 역할은 맞지만 레벨을 너무 빨리 통과할 때", "레벨의 요구 점수를 먼저 본다. HP로 전투 역할을 바꾸기 전에 체류 조건을 분리한다."],
      ["다음 저항 전에 필요한 강화를 사지 못할 때", "가격 · 해금 · 누적 구매 순서를 본다. 강화의 최종값뿐 아니라 도달하는 시점이 중요하다."]
    ]
  },

  // ── S04 시뮬레이션 구조 ───────────────────────────────────────
  // 탑다운: ① 가상 전장에서 게임 루프를 그대로 돌린다 → ② 그 루프가 평균값 모델과
  // 다른 네 지점 → ③ 코드 → ④ 도구 배치와 요청 경계.
  sim: {
    title: "가상의 전장에서 게임 루프를 그대로 돌린다",
    dt: "dt (고정)",
    stepLabel: "한 틱에서 벌어지는 일",
    steps: [
      "스태미나 소모",
      "이동 · 필드 · 효과 · 분신",
      "스폰",
      "플레이어 공격과 적중 판정",
      "처치 · 골드 · 처치 점수",
      "자동 레벨 전환 검사"
    ],
    levelSwitch: "레벨 전환 — 전장을 비우고 초기 스폰을 다시 실행",
    axesLabel: "틱마다 함께 들고 가는 세 축",
    axes: [
      { id: "player", t: "플레이어", d: "위치와 돌진 경로 · 공격 주기 · 스태미나 잔량" },
      { id: "monster", t: "몬스터", d: "스폰과 위치 · 남은 HP · 접촉 반경" },
      { id: "skill", t: "스킬", d: "발동 주기 · 사거리 · 관통 경로 · 연쇄 대상" }
    ],
    energyNote: "스태미나는 세 번째 공격 역할이 아니라 **역할을 수행할 활동 조건**이다. 이전 구간에서 소모하고, 새 레벨 진입 시 잔여량으로 시작하며, 조건부로만 회복한다.",
    caption: "계산 모델의 상태 갱신 순서와 상태 축이다. Unity 런타임의 모든 물리 현상을 재현하거나 실제 플레이 시간을 예측하는 모델은 아니다."
  },
  features: {
    title: "평균 초당 피해로 계산하지 않은 네 지점",
    items: [
      { icon: "◎", t: "공간을 그대로 둔다", d: "공격마다 적중 조건이 달라 같은 배치에서도 맞는 마릿수가 갈린다." },
      { icon: "▤", t: "유효 피해를 나눈다", d: "남은 HP를 넘긴 초과분은 공격별 기여에서 뺀다." },
      { icon: "↻", t: "런을 이어 붙인다", d: "런이 끝나면 구매하고, 구매가 있으면 다음 런의 전투 설정을 다시 조립한다." },
      { icon: "≡", t: "같은 계산 소스", d: "에디터와 CLI가 사본 없이 원본 소스를 그대로 컴파일한다." }
    ]
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
    caption: "공격별 기여를 비교하기 위한 배분이다. 실제 보상 지급량을 바꾸거나 특정 공격을 제거했을 때의 결과를 나타내지는 않는다."
  },
  f06: {
    title: "같은 배치 · 같은 마릿수 — 공격에 따라 갈리는 적중",
    cols: [
      { id: "linear", name: "직선 관통", cond: "경로와의 교차", hit: "6마리" },
      { id: "chain", name: "연쇄", cond: "사거리 안의 서로 다른 대상", hit: "3마리" },
      { id: "contact", name: "몸통 접촉", cond: "실제 접촉 반경", hit: "1마리" }
    ],
    excluded: "✓ 제외",
    offPath: "같은 군집이라도 관통 경로를 벗어나면 관통 적중은 0이 될 수 있다. 그래서 모든 공격에 하나의 밀도 배율을 적용할 수 없었다.",
    caption: "관통은 대상 수 제한 없음, 연쇄는 최대 3마리와 모든 대상 도달 가능을 가정한 설명용 배치다. 실제 설정이나 측정값이 아니다."
  },

  // ── S04 도구 배치와 요청 경계 ─────────────────────────────────
  // ⚠️ 2026-09-06 정정: 이전 판은 «노드 추가·삭제·선행 연결 변경은 표현 자체가 불가능»
  //    이라고만 적어 도구 전체가 못 하는 것처럼 읽혔다. 못 하는 것은 **AI가 보내는 CLI 요청**
  //    이고, 사람이 쓰는 에디터는 노드 추가·삭제와 선행 연결 변경까지 한다.
  f11: {
    title: "무엇을 함께 읽고, 무엇을 요청으로 받지 않는가",
    sourceNode: "Assets/*.cs · 계산 소스",
    sourceNote: "사본을 만들지 않는다",
    consumers: ["Unity 에디터", "CLI"],
    runtimeNote: "ProjectVersion.txt → 프로젝트 버전의 Unity Mono",
    cliNode: "CLI",
    cliNote: "진입점 하나",
    inputs: [
      { id: "scenario", label: "시나리오 JSON", from: "에디터에서 내보냄" },
      { id: "request", label: "요청 JSON", from: "AI" }
    ],
    output: "결과 JSON (표준출력)",
    outputNote: "보고에는 이름 대신 id",
    matrix: {
      title: "무엇을 누가 바꿀 수 있는가",
      cols: ["사람 — 에디터", "AI — CLI 요청"],
      rows: [
        { k: "기존 항목의 값 변경", human: true, ai: true },
        { k: "노드 추가 · 삭제", human: true, ai: false },
        { k: "선행 연결 변경", human: true, ai: false }
      ],
      writeLabel: "쓰는 대상",
      writes: [
        "사본 폴더 — 반영할 때 원본에 만들고 선행 참조를 다시 잇는다",
        "메모리에서만 — 원본 자산은 그대로"
      ],
      note: "없는 항목을 지정한 요청도 거부한다. 요청 형식 검사는 허용한 변경만 받기 위한 장치이며 밸런스의 적정성을 보증하지 않는다."
    },
    caption: "Unity 에디터와 CLI는 계산 소스를 공유한다. 구조를 바꾸는 편집은 사람이 에디터에서 하고, AI 요청은 값 변경만 표현할 수 있다."
  },
  decisions: {
    title: "구조를 이렇게 정한 이유",
    headers: ["결정", "이유"],
    rows: [
      ["CLI와 Unity 에디터가 원본 계산 소스를 공유한다", "계산 코드의 사본을 따로 관리하면서 생길 차이를 방지한다. UnityEngine 의존 부분은 예외다."],
      ["프로젝트 버전의 Unity Mono로 실행한다", "시스템 .NET과 Unity의 부동소수점 처리 차이를 피한다. Unity 버전 변경에 맞춰 실행 환경도 바뀌도록 프로젝트 설정에서 버전을 읽는다."],
      ["JSON 요청과 결과를 단일 진입점에서 처리한다", "진입점마다 요청 검사가 누락되지 않도록 검사 경로를 모은다. 결과는 표준출력으로 반환한다."],
      ["AI 요청은 기존 항목의 값만 바꾸도록 제한한다", "노드 추가·삭제와 선행 연결 변경은 요청 형식에 두지 않았다. 구조를 바꾸는 편집은 사람이 에디터에서 하고 반영 단계를 거친다."],
      ["편집은 사본에만 쓰고 반영은 따로 실행한다", "원본에 바로 쓰지 않으므로 실험 중 자산이 오염되지 않는다. 저장하면 사라질 자산은 삭제하지 않고 프로젝트 밖으로 옮긴다."],
      ["결과에 이름 대신 id를 기록한다", "편집 과정에서 이름이 바뀌어도 같은 대상을 추적할 수 있다."]
    ]
  },

  // ── 코드 발췌 ─────────────────────────────────────────────────
  // 전부 현재 계산 소스의 연속 발췌다. 화면 캡처의 수치를 같은 코드·입력으로
  // 재현했다는 뜻은 아니다. 생략은 `// … 생략 …` 으로 표시하고 동작을 바꾸지 않는다.
  code: {
    sourceNote: "계산 소스 발췌. 화면 캡처의 수치를 재현한 실행 결과는 아니다.",
    tick: {
      label: "PacingRunSimulator.cs · Tick — 한 틱의 갱신 순서",
      intro: "스태미나 소모부터 자동 레벨 전환 검사까지, 한 틱의 갱신 순서를 보여준다.",
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
    dash: {
      label: "PacingRunSimulator.cs · AttackWithPlayer — 돌진 경로 판정",
      intro: "몬스터가 돌진 경로 선분에서 판정 반경 안에 있는지 검사한다.",
      code: `float hitRadius = radius + monster.Data.Radius;
if (DistancePointToSegmentSquared(monster.Position, start, end)
    > hitRadius * hitRadius) continue;
ApplyDamage(monster, dashDamage, false, null, GameIds.DamageSource.PlayerDash);`
    },
    chain: {
      label: "PacingRunSimulator.cs · FindNextChainTarget — 다음 연쇄 대상",
      intro: "이미 맞힌 대상을 제외하고 사거리 안에서 다음 대상을 찾는다.",
      code: `MonsterState candidate = _monsters[i];
if (!candidate.IsAlive || excluded.Contains(candidate)) continue;
float squared = (candidate.Position - origin).sqrMagnitude;
if (squared > rangeSquared) continue;`
    },
    damage: {
      label: "PacingRunSimulator.cs · ApplyDamage — 유효 피해의 절단",
      intro: "남은 HP와 피해의 최솟값을 유효 피해로 기록한다.",
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
      intro: "처치하지 못한 몬스터의 피해는 보류하고, 처치한 경우 유효 피해 비율로 점수와 골드를 배분한다.",
      code: `if (!killed) { cross.PendingEffectiveDamage += pair.Value; continue; }
cross.KilledEffectiveDamage += pair.Value;
if (total <= 0d) continue;
double share = pair.Value / total;
cross.AllocatedScore += score * share;
cross.AllocatedGold += gold * share;`
    },
    campaign: {
      label: "PacingCampaignRunner.cs · 런 종료 후 구매와 다음 런 재조립",
      intro: "런이 끝나면 구매 가능한 능력을 사고, 구매가 있었으면 다음 런의 전투 설정을 다시 구성한다.",
      code: `PacingPurchaseBatch batch = PacingCheapestPurchasePolicy.BuyWhileAffordable(
    scenario, database, state, runNumber, request.MaxPurchasesPerRun, request.IsSkillVisible);
result.Purchases.AddRange(batch.Records);
if (batch.Records.Count > 0) buildDirty = true;

// … 다음 런 시작 지점까지 생략 …
if (buildDirty)
{
    scenario = scenarioProvider(state.SkillLevelById);
    buildDirty = false;
}`
    },
    guards: {
      label: "Program.cs · Run — 요청 검사와 시나리오 읽기",
      intro: "키·허용 항목·중복을 검사한 뒤 시나리오를 읽는다.",
      code: `StrictKeys.Check(commandJson);
var command = PacingJson.Read<PacingCliCommand>(commandJson);
Guards.Check(command);

string scenarioJson = File.ReadAllText(command.ScenarioPath);
var export = PacingJson.Read<PacingScenarioExport>(scenarioJson);`
    },
    override: {
      label: "Program.cs · Run — 식별자 검사 후 메모리에서만 적용",
      intro: "존재하지 않는 식별자를 거부하고, 읽어 온 시나리오 데이터에만 변경값을 적용한다.",
      code: `Guards.CheckAgainstScenario(command, export.Database!, export.Table);

// 지문의 «출발점» 은 오버라이드 적용 전 값이어야 한다. 적용 후를 찍으면
// 대장에서 «어느 baseline 에서 출발했나» 를 복원할 수 없다.
string themeKnobBase = ThemeKnobDigest(export.Table);
string scenarioSha = Sha1(scenarioJson);

// ⚠️ 명령이 같으면 상태도 같아야 한다. describe/scenario 가 오버라이드를 건너뛰면
//    «오버라이드 넣고 확인» 이라는 가장 자연스러운 사용이 조용히 원본을 돌려준다.
ApplyOverrides(command, export.Database!, export.Table);`
    },
    apply: {
      label: "PacingSkillFileSync.cs · CreateMissingOriginals — 사본에서 늘어난 노드를 원본에 만든다",
      intro: "에디터에서 사람이 추가한 노드는 사본에만 있다. 반영할 때 원본 폴더에 만들고, 사본을 가리키던 선행 참조를 원본으로 갈아끼운다.",
      code: `// ── 1패스: 파일만 만든다. CopyAsset 이라 사본의 모든 필드가 그대로 온다
//           (참조는 아직 사본을 가리킨다 — 2패스에서 갈아끼운다).
for (int i = 0; i < rows.Count; i++)
{
    if (!rows[i].IsCopyOnly) continue;
    var copy = AssetDatabase.LoadAssetAtPath<SkillData>(rows[i].AssetPath);
    string destination = AssetDatabase.GenerateUniqueAssetPath(
        $"{originalFolder}/{Path.GetFileName(rows[i].AssetPath)}");
    if (!AssetDatabase.CopyAsset(rows[i].AssetPath, destination)) continue;
    pairs.Add(new KeyValuePair<SkillData, string>(copy, destination));
}

// … 명부 등록 생략 …

// ── 2패스: 사본을 가리키던 참조(선행조건 등)를 원본으로 갈아끼운다.
Dictionary<UnityEngine.Object, UnityEngine.Object> originalByCopy = BuildOriginalByCopy(manifest);
for (int i = 0; i < created.Count; i++) RetargetReferences(created[i], originalByCopy, result);`
    }
  },

  // ── S05 ───────────────────────────────────────────────────────
  reach: {
    title: "실험부터 적용까지의 확인 범위",
    rows: [
      { name: "시나리오 데이터에서 실험", state: "confirmed", note: "모델과 CLI로 후보를 반복 실행하고 판정 조건으로 골랐다." },
      { name: "자산 반영", state: "confirmed", note: "Stage04 자산 변경 커밋 네 건 중 마지막 두 건은 후보 선정 이후의 추가 조정이다." },
      { name: "출시 빌드 반영", state: "confirmed", note: "자산 변경 커밋 두 건이 2026-09-04 출시 버전(1.2) 커밋의 조상이다. 그 값이 출시 빌드에 들어갔다." },
      { name: "실플레이 체감 검증", state: "open", note: "출시 이후의 플레이 결과로 성장 리듬의 체감을 검증한 기록은 아직 없다." }
    ],
    legend: [["confirmed", "확인됨"], ["partial", "경로만 확인"], ["open", "확인 안 됨"]]
  },
  contribution: {
    mineLabel: "직접 담당",
    mine: ["목표와 채택 조건의 작성", "판단 기준의 설정", "실험 방식의 구성", "후보 선택과 최종 마무리"],
    othersLabel: "팀원 기여와 AI 활용 범위",
    others: ["구현의 상당 부분과 후보 탐색에 AI 활용", "스킬트리 데이터 · DB는 팀원 작업"]
  },

  // ── 스크린샷 ──────────────────────────────────────────────────
  // S02 «결과» 가 results.order 순서로 2열에 늘어놓는다.
  evidence: {
    zoom: "화면 확대 · 세부 글자 읽기",
    close: "닫기",
    pan: "원본 크기로 표시한 화면. 가로·세로로 이동해 세부 항목을 확인할 수 있다.",
    boundary: "밸런싱 작업에 실제로 쓴 도구 화면이다. 강제 클리어가 포함된 실행이라 수치는 관찰 기능의 예시이며, 자연 완주나 개선 성과로 해석하지 않는다.",
    timeline: {
      image: "overview-timeline.png",
      title: "런을 이어 붙인 전체 흐름",
      alt: "진행도, 누적 골드, 종료 스태미나를 런 번호에 맞춰 보여주는 시뮬레이터 개요 화면",
      caption: "가로축은 런 번호다. 진행과 수입, 남은 스태미나를 나란히 읽는다.",
      crop: { x: 0, y: 390, w: 2540, h: 790, full: 2540 }
    },
    grid: {
      image: "overview-grid.png",
      title: "레벨별 최초 진입과 첫 처치",
      alt: "스테이지와 레벨 격자 및 선택한 셀의 최초 진입과 첫 처치 상세",
      caption: "칸마다 최초 진입 런과 첫 처치를 따로 기록한다. 설정된 스펙과 관측값을 구분해 표시한다.",
      crop: { x: 0, y: 640, w: 1700, h: 520, full: 2541 }
    },
    pace: {
      image: "pace.png",
      title: "이전 구간의 재통과 시간",
      alt: "레벨별 재통과 시간을 보여주는 시뮬레이터 화면",
      caption: "같은 구간을 다시 지나는 데 걸린 시간을 레벨마다 따로 본다.",
      crop: { x: 0, y: 300, w: 2540, h: 780, full: 2541 }
    },
    contribution: {
      image: "contribution.png",
      title: "공격원별 피해 점유율",
      alt: "공격원별 피해 점유율과 구매 목록을 보여주는 시뮬레이터 화면",
      caption: "어느 공격이 얼마나 맡고 있는지 비교한다. 그 공격을 제거했을 때의 결과를 뜻하지는 않는다.",
      crop: { x: 0, y: 150, w: 2538, h: 900, full: 2538 }
    },
    editor: {
      image: "editor.png",
      title: "노드와 효과 값 편집",
      alt: "스킬 노드와 효과 값을 편집하는 시뮬레이터 화면",
      caption: "노드 추가·삭제와 선행 연결까지 여기서 바꾼다. 편집은 사본에만 쓰고 저장 전 결과에 자동 반영되지 않는다.",
      crop: { x: 0, y: 300, w: 2540, h: 900, full: 2552 }
    },
    apply: {
      image: "apply.png",
      title: "사본과 원본의 차이 확인 후 반영",
      alt: "사본과 원본 자산의 차이를 비교하는 반영 화면",
      caption: "반영 전 사본과 원본의 차이를 확인한다. 캡처는 변경 차이가 없는 상태다."
    }
  },

  // ── 표지 ──────────────────────────────────────────────────────
  // 덱 슬라이드 · 랜딩 카드 · 이 페이지 히어로가 같은 것을 쓴다(cover.jsx).
  // 크기 규칙은 src/styles/cover.css 머리 주석이 원본이다.
  cover: {
    eyebrow: "진행 템포 · 밸런스 모델과 실험 도구",
    title: "Motelet",
    period: "2026.05 - 현재",
    lede: "한 번의 전투에서 얻은 보상으로 능력을 사고, 성장한 상태로 다시 도전하는 인크레멘탈 게임이다. **주관적으로 판단하던 성장 체감을 비교하기 위해, 전투·보상·구매의 관계를 모델로 정리하고 반복 실험 도구를 만들었다.**",
    roleLabel: "PM 겸 배틀씬 프로그래머",
    role: " — **밸런스 모델 · 실험 도구** 담당",
    boundary: "스킬트리 데이터 · DB는 팀원 작업이다. 구현의 상당 부분과 검토에 AI를 활용했다.",
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
    ai: "모델과 실험 도구를 구성하고 후보 검토 기준을 보완했다. 실제 재미와 출시 이후의 성과는 별도 검증 대상이다.",
    links: [
      { label: "Steam", v: "Motelet · 2026-09-04 출시", href: "https://store.steampowered.com/app/4850970/Motelet/", tone: "blue" }
    ],
    caption: "개발 빌드의 전투 화면이다. 골드는 구매에, 처치 점수는 레벨 진행에 쓰인다."
  },

  // 표지가 쓰는 값
  loop: {
    image: "progression-pacing/assets/gameplay.png",
    alt: "로봇 청소기 플레이어와 몬스터, 상단 스태미나가 보이는 개발 빌드의 전투 화면"
  }
};
