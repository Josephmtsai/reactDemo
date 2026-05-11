import Button from '@/components/ui/Button'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onAdd: () => void
}

/**
 * Search input bar with a search icon, transparent input, and a primary "Add card" button.
 */
export default function SearchBar({ value, onChange, onAdd }: SearchBarProps) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 text-gray-400 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
      <input
        type="text"
        className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
        placeholder="輸入關鍵字搜尋卡片..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="w-px h-5 bg-slate-200 mx-1" />
      <Button variant="primary" onClick={onAdd}>
        新增卡片
      </Button>
    </div>
  )
}
