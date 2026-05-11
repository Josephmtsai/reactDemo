# React Demo 專案規範

## 1. 環境與依賴管理 (Environment)

- **Runtime**: Node.js 20+。
- **Package Manager**: 統一使用 **npm**。
- **Dependencies**: 核心依賴記錄於 `package.json`，鎖定版本使用 `package-lock.json`。

## 2. 程式碼品質 (Quality)

- **Linting & Formatting**: 使用 **ESLint** + **Prettier**。
  - 指令: `npm run lint` / `npm run format`
- **型別**: 使用 **TypeScript**，避免 `any`。
- **禁令**: 不得 hardcode 任何 secret，一律透過 `.env` 讀取（`VITE_` 前綴）。
- **功能修改**: 確保修改不影響既有功能；bug 修正需開 feature branch，commit 後 merge 回 main。

## 3. 架構 (Architecture)

- **KISS & YAGNI**: 這是 demo 專案，不過度抽象，保持簡單。
- **元件結構**: 元件放 `src/components/`，頁面放 `src/pages/`。
- **樣式**: 使用 **Tailwind CSS** 或 CSS Modules，不混用。
- **State**: 優先使用 React 內建 hooks（useState、useReducer），複雜狀態再考慮外部狀態管理。

## 4. 部署 (GitHub Pages)

- **部署目標**: GitHub Pages，使用 `gh-pages` 分支存放靜態檔案。
- **CI/CD**: `.github/workflows/deploy.yml`，push 到 `main` 自動觸發 typecheck → test → build → deploy。
- **Base URL**: Vite `base` 由 CI 傳入 `BASE_URL=/<repo-name>/`，本地開發預設 `/`。
- **Router**: 使用 `HashRouter`（`/#/path`），避免 GitHub Pages 不支援 HTML5 pushState 的 404 問題。
- **環境變數**: `VITE_` 前綴為 build-time 公開變數，不可存放 secret；本地開發用 `.env.local`（已加入 `.gitignore`）。

## 5. Git (CI/CD)

- **Commit**: 遵循 Conventional Commits（`feat`、`fix`、`docs`、`chore`）。
- **Branch**: `main` 為主分支，push 觸發 GitHub Actions；`gh-pages` 由 CI 自動維護，**不手動推送**。

## 6. Agent Workflow

- 這是單人 demo 專案，SA → Developer → QA 流程視需求選用，不強制。
- 需要時可用 `/review` 做 code review，`/security-review` 檢查安全問題。
