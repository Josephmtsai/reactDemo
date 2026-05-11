import Button from '@/components/ui/Button'

export default function HomePage() {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'React Demo'

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold text-gray-900">{appTitle}</h1>
      <p className="text-gray-600 text-lg">
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
    </main>
  )
}
