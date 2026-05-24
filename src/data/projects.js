// JCH Portfolio — projects.js
// Single source of truth for project data. Consumed by both the web view
// (WebPortfolio.jsx) and the print view (PrintPortfolio.jsx) so the two
// surfaces never drift.

const PROJECTS = [
  {
    id: "dx11",
    num: "01",
    title: "DX11 Custom Physics Engine",
    year: "2024",
    duration: "16 weeks",
    stack: "C++ · DirectX 11",
    summary:
      "DX11 위에서 처음부터 만든 커스텀 물리 엔진. 변경에 강한 구조를 가설로 두고, 실제 충돌 감지·결정성·성능 세 축을 검증했다.",
    tags: [
      { kind: "arch", label: "architecture" },
      { kind: "algo", label: "algorithm" },
      { kind: "perf", label: "performance" },
    ],
    stats: [
      { v: "147", unit: "files", k: "Codebase" },
      { v: "16",  unit: "wks",   k: "Duration" },
      { v: "84",  unit: "tests", k: "Unit tests" },
      { v: "1k",  unit: "objs",  k: "16ms target" },
    ],
    sections: {
      context:
        "2024 가을, 학과 프로젝트로 자체 물리 엔진을 16주에 걸쳐 구현. 외부 라이브러리 없이 충돌 감지부터 통합까지 본인이 설계.",
      problem:
        "초기 브로드페이즈가 모든 객체 쌍을 검사하는 O(n²) 구조였다. 객체 200개 이상에서 프레임 드랍이 발생했고, 시뮬레이션 결정성도 dt 변동에 크게 흔들렸다.",
      action: [
        "동적 AABB 트리(broadphase) 도입으로 O(n log n) 검사로 전환.",
        "fixed-step 시뮬레이션 분리 — 렌더 dt와 물리 dt를 결합 해제.",
        "Step / Update / Solve를 컴포넌트로 분리해 단위 테스트 가능하도록 구조화.",
      ],
      result: [
        "1,000 객체에서도 16ms 프레임 유지 (RTX 3060 기준).",
        "결정성 보장 — 동일 입력 시 동일 결과, 리플레이 가능.",
        "84개 단위 테스트가 핵심 경로를 커버.",
      ],
      evidence: "147 파일 · 84 unit tests · 프로파일러 캡처. 코드는 비공개 저장소.",
      flags: [
        { kind: "warn", body: "<b>역할 명시:</b> 렌더링 파이프라인은 동기 학우 작품. 본인 담당은 물리 코어와 통합 인터페이스." },
        { kind: "ok",   body: "<b>측정 확인:</b> 1,000 객체에서 16ms는 RTX 3060 / Release 빌드 / 시뮬레이션-only 측정값." },
      ],
      code: {
        file: "PhysicsWorld::Step()",
        body: `<span class="c">// fixed-step deterministic simulation</span>
<span class="k">void</span> PhysicsWorld::Step(<span class="k">float</span> dt) {
  accumulator += dt;
  <span class="k">while</span> (accumulator &gt;= <span class="s">FIXED_DT</span>) {
    broadphase.Update();   <span class="c">// dynamic AABB tree</span>
    narrowphase.Solve();
    integrator.Apply(<span class="s">FIXED_DT</span>);
    accumulator -= <span class="s">FIXED_DT</span>;
  }
}`,
      },
    },
  },
  {
    id: "cartapli",
    num: "02",
    title: "Cartapli: Fold Quest",
    year: "2024",
    duration: "Steam release",
    stack: "Unity · C#",
    summary:
      "종이접기를 메커닉으로 삼은 퍼즐 게임. Steam에 출시되어 매우 긍정적(98%) 평가를 받았고, 14개 언어로 현지화됐다.",
    tags: [
      { kind: "arch", label: "architecture" },
      { kind: "tool", label: "tooling" },
    ],
    stats: [
      { v: "98",  unit: "%",     k: "Steam positive" },
      { v: "14",  unit: "langs", k: "Localized" },
      { v: "5",   unit: "wks",   k: "Release" },
      { v: "10+", unit: "PoCs",  k: "Iterations" },
    ],
    sections: {
      context:
        "PoC 4주, 10개 이상의 프로토타입 제작·탈락 후 본 프로덕션 진입. 본인은 후반부 합류, 입력 시스템과 레벨 데이터 흐름을 담당.",
      problem:
        "PoC 코드는 종이접기 수학을 한 거대한 컴포넌트에 묶어 두고 있었다. 새 메커닉을 추가할 때마다 전체 코드를 만져야 했고, 입력과 게임 상태가 강하게 결합돼 디버깅이 어려웠다.",
      action: [
        "FoldController를 입력 / 시뮬레이션 / 렌더링 세 책임으로 3분할.",
        "레벨 데이터를 ScriptableObject 기반으로 분리, 디자이너가 직접 편집.",
        "현지화 14개국어 — string table을 한 소스에서 빌드.",
      ],
      result: [
        "Steam 출시 5주 만에 매우 긍정적 등급 진입.",
        "리뷰 98% 긍정 (출시 시점).",
        "디자이너가 코드 변경 없이 새 레벨 30+ 추가.",
      ],
      evidence: "Steam 페이지 공개 통계 · 출시 5주차 스냅샷 · 본인 작업 PR 목록.",
      flags: [
        { kind: "warn", body: "<b>역할 명시:</b> 종이접기 핵심 수학 로직은 PoC 입안자 작품. 본인 담당은 3분할 리팩토링과 입력 컨트롤러 분리." },
      ],
      code: {
        file: "FoldController.split.cs",
        body: `<span class="c">// before — one class doing everything</span>
<span class="k">class</span> <span class="s">FoldController</span> { <span class="c">/* input + math + render */</span> }

<span class="c">// after — three clean responsibilities</span>
<span class="k">class</span> <span class="s">FoldInput</span>      { <span class="c">// pointer / pinch only</span> }
<span class="k">class</span> <span class="s">FoldSimulation</span> { <span class="c">// crease math, no Unity refs</span> }
<span class="k">class</span> <span class="s">FoldRenderer</span>   { <span class="c">// mesh + shader updates</span> }`,
      },
    },
  },
  {
    id: "wobble",
    num: "03",
    title: "Wobble Wobble (바둘바둘)",
    year: "2023",
    duration: "Steam release",
    stack: "Unity · C#",
    summary:
      "물리 기반 캐주얼 퍼즐. Badulbadul 게임 랩에서 시작해 정식 출시까지 이어진 첫 상용 프로젝트.",
    tags: [
      { kind: "perf",  label: "performance" },
      { kind: "debug", label: "debug" },
    ],
    stats: [
      { v: "5",   unit: "wks",  k: "Release" },
      { v: "60",  unit: "fps",  k: "Mobile target" },
      { v: "30+", unit: "lvls", k: "Shipped" },
    ],
    sections: {
      context:
        "Badulbadul 게임 랩에서 만든 다수 프로토타입 중 하나가 정식 출시까지 이어진 케이스. 본인은 출시 5주 전 합류해 성능과 안정성을 담당.",
      problem:
        "물리 객체 수가 많은 후반부 레벨에서 모바일 60fps 유지가 안 됐다. 프로파일러는 collider 활성화 / 비활성화 비용을 가리키고 있었다.",
      action: [
        "콜라이더 풀링 — 활성/비활성 토글 대신 미리 할당된 풀에서 회수.",
        "물리 LOD — 화면 밖 객체는 sleep 상태 유지.",
        "출시 직전 크래시 4종 디버깅, repro→fix→regression 워크플로 정착.",
      ],
      result: [
        "후반 레벨에서도 모바일 60fps 안정.",
        "Steam 출시 완료, 30+ 레벨 포함.",
      ],
      evidence: "Steam 페이지 · 본인 출시 직전 PR · 프로파일러 비교 캡처.",
      flags: [],
      code: {
        file: "ColliderPool.cs",
        body: `<span class="c">// reuse pre-allocated colliders instead of toggling SetActive</span>
<span class="k">public</span> <span class="k">class</span> <span class="s">ColliderPool</span> {
  <span class="k">readonly</span> Stack&lt;Collider2D&gt; _free = <span class="k">new</span>();
  <span class="k">public</span> Collider2D Rent() =&gt; _free.Count &gt; 0 ? _free.Pop() : Allocate();
  <span class="k">public</span> <span class="k">void</span> Return(Collider2D c) { c.enabled = <span class="k">false</span>; _free.Push(c); }
}`,
      },
    },
  },
  {
    id: "kittens",
    num: "04",
    title: "1000 Kittens",
    year: "2023",
    duration: "Game jam · 48h",
    stack: "Unity · C#",
    summary:
      "48시간 게임잼 출품작. 1,000마리의 고양이를 한 화면에 그리기 위한 단순 ECS 패턴 실험.",
    tags: [
      { kind: "perf", label: "performance" },
      { kind: "algo", label: "algorithm" },
    ],
    stats: [
      { v: "1k", unit: "kittens", k: "On screen" },
      { v: "48", unit: "h",       k: "Jam time" },
    ],
    sections: {
      context: "게임잼 형식 — 48시간, 2인 팀. 본인은 클라이언트 / 시뮬레이션, 동료는 아트.",
      problem: "게임잼 시간 제약 안에서 1,000마리 동시 시뮬레이션이 60fps 유지되어야 했다.",
      action: [
        "매 프레임 GameObject 갱신 대신, 단일 배열에 위치/속도 저장.",
        "Sprite Batching으로 단일 draw call.",
      ],
      result: ["1,000 객체 60fps 달성.", "잼 마감 15분 전 빌드 통과."],
      evidence: "잼 페이지 · 본인 빌드 영상.",
      flags: [],
      code: null,
    },
  },
  {
    id: "badulbadul",
    num: "05",
    title: "Badulbadul Game Lab",
    year: "2022—2023",
    duration: "Lab",
    stack: "Unity · 다수",
    summary:
      "다수 프로토타입을 만들고 출시 가능한 것을 가려내는 사내 랩. 한 해 동안 10+ 프로토타입에 기여, 그 중 하나가 Wobble Wobble로 출시.",
    tags: [
      { kind: "tool", label: "tooling" },
      { kind: "arch", label: "architecture" },
    ],
    stats: [
      { v: "10+", unit: "PoCs", k: "Built" },
      { v: "1",   unit: "ship", k: "Released" },
    ],
    sections: {
      context: "Badulbadul 스튜디오의 인큐베이터. 매주 새 프로토타입을 만들고, 1주 안에 살릴지 버릴지 결정.",
      problem: "프로토타입 코드가 매번 0에서 시작 — 입력, 풀링, UI 같은 공통 인프라를 매번 다시 짜고 있었다.",
      action: [
        "공통 코어를 분리해 '시작 키트' 프로젝트화.",
        "PoC 검증 체크리스트(메커닉 / 컨트롤 / 진행 / 보상) 도입.",
      ],
      result: ["신규 PoC 시작 시간 단축.", "Wobble Wobble을 비롯한 살아남는 프로토타입을 가려낼 기준 마련."],
      evidence: "내부 위키 스냅샷 · 살아남은 프로토타입 목록.",
      flags: [
        { kind: "warn", body: "<b>비공개:</b> 사내 코드라 외부 공유 불가. 기여 방식만 서술." },
      ],
      code: null,
    },
  },
];

window.PROJECTS = PROJECTS;
