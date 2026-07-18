# 수업용 빙고 프린트

교사가 텍스트 항목을 입력해 4x4 또는 5x5 학생용 빙고판을 여러 장 생성하고 A4 가로 형식으로 브라우저에서 인쇄하는 정적 웹 앱입니다.

## 주요 기능

- 줄 단위 텍스트 항목 입력
- 4x4 또는 5x5 빙고판 생성
- 같은 판 반복 출력 또는 학생별 무작위 판 생성
- 생성 장수 직접 입력, 최대 100장
- A4 가로 전용 인쇄
- 페이지당 1개 또는 2개 빙고판 배치
- 제목과 이름칸 출력
- 브라우저 `localStorage`를 통한 최근 설정/항목 자동 저장
- Docker Compose 기반 정적 파일 서빙

## 개발

```bash
npm install
npm run dev
```

## 검증

```bash
npm run check
npm run test
npm run build
```

## Docker Compose 실행

```bash
docker compose up --build
```

접속: `http://localhost:8080`

## 출력

앱에서 항목과 설정을 입력한 뒤 `생성`을 누르고 `인쇄`를 누르면 브라우저 인쇄창이 열립니다. 출력은 A4 가로 전용이며 한 페이지에 빙고판을 1개 또는 2개 배치할 수 있습니다. 앱은 PDF 파일을 직접 만들지 않으며, PDF 저장이 필요한 경우 브라우저 인쇄창의 PDF 저장 기능을 사용합니다.

## 문서

- 설계서: [`docs/superpowers/specs/2026-07-18-bingo-print-design.md`](docs/superpowers/specs/2026-07-18-bingo-print-design.md)
- 구현 계획: [`docs/superpowers/plans/2026-07-18-bingo-print-implementation.md`](docs/superpowers/plans/2026-07-18-bingo-print-implementation.md)
- 구현 요약: [`docs/implementation-summary.md`](docs/implementation-summary.md)

## 현재 제약

- 서버 저장, 로그인, 이미지 항목, 정답지/호출 목록 출력은 지원하지 않습니다.
- PDF 파일을 앱에서 직접 생성하지 않습니다.
- Docker Compose 검증은 로컬 Docker 또는 Colima 데몬이 실행 중이어야 가능합니다.
