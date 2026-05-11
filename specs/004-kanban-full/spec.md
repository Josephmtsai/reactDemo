## Overview

依據 PDF 需求（Azeroth 面前作業 - Kanban 網站開發），全面重構 Kanban 看板：
- 卡片資料精簡為「標題、描述、狀態」三欄
- 看板作為首頁（root route `/`）
- 看板上方新增卡片表單（標題 + 描述，必填 React 驗證）
- 點擊卡片開啟 EditModal（可修改標題/描述/狀態）
- `@dnd-kit/core` 實作跨欄拖拉，狀態同步更新

---

## User Stories & Acceptance Criteria

### US1：新增卡片
- **AC 1.1**：看板上方有明確的新增卡片輸入區（標題欄位 + 描述欄位 + 新增按鈕）
- **AC 1.2**：新建立的卡片預設狀態為「待處理」
- **AC 1.3**：卡片成功新增後，立即顯示在「待處理」欄位，無需刷新頁面
- **AC 1.4**：標題與描述為必填，空白提交時顯示錯誤訊息，阻止新增

### US2：卡片狀態管理
- **AC 2.1**：看板以四欄呈現：待處理（藍）、進行中（黃）、待驗收（紫）、已完成（綠）
- **AC 2.2**：每張卡片必須且只能歸屬四個狀態之一

### US3：編輯卡片
- **AC 3.1**：點擊任一卡片，開啟 EditCardModal
- **AC 3.2**：EditModal 可修改標題與描述，儲存後立即更新卡片內容
- **AC 3.3**：EditModal 提供狀態下拉選單，儲存後卡片自動移至對應欄位

### US4：拖拉移動
- **AC 4.1**：使用者能以滑鼠拖動任一卡片
- **AC 4.2**：拖曳至另一欄位並釋放後，卡片穩定停留在新欄位
- **AC 4.3**：卡片移至新欄位後，其 `status` 屬性同步更新為新欄位的 ColumnStatus

---

## 型別定義

### 新 Card interface（`src/types/kanban.ts` 全面替換）

```typescript
// 移除：Priority type、原 Column interface、KanbanData interface
// 新增：ColumnDef interface

export type ColumnStatus = 'todo' | 'in-progress' | 'in-review' | 'done'

export interface Card {
  id: string
  title: string
  description: string
  status: ColumnStatus
}

export interface ColumnDef {
  id: string
  status: ColumnStatus
  title: string
  color: 'blue' | 'yellow' | 'purple' | 'green'
}
```

### COLUMNS 靜態常數（`src/constants/kanban.ts`）

```typescript
import type { ColumnDef } from '@/types/kanban'

export const COLUMNS: ColumnDef[] = [
  { id: 'col-todo',        status: 'todo',        title: '待處理', color: 'blue'   },
  { id: 'col-in-progress', status: 'in-progress', title: '進行中', color: 'yellow' },
  { id: 'col-in-review',   status: 'in-review',   title: '待驗收', color: 'purple' },
  { id: 'col-done',        status: 'done',        title: '已完成', color: 'green'  },
]
```

### 精簡後 kanban.json（`src/data/kanban.json`）

```json
[
  { "id": "card-01", "title": "更新需求書",     "description": "根據客戶回饋修訂 v2.1 需求文件，補充驗收條件",   "status": "todo"        },
  { "id": "card-02", "title": "撰寫技術規格",   "description": "完成 API 端點設計及資料庫 Schema 初稿",            "status": "todo"        },
  { "id": "card-03", "title": "優化建置流程",   "description": "評估 Vite 建置快取策略，縮短 CI 時間 30%",         "status": "todo"        },
  { "id": "card-04", "title": "完成需求確認",   "description": "與 ABC 公司確認第三期功能需求，整理會議記錄",     "status": "in-progress" },
  { "id": "card-05", "title": "優化效能問題",   "description": "修復首頁渲染瓶頸，目標 LCP < 2.5s",               "status": "in-progress" },
  { "id": "card-06", "title": "準備技術演示",   "description": "製作 Demo 投影片及 live demo 環境",               "status": "in-progress" },
  { "id": "card-07", "title": "第一期回饋整合", "description": "彙整 XYZ 團隊對第一期交付物的回饋，提出改善方案", "status": "in-review"   },
  { "id": "card-08", "title": "查核業務流程",   "description": "核對 DEF 業務流程說明書是否符合最新規範",         "status": "in-review"   },
  { "id": "card-09", "title": "完成設計原型",   "description": "Figma 高保真原型已通過設計評審，交付開發",        "status": "done"        },
  { "id": "card-10", "title": "建立 LinkedIn", "description": "公司官方 LinkedIn 頁面上線，發布第一則貼文",      "status": "done"        }
]
```

---

## 狀態管理架構

Single source of truth：`KanbanPage` 的 `useState<Card[]>`

```typescript
// KanbanPage 內部
const [cards, setCards] = useState<Card[]>(initialCards)

// 新增卡片
const addCard = (title: string, description: string): void => {
  const newCard: Card = {
    id: `card-${Date.now()}`,
    title: title.trim(),
    description: description.trim(),
    status: 'todo',
  }
  setCards(prev => [newCard, ...prev])
}

// 更新卡片（含狀態變更）
const updateCard = (updated: Card): void => {
  setCards(prev => prev.map(c => (c.id === updated.id ? updated : c)))
}

// 拖拉移動（僅更新 status）
const moveCard = (cardId: string, newStatus: ColumnStatus): void => {
  setCards(prev => prev.map(c => (c.id === cardId ? { ...c, status: newStatus } : c)))
}

// 每欄卡片 = 篩選
const cardsForColumn = (status: ColumnStatus): Card[] =>
  cards.filter(c => c.status === status)
```

