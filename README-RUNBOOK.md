# Dashboard Runner — Sprint 3 (Prebuild / Offline / Safe)

이 폴더는 네가 올린 Electron 프로젝트를 기준으로,
- **원격 CDN 제거** (React/Tailwind 외부 로드 없이 동작)
- **오프라인 로컬 에셋만 사용** (renderer.js / renderer.css)
- **강한 CSP** (원격 차단, 인라인 스크립트 금지)
- **렌더러에서 Node 끔** (contextIsolation: true, nodeIntegration: false, sandbox: true)
로 재구성한 안전한 기본 골격입니다.

## 0) 설치 & 실행
```powershell
# 프로젝트 폴더로 이동
Set-Location "C:\path\to\fixed_electron_runner"

# 설치
npm ci || npm install

# 실행
npm start
```

## 1) 배포(포터블 EXE)
```powershell
npm run dist
```
산출물은 `dist/` 폴더에 생성됩니다. (electron-builder)

## 2) SRI/해시가 뭐야? (초간단)
- **해시 파일명(contenthash)**: `main.abcd1234.js` 처럼 파일 내용으로 이름을 만드는 것. 내용이 바뀌면 이름도 바뀌어 브라우저가 “새 파일”로 인식합니다.
- **SRI(Subresource Integrity)**: `<script integrity="sha256-...">` 처럼 **파일 내용의 지문**을 HTML에 적어 두는 것. 내용이 1바이트라도 바뀌면 로딩이 차단됩니다.

👉 웹 배포(HTTP)에서 특히 중요합니다.  
👉 지금 이 Electron 오프라인 템플릿은 **로컬 파일만** 읽기 때문에 SRI가 필수는 아닙니다. 대신 CSP로 원격/인라인을 막아 안전성을 확보했습니다.

## 3) 기존 프로젝트에 적용하려면?
1) Electron 메인(현재의 `main.js`)을 이 템플릿처럼 **로컬 index.html**만 로드하게 수정
2) 렌더러는 CDN/Babel 대신 **로컬 번들**(예: Vite/webpack)로 생성된 JS/CSS를 사용
3) `index.html`에 **CSP** 메타 추가 (`default-src 'self' ...`) — 원격 차단
4) (웹 배포도 한다면) 빌드 산출물에 **해시 파일명** + **SRI** 주입
5) electron-builder로 `npm run dist` 빌드
