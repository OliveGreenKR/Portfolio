// pages/dx11-engine/data.js
// PersonalDx11Engine — C++17 / DirectX 11 개인 학습 엔진. 1인.
// 출처: github.com/OliveGreenKR/PersonalDx11Engine, 브랜치 `mine` (master + 104 커밋).
//
// ⚠️ 순서 — 이 페이지는 §02 안에서만 **진짜 인과가 있다.**
//   소유권을 옮긴다 → 값을 넣는 법 → 힘을 주는 법 → 배열식 순회 → 구멍을 모은다.
//   handoff 배너는 §02 안에서만 쓴다. §03·04·05·06 은 서로 인과가 없어 다리를 놓지 않는다.
//
// ⚠️ 문장 규칙
//   1. 한 덩이는 한 문장. 문제 한 줄 → 한 것 한 줄 → 요점 한 줄씩.
//   2. 앞 절이 뒤 절의 원인이 아니면 잇지 않는다. 인과가 없으면 중요한 것부터.
//   3. 제목에 비유·대구 금지. 제목만 읽고 무슨 얘긴지 몰라야 하는 제목은 실패다.
//   4. 굵게는 3~8자 핵심 구에만. 절이나 문장을 통째로 감싸지 않는다.
//   5. 튜닝 설정값은 본문에서 뺀다 — 구조만 말한다. 값은 "Config.ini 로 뺐다" 는 사실만.
//   6. 같은 사실을 두 곳에서 말하지 않는다. handoff 의 답이 다음 항의 제목과 같으면 다리가 아니다.
//
// ⚠️ 사실 규칙 — 전부 코드 대조로 확정한 것만 쓴다 (2026-08-01 감사).
//   1. **본문 성능 주장 금지.** 프로파일러 측정본이 하나도 없다.
//      본문에서 버린 것 — "터널링 안전속도 5 → 25 m/s"(근거 없음)
//      · "60↔30fps 결과 동일"(리플레이·시드 고정 코드 없음) · "Warm Start 반복 4 → 2 회"(조작 수치)
//      "15 → 60 fps" 만 §07 limits 에 둔다 — 측정 방법(프레임 디버거 · 같은 PC/빌드)과
//      재현 불가 사유(씬 구성 · 객체 수 미기록)를 같이 적는 조건으로만.
//      · "순환 참조 버그 0건"(검증 불가) · "FDynamicAABBTree 단위 테스트"(테스트 파일 없음).
//   2. 고친 수치 — 소스 파일 147 → **137** (h86 · cpp46 · hlsl5) / 기간 16주(2025.02–06) →
//      **2025.01 – 2025.08** (커밋 586) / SoA 배열 9개 → **23개** /
//      PhysicsID "index + generation" → **generation 필드 없음**, 압축 시 재사용 목록 초기화.
//   3. **통로는 셋이 아니라 넷이다.** 게임→물리 = 입력 동기화 · Job 큐 /
//      물리→게임 = 결과 한 덩이(SyncPhysicsToGame) · 충돌 이벤트 큐(SyncPhysicsEvents).
//      넷 다 PrepareSimulation / FinalizeSimulation 안, 즉 서브스텝 반복 **바깥**에 있다.
//   4. 튜닝 상수는 전부 Config.ini 라 코드 기본값과 실제 값이 다르다. 그래서 **본문에 숫자를 쓰지 않는다.**
//      (MaxSubSteps 6 · FatBoundsExtentRatio 0.2 · CCDVelocityThreshold 5.0 · JobPool 1MB 등)
//      예외 = 코드에 상수로 박혀 구조 자체인 것만 — SAT 15축 · SRV 16슬롯 · 배치 64 · 아레나 8MB.
//   5. **표준 기법을 발명처럼 쓰지 않는다.** SAH 트리 · Sequential Impulse · Warm Starting ·
//      아레나 · 오브젝트 풀은 전부 표준이다. 쓴 이유와 이 프로젝트에서 정한 것만 적는다.
//   6. 히어로 3칸은 성과 수치가 아니라 **만든 것**이다. 규모를 성과인 척 세우지 않는다.
//   7. "재지 않았다"(변명)는 §07 에 모은다. 반대로 "이렇게 확인했다"(실제로 한 절차)는 본문에 남긴다.
//
// renderInline 이 아는 마크업은 **굵게** / `코드` / *기울임* 뿐. 중첩 금지.
// AsciiBlock 의 intro·result 는 마크업을 안 태우므로 백틱을 쓰지 않는다.

