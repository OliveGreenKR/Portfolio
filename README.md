# JCH Portfolio

게임/엔진 클라이언트 프로그래머 **정철**의 개인 포트폴리오 사이트.

> 사용은 단순하게, 구조는 확장에 유연하게.

- **라이브**: https://olivegreenkr.github.io/Portfolio/
- **다루는 작업**: Cartapli: Fold Quest (Steam 출시) · Wobble Wobble (Steam · STOVE 동시 출시) · DX11 커스텀 물리 엔진 + Labs(PoC·실험) 6종

## 기술

빌드 스텝 없는 **정적 HTML/CSS** 사이트. 진입점 `index.html` → `pages/landing.html` 로 리다이렉트.
디자인 토큰(Pretendard, sage/terra)과 컴포넌트는 React JSX(`src/`)로 작성한 소스를 기준으로, 각 페이지는 정적 `.html`로 산출한다.

## 구조

```
index.html            진입점 (landing 리다이렉트)
pages/                페이지별 .html + React 소스 + data.js (콘텐츠)
src/                  컴포넌트 · 뷰 · 스타일 토큰 (디자인 시스템 소스)
ui_kits/portfolio/    포트폴리오 UI 키트 재현
assets/ · fonts/      이미지 · Pretendard 폰트
DESIGN_SYSTEM.md      디자인 시스템 명세 (색·타이포·레이아웃 규칙)
```

## 로컬 실행

정적 파일이라 어떤 정적 서버로도 열린다.

```bash
python -m http.server 8000
# http://localhost:8000 접속
```

## 배포

GitHub Pages (Settings → Pages → Source: `main`, root). `.nojekyll` 포함으로 Jekyll 처리 비활성화.

## 라이선스

코드/구조: [LICENSE](LICENSE) 참조. 프로젝트 콘텐츠·이미지·폰트는 각 권리자에 귀속.
