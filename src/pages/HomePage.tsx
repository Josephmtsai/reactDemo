import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function HomePage() {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'React Demo'

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold text-slate-800 tracking-tight">{appTitle}</h1>
      <p className="text-slate-500 text-lg">
        React 19 + TypeScript + Tailwind CSS 4 starter template
      </p>
      <div className="flex gap-4">
        <Button variant="primary" onClick={() => undefined}>
          Primary Button
        </Button>
        <Button variant="secondary" onClick={() => undefined}>
          Secondary Button
        </Button>
      </div>
      <Link
        to="/kanban"
        className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-150 active:scale-95"
      >
        前往 Kanban 看板 →
      </Link>
    </main>
  )
}
