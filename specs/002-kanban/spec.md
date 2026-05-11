## Overview

實作一個靜態 Kanban 看板管理系統頁面，以四欄（待處理、進行中、待確認、已完成）呈現卡片，
支援關鍵字搜尋（標題 + 描述 + 標籤）及新增卡片 UI 入口（alert 佔位），
資料來源為 `src/data/kanban.json`，整合至 React 19 + TypeScript + Tailwind CSS 4 + HashRouter 專案。

---

## User Stories

### US-01：卡片搜尋
As a 任務管理者，I want to 在搜尋框輸入關鍵字，so that 能快速找到跨欄位的相關卡片。

**Acceptance Criteria**
- Given 看板已渲染完畢
- When 使用者在搜尋框輸入文字（e.g. `「效能」`）
- Then 所有欄位僅顯示標題、描述或任一 tag 包含該關鍵字的卡片（case-insensitive）
- And 不符合的卡片從 DOM 中移除，欄位計數同步更新為篩選後數量
- And 搜尋框清空時，所有卡片恢復顯示

### US-02：新增卡片入口
As a 任務管理者，I want to 點擊「新增卡片」按鈕，so that 能啟動新增任務的操作（UI only）。

**Acceptance Criteria**
- Given 頁面頂部操作列已渲染
- When 使用者點擊藍色「新增卡片」按鈕
- Then 瀏覽器顯示 `alert('新增卡片功能開發中')` 訊息
- And 按鈕本身需可被 Tab 鍵 focus，樣式與 Button 元件 `primary` variant 一致

### US-03：四欄看板顯示
As a 任務管理者，I want to 看到分為四欄的看板佈局，so that 能一眼掌握各階段任務數量與內容。

**Acceptance Criteria**
- Given 進入 `/kanban` 路由
- When 頁面渲染完成
- Then 畫面顯示四欄：待處理（藍）、進行中（黃）、待確認（紫）、已完成（綠）
- And 每欄標題列顯示欄名及卡片數量 badge
- And 每張卡片顯示：標題、描述、tags（彩色 badge）、指派對象、優先度、截止日期
- And 優先度 `high` 顯示紅色標籤，`medium` 顯示黃色，`low` 顯示灰色
- And 畫面在 1280px 以上為四欄水平排列，低於 768px 退化為單欄垂直堆疊

### US-04：拖曳移動（Out of Scope）
本次 spec 不實作拖曳，保留欄位結構供後續擴充。

---

## Data Model

### JSON 檔案路徑選擇

**選定路徑：`src/data/kanban.json`**

理由：
1. **隨 bundle 打包**：Vite 將 `src/` 下的 JSON 透過 `import kanbanData from '@/data/kanban.json'` 靜態引入，tree-shaking 友善，型別推導自動。
2. **型別安全**：TypeScript `resolveJsonModule: true`（tsconfig.app.json 已啟用）可直接推導 JSON 結構，無需額外宣告。
3. **不需 HTTP 請求**：mock data 隨 JS bundle 一起交付，無 CORS 問題、無 fetch 失敗風險。
4. **colocate 原則**：資料與使用它的程式碼放在同一目錄樹，依賴關係清晰。

`public/` 保留給需要 runtime fetch 的外部資源（第三方 CDN script、需要動態替換而不重新 build 的設定等），不適合靜態 mock data。

---

## TypeScript 型別定義

路徑：`src/types/kanban.ts`

```typescript
export type Priority = 'high' | 'medium' | 'low'

export type ColumnStatus = 'todo' | 'in-progress' | 'in-review' | 'done'

export interface Card {
  id: string
  title: string
  description: string
  tags: string[]
  assignee: string
  priority: Priority
  dueDate: string // ISO 8601 日期字串，e.g. "2026-05-20"
}

export interface Column {
  id: string
  title: string        // 待處理 / 進行中 / 待確認 / 已完成
  status: ColumnStatus
  color: 'blue' | 'yellow' | 'purple' | 'green'
  cards: Card[]
}

export interface KanbanData {
  columns: Column[]
}
```

---

## Mock Data 設計（10 張卡片）

路徑：`src/data/kanban.json`（見 tasks.md T01）

4 欄：待處理（3張）、進行中（3張）、待確認（2張）、已完成（2張）

---

