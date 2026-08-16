// Code-native diagrams. Every figure replaces prose; none represents measured performance.

function DXFigure({ label, caption, children, className = '' }) {
  return (
    <figure className={`dx-figure ${className}`} aria-label={label}>
      <div className="dx-diagram">{children}</div>
      <figcaption>{window.renderInline(caption)}</figcaption>
    </figure>
  );
}

function DXArrow({ label }) {
  return <div className="dx-arrow" aria-hidden="true"><span>{label}</span><b>→</b></div>;
}

function DXNode({ eyebrow, title, sub, tone = '' }) {
  return <div className={`dx-node ${tone}`}><span>{eyebrow}</span><strong>{title}</strong>{sub && <small>{sub}</small>}</div>;
}

function DXEngineOverviewViz() {
  return (
    <DXFigure
      label="입력부터 Present와 프레임 정리까지 이어지는 엔진 전체 구조"
      caption="위는 메인 루프의 **주요 호출 흐름**, 아래는 그 흐름을 받치는 공통 시스템이다. 물리는 전체 엔진의 한 단계이며, 가장 깊게 재설계한 영역이다."
      className="dx-engine-map"
    >
      <div className="dx-diagram-label">RUNTIME · EVERY FRAME</div>
      <div className="dx-runtime-flow">
        <DXNode eyebrow="01" title="Input" sub="WinMsg · Context" />
        <DXArrow />
        <DXNode eyebrow="02" title="Physics" sub="fixed budget · collision" tone="focus" />
        <DXArrow />
        <DXNode eyebrow="03" title="Scene" sub="object tick · submit" />
        <DXArrow />
        <DXNode eyebrow="04" title="Render" sub="bucket · bind · draw" />
        <DXArrow />
        <DXNode eyebrow="05" title="UI / Present" sub="ImGui · swap chain" />
      </div>
      <div className="dx-support-line"><span>supports the frame</span></div>
      <div className="dx-support-grid">
        <DXNode eyebrow="CORE" title="GameObject / Component" sub="수명 · Transform 전파" />
        <DXNode eyebrow="DATA" title="Resource" sub="Hash Handle · LRU" />
        <DXNode eyebrow="MEMORY" title="Frame / Object Pools" sub="수명별 할당 전략" />
        <DXNode eyebrow="TOOLS" title="Debug" sub="Console · Draw · D3D 검사" />
      </div>
    </DXFigure>
  );
}
window.DXEngineOverviewViz = DXEngineOverviewViz;

function DXBoundaryViz() {
  const lanes = [
    ['게임 → 물리', '입력 동기화', 'dirty data'],
    ['게임 → 물리', 'Job 큐', 'force · impulse'],
    ['물리 → 게임', '결과', 'transform · velocity'],
    ['물리 → 게임', '이벤트 큐', 'enter · stay · exit'],
  ];
  return (
    <DXFigure
      label="게임 영역과 물리 영역 사이의 네 통로"
      caption="게임 객체는 **슬롯 ID**로 물리를 가리키고 동기화용 값만 남긴다. 시뮬레이션의 원본 상태는 중앙 배열이 소유한다."
      className="dx-boundary"
    >
      <div className="dx-boundary-grid">
        <DXNode eyebrow="GAME WORLD" title="RigidBodyComponent" sub="ID · input · result cache" />
        <div className="dx-lanes">{lanes.map(([dir, title, sub]) => <div className={`dx-lane ${dir.startsWith('물리') ? 'reverse' : ''}`} key={title}><span>{dir}</span><strong>{title}</strong><small>{sub}</small></div>)}</div>
        <DXNode eyebrow="PHYSICS WORLD" title="FPhysicsStateArrays" sub="23 property arrays" tone="focus" />
      </div>
    </DXFigure>
  );
}
window.DXBoundaryViz = DXBoundaryViz;

function DXSyncTierViz() {
  const tiers = [
    { key: 'HIGH', when: '매 틱 변할 수 있음', fields: 'Position · Rotation · Scale' },
    { key: 'MID', when: '상태 변경 시', fields: 'Physics Type · Active / Gravity Mask' },
    { key: 'LOW', when: '드물게 변경', fields: 'Mass · Inertia · Friction · Shape · Limits' },
  ];
  return (
    <DXFigure
      label="갱신 빈도에 따른 물리 입력 동기화 3계층"
      caption="세 계층은 이름만 나눈 플래그가 아니다. **구조체와 순회 함수도 각각 분리**되어, 더티가 선 계층만 중앙 배열에 반영된다."
      className="dx-sync"
    >
      <div className="dx-tier-head"><span>GAME INPUT</span><span>DIRTY ONLY</span><span>PHYSICS SoA</span></div>
      <div className="dx-tier-list">
        {tiers.map(tier => (
          <div className="dx-tier" key={tier.key}>
            <div className="dx-tier-name"><strong>{tier.key}</strong><small>{tier.when}</small></div>
            <div className="dx-tier-data"><span>{tier.fields}</span><i></i></div>
            <div className="dx-tier-gate"><b>flag?</b><span>→</span></div>
            <div className="dx-tier-target">selected SoA arrays</div>
          </div>
        ))}
      </div>
      <div className="dx-return-flow"><span>PHYSICS → GAME</span><strong>FPhysicsToGameData</strong><b>+</b><strong>Collision Event Queue</strong></div>
    </DXFigure>
  );
}
window.DXSyncTierViz = DXSyncTierViz;

