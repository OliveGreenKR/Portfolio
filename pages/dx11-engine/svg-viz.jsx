// pages/dx11-engine/svg-viz.jsx
// DX11 의 구조·흐름 도표 넷. **페이지와 덱이 같은 그림을 쓴다** — 이 파일이 유일한 원본이다.
//
// 왜 HTML 상자 격자를 버렸는가:
// 상자를 격자에 늘어놓은 도표는 "글이 많은 것"과 구별이 안 된다. 구조도의 값어치는
// **자리와 선**에 있다 — 무엇이 무엇 안에 들어 있는지(포함), 어디서 어디로 가는지(방향),
// 같은 열에 선 것이 왜 같은 열인지(도메인). 상자 나열은 그 셋을 하나도 못 준다.
//
// 각 그림이 쓰는 시각 장치:
//   DXArchitectureViz  2차원 격자 — 세로축 = 소유 계층, 가로축 = 도메인. 층을 가로지르는 선에 방향과 이름.
//   DXFrameFlowViz     타임라인 — 한 프레임이 막대 하나. ② 물리만 아래로 확대(사다리꼴)해 서브스텝을 편다.
//   DXBoundaryViz      영역 + 포함 — 소유를 **상자 안에 넣어서** 표현한다. 통신은 벽을 뚫는 화살표 넷.
//   DXTickViz          게이트 + 루프 — 격리 구간을 음영으로 두르고, 통로 넷이 게이트에서만 드나든다.
//
// ⚠️ 뷰박스 글자는 20 이상으로 잡는다. 덱(1920×1200)에서 그림이 칸 높이에 맞춰 0.82~0.90 배로
//    줄기 때문에, 20 미만이면 16px 판독선 아래로 떨어진다(실측).
//
// 사실은 pages/dx11-engine/data.js 와 knowledge_base 의 _code_audit.md 가 갖는다.
// 여기서 새 사실을 만들지 않는다.

