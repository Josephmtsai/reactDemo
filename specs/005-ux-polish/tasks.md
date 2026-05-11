# Tasks — 005-ux-polish UX 細節優化

## T01：建立 Toast 系統

**涉及檔案**
- `src/hooks/useToast.ts`（新增）
- `src/components/ui/Toast.tsx`（新增）
- `src/components/ui/Toaster.tsx`（新增）
- `src/App.tsx`（修改：加入 ToastProvider + Toaster）

**實作細節**

`src/hooks/useToast.ts`：
```typescript
import { createContext, useContext, useState, useCallback } from 'react'

export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'info' | 'error'
}

interface ToastContextValue {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
```

`src/components/ui/Toast.tsx`：
- props: `{ toast: ToastItem; onRemove: (id: string) => void }`
- 樣式（success）：`bg-green-600 text-white`；info：`bg-blue-600 text-white`；error：`bg-red-600 text-white`
- 右側 X 按鈕呼叫 `onRemove(toast.id)`
- `animate-slide-in-right` 進場動畫（用 Tailwind `translate-x-0`）

`src/components/ui/Toaster.tsx`：
- `fixed top-4 right-4 z-[100] flex flex-col gap-2 items-end`
- render `toasts.map((t) => <Toast key={t.id} toast={t} onRemove={removeToast} />)`

`src/App.tsx`：
```tsx
// 新增 ToastProvider（實作在 useToast.ts），包住 HashRouter
// Toaster 放在 HashRouter 外（或內均可，需在 Provider 內）
```

**ToastProvider 實作**（放在 `src/hooks/useToast.ts` 或 `src/components/ui/Toaster.tsx`）：
```typescript
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const addToast = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [{ ...t, id }, ...prev])
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3000)
  }, [])
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id))
  }, [])
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}
```

**Acceptance Criteria**
- `useToast()` hook 可在任意子元件使用
- `addToast` 後 3 秒自動消失
- 多個 toast 可同時顯示
- 禁止 `any`，`npm run typecheck` exit 0

---

## T02：Page Title 修改

**涉及檔案**
- `index.html`（修改）

**實作細節**
```html
<title>看板</title>
```

**Acceptance Criteria**
- 瀏覽器 tab 顯示「看板」

---

## T03：KanbanCard 加入 hover 操作按鈕 + delete 支援

**涉及檔案**
- `src/components/kanban/KanbanCard.tsx`（修改）

**新增 Props**
```typescript
interface KanbanCardProps {
  card: Card
  onEdit: (card: Card) => void
  onDelete: (id: string) => void   // 新增
  isDragOverlay?: boolean
}
```

**實作細節**
- 外層 div 加 `group relative`
- 右上角 icon group（`isDragOverlay` 時不渲染）：
  ```tsx
  {!isDragOverlay && (
    <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onEdit(card) }}
        className="p-1 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
        aria-label="編輯"
      >
        {/* pencil SVG icon */}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (window.confirm('確定要刪除此卡片？')) onDelete(card.id)
        }}
        className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        aria-label="刪除"
      >
        {/* trash SVG icon */}
      </button>
    </div>
  )}
  ```
- 注意：drag listeners 只套用在 title/desc 文字區域，不套用在整個 div（避免 icon button 被 drag 攔截）
  - 或：整個 div 有 drag listener，icon button 用 `e.stopPropagation()` 阻止
- `isDragging` 時：`opacity-40`
- 拖曳中的卡片原位不做 `transform`（transform 改由 DragOverlay 套用）：
  ```typescript
  const style = isDragging ? {} : { transform: CSS.Transform.toString(transform) }
  ```

**SVG Icons（inline，無需 icon library）**
```tsx
// Pencil
<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
</svg>
// Trash
<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
</svg>
```

**Acceptance Criteria**
- hover 時右上角顯示 pencil + trash icon
- 點擊 pencil → `onEdit(card)`（不觸發卡片整體 onClick）
- 點擊 trash → `window.confirm` → 確認後 `onDelete(card.id)`
- `isDragOverlay=true` 時不渲染 icon
- 禁止 `any`

---

## T04：KanbanColumn 拖曳懸停上移 + 版面修正

**涉及檔案**
- `src/components/kanban/KanbanColumn.tsx`（修改）

**實作細節**
- `isOver` 時外層 div 加 `transition-transform duration-200 -translate-y-2`（整欄上移）
- 移除 `ring-2 ring-inset ring-blue-400`，改為 `ring-2 ring-blue-400`（非 inset）
- 卡片區域加 `overflow-hidden` 防止拖曳時跑版
- 更新 className：
  ```tsx
  <div className={`flex flex-col rounded-xl bg-slate-100/80 shadow-sm border border-slate-200
    transition-transform duration-200 ${isOver ? '-translate-y-2' : ''}`}>
  ```

