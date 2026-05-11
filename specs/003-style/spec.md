## Overview

針對現有 Kanban 看板的視覺優化，方向為 Modern SaaS Kanban（參考 Linear / Notion 風格）。
全部使用 Tailwind CSS utility class，禁止自訂 CSS，所有顏色 class 必須完整靜態字串。

---

## 設計原則

1. **層次感**：卡片使用陰影與 hover 動畫，視覺上從「靜態清單」升級為「可互動看板」
2. **Priority 色條**：移除 priority badge，改為卡片左側 `border-l-4` 色條，視覺更直覺
3. **Assignee 頭像**：emoji 👤 改為縮寫首字圓圈，提升精緻度
4. **一致的 border-radius**：欄位、卡片統一使用 `rounded-xl`
5. **捲動安全**：欄位卡片區設定 `max-h` + `overflow-y-auto`，長看板不爆版

---

## 元件改版規格

### KanbanCard.tsx

**Priority 左側色條結構（雙層 wrapper）**
```
// 外層 wrapper — 持有 border-l-4 與圓角
<div className={`${priorityBorderMap[card.priority]} rounded-xl overflow-hidden`}>
  // 內層卡片 — 無 border-l，無 rounded（由外層 overflow-hidden 控制）
  <div className="bg-white border border-gray-100 p-4 flex flex-col gap-3
                  hover:shadow-md transition-shadow duration-200 cursor-pointer">
```

**priorityBorderMap（靜態，禁止動態拼接）**
```typescript
const priorityBorderMap: Record<Priority, string> = {
  high:   'border-l-4 border-red-500',
  medium: 'border-l-4 border-yellow-400',
  low:    'border-l-4 border-gray-300',
}
```

**Assignee 頭像（取名字首字母，5 色靜態陣列）**
```typescript
const assigneeColorClasses = [
  'bg-indigo-100 text-indigo-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
  'bg-violet-100 text-violet-700',
]
// 使用：assigneeColorClasses[card.assignee.charCodeAt(0) % 5]
// 顯示：w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
```

| 元素 | 改版前 | 改版後 |
|------|--------|--------|
| 卡片容器 | `bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-2` | 雙層：外層 `border-l-4 border-{priority} rounded-xl overflow-hidden`，內層 `bg-white border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200 cursor-pointer` |
| 標題 | `font-semibold text-gray-900 line-clamp-2` | `font-semibold text-gray-800 text-sm leading-snug line-clamp-2` |
| 描述 | `text-sm text-gray-500 line-clamp-2 mt-1` | `text-xs text-gray-400 line-clamp-2` |
| Tags | `bg-blue-100 text-blue-700 text-xs rounded-full px-2 py-0.5` | `bg-slate-100 text-slate-600 text-xs rounded-md px-2 py-0.5 font-medium` |
| Priority badge | `text-xs font-medium rounded-full px-2 py-0.5 + priorityMap` | **移除**（由 border-l-4 取代） |
| 底部列（日期+頭像） | `flex items-center justify-between text-xs` | `flex items-center justify-between mt-1` |
| 截止日期 | `text-xs text-gray-400` emoji 📅 | `text-xs text-gray-400 flex items-center gap-1`，SVG calendar icon |
| Assignee | `text-xs text-gray-500` emoji 👤 | 縮寫首字圓圈 `w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold` |

---

### KanbanColumn.tsx

| 元素 | 改版前 | 改版後 | 理由 |
|------|--------|--------|------|
| 外框 | `flex flex-col rounded-xl overflow-hidden bg-gray-100 shadow-sm` | `flex flex-col rounded-xl bg-slate-100/80 shadow-sm border border-slate-200` | 邊框讓欄位邊界更清晰 |
| Header | `flex items-center justify-between px-4 py-3 + bg-{color}-500 text-white` | `flex items-center justify-between px-4 py-3 + bg-{color}-500 text-white rounded-t-xl`，標題改為 `font-bold text-sm tracking-wide` | 圓角與字重優化 |
| 計數 badge | `text-xs font-bold rounded-full px-2 py-0.5 + badge class` | `min-w-[1.5rem] h-6 flex items-center justify-center text-xs font-bold rounded-full px-2` | 最小寬度保持圓形 |
| 卡片列表區 | `flex flex-col gap-3 p-3 flex-1` | `flex flex-col gap-2 p-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[200px]` | 捲動安全 |
| 空結果 | `text-sm text-gray-400 text-center py-4` | `flex flex-col items-center justify-center gap-2 py-10 text-gray-400`，加 SVG 空狀態 icon + `text-sm` | 空狀態更美觀 |

