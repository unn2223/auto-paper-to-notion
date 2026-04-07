# Paper Import Workflow

이 프로젝트에서는 사용자가 PDF 논문 파일을 채팅에 업로드하거나, 프로젝트 루트에 PDF를 넣어둔 상태에서 논문 등록을 요청하면 그 PDF를 Notion 학술논문 아카이브에 등록하는 작업으로 간주한다.

## Default Behavior

PDF 업로드가 보이거나 루트 폴더의 PDF 처리가 암시되면 아래 순서로 바로 수행한다.

1. 대상 PDF를 정한다.
2. PDF를 읽고 `paper_note_ai_reference.md` 기준으로 논문 정보를 지정된 JSON 스키마로 정리한다.
3. `papers/` 아래에 새 JSON 파일을 만든다.
4. `node scripts/upload-paper.mjs <json-file-path>` 로 Notion 업로드를 시도한다.
5. 성공하면 생성된 Notion 페이지 URL과 저장한 JSON 파일 경로를 사용자에게 알려준다.

대상 PDF 선택 규칙:

- 사용자가 채팅에 PDF를 첨부했다면 그 첨부 파일을 우선한다.
- 첨부가 없고 프로젝트 루트에 PDF가 하나만 있으면 그 파일을 사용한다.
- 첨부가 없고 프로젝트 루트에 PDF가 여러 개 있으면 가장 최근 수정된 PDF를 우선한다.
- 루트 PDF 목록 확인이 필요하면 `node scripts/find-target-pdf.mjs --latest` 또는 `node scripts/find-target-pdf.mjs` 를 사용한다.
- 메타데이터와 앞부분 본문 확인이 필요하면 `python scripts/extract-pdf-info.py <pdf-path>` 를 사용한다.

질문은 꼭 필요한 경우에만 한다. 예를 들어 PDF 내용이 손상되어 읽을 수 없거나, Notion 설정이 누락된 경우에만 짧게 물어본다.

## Summary Guide

논문 정리는 `paper_note_ai_reference.md` 를 최우선 기준으로 따른다.

핵심 규칙:

- 팩트와 해석/질문 노트를 분리한다.
- 수치는 가능한 한 단위와 측정 조건을 함께 적는다.
- 저자의 핵심 주장과 그 근거 figure/table/분석 방식을 같이 적는다.
- 논문이 실제로 검증한 범위와 아직 비어 있는 범위를 구분한다.
- 논문에 없는 내용은 추측하지 말고 불명확하다고 적는다.

## JSON Schema

반드시 아래 필드만 사용한다.

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
        "학회/연도:",
        "세션:",
        "저자/기관:",
        "소자 종류:",
        "핵심 키워드:"
      ]
    },
    {
      "heading": "1. 문제 정의",
      "bullets": [
        "핵심 문제:",
        "기존 한계:",
        "왜 중요한가:"
      ]
    },
    {
      "heading": "2. 제안 내용",
      "bullets": [
        "핵심 아이디어:",
        "분류(구조/재료/공정/측정/모델링):",
        "기존 대비 차이:"
      ]
    },
    {
      "heading": "3. 소자/공정 정보",
      "bullets": [
        "소자 구조:",
        "채널 재료/두께:",
        "gate dielectric:",
        "source/drain/contact:",
        "공정 특징:",
        "anneal 조건:",
        "비고:"
      ]
    },
    {
      "heading": "4. 핵심 결과",
      "bullets": [
        "주요 성능 지표:",
        "주요 신뢰성/메모리 지표:",
        "측정 조건:",
        "baseline 대비 개선점:",
        "저자 핵심 주장:"
      ]
    },
    {
      "heading": "5. 근거와 증거 강도",
      "bullets": [
        "핵심 figure:",
        "핵심 table:",
        "사용된 근거:",
        "직접 증거 / 간접 해석:",
        "증거 강도 코멘트:"
      ]
    },
    {
      "heading": "6. 논문이 실제로 검증한 범위",
      "bullets": [
        "검증 수준:",
        "어디까지 보여줬는가:",
        "아직 비어 있는 부분:"
      ]
    },
    {
      "heading": "7. 저자가 인정한 한계",
      "bullets": [
        "limitation:",
        "추가 검증 필요 부분:"
      ]
    },
    {
      "heading": "9. 해석/질문 노트",
      "bullets": [
        "내가 추가로 이해해야 할 개념:",
        "아직 헷갈리는 점:",
        "비교할 다른 논문:",
        "지도교수/선배에게 물어볼 질문:",
        "다음에 찾아볼 키워드:"
      ]
    }
  ]
}
```

설명:

- `one_sentence_summary` 는 레퍼런스 가이드의 `8. 한 줄 요약`에 해당한다.
- `page_content` 는 `0. 기본 정보`부터 `7. 저자가 인정한 한계`, `9. 해석/질문 노트`까지를 담는다.
- `9. 해석/질문 노트`는 팩트 노트와 분리해서 작성한다.

## File Naming

JSON 파일명은 `papers/YYYYMMDD-short-title.json` 형식으로 만든다.

규칙:

- 제목은 소문자 영문, 숫자, 하이픈만 남긴다.
- 40자를 넘기지 않는다.
- 제목을 안전하게 만들기 어렵다면 `papers/YYYYMMDD-paper.json` 을 사용한다.

## Notion Config

환경값은 다음 순서로 읽힌다고 가정한다.

1. `.env`
2. `.env.local`
3. `.env.example`

따라서 사용자가 실제 토큰과 DB ID를 `.env.example` 에 넣어둔 상태여도 그대로 사용해도 된다.

## Property Scope

자동 입력 대상은 아래 5개 DB 속성과 페이지 본문이다.

- `논문 제목`
- `저자`
- `저널명`
- `출판연도`
- `주요내용 요약`
- 페이지 본문 `page_content`

아래 속성은 자동으로 채우지 않는다.

- `중요도`
- `키워드`
- `연구 형태`
- `상태`
- `DOI`
- `PDF/Citation`

## Failure Handling

업로드 실패 시 아래를 우선 확인한다.

1. `NOTION_TOKEN`
2. `NOTION_DATABASE_ID`
3. 데이터베이스 속성명 존재 여부
4. 속성 타입 호환 여부

실패 원인은 에러 메시지 그대로 간단히 설명한다.

## Codex Sandbox Note

If `node scripts/upload-paper.mjs <json-file-path>` fails with `fetch failed`, treat it as a likely sandbox/network restriction rather than a paper-data problem. In that case, immediately rerun the same command with escalated permissions so it can reach the Notion API.
