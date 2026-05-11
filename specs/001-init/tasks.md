# Tasks — 001-init React + TypeScript + Tailwind CSS 初始化

## T01：建立 Vite + React + TypeScript 基礎專案結構

**目標**：建立完整的 package.json、tsconfig 三件套、vite.config.ts、index.html、src/ 骨架。

**涉及檔案**
- `package.json`（scripts: dev / build / preview / lint / format / test / test:ui / typecheck）
- `tsconfig.json`（references root）
- `tsconfig.app.json`（target: ES2022, strict: true, paths: {"@/*": ["./src/*"]}）
- `tsconfig.node.json`（vite.config.ts 用）
- `vite.config.ts`（@vitejs/plugin-react, @tailwindcss/vite, resolve.alias @/ → src/）
- `index.html`
- `src/main.tsx`（React 19 createRoot）
- `src/App.tsx`（BrowserRouter + 基本路由）
- `src/vite-env.d.ts`（ImportMetaEnv 擴充）

**Acceptance Criteria**
- `npm install` 成功，無 peer dependency 衝突
- `npm run dev` 啟動於 localhost:5173，無 console error
- `npm run build` 成功產出 `dist/`，無 TypeScript 錯誤
- `npm run typecheck`（`tsc --noEmit`）回傳 exit code 0

---

## T02：安裝並設定 Tailwind CSS 4

**目標**：透過 `@tailwindcss/vite` plugin 整合 Tailwind CSS 4，驗證 utility class 正常套用。

**涉及檔案**
- `tailwind.config.ts`（content: ["./index.html", "./src/**/*.{ts,tsx}"]）
- `src/index.css`（`@import 'tailwindcss'`，Tailwind v4 語法）
- `src/pages/HomePage.tsx`（使用 Tailwind class 的 demo 首頁）
- `src/components/ui/Button.tsx`（variant: primary / secondary，純 Tailwind 實作）

**Acceptance Criteria**
- `npm run build` 產出的 CSS bundle 包含 Tailwind utilities
- 瀏覽器中 Button primary 顯示藍色背景，secondary 顯示灰色背景
- 不引入任何 CSS Modules 或其他 CSS 方案

---

## T03：設定 ESLint 9（flat config）+ Prettier

**目標**：建立 ESLint flat config，整合 TypeScript、React Hooks、React Refresh 規則；建立 Prettier 設定。

**涉及檔案**
- `eslint.config.ts`（flat config，plugins: @eslint/js, typescript-eslint, react-hooks, react-refresh）
- `.prettierrc.json`（singleQuote: true, printWidth: 100, trailingComma: 'es5', semi: false）
- `.prettierignore`（dist/, node_modules/, specs/）

**Acceptance Criteria**
- `npm run lint` 在乾淨專案中回傳 exit code 0
- `npm run format` 執行成功，無 unformatted files
- ESLint 規則 `@typescript-eslint/no-explicit-any` 設為 `error`
- `eslint-plugin-react-hooks` 的 `rules-of-hooks` 與 `exhaustive-deps` 設為 `error`

---

## T04：設定 Vitest + Testing Library

**目標**：建立測試框架，設定 jsdom environment，撰寫 Button 元件的第一個單元測試。

**涉及檔案**
- `vite.config.ts`（test 區塊：environment: 'jsdom', globals: true, setupFiles: ['./src/test/setup.ts']）
- `src/test/setup.ts`（`import '@testing-library/jest-dom'`）
- `src/components/ui/Button.test.tsx`（render、disabled 狀態、onClick callback 三個測試案例）

**Acceptance Criteria**
- `npm run test`（`vitest run`）全部通過
- Button 測試覆蓋：正常 render、disabled prop、onClick 呼叫次數
- `npm run test:ui`（`vitest --ui`）指令存在於 package.json

---

## T05：建立 husky + lint-staged pre-commit hook

**目標**：安裝並初始化 husky，建立 `.husky/pre-commit`，依序執行 lint-staged → tsc → vitest。

**涉及檔案**
- `.husky/pre-commit`（可執行 shell script）
- `.lintstagedrc.json`（*.{ts,tsx}: [eslint --fix, prettier --write]；*.{json,md,css}: [prettier --write]）
- `package.json`（scripts.prepare: "husky"）

**Acceptance Criteria**
- `npm run prepare` 成功初始化 husky
- 對 staged `.tsx` 檔案執行 `git commit`，lint-staged 被觸發
- 故意加入 TypeScript 型別錯誤（`const x: number = 'string'`），`git commit` 被中止
- 故意讓測試失敗，`git commit` 被中止

---

## T06：建立服務層與環境變數設計

**目標**：建立 `src/services/api.ts`（fetch wrapper），定義共用型別，建立 `.env.example`，確保 `.env.local` 不進入版控。

**涉及檔案**
- `src/services/api.ts`（`fetchApi<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>>`，含 timeout + error handling）
- `src/types/index.ts`（ApiResponse<T>、ApiError interface）
- `.env.example`（VITE_API_BASE_URL=、VITE_APP_TITLE=）
- `.gitignore`（確認 .env*.local、dist/、node_modules/ 均在列）

**Acceptance Criteria**
- `fetchApi<T>` 無 `any`，型別完整
- `import.meta.env.VITE_API_BASE_URL` 為 `string` 型別（透過 vite-env.d.ts）
- `.env.local` 不出現在 `git status` 的 tracked files 中
- `fetchApi` 在 `VITE_API_BASE_URL` 未設定時拋出明確錯誤訊息

---

## T07：建立 Dockerfile + nginx.conf

**目標**：建立兩階段 Dockerfile，Stage 2 使用 nginx:1.27-alpine，nginx.conf 透過 envsubst template 支援 `$PORT`，並處理 SPA routing。

**涉及檔案**
- `Dockerfile`（Stage 1: node:20-alpine build；Stage 2: nginx:1.27-alpine serve）
- `nginx.conf`（listen ${PORT:-80}，try_files，/health 路由）
- `.dockerignore`（node_modules/, .git/, .env.local, dist/, specs/）

**Acceptance Criteria**
- `docker build -t reactdemo .` 成功
- `docker run -e PORT=8080 -p 8080:8080 reactdemo` 啟動
  - `curl localhost:8080/` → HTTP 200
  - `curl localhost:8080/health` → HTTP 200，body 為 `ok`
  - `curl localhost:8080/any-spa-route` → HTTP 200（SPA fallback）
- Docker image size < 50 MB

---

## T08：建立示範首頁與 Router 設定

**目標**：建立最小可運行首頁，展示 Tailwind 樣式與 Button 元件，設定 react-router-dom BrowserRouter。

**涉及檔案**
- `src/App.tsx`（BrowserRouter → Routes → Route path="/" element={<HomePage />}）
- `src/pages/HomePage.tsx`（顯示 VITE_APP_TITLE、Button 元件 primary/secondary demo）

**Acceptance Criteria**
- `npm run dev` 後 localhost:5173 正確顯示首頁
- 頁面顯示來自 `import.meta.env.VITE_APP_TITLE` 的標題文字
- Button primary / secondary 兩個 variant 均可見
- 無 React console error / warning

---

## T09：更新 README.md

**目標**：更新 README，包含開發、測試、部署的完整指令說明。

**涉及檔案**
- `README.md`

**Acceptance Criteria**
- 包含 Quick Start（git clone → npm install → cp .env.example .env.local → npm run dev）
- 包含 Available Scripts 完整列表（dev / build / lint / format / test / test:ui / typecheck）
- 包含環境變數設定說明
- 包含 Docker 本地部署指令
- 包含 pre-commit hook 說明（自動在 git commit 觸發）
