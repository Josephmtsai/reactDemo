# Tasks — 003-style Kanban 視覺優化

## T01：優化 KanbanCard

**涉及檔案**
- `src/components/kanban/KanbanCard.tsx`

**實作細節**

Priority 改為左側色條（雙層 wrapper）：
```tsx
const priorityBorderMap: Record<Priority, string> = {
  high:   'border-l-4 border-red-500',
  medium: 'border-l-4 border-yellow-400',
  low:    'border-l-4 border-gray-300',
}

// 外層 wrapper
<div className={`${priorityBorderMap[card.priority]} rounded-xl overflow-hidden`}>
  // 內層卡片（無 rounded，由外層 overflow-hidden 控制圓角）
  <div className="bg-white border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200 cursor-pointer">
```

Assignee 頭像（靜態 5 色陣列）：
```tsx
const assigneeColorClasses = [
  'bg-indigo-100 text-indigo-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
  'bg-violet-100 text-violet-700',
]
const colorIndex = (card.assignee.charCodeAt(0) || 0) % 5
// 顯示：w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
// 內容：card.assignee.charAt(0).toUpperCase()
```

其餘改版：
- 標題：`font-semibold text-gray-800 text-sm leading-snug line-clamp-2`
- 描述：`text-xs text-gray-400 line-clamp-2`
- Tags：`bg-slate-100 text-slate-600 text-xs rounded-md px-2 py-0.5 font-medium`
- 移除 priority badge（priorityMap 整個移除）
- 截止日期：小型 SVG calendar icon（inline svg `w-3 h-3`）+ `text-xs text-gray-400`
- 底部列：`flex items-center justify-between mt-1`

**Acceptance Criteria**
- priority='high' → 外層 wrapper 含 `border-red-500` class
- priority='medium' → 含 `border-yellow-400`
- priority='low' → 含 `border-gray-300`
- Assignee 顯示為圓圈縮寫（非 emoji）
- `tags=[]` 時 tag 區域不渲染（維持既有行為）
- 無任何 priority badge 文字（「高優先度」「中優先度」「低優先度」均移除）
- 禁止動態 class 拼接，禁止 `any`
- `npm run typecheck` exit 0

---

## T02：優化 KanbanColumn

**涉及檔案**
- `src/components/kanban/KanbanColumn.tsx`

**實作細節**

colorMap 計數 badge 改為白色透明：
```typescript
const colorMap: Record<Column['color'], { header: string; badge: string }> = {
  blue:   { header: 'bg-blue-500 text-white',   badge: 'bg-white/20 text-white' },
  yellow: { header: 'bg-yellow-500 text-white', badge: 'bg-white/20 text-white' },
  purple: { header: 'bg-purple-500 text-white', badge: 'bg-white/20 text-white' },
  green:  { header: 'bg-green-500 text-white',  badge: 'bg-white/20 text-white' },
}
```

結構改版：
- 外框：`flex flex-col rounded-xl bg-slate-100/80 shadow-sm border border-slate-200`
- Header：`flex items-center justify-between px-4 py-3 rounded-t-xl`，標題 `font-bold text-sm tracking-wide`
- 計數 badge：`min-w-[1.5rem] h-6 flex items-center justify-center text-xs font-bold rounded-full px-2`
- 卡片列表區：`flex flex-col gap-2 p-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[200px]`
- 空結果：
  ```tsx
  <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-400">
    {/* 小型 SVG inbox/empty icon */}
    <p className="text-sm">無符合結果</p>
  </div>
  ```

**Acceptance Criteria**
- 卡片列表區有 `overflow-y-auto` 與 `max-h-[calc(100vh-280px)]`
- 空結果顯示 SVG icon + 「無符合結果」文字
- 四欄顏色正確（blue/yellow/purple/green 保持不變）
- 禁止動態 class 拼接，禁止 `any`
- `npm run typecheck` exit 0

---

## T03：優化 KanbanPage

**涉及檔案**
- `src/pages/KanbanPage.tsx`

**實作細節**
- main：`min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6`
- 容器：`max-w-screen-2xl mx-auto flex flex-col gap-6`
- 頭部 wrapper：`flex flex-col gap-1 pb-4 border-b border-slate-200`
- h1：`text-3xl font-bold text-slate-800 tracking-tight`
- 副標題：`text-sm text-slate-500`

