// pages/dx11-engine/viz.jsx
// 이 페이지 전용 시각화. 전부 인라인 SVG / CSS — 외부 차트 라이브러리 0.
//
// 규칙 1: 그림 하나는 문장 하나를 대신한다. 그 문장이 캡션이다.
//         캡션에 본문 문장을 복붙하지 않는다 — 캡션은 그림만 줄 수 있는 것을 말한다.
// 규칙 2: 없는 데이터를 그리지 않는다. 이 페이지에는 계측본이 하나도 없으므로
//         "측정 결과처럼 보이는 그림" 을 만들지 않는다. 여기 다섯은 전부 원리도다 —
//         경계 · 한 틱의 순서 · 지연 압축 · 여유 경계 · 스윕 부피. 눈금도 값도 없다.
// 규칙 3: 배치 상수 옆에 총폭 계산 주석을 남긴다 (.dx-figure 가 overflow:hidden).
// 규칙 4: SVG 안의 긴 설명 문장에는 dx-svg-note 를 붙인다 — 720px 이하에서 숨겨진다
//         (viewBox 가 축소되면 실제 픽셀이 4~5px 로 떨어져 읽을 수 없다).
//         그 내용은 figcaption 이 미리 받아 둔다.

/* ─── 게임과 물리 사이 통로는 넷뿐이다 ────────────────── */
/* 이 페이지의 첫 그림이자 제일 중요한 그림. 경계의 모양을 3초에 보이게 한다.
   숫자 없음 — 무엇이 어느 쪽에 사는지, 무엇이 사이를 지나는지만 말한다. */
function DXBoundaryViz() {
  const W = 760, H = 316;
  // 총폭: 좌 20+200 = 220 / 통로 244~516 / 우 520+220 = 740 < 760 ✓
  const L = { x: 20, w: 200 }, R = { x: 520, w: 220 };
  const laneX1 = 244, laneX2 = 516;

  const lanes = [
    { n: '①', y: 84,  dir: 'r', k: '입력 동기화', s: '더티가 선 빈도만' },
    { n: '②', y: 143, dir: 'r', k: 'Job 큐',      s: '힘 · 충격량 요청' },
    { n: '③', y: 202, dir: 'l', k: '결과',        s: '한 덩이로 되돌아온다' },
    { n: '④', y: 261, dir: 'l', k: '충돌 이벤트',  s: '큐에 쌓아 두었다 비운다' },
  ];

  const lane = (l, i) => {
    const toRight = l.dir === 'r';
    const x1 = toRight ? laneX1 : laneX2;
    const x2 = toRight ? laneX2 : laneX1;
    const head = toRight ? [[x2, l.y], [x2 - 11, l.y - 6], [x2 - 11, l.y + 6]]
                         : [[x2, l.y], [x2 + 11, l.y - 6], [x2 + 11, l.y + 6]];
    return (
      <g key={l.k}>
        <line x1={x1} x2={toRight ? x2 - 10 : x2 + 10} y1={l.y} y2={l.y}
              stroke={toRight ? 'var(--sage-500)' : 'var(--terra-400)'} strokeWidth="1.6" />
        <polygon points={head.map(p => p.join(',')).join(' ')}
                 fill={toRight ? 'var(--sage-500)' : 'var(--terra-400)'} />
        <text x={(laneX1 + laneX2) / 2} y={l.y - 11} textAnchor="middle" className="dx-svg-lbl">{l.n} {l.k}</text>
        <text x={(laneX1 + laneX2) / 2} y={l.y + 18} textAnchor="middle" className="dx-svg-sub dx-svg-note">{l.s}</text>
      </g>
    );
  };

  const chip = (x, y, w, t, tone) => (
    <g key={t}>
      <rect x={x} y={y} width={w} height={26} rx="3"
            fill={tone === 'data' ? 'var(--sage-100)' : 'var(--paper)'}
            stroke={tone === 'data' ? 'var(--sage-500)' : 'var(--rule-2)'} />
      <text x={x + 10} y={y + 18} className="dx-svg-sub">{t}</text>
    </g>
  );

  return (
    <figure className="dx-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="dx-svg" role="img"
           aria-label="게임 쪽과 물리 쪽 사이를 지나는 통로는 입력 동기화, Job 큐, 결과, 충돌 이벤트 넷뿐이다">
        {/* 좌 — 게임 쪽 */}
        <rect x={L.x} y="46" width={L.w} height={244} rx="4"
              fill="var(--paper-2)" stroke="var(--rule-2)" />
        <text x={L.x + 12} y="32" className="dx-svg-lbl">게임 쪽</text>
        {chip(L.x + 14, 70,  L.w - 28, 'RigidBodyComponent')}
        {chip(L.x + 14, 106, L.w - 28, 'High / Mid / Low', 'data')}
        {chip(L.x + 14, 142, L.w - 28, '결과 캐시', 'data')}
        {chip(L.x + 14, 178, L.w - 28, '더티 플래그', 'data')}
        <text x={L.x + 14} y="228" className="dx-svg-sub dx-svg-note">물리 상태를 직접 여는</text>
        <text x={L.x + 14} y="244" className="dx-svg-sub dx-svg-note">경로가 없다</text>
        <rect x={L.x + 14} y={258} width={L.w - 28} height={22} rx="3"
              fill="var(--paper)" stroke="var(--terra-300)" strokeDasharray="4 3" />
        <text x={L.x + 24} y={273} className="dx-svg-tag">슬롯 ID 하나만 든다</text>

        {/* 통로 */}
        {lanes.map(lane)}

        {/* 우 — 물리 쪽 */}
        <rect x={R.x} y="46" width={R.w} height={244} rx="4"
              fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth="1.6" />
        <text x={R.x + 12} y="32" className="dx-svg-lbl root">물리 쪽 — 중앙 배열</text>
        {['Velocities[]', 'WorldPosition[]', 'InvMasses[]', 'CollisionShapeTypes[]', 'ObjectReferences[]']
          .map((t, i) => chip(R.x + 14, 70 + i * 34, R.w - 28, t, 'data'))}
        <text x={R.x + 14} y={258} className="dx-svg-sub dx-svg-note">속성마다 배열 하나 — 모두 23개</text>
        <text x={R.x + 14} y={276} className="dx-svg-sub dx-svg-note">ID 와 인덱스는 별개다</text>
      </svg>
      <figcaption className="dx-figcap">
        왼쪽에는 <b>ID 와 게임 값</b>만 남고, 물리 속성은 전부 오른쪽 배열에 산다.
        화살표 넷 말고는 두 쪽이 서로를 부를 방법이 없다 — 나머지 호출 경로를 전부 닫은 것이 이 절의 내용이다.
      </figcaption>
    </figure>
  );
}
window.DXBoundaryViz = DXBoundaryViz;

