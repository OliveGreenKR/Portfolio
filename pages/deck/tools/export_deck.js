/**
 * 제출용 덱 → PDF 출력 (단일 진입점).
 *
 *   node export_deck.js [url] [--keep-temp]
 *
 * 하는 일
 *   1) 로컬 서버의 deck.html 을 열어 슬라이드 30장을 렌더한다.
 *      ⚠️ file:// 로는 안 된다 — 덱은 런타임 React + Babel(JSX 를 XHR 로 읽음)이라 CORS 로 죽는다.
 *   2) 같은 세션에서 (a) PDF (b) 슬라이드 목록(북마크 이름의 원본)을 뽑는다.
 *   3) deck_outline.py 로 PDF 북마크(Navigation Pane)를 슬라이드 목록대로 다시 쓴다.
 *      Chrome 자동 outline(tagged+outline)은 이름을 h1/h2 에서 긁어 표제지가 헤드라인 두 문장이 되고
 *      한 장 안의 소제목이 별도 항목으로 샌다. 그래서 목적지만 쓰고 이름은 우리가 짓는다.
 *
 * 출력
 *   <repo>/_exports/deck/deck_{YYYYMMDD}_{NN}.pdf   — NN = 그날의 출력 순번(01부터)
 *   _exports/ 는 통째로 gitignore 다. 소스 폴더에 산출물을 섞지 않는다.
 *
 * 시각 보증은 html-to-pdf 스킬(make_pdf.js)과 같다 —
 * networkidle0 · fonts.ready · 1500ms 합성 대기 · printBackground · deviceScaleFactor 2 · preferCSSPageSize.
 */
const puppeteer = require('C:/Users/jeong/.claude/skills/html-to-pdf/node_modules/puppeteer');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const URL_DEFAULT = 'http://localhost:8899/pages/deck.html';
const url = process.argv.find((a) => a.startsWith('http')) || URL_DEFAULT;
const keepTemp = process.argv.includes('--keep-temp');

// tools/ → deck/ → pages/ → <repo>
const REPO = path.resolve(__dirname, '..', '..', '..');
const OUT_DIR = path.join(REPO, '_exports', 'deck');
const TMP_DIR = path.join(OUT_DIR, '.tmp');

/** 그날의 다음 순번. 파일명만 보고 정한다 — 별도 카운터 파일을 두면 지웠을 때 어긋난다. */
function nextOutPath() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const d = new Date();
  const stamp = [d.getFullYear(), d.getMonth() + 1, d.getDate()]
    .map((n, i) => String(n).padStart(i ? 2 : 4, '0')).join('');
  const re = new RegExp(`^deck_${stamp}_(\\d+)\\.pdf$`);
  const used = fs.readdirSync(OUT_DIR)
    .map((f) => (re.exec(f) || [])[1]).filter(Boolean).map(Number);
  const next = (used.length ? Math.max(...used) : 0) + 1;
  return path.join(OUT_DIR, `deck_${stamp}_${String(next).padStart(2, '0')}.pdf`);
}

