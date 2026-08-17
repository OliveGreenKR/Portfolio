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

// 정적 구조 — 누가 무엇을 소유하는가. 위의 DXEngineOverviewViz 가 "프레임이 지나가는 자리"
// 라면 이쪽은 "그 자리에 선 클래스와 소유 관계" 다. 두 그림은 축이 다르다.
//
// 감사표(_code_audit.md)가 폐기 판정한 것은 넣지 않는다 — FVelocityConstraint(죽은 코드),
// GJK/EPA(리포에 없음), bIsUpdatingFromParent(참조 0인 죽은 플래그).
function DXArchitectureViz() {
  const layers = [
    ['GAME LAYER', '객체 수명과 계층', [
      ['UGameObject', 'Create<T> 팩토리 · OwnerToken'],
      ['USceneManager', '활성 씬 · Tick 전파'],
      ['4단 컴포넌트 트리', 'UActorComponent → USceneComponent → UPrimitiveComponent'],
    ]],
    ['ENGINE SYSTEMS', '실행 소유 · 싱글톤', [
      ['UPhysicsSystem', '고정 예산 · 서브스텝'],
      ['URenderer', '상태 버킷 · 제출 처리'],
      ['UResourceManager', '해시 조회 · LRU'],
      ['UInputManager', '우선순위 컨텍스트'],
    ]],
    ['STATE / MEMORY', '데이터 소유', [
      ['FPhysicsStateArrays', '속성 배열 23개'],
      ['FArenaMemoryPool', '8 MB 프레임 아레나'],
      ['FResourceHandle', '불투명 핸들 · 경로 해시'],
      ['TDelegate / IBindable', '수명 안전 언바인딩'],
    ]],
  ];
  const edges = [
    ['소유', 'UPhysicsSystem → FPhysicsStateArrays', '슬롯 ID 발급 · 배열 원본'],
    ['등록', 'UGameObject → UPhysicsSystem', '컴포넌트가 슬롯을 받는다'],
    ['제출', 'USceneManager → URenderer', 'RenderJob 만 넘긴다'],
    ['할당', 'URenderer → FArenaMemoryPool', 'RenderData 프레임 수명'],
    ['조회', 'UPrimitiveComponent → UResourceManager', '모델 · 머티리얼 핸들'],
    ['디스패치', 'UInputManager → TDelegate', '컨텍스트 → 액션 → 콜백'],
  ];
  return (
    <DXFigure
      label="게임 레이어, 엔진 시스템, 상태와 메모리 세 층의 클래스 소유 관계"
      caption="소스 파일은 폴더로 갈라져 있지 않다. 세 층은 파일 위치가 아니라 **소유권으로 나눈 논리적 묶음**이다."
      className="dx-arch"
    >
      <div className="dx-arch-layers">
        {layers.map(([kind, role, rows]) => (
          <div className="dx-arch-layer" key={kind}>
            <div className="dx-arch-layer-head"><b>{kind}</b><span>{role}</span></div>
            <div className="dx-arch-cells">
              {rows.map(([name, sub]) => (
                <div className="dx-arch-cell" key={name}><strong>{name}</strong><small>{sub}</small></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="dx-arch-edge-head">CROSS-LAYER RELATIONS</div>
      <div className="dx-lanes dx-arch-edges">
        {edges.map(([kind, path, sub]) => (
          <div className="dx-lane" key={path}><span>{kind}</span><strong>{path}</strong><small>{sub}</small></div>
        ))}
      </div>
    </DXFigure>
  );
}
window.DXArchitectureViz = DXArchitectureViz;

// 동적 순서 — 한 프레임에 어떤 호출이 어떤 차례로 도는가.
function DXFrameFlowViz() {
  const phases = [
    ['①', 'INPUT', 'ProcessWindowsMessage', '우선순위 순 컨텍스트 순회'],
    ['②', 'PHYSICS', 'TickPhysics', '예산 누적 → Prepare → Substep × N → Finalize', true],
    ['③', 'LOGIC', 'Resource · Scene · Debug Tick', 'LRU 점검 · 씬 전환 · 오브젝트 갱신'],
    ['④', 'RENDER', 'BeginFrame → ProcessRender', '제출 수집 → 상태 버킷 → 바인딩 → Draw'],
    ['⑤', 'UI', 'RenderUI', '씬 ImGui · 등록 요소 렌더'],
    ['⑥', 'END', 'EndFrame', 'Present · 아레나 리셋 · 콘솔 flush'],
  ];
  return (
    <DXFigure
      label="입력부터 프레임 정리까지 여섯 단계로 도는 메인 루프"
      caption="①과 ⑥이 프레임의 문이다. 입력을 받는 곳과 **아레나·콘솔을 비우는 곳**이 프레임마다 한 번씩만 열린다."
      className="dx-frame"
    >
      <div className="dx-frame-track">
        {phases.map(([no, kind, call, sub, focus]) => (
          <div className={'dx-frame-step' + (focus ? ' focus' : '')} key={kind}>
            <div className="dx-frame-no">{no}</div>
            <div className="dx-frame-body">
              <span>{kind}</span>
              <strong>{call}</strong>
              <small>{sub}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="dx-frame-loop">프레임 끝 · 다음 프레임으로 되돌아간다</div>
    </DXFigure>
  );
}
window.DXFrameFlowViz = DXFrameFlowViz;

// 물리 절의 첫 그림 — 이 파트의 **정적 구조**다.
// 왼쪽이 무엇을 들고 있고, 오른쪽이 무엇을 소유하며, 그 사이에 통로가 몇 개인지를 한 프레임에 세운다.
// 통로에 ①~④ 번호를 붙이는 이유: 뒤에 오는 세부 그림이 어느 통로의 안쪽인지 번호로 이어진다.
function DXBoundaryViz() {
  const lanes = [
    ['①', '게임 → 물리', '입력 동기화', 'dirty data'],
    ['②', '게임 → 물리', 'Job 큐', 'force · impulse'],
    ['③', '물리 → 게임', '결과', 'transform · velocity'],
    ['④', '물리 → 게임', '이벤트 큐', 'enter · stay · exit'],
  ];
  const owned = [
    ['STATE', 'FPhysicsStateArrays', '속성 배열 23개 · 슬롯 ID 매핑'],
    ['JOB', 'Job 풀 + 큐', '힘 · 임펄스 요청을 모아 실행'],
    ['EVENT', '충돌 이벤트 큐', 'Enter / Stay / Exit'],
    ['SUB', 'FCollisionProcessor', '슬롯 데이터만 보는 충돌 서브시스템'],
  ];
  return (
    <DXFigure
      label="게임 영역이 든 것, 물리 영역이 소유한 것, 그 사이 네 통로"
      caption="왼쪽은 **가리키기만** 하고 오른쪽이 값을 갖는다. 충돌 판정도 게임 객체가 아니라 이 배열만 보고 돈다."
      className="dx-boundary"
    >
      <div className="dx-boundary-grid">
        <DXNode eyebrow="GAME LAYER" title="RigidBodyComponent" sub="슬롯 ID · 입력 3구조체 · 결과 캐시 · 더티 플래그" />
        <div className="dx-lanes">{lanes.map(([no, dir, title, sub]) => <div className={`dx-lane ${dir.startsWith('물리') ? 'reverse' : ''}`} key={title}><span>{no} {dir}</span><strong>{title}</strong><small>{sub}</small></div>)}</div>
        <div className="dx-owned">
          <div className="dx-owned-head">UPhysicsSystem 이 소유</div>
          {owned.map(([kind, title, sub]) => (
            <div className="dx-owned-row" key={kind}><span>{kind}</span><strong>{title}</strong><small>{sub}</small></div>
          ))}
        </div>
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
      caption="× N 의 N 은 고정이 아니다. 고정인 것은 **한 틱의 예산**이고, 서브스텝은 그 예산을 나눠 갖는다."
      className="dx-tick"
    >
      <div className="dx-stack">
        <DXNode eyebrow="GATE IN · ONCE" title="PrepareSimulation" sub="통로 ① 입력 동기화 · 통로 ② Job 처리 · 트리 갱신" tone="focus" />
        <DXArrow label="enter isolated simulation" />
        <DXNode eyebrow="REPEAT · × N" title="SimulateSubstep" sub="Gravity / Force / Drag → Integrate → Collision" />
        <DXArrow label="leave isolated simulation" />
        <DXNode eyebrow="GATE OUT · ONCE" title="FinalizeSimulation" sub="통로 ③ 결과 반환 · 통로 ④ 충돌 이벤트 배송" tone="focus" />
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