---

## 元件架構

```
src/
├── constants/
│   └── kanban.ts                  # 新增：COLUMNS 靜態常數
├── types/
│   └── kanban.ts                  # 重構：精簡 Card，新增 ColumnDef
├── data/
│   └── kanban.json                # 重構：精簡為 Card[] 陣列
├── components/
│   └── kanban/
│       ├── AddCardForm.tsx        # 新增：標題+描述必填表單
│       ├── EditCardModal.tsx      # 新增：編輯 Modal（title/desc/status）
│       ├── KanbanBoard.tsx        # 重構：DndContext + DragOverlay
│       ├── KanbanColumn.tsx       # 重構：useDroppable
│       ├── KanbanCard.tsx         # 重構：useDraggable + onClick
│       ├── KanbanCard.test.tsx    # 更新：移除 priority/assignee 測試
│       └── SearchBar.tsx          # 保留原檔但不再使用（由 AddCardForm 取代）
└── pages/
    ├── KanbanPage.tsx             # 重構：useState<Card[]> + 接線所有操作
    └── HomePage.tsx               # 保留不修改
```

---

## AddCard 表單驗證規則

```typescript
interface FormErrors {
  title?: string
  description?: string
}

// 驗證邏輯（submit 時觸發）
const errors: FormErrors = {}
if (!title.trim()) errors.title = '標題為必填欄位'
if (!description.trim()) errors.description = '描述為必填欄位'
if (Object.keys(errors).length > 0) {
  setErrors(errors)
  return
}
// 通過 → addCard → 清空表單 → 清空 errors
```

- 錯誤訊息顯示在各欄位下方（`text-red-500 text-xs mt-1`）
- input border 改為紅色（`border-red-400 focus:ring-red-400`）
- 成功新增後表單清空，錯誤訊息清除

---

## EditCardModal 設計

- **觸發**：點擊 KanbanCard → `onEdit(card)` → KanbanPage 設定 `editingCard` state
- **結構**：`fixed inset-0 z-50` backdrop（半透明黑）+ 居中 dialog（`bg-white rounded-2xl shadow-xl p-6 w-full max-w-md`）
- **欄位**：
  - 標題：`<input>` 受控
  - 描述：`<textarea>` 受控（`rows={4}`）
  - 狀態：`<select>` 下拉（4 個 option 對應 COLUMNS）
- **按鈕**：「儲存」（primary）/ 「取消」（secondary）
- **驗證**：標題不可為空（同 AddCardForm，儲存時驗證）
- **按下 Backdrop 關閉**：點擊 backdrop 觸發取消

---

## 拖拉架構（@dnd-kit）

```
KanbanPage
  └── <DndContext onDragEnd={handleDragEnd}>
        └── KanbanBoard
              └── KanbanColumn (useDroppable, id=column.status)
                    └── KanbanCard (useDraggable, id=card.id)
        └── <DragOverlay>
              └── <KanbanCard card={activeCard} /> (靜態快照，不可互動)

// handleDragEnd
function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event
  if (!over) return
  const cardId = active.id as string
  const newStatus = over.id as ColumnStatus
  moveCard(cardId, newStatus)
}
```

- `useDroppable({ id: column.status })` — drop zone id 直接是 ColumnStatus string
- `useDraggable({ id: card.id })` — draggable id 是 card.id
- 拖拉時欄位有 `isOver` 樣式（`ring-2 ring-blue-400 bg-blue-50/50`）

---

## 破壞性變更清單

| 檔案 | 變更類型 | 說明 |
|------|---------|------|
| `src/types/kanban.ts` | **重寫** | 移除 Priority/Column/KanbanData，加 ColumnDef |
| `src/data/kanban.json` | **重寫** | 從 `{ columns: [...] }` 改為 `Card[]` 陣列 |
| `src/components/kanban/KanbanCard.tsx` | **重構** | 移除 priority border/assignee avatar，加 useDraggable/onClick |
| `src/components/kanban/KanbanCard.test.tsx` | **更新** | 移除 priority/assignee/tags 相關測試 |
| `src/components/kanban/KanbanBoard.tsx` | **重構** | 加 DndContext + DragOverlay，移除 searchQuery/filterCards |
| `src/components/kanban/KanbanColumn.tsx` | **重構** | 加 useDroppable，isOver 視覺 |
| `src/pages/KanbanPage.tsx` | **重構** | useState<Card[]>，移除 searchQuery，接線所有操作 |
| `src/App.tsx` | **修改** | KanbanPage 改為 path="/"，移除 /kanban 路由 |

---

## Edge Cases

| 情境 | 處理方式 |
|------|---------|
| 拖拉放到同一欄位 | `over.id === card.status` 時呼叫 `moveCard` 但 state 不變（無視覺跳動） |
| 拖拉放到欄位外 | `over` 為 null，`handleDragEnd` 直接 return |
| EditModal 標題清空儲存 | 驗證擋住，顯示錯誤訊息 |
| 新增空白標題 | 驗證擋住，input border 變紅 |
| 點擊卡片時開始拖拉 | dnd-kit 距離感應閾值處理（`activationConstraint: { distance: 8 }`），短距離點擊不觸發拖拉，觸發 onClick |

---

## Out of Scope
- 資料持久化（localStorage / API）
- 卡片刪除功能
- 欄內卡片排序（只做跨欄移動）
- 搜尋/篩選功能
- 觸控裝置拖拉（dnd-kit 預設支援，但不額外測試）
