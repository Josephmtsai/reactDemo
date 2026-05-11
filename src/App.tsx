import { HashRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from '@/hooks/useToast'
import Toaster from '@/components/ui/Toaster'
import KanbanPage from '@/pages/KanbanPage'

export default function App() {
  return (
    <ToastProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<KanbanPage />} />
        </Routes>
      </HashRouter>
      <Toaster />
    </ToastProvider>
  )
}
