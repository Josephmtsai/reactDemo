# Tasks — 004-kanban-full Kanban 全功能實作

## T01：精簡型別 + 更新 kanban.json + 建立 COLUMNS 常數

**涉及檔案**
- `src/types/kanban.ts`（重寫）
- `src/data/kanban.json`（重寫）
- `src/constants/kanban.ts`（新增）

**實作細節**

`src/types/kanban.ts`：
```typescript
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

`src/constants/kanban.ts`：
```typescript
import type { ColumnDef } from '@/types/kanban'

export const COLUMNS: ColumnDef[] = [
  { id: 'col-todo',        status: 'todo',        title: '待處理', color: 'blue'   },
  { id: 'col-in-progress', status: 'in-progress', title: '進行中', color: 'yellow' },
  { id: 'col-in-review',   status: 'in-review',   title: '待驗收', color: 'purple' },
  { id: 'col-done',        status: 'done',        title: '已完成', color: 'green'  },
]

export const STATUS_LABELS: Record<ColumnDef['status'], string> = {
  'todo':        '待處理',
  'in-progress': '進行中',
  'in-review':   '待驗收',
  'done':        '已完成',
}
```

`src/data/kanban.json`：Card[] 陣列（見 spec.md）

**Acceptance Criteria**
- `src/types/kanban.ts` 無 Priority / KanbanData / 舊 Column interface
- `kanban.json` 為 `Card[]` 陣列（非 `{ columns: [] }` 物件）
- `COLUMNS` 常數包含 4 欄，順序為 todo → in-progress → in-review → done
- `npm run typecheck` exit 0

---

## T02：建立 AddCardForm 元件

**涉及檔案**
- `src/components/kanban/AddCardForm.tsx`（新增）

**Props**
```typescript
interface AddCardFormProps {
  onAdd: (title: string, description: string) => void
}
```

**實作細節**
- 兩個受控 input：title (`<input>`)、description (`<textarea rows={3}>`)
- `useState<{ title?: string; description?: string }>({})` 管理 errors
- 驗證時機：submit 時，`trim()` 後為空則設錯誤
- 錯誤顯示：各欄位下方 `<p className="text-red-500 text-xs mt-1">` 
- 錯誤時 input border：`border-red-400 focus:ring-red-400`（否則 `border-slate-200`）
- 成功後：呼叫 `onAdd(title, description)`，清空 title/description/errors
- 整體樣式：`bg-white rounded-xl shadow-sm border border-slate-200 p-4`
- 標題：`新增卡片` (`font-semibold text-slate-700 text-sm mb-3`)
- 按鈕：使用既有 `Button` 元件 `variant='primary'`，文字「新增」
- 欄位 label：`text-xs font-medium text-slate-600 mb-1`

**Acceptance Criteria**
- 標題或描述為空時，submit 顯示對應錯誤訊息
- 兩欄皆有內容時，`onAdd(title.trim(), description.trim())` 被呼叫
- 成功後表單清空，錯誤訊息消失
- 使用既有 Button 元件
- 禁止 `any`，`npm run typecheck` exit 0

---

## T03：重構 KanbanCard（移除 priority/assignee，加 onClick + useDraggable）

**涉及檔案**
- `src/components/kanban/KanbanCard.tsx`（重構）

**Props**
```typescript
interface KanbanCardProps {
  card: Card
  onEdit: (card: Card) => void
  isDragOverlay?: boolean  // DragOverlay 內使用時為 true，禁用 onClick
}
```

**實作細節**
- 移除：`priorityBorderMap`、`assigneeColorClasses`、calendar SVG、priority/assignee/tags 相關 DOM
- 結構（單層，不再雙層 wrapper）：
  ```tsx
  <div
    className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2
               hover:shadow-md transition-shadow duration-200 cursor-pointer select-none"
    onClick={() => !isDragOverlay && onEdit(card)}
    {...draggableAttributes}
    {...draggableListeners}
    ref={setNodeRef}
    style={draggableStyle}
  >
    <p className="font-semibold text-gray-800 text-sm leading-snug">{card.title}</p>
    <p className="text-xs text-gray-400 line-clamp-3">{card.description}</p>
  </div>
  ```
- `useDraggable({ id: card.id, data: { card } })`
- `activationConstraint: { distance: 8 }` 防止點擊誤觸拖拉（放在 useSensor 的 PointerSensor）
- 拖拉中的卡片：`opacity-40`（`transform: CSS.Transform.toString(transform)`）

**Acceptance Criteria**
- 卡片只顯示 title 與 description，無其他欄位
- 點擊觸發 `onEdit(card)`
- 拖拉時卡片變透明（`opacity-40`）
- `isDragOverlay=true` 時不觸發 onClick
- 禁止 `any`

---

## T04：建立 EditCardModal 元件

**涉及檔案**
- `src/components/kanban/EditCardModal.tsx`（新增）

**Props**
```typescript
interface EditCardModalProps {
  card: Card
  onSave: (updated: Card) => void
  onClose: () => void
}
```

**實作細節**
- Backdrop：`fixed inset-0 z-50 flex items-center justify-center bg-black/40`，點擊 backdrop 呼叫 `onClose`
- Dialog（阻止 backdrop click 冒泡）：`bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4`
- 標題列：`編輯卡片` + X 關閉按鈕
- 欄位：
  - 標題：`<input>` 受控，不可為空（儲存時驗證）
  - 描述：`<textarea rows={4}>` 受控
  - 狀態：`<select>` 受控，options 來自 `COLUMNS`（顯示 `STATUS_LABELS[col.status]`）
- 驗證：標題空白時顯示錯誤，阻止儲存
- 按鈕列：「取消」（secondary）/ 「儲存」（primary），`flex justify-end gap-2 mt-4`
- 使用既有 `Button` 元件

**Acceptance Criteria**
- 標題空白時儲存顯示錯誤訊息
- 點擊「儲存」呼叫 `onSave({ ...editedCard })`
- 點擊「取消」或 backdrop 呼叫 `onClose`
- status select 顯示所有四個狀態選項
- 禁止 `any`，`npm run typecheck` exit 0

---

## T05：安裝 @dnd-kit，重構 KanbanBoard + KanbanColumn

**安裝套件**
```sh
npm install @dnd-kit/core @dnd-kit/utilities
```

**涉及檔案**
- `src/components/kanban/KanbanBoard.tsx`（重構）
- `src/components/kanban/KanbanColumn.tsx`（重構）

**KanbanBoard Props**
```typescript
interface KanbanBoardProps {
  columns: ColumnDef[]
  cards: Card[]
  onEdit: (card: Card) => void
}
```

KanbanBoard 只負責 grid 渲染，不放 DndContext（DndContext 在 KanbanPage）：
```tsx
export default function KanbanBoard({ columns, cards, onEdit }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((col) => (
        <KanbanColumn
          key={col.id}
          column={col}
          cards={cards.filter(c => c.status === col.status)}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
```

**KanbanColumn Props**
```typescript
interface KanbanColumnProps {
  column: ColumnDef
  cards: Card[]
  onEdit: (card: Card) => void
}
```

KanbanColumn 使用 `useDroppable({ id: column.status })`：
```tsx
const { setNodeRef, isOver } = useDroppable({ id: column.status })
// 卡片列表區套用 ref，isOver 時加 ring：
// className={`... ${isOver ? 'ring-2 ring-blue-400 bg-blue-50/30' : ''}`}
```

**colorMap 保持不變（靜態，禁止動態拼接）：**
```typescript
const colorMap: Record<ColumnDef['color'], { header: string; badge: string }> = {
  blue:   { header: 'bg-blue-500 text-white',   badge: 'bg-white/20 text-white' },
  yellow: { header: 'bg-yellow-500 text-white', badge: 'bg-white/20 text-white' },
  purple: { header: 'bg-purple-500 text-white', badge: 'bg-white/20 text-white' },
  green:  { header: 'bg-green-500 text-white',  badge: 'bg-white/20 text-white' },
}
```

**Acceptance Criteria**
- `@dnd-kit/core` 安裝成功
- KanbanColumn 使用 `useDroppable`，`isOver` 時有 ring 樣式
- 四欄顏色正確，靜態 colorMap 無動態拼接
- 禁止 `any`，`npm run typecheck` exit 0

---

## T06：重構 KanbanPage

**涉及檔案**
- `src/pages/KanbanPage.tsx`（重構）

**實作細節**
```typescript
import { useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { Card, ColumnStatus } from '@/types/kanban'
import { COLUMNS } from '@/constants/kanban'
import initialCards from '@/data/kanban.json'

// state
const [cards, setCards] = useState<Card[]>(initialCards as Card[])
const [editingCard, setEditingCard] = useState<Card | null>(null)
const [activeCard, setActiveCard] = useState<Card | null>(null)

// sensors（distance: 8 防止誤觸）
const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
)

// handlers
const addCard = (title: string, description: string) => {
  setCards(prev => [{
    id: `card-${Date.now()}`,
    title: title.trim(),
    description: description.trim(),
    status: 'todo' as ColumnStatus,
  }, ...prev])
}

const updateCard = (updated: Card) => {
  setCards(prev => prev.map(c => (c.id === updated.id ? updated : c)))
}

const handleDragStart = (event: DragStartEvent) => {
  const card = cards.find(c => c.id === event.active.id)
  setActiveCard(card ?? null)
}

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event
  setActiveCard(null)
  if (!over) return
  const cardId = active.id as string
  const newStatus = over.id as ColumnStatus
  setCards(prev => prev.map(c => (c.id === cardId ? { ...c, status: newStatus } : c)))
}
```

JSX 結構：
```tsx
<main className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6">
  <div className="max-w-screen-2xl mx-auto flex flex-col gap-6">
    {/* 頁首 */}
    <div className="flex flex-col gap-1 pb-4 border-b border-slate-200">
      <h1 ...>📋 Kanban 看板管理系統</h1>
      <p ...>管理你的待辦事項，拖拉卡片更新狀態</p>
    </div>
    {/* 新增表單 */}
    <AddCardForm onAdd={addCard} />
    {/* 看板（DndContext 包住）*/}
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <KanbanBoard columns={COLUMNS} cards={cards} onEdit={setEditingCard} />
      <DragOverlay>
        {activeCard && <KanbanCard card={activeCard} onEdit={() => undefined} isDragOverlay />}
      </DragOverlay>
    </DndContext>
  </div>
  {/* 編輯 Modal */}
  {editingCard && (
    <EditCardModal
      card={editingCard}
      onSave={(updated) => { updateCard(updated); setEditingCard(null) }}
      onClose={() => setEditingCard(null)}
    />
  )}
</main>
```

**Acceptance Criteria**
- `useState<Card[]>` 為單一 source of truth
- `addCard` 將新卡片加到 todo 欄（新增後立即出現在待處理欄）
- `updateCard` 更新後卡片立即反映（包含狀態變更到對應欄）
- 拖拉結束後 `status` 同步更新
- `DragOverlay` 顯示靜態卡片快照
- 禁止 `any`，`npm run typecheck` exit 0

---

## T07：更新 App.tsx 路由

**涉及檔案**
- `src/App.tsx`（修改）

**實作細節**
- KanbanPage 改為 `path="/"`（首頁）
- 移除 `path="/kanban"` 路由
- 保留 `import KanbanPage`，移除 `import HomePage`（HomePage 保留原檔不刪除）

```tsx
import { HashRouter, Routes, Route } from 'react-router-dom'
import KanbanPage from '@/pages/KanbanPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<KanbanPage />} />
      </Routes>
    </HashRouter>
  )
}
```

**Acceptance Criteria**
- `/#/` 直接渲染 KanbanPage
- 無 `/kanban` 路由殘留
- `npm run typecheck` exit 0

