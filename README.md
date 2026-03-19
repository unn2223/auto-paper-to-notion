# Notion Paper Archive

이 폴더는 `Codex에 PDF를 올리면 논문 정보를 정리해서 Notion DB에 넣는 작업`을 위한 프로젝트입니다.

핵심 원칙은 단순합니다.

- AI 요약은 Codex 대화에서 수행
- 로컬 파일에는 정리된 JSON을 저장
- 스크립트는 그 JSON을 Notion DB 페이지로 업로드

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
  "one_sentence_summary": "이 논문은 핵심 결론을 한 문장으로 요약한다.",
  "page_content": [
    {
      "heading": "연구 목적",
      "paragraphs": ["연구 목적 설명"]
    },
    {
      "heading": "핵심 결과",
      "bullets": ["결과 1", "결과 2"]
    }
  ]
}
```

`page_content`는 자유롭게 바꿔도 됩니다. 섹션명, 순서, 문단/불릿 구성 모두 수정 가능합니다.

## 주요 파일

- [AGENTS.md]: 새 채팅에서 PDF 업로드 시 Codex가 따라야 할 자동 작업 규칙
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

## 현재 상태

완료:

- Notion 업로드 스크립트 구현
- JSON 템플릿 구현
- AGENTS 자동 워크플로우 규칙 추가
- `--dry-run` 검증 완료
- 실제 Notion 페이지 1건 업로드 검증 완료
