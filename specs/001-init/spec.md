## Overview
初始化 React 19 + TypeScript 5 + Tailwind CSS 4 的前端 Demo 專案，具備嚴格型別檢查、pre-commit 品質閘門（husky + lint-staged + tsc + vitest），並以 multi-stage Dockerfile 部署至 Railway（nginx serve 靜態檔案，監聽 process.env.PORT）。

## User Stories

### US-01：專案初始化
As a 開發者，I want to 從空目錄快速獲得一個結構完整的 React TypeScript 專案，so that 後續功能開發有明確的目錄慣例可遵循。

**Acceptance Criteria**
- Given 工作目錄為 `D:\claude\reactDemo`
- When 執行 `npm install`
- Then 所有依賴安裝成功，`npm run dev` 可正常啟動，`npm run build` 產出 `dist/` 不含 TypeScript 錯誤

### US-02：品質閘門
As a 開發者，I want to 每次 `git commit` 前自動執行型別檢查與測試，so that 有問題的程式碼不會進入 main 分支。

**Acceptance Criteria**
- Given 開發者執行 `git commit`
- When staged files 包含 `.ts` / `.tsx`
- Then husky pre-commit hook 依序執行：lint-staged（ESLint fix + Prettier write）→ `tsc --noEmit` → `vitest run`，任一失敗則 commit 中止

### US-03：容器化部署
As a 維運人員，I want to 用 Docker 建置並部署前端，so that 在 Railway 上可以零設定上線，且 PORT 環境變數能被正確讀取。

**Acceptance Criteria**
- Given Railway 注入 `PORT=3000` 環境變數
- When Docker container 啟動
- Then nginx 監聽 `$PORT`，`GET /` 回傳 200，靜態資源正確提供

### US-04：環境變數設計
As a 開發者，I want to 透過 `.env.local` 管理本地設定，so that secret 不會意外 hardcode 或進入版控。

**Acceptance Criteria**
- Given `.env.local` 包含 `VITE_API_BASE_URL=http://localhost:8000`
- When 應用程式啟動
- Then `import.meta.env.VITE_API_BASE_URL` 可正確讀取該值
- And `.env.local` 已列於 `.gitignore`，不被追蹤

---

## Modules

| Module | 職責 | 涉及路徑 |
|--------|------|---------|
| `vite-config` | Vite 建置設定、路徑別名（`@/`） | `vite.config.ts` |
| `ts-config` | TypeScript 嚴格模式設定 | `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` |
| `tailwind-config` | Tailwind CSS 4 設定 | `tailwind.config.ts` |
| `eslint-config` | ESLint + TypeScript + React Hooks 規則 | `eslint.config.ts` |
| `prettier-config` | 格式規則（單引號、print width 100） | `.prettierrc.json` |
| `pre-commit-hooks` | husky + lint-staged + tsc + vitest 品質閘門 | `.husky/pre-commit`, `.lintstagedrc.json` |
| `dockerfile` | multi-stage build：node build → nginx serve | `Dockerfile`, `nginx.conf` |
| `env-template` | 環境變數範本 | `.env.example`, `.env.local`（gitignored） |
| `src/components` | 可重用 UI 元件（無頁面狀態依賴） | `src/components/` |
| `src/pages` | 頁面級元件，對應路由 | `src/pages/` |
| `src/hooks` | 自定義 React hooks | `src/hooks/` |
| `src/services` | API 呼叫邏輯（fetch wrapper、error handling） | `src/services/` |
| `src/types` | 全域 TypeScript 型別定義 | `src/types/` |
| `src/utils` | 純函式工具（格式化、計算等） | `src/utils/` |
| `src/assets` | 靜態資源（圖片、SVG） | `src/assets/` |
| `src/test` | 測試工具設定（vitest setup、test utils） | `src/test/` |

---

## 目錄結構

```
D:\claude\reactDemo\
├── .env.example
├── .env.local                    # gitignored
├── .gitignore
├── .husky/
│   └── pre-commit
├── .lintstagedrc.json
├── .prettierrc.json
├── .prettierignore
├── .dockerignore
├── Dockerfile
├── nginx.conf
├── CLAUDE.md
├── README.md
├── eslint.config.ts
├── package.json
├── package-lock.json
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── index.html
├── public/
│   └── favicon.svg
├── specs/
│   └── 001-init/
│       ├── spec.md
│       ├── tasks.md
│       └── handoff-sa.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── vite-env.d.ts
    ├── index.css
    ├── assets/
    ├── components/
    │   └── ui/
    │       ├── Button.tsx
    │       └── Button.test.tsx
    ├── hooks/
    ├── pages/
    │   └── HomePage.tsx
    ├── services/
    │   └── api.ts
    ├── types/
    │   └── index.ts
    ├── utils/
    └── test/
        └── setup.ts
```

