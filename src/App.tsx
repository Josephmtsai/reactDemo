import { HashRouter, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import KanbanPage from '@/pages/KanbanPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kanban" element={<KanbanPage />} />
      </Routes>
    </HashRouter>
  )
}
