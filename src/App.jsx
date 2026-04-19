import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Questionnaire from './pages/Questionnaire'
import Statistics from './pages/Statistics'
import WeeklyWorkout from './pages/WeeklyWorkout'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/weekly" element={<WeeklyWorkout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