window.DX11_DATA = {
  meta: {
    eyebrow: 'MAIN · 06 ─ 개인 프로젝트 · 1인',
    subtitle: 'PersonalDx11Engine',
    title: '물리 상태를 게임 객체 밖으로',
    pills: [
      { kind: 'accent', text: '2025.01 – 2025.08 · 1인' },
      { kind: 'plain',  text: 'C++17 · DirectX 11 · HLSL' },
      { kind: 'plain',  text: 'DirectXMath · ImGui' },
      { kind: 'accent', text: '엔진 프로그래머 (전 영역)' },
    ],
  },

  hook:
    '물리 속성을 게임 객체가 들고 있으면 시뮬레이션을 게임 로직에서 떼어낼 수 없다. ' +
    '소유권을 물리 쪽 **중앙 배열**로 옮기고, 두 쪽이 서로를 부르는 경로를 통로 넷으로 좁혔다.',

  hero: {
    img: 'dx11-engine/assets/hero.png',
    caption:
      '탄성체를 좁은 공간에 몰아넣은 테스트 씬 — 오른쪽 콘솔이 충돌 트리를 리프 33개 · 노드 65개로 찍는다.',
  },

  // 히어로 3칸 = 만든 것. 성과 지표가 아니다 — 개선 전후를 비교할 계측본이 없다.
  built: [
    { kind: 'BOUNDARY',  title: '게임 ↔ 물리 데이터 경계',
      sub: '시뮬레이션 상태는 배열이 갖고, 두 쪽을 잇는 통로는 넷뿐이다.' },
    { kind: 'COLLISION', title: '컴포넌트를 모르는 충돌 파이프라인',
      sub: '브로드페이즈부터 응답까지 슬롯 ID 와 형상 데이터만 본다.' },
    { kind: 'RENDER',    title: '상태 버킷 · 프레임 아레나 · 바인딩 캐시',
      sub: '셰이더 서술자는 바이트코드에서 읽어 만들고, 렌더 데이터는 프레임마다 통째로 버린다.' },
  ],

  // ─── §01 배경 ───────────────────────────────────────────
  context: {
    body:
      '상용 엔진을 쓰면 물리와 렌더가 이미 **돌아가는 상태**에서 시작한다.',
    body2:
      '그 안쪽을 알려면 직접 짜 보는 것 말고 방법이 없어, D3D11 위에 엔진을 올렸다.',
    facts: [
      ['프로젝트', 'PersonalDx11Engine — 개인 학습용 3D 게임 엔진'],
      ['기간',     '2025.01 – 2025.08 (커밋 586)'],
      ['팀',       '1인'],
      ['규모',     '소스 137개 — 헤더 86 · 구현 46 · HLSL 5'],
      ['환경',     'C++17 · DirectX 11 · Visual Studio 2022 · DirectXMath · ImGui'],
      ['문서 범위', '물리 · 충돌 · 프레임 루프 · 렌더링 · 엔진 코어'],
    ],
    scope: {
      title: '무엇을 직접 짰고 무엇을 가져다 썼나',
      lead: '엔진 구조는 전부 직접 설계했다. 아래 셋은 가져다 썼다.',
      reads: [
        '물리 · 충돌 · 렌더 파이프라인 · 컴포넌트 · 메모리 · 리소스 · 입력',
        '자료구조 — 동적 AABB 트리 · 아레나 · 고정 풀 · 링 버퍼 · 문자열 해시',
      ],
      skips: [
        'DirectX 11 API — 디바이스 · 셰이더 컴파일 · 리플렉션',
        'DirectXMath — 벡터 · 행렬 · 쿼터니언 연산',
        'ImGui — 디버그 UI',
      ],
      why:
        '**성능 수치**는 이 페이지에 없다 — 화면 fps 카운터로 보긴 했지만 조건을 남기지 않아, ' +
        '코드로 참·거짓이 갈리는 것만 싣고 재지 못한 것은 마지막 절에 모았다.',
    },
  },

  // ─── §02 데이터 소유권 — 이 페이지의 본체 ───────────────
  boundary: {
    gist: '물리 속성의 소유권을 게임 객체에서 떼어내 **중앙 배열**로 옮겼다.',
    lede:
      '아래 다섯은 순서가 곧 인과다 — 소유권을 옮기면 값을 넣는 법과 힘을 주는 법을, ' +
      '배열이 생기면 순회 방식과 빈 슬롯 처리를 새로 정해야 한다.',
    steps: [
      {
        key: 'own', no: 'a', rail: '소유권', title: '소유권을 배열로 옮긴다',
        problem: '처음에는 게임 객체가 물리 상태를 게임용 · 시뮬용 두 벌로 들고 서로 맞췄다 — 시뮬레이션이 객체를 하나씩 따라다니며 값을 꺼내야 했다.',
        did: '시뮬레이션이 읽고 쓰는 상태를 `FPhysicsStateArrays` 안의 속성 배열 23개로 옮기고, 게임 객체에는 넘길 입력과 받은 결과만 남겼다.',
        points: [
          ['속성마다 배열 하나', '속도 · 각속도 · 누적힘 · 토크 · 월드 트랜스폼은 `XMVECTOR` 배열, 역질량 · 마찰 · 반발은 `float` 배열로 나눠 담는다.'],
          ['객체는 배열을 못 만진다', '게임 객체는 슬롯 ID 와 넘길 입력 · 받은 결과를 들지만, 시뮬레이션이 도는 동안의 값은 배열에만 있다.'],
          ['등록도 슬롯 단위', '`AllocateSlot` 이 ID 를 발급하고 `DeallocateSlot` 이 반납하며, 객체는 약한 참조로만 배열에 걸린다.'],
          ['충돌 형상도 같이', '형상 종류와 월드 반 크기까지 이 배열에 둔다 — 충돌 파이프라인이 컴포넌트를 안 보게 하려면 여기 있어야 한다.'],
          ['옮기고 나서 열린 것', '충돌 파이프라인에서 게임 쪽 헤더 의존이 빠졌고, 배열을 구간으로 나눠 돌 여지가 생겼다 — 실제로 스레드를 띄우지는 않았다.'],
        ],
        viz: 'boundary',
        code: {
          title: 'FPhysicsStateArrays — 속성별 배열 (발췌)',
          intro: '한 객체의 상태가 한 구조체에 모이지 않고, 같은 속성끼리 모인다.',
          code: `// 운동 상태
std::vector<XMVECTOR> Velocities;
std::vector<XMVECTOR> AngularVelocities;
std::vector<XMVECTOR> AccumulatedForces;
std::vector<XMVECTOR> AccumulatedTorques;

// 트랜스폼
std::vector<XMVECTOR> WorldPosition;
std::vector<XMVECTOR> WorldRotationQuat;
std::vector<XMVECTOR> PrevWorldPosition;      // 스윕 판정이 읽는다

// 물리 속성
std::vector<float>    InvMasses;
std::vector<float>    FrictionKinetics;
std::vector<float>    Restitutions;

// 충돌 형상 — 충돌 쪽이 컴포넌트를 안 보게 하려고 여기 둔다
std::vector<ECollisionShapeType> CollisionShapeTypes;
std::vector<XMVECTOR>            CollisionWorldHalfExtents;

// 객체는 약한 참조로만 걸린다
std::vector<std::weak_ptr<IPhysicsObject>> ObjectReferences;`,
          result: '속성 배열이 23개로 늘어도 순회 코드는 인덱스 하나로 전부를 짚는다.',
        },
        handoff: {
          q: '소유권이 넘어갔으면 게임이 준 값은 어떻게 배열로 들어가나.',
          a: '전부 매 틱 옮기면 경계를 나눈 뜻이 없다 — **무엇을 언제** 옮길지 정해야 한다.',
        },
      },
      {
        key: 'recv', no: 'b', rail: '입력', title: '입력 동기화 — 갱신 빈도로 나눈다',
        problem: '트랜스폼은 매 틱 바뀌고 질량은 거의 안 바뀌는데, 같이 넘기면 매번 전부를 복사한다.',
        did: '게임이 들고 있는 물리 입력을 갱신 빈도로 **세 구조체**에 나누고, 더티 플래그가 선 것만 넘긴다.',
        points: [
          ['플래그만이 아니라 그릇도 나눴다', '`FHighFrequencyData` · `FMidFrequencyData` · `FLowFrequencyData` — 담는 구조체 자체가 셋이다.'],
          ['순회도 셋 따로', '`BatchSyncHighFrequencyData` 부터 Low 것까지 셋이 각자 배열을 훑고, 끝나면 플래그를 일괄로 내린다.'],
          ['돌아오는 길은 둘', '물리 결과는 `FPhysicsToGameData` 한 덩이로, 충돌 이벤트는 링 버퍼에 쌓아 두었다가 따로 비운다.'],
          ['최종 권한은 물리에 있다', '게임이 트랜스폼을 바꾸면 다음 틱의 입력이 되고, 그 틱의 결과 트랜스폼이 게임 쪽에 다시 쓰인다.'],
        ],
        tableTitle: '게임 쪽이 드는 것 — 무엇을 담고 언제 도는가',
        table: {
          headers: ['구조체', '담는 것', '바뀌는 때'],
          rows: [
            ['FHighFrequencyData', '위치 · 회전 · 스케일 · 직전 프레임 위치/회전', '매 틱'],
            ['FMidFrequencyData',  '물리 타입(동적 · 정적) · 물리 마스크(활성 · 중력)', '상태가 바뀔 때'],
            ['FLowFrequencyData',  '역질량 · 관성 · 마찰 · 반발 · 속도 상한 · 충돌 형상', '거의 안 바뀜'],
            ['FPhysicsToGameData', '속도 · 각속도 · 결과 트랜스폼', '물리 → 게임 (매 틱)'],
          ],
        },
        code: {
          title: 'BatchSyncHighFrequencyData — 더티가 선 것만',
          intro: '슬롯을 64개씩 끊어 훑고, 플래그가 안 선 객체는 건드리지 않는다.',
          code: `for (SoAIdx batchStart = startIdx; batchStart < endIdx; batchStart += BatchSize)
{
    SoAIdx batchEnd = std::min(batchStart + BatchSize, endIdx);

    for (SoAIdx i = batchStart; i < batchEnd; ++i)
    {
        if (!PhysicsStateSoA->IsValidSlotIndex(i)) continue;

        auto physicsObject = PhysicsStateSoA->ObjectReferences[i].lock();
        if (!physicsObject) continue;

        FPhysicsDataDirtyFlags dirtyFlags = physicsObject->GetDirtyFlags();
        if (!dirtyFlags.HasHighFreq()) continue;        // 플래그가 안 섰으면 넘긴다

        FHighFrequencyData data = physicsObject->GetHighFrequencyData();
        PhysicsStateSoA->WorldPosition[i] = XMVectorSet(
            data.Position.x, data.Position.y, data.Position.z, 1.0f);
        // …
    }
}`,
          result: '세 빈도가 각자 순회를 돌고, 한 번에 다 도는 루프는 없다.',
        },
        handoff: {
          q: '값을 넣는 길은 정해졌다. 힘을 주는 것은 값을 넣는 일이 아니다.',
          a: '무엇을 쓸지가 아니라 **언제 적용할지**를 정해야 한다.',
        },
      },
      {
        key: 'send', no: 'c', rail: '요청', title: '힘 요청 — 큐에 쌓는다',
        problem: '게임 코드가 시뮬레이션 도중 속도를 직접 바꾸면 반복 도중에 값이 갈린다.',
        did: '힘 · 충격량 요청을 Job 객체로 만들어 큐에 넣고, 틱 시작에서 한 번에 처리한다.',
        points: [
          ['Job 도 아레나에서', '큐에 들어갈 Job 은 물리 전용 아레나에서 떼어 쓰고, 처리가 끝나면 통째로 반납한다.'],
          ['타입은 빌드 단에서 거른다', '`FPhysicsJob` 파생이 아니거나 인자가 안 맞으면 컴파일이 실패한다.'],
          ['넘치면 조용히 버려진다', '아레나가 가득 차 할당이 실패하면 그 요청은 큐에 들어가지 않고, 호출한 쪽은 실패를 알 방법이 없다.'],
        ],
        code: {
          title: 'AcquireJob — SFINAE 로 막고 아레나에서 뗀다',
          intro: '게임 쪽에 열린 것은 RequestPhysicsJob 하나이고, 그 안에서 이 함수를 부른다.',
          code: `template<typename JobType, typename... Args,
    typename = std::enable_if_t<
        std::conjunction_v<
            std::is_base_of<FPhysicsJob, JobType>,
            std::is_constructible<JobType, Args...>
        >
    >
>
void AcquireJob(Args&&... args)
{
    FPhysicsJobRequest newJobRequest;
    newJobRequest.Job = JobPool->Allocate<JobType>(std::forward<Args>(args)...);

    if (newJobRequest.Job != nullptr)
        JobQueue->Push(newJobRequest);
}`,
          result: '잘못된 Job 타입은 런타임이 아니라 빌드에서 걸린다.',
        },
        handoff: {
          q: '게임에서 나가는 통로 둘은 여기까지다.',
          a: '그다음은 **배열 순회**를 어떻게 하느냐다.',
        },
      },
      {
        key: 'batch', no: 'd', rail: '순회', title: '슬롯을 묶어서 순회한다',
        problem: '객체마다 함수를 부르면 같은 연산이 객체 수만큼 흩어진다.',
        did: '중력 · 힘 · 적분 · 리셋을 배열 순회 함수로 각각 두고, 슬롯을 64개씩 끊어 돈다.',
        points: [
          ['함수 하나가 곧 한 단계', '중력 → 힘 → 감쇠 → 속도 적분 → 힘 리셋 순으로 한 서브스텝이 끝난다.'],
          ['벡터 연산은 XMVECTOR 로', '위치와 속도가 16바이트 정렬 배열이라 DirectXMath 연산을 배열 원소에 그대로 건다.'],
          ['정적 객체는 루프 안에서 거른다', '타입과 마스크를 슬롯마다 보고 넘긴다 — 활성 객체만 모아 둔 별도 배열은 없다.'],
        ],
        code: {
          title: 'BatchApplyGravity — 배열 순회 (발췌)',
          intro: '중력 가속도를 한 번 벡터로 만들고, 슬롯마다 스케일만 곱한다.',
          code: `XMVECTOR gravityVec = XMVectorSet(gravity.x, gravity.y, gravity.z, 0.0f);
XMVECTOR gravityDelta = XMVectorMultiply(gravityVec, XMVectorReplicate(deltaTime));

for (SoAIdx batchStart = startIdx; batchStart < endIdx; batchStart += BatchSize)
{
    SoAIdx batchEnd = std::min(batchStart + BatchSize, endIdx);

    for (SoAIdx i = batchStart; i < batchEnd; ++i)
    {
        if (!PhysicsStateSoA->IsValidActiveSlotIndex(i)) continue;
        if (PhysicsStateSoA->PhysicsTypes[i] == EPhysicsType::Static) continue;

        const FPhysicsMask mask = PhysicsStateSoA->PhysicsMasks[i];
        if (!mask.HasFlag(FPhysicsMask::MASK_GRAVITY_AFFECTED)) continue;

        XMVECTOR scaled = XMVectorScale(gravityDelta, PhysicsStateSoA->GravityScales[i]);
        XMVECTOR newVelocity = XMVectorAdd(PhysicsStateSoA->Velocities[i], scaled);

        if (IsValidLinearVelocity(newVelocity))          // 상한·하한 사이일 때만 쓴다
            PhysicsStateSoA->Velocities[i] = newVelocity;
    }
}`,
          result: '유효성 검사가 상한만이 아니라 하한도 본다 — 거의 멈춘 값은 쓰이지 않고 직전 값이 남는다.',
        },
        handoff: {
          q: '순회 범위는 슬롯 0번부터 마지막 할당 지점까지다.',
          a: '객체가 사라지면 그 사이에 **빈 슬롯**이 섞인다.',
        },
      },
      {
        key: 'compact', no: 'e', rail: '압축', title: '빈 슬롯을 모아서 압축한다',
        problem: '해제된 슬롯이 배열 중간에 남으면 순회가 매번 빈칸을 건너뛴다.',
        did: '해제가 쌓였을 때만 유효 슬롯을 앞으로 당기고, 바깥이 든 ID 는 매핑만 갱신한다.',
        points: [
          ['매핑을 두 벌 든다', 'ID → 인덱스와 인덱스 → ID 를 같이 들어, 슬롯이 옮겨져도 양방향을 그 자리에서 고친다.'],
          ['즉시 압축하지 않는다', '압축은 유효 슬롯을 전부 옮기고 매핑 두 벌을 다시 쓰는 일이라, 순회 범위가 최소 크기를 넘고 그중 해제 비율도 기준을 넘었을 때만 돈다.'],
          ['ID 는 압축 전까지만 재사용된다', '해제된 ID 는 재사용 목록에 들어가 다시 나갈 수 있고, 압축 때 그 목록이 통째로 비워지며 영구 무효가 된다.'],
          ['generation 필드를 두지 않았다', '세대 번호로 매번 검사하는 대신, 압축이라는 한 시점에 옛 ID 를 모두 죽이는 쪽을 골랐다.'],
        ],
        viz: 'compact',
        code: {
          title: '무결성 규칙 — 헤더 주석 그대로',
          intro: '이 네 줄이 압축·재사용·순회 범위를 한꺼번에 정한다.',
          code: `// 무결성 원칙:
// - 연속적인 유효/재사용 가능 Slot 범위 = [0:AllocatedCount)
// - 재사용가능 ID = FreeIDs
// - 재사용/사용 가능한 ID-Slot의 관계는 항상 지속적으로 유효
// - 압축 시 FreeIDs는 완전 초기화되어 해제된 ID들은 영구 무효화

SoAIdx GetIndex(SoAID Id) const;   // 바깥은 ID 만 든다
SoAID  GetID(SoAIdx Idx) const;    // 순회 쪽은 인덱스만 든다`,
          result: '디버그 빌드에는 매핑 정합성을 통째로 검사하는 함수가 따로 있다.',
        },
      },
    ],
  },

  // ─── §03 프레임 루프 ────────────────────────────────────
  frame: {
    gist: '통로 넷은 전부 이 반복 **바깥**에 있다 — 게임 쪽 값은 틱당 한 번 읽히고 한 번 쓰인다.',
    body:
      '프레임 간격을 그대로 적분에 넣으면 같은 장면이 프레임률에 따라 다르게 움직이고, ' +
      '한 번 끊길 때 간격이 커져 값이 발산한다.',
    points: [
      ['예산은 고정 폭 하나', '프레임 간격이 얼마든 한 틱의 진행량은 이 폭을 기준으로 잡는다 — 아래의 최소 시간 하한 때문에 폭을 조금 넘길 수는 있다.'],
      ['실제 적분 폭은 충돌이 정한다', '충돌 처리가 돌려준 진행 가능 비율만큼만 나아가고, 남은 예산으로 다음 서브스텝을 돈다 — 폭 자체는 매번 다르다.'],
      ['너무 잘게 쪼개지지 않게', '한 서브스텝이 진행할 수 있는 최소 시간을 두어, 충돌이 몰려도 제자리걸음이 되지 않게 한다.'],
      ['서브스텝에 상한', '밀린 시간이 많아도 한 프레임에 도는 횟수를 제한한다 — 따라잡으려다 더 느려지는 것을 막는다.'],
      ['속도와 힘에 상한', '선속도 · 각속도 · 힘 · 토크 · 가속도 각각 상한을 두고 넘으면 자른다.'],
      ['쓰기 직전에 한 번 더 본다', '크기가 상한과 하한 사이일 때만 배열에 쓴다 — NaN 은 여기서 걸리지만, 거의 멈춘 값도 같이 걸려 직전 값이 남는다.'],
      ['값은 설정에서 읽는다', '위 임계값은 코드에 기본값이 있고 `Config.ini` 가 그것을 덮는다 — 물리 · 충돌 · 응답 · 검출 네 구역으로 나눠 뒀다.'],
    ],
    code: {
      title: 'TickPhysics · SimulateSubstep — 예산과 실제 폭',
      intro: '바깥 루프가 고정 폭 예산을 나눠 쓰고, 안쪽이 충돌 시점만큼만 진행시킨다.',
      code: `// 바깥 — 통로 ① ② 는 반복 앞, ③ ④ 는 반복 뒤에 있다
AccumulatedTime += DeltaTime;
int NumSubsteps = Math::Clamp(CalculateRequiredSubsteps(), 0, MaxSubSteps);
if (NumSubsteps < 1) return;

PrepareSimulation();                       // ① 입력 동기화  ② Job 큐 처리

float TimeStep = FixedTimeStep;            // 이 틱의 예산
for (int i = 0; i < NumSubsteps; i++)
{
    float SimulatedTime = SimulateSubstep(TimeStep);
    TimeStep -= SimulatedTime;             // 쓴 만큼 예산에서 뺀다

    if (TimeStep < KINDA_SMALL) break;
    AccumulatedTime -= SimulatedTime;
}

FinalizeSimulation();                      // ③ 결과 반환  ④ 충돌 이벤트

// 안쪽 — 실제로 얼마나 나아갈지는 충돌이 정한다
float CollideTimeRatio = GetCollisionSubsystem()->ProcessCollisions(ActiveIDs, StepTime);
float SimualtedTime = std::max(MinSubStepTickTime, StepTime * CollideTimeRatio);`,
      result: '게임 쪽 값을 만지는 두 지점이 반복 바깥에 못 박혀 있다.',
    },
    viz: 'tick',
  },

  // ─── §04 충돌 ───────────────────────────────────────────
  collision: {
    gist: '쌍을 줄이고 · 빠른 물체를 잡고 · 겹침을 재고 · 속도를 고치는 **네 단계**로 나눴다.',
    steps: [
      {
        key: 'tree', no: 'a', title: '브로드페이즈 — 동적 AABB 트리',
        problem: '객체 쌍을 전부 비교하면 비교 횟수가 객체 수의 제곱으로 늘어난다.',
        did: '표준 동적 AABB 트리를 쓰되, 잎마다 실제 경계와 **여유 경계**를 따로 들었다.',
        points: [
          ['삽입 위치는 넓이 비용으로', '내려갈 때마다 두 자식에 각각 합쳤을 때의 표면적을 재고 싼 쪽으로 내려간다 — 중간에 새 부모를 끼우는 경우는 재지 않는다.'],
          ['높이차가 벌어지면 회전', '좌우 높이 차가 기준을 넘으면 회전으로 다시 낮춘다.'],
          ['여유 밖으로 나갈 때만 다시 넣는다', '객체가 조금 움직인 정도로는 트리를 고치지 않는다 — 여유 폭은 설정으로 뺐다.'],
          ['경계만 고치는 경로를 따로 뒀다', '`UpdateNodeBounds` 는 실제 경계만 바꾸고 트리 구조를 건드리지 않는다.'],
        ],
        viz: 'fat',
      },
      {
        key: 'ccd', no: 'b', title: '빠른 물체 — 스윕 부피로 한 번 더 본다',
        problem: '한 프레임에 자기 두께보다 멀리 가는 물체는 두 위치 어디에서도 겹치지 않는다.',
        did: '속도가 임계를 넘는 물체가 낀 쌍만 직전 위치와 현재 위치를 감싸는 **스윕 부피**로 먼저 거른다.',
        points: [
          ['두 단계로 거른다', '스윕 부피끼리 안 겹치면 그 쌍은 거기서 끝난다.'],
          ['겹치면 시점을 좁힌다', '겹칠 때만 구간을 반복해 좁혀 부딪힌 시점을 찾는다 — 반복 상한은 설정으로 뺐다.'],
          ['직전 트랜스폼도 배열에 있다', '`PrevWorldPosition` 을 중앙 배열이 들고 있어, 스윕을 만드는 데 게임 쪽 값을 하나도 안 읽는다.'],
          ['임계 아래는 그냥 본다', '느린 물체는 현재 위치만 검사한다 — 매 쌍마다 스윕을 돌리지 않는다.'],
          ['확인은 눈으로 했다', '테스트 씬에서 두 물체를 마주 보게 쏘아 속도를 올려 가며, 뚫고 지나가는지 튕겨 나오는지를 봤다.'],
        ],
        viz: 'swept',
      },
      {
        key: 'narrow', no: 'c', title: '내로우페이즈 — 분리축 15개',
        problem: '두 상자가 서로 기울어 있으면 축에 나란한 비교로는 겹침을 못 잰다.',
        did: '두 상자의 면 법선 6개와 모서리 외적 9개, 합쳐 **15개 축**에 투영해 겹침을 잰다.',
        points: [
          ['하나라도 벌어지면 끝', '한 축에서 투영이 안 겹치면 그 즉시 충돌 아님으로 빠진다.'],
          ['가장 얕은 축이 법선', '전부 겹치면 겹친 폭이 가장 작은 축을 충돌 법선으로 잡는다.'],
          ['축이 뭉개지면 건너뛴다', '두 모서리가 나란하면 외적이 0에 가까워져 그 축은 버린다.'],
          ['구는 따로', '구끼리는 중심 거리로, 상자와 구는 상자 위 최근접점까지의 거리로 판정한다.'],
        ],
        code: {
          title: 'BoxBoxSAT — 축 하나를 재는 람다와 세 번의 호출',
          intro: '축마다 하는 일이 같아 람다 하나로 두고, 면 법선과 외적을 세 묶음으로 나눠 부른다.',
          code: `auto TestSeparatingAxis = [&](XMVECTOR axis, bool flipNormal = false) -> bool
{
    XMVECTOR axisLengthVec = XMVector3Length(axis);
    if (XMVectorGetX(axisLengthVec) < KINDA_SMALL)
        return true;                       // 두 모서리가 나란하면 이 축은 버린다

    axis = XMVectorDivide(axis, axisLengthVec);
    // 두 상자의 반 크기를 이 축에 투영해 합보다 멀면 분리로 판정한다
};

for (int i = 0; i < 3; ++i)                // 박스 A 의 면 법선 3
    if (!TestSeparatingAxis(axisA[i])) return result;   // 분리됨

for (int i = 0; i < 3; ++i)                // 박스 B 의 면 법선 3
    if (!TestSeparatingAxis(axisB[i])) return result;

for (int i = 0; i < 3; ++i)                // A 의 축 × B 의 축 — 3×3
    for (int j = 0; j < 3; ++j)
    {
        XMVECTOR crossAxis = XMVector3Cross(axisA[i], axisB[j]);
        if (!TestSeparatingAxis(crossAxis)) return result;
    }`,
          result: '통과한 축 중 겹친 폭이 가장 작은 것이 충돌 법선이 된다.',
        },
      },
      {
        key: 'solve', no: 'd', title: '응답 — 반복 솔버와 위치 보정',
        problem: '충돌마다 충격량을 한 번씩 주면 여러 개가 동시에 닿을 때 서로의 결과를 무너뜨린다.',
        did: '제약을 법선 · 접선 마찰 · 비틀림으로 나눠 반복해 풀고, 파고든 깊이는 목표 속도에 **바이어스**로 섞는다.',
        points: [
          ['제약 셋으로 나눈다', '법선은 밀어내고 접선은 미끄러짐을 막고 비틀림은 회전을 잡는다.'],
          ['누적 충격량을 이어 쓴다', '직전 프레임의 누적값을 버리지 않고 시작값으로 삼되, 응답을 계산할 때마다 감쇠를 한 번 건다.'],
          ['마찰은 법선에 매인다', '접선과 비틀림의 한계를 그 시점의 법선 누적값에서 뽑아 쓴다.'],
          ['얕은 침투는 무시한다', '기준보다 얕게 파고든 것은 보정하지 않는다 — 보정하면 접촉면이 계속 떤다.'],
          ['깊게 물리면 위치도 민다', '겹친 비율이 크면 속도 바이어스만으로는 안 빠져나와, 위치를 직접 밀어내는 경로를 따로 뒀다.'],
          ['반복 횟수에 상한', '수렴하지 않아도 정해진 횟수에서 끊는다.'],
        ],
        code: {
          title: 'CalculateNormalImpulseComponent — 법선 제약 (발췌)',
          intro: '반발과 위치 보정이 목표 속도 하나로 합쳐지고, 누적값을 갱신한 뒤 그 차이만 적용한다.',
          code: `// 반발 + 위치 보정을 목표 속도로 합친다
float TargetVelocity = -(CombinedRestitution * RelativeNormalVelocity) - BiasSpeed;
float RequiredImpulseMagnitude = (TargetVelocity - RelativeNormalVelocity) * EffectiveMass;

// 누적값을 먼저 갱신하고 (법선은 음수가 될 수 없다) 차이만 적용한다
float OldLambda = Accumulation.NormalLambda;
Accumulation.NormalLambda = std::max(0.0f, OldLambda + RequiredImpulseMagnitude);
float ActualImpulseMagnitude = Accumulation.NormalLambda - OldLambda;

return XMVectorScale(Normal, ActualImpulseMagnitude);

// 마찰 쪽은 이 누적값을 한계로 받는다
CalculateTangentFrictionComponent(..., Accumulation.NormalLambda, Result);
CalculateTwistFrictionComponent (..., Accumulation.NormalLambda, Result);`,
          result: '세 성분이 각자 이 형태를 따로 구현한다 — 공통 제약 클래스는 만들어 뒀지만 쓰지 않았다.',
        },
      },
    ],
    shot: {
      src: 'dx11-engine/assets/screen-1-collision.png',
      caption: '와이어프레임으로 켠 충돌 형상 — 왼쪽 패널이 게임 쪽 값이고, 중앙 배열에 들어간 값은 콘솔로 따로 찍는다.',
    },
  },

  // ─── §05 렌더링 ─────────────────────────────────────────
  // 넷은 서로 독립이다. 순서에 인과를 부여하지 않는다.
  render: {
    gist: '다섯은 서로 독립이다 — 서술자 자동 생성 · 바인딩 디버거 · 상태 버킷 · 프레임 아레나 · 바인딩 캐시.',
    steps: [
      {
        key: 'refl', no: 'a', title: '셰이더 리플렉션 — 서술자를 손으로 안 적는다',
        problem: '셰이더 입력이나 상수 버퍼를 고칠 때마다 C++ 쪽 서술자를 손으로 맞춰야 한다.',
        did: '컴파일된 셰이더 바이트코드에서 입력 레이아웃 · 상수 버퍼 · 리소스 바인딩을 **읽어서** 만든다.',
        points: [
          ['입력 레이아웃', '시맨틱과 포맷을 읽어 서술자를 만든다.'],
          ['상수 버퍼', '이름 · 변수 · 오프셋 · 크기를 읽어 GPU 버퍼까지 만든다.'],
          ['텍스처와 샘플러', '바인딩 슬롯을 읽어 둔다.'],
          ['셰이더 추가 비용', '셰이더를 하나 더 넣어도 C++ 쪽 서술자에 손댈 것이 없다 — 값을 채워 넣는 코드는 그대로 필요하다.'],
        ],
        code: {
          title: 'FillShaderMeta — 바이트코드에서 읽어 만든다',
          intro: '컴파일된 셰이더가 자기 입력과 상수 버퍼를 이미 알고 있다.',
          code: `ID3D11ShaderReflection* SReflection = nullptr;
D3DReflect(ShaderBlob->GetBufferPointer(), ShaderBlob->GetBufferSize(),
           IID_ID3D11ShaderReflection, (void**)&SReflection);

// 입력 시맨틱 → D3D11_INPUT_ELEMENT_DESC
std::vector<D3D11_INPUT_ELEMENT_DESC> InputLayoutDesc;
CreateInputLayoutFromReflection(SReflection, InputLayoutDesc);
Device->CreateInputLayout(InputLayoutDesc.data(), InputLayoutDesc.size(),
                          ShaderBlob->GetBufferPointer(), ShaderBlob->GetBufferSize(),
                          &InputLayout);

// cbuffer → GPU 버퍼 + 오프셋 / 텍스처 · 샘플러 → 바인딩 슬롯
ExtractAndCreateConstantBuffers(Device, SReflection, ConstantBuffers);
ExtractResourceBindings(SReflection, ResourceBindingMeta);`,
          result: 'C++ 쪽에 손으로 적어 둔 서술자가 없으니 어긋날 것도 없다.',
        },
      },
      {
        key: 'debug', no: 'b', title: '바인딩 디버거 — 화면이 비었을 때 볼 것을 만든다',
        problem: '아무것도 안 그려질 때 D3D11 은 이유를 말해 주지 않고, 외부 도구 없이는 무엇이 걸렸는지 볼 방법이 없다.',
        did: '지금 걸린 바인딩을 통째로 캡처해 검사하고, GPU 버퍼를 CPU 로 복사해 상수 값을 그대로 찍는 디버거를 직접 만들었다.',
        points: [
          ['캡처 대상', '정점 · 픽셀 셰이더, 상수 버퍼, 셰이더 리소스, 샘플러, 렌더 타깃, 깊이 스텐실.'],
          ['빈 슬롯을 찾는다', '캡처한 목록을 훑어 비어 있거나 슬롯이 어긋난 바인딩을 골라낸다.'],
          ['상수 값을 눈으로 본다', 'GPU 버퍼를 스테이징 버퍼로 복사해 내용을 그대로 덤프한다 — 셰이더에 들어간 값이 맞는지 보려면 이것 말고 방법이 없었다.'],
          ['프레임 끝에 걸어 뒀다', '`EndFrame` 에서 바인딩 검사를 부른다 — 따로 실행하는 도구가 아니라 루프에 얹힌 검사다.'],
        ],
      },
      {
        key: 'queue', no: 'c', title: '상태별 버킷 — 제출 순서와 처리 순서를 가른다',
        problem: '객체를 들어온 순서대로 그리면 같은 상태를 몇 번이고 다시 건다.',
        did: '제출된 렌더 명령을 상태별 버킷에 담고, 버킷 하나를 통째로 처리한 뒤 다음 상태로 넘어간다.',
        points: [
          ['버킷은 상태를 키로 든다', '`Solid` · `Wireframe` 처럼 상태 종류가 그대로 키다.'],
          ['상태 스택을 따로 든다', '처리 중에 상태를 밀어 넣고 끝나면 되돌린다.'],
          ['상태를 거는 횟수', '명령 수가 아니라 버킷 수를 따라간다.'],
        ],
      },
      {
        key: 'arena', no: 'd', title: '프레임 아레나 — 해제 시점을 프레임 경계로',
        problem: '렌더 데이터를 프레임마다 새로 할당하고 지우면 해제 시점이 흩어진다.',
        did: '렌더 데이터를 8MB 아레나에서 앞으로 밀며 떼어 쓰고, 프레임 끝에 포인터를 되감는다.',
        points: [
          ['할당은 포인터 이동', '떼어 줄 때 하는 일은 오프셋을 미는 것뿐이다.'],
          ['소멸자는 역순으로', '할당하며 소멸자를 기록해 두고 되감을 때 거꾸로 부른다.'],
          ['타입은 빌드 단에서 거른다', '`IRenderData` 파생이 아니면 컴파일이 실패한다.'],
        ],
        code: {
          title: 'AllocateRenderJob — 아레나에서 뗀다',
          intro: '렌더 데이터의 수명이 이 프레임뿐이라 개별 해제 경로가 없다.',
          code: `template<typename T, typename =
    std::enable_if_t<std::is_base_of_v<IRenderData, T> ||
                     std::is_same_v<IRenderData, T>>>
FRenderJob AllocateRenderJob()
{
    FRenderJob RenderJob;
    RenderJob.RenderData = RenderDataPool.Allocate<T>();
    return RenderJob;
}

// 풀 쪽 — 되감으면 이 프레임 것이 한꺼번에 사라진다
FArenaMemoryPool RenderDataPool = FArenaMemoryPool(8 * 1024 * 1024);`,
          result: '프레임 경계가 곧 해제 시점이다.',
        },
      },
      {
        key: 'cache', no: 'e', title: '바인딩 캐시 — 같은 것을 다시 걸지 않는다',
        problem: '같은 버퍼와 셰이더를 쓰는 드로우가 이어져도 매 드로우마다 바인딩 호출을 다시 낸다.',
        did: '지금 걸린 것을 컨텍스트가 기억하고, 같은 것이 다시 오면 호출을 건너뛴다.',
        points: [
          ['기억하는 것', '정점 · 인덱스 버퍼, 정점 · 픽셀 셰이더, 입력 레이아웃, 셰이더 리소스 16슬롯.'],
          ['비우는 경로가 없다', '프레임 시작에 캐시를 지우지 않는다 — 같은 디바이스 컨텍스트를 ImGui 도 쓰므로 캐시가 실제 상태와 어긋날 수 있다.'],
          ['호출부는 캐시를 모른다', '바깥은 늘 `Bind` 를 부르고, 걸지 말지는 컨텍스트가 정한다.'],
        ],
        code: {
          title: 'FRenderContext — 거는 곳마다 같은 형태',
          intro: '조건이 호출부에 흩어지지 않고 이 안에 모인다.',
          code: `void FRenderContext::BindVertexBuffer(ID3D11Buffer* Buffer, UINT Stride, UINT Offset)
{
    if (!DeviceContext) return;

    if (CurrentVB != Buffer)                       // 같으면 여기서 끝
    {
        DeviceContext->IASetVertexBuffers(0, 1, &Buffer, &Stride, &Offset);
        CurrentVB = Buffer;
    }
}

// 캐시가 기억하는 것
ID3D11Buffer*             CurrentVB, *CurrentIB;
ID3D11VertexShader*       CurrentVS;
ID3D11PixelShader*        CurrentPS;
ID3D11InputLayout*        CurrentLayout;
ID3D11ShaderResourceView* CurrentSRVs[MAX_SHADER_RESOURCE_SLOTS];   // 16`,
          result: '바인딩 조건이 한 군데 모여 있어 캐시를 끄고 켜는 것도 여기서 끝난다.',
        },
      },
    ],
  },

  // ─── §06 코어 · 인프라 ──────────────────────────────────
  core: {
    gist: '엔진이 돌려면 있어야 하지만 앞 절들과 인과가 없는 것들을 따로 묶었다.',
    groups: [
      {
        title: '컴포넌트 수명 — 만드는 길과 끊는 길을 하나로',
        points: [
          ['계층은 넷', '`UObject` → `UActorComponent`(트리) → `USceneComponent`(트랜스폼) → `UPrimitiveComponent`(렌더).'],
          ['게임 오브젝트는 생성자를 막았다', '`UGameObject` 만 생성자를 `protected` 로 두고 팩토리를 통해서만 만들게 했다 — 컴포넌트는 이 제약을 안 걸었다.'],
          ['소유자 설정도 막았다', '토큰 구조체를 만들 수 있는 것은 게임 오브젝트뿐이라, 컴포넌트가 스스로 주인을 바꿀 수 없다.'],
          ['트랜스폼은 재귀 전파', '로컬과 월드를 나눠 들고, 부모가 바뀌면 자식의 월드 값에 직접 써 넣어 자식이 다시 부모를 부르지 않게 했다.'],
          ['죽을 때 스스로 빠진다', '델리게이트에 바인딩할 때 소멸 콜백을 걸어 두고, 객체가 사라지면 자기를 뺀다 — 바인딩 대상은 수명 알림을 구현한 타입만 컴파일 단에서 허용한다.'],
        ],
        code: {
          title: 'UGameObject::Create<T> — 팩토리 하나만 열린다',
          intro: '생성자가 protected 라 make_shared 가 직접 부르지 못해 파생 껍데기로 우회한다.',
          code: `template <typename T>
struct ConstructorAccess : public T {
    template <typename... Args>
    ConstructorAccess(Args&&... args) : T(std::forward<Args>(args)...) {}
};

// 팩토리 밖에서는 이 껍데기를 만들 수 없다
static_assert(std::is_base_of_v<UGameObject, T> ||
              std::is_same_v<UGameObject, T>, "T must be derived of UGameObject");`,
          result: '한 번의 할당으로 만들고, 잘못된 타입은 빌드에서 걸린다.',
        },
      },
      {
        title: '메모리 · 리소스 · 입력 · 디버거',
        points: [
          ['리소스는 핸들로만', '바깥은 해시 키 하나만 들고, 매니저가 캐시에서 찾아 준다 — 캐시가 갈려도 핸들은 그대로다.'],
          ['오래 안 쓰면 내린다', '마지막 접근 시각을 들고 기준을 넘으면 해제한다.'],
          ['입력은 우선순위 컨텍스트', '컨텍스트를 우선순위로 정렬해 위에서부터 주고, 먹은 곳에서 멈춘다.'],
        ],
        tableTitle: '자료구조 넷 — 무엇을 기준으로 갈랐나',
        table: {
          headers: ['자료구조', '고른 이유', '쓰는 곳'],
          rows: [
            ['아레나 풀',        '해제 시점이 전부 같다',           '렌더 데이터 · 물리 Job'],
            ['고정 크기 객체 풀', '최대 개수가 미리 정해진다',        '디버그 도형 · 씬의 탄성체'],
            ['링 버퍼',          '넣은 순서대로 꺼낸다',            '물리 Job 큐 · 충돌 이벤트'],
            ['문자열 해시',       '키 비교가 문자열 길이를 안 타게',  '리소스 키 · 입력 액션 · 델리게이트 이름'],
          ],
        },
      },
    ],
  },

  // ─── §07 남은 것 ────────────────────────────────────────
  limits: [
    ['프로파일러를 돌린 적이 없다',
     '판정 수단은 화면에 띄운 fps 카운터와 눈으로 본 관통 여부였다. 같은 PC · 같은 빌드에서 프레임 디버거로 전후를 비교했고, 그때 본 값은 15 → 60 fps 였다. 다만 씬 구성도 객체 수도 남기지 않아 재현할 수 없다. 그래서 이 수치를 구조를 고른 근거로 쓰지 않는다.'],
    ['그래서 성능을 근거로 고른 구조가 아니다',
     '배치 순회 · 바인딩 캐시 · 상태 버킷은 그렇게 하면 유리하다고 알려진 구조를 고른 것이지, 이 엔진에서 얼마나 빨라졌는지 재서 고른 것이 아니다.'],
    ['누적 시간 처리에 결함이 있다',
     '누적에서 소비 시간을 빼는 줄이 서브스텝 종료 분기 뒤에 있어, 예산을 다 쓰고 빠져나온 마지막 서브스텝의 시간이 빠지지 않는다. 오래 돌수록 누적이 늘어 서브스텝 수가 상한에 붙는다.'],
    ['재현성을 검사하지 않았다',
     '한 틱의 진행량을 고정 폭으로 묶는 구조는 만들었지만 같은 입력이 같은 결과를 내는지 확인한 적이 없다. 리플레이도 난수 시드 고정도 없다.'],
    ['임의 볼록 형상을 못 다룬다',
     '상자와 구만 판정한다. GJK/EPA 는 쓰지 말라는 주석과 함께 설정 키만 남아 있고, 그 키를 읽는 코드도 구현도 리포에 없다.'],
    ['멀티스레드는 구조만',
     '배열을 구간으로 나눠 돌 수 있는 형태까지는 왔지만 실제로 스레드를 띄우지 않았다. 물리는 여전히 게임 루프 안에서 돈다.'],
    ['바인딩 캐시를 비우는 경로가 없다',
     '프레임 시작에 캐시를 지우지 않는데 같은 디바이스 컨텍스트를 ImGui 도 쓴다. 캐시가 실제 상태와 어긋나면 걸어야 할 것을 건너뛸 수 있다.'],
    ['자동 테스트가 없다',
     '검증은 테스트 씬을 직접 플레이하고 콘솔에 찍힌 트리와 이벤트를 눈으로 보는 방식이었다. 단위 테스트 코드는 남아 있지 않다.'],
    ['렌더러가 얕다',
     'Forward 한 경로뿐이다. 그림자 · 후처리 · 인스턴싱이 없어 상태 버킷이 감당할 실제 부하도 크지 않았다.'],
  ],

  repo: { label: 'github.com/OliveGreenKR/PersonalDx11Engine', href: 'https://github.com/OliveGreenKR/PersonalDx11Engine' },
  youtube: { label: '데모 영상 (YouTube)', href: 'https://youtube.com/playlist?list=PLfrpeRcTLBefJ5Q5JjjfeNhooDylaNgUC' },
};
