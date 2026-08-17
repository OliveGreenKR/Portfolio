// pages/edu-gamification/cover-viz.jsx
// 교육용 게이미피케이션 — 전체 구조도.
//
// data.js 의 heroMermaid 와 **같은 관계**를 그린다. mermaid 를 직접 쓰지 않는 이유:
// 자동 배치라 박스 크기가 글자 수를 따라 제각각이 되고, 그룹 세 개가 폭을 나눠 갖는
// 순간 글자가 판독선 아래로 떨어진다(덱에서 실측한 다른 도표와 같은 문제).
// 여기서는 배치를 사람이 정한다 — 층 셋, 박스 크기 통일, 부제는 한 단 작게.
//
// ⚠️ 사실을 만들지 않는다. 노드 이름·부제는 heroMermaid 원문 그대로다.
// 관계가 바뀌면 heroMermaid 와 이 파일을 **함께** 고친다 (한쪽만 고치면 갈라진다).

(function defineEduArchViz() {
  // tokens.css 팔레트. heroMermaid 의 classDef 와 같은 색을 쓴다.
  const TONE = {
    client: { fill: '#e6efdf', line: '#7ea571' },  // sage  — 게임
    cloud:  { fill: '#f5dcd2', line: '#c8674f' },  // terra — 백엔드
    ops:    { fill: '#f6ecd2', line: '#c19a4a' },  // wheat — 운영
  };
  const INK = '#1f1d1a';
  const INK2 = '#4a463f';
  const INK3 = '#807a6e';
  const RULE = '#d9d3c4';

  // 박스 하나 — 제목 한 줄 + 부제 최대 두 줄. 부제가 길면 호출자가 배열로 쪼갠다.
  function Node({ x, y, w, h, tone, title, sub, dashed }) {
    const t = TONE[tone];
    const lines = sub ? (Array.isArray(sub) ? sub : [sub]) : [];
    // 제목을 세로 가운데에 두되, 부제가 있으면 그만큼 위로 올린다.
    const titleY = y + h / 2 - (lines.length * 19) / 2 + 7;
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} rx="4"
              fill={t.fill} stroke={t.line} strokeWidth="1.5"
              strokeDasharray={dashed ? '7 5' : undefined} />
        <text x={x + w / 2} y={titleY} textAnchor="middle"
              fontSize="21" fontWeight="600" fill={INK}>{title}</text>
        {lines.map((l, i) => (
          <text key={i} x={x + w / 2} y={titleY + 24 + i * 19} textAnchor="middle"
                fontSize="16" fill={INK2}>{l}</text>
        ))}
      </g>
    );
  }

  // 가로 화살표 — 박스와 박스 사이
  function Arrow({ x1, x2, y, dashed, label }) {
    return (
      <g>
        <line x1={x1} y1={y} x2={x2 - 9} y2={y} stroke={dashed ? INK3 : INK2} strokeWidth="1.6"
              strokeDasharray={dashed ? '6 5' : undefined} />
        <path d={`M${x2} ${y} L${x2 - 10} ${y - 5} L${x2 - 10} ${y + 5} Z`} fill={dashed ? INK3 : INK2} />
        {label && (
          <text x={(x1 + x2) / 2} y={y - 10} textAnchor="middle" fontSize="15" fill={INK3}>{label}</text>
        )}
      </g>
    );
  }

  function Group({ x, y, w, h, label, tone }) {
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} rx="6" fill="none" stroke={RULE} strokeWidth="1" />
        <text x={x + 16} y={y + 27} fontSize="17" fontWeight="600" fill={TONE[tone].line}
              letterSpacing="0.06em">{label}</text>
      </g>
    );
  }

  function EduArchViz() {
    return (
      <figure className="edu-arch">
        <svg viewBox="0 0 1200 600" role="img"
             aria-label="게임 client · 서버리스 백엔드 · 운영 콘솔 세 층의 구조와 호출 방향">
          {/* ─── 게임 client ─────────────────────────────── */}
          <Group x={20} y={20} w={580} h={150} label="게임 CLIENT (UNITY)" tone="client" />
          <Node x={40} y={62} w={250} h={88} tone="client"
                title="ISegment 그래프" sub="내러티브 자유 구성" />
          <Arrow x1={290} x2={330} y={106} />
          <Node x={330} y={62} w={250} h={88} tone="client"
                title="연동 계층" sub={['IAuth · IBackend · ISaveStore']} />

          {/* ─── 서버리스 백엔드 ──────────────────────────── */}
          <Group x={20} y={210} w={1160} h={170} label="서버리스 백엔드 (AWS)" tone="cloud" />
          <Node x={40} y={252} w={170} h={88} tone="cloud" title="API Gateway" />
          <Arrow x1={210} x2={250} y={296} />
          <Node x={250} y={252} w={290} h={88} tone="cloud"
                title="단일 인가 게이트" sub={['오리진 → 신원 → 등급 → 감사']} />
          <Arrow x1={540} x2={580} y={296} />
          <Node x={580} y={252} w={180} h={88} tone="cloud" title="Lambda" sub={['Python']} />
          <Arrow x1={760} x2={800} y={296} />
          <Node x={800} y={252} w={200} h={88} tone="cloud"
                title="DynamoDB" sub={['스키마리스 10 테이블']} />
          <Arrow x1={1000} x2={1040} y={296} dashed label="Stream" />
          <Node x={1040} y={252} w={120} h={88} tone="cloud" dashed
                title="감사" sub={['백스톱']} />

          {/* ─── 운영 콘솔 ───────────────────────────────── */}
          <Group x={20} y={420} w={580} h={160} label="운영 콘솔 (ELECTRON)" tone="ops" />
          <Node x={40} y={462} w={250} h={98} tone="ops"
                title="격리 부트스트랩" sub={['Node · Python', 'Terraform']} />
          <Arrow x1={290} x2={330} y={511} />
          <Node x={330} y={462} w={250} h={98} tone="ops"
                title="Terraform 배포 UI" />

          {/* ─── 층 사이 ─────────────────────────────────── */}
          {/* 연동 계층 → API Gateway. 왼쪽으로 돌아 내려간다 — 직선으로 그으면
              게이트 박스를 가로지른다. */}
          <path d="M455 150 L455 190 L125 190 L125 252" fill="none" stroke={INK2} strokeWidth="1.6" />
          <path d="M125 252 L120 242 L130 242 Z" fill={INK2} />
          <text x={470} y={183} fontSize="15" fill={INK3}>REST · JSON</text>

          {/* 배포 UI → 백엔드 전체. 그룹 테두리를 향한다 — 특정 노드가 아니라
              스택 전체를 세우는 일이라서다. */}
          <path d="M455 462 L455 400" fill="none" stroke={INK3} strokeWidth="1.6" strokeDasharray="6 5" />
          <path d="M455 380 L450 392 L460 392 Z" fill={INK3} />
          <text x={470} y={432} fontSize="15" fill={INK3}>1-click 배포</text>
        </svg>
      </figure>
    );
  }

  window.EduArchViz = EduArchViz;
})();
