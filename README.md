# 수업용 빙고 프린트

교사가 텍스트 항목을 입력해 4x4 또는 5x5 학생용 빙고판을 여러 장 생성하고 A4 가로 형식으로 브라우저에서 인쇄하는 정적 웹 앱입니다.

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
