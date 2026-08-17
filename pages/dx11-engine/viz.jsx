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
