# Notion Paper Archive

이 폴더는 `Codex에 PDF를 올리면 논문 정보를 정리해서 Notion DB에 넣는 작업`을 위한 프로젝트입니다.

핵심 원칙은 단순합니다.

- AI 요약은 Codex 대화에서 수행
- 로컬 파일에는 정리된 JSON을 저장
- 스크립트는 그 JSON을 Notion DB 페이지로 업로드

## 논문 정리 기준

논문 정리 가이드의 기준 문서는 `paper_note_ai_reference.md` 입니다.

이 문서 기준으로 다음 원칙을 따릅니다.

- 팩트 노트와 해석/질문 노트를 분리
- 수치에는 가능한 한 단위와 조건 포함
- 저자 핵심 주장과 근거 figure/table을 함께 기록
- 실제 검증 범위와 미검증 범위를 구분
- 논문에 없는 내용은 추측하지 않고 불명확하다고 명시

JSON 스키마는 기존대로 유지하되, `one_sentence_summary` 는 `8. 한 줄 요약`, `page_content` 는 나머지 구조화 본문을 담습니다.

## 가장 편한 사용 방식

1. 이 프로젝트 폴더를 Codex에서 연다.
2. 새 채팅을 시작한다.
3. PDF 논문 파일을 채팅에 올리거나, PDF를 이 폴더 바로 아래에 넣어둔다.
4. Codex가 이 프로젝트의 [AGENTS.md] 지침에 따라 자동으로:
   - 논문 메타데이터 정리
   - `papers/` 아래 JSON 저장
   - Notion DB 업로드
   - 페이지 본문 작성
5. 마지막에 생성된 Notion 페이지 URL을 알려준다.

즉, 목표 사용 방식은 `새 채팅 + PDF 업로드` 또는 `새 채팅 + 루트 PDF 사용`만으로 끝나는 흐름입니다.

## 자동화 범위

자동 입력:

- 논문 제목
- 저자
- 저널명
- 출판연도
- 주요내용 요약
- 구조화된 본문

수동 입력:

- 중요도
- 키워드
- 연구 형태
- 상태
- DOI
- PDF/Citation

## 설정 파일

스크립트는 아래 순서대로 환경값을 읽습니다.

1. `.env`
2. `.env.local`
3. `.env.example`

따라서 혼자 쓰는 프로젝트라면 `.env.example`에 실제 토큰과 DB ID를 넣어도 동작합니다.

필수 값:

```env
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id
```

속성명이 기본값과 다를 때만 추가:

```env
NOTION_PROP_TITLE=논문 제목
NOTION_PROP_AUTHORS=저자
NOTION_PROP_JOURNAL=저널명
NOTION_PROP_YEAR=출판연도
NOTION_PROP_SUMMARY=주요내용 요약
```

## 입력 JSON 구조

기본 템플릿:

- [templates/paper-entry.template.json]
- [papers/sample-paper.json]

구조:

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

`page_content`는 자유롭게 바꿔도 되지만, 기본적으로는 `paper_note_ai_reference.md` 의 0~9 구조를 유지하는 편이 좋습니다.

## 주요 파일

- [AGENTS.md]: 새 채팅에서 PDF 업로드 시 Codex가 따라야 할 자동 작업 규칙
- [paper_note_ai_reference.md]: 논문 정리의 기준이 되는 레퍼런스 가이드
- [prompts/codex-paper-summary-prompt.md]: 필요시 사용할 고정 프롬프트
- [scripts/check-database.mjs]: DB 속성 타입 확인
- [scripts/find-target-pdf.mjs]: 루트 폴더 PDF 탐색
- [scripts/extract-pdf-info.py]: PDF 메타데이터와 앞부분 본문 추출
- [scripts/new-paper.mjs]: 새 JSON 템플릿 생성
- [scripts/upload-paper.mjs]: Notion 업로드

## 수동 실행이 필요할 때

DB 확인:

```bash
npm.cmd run check-db
```

루트 PDF 확인:

```bash
npm.cmd run find-pdf
```

최신 PDF 하나만 출력:

```bash
npm.cmd run find-pdf -- --latest
```

새 JSON 생성:

```bash
npm.cmd run new-paper -- papers/my-paper.json
```

업로드 미리보기:

```bash
node scripts/upload-paper.mjs papers/sample-paper.json --dry-run
```

실제 업로드:

```bash
npm.cmd run upload -- papers/sample-paper.json
```

## 보강된 점

- 프로젝트 루트 PDF를 자동 대상으로 삼는 규칙 추가
- 최신 PDF 자동 선택 보조 스크립트 추가
- PDF 메타데이터와 앞부분 본문 추출 스크립트 추가
- 한글 경로 이슈를 피하기 위해 상대경로 중심 워크플로우 유지
- `paper_note_ai_reference.md` 기준의 구조화된 논문 정리 포맷 반영

## 현재 상태

완료:

- Notion 업로드 스크립트 구현
- JSON 템플릿 구현
- AGENTS 자동 워크플로우 규칙 추가
- `paper_note_ai_reference.md` 기준 정리 가이드 반영
- `--dry-run` 검증 완료
- 실제 Notion 페이지 1건 업로드 검증 완료