/* ─── 한 틱의 순서 — 통로 넷이 언제 열리는가 ─────────── */
/* 이 그림이 없으면 "통로 넷" 이 어느 시점에 지나가는지를 독자가 스스로 조립해야 한다.
   순서는 TickPhysics → PrepareSimulation → SimulateSubstep × N → FinalizeSimulation 그대로다. */
function DXTickViz() {
  const W = 760, H = 396;
  // 총폭: 본문 열 x=118..724 (606) + 좌측 게이트 라벨 열 14..110 → 724 < 760 ✓
  const cx = 118, cw = 606;
  const row = (y, h, title, items, tone, gate) => (
    <g key={title}>
      <rect x={cx} y={y} width={cw} height={h} rx="4"
            fill={tone === 'gate' ? 'var(--sage-50)' : 'var(--paper-2)'}
            stroke={tone === 'gate' ? 'var(--sage-500)' : 'var(--rule-2)'}
            strokeWidth={tone === 'gate' ? 1.6 : 1} />
      <text x={cx + 14} y={y + 21} className="dx-svg-lbl">{title}</text>
      {items.map((t, i) => (
        <text key={i} x={cx + 26} y={y + 42 + i * 19} className="dx-svg-sub">{t}</text>
      ))}
      {gate && (
        <g>
          <rect x={14} y={y + 6} width={92} height={22} rx="3"
                fill="var(--paper)" stroke="var(--terra-300)" />
          <text x={22} y={y + 21} className="dx-svg-tag">{gate}</text>
        </g>
      )}
    </g>
  );
  const arrow = y => (
    <g key={`a${y}`}>
      <line x1={cx + cw / 2} x2={cx + cw / 2} y1={y} y2={y + 14} stroke="var(--rule-2)" />
      <polygon points={`${cx + cw / 2},${y + 18} ${cx + cw / 2 - 5},${y + 10} ${cx + cw / 2 + 5},${y + 10}`}
               fill="var(--rule-2)" />
    </g>
  );

  return (
    <figure className="dx-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="dx-svg" role="img"
           aria-label="한 틱은 준비, 서브스텝 반복, 마무리 순으로 돌고 통로 넷은 준비와 마무리에서만 열린다">
        <text x={14} y="20" className="dx-svg-lbl root">TickPhysics(dt) — 한 틱</text>

        {row(32, 82, 'PrepareSimulation — 받고 처리한다',
             ['SyncGameToPhysics()  더티가 선 빈도만', 'ProcessJobQueue()  쌓인 요청', '만료된 약한 참조 정리'],
             'gate', '통로 ① ②')}
        {arrow(114)}
        {row(150, 106, 'SimulateSubstep(step) × N — 예산을 나눠 쓴다',
             ['ProcessCollisions()  브로드 → 내로우 → 응답', 'BatchApplyGravity / Forces / Drag',
              'BatchIntegrateVelocity  위치 갱신', 'BatchResetForces / BatchPhysicsTick'],
             'plain')}
        {arrow(256)}
        {row(292, 82, 'FinalizeSimulation — 돌려준다',
             ['SyncPhysicsToGame()  결과 한 덩이', 'SyncPhysicsEvents()  충돌 이벤트 큐를 비운다',
              '여기서만 게임 쪽 값이 바뀐다'],
             'gate', '통로 ③ ④')}

        <text x={14} y="140" className="dx-svg-sub dx-svg-note">서브스텝 안에서는</text>
        <text x={14} y="156" className="dx-svg-sub dx-svg-note">게임 쪽을 보지도</text>
        <text x={14} y="172" className="dx-svg-sub dx-svg-note">건드리지도 않는다</text>
      </svg>
      <figcaption className="dx-figcap">
        네 통로는 <b>반복 구간 바깥</b>에 있다. 서브스텝이 몇 번을 돌든 게임 쪽 값은 틱당 한 번만 읽히고
        한 번만 쓰인다 — 반복 중간에 값이 갈리지 않는 것은 이 배치 덕이다.
      </figcaption>
    </figure>
  );
}
window.DXTickViz = DXTickViz;