---

## Dependencies

### dependencies（runtime）
| 套件 | 版本 | 用途 |
|------|------|------|
| `react` | `^19.1.0` | React core |
| `react-dom` | `^19.1.0` | DOM renderer |
| `react-router-dom` | `^7.6.0` | 客戶端路由 |

### devDependencies（build / dev / test）
| 套件 | 版本 | 用途 |
|------|------|------|
| `vite` | `^6.3.0` | 建置工具 |
| `@vitejs/plugin-react` | `^4.4.0` | React HMR / JSX transform |
| `typescript` | `^5.8.0` | TypeScript compiler |
| `@types/react` | `^19.1.0` | React 型別 |
| `@types/react-dom` | `^19.1.0` | ReactDOM 型別 |
| `tailwindcss` | `^4.1.0` | Tailwind CSS 4 |
| `@tailwindcss/vite` | `^4.1.0` | Tailwind v4 Vite plugin |
| `eslint` | `^9.25.0` | Linter（flat config） |
| `@eslint/js` | `^9.25.0` | ESLint JS 規則 |
| `typescript-eslint` | `^8.30.0` | TypeScript ESLint 整合 |
| `eslint-plugin-react-hooks` | `^5.2.0` | React Hooks 規則 |
| `eslint-plugin-react-refresh` | `^0.4.20` | React Fast Refresh 規則 |
| `prettier` | `^3.5.0` | Code formatter |
| `vitest` | `^3.1.0` | 測試框架 |
| `@vitest/ui` | `^3.1.0` | Vitest UI 介面 |
| `@testing-library/react` | `^16.3.0` | React 元件測試 |
| `@testing-library/jest-dom` | `^6.6.0` | DOM assertion matchers |
| `@testing-library/user-event` | `^14.6.0` | 使用者事件模擬 |
| `jsdom` | `^26.1.0` | DOM 環境（vitest） |
| `husky` | `^9.1.0` | Git hooks 管理 |
| `lint-staged` | `^15.5.0` | 對 staged files 執行 lint |
| `globals` | `^15.15.0` | ESLint globals |

---

## Data Contracts

### 環境變數型別擴充（`src/vite-env.d.ts`）
```typescript
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### 共用 API 型別（`src/types/index.ts`）
```typescript
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message: string;
}

export interface ApiError {
  status: 'error';
  data: Record<string, never>;
  message: string;
}
```

---

## Pre-Commit Hook 設計

執行順序：
```
git commit
  → husky .husky/pre-commit
      1. npx lint-staged        （staged .ts/.tsx: ESLint --fix + Prettier --write）
      2. npx tsc --noEmit       （全專案型別檢查）
      3. npx vitest run         （全量測試）
  → 全部通過 → commit 成功
  → 任一失敗 → commit 中止，顯示錯誤
```

`.lintstagedrc.json` 設定：
```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

---

## Dockerfile 設計（multi-stage）

```
Stage 1（builder）: node:20-alpine
  COPY package.json package-lock.json ./
  RUN npm ci
  COPY . .
  RUN npm run build
  → 產出 dist/

Stage 2（runner）: nginx:1.27-alpine
  COPY --from=builder /app/dist /usr/share/nginx/html
  COPY nginx.conf /etc/nginx/templates/default.conf.template
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
```

nginx.conf 使用官方 envsubst template 機制（`/etc/nginx/templates/`），`$PORT` 在 container 啟動時替換。

```nginx
server {
    listen ${PORT:-80};
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        return 200 'ok';
        add_header Content-Type text/plain;
    }
}
```

---

## Edge Cases

| 情境 | 處理方式 |
|------|---------|
| `VITE_` 環境變數缺失 | `vite-env.d.ts` 標記型別；`api.ts` 加防禦判斷，缺失時 throw 明確錯誤訊息 |
| pre-commit 型別錯誤 | commit 中止（正常行為），開發者需修正後重新 commit |
| vitest 測試失敗 | commit 中止，顯示失敗測試報告 |
| Railway PORT 未注入 | nginx 預設使用 80（`${PORT:-80}`） |
| SPA 路由刷新 404 | nginx `try_files $uri $uri/ /index.html` 處理 |
| Docker build 含 secret | 禁止 `ARG` 傳遞 secret；VITE_ 為公開 build-time 值 |
| `.husky/pre-commit` 無執行權限 | `husky init` 自動設定；Windows 環境需確認 Git Bash 可執行 sh |

---

## Out of Scope
- 狀態管理套件（Zustand / Redux）
- GitHub Actions CI/CD workflow
- E2E 測試（Playwright / Cypress）
- i18n / 多語系
- PWA / Service Worker
- 後端 API 實作
- CSS Modules（統一用 Tailwind）
