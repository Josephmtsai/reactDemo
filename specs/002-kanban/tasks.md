# Tasks — 002-kanban Kanban 看板管理系統

## T01：定義 TypeScript 型別 + 建立 kanban.json mock data

**涉及檔案**
- `src/types/kanban.ts`（新增）
- `src/data/kanban.json`（新增）

**kanban.json 完整內容**
```json
{
  "columns": [
    {
      "id": "col-todo",
      "title": "待處理",
      "status": "todo",
      "color": "blue",
      "cards": [
        {
          "id": "card-01",
          "title": "更新需求書",
          "description": "根據客戶回饋修訂 v2.1 需求文件，補充驗收條件",
          "tags": ["文件", "需求"],
          "assignee": "Alice",
          "priority": "high",
          "dueDate": "2026-05-15"
        },
        {
          "id": "card-02",
          "title": "撰寫技術規格",
          "description": "完成 API 端點設計及資料庫 Schema 初稿",
          "tags": ["技術", "後端"],
          "assignee": "Bob",
          "priority": "medium",
          "dueDate": "2026-05-20"
        },
        {
          "id": "card-03",
          "title": "優化建置流程",
          "description": "評估 Vite 建置快取策略，縮短 CI 時間 30%",
          "tags": ["DevOps", "效能"],
          "assignee": "Carol",
          "priority": "low",
          "dueDate": "2026-05-30"
        }
      ]
    },
    {
      "id": "col-in-progress",
      "title": "進行中",
      "status": "in-progress",
      "color": "yellow",
      "cards": [
        {
          "id": "card-04",
          "title": "完成需求確認 - ABC 客戶",
          "description": "與 ABC 公司確認第三期功能需求，整理會議記錄",
          "tags": ["客戶", "需求"],
          "assignee": "Alice",
          "priority": "high",
          "dueDate": "2026-05-12"
        },
        {
          "id": "card-05",
          "title": "優化效能問題",
          "description": "修復首頁渲染瓶頸，目標 LCP < 2.5s",
          "tags": ["效能", "前端"],
          "assignee": "David",
          "priority": "high",
          "dueDate": "2026-05-14"
        },
        {
          "id": "card-06",
          "title": "準備技術演示",
          "description": "製作 Demo 投影片及 live demo 環境，供下週客戶簡報使用",
          "tags": ["簡報", "Demo"],
          "assignee": "Eve",
          "priority": "medium",
          "dueDate": "2026-05-18"
        }
      ]
    },
    {
      "id": "col-in-review",
      "title": "待確認",
      "status": "in-review",
      "color": "purple",
      "cards": [
        {
          "id": "card-07",
          "title": "第一期回饋整合 - XYZ 公告",
          "description": "彙整 XYZ 團隊對第一期交付物的回饋，提出改善方案",
          "tags": ["回饋", "客戶"],
          "assignee": "Frank",
          "priority": "medium",
          "dueDate": "2026-05-13"
        },
        {
          "id": "card-08",
          "title": "查核回饋 - DEF 業務流程",
          "description": "核對 DEF 業務流程說明書是否符合最新規範",
          "tags": ["審查", "合規"],
          "assignee": "Grace",
          "priority": "low",
          "dueDate": "2026-05-16"
        }
      ]
    },
    {
      "id": "col-done",
      "title": "已完成",
      "status": "done",
      "color": "green",
      "cards": [
        {
          "id": "card-09",
          "title": "完成設計原型",
          "description": "Figma 高保真原型已通過設計評審，交付開發",
          "tags": ["設計", "UI/UX"],
          "assignee": "Alice",
          "priority": "high",
          "dueDate": "2026-05-08"
        },
        {
          "id": "card-10",
          "title": "建立 LinkedIn 帳號",
          "description": "公司官方 LinkedIn 頁面上線，發布第一則貼文",
          "tags": ["行銷", "社群"],
          "assignee": "Heidi",
          "priority": "low",
          "dueDate": "2026-05-05"
        }
      ]
    }
  ]
}
```

**Acceptance Criteria**
- `src/types/kanban.ts` 匯出 `Priority`、`ColumnStatus`、`Card`、`Column`、`KanbanData`，禁止 `any`
- `kanban.json` 包含恰好 4 欄、10 張卡片（3+3+2+2）
- `import kanbanData from '@/data/kanban.json'` 在 strict TypeScript 下無型別錯誤
- `npm run typecheck` exit 0

---

## T02：KanbanBoard 元件（四欄佈局）

**涉及檔案**
- `src/components/kanban/KanbanBoard.tsx`（新增）

**Props**
```typescript
interface KanbanBoardProps {
  columns: Column[]
  searchQuery: string
}
```

**實作細節**
- 在此元件內執行 `filterCards` 邏輯
- 佈局：`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4`
- 每欄傳入篩選後的 `filteredCards` 給 `KanbanColumn`

**Acceptance Criteria**
- 渲染 4 個 `KanbanColumn`
- `searchQuery='效能'` 時，只有含「效能」的卡片出現（case-insensitive）
- `searchQuery=''` 時，所有 10 張卡片渲染
- TypeScript 無型別錯誤

