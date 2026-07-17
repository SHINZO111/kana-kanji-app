import { Routes, Route } from 'react-router-dom'
import NavBar from './components/ui/NavBar'
import Home from './pages/Home'
import Browse from './pages/Browse'
import CharacterDetail from './pages/CharacterDetail'
import Practice from './pages/Practice'
import Progress from './pages/Progress'
import Credits from './pages/Credits'
import NotFound from './pages/NotFound'
import { LanguageProvider } from './lib/i18n/LanguageProvider'

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/character/:char" element={<CharacterDetail />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </LanguageProvider>
  )
}

export default App
