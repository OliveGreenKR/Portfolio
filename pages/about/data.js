// pages/about/data.js
// About 페이지 콘텐츠. uploads/about.md + 이력서(2026.05.12, 사용자 제공) 발췌.
// 본문 카피는 사용자 제공 (2026.05.19 C안).

window.ABOUT_DATA = {
  eyebrow: 'About ─ 일하는 방식 / 관심사',
  display: ['사용은 단순하게,', '구조는 확장에 유연하게.'],
  displayMark: '확장에 유연하게',

  // 본문 카피 (사용자 제공 — C안: 금지어 교체본) + 이력서 자기소개 한 문장 보강
  body: [
    '플레이어 경험과 몰입을 중심으로 시스템을 설계합니다. 반복 구현과 불필요한 확인 비용을 줄여, 팀이 핵심 재미를 더 오래 고민할 수 있는 개발 환경을 만드는 것을 좋아합니다. 사용은 단순하게, 구조는 확장에 유연하게 만드는 개발을 지향합니다.',
    '복잡한 문제를 글로 정의하고 우선순위를 세워 해결합니다. 원리를 탐구하며 엔진 제작부터 출시까지의 사이클을 직접 경험한 엔지니어입니다.',
  ],

  // ─── Facts dl
  facts: [
    ['이름',     '정철 (Chul Jeong) · JCH'],
    ['직무',     '클라이언트 프로그래머 · 시스템 / 도구 / 시뮬레이션'],
    ['엔진',     'Unity 6 · Unreal 5 · DirectX 11 (커스텀 엔진)'],
    ['언어',     'C++17 (중급 이상) · C# (초급) · HLSL · Python (기초)'],
    ['도구',     'Claude Code · MCP · Odin Inspector · Google Apps Script · Git · ImGui · SIMD'],
    ['어학',     '한국어 (모국어) · 영어 (일상 회화, 토익 860 / 2024.05)'],
  ],

  // ─── 세 결 — master.md §1 + 이력서 성과 발췌
  strands: [
    {
      kind: 'SYSTEMS',
      title: '시스템 아키텍처 결정 사례',
      lede: '메인 3 — 동시에 도는 다수 시스템을 직접 참조 0 으로 분리하는 결정의 누적.',
      examples: [
        { tag: 'Cartapli',    line: '위임형 상태 기반 씬 아키텍처 — 시스템 추가 시 기존 코드 변경 0 줄.', href: '../pages/cartapli.html' },
        { tag: 'DX11 Engine', line: '게임/물리 컨텍스트 완전 분리 + Job 기반 비동기 명령 시스템.',          href: '../pages/dx11-engine.html' },
        { tag: 'UE5 Action',  line: '컴포넌트 + 델리게이트 + DataAsset — 디자이너가 코드 없이 분기 편집.',  href: '../pages/labs/ue5-action.html' },
      ],
    },
    {
      kind: 'OPERATIONS',
      title: '장기 프로젝트 · 출시 운영',
      lede: '게임랩 빌드 → Steam 글로벌 출시. 다중 워크스트림 + 자동화 인프라 자율 도입.',
      examples: [
        { tag: 'Wobble Wobble', line: '5주 · 5인 · Steam + STOVE · 사운드 테스트 84개 · 14개 언어 자동 번역.', href: '../pages/wobble-wobble.html' },
        { tag: 'Cartapli',      line: '13주 · 4인 · Steam 매우 긍정 98% (155/157) · 26,269 lifetime users.', href: '../pages/cartapli.html' },
      ],
    },
    {
      kind: 'POC',
      title: 'PoC 사고 사이클',
      lede: 'Labs 6 — 1일에서 8주 사이에 가설을 세우고, 한 결정의 결과만 남기고 접는다.',
      examples: [
        { tag: 'Ring Dash',    line: 'dash 메커닉을 4안으로 분기 — 변형 워크플로우 자체가 산출물.',      href: '../pages/labs/ring-dash.html' },
        { tag: 'Staring Fire', line: 'GPU Stable Fluids + Blackbody. 닫힌 계 + Vorticity flame gate.', href: '../pages/labs/staring-fire.html' },
        { tag: '1000 Kittens', line: 'Odin Inspector 4 검증으로 기획자 입력의 누락을 즉시 표시.',       href: '../pages/labs/1000-kittens.html' },
      ],
    },
  ],

  // ─── Skills — 이력서 §보유기술 7 카테고리에서 발췌 (master.md §4 톤 적용 — "보완 필요" 제거)
  skills: {
    note: '엔지니어링 사실 진술. 카테고리는 이력서 보유기술 기준.',
    groups: [
      {
        name: '프로그래밍 언어',
        items: [
          { lead: 'C++ (중급 이상)',   text: 'RAII · 이동 의미론 기반의 자원 관리와 객체 수명 제어' },
          { lead: 'STL',                text: '컨테이너별 연산 비용을 고려한 최적 선택 및 데이터 배치' },
          { lead: '일반화 프로그래밍', text: '템플릿 활용 타입 안정성 확보 및 공용 모듈 구현' },
          { lead: 'C# (초급)',         text: '값·참조 타입 및 박싱 비용을 고려한 실행 시간 최적화' },
          { lead: 'C# 메모리 관리',     text: 'GC 부하 최소화를 위한 할당 최적화 · 편의 문법 오버헤드 선별 활용' },
          { lead: 'Python (기초)',      text: '데이터 전처리 및 반복 업무 자동화 스크립트' },
        ],
      },
      {
        name: 'CS · 시스템 프로그래밍',
        items: [
          { lead: '메모리 관리 / 최적화', text: '객체 수명 및 소유권 기반의 리소스 관리 모델 설계' },
          { lead: '할당 최적화',           text: '풀링 · 사전 할당 기법을 통한 생성·파괴 비용 절감' },
          { lead: '데이터 배치',           text: '캐시 지역성을 고려한 데이터 레이아웃 및 자료구조 설계' },
          { lead: '데이터 지향 설계',      text: '대량 데이터의 효율적 처리를 위한 DOD 설계' },
          { lead: 'SIMD',                  text: '병렬 처리를 통한 CPU 연산 효율 극대화' },
        ],
      },
      {
        name: '그래픽스 · 물리',
        items: [
          { lead: '렌더링 파이프라인', text: '리소스 바인딩 비용 최소화 및 효율적 렌더러 구조 설계' },
          { lead: 'HLSL · 셰이더',     text: 'CPU-GPU 간 데이터 정합성 자동화 인터페이스 구축' },
          { lead: '커스텀 물리 엔진',  text: '충돌 처리 파이프라인 아키텍처 구축 및 시뮬레이션 로직 구현' },
          { lead: 'CCD · 공간 분할',   text: '고속 물체 대응 및 대규모 충돌 처리 효율화' },
        ],
      },
      {
        name: '시스템 설계',
        items: [
          { lead: '의존성 제어',       text: '계층화와 책임 분리를 통한 결합도 감소 및 유지보수성 확보' },
          { lead: 'OCP 기반 추상화',   text: '인터페이스 활용을 통한 코드 수정 없는 기능 확장 구조 설계' },
          { lead: '데이터 지향 확장성', text: '로직과 데이터 분리를 통한 데이터 명세 기반의 시스템 확장' },
        ],
      },
      {
        name: '협업 · 소통',
        items: [
          { lead: '공동 목표 정렬', text: '기획 의도의 기술적 변환 및 제약 사항 공유를 통한 방향성 일치' },
          { lead: '우선순위 관리',  text: '리스크 기반 작업 의존성 파악 및 일정 지연 요소 사전 통제' },
          { lead: '정보 격차 해소', text: '진행 현황과 위험 요소의 투명한 공유를 통한 병목 방지' },
          { lead: '맥락 중심 소통', text: '변경 의도와 배경 지식 전파를 통한 코드 · 문서 이해도 제고' },
        ],
      },
      {
        name: '개발 환경 · 품질 관리',
        items: [
          { lead: '작업 환경 최적화', text: '데이터 편집 도구 구축 및 비개발자용 인터페이스 안전성 확보' },
          { lead: '검증 시스템',     text: '데이터 정합성 검사 및 실행 전 오류 차단 로직 적용' },
          { lead: '디버깅 / 자동화', text: '문제 분석 인프라 구축 및 반복 업무 스크립팅으로 생산성 제고' },
        ],
      },
      {
        name: '문서화 · 지식 자산화',
        items: [
          { lead: '구조적 정보 설계', text: '시스템 구조 및 데이터 흐름의 시각화' },
          { lead: '의사결정 이력',   text: '설계 근거 명문화 및 기술 부채 방지' },
          { lead: '맞춤형 지식 전파', text: '숙련도별 정보 재구성 및 협업 효율화' },
          { lead: '경험 자산화',     text: '프로세스 병목 분석 및 개선책 지식화' },
        ],
      },
    ],
  },

  // ─── Background — 학력 / 활동 / 자격. 이력서 §학력 + §수상/자격증 기반.
  background: {
    note: '학력 · 외부 활동 · 자격. 게임랩 메타 서사 포함.',
    rows: [
      { y: '2017.03 ─ 2024.08', t: '서울시립대학교 기계정보공학 (졸업). 컴퓨터 시스템 구조론 · 시스템 소프트웨어 · 그래픽스 · 운영체제 · 자료구조 및 알고리즘 · 임베디드 시스템 등.' },
      { y: '2025.09',          t: '크래프톤 게임랩 4기 — 트랙 종료 → Steam 무료 게임 Cartapli: Fold Quest 출시 (EPIC 으로 연결).' },
      { y: '게임랩 다주차',     t: '주차 단위 PM 운영 경험 → Wobble Wobble 출시 PM + 자동화 엔지니어 로 직결.' },
      { y: '2024.05',          t: '토익 860.' },
      { y: '2023.06',          t: '서울시립대 C++ 소모임 강의 진행 (Accelerated C++ 기반).' },
      { y: '2023.02',          t: '백준 플래티넘 달성 (C++).' },
      { y: '2021 ─ 2024',      t: 'inflearn 온라인 강의 수료 — C++ 입문 · 자료구조 · 게임서버 · Unity 입문 · Unreal 5.' },
    ],
  },

  // ─── External links — 실 데이터 (사용자 노출 허가 2026.05.22)
  links: {
    note: '연락처 · 외부 채널. 모두 공개.',
    items: [
      { label: 'Email',  v: 'jeongchul0098@gmail.com', href: 'mailto:jeongchul0098@gmail.com' },
      { label: 'Phone',  v: '010-3791-2395',           href: 'tel:+821037912395' },
      { label: 'GitHub', v: 'github.com/OliveGreenKR', href: 'https://github.com/OliveGreenKR' },
      { label: 'Steam',  v: 'Cartapli: Fold Quest',    href: 'https://store.steampowered.com/app/4314560/Cartapli__Fold_Quest/' },
    ],
  },

  footer: 'JCH · 정철 · 2026 · last update 2026.05.22',
};
