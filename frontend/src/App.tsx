import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateSchedule from './pages/CreateSchedule'
import JoinSchedule from './pages/JoinSchedule'
import SignIn from './pages/Login'
import Register from './pages/Register'
import Header from './components/Header'
import Settings from './pages/Settings'
import MySchedules from './pages/MySchedules'
import './styles/App.css'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'


function App() {
  return (
    <Router>
      <div>
        <Header />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<ProtectedRoute><CreateSchedule /></ProtectedRoute>} />
            <Route path="/join" element={<JoinSchedule />} />
            <Route path="/event/:eventId" element={<JoinSchedule />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-events" element={<ProtectedRoute><MySchedules /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </div>
        <Toaster position="top-center" />
      </div>
    </Router>
  )
}

export default App