## Component Tree

```
src/
├── data/
│   └── kanban.json                    # mock data
├── types/
│   ├── index.ts                       # 既有 ApiResponse / ApiError
│   └── kanban.ts                      # 新增：Card / Column / KanbanData / Priority / ColumnStatus
├── pages/
│   ├── HomePage.tsx                   # 既有，僅新增 Link 導航
│   └── KanbanPage.tsx                 # 新增：頂層看板頁，管理 searchQuery state
├── components/
│   ├── ui/
│   │   └── Button.tsx                 # 既有，直接使用
│   └── kanban/
│       ├── KanbanBoard.tsx            # 新增：渲染四欄，接收 columns + searchQuery
│       ├── KanbanColumn.tsx           # 新增：單欄（標題列 + 卡片計數 + 卡片列表）
│       ├── KanbanCard.tsx             # 新增：單張卡片（所有欄位）
│       ├── KanbanCard.test.tsx        # 新增：Card 元件測試（T07）
│       └── SearchBar.tsx              # 新增：搜尋框 + 新增按鈕列
└── App.tsx                            # 修改：新增 /kanban 路由
```

### 元件責任分配

| 元件 | Props | 責任 |
|------|-------|------|
| `KanbanPage` | — | 讀取 kanban.json、管理 `searchQuery` state、佈局外框 |
| `SearchBar` | `value`, `onChange`, `onAdd` | 搜尋輸入框 + 新增按鈕，純 UI，無副作用 |
| `KanbanBoard` | `columns: Column[]`, `searchQuery: string` | 依 searchQuery 過濾後渲染四欄 |
| `KanbanColumn` | `column: Column`, `filteredCards: Card[]` | 欄標題（含計數 badge）+ 卡片列表 |
| `KanbanCard` | `card: Card` | 卡片所有欄位顯示，無 state |

---

## 搜尋邏輯

```typescript
function filterCards(cards: Card[], query: string): Card[] {
  if (query.trim() === '') return cards
  const lower = query.toLowerCase()
  return cards.filter(
    (card) =>
      card.title.toLowerCase().includes(lower) ||
      card.description.toLowerCase().includes(lower) ||
      card.tags.some((tag) => tag.toLowerCase().includes(lower)),
  )
}
```

- 搜尋欄位：`title`、`description`、`tags[]`（三者取 OR）
- 大小寫不敏感
- 欄位計數顯示篩選後的卡片數量
- 即時響應（onChange 觸發，無防抖需求）

---

## 視覺規格

### 欄位顏色對應（必須使用完整靜態 class，禁止動態拼接）

| 欄位 | 標題背景 | 計數 badge |
|------|---------|-----------|
| 待處理（blue） | `bg-blue-500` | `bg-blue-100 text-blue-700` |
| 進行中（yellow） | `bg-yellow-500` | `bg-yellow-100 text-yellow-700` |
| 待確認（purple） | `bg-purple-500` | `bg-purple-100 text-purple-700` |
| 已完成（green） | `bg-green-500` | `bg-green-100 text-green-700` |

### 優先度標籤

| priority | badge 樣式 | 顯示文字 |
|----------|-----------|---------|
| `high` | `bg-red-100 text-red-700` | 高優先度 |
| `medium` | `bg-yellow-100 text-yellow-700` | 中優先度 |
| `low` | `bg-gray-100 text-gray-600` | 低優先度 |

### 響應式

- `>= 1280px`（xl）：`grid-cols-4`
- `>= 768px` / `< 1280px`（md）：`grid-cols-2`
- `< 768px`：`grid-cols-1`

---

## Edge Cases

| 情境 | 處理方式 |
|------|---------|
| 搜尋結果為空 | 欄位顯示「無符合結果」空狀態文字，計數顯示 0 |
| 搜尋字串含特殊字元 | `String.prototype.includes()` 原生處理，無需 escape |
| `tags` 為空陣列 | 不渲染 tag 區域 |
| `kanban.json` 欄位順序變更 | 以 JSON 陣列順序為準 |

---

## Out of Scope

- 拖曳移動卡片
- 新增卡片 Modal / Form（本次僅 alert 佔位）
- 卡片刪除 / 編輯功能
- 使用者認證 / 多人協作
- 資料持久化
- 截止日期過期視覺警示