**colorMap（保持現有結構，僅 header 新增 rounded-t-xl）**
```typescript
const colorMap: Record<Column['color'], { header: string; badge: string }> = {
  blue:   { header: 'bg-blue-500 text-white',   badge: 'bg-white/20 text-white' },
  yellow: { header: 'bg-yellow-500 text-white', badge: 'bg-white/20 text-white' },
  purple: { header: 'bg-purple-500 text-white', badge: 'bg-white/20 text-white' },
  green:  { header: 'bg-green-500 text-white',  badge: 'bg-white/20 text-white' },
}
```

---

### KanbanPage.tsx

| 元素 | 改版前 | 改版後 | 理由 |
|------|--------|--------|------|
| main | `min-h-screen bg-gray-50 p-6` | `min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6` | 漸層背景更有層次 |
| 容器 | `max-w-screen-xl mx-auto flex flex-col gap-6` | `max-w-screen-2xl mx-auto flex flex-col gap-6` | 四欄更寬裕 |
| 頭部區塊 | `<div>` 無樣式 | `<div className="flex flex-col gap-1 pb-2 border-b border-slate-200">` | 分隔線強化區域感 |
| h1 | `text-3xl font-bold text-gray-900` | `text-3xl font-bold text-slate-800 tracking-tight` | 更精緻的字重 |
| 副標題 | `text-gray-500 mt-1` | `text-sm text-slate-500` | 層次一致 |

---

### SearchBar.tsx

| 元素 | 改版前 | 改版後 | 理由 |
|------|--------|--------|------|
| 容器 | `flex items-center gap-4` | `flex items-center gap-3 bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-2` | 將搜尋列整體包成卡片感 |
| Input | `flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500` | `flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none border-none` | 去除 input 自身邊框，由容器統一 |
| 搜尋 icon | 無 | SVG search icon `w-4 h-4 text-gray-400 flex-shrink-0`，放在 input 左側 | 視覺提示 |
| 分隔線 | 無 | `<div className="w-px h-5 bg-slate-200 mx-1" />` 分隔 input 與按鈕 | 視覺區隔 |

---

### Button.tsx

| 元素 | 改版前 | 改版後 | 理由 |
|------|--------|--------|------|
| base | `... rounded-md px-4 py-2 text-sm font-medium transition-colors` | `... rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-95` | 圓角統一 xl 風格、active 回饋 |
| primary | `bg-blue-600 text-white hover:bg-blue-700` | `bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md` | 陰影提升質感 |
| secondary | `bg-gray-200 text-gray-800 hover:bg-gray-300` | `bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm` | 改為 outline 風格更現代 |

---

### HomePage.tsx

| 元素 | 改版前 | 改版後 | 理由 |
|------|--------|--------|------|
| main | `min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-8 p-8` | 同前，改背景 `bg-gradient-to-br from-slate-50 to-blue-50` | 與 KanbanPage 背景呼應 |
| h1 | `text-4xl font-bold text-gray-900` | `text-4xl font-bold text-slate-800 tracking-tight` | 一致 |
| 前往 Kanban Link | `inline-flex ... bg-blue-600 text-white hover:bg-blue-700 ...` | `<Link>` 包裝，className 對齊 Button primary 強化版（含 `rounded-lg shadow-sm hover:shadow-md active:scale-95 transition-all duration-150`） | 與 Button 視覺一致 |

---

## Edge Cases

| 情境 | 處理方式 |
|------|---------|
| Assignee 名字為空字串 | `charCodeAt(0)` 會回傳 `NaN`，以 `% 5` 結果為 `NaN`，需用 `(card.assignee.charCodeAt(0) || 0) % 5` 取 fallback |
| 欄位卡片超過畫面高度 | `overflow-y-auto` 處理，捲動條出現在欄位內，不影響整體布局 |
| 既有測試 priority badge | T06 必須更新測試，移除 `getByText('高優先度')` 斷言，改為 container class 斷言 |