/* ─── 지연 압축 — 슬롯은 움직여도 ID 는 안 움직인다 ───── */
function DXCompactViz() {
  const W = 760, H = 268;
  const cw = 54, gap = 6, x0 = 132, n = 8;
  // 칸 줄 총폭: 132 + 8*54 + 7*6 = 132 + 432 + 42 = 606 < 760 ✓
  const rows = [58, 138, 218];
  const cellX = i => x0 + i * (cw + gap);

  // 각 단계의 슬롯 상태. id = 들어 있는 ID, null = 빈칸
  const stage = [
    [1, 2, 3, 4, 5, 6, null, null],
    [1, null, 3, 4, null, 6, null, null],
    [1, 3, 4, 6, null, null, null, null],
  ];
  const freed = { 1: [1, 4] };            // 이 단계에서 막 해제된 칸
  const moved = { 2: [1, 2, 3] };         // 압축으로 당겨 온 칸

  const label = ['① 채워져 있다', '② 두 칸이 빠진다', '③ 앞으로 당긴다'];
  const note = [
    'ID 와 인덱스가 나란하다',
    '순회가 빈칸을 건너뛴다',
    'ID 는 그대로 · 매핑만 고친다',
  ];

  return (
    <figure className="dx-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="dx-svg" role="img"
           aria-label="슬롯이 해제되고 압축되어도 바깥이 든 ID 는 바뀌지 않는다">
        {stage.map((row, r) => (
          <g key={r}>
            <text x={20} y={rows[r] + 18} className="dx-svg-lbl">{label[r]}</text>
            <text x={20} y={rows[r] + 36} className="dx-svg-sub dx-svg-note">{note[r]}</text>
            {row.map((id, i) => {
              const isFreed = (freed[r] || []).includes(i);
              const isMoved = (moved[r] || []).includes(i);
              return (
                <g key={i}>
                  <rect x={cellX(i)} y={rows[r]} width={cw} height={34} rx="3"
                        fill={id === null ? 'var(--paper)' : isMoved ? 'var(--sage-200)' : 'var(--sage-100)'}
                        stroke={id === null ? (isFreed ? 'var(--terra-400)' : 'var(--rule-2)')
                                            : isMoved ? 'var(--sage-700)' : 'var(--sage-500)'}
                        strokeDasharray={id === null ? '4 3' : ''} />
                  <text x={cellX(i) + cw / 2} y={rows[r] + 23} textAnchor="middle"
                        className={id === null ? 'dx-svg-tag' : 'dx-svg-lbl'}>
                    {id === null ? '·' : `ID ${id}`}
                  </text>
                </g>
              );
            })}
          </g>
        ))}

        {/* 당겨 온 자취 — ID 3 이 인덱스 2 에서 1 로 */}
        <path d={`M ${cellX(2) + cw / 2} ${rows[1] + 40} C ${cellX(2)} ${rows[1] + 62},
                  ${cellX(1) + cw} ${rows[2] - 22}, ${cellX(1) + cw / 2} ${rows[2] - 4}`}
              fill="none" stroke="var(--sage-700)" strokeDasharray="3 3" />
        <text x={cellX(3) + 6} y={rows[2] - 12} className="dx-svg-tag dx-svg-note">
          자리는 바뀌고 ID 는 그대로
        </text>
      </svg>
      <figcaption className="dx-figcap">
        바깥이 든 것은 인덱스가 아니라 <b>ID</b> 라, ID 3 이 인덱스 2 에서 1 로 당겨져도 참조가 끊기지 않는다.
      </figcaption>
    </figure>
  );
}
window.DXCompactViz = DXCompactViz;