**Acceptance Criteria**
- main 背景有 gradient class
- h1 含 `tracking-tight`
- 頭部區塊有 `border-b border-slate-200` 分隔
- `npm run typecheck` exit 0

---

## T04：優化 SearchBar + Button

**涉及檔案**
- `src/components/kanban/SearchBar.tsx`
- `src/components/ui/Button.tsx`

**SearchBar 實作細節**

將搜尋列包成卡片容器：
```tsx
<div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-2">
  {/* Search SVG icon */}
  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" .../>
  <input
    className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
    ...
  />
  <div className="w-px h-5 bg-slate-200 mx-1" />
  <Button variant="primary" onClick={onAdd}>新增卡片</Button>
</div>
```

Search icon SVG（inline，viewBox="0 0 24 24"，stroke-only）：
```tsx
<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 flex-shrink-0"
  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round"
    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
</svg>
```

**Button 實作細節**
```typescript
const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50'

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md focus-visible:outline-blue-600',
  secondary: 'bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 focus-visible:outline-slate-400',
}
```

**Acceptance Criteria**
- SearchBar 容器為 `bg-white rounded-xl shadow-sm border border-slate-200`
- input 無自身 border（`outline-none bg-transparent`）
- 有 search SVG icon
- Button primary 含 `shadow-sm`、`active:scale-95`
- Button secondary 為 outline 風格（`bg-white border border-slate-200`）
- `npm run test` Button 既有 3 個測試全部通過（測試不斷言 class，不受影響）
- `npm run typecheck` exit 0

---

## T05：優化 HomePage

**涉及檔案**
- `src/pages/HomePage.tsx`

**實作細節**
- main 背景：`bg-gradient-to-br from-slate-50 to-blue-50`
- h1：`text-4xl font-bold text-slate-800 tracking-tight`
- 描述：`text-slate-500 text-lg`
- 前往 Kanban `<Link>`：className 對齊 Button primary 強化版：
  ```
  inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold
  bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md
  transition-all duration-150 active:scale-95
  ```
- 新增文字「前往 Kanban 看板 →」

**Acceptance Criteria**
- 背景有 gradient
- Link 樣式與 Button primary 視覺一致（含 shadow, active:scale-95）
- 既有 Button 展示（Primary / Secondary variant）完整保留，不受修改影響
- `npm run typecheck` exit 0

---

## T06：更新 KanbanCard.test.tsx

**涉及檔案**
- `src/components/kanban/KanbanCard.test.tsx`

**改版原因**
T01 移除 priority badge（「高優先度」「中優先度」「低優先度」文字），現有 3 個 priority badge 測試將失敗，需更新。

**保留的測試（不動）**
- 基本渲染（title / description / assignee / dueDate 顯示）
- `tags=[]` 時不渲染 tag 元素

**需更新的測試（priority badge → border class）**

```tsx
// 舊：getByText('高優先度') → 改為 container class 斷言
it('applies red border for high priority', () => {
  const { container } = render(<KanbanCard card={{ ...mockCard, priority: 'high' }} />)
  // 外層 wrapper 含 border-red-500
  expect(container.firstChild).toHaveClass('border-red-500')
})

it('applies yellow border for medium priority', () => {
  const { container } = render(<KanbanCard card={{ ...mockCard, priority: 'medium' }} />)
  expect(container.firstChild).toHaveClass('border-yellow-400')
})

it('applies gray border for low priority', () => {
  const { container } = render(<KanbanCard card={{ ...mockCard, priority: 'low' }} />)
  expect(container.firstChild).toHaveClass('border-gray-300')
})
```

**新增測試**
```tsx
it('renders assignee initial avatar', () => {
  render(<KanbanCard card={mockCard} />)
  // mockCard.assignee = 'Alice'，應顯示 'A'
  expect(screen.getByText('A')).toBeInTheDocument()
})
```

**Acceptance Criteria**
- `npm run test` 全部通過（至少 6 個 KanbanCard tests + 3 個 Button tests = 9 個）
- 不使用 `any`
- 測試覆蓋 priority border（3 cases）+ assignee avatar + tags 空值 + 基本渲染
