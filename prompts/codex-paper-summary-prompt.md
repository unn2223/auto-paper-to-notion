다음 PDF 논문을 읽고 `paper_note_ai_reference.md` 기준으로 아래 JSON 형식으로만 답변해줘.

규칙:
- 설명 문장이나 마크다운 코드블록 없이 JSON만 출력한다.
- `title`, `journal`, `one_sentence_summary`는 문자열이다.
- `authors`는 문자열 배열이다.
- `year`는 숫자형 4자리 연도다.
- `one_sentence_summary`는 레퍼런스 가이드의 `8. 한 줄 요약`에 해당하며, 논문의 진짜 메시지를 한 문장으로 요약한다.
- `page_content`는 배열이다.
- 각 섹션은 `heading`과 함께 `paragraphs` 또는 `bullets`를 가진다.
- 팩트와 해석을 섞지 않는다. 팩트는 본문 섹션에, 해석/질문은 `9. 해석/질문 노트`에만 쓴다.
- 수치가 나오면 가능한 한 단위와 측정 조건을 함께 적는다.
- `4. 핵심 결과`에는 저자 핵심 주장과 baseline 대비 개선점을 포함한다.
- `5. 근거와 증거 강도`에는 핵심 figure/table, 사용된 근거, 직접 증거인지 간접 해석인지, 증거 강도 코멘트를 포함한다.
- 정보가 부족하면 추측하지 말고 아래 표현 중 적절한 것을 쓴다: `논문 본문에서 명시적으로 확인되지 않음`, `abstract 기준으로는 불명확함`, `figure 추가 확인 필요`, `본문 전체 확인 필요`, `논문이 이 항목을 직접 다루지 않음`.
- oxide TFT / display / oxide memory / reliability 계열 논문이면 Vth, mobility, SS, hysteresis, contact resistance, channel thickness, dielectric/interface, BTI, hydrogen, retention, endurance, array demo 여부를 우선 확인한다.

출력 형식:

```json
{
  "title": "논문 제목",
  "authors": ["저자 1", "저자 2"],
  "journal": "저널명",
  "year": 2024,
  "one_sentence_summary": "이 논문의 진짜 메시지를 한 줄로 요약한다.",
  "page_content": [
    {
      "heading": "0. 기본 정보",
      "bullets": [
        "학회/연도: ...",
        "세션: ...",
        "저자/기관: ...",
        "소자 종류: ...",
        "핵심 키워드: ..."
      ]
    },
    {
      "heading": "1. 문제 정의",
      "bullets": [
        "핵심 문제: ...",
        "기존 한계: ...",
        "왜 중요한가: ..."
      ]
    },
    {
      "heading": "2. 제안 내용",
      "bullets": [
        "핵심 아이디어: ...",
        "분류(구조/재료/공정/측정/모델링): ...",
        "기존 대비 차이: ..."
      ]
    },
    {
      "heading": "3. 소자/공정 정보",
      "bullets": [
        "소자 구조: ...",
        "채널 재료/두께: ...",
        "gate dielectric: ...",
        "source/drain/contact: ...",
        "공정 특징: ...",
        "anneal 조건: ...",
        "비고: ..."
      ]
    },
    {
      "heading": "4. 핵심 결과",
      "bullets": [
        "주요 성능 지표: ...",
        "주요 신뢰성/메모리 지표: ...",
        "측정 조건: ...",
        "baseline 대비 개선점: ...",
        "저자 핵심 주장: ..."
      ]
    },
    {
      "heading": "5. 근거와 증거 강도",
      "bullets": [
        "핵심 figure: ...",
        "핵심 table: ...",
        "사용된 근거: ...",
        "직접 증거 / 간접 해석: ...",
        "증거 강도 코멘트: ..."
      ]
    },
    {
      "heading": "6. 논문이 실제로 검증한 범위",
      "bullets": [
        "검증 수준: ...",
        "어디까지 보여줬는가: ...",
        "아직 비어 있는 부분: ..."
      ]
    },
    {
      "heading": "7. 저자가 인정한 한계",
      "bullets": [
        "limitation: ...",
        "추가 검증 필요 부분: ..."
      ]
    },
    {
      "heading": "9. 해석/질문 노트",
      "bullets": [
        "내가 추가로 이해해야 할 개념: ...",
        "아직 헷갈리는 점: ...",
        "비교할 다른 논문: ...",
        "지도교수/선배에게 물어볼 질문: ...",
        "다음에 찾아볼 키워드: ..."
      ]
    }
  ]
}
```