/* ─── 여유 경계 — 언제 트리를 고치는가 ────────────────── */
function DXFatAABBViz() {
  const W = 760, H = 244;
  const pad = 15, pw = 230, gap = 22;
  // 총폭: 15 + 230*3 + 22*2 = 15 + 690 + 44 = 749 < 760 ✓
  const panels = [
    { head: '① 넣을 때',            dx: 0,  ok: true,  cap: '트리에 넣는다' },
    { head: '② 조금 움직일 때',      dx: 30, ok: true,  cap: '건드리지 않는다' },
    { head: '③ 여유 밖으로 나갈 때',  dx: 74, ok: false, cap: '빼서 다시 넣는다' },
  ];
  const fx = 46, fy = 62, fw = 118, fh = 96;      // 여유 경계 (패널 로컬)
  const bw = 54, bh = 44;                          // 물체

  return (
    <figure className="dx-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="dx-svg" role="img"
           aria-label="물체가 여유 경계 안에서 움직이는 동안에는 트리를 고치지 않는다">
        {panels.map((p, i) => {
          const px = pad + i * (pw + gap);
          const bx = px + fx + 14 + p.dx, by = fy + 26;
          return (
            <g key={p.head}>
              <text x={px + 8} y="26" className="dx-svg-lbl">{p.head}</text>
              <rect x={px} y="38" width={pw} height={144} rx="4"
                    fill="var(--paper)" stroke="var(--rule)" />

              {/* 여유 경계 */}
              <rect x={px + fx} y={fy} width={fw} height={fh} rx="2"
                    fill={p.ok ? 'var(--sage-50)' : 'var(--terra-50)'}
                    stroke={p.ok ? 'var(--sage-500)' : 'var(--terra-400)'}
                    strokeDasharray="5 3" />
              {/* 실제 경계 = 물체 */}
              <rect x={bx} y={by} width={bw} height={bh} rx="2"
                    fill={p.ok ? 'var(--sage-200)' : 'var(--terra-100)'}
                    stroke={p.ok ? 'var(--sage-700)' : 'var(--terra-400)'} strokeWidth="1.4" />

              <text x={px + 8} y="198" className={p.ok ? 'dx-svg-tag ok' : 'dx-svg-tag'}>{p.cap}</text>
            </g>
          );
        })}
        <text x={pad} y="230" className="dx-svg-sub dx-svg-note">
          점선 = 여유 경계 (트리가 아는 크기) · 채운 사각 = 실제 경계 (물체의 진짜 크기)
        </text>
      </svg>
      <figcaption className="dx-figcap">
        여유를 넓게 잡으면 재삽입이 줄고 후보 쌍이 늘어난다 — 그 <b>여유 폭</b>은 설정으로 뺐다.
      </figcaption>
    </figure>
  );
}
window.DXFatAABBViz = DXFatAABBViz;