function DXTickViz() {
  return (
    <DXFigure
      label="준비, 서브스텝 반복, 마무리로 구성한 물리 틱"
      caption="입력·Job은 준비에서 받고 결과·이벤트는 마무리에서 돌려준다. **반복 구간은 물리 데이터만 본다.**"
      className="dx-tick"
    >
      <div className="dx-stack">
        <DXNode eyebrow="GATE IN · ONCE" title="PrepareSimulation" sub="Sync input · Process jobs · Update tree" tone="focus" />
        <DXArrow label="enter isolated simulation" />
        <DXNode eyebrow="REPEAT · × N" title="SimulateSubstep" sub="Collision → Gravity/Force/Drag → Integrate → Reset" />
        <DXArrow label="leave isolated simulation" />
        <DXNode eyebrow="GATE OUT · ONCE" title="FinalizeSimulation" sub="Return result · Flush collision events" tone="focus" />
      </div>
    </DXFigure>
  );
}
window.DXTickViz = DXTickViz;

function DXCollisionPipelineViz() {
  return (
    <DXFigure
      label="후보 생성부터 충돌 응답과 이벤트까지 네 단계 파이프라인"
      caption="모든 단계는 컴포넌트 대신 **슬롯 ID와 형상 배열**을 읽는다. 설정값은 코드 밖으로 뺐지만, 성능 개선량은 계측하지 않았다."
      className="dx-pipeline"
    >
      <div className="dx-pipeline-input">Physics ID · Position · Shape · Velocity</div>
      <div className="dx-pipeline-flow">
        <DXNode eyebrow="BROAD" title="Dynamic AABB Tree" sub="Fat bounds · candidate pairs" />
        <DXArrow />
        <DXNode eyebrow="FAST BODY" title="Swept Test" sub="movement volume · TOI search" />
        <DXArrow />
        <DXNode eyebrow="NARROW" title="Shape Test" sub="Box SAT 15축 · Sphere pair tests" />
        <DXArrow />
        <DXNode eyebrow="SOLVE" title="Response" sub="Impulse · position · events" tone="focus" />
      </div>
    </DXFigure>
  );
}
window.DXCollisionPipelineViz = DXCollisionPipelineViz;

function DXRenderPipelineViz() {
  return (
    <DXFigure
      label="씬 제출부터 D3D11 Draw와 Present까지의 렌더링 파이프라인"
      caption="씬은 렌더 데이터를 제출하고, 렌더러가 **상태·수명·바인딩**을 책임진다. Reflection과 디버거는 실행 경로의 입력·검증에 붙는다."
      className="dx-render"
    >
      <div className="dx-pipeline-flow">
        <DXNode eyebrow="SUBMIT" title="Scene / Primitive" sub="RenderJob · RenderData" />
        <DXArrow />
        <DXNode eyebrow="GROUP" title="State Buckets" sub="Solid · Wireframe" />
        <DXArrow />
        <DXNode eyebrow="EXECUTE" title="RenderContext" sub="internal cache compare · bind" tone="focus" />
        <DXArrow />
        <DXNode eyebrow="D3D11" title="Draw / Present" sub="device context · swap chain" />
      </div>
      <div className="dx-render-support">
        <div><span>BUILD</span><strong>Shader Reflection</strong><small>Input Layout · Constant Buffer · Resource Binding</small></div>
        <div><span>LIFETIME</span><strong>8 MB Frame Arena</strong><small>RenderData allocation · next-frame reset</small></div>
        <div><span>VERIFY</span><strong>D3D Context Debugger</strong><small>Capture · Validate · Buffer dump</small></div>
      </div>
    </DXFigure>
  );
}
window.DXRenderPipelineViz = DXRenderPipelineViz;

function DXFoundationViz() {
  const items = [
    ['OBJECT / SCENE', '4단 컴포넌트 트리', 'Actor → Scene → Primitive · Transform 전파'],
    ['RESOURCE', 'Hash Handle + LRU', '경로 해시 조회 · 미사용 리소스 정리'],
    ['INPUT / EVENT', 'Context + Delegate', '우선순위 입력 · 수명 안전 언바인딩'],
    ['MEMORY / DEBUG', '수명별 풀 + 도구', 'Arena · Object Pool · Ring Buffer · Console/Draw'],
  ];
  return (
    <DXFigure
      label="게임 실행을 받치는 코어와 인프라 네 영역"
      caption="코어와 인프라는 부록이 아니다. 오브젝트의 **수명·참조·이벤트·임시 메모리**를 정해 물리와 렌더링이 같은 규칙 위에서 돌게 한다."
      className="dx-foundation"
    >
      <div className="dx-foundation-center">ENGINE RUNTIME</div>
      <div className="dx-foundation-grid">{items.map(([kind, title, sub]) => <DXNode key={kind} eyebrow={kind} title={title} sub={sub} />)}</div>
    </DXFigure>
  );
}
window.DXFoundationViz = DXFoundationViz;