(async () => {
  const outPath = nextOutPath();
  fs.mkdirSync(TMP_DIR, { recursive: true });
  const rawPdf = path.join(TMP_DIR, 'raw.pdf');
  const slidesJson = path.join(TMP_DIR, 'slides.json');

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1200, deviceScaleFactor: 2 });
    console.log('Loading:', url);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    // React 가 다 그릴 때까지. 슬라이드 수가 두 번 연속 같으면 안정된 것으로 본다.
    await page.waitForFunction(() => document.querySelectorAll('.slide').length > 0, { timeout: 30000 });
    let prev = -1;
    let count = 0;
    for (let i = 0; i < 20; i += 1) {
      count = await page.evaluate(() => document.querySelectorAll('.slide').length);
      if (count === prev) break;
      prev = count;
      await new Promise((r) => setTimeout(r, 300));
    }
    console.log('Slides rendered:', count);

    // 뷰포트를 문서 자신의 디자인 크기에 맞춘다 — 화면과 PDF 를 1:1 로 두는 핵심.
    const dim = await page.evaluate(() => {
      const cs = getComputedStyle(document.querySelector('.slide'));
      return { w: Math.round(parseFloat(cs.width)), h: Math.round(parseFloat(cs.height)) };
    });
    await page.setViewport({ width: dim.w, height: dim.h, deviceScaleFactor: 2 });
    console.log(`Slide design size: ${dim.w}x${dim.h}px`);

    await page.evaluateHandle('document.fonts.ready');
    await new Promise((r) => setTimeout(r, 1500)); // filter/shadow 합성은 폰트 레이아웃 뒤에 온다

    /* 목차 트리는 **매니페스트**에서, 잎 이름은 DOM 에서 읽는다.
       ⚠️ 층(프로젝트/장)을 DOM 클래스로 판정하면 표지 마크업을 리팩터할 때 조용히 무너진다 —
          실제로 표지를 프로젝트 소유로 옮긴 뒤(a4acbf6) `.sl-cover__main` 이 사라져
          Motelet · DX11 표지가 표지로 안 잡혔고, 그 뒤 장이 전부 CM 밑으로 매달렸다.
          layout 은 SlideDeck 이 렌더러를 고르는 필수 필드라 없어질 수 없다.
       이름은 매니페스트로 못 뽑는다 — 표지 4장과 cmMethod 4장은 title 필드가 비어 있고
       (제목이 표지·method 안에 있다) `.sl-h` 는 30장 전부에서 이미 제대로 뽑힌다.
       ⚠️ 매니페스트 인덱스 = 쪽 번호. 한 슬라이드 = 한 쪽(@page + break-after)이라 성립하고,
          어긋나면 아래 length 검사가 잡는다. */
    const slides = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll('.slide')];
      return window.DECK_ENGINE.slides.map((s, i) => {
        const sl = nodes[i];
        const txt = (el) => (el ? el.textContent.trim().replace(/\s+/g, ' ') : '');
        return {
          page: i + 1,
          layout: s.layout,
          proj: s.proj || '',
          section: s.section || '',
          heading: txt(sl && sl.querySelector('.sl-h, .cmd-cover__title, h1, h2')),
        };
      });
    });
    if (slides.length !== count) {
      throw new Error(`매니페스트 ${slides.length}장 ≠ 렌더된 슬라이드 ${count}장 — 쪽 번호가 어긋난다`);
    }
    fs.writeFileSync(slidesJson, JSON.stringify(slides, null, 1), 'utf-8');

    console.log('Rendering PDF...');
    // ⚠️ width/height 를 빼면 인쇄 **레이아웃**이 기본 용지(Letter = 816px) 폭으로 돈다.
    //    preferCSSPageSize 는 최종 page box 만 정하지 그 폭은 못 바꾼다(실측).
    //    816px 에서 max-width 1100·1180·820 브레이크포인트가 전부 발동하고,
    //    motelet/viz.jsx 의 useMTNarrow(820) 는 인쇄 중에만 narrow SVG 로 재렌더된다 —
    //    화면 검사로는 안 잡히고 PDF 에만 남는다(0817·0818 출력에서 실측).
    //    dim 은 .slide 계산폭이라 규격 상수는 여전히 slides.css 한 곳이다.
    await page.pdf({
      path: rawPdf,
      printBackground: true,
      width: dim.w + 'px',
      height: dim.h + 'px',
      preferCSSPageSize: true,                            // @page { size: 1920px 1200px; margin: 0 }
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
  } finally {
    await browser.close();
  }

  console.log('Writing bookmarks...');
  const py = spawnSync('python', [path.join(__dirname, 'deck_outline.py'), rawPdf, slidesJson, outPath],
    { encoding: 'utf-8', env: Object.assign({}, process.env, { PYTHONIOENCODING: 'utf-8' }) });
  if (py.status !== 0) {
    console.error(py.stdout || '', py.stderr || '');
    throw new Error('deck_outline.py 실패 — pypdf 설치 확인: python -m pip install pypdf');
  }

  if (!keepTemp) fs.rmSync(TMP_DIR, { recursive: true, force: true });
  console.log(`Done: ${outPath} (${(fs.statSync(outPath).size / 1024 / 1024).toFixed(2)} MB)`);
})().catch((e) => { console.error('Error:', e.message); process.exit(1); });