/* ─── 스윕 부피 — 두 위치 어디에서도 안 겹치는 경우 ───── */
function DXSweptViz() {
  const W = 760, H = 236;
  const pad = 20, pw = 350, gap = 20;
  // 총폭: 20 + 350 + 20 + 350 = 740 < 760 ✓
  const wallX = 214, wallW = 20, wallY = 54, wallH = 116;
  const r = 20, cy = 112;
  const prevX = 96, currX = 300;

  const panel = (x, head, swept) => (
    <g key={head}>
      <text x={x + 8} y="26" className="dx-svg-lbl">{head}</text>
      <rect x={x} y="38" width={pw} height={148} rx="4" fill="var(--paper)" stroke="var(--rule)" />

      {/* 스윕 부피 */}
      {swept && (
        <rect x={x + prevX - r} y={cy - r} width={(currX - prevX) + 2 * r} height={2 * r} rx="3"
              fill="var(--sage-100)" stroke="var(--sage-500)" strokeDasharray="5 3" />
      )}

      {/* 벽 */}
      <rect x={x + wallX} y={wallY} width={wallW} height={wallH} rx="2"
            fill="var(--ink-3)" fillOpacity="0.28" stroke="var(--rule-2)" />

      {/* 직전 · 현재 */}
      <circle cx={x + prevX} cy={cy} r={r} fill="var(--paper)" stroke="var(--rule-2)" strokeDasharray="4 3" />
      <text x={x + prevX} y={cy + 4} textAnchor="middle" className="dx-svg-sub">직전</text>
      <circle cx={x + currX} cy={cy} r={r} fill="var(--paper-2)" stroke="var(--ink-3)" />
      <text x={x + currX} y={cy + 4} textAnchor="middle" className="dx-svg-sub">현재</text>

      <line x1={x + prevX + r} x2={x + currX - r} y1={cy} y2={cy}
            stroke="var(--ink-3)" strokeDasharray="2 4" />
    </g>
  );

  return (
    <figure className="dx-figure">
      <svg viewBox={`0 0 ${W} ${H}`} className="dx-svg" role="img"
           aria-label="직전 위치와 현재 위치 어디에서도 벽과 겹치지 않지만 두 위치를 감싼 부피는 벽과 겹친다">
        {panel(pad, '두 위치만 본다', false)}
        {panel(pad + pw + gap, '두 위치를 감싸서 본다', true)}

        <text x={pad + 8} y="206" className="dx-svg-tag">벽과 안 겹친다 — 통과</text>
        <text x={pad + pw + gap + 8} y="206" className="dx-svg-tag ok">겹친다 — 시점을 좁힌다</text>
      </svg>
      <figcaption className="dx-figcap">
        같은 한 프레임인데도 <b>지나간 길</b>을 부피로 감싸야 벽이 걸린다.
      </figcaption>
    </figure>
  );
}
window.DXSweptViz = DXSweptViz;

/* ─── 만든 것 3칸 ────────────────────────────────────── */
/* 큰 숫자 밴드가 아니다. 이 페이지에는 계측본이 없어 히어로에 올릴 성과 수치가 없다.
   규모(파일 수 · 커밋 수)를 숫자처럼 세우면 성과인 척 읽히므로 만든 것을 적는다. */
function DXBuilt({ items }) {
  return (
    <div className="dx-built">
      {items.map(it => (
        <div className="dx-built-cell" key={it.title}>
          <div className="dx-built-kind">{it.kind}</div>
          <div className="dx-built-t">{window.renderInline(it.title)}</div>
          <div className="dx-built-s">{window.renderInline(it.sub)}</div>
        </div>
      ))}
    </div>
  );
}
window.DXBuilt = DXBuilt;

/* ─── 직접 짠 것 / 가져다 쓴 것 ──────────────────────── */
function DXScope({ scope }) {
  const ri = window.renderInline;
  return (
    <div className="dx-scope">
      <div className="dx-scope-head">{scope.title}</div>
      <p className="dx-scope-lead">{ri(scope.lead)}</p>
      <div className="dx-scope-cols">
        <div className="dx-scope-col reads">
          <div className="dx-scope-k"><span className="glyph">✓</span> 직접 짰다</div>
          <ul>{scope.reads.map((r, i) => <li key={i}>{ri(r)}</li>)}</ul>
        </div>
        <div className="dx-scope-col skips">
          <div className="dx-scope-k"><span className="glyph">✕</span> 가져다 썼다</div>
          <ul>{scope.skips.map((r, i) => <li key={i}>{ri(r)}</li>)}</ul>
        </div>
      </div>
      <p className="dx-scope-why">{ri(scope.why)}</p>
    </div>
  );
}
window.DXScope = DXScope;
