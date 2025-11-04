import { Routes, Route } from 'react-router-dom'
import NavigationPage from './pages/NavigationPage'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<NavigationPage />} />
      </Routes>
    </div>
  )
}

export default App
