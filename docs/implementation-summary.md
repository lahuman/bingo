# 수업용 빙고 프린트 구현 요약

작성일: 2026-07-18

## 현재 상태

수업용 빙고 프린트 웹 앱은 SvelteKit/Vite 기반 앱으로 구현되어 있다. 앱 기능은 서버 API 없이 브라우저에서 동작하며, 교사가 입력한 텍스트 항목과 출력 설정을 `localStorage`에 저장한다. Docker 배포에서는 Nginx 정적 서빙 대신 SvelteKit Node 서버를 실행한다.

최종 출력 사양은 사용자 인쇄 테스트 피드백을 반영해 A4 가로 전용으로 단순화했다. 페이지당 배치는 1개 또는 2개만 지원한다. 세로 출력과 페이지당 4개 배치는 제거했다.

## 구현된 기능

- 제목 입력
- 줄 단위 텍스트 항목 입력
- 4x4, 5x5 빙고판 선택
- 최소 항목 수 검증: 4x4는 16개, 5x5는 25개
- 항목 초과 입력 시 필요한 개수만 무작위 선택
- 같은 판 반복 출력
- 학생별 무작위 판 출력
- 생성 장수 직접 입력
- 생성 장수 범위 제한: 1장 이상 100장 이하
- 페이지당 1개 또는 2개 출력
- A4 가로 전용 인쇄 스타일
- 제목과 이름칸이 포함된 학생용 빙고판
- 긴 항목은 글자 크기를 단계적으로 줄이고 빙고 칸 크기는 고정
- 브라우저 인쇄창 호출
- 최근 입력 항목과 설정 자동 저장
- Docker Compose 기반 SvelteKit Node 서버 실행 구성
- `.env`의 `BINGO_PORT` 값으로 Docker 호스트 포트 조정

## 제외된 기능

- 로그인
- 서버 저장
- PDF 직접 생성
- 이미지 항목
- 정답지 또는 교사용 호출 목록 출력
- 5x5 가운데 FREE 칸
- A4 세로 출력
- 페이지당 4개 출력

## 주요 파일

- `src/lib/bingo.ts`: 항목 파싱, 검증, 셔플, 보드 생성 로직
- `src/lib/settings.ts`: 기본 설정, 저장값 정규화, `localStorage` 저장/복원
- `src/routes/+page.svelte`: 페이지 상태, 생성/인쇄 흐름, 컴포넌트 조합
- `src/lib/components/SettingsPanel.svelte`: 교사용 설정 입력
- `src/lib/components/ItemsEditor.svelte`: 항목 입력과 항목 수 표시
- `src/lib/components/PreviewToolbar.svelte`: 생성/인쇄 버튼과 검증 메시지
- `src/lib/components/BingoBoard.svelte`: 단일 빙고판 렌더링
- `src/lib/components/PrintPreview.svelte`: 페이지 단위 출력 미리보기
- `src/app.css`: 화면 레이아웃과 A4 가로 인쇄 스타일
- `.env.example`: Docker Compose 호스트 포트 예시 설정
- `Dockerfile`, `docker-compose.yml`: SvelteKit Node 서버 배포

## 검증 현황

마지막 검증 결과:

- `npm run check`: 통과
- `npm run test`: 통과, 4개 테스트 파일 / 27개 테스트
- `npm run build`: 통과, `build/` SvelteKit Node 빌드 산출물 생성

Docker Compose는 SvelteKit 빌드 산출물을 `node build`로 실행한다. 이 작업 환경에서는 Docker/Colima 데몬 소켓이 없어 실행 검증이 막혔다. Docker 또는 Colima를 켠 환경에서는 다음 명령으로 확인한다.

```bash
cp .env.example .env
docker compose up --build
```

## 작업 이력

- `7feedce`: 설계 문서 추가
- `25a6688`: 구현 계획 문서 추가
- `324f6e1`: SvelteKit 정적 앱 초기 구성
- `25a74e1`: 빙고 생성 로직 추가
- `5aa8173`: 브라우저 설정 저장 추가
- `a98e654`: 교사용 UI와 빙고 미리보기 추가
- `8d38ac0`: 반응형/인쇄 스타일 추가
- `1c4ce98`: Docker Compose 배포 구성 추가
- `e6e4165`: 인쇄 레이아웃을 A4 가로 전용으로 단순화
- `b29f53b`: 작업 문서화
- `aa396a9`: Nginx 없이 SvelteKit Node 서버로 Docker 실행 방식 변경
- `2905149`: `.env`로 Docker Compose 호스트 포트 설정 추가
- 최신 변경: 긴 문구 셀 글자 크기 조정과 빙고 칸 고정
