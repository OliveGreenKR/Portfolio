# 덱 PDF 의 북마크(Navigation Pane)를 슬라이드 목록대로 다시 쓴다.
#   0단계: 프로젝트(표지 슬라이드) · 표제지 · 목차 · 마지막 링크 장
#   1단계: 그 프로젝트의 각 장 — "절 이름 — 장 제목"
# Chrome 자동 outline 을 버리는 이유는 이름뿐이다(표제지가 헤드라인 두 문장으로 잡히고,
# 한 슬라이드 안의 소제목이 별도 항목으로 새는 장이 있다). 목적지 좌표는 그대로 페이지 최상단.
import json
import sys

import pypdf

pdf_path, slides_path, out_path = sys.argv[1:4]
slides = json.load(open(slides_path, encoding='utf-8'))
reader = pypdf.PdfReader(pdf_path)
writer = pypdf.PdfWriter(clone_from=pdf_path)
# clone_from 은 원본 outline 까지 복제한다 — 새로 쓰기 전에 비운다.
writer._root_object.pop('/Outlines', None)
writer._root_object.pop('/OpenAction', None)

parent = None
for s in slides:
    page = s['page'] - 1
    if s['isTitle']:
        title = '표제지'
    elif s['isToc']:
        title = '목차'
    elif s['isCover']:
        title = s['proj']
    else:
        title = s['heading']

    if s['isTitle'] or s['isToc']:
        writer.add_outline_item(title, page)
        parent = None
    elif s['isCover']:
        parent = writer.add_outline_item(title, page, bold=True)
    else:
        # 절 이름을 접두사로 붙이지 않는다 — 크롬 라벨이 프로젝트마다 층이 달라
        # ('01 밸런싱' vs 'a' vs '02 물리') 붙이면 항목마다 대시가 둘씩 생긴다.
        writer.add_outline_item(s['heading'] or s['section'], page, parent=parent)

writer.write(out_path)
print(f'pages {len(reader.pages)} -> {out_path}')