**Acceptance Criteria**
- 拖曳懸停時欄位上移 `-translate-y-2`
- 無水平 scrollbar 問題

---

## T05：KanbanPage 整合 deleteCard + Toast

**涉及檔案**
- `src/pages/KanbanPage.tsx`（修改）

**實作細節**
```typescript
import { useToast } from '@/hooks/useToast'
import { STATUS_LABELS } from '@/constants/kanban'

const { addToast } = useToast()

const deleteCard = (id: string) => {
  setCards((prev) => prev.filter((c) => c.id !== id))
}

const addCard = (title: string, description: string) => {
  // 原邏輯不變，加：
  addToast({ message: '卡片已新增', type: 'success' })
}

const updateCard = (updated: Card) => {
  setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  addToast({ message: '卡片已更新', type: 'success' })
}

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event
  setActiveCard(null)
  if (!over) return
  const cardId = active.id as string
  const newStatus = over.id as ColumnStatus
  setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, status: newStatus } : c)))
  const label = STATUS_LABELS[newStatus]
  const message = newStatus === 'done' ? '🎉 太棒了，已完成！' : `已移至「${label}」`
  addToast({ message, type: newStatus === 'done' ? 'success' : 'info' })
}
```

- `KanbanBoard` 傳入 `onDelete={deleteCard}`
- `KanbanBoard` → `KanbanColumn` → `KanbanCard` 傳遞 `onDelete`

**Acceptance Criteria**
- 新增卡片後顯示 toast「卡片已新增」
- 儲存編輯後顯示 toast「卡片已更新」
- 拖曳完成後顯示 toast，移到已完成顯示特殊訊息
- 刪除功能正確移除卡片

---

## T06：KanbanBoard 傳遞 onDelete prop

**涉及檔案**
- `src/components/kanban/KanbanBoard.tsx`（修改）

**實作細節**
```typescript
interface KanbanBoardProps {
  columns: ColumnDef[]
  cards: Card[]
  onEdit: (card: Card) => void
  onDelete: (id: string) => void   // 新增
}
```
- 傳入 `onDelete` 到 `KanbanColumn`

KanbanColumn 同步加入 `onDelete` prop 並傳入 `KanbanCard`：
```typescript
interface KanbanColumnProps {
  column: ColumnDef
  cards: Card[]
  onEdit: (card: Card) => void
  onDelete: (id: string) => void   // 新增
}
```

**Acceptance Criteria**
- 禁止 `any`，`npm run typecheck` exit 0

---

## T07：DragOverlay 視覺效果 + overflow 修正

**涉及檔案**
- `src/pages/KanbanPage.tsx`（修改 DragOverlay 內容）
- `src/components/kanban/KanbanCard.tsx`（transform 邏輯）

**實作細節**

DragOverlay 內的卡片樣式：
```tsx
<DragOverlay>
  {activeCard ? (
    <div className="rotate-[5deg] scale-105 shadow-2xl cursor-grabbing">
      <KanbanCard card={activeCard} onEdit={() => undefined} onDelete={() => undefined} isDragOverlay />
    </div>
  ) : null}
</DragOverlay>
```

`<main>` 加 `overflow-x-hidden`：
```tsx
<main className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4 md:p-6 overflow-x-hidden">
```

KanbanCard 拖曳時不做 transform（讓 DragOverlay 處理位置）：
```typescript
const style = isDragging ? {} : { transform: CSS.Transform.toString(transform) }
```

**Acceptance Criteria**
- DragOverlay 卡片有旋轉 + 放大效果
- 拖曳時無水平 scrollbar

---

## T08：Mobile 響應式優化

**涉及檔案**
- `src/components/kanban/KanbanColumn.tsx`（修改 max-h）
- `src/pages/KanbanPage.tsx`（修改 padding）

**實作細節**
- `KanbanColumn` 卡片區域：`max-h-[60vh] md:max-h-[calc(100vh-380px)]`
- `KanbanPage` main：`p-4 md:p-6`

**Acceptance Criteria**
- 手機螢幕（375px）下欄位正常顯示，不超出視窗

---

## T09：更新 KanbanCard.test.tsx

**涉及檔案**
- `src/components/kanban/KanbanCard.test.tsx`（修改）

**實作細節**
- `mockOnDelete = vi.fn()` 加入
- 所有 render 加入 `onDelete={mockOnDelete}`
- 新增測試：`it('calls onDelete with card id when delete button clicked after confirm', ...)`
  - `window.confirm = vi.fn().mockReturnValue(true)`
  - click trash button → `expect(mockOnDelete).toHaveBeenCalledWith('test-01')`

**Acceptance Criteria**
- `npm run test` 全部通過（Button tests + KanbanCard tests）
- 禁止 `any`