---

## T03：KanbanColumn 元件

**涉及檔案**
- `src/components/kanban/KanbanColumn.tsx`（新增）

**Props**
```typescript
interface KanbanColumnProps {
  column: Column
  filteredCards: Card[]
}
```

**視覺規格（必須使用完整靜態 class，禁止動態拼接字串）**

| column.color | 標題背景 | 計數 badge |
|-------------|---------|-----------|
| blue | `bg-blue-500 text-white` | `bg-blue-100 text-blue-700` |
| yellow | `bg-yellow-500 text-white` | `bg-yellow-100 text-yellow-700` |
| purple | `bg-purple-500 text-white` | `bg-purple-100 text-purple-700` |
| green | `bg-green-500 text-white` | `bg-green-100 text-green-700` |

使用 switch/map 實作色彩對應，不用模板字串拼接。

**Acceptance Criteria**
- 標題列正確顯示欄名與計數
- 搜尋為空結果時顯示「無符合結果」
- 四欄各自套用正確顏色
- TypeScript 無型別錯誤

---

## T04：KanbanCard 元件

**涉及檔案**
- `src/components/kanban/KanbanCard.tsx`（新增）

**Props**
```typescript
interface KanbanCardProps {
  card: Card
}
```

**視覺規格**
- 容器：`bg-white rounded-lg shadow-sm border border-gray-200 p-4`
- 標題：`font-semibold text-gray-900 line-clamp-2`
- 描述：`text-sm text-gray-500 line-clamp-2 mt-1`
- Tags：`bg-blue-100 text-blue-700 text-xs rounded-full px-2 py-0.5`，`tags=[]` 時不渲染 tag 區域
- Priority badge：high=`bg-red-100 text-red-700`、medium=`bg-yellow-100 text-yellow-700`、low=`bg-gray-100 text-gray-600`
- Priority 顯示文字：高優先度 / 中優先度 / 低優先度
- 截止日期：`📅 {dueDate}`（`text-xs text-gray-400`）
- 指派對象：`👤 {assignee}`（`text-xs text-gray-500`）

**Acceptance Criteria**
- 完整顯示所有欄位
- `priority='high'` 顯示紅色 badge 及「高優先度」文字
- `tags=[]` 時不渲染 tag 區域
- TypeScript 無型別錯誤

---

## T05：SearchBar 元件

**涉及檔案**
- `src/components/kanban/SearchBar.tsx`（新增）

**Props**
```typescript
interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onAdd: () => void
}
```

**實作細節**
- 搜尋框：受控 `<input type="text" placeholder="輸入關鍵字..." />`
- 新增按鈕：使用既有 `Button` 元件，`variant='primary'`，文字「新增卡片」
- 佈局：`flex items-center gap-4`，搜尋框 `flex-1`

**Acceptance Criteria**
- `onChange(e.target.value)` 在輸入時被呼叫
- 點擊按鈕觸發 `onAdd()`
- 使用既有 `Button` 元件

---

## T06：KanbanPage + App.tsx 路由接線

**涉及檔案**
- `src/pages/KanbanPage.tsx`（新增）
- `src/App.tsx`（修改）
- `src/pages/HomePage.tsx`（修改：僅新增 Link）

**KanbanPage 實作細節**
- `useState<string>('')` 管理 `searchQuery`
- 靜態 `import kanbanData from '@/data/kanban.json'`
- 頁面標題：`📋 Kanban 看板管理系統`，副標題：`拖曳卡片，輕鬆管理你的任務進度`
- `onAdd`：`() => alert('新增卡片功能開發中')`
- 整體背景：`min-h-screen bg-gray-50 p-6`

**App.tsx 修改**
```tsx
<Route path="/kanban" element={<KanbanPage />} />
```

**HomePage.tsx 修改**
- 新增一個 `<Link to="/kanban">` 按鈕導向看板頁
- 不修改既有 Button 展示邏輯

**Acceptance Criteria**
- `/#/kanban` 正確渲染看板頁
- `/#/` 首頁既有功能不受影響
- 搜尋框更新即時反映篩選結果
- 點擊「新增卡片」出現 alert
- `npm run typecheck` exit 0

---

## T07：KanbanCard 元件測試

**涉及檔案**
- `src/components/kanban/KanbanCard.test.tsx`（新增）

**測試案例（至少 3 個）**
1. 基本渲染：標題、描述、assignee、dueDate 正確顯示在 DOM 中
2. `priority='high'` 時顯示「高優先度」文字，且 badge 包含 red 相關 class
3. `tags=[]` 時不渲染任何 tag badge（`queryAllByRole` 驗證）

**實作細節**
- 使用 `@testing-library/react` + `@testing-library/jest-dom`
- `const mockCard: Card` 定義於測試檔案頂部
- 不 mock 任何模組

**Acceptance Criteria**
- `npm run test` 至少 3 個 KanbanCard test case 全部 pass
- 不使用 `any`