---

## T08：更新 KanbanCard.test.tsx

**涉及檔案**
- `src/components/kanban/KanbanCard.test.tsx`（重寫）

**新測試結構**
```typescript
const mockCard: Card = {
  id: 'test-01',
  title: '測試卡片標題',
  description: '測試卡片描述',
  status: 'todo',
}
const mockOnEdit = vi.fn()

describe('KanbanCard', () => {
  it('renders title and description', () => {
    render(<KanbanCard card={mockCard} onEdit={mockOnEdit} />)
    expect(screen.getByText('測試卡片標題')).toBeInTheDocument()
    expect(screen.getByText('測試卡片描述')).toBeInTheDocument()
  })

  it('calls onEdit with card when clicked', () => {
    render(<KanbanCard card={mockCard} onEdit={mockOnEdit} />)
    fireEvent.click(screen.getByText('測試卡片標題'))
    expect(mockOnEdit).toHaveBeenCalledWith(mockCard)
  })

  it('does not call onEdit when isDragOverlay is true', () => {
    render(<KanbanCard card={mockCard} onEdit={mockOnEdit} isDragOverlay />)
    fireEvent.click(screen.getByText('測試卡片標題'))
    expect(mockOnEdit).not.toHaveBeenCalled()
  })
})
```

**Acceptance Criteria**
- `npm run test` 至少 3 個 KanbanCard tests + 3 個 Button tests = 6 個全部通過
- 不使用 `any`
- 不包含任何 priority/assignee/tags 相關斷言