(function defineDX11SvgViz() {
  const RI = (s) => window.renderInline(s);

  // 도표 껍데기. 페이지의 dx-figure 를 그대로 쓰고 dx-svgfig 로 SVG 전용 규칙만 얹는다.
  function Fig({ label, caption, children }) {
    return (
      <figure className="dx-figure dx-svgfig" aria-label={label}>
        <div className="dx-diagram">{children}</div>
        <figcaption>{RI(caption)}</figcaption>
      </figure>
    );
  }

  // 화살표 촉. id 는 도표마다 다르게 준다 — 한 문서에 네 도표가 같이 올라간다.
  function Marks({ id }) {
    return (
      <defs>
        <marker id={`${id}-solid`} viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--ink-3)" />
        </marker>
        <marker id={`${id}-sage`} viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--sage-500)" />
        </marker>
        <marker id={`${id}-terra`} viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--terra-400)" />
        </marker>
      </defs>
    );
  }

  const SVG = (props) => (
    <svg className="dxd-svg" viewBox="0 0 1600 712" preserveAspectRatio="xMidYMid meet"
         role="img" xmlns="http://www.w3.org/2000/svg">{props.children}</svg>
  );

  // 상자 하나 — 제목(mono) + 설명 한두 줄.
  // ⚠️ 좌표를 반드시 숫자로 바꾼다. JSX 에서 x="170" 처럼 문자열로 넘어오면
  //    `x + w / 2` 가 덧셈이 아니라 **문자열 연결**이 되어 글자가 화폭 밖으로 날아간다
  //    (실측: 네 도표의 상자 글자가 전부 사라졌다. 상자만 그려져 빈 칸으로 보였다).
  function Box({ x, y, w, h, title, sub, sub2, tone }) {
    const X = +x, Y = +y, W = +w, H = +h;
    const cx = X + W / 2;
    const fill = tone === 'focus' ? 'var(--sage-50)' : tone === 'plain' ? 'var(--paper)' : 'var(--paper-2)';
    const stroke = tone === 'focus' ? 'var(--sage-500)' : 'var(--rule-2)';
    const ty = sub2 ? Y + 42 : sub ? Y + H / 2 - 4 : Y + H / 2 + 8;
    return (
      <g>
        <rect x={X} y={Y} width={W} height={H} rx="10" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <text className="mono" x={cx} y={ty} textAnchor="middle" fontSize="24" fill="var(--ink)" fontWeight="600">{title}</text>
        {sub && <text x={cx} y={ty + 32} textAnchor="middle" fontSize="21" fill="var(--ink-2)">{sub}</text>}
        {sub2 && <text x={cx} y={ty + 60} textAnchor="middle" fontSize="21" fill="var(--ink-2)">{sub2}</text>}
      </g>
    );
  }

  const Cap = ({ x, y, children, anchor = 'start', tone = 'var(--ink-3)', size = 21 }) => (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={tone} letterSpacing="1.4">{children}</text>
  );

  // ─── 1. 엔진 아키텍처 — 세로축 소유 계층 · 가로축 도메인 ───────────────────
  function DXArchitectureViz() {
    // 왼쪽 240 은 **거터**다. 층 이름을 격자 안에 두면 소유 화살표와 겹친다(실측).
    const COLS = [260, 594, 928, 1262];
    const CW = 298;
    const cx = COLS.map((x) => x + CW / 2);
    const systems = [
      ['UPhysicsSystem', '고정 예산 · 서브스텝'],
      ['URenderer', '상태 버킷 · 제출 처리'],
      ['UResourceManager', '해시 조회 · LRU'],
      ['UInputManager', '우선순위 컨텍스트'],
    ];
    const state = [
      ['FPhysicsStateArrays', '속성 배열 23개'],
      ['FArenaMemoryPool', '8 MB 프레임 아레나'],
      ['FResourceHandle', '불투명 핸들 · 경로 해시'],
      ['TDelegate', 'IBindable · 수명 안전 언바인딩'],
    ];
    const domains = ['물리', '렌더링', '리소스', '입력 · 이벤트'];
    const down = [['등록', 0], ['제출', 1], ['조회', 2]];
    return (
      <Fig
        label="세로축은 소유 계층, 가로축은 도메인으로 배치한 엔진 클래스 관계도"
        caption="같은 **세로줄**에 선 것은 한 도메인이고, 아래로 내려갈수록 **소유되는 쪽**이다. 실선은 소유, 점선은 호출이다."
      >
        <SVG>
          <Marks id="dxa" />
          {/* 도메인 띠 — 같은 열에 선 이유를 배경이 말한다 */}
          {COLS.map((x, i) => (
            <rect key={i} x={x - 14} y="296" width={CW + 28} height="372" rx="14"
                  fill={i % 2 ? 'var(--paper-2)' : 'var(--paper)'} stroke="var(--rule)" strokeDasharray="3 5" />
          ))}
          {domains.map((d, i) => (
            <text key={d} x={cx[i]} y="694" textAnchor="middle" fontSize="21" fill="var(--ink-3)" letterSpacing="2">{d}</text>
          ))}

          {/* 범례 — 거터 아래쪽 */}
          <line x1="40" y1="664" x2="84" y2="664" stroke="var(--ink-3)" strokeWidth="2.5" />
          <text x="94" y="670" fontSize="20" fill="var(--ink-3)">소유</text>
          <line x1="40" y1="698" x2="84" y2="698" stroke="var(--ink-3)" strokeWidth="2" strokeDasharray="6 5" />
          <text x="94" y="704" fontSize="20" fill="var(--ink-3)">호출 · 이벤트</text>

          {/* 층 이름 — 거터에 오른쪽 정렬 */}
          <Cap x="232" y="124" anchor="end" tone="var(--terra-500)">GAME LAYER</Cap>
          <Cap x="232" y="152" anchor="end">객체 수명과 계층</Cap>
          <Cap x="232" y="348" anchor="end" tone="var(--terra-500)">ENGINE SYSTEMS</Cap>
          <Cap x="232" y="376" anchor="end">실행 소유 · 싱글톤</Cap>
          <Cap x="232" y="588" anchor="end" tone="var(--terra-500)">STATE · MEMORY</Cap>
          <Cap x="232" y="616" anchor="end">데이터 소유</Cap>

          {/* 층 1 — 게임 */}
          <rect x="260" y="64" width="1300" height="136" rx="12" fill="var(--paper-2)" stroke="var(--rule)" strokeWidth="1.5" />
          <Box x="280" y="94" w="406" h="76" title="UGameObject" sub="Create&lt;T&gt; · OwnerToken" tone="plain" />
          <Box x="706" y="94" w="406" h="76" title="USceneManager" sub="활성 씬 · Tick 전파" tone="plain" />
          <Box x="1132" y="94" w="406" h="76" title="4단 컴포넌트 트리" sub="Actor → Scene → Primitive" tone="plain" />

          {/* 층 2 — 시스템 */}
          {systems.map(([t, s], i) => (
            <Box key={t} x={COLS[i]} y="300" w={CW} h="120" title={t} sub={s} tone="focus" />
          ))}

          {/* 층 3 — 상태 · 메모리 */}
          {state.map(([t, s], i) => (
            <Box key={t} x={COLS[i]} y="540" w={CW} h="120" title={t} sub={s} />
          ))}

          {/* 게임 → 시스템 (호출) */}
          {down.map(([label, i]) => (
            <g key={label}>
              <line x1={cx[i]} y1="202" x2={cx[i]} y2="292" stroke="var(--ink-3)" strokeWidth="2"
                    strokeDasharray="6 5" markerEnd="url(#dxa-solid)" />
              <text x={cx[i] + 12} y="253" fontSize="21" fill="var(--ink-2)">{label}</text>
            </g>
          ))}
          {/* 입력만 방향이 반대다 — 시스템이 게임에 알린다 */}
          <line x1={cx[3]} y1="298" x2={cx[3]} y2="208" stroke="var(--terra-400)" strokeWidth="2"
                strokeDasharray="6 5" markerEnd="url(#dxa-terra)" />
          <text x={cx[3] + 12} y="253" fontSize="21" fill="var(--terra-500)">이벤트 전달</text>

          {/* 시스템 → 상태 (소유) */}
          {cx.map((x, i) => (
            <g key={i}>
              <line x1={x} y1="422" x2={x} y2="532" stroke="var(--ink-3)" strokeWidth="2.5" markerEnd="url(#dxa-solid)" />
              <text x={x + 12} y="483" fontSize="21" fill="var(--ink-2)">소유</text>
            </g>
          ))}
        </SVG>
      </Fig>
    );
  }
  window.DXArchitectureViz = DXArchitectureViz;

  // ─── 2. 한 프레임 — 타임라인 + ② 물리 확대 ────────────────────────────────
  function DXFrameFlowViz() {
    // 함수 이름은 줄이지 않는다 — 이 그림의 근거다. 한 칸에 안 들어가면 접어서 두 줄로 낸다.
    const phases = [
      ['①', 'INPUT', ['ProcessWindows', 'Message']],
      ['②', 'PHYSICS', ['TickPhysics']],
      ['③', 'LOGIC', ['Resource · Scene', '· Debug Tick']],
      ['④', 'RENDER', ['BeginFrame →', 'ProcessRender']],
      ['⑤', 'UI', ['RenderUI']],
      ['⑥', 'END', ['EndFrame']],
    ];
    const X0 = 80, SW = 240, BY = 112, BH = 132;
    return (
      <Fig
        label="한 프레임을 여섯 구간 막대로 그리고 물리 구간만 아래로 확대한 타임라인"
        caption="여섯 구간의 **차례는 고정**이다. 아래로 편 것은 ② 물리 하나뿐 — 이 구간만 예산을 서브스텝으로 쪼개 돈다."
      >
        <SVG>
          <Marks id="dxf" />
          {/* 프레임 반복 고리 */}
          <path d="M1520 106 L1564 106 L1564 46 L80 46 L80 102" fill="none" stroke="var(--ink-3)"
                strokeWidth="2" strokeDasharray="7 5" strokeLinejoin="round" markerEnd="url(#dxf-solid)" />
          <text x="800" y="36" textAnchor="middle" fontSize="21" fill="var(--ink-3)" letterSpacing="2">매 프레임 반복</text>

          {/* 막대 */}
          {phases.map(([no, name, fn], i) => {
            const x = X0 + SW * i;
            const on = i === 1;
            return (
              <g key={name}>
                <rect x={x} y={BY} width={SW} height={BH} rx={i === 0 ? 10 : i === 5 ? 10 : 3}
                      fill={on ? 'var(--sage-50)' : 'var(--paper-2)'}
                      stroke={on ? 'var(--sage-500)' : 'var(--rule-2)'} strokeWidth={on ? 2 : 1.5} />
                <text x={x + SW / 2} y={BY + 42} textAnchor="middle" fontSize="25"
                      fill={on ? 'var(--sage-900)' : 'var(--ink)'} fontWeight="600">{no} {name}</text>
                {fn.map((line, j) => (
                  <text key={j} className="mono" x={x + SW / 2} y={BY + 76 + j * 28} textAnchor="middle"
                        fontSize="20" fill="var(--ink-2)">{line}</text>
                ))}
              </g>
            );
          })}

          {/* ② 를 아래로 편다 */}
          <path d="M320 244 L180 344 L1420 344 L560 244 Z" fill="var(--sage-50)" opacity="0.7" />
          <path d="M320 244 L180 344 M560 244 L1420 344" fill="none" stroke="var(--sage-500)"
                strokeWidth="1.5" strokeDasharray="7 6" />
          <rect x="180" y="344" width="1240" height="300" rx="14" fill="var(--paper)" stroke="var(--sage-500)" strokeWidth="1.5" />
          <Cap x="206" y="380" tone="var(--terra-500)">② PHYSICS 안쪽</Cap>

          <Box x="222" y="452" w="352" h="160" title="PrepareSimulation" sub="통로 ① 입력 동기화" sub2="통로 ② Job 처리" tone="focus" />
          <Box x="624" y="452" w="352" h="160" title="SimulateSubstep" sub="Gravity → Force → Drag" sub2="→ Integrate → Collision" />
          <Box x="1026" y="452" w="352" h="160" title="FinalizeSimulation" sub="통로 ③ 결과 반환" sub2="통로 ④ 이벤트 배송" tone="focus" />
          <line x1="582" y1="532" x2="616" y2="532" stroke="var(--ink-3)" strokeWidth="2.5" markerEnd="url(#dxf-solid)" />
          <line x1="984" y1="532" x2="1018" y2="532" stroke="var(--ink-3)" strokeWidth="2.5" markerEnd="url(#dxf-solid)" />

          {/* 서브스텝 되돌이 */}
          <path d="M950 450 Q800 396 650 450" fill="none" stroke="var(--sage-500)" strokeWidth="2.5" markerEnd="url(#dxf-sage)" />
          <text x="800" y="422" textAnchor="middle" fontSize="23" fill="var(--sage-900)" fontWeight="700">× N</text>
        </SVG>
      </Fig>
    );
  }
  window.DXFrameFlowViz = DXFrameFlowViz;

  // ─── 3. 물리 구조 — 영역 · 포함 · 벽을 뚫는 통로 넷 ────────────────────────
  function DXBoundaryViz() {
    const owned = [
      ['FPhysicsStateArrays', '속성 배열 23개 · 슬롯 ID 매핑'],
      ['Job 풀 + 큐', '힘 · 임펄스 요청을 모아 실행'],
      ['충돌 이벤트 큐', 'Enter · Stay · Exit'],
      ['FCollisionProcessor', '슬롯 데이터만 보는 충돌 판정'],
    ];
    const held = ['슬롯 ID (PhysicsID)', '입력 3구조체 High / Mid / Low', '결과 캐시', '더티 플래그'];
    // [y, 방향, 번호·이름, 실린 것]
    const lanes = [
      [196, 1, '① 입력 동기화', 'dirty data'],
      [326, 1, '② Job 큐', 'force · impulse'],
      [456, -1, '③ 결과', 'transform · velocity'],
      [586, -1, '④ 이벤트 큐', 'enter · stay · exit'],
    ];
    return (
      <Fig
        label="게임 영역과 물리 영역을 나누고 네 통로만 벽을 지나가게 그린 물리 구조도"
        caption="오른쪽 상자 **안에 들어 있는 것이 곧 소유물**이다. 벽을 지나는 길은 넷뿐이고, 그 밖으로는 아무 값도 오가지 않는다."
      >
        <SVG>
          <Marks id="dxp" />
          {/* 벽 */}
          <line x1="790" y1="86" x2="790" y2="648" stroke="var(--rule-2)" strokeWidth="2" strokeDasharray="9 7" />
          <text x="790" y="66" textAnchor="middle" fontSize="21" fill="var(--ink-3)" letterSpacing="1.5">네 통로 외에는 닫혀 있다</text>

          {/* 게임 영역 */}
          <rect x="60" y="86" width="440" height="562" rx="16" fill="var(--paper-2)" stroke="var(--rule)" strokeWidth="1.5" />
          <Cap x="84" y="122" tone="var(--terra-500)">GAME LAYER</Cap>
          <Box x="84" y="140" w="392" h="104" title="RigidBodyComponent" sub="물리 상태를 직접 들지 않는다" tone="plain" />
          {held.map((t, i) => (
            <g key={t}>
              <rect x="84" y={268 + i * 78} width="392" height="60" rx="8" fill="var(--paper)" stroke="var(--rule)" strokeDasharray="4 4" />
              <text x="280" y={268 + i * 78 + 38} textAnchor="middle" fontSize="21" fill="var(--ink-2)">{t}</text>
            </g>
          ))}
          <text x="280" y="616" textAnchor="middle" fontSize="21" fill="var(--ink-3)">사본과 가리킬 번호만 갖는다</text>

          {/* 물리 영역 — 포함이 곧 소유 */}
          <rect x="1080" y="86" width="460" height="562" rx="16" fill="var(--sage-50)" stroke="var(--sage-500)" strokeWidth="2.5" />
          <Cap x="1104" y="122" tone="var(--sage-900)">UPhysicsSystem 이 소유</Cap>
          {owned.map(([t, s], i) => (
            <Box key={t} x="1104" y={140 + i * 124} w="412" h="104" title={t} sub={s} tone="plain" />
          ))}

          {/* 통로 넷 */}
          {lanes.map(([y, dir, name, load]) => {
            const c = dir > 0 ? 'var(--sage-500)' : 'var(--terra-400)';
            const tone = dir > 0 ? 'var(--sage-900)' : 'var(--terra-500)';
            const x1 = dir > 0 ? 512 : 1068;
            const x2 = dir > 0 ? 1068 : 512;
            const mk = dir > 0 ? 'url(#dxp-sage)' : 'url(#dxp-terra)';
            return (
              <g key={name}>
                <line x1={x1} y1={y} x2={x2} y2={y} stroke={c} strokeWidth="2.5" markerEnd={mk} />
                <rect x="620" y={y - 46} width="340" height="40" fill="var(--paper)" />
                <rect x="640" y={y + 8} width="300" height="34" fill="var(--paper)" />
                <text x="790" y={y - 18} textAnchor="middle" fontSize="22" fill={tone} fontWeight="600">{name}</text>
                <text className="mono" x="790" y={y + 34} textAnchor="middle" fontSize="20" fill="var(--ink-3)">{load}</text>
              </g>
            );
          })}
        </SVG>
      </Fig>
    );
  }
  window.DXBoundaryViz = DXBoundaryViz;

  // ─── 4. 한 틱 — 게이트 둘과 격리 구간 ────────────────────────────────────
  function DXTickViz() {
    const inGates = [[220, '① 입력 동기화'], [390, '② Job 처리']];
    const outGates = [[1210, '③ 결과 반환'], [1390, '④ 이벤트 배송']];
    return (
      <Fig
        label="준비와 마무리 게이트 사이에 격리 구간을 둔 물리 틱 구조"
        caption="× N 의 **N 은 고정이 아니다**. 고정인 것은 한 틱의 예산이고, 서브스텝이 그 예산을 나눠 갖는다."
      >
        <SVG>
          <Marks id="dxt" />
          {/* 격리 구간 */}
          <rect x="560" y="196" width="480" height="392" rx="16" fill="var(--paper-2)" stroke="var(--rule-2)" strokeWidth="2" strokeDasharray="9 7" />
          <Cap x="582" y="230" tone="var(--terra-500)">격리 구간</Cap>
          <text x="800" y="622" textAnchor="middle" fontSize="21" fill="var(--ink-3)">게임 객체를 읽거나 쓰지 않는다</text>

          {/* 게이트와 본체 */}
          <Box x="120" y="290" w="360" h="140" title="PrepareSimulation" sub="GATE IN · 한 번" tone="focus" />
          <Box x="620" y="290" w="360" h="140" title="SimulateSubstep" sub="REPEAT · 예산을 나눠" tone="plain" />
          <Box x="1120" y="290" w="360" h="140" title="FinalizeSimulation" sub="GATE OUT · 한 번" tone="focus" />
          <line x1="490" y1="360" x2="610" y2="360" stroke="var(--ink-3)" strokeWidth="2.5" markerEnd="url(#dxt-solid)" />
          <line x1="990" y1="360" x2="1110" y2="360" stroke="var(--ink-3)" strokeWidth="2.5" markerEnd="url(#dxt-solid)" />

          {/* 되돌이 */}
          <path d="M960 286 Q800 214 640 286" fill="none" stroke="var(--sage-500)" strokeWidth="2.5" markerEnd="url(#dxt-sage)" />
          <text x="800" y="204" textAnchor="middle" fontSize="25" fill="var(--sage-900)" fontWeight="700">× N</text>

          {/* 서브스텝 안쪽 */}
          <line x1="800" y1="432" x2="800" y2="470" stroke="var(--rule-2)" strokeWidth="2" />
          <text className="mono" x="800" y="506" textAnchor="middle" fontSize="21" fill="var(--ink-2)">Gravity → Force → Drag</text>
          <text className="mono" x="800" y="540" textAnchor="middle" fontSize="21" fill="var(--ink-2)">→ Integrate → Collision</text>

          {/* 통로가 드나드는 곳은 게이트뿐이다 */}
          {inGates.map(([x, label]) => (
            <g key={label}>
              <text x={x} y="132" textAnchor="middle" fontSize="21" fill="var(--sage-900)">{label}</text>
              <line x1={x} y1="150" x2={x} y2="282" stroke="var(--sage-500)" strokeWidth="2.5" markerEnd="url(#dxt-sage)" />
            </g>
          ))}
          {outGates.map(([x, label]) => (
            <g key={label}>
              <text x={x} y="132" textAnchor="middle" fontSize="21" fill="var(--terra-500)">{label}</text>
              <line x1={x} y1="282" x2={x} y2="150" stroke="var(--terra-400)" strokeWidth="2.5" markerEnd="url(#dxt-terra)" />
            </g>
          ))}
        </SVG>
      </Fig>
    );
  }
  window.DXTickViz = DXTickViz;
})();
