import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Questionnaire from './pages/Questionnaire'
import Login from './pages/Login'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        
      </Routes>
    </Router>
  )
}

export default App
