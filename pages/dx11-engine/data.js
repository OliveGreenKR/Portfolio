// PersonalDx11Engine — verified against knowledge_base/projects/dx11_engine/_code_audit.md.
// No measured performance improvement is claimed.

window.DX11_DATA = {
  meta: {
    eyebrow: 'MAIN · 06 ─ 개인 프로젝트 · 1인',
    subtitle: 'PersonalDx11Engine',
    title: 'DX11 엔진 제작',
    pills: [
      { kind: 'accent', text: '2025.01 – 2025.08 · 1인' },
      { kind: 'plain', text: 'C++17 · DirectX 11 · HLSL' },
      { kind: 'accent', text: '엔진 전 영역 설계 · 구현' },
    ],
  },

  hook: 'D3D11 위에서 입력부터 물리·씬·렌더링·리소스·디버그까지, **한 프레임을 이루는 엔진 전체**를 직접 설계하고 구현했다.',

  hero: {
    img: 'dx11-engine/assets/hero.png',
    caption: '직접 만든 엔진의 물리·충돌 디버그 장면. 실행 상태와 충돌 트리를 ImGui 오버레이로 함께 확인했다.',
  },

  overview: {
    gist: '각 시스템을 따로 만든 것이 아니라, **입력부터 Present와 프레임 정리까지** 하나의 실행 흐름으로 연결했다.',
    facts: [
      ['규모', '소스 137개 — h 86 · cpp 46 · hlsl 5'],
      ['직접 구현', '물리 · 충돌 · 렌더 · 게임오브젝트/씬 · 리소스 · 입력 · 메모리/디버그'],
      ['외부 기반', 'DirectX 11 API · DirectXMath · ImGui'],
    ],
  },

  physics: {
    gist: '가장 크게 재설계한 곳은 물리다. 핵심은 알고리즘보다 먼저 **상태의 주인과 이동 경로**를 정한 것이다.',
    boundary: {
      title: '1. 상태 소유권을 물리로 옮겼다',
      body: '게임 객체가 두 벌로 들던 시뮬레이션 상태를 `FPhysicsStateArrays`의 속성 배열 23개로 옮겼다. 게임 쪽에는 슬롯 ID와 동기화용 입력·결과·더티 상태를 남기고, 두 영역의 왕복은 입력·Job·결과·이벤트 네 통로로 제한했다.',
      evidence: ['FPhysicsStateArrays', 'IdToIdx / IdxToId', '23 property arrays', '4 communication paths'],
    },
    sync: {
      title: '2. 입력은 갱신 빈도에 따라 세 계층으로 나눴다',
      body: '트랜스폼과 질량을 같은 주기로 복사하지 않는다. 데이터 구조와 순회를 High·Mid·Low로 나누고, 각 계층의 더티 플래그가 선 슬롯만 중앙 배열에 반영한다.',
      evidence: ['FHighFrequencyData', 'FMidFrequencyData', 'FLowFrequencyData', 'Dirty Flags'],
    },
    tick: {
      title: '3. 동기화는 반복 구간 밖에서만 연다',
      body: '한 틱의 예산을 서브스텝으로 나누되, 게임→물리 입력과 물리→게임 결과는 준비·마무리 단계에서 한 번씩만 이동한다. 반복 중에는 게임 객체를 읽거나 쓰지 않는다.',
      evidence: ['PrepareSimulation', 'SimulateSubstep × N', 'FinalizeSimulation'],
    },
    collision: {
      title: '4. 충돌은 슬롯 데이터만 보는 파이프라인으로 분리했다',
      body: '동적 AABB 트리로 후보를 만들고, 빠른 물체는 이동 구간을 검사한다. 상자·구 형상을 판정한 뒤 충격량·위치 보정·Enter/Stay/Exit 이벤트를 계산한다.',
      evidence: ['Dynamic AABB Tree', 'Swept test', 'SAT 15 axes', 'Sequential impulse'],
    },
  },

  systems: {
    gist: '물리 밖에서도 같은 질문을 반복했다. **무엇을 언제 만들고, 누가 소유하며, 어디서 검증할 것인가.**',
    render: {
      title: '렌더링 — 제출과 실행을 분리했다',
      body: '씬은 렌더 Job만 제출한다. 렌더러는 상태 버킷으로 나눠 처리하고, `FRenderContext`는 내부 바인딩 캐시와 비교한 뒤 D3D11 호출을 수행한다. RenderData는 8MB 프레임 아레나에서 만들고 다음 프레임에 일괄 재사용한다.',
      evidence: ['Shader Reflection', 'Solid / Wireframe buckets', '8 MB frame arena', 'EndFrame binding validation'],
    },
    foundation: {
      title: '코어 · 인프라 — 실행 기반을 직접 구성했다',
      body: '게임오브젝트는 컴포넌트 트리로 기능을 조합하고 Transform을 자식에 전파한다. 리소스는 해시 핸들과 LRU 캐시로, 입력은 우선순위 Context와 Delegate로, 디버그는 UI·콘솔·Draw·D3D 바인딩 검사로 연결했다.',
      evidence: ['4-tier component', 'FResourceHandle + LRU', 'Input Context + Delegate', 'Memory pools + Debug tools'],
    },
  },

  evidence: {
    verified: [
      ['구조', 'mine 브랜치의 현재 코드와 master에 남은 이전 구조를 대조해 소유권·호출 경로·상수 사용을 확인했다.'],
      ['검증 도구', '충돌 트리/형상 Debug Draw, ImGui 상태창, D3D 바인딩 검사 코드를 구현했다.'],
      ['범위', '물리뿐 아니라 메인 루프·렌더링·씬·리소스·입력·메모리 코드를 직접 구현했다.'],
    ],
    limits: [
      ['성능 개선량', '프로파일러 캡처와 재현 가능한 벤치마크가 없어 수치로 주장하지 않는다.'],
      ['결정성', '리플레이·고정 시드 검증이 없어 프레임률 독립/결정성을 주장하지 않는다.'],
      ['물리 범위', '상자·구 중심이며 GJK/EPA와 실제 멀티스레드 실행은 구현하지 않았다.'],
      ['렌더 캐시', '프레임 시작 초기화 경로가 없어 ImGui가 같은 컨텍스트를 바꾼 뒤 내부 캐시와 실제 상태가 어긋날 수 있다.'],
    ],
  },

  repo: { label: 'GitHub 저장소', href: 'https://github.com/OliveGreenKR/PersonalDx11Engine' },
  youtube: { label: '데모 영상', href: 'https://youtube.com/playlist?list=PLfrpeRcTLBefJ5Q5JjjfeNhooDylaNgUC' },
};
