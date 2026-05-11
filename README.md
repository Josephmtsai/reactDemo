# 看板 Kanban

React 19 + TypeScript 5 + Tailwind CSS 4 全功能 Kanban 看板 Demo，支援拖拉卡片、新增/編輯/刪除、Toast 通知，自動部署至 GitHub Pages。

---

## 功能特色

- **四欄看板**：📋 待處理 / ⚡ 進行中 / 🔍 待驗收 / ✅ 已完成
- **拖拉移動**：@dnd-kit 跨欄拖拉，懸停欄位上移動畫，拖曳卡片旋轉效果
- **新增卡片**：標題 + 描述必填驗證，新增後 toast 通知
- **編輯卡片**：點擊卡片或 hover icon 開啟 Modal，可修改標題、描述、狀態
- **刪除卡片**：hover 右上角出現刪除按鈕，confirm 後移除
- **Toast 通知**：右上角固定，3 秒自動消失，支援新增 / 更新 / 拖曳完成提示
- **Mobile 響應**：`grid-cols-1 md:grid-cols-2 xl:grid-cols-4` 自適應排版

---

## 安裝與啟動

**環境需求**：Node.js 20+、npm

```sh
git clone <repo-url>
cd reactDemo
npm install
npm run dev
```

打開 [http://localhost:5173](http://localhost:5173) 即可使用。

### 常用指令

| 指令                | 說明                          |
| ------------------- | ----------------------------- |
| `npm run dev`       | 啟動 Vite dev server（HMR）   |
| `npm run build`     | 型別檢查後產生 `dist/`        |
| `npm run preview`   | 本地預覽 production build     |
| `npm run lint`      | ESLint 檢查                   |
| `npm run format`    | Prettier 格式化               |
| `npm run test`      | 執行 Vitest 測試              |
| `npm run typecheck` | `tsc --noEmit` 全專案型別檢查 |

---

## 技術選型

| 類別        | 技術                                             |
| ----------- | ------------------------------------------------ |
| UI 框架     | React 19 + TypeScript 5                          |
| 樣式        | Tailwind CSS 4                                   |
| 建構工具    | Vite 6                                           |
| 路由        | React Router v7（HashRouter，GitHub Pages 相容） |
| 拖拉        | @dnd-kit/core + @dnd-kit/utilities               |
| 測試        | Vitest + @testing-library/react                  |
| Lint / 格式 | ESLint 9 flat config + Prettier                  |
| Pre-commit  | husky + lint-staged（lint → typecheck → test）   |
| CI/CD       | GitHub Actions → GitHub Pages（`gh-pages` 分支） |
| AI 開發工具 | Claude Code CLI + claude-sonnet-4-6              |

---

## 專案結構

```
src/
├── components/
│   ├── kanban/          # 看板元件（Board, Column, Card, AddCardForm, EditCardModal）
│   └── ui/              # 通用 UI（Button, Toast, Toaster）
├── constants/           # COLUMNS, STATUS_LABELS, STATUS_ICONS 靜態資料
├── data/                # kanban.json 初始卡片資料
├── hooks/               # useToast（Toast Context + Provider）
├── pages/               # KanbanPage（主頁）
├── types/               # Card, ColumnDef, ColumnStatus TypeScript 型別
├── App.tsx              # HashRouter 根元件 + ToastProvider
├── main.tsx             # React 入口
└── index.css            # Tailwind CSS 4 import

specs/                   # SA 產出的規格文件（各 feature 子目錄）
├── 001-init/
├── 002-kanban/
├── 003-style/
├── 004-kanban-full/
├── 005-ux-polish/
└── 006-status-icons/
```

---

## SDD 三 Agent 開發流程

本專案使用 Claude Code 的 **SA → Developer → QA** 三 Agent 流程開發：

### SA（系統分析師）

負責釐清需求、撰寫 User Story、拆解子任務，產出：

- `specs/<feature>/spec.md`：功能規格、邊界條件、API 設計
- `specs/<feature>/tasks.md`：實作細節與 Acceptance Criteria
- `specs/<feature>/handoff-sa.json`：交付給 Developer 的 handoff

> 禁止：SA 不寫業務程式碼，只做規格分析。

### Developer（資深後端/前端工程師）

根據 SA 產出的 spec-kit 進行實作：

- 評估規格合理性、可行性
- 實作 React 元件、Custom Hook、路由
- 執行 `typecheck` 與 `test`，產出 `handoff-dev.json`

> 禁止：不 hardcode 設定值、密鑰；不超出規格範圍新增功能。

### QA（品質保證工程師）

Developer 完成後進行驗證：

- 逐條核對 Acceptance Criteria
- 補充邊界測試、edge case
- 回報 bug（不自行修改業務邏輯）

### 使用方式

在 Claude Code 中輸入 `SA <需求描述>` 觸發 SA Agent，後續流程自動依序執行。

---

## CI/CD 部署

Push 到 `main` 自動觸發 GitHub Actions：

1. **Type check** — `tsc --noEmit`
2. **Test** — `vitest run`
3. **Build** — `vite build`（`BASE_URL=/<repo-name>/`）
4. **Deploy** — 靜態檔案推送至 `gh-pages` 分支

Live site：`https://<username>.github.io/<repo-name>/`

啟用 GitHub Pages：**Settings → Pages → Source → `gh-pages` / `/(root)`**

> `gh-pages` 分支由 CI 全權管理，請勿手動推送。

---

## Pre-Commit Hook

每次 `git commit` 自動執行：

1. **lint-staged** — ESLint fix + Prettier 格式化（`.ts` / `.tsx`）
2. **tsc --noEmit** — 型別錯誤則中止
3. **vitest run** — 測試失敗則中止

手動初始化 hook：

```sh
npm run prepare
```

---

## 開發歷程 — AI 輔助對話紀錄

本專案從空白資料夾到完整功能，全程使用 Claude Code CLI 以 SDD 流程驅動，以下為各對話的目標、關鍵決策與產出。

---

### 對話 0｜環境規格重寫

**目標**：將舊有 Python/Railway 的 CLAUDE.md 改寫為 React 前端 Demo 規格。

**提示**

> 「裡面的 claude.md 跟 agent 相關都是 python 我要做的是 react 前端單純 demo 然後使用 railway 簡單起一個容器部屬 請幫我修改」

**決策與理由**

- 採納：改為 React + TypeScript + Tailwind CSS 4 + Vite + GitHub Pages，移除所有 Python 相關設定
- 後來用戶再次調整：部署目標從 Railway 改為 GitHub Pages，因 GH Pages 對靜態站點免費且無容器管理成本

**產出摘要**

- 重寫 `CLAUDE.md`：定義架構規範（KISS/YAGNI）、Tailwind-only 樣式、HashRouter、`VITE_` 前綴環境變數、Conventional Commits

---

### 對話 1｜001-init — 專案初始化

**目標**：從零建立 React + TypeScript + Tailwind 專案結構，加上 pre-commit hook 確保型別與測試通過才能 commit。

**提示**

> 「SA 幫我初始化一個 React + TypeScript + Tailwind 的專案結構（並且要考慮架構層面 檔案位置要有結構）並且加上 pre-commit hook 檢查型別並且測試要都通過 使用 SDD 開發 照原本 SDD 流程」

![SA + Developer 啟動畫面](sample/2026-05-11%2015%2001%2018.png)

**關鍵對話**

- SA 分析後拆為 T01–T09：Vite 基礎結構 → Tailwind 4 → ESLint 9 → Vitest → husky → 服務層 → Dockerfile → 首頁 → README
- Developer 實作完成（72 tool uses，40.1k tokens，1h 8s）
- QA 驗收（57 tool uses，40.8k tokens，47m 42s）

![QA 驗收結果 — T01–T09 全部 PASS](sample/2026-05-11%2015%2001%2029.png)

**決策與理由**
| 決策 | 採納 | 理由 |
|------|------|------|
| Tailwind CSS 4（`@import 'tailwindcss'`，非 v3 的 `@tailwind base`） | ✅ 採納 | 符合最新版語法，避免舊語法警告 |
| ESLint 9 flat config（`eslint.config.ts`） | ✅ 採納 | ESLint 9 已棄用 `.eslintrc.*` |
| HashRouter（非 BrowserRouter） | ✅ 採納 | GitHub Pages 不支援 HTML5 pushState，直接 URL 會 404 |
| Dockerfile + nginx.conf | ❌ 後來移除 | 部署目標改為 GH Pages，容器不需要 |
| `{} as T` 型別斷言 | ❌ QA 回報後修正 | 若 T 為陣列型別，空物件在 runtime 會出錯 |

**產出摘要**

- `vite.config.ts`：`base: process.env['BASE_URL'] ?? '/'`
- `.github/workflows/deploy.yml`：typecheck → test → build → gh-pages
- husky pre-commit：lint-staged → tsc --noEmit → vitest run
- `src/App.tsx`：HashRouter 根元件
- 10 tests（Button × 3 + 其他）全通過

---

### 對話 2｜002-kanban — 靜態看板

**目標**：根據截圖刻出靜態 Kanban 看板，4 欄 + 10 張 mock 卡片，資料從 JSON 載入。

**提示**

> 「SA 請根據圖片上畫面 刻劃出一樣的資料 然後裡面的看板狀態預設先放到某一個 DATA.JSON 檔案 路徑由 React best practices 決定 照 SDD 規格開發」

**決策與理由**
| 決策 | 採納 | 理由 |
|------|------|------|
| 資料放 `src/data/kanban.json` | ✅ 採納 | React 慣例：靜態資料與元件並列 src/，非 public/ |
| Card 含 priority / assignee / tags / dueDate | ✅ 採納（暫時） | 符合截圖欄位；後來 004 大幅精簡 |
| 欄定義從 JSON 讀取 | ❌ 後來改掉 | 004 時改為 `constants/kanban.ts` 靜態常數，避免 JSON 型別不安全 |
| SearchBar 元件 | ✅ 採納 | 截圖有搜尋列；後來 004 改版後成 dead code，保留原檔不刪 |

**產出摘要**

- `src/types/kanban.ts`：`KanbanData`、`Column`、`Card`（含 priority/assignee/tags/dueDate）
- `src/data/kanban.json`：4 欄 × 10 卡片結構
- `KanbanBoard` / `KanbanColumn` / `KanbanCard` / `SearchBar` 元件
- `KanbanPage` 作為 `/kanban` 路由（首頁為 HomePage）

---

### 對話 3｜003-style — 視覺優化

**目標**：提升看板視覺質感，加入 priority 色條、assignee 頭像圓圈、hover shadow、漸層背景。

**提示**

> 「SA 幫我優化裡面的 style 讓他比較好看 以 tailwind 相關樣式做 一樣照流程交付」

**決策與理由**
| 決策 | 採納 | 理由 |
|------|------|------|
| priority 色條用 `border-l-4 border-{color}` | ✅ 採納 | 視覺直觀，常見 Kanban 慣例 |
| 動態拼接 Tailwind class（`border-${priority}-500`） | ❌ 拒絕 | Tailwind 靜態掃描不支援動態字串，class 會被 purge 掉；改用靜態 Record map |
| assignee 用真實 avatar URL | ❌ 拒絕 | Demo 不依賴外部資源；改用姓名縮寫 + 固定顏色圓圈 |

**產出摘要**

```typescript
// 靜態 colorMap 範例（禁止動態拼接）
const priorityBorderMap: Record<Priority, string> = {
  high: 'border-l-4 border-red-400',
  medium: 'border-l-4 border-yellow-400',
  low: 'border-l-4 border-green-400',
}
```

- 漸層背景：`bg-gradient-to-br from-slate-100 to-blue-50`
- 欄標題：顏色 header bar + badge 卡片數

---

### 對話 4｜004-kanban-full — 全功能重構

**目標**：依照 PDF 作業規格，將看板精簡為 title/description/status 三欄，加入 @dnd-kit 拖拉、AddCardForm 必填驗證、EditCardModal 編輯，看板改為首頁。

**提示**

> 「SA 請參考 Azeroth 面前作業 - Kanban 網站開發.pdf 完成需求實作 看板直接做成首頁 裡面的資料改成標題、描述、狀態 然後在看板上方可以新增卡片標題以及卡片描述 都是必填欄位使用 REACT 驗證方法 新增後預設是待處理狀態」

**決策與理由**
| 決策 | 採納 | 理由 |
|------|------|------|
| Card breaking change：移除 priority/assignee/tags/dueDate | ✅ 採納 | PDF 規格明確，過去欄位屬於 PoC，精簡更符合需求 |
| @dnd-kit（非 react-beautiful-dnd） | ✅ 採納 | react-beautiful-dnd 已停止維護；@dnd-kit 輕量現代 |
| DndContext 放 KanbanPage，非 KanbanBoard | ✅ 採納 | DragOverlay 與 handleDragEnd 需在同一 Context 內，集中管理最清晰 |
| PointerSensor `activationConstraint: { distance: 8 }` | ✅ 採納 | 防止點擊卡片時誤觸發拖拉 |
| 表單驗證用 React useState，不裝 react-hook-form | ✅ 採納 | Demo 規模不需要重型表單庫，YAGNI |
| 欄定義從 JSON 移至 `constants/kanban.ts` | ✅ 採納 | 靜態常數型別安全，不需 JSON 斷言 |

**產出摘要**

```typescript
// Card 精簡後的型別
export interface Card {
  id: string
  title: string
  description: string
  status: ColumnStatus
}
```

```tsx
// DragOverlay 集中在 KanbanPage
<DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
  <KanbanBoard columns={COLUMNS} cards={cards} onEdit={setEditingCard} />
  <DragOverlay>
    {activeCard && <KanbanCard card={activeCard} onEdit={() => undefined} isDragOverlay />}
  </DragOverlay>
</DndContext>
```

- `AddCardForm`：兩欄必填，submit 後清空，錯誤訊息即時顯示
- `EditCardModal`：backdrop click 關閉，status select 顯示全部四個選項
- KanbanPage 改為 `path="/"` 首頁路由

---

### 對話 5｜005-ux-polish — UX 細節優化

**目標**：依照展示影片細節進行六項 UX 改進：Toast 通知系統、卡片 hover 操作按鈕、拖拉動畫、mobile 優化、overflow 修正、page title。

**提示**

![005-ux-polish 六項需求對話](sample/2026-05-11%2017%2035%2040.png)

> 「SA 我要根據 Kanban-demo.mp4 影片細節做一些內部調整：
>
> 1. 針對滑動到不同的狀態，那個狀態的區塊要稍微上移，並且移動到的卡片右上角有編輯跟刪除的 ICON…
> 2. 拖移卡片的時候將卡片稍微往右旋轉 30 度…
> 3. 針對 mobile device 請根據你認為的最佳化…
> 4. Page Title 不要顯示 vite XX 顯示看板就好
> 5. 拖拉卡片的時候看起來下方有 scroll bar + 有一些跑版
> 6. 新增卡片完成後也需要顯示右上角會有一個小 dialog 彈出 卡片新增」

**決策與理由**
| 決策 | 採納 | 理由 |
|------|------|------|
| Toast 用 React Context 自製，不裝 react-toastify | ✅ 採納 | Demo 規模，避免不必要依賴；`useToast` hook 3 秒自動消失即可 |
| 自訂 SVG ripple cursor | ❌ 調整 | `cursor-grabbing` 已足夠表達拖拉狀態；自訂 cursor 兼容性問題多 |
| 拖拉旋轉 30 度 | ❌ 調整為 5 度 | 30 度視覺過於誇張，5 度更自然 |
| 原始卡片拖拉時不做 transform | ✅ 採納 | `isDragging ? {} : { transform: CSS.Transform.toString(transform) }` — transform 交給 DragOverlay，避免原位卡片超出容器造成 scrollbar |
| `overflow-x-hidden` 加到 main | ✅ 採納 | 根本解決水平 scrollbar 問題 |
| `window.confirm` 刪除確認 | ✅ 採納 | Demo 不需自訂 confirm modal，KISS |

**QA 發現的 bug（修正後合入）**

1. `overflow-y-auto overflow-hidden` 衝突 → 改為 `overflow-x-hidden overflow-y-auto`
2. 同欄位 drop 觸發不必要的 toast → 加入 same-status early return guard

**產出摘要**

```typescript
// useToast hook 核心
const addToast = useCallback((t: Omit<ToastItem, 'id'>) => {
  const id = `toast-${Date.now()}-${Math.random()}`
  setToasts((prev) => [{ ...t, id }, ...prev])
  setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3000)
}, [])
```

```typescript
// handleDragEnd — 同欄 guard + 差異化 toast
const currentCard = cards.find((c) => c.id === cardId)
if (currentCard?.status === newStatus) return
const message =
  newStatus === 'done' ? '🎉 太棒了，已完成！' : `已移至「${STATUS_LABELS[newStatus]}」`
```

- `src/hooks/useToast.tsx`：ToastContext + ToastProvider + useToast
- `src/components/ui/Toast.tsx` + `Toaster.tsx`
- KanbanCard：`onDelete` prop + hover icon buttons（pencil / trash SVG）
- 10 tests 全通過（新增 3 個 delete 相關測試）

---

### 對話 6｜006-status-icons — 狀態 Icon

**目標**：為四個欄位標題與編輯 Modal 的狀態下拉選單加入對應 emoji icon。

**提示**

> 「SA 待處理、進行中、待驗收、已完成這四個狀態前面我想要新增對應的 ICON 並且在編輯的下拉選單也可以看到相同樣式 icon 請實作」

**決策與理由**
| 決策 | 採納 | 理由 |
|------|------|------|
| 使用 emoji，不用 SVG | ✅ 採納 | `<option>` 元素不支援 SVG，emoji 是唯一跨瀏覽器方案，且欄標題與 select 可保持一致 |
| icon 儲存在 `ColumnDef.icon` + `STATUS_ICONS` Record | ✅ 採納 | 單一資料來源，欄標題和 Modal 都從同一常數讀取 |
| 安裝 icon library（lucide-react 等） | ❌ 拒絕 | Demo 規模不值得增加依賴；inline SVG 或 emoji 已足夠 |

**產出摘要**

```typescript
// constants/kanban.ts 新增
export const STATUS_ICONS: Record<ColumnStatus, string> = {
  todo: '📋',
  'in-progress': '⚡',
  'in-review': '🔍',
  done: '✅',
}
```

```tsx
// KanbanColumn 標題
<span className="font-bold text-sm tracking-wide flex items-center gap-1.5">
  <span>{column.icon}</span>
  {column.title}
</span>
// EditCardModal option
<option key={col.id} value={col.status}>
  {STATUS_ICONS[col.status]} {STATUS_LABELS[col.status]}
</option>
```

---

## 技術取捨總覽

| 主題           | 選擇                         | 放棄                  | 原因                                          |
| -------------- | ---------------------------- | --------------------- | --------------------------------------------- |
| 路由           | HashRouter                   | BrowserRouter         | GH Pages 不支援 pushState，直連 URL 會 404    |
| 拖拉           | @dnd-kit                     | react-beautiful-dnd   | rbd 已停止維護                                |
| 表單驗證       | React useState               | react-hook-form / zod | Demo 規模，YAGNI                              |
| Toast          | 自製 Context                 | react-toastify        | 避免非必要依賴                                |
| Icon           | emoji                        | SVG / lucide-react    | `<option>` 不支援 SVG；emoji 跨平台一致       |
| 部署           | GitHub Pages                 | Railway / Docker      | GH Pages 免費，靜態站點不需容器               |
| Tailwind class | 靜態 Record map              | 動態字串拼接          | Tailwind 靜態掃描，動態 class 會被 purge      |
| 型別斷言       | `initialCardsJson as Card[]` | `{} as T`             | 空物件斷言型別不安全，陣列型別 runtime 會出錯 |
| 同欄 drop      | early return guard           | 無條件執行            | 避免拖到同欄觸發無意義 toast 和 state 更新    |
