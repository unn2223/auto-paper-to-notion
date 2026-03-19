다음 PDF 논문을 읽고 아래 JSON 형식으로만 답변해줘.

규칙:
- 설명 문장이나 마크다운 코드블록 없이 JSON만 출력한다.
- `title`, `journal`, `one_sentence_summary`는 문자열이다.
- `authors`는 문자열 배열이다.
- `year`는 숫자형 4자리 연도다.
- `one_sentence_summary`는 논문의 핵심 결론만 담은 한 문장이다.
- `page_content`는 배열이다.
- 각 섹션은 `heading`과 함께 `paragraphs` 또는 `bullets`를 가진다.
- 내용이 불확실하면 추측하지 말고 가장 보수적으로 작성한다.

출력 형식:

```json
{
  "title": "논문 제목",
  "authors": ["저자 1", "저자 2"],
  "journal": "저널명",
  "year": 2024,
  "one_sentence_summary": "이 논문은 핵심 결론을 한 문장으로 요약한다.",
  "page_content": [
    {
      "heading": "연구 목적",
      "paragraphs": [
        "이 연구가 해결하려는 문제"
      ]
    },
    {
      "heading": "방법론",
      "bullets": [
        "사용한 접근 1",
        "사용한 접근 2"
      ]
    },
    {
      "heading": "핵심 결과",
      "bullets": [
        "핵심 결과 1",
        "핵심 결과 2"
      ]
    },
    {
      "heading": "한계",
      "bullets": [
        "한계 1"
      ]
    }
  ]
}
```
