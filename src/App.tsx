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
