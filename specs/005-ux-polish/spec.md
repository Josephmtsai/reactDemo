# Spec — 005-ux-polish UX 細節優化

## 背景

根據 `srs/Kanban-demo.mp4` 影片與截圖回饋，對現有看板介面進行六項 UX 改進。

---

## 功能需求

### R1 — 欄位拖曳懸停上移 + 卡片 hover 操作按鈕

- 拖曳卡片懸停到某欄時，該欄整體做 `-translate-y-2`（輕微上移）視覺反饋
- 卡片 hover 時，右上角顯示兩個 icon button：編輯（pencil）、刪除（trash）
- 刪除：呼叫 `window.confirm('確定要刪除此卡片？')` → 確認後執行刪除
- 編輯：呼叫現有 `onEdit(card)` 開啟 EditCardModal
- EditCardModal 儲存完成後，顯示 toast 通知「卡片已更新」

### R2 — 拖曳旋轉動畫 + 自訂游標 + 拖曳完成 Toast

- DragOverlay 中的卡片：套用 `rotate-[5deg] shadow-2xl scale-105`（視覺更明顯）
- 拖曳進行中的游標：改為 grabbing cursor
- 拖曳完成後顯示 toast：
  - 一般：「已移至 {欄位名稱}」
  - 移到「已完成」欄：「🎉 太棒了，已完成！」

### R3 — Mobile 響應式優化

- `KanbanBoard` 現有 `grid-cols-1 md:grid-cols-2 xl:grid-cols-4` 已有基礎
- 改進：列高限制從 `max-h-[calc(100vh-380px)]` 改為 mobile 友善的 `max-h-[60vh] md:max-h-[calc(100vh-380px)]`
- `AddCardForm` 在小螢幕下輸入欄改為 100% 寬
- 頁面 padding：`p-4 md:p-6`

### R4 — Page Title 修改

- `index.html` 的 `<title>` 改為 `看板`

### R5 — 拖曳時水平 Scrollbar + 跑版修正

- 根本原因：`CSS.Transform.toString(transform)` 在拖曳時會設定 `translate3d` 導致元素超出容器
- 修正：DraggableCard 在 `isDragging` 時加 `pointer-events-none`
- 根本修正：外層 `<main>` 加 `overflow-x-hidden`，拖曳中的卡片原位設 `opacity-40` 但不做 transform（transform 只在 DragOverlay 中呈現）
- KanbanColumn 卡片區域加 `overflow-hidden`

### R6 — 新增卡片完成後 Toast

- `AddCardForm` 的 `onAdd` 呼叫成功後，觸發 toast 通知「卡片已新增」

---

## Toast 系統設計

### 元件

```
src/components/ui/Toast.tsx        — 單一 toast 元件
src/components/ui/Toaster.tsx      — 容器（fixed top-right，管理列表）
src/hooks/useToast.ts              — Context + hook
```

### API

```typescript
const { addToast } = useToast()
addToast({ message: '卡片已新增', type: 'success' })  // type: 'success' | 'info' | 'error'
```

### 行為

- 自動 3 秒後消失（`setTimeout` 移除）
- 固定位置：`fixed top-4 right-4 z-[100]`
- 多個 toast 垂直堆疊，最新在上
- 可手動關閉（X 按鈕）

---

## 非功能需求

- 禁止 `any`，`npm run typecheck` exit 0
- 禁止動態拼接 Tailwind class 字串
- 所有新增元件必須有對應 TypeScript interface
- 不破壞現有測試（`npm run test` exit 0）
