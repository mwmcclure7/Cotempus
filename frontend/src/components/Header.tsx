import { Link, useNavigate } from 'react-router-dom'
import '../styles/Header.css'
import { useEffect, useState } from 'react'
import { ACCESS_TOKEN } from '../constants'
import profileIcon from '../assets/profileiconwhite.svg'

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    setIsLoggedIn(!!token);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <img src="/CotempusLogo.svg" alt="Cotempus Logo" className="logo" />
        </Link>
      </div>

      <nav className="header-center">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/create" className="nav-link">Create Event</Link>
        <Link to="/my-events" className="nav-link">My Events</Link>
      </nav>

      <div className="header-right">
        {isLoggedIn ? (
          <Link to="/settings" className="profile-link">
            <img src={profileIcon} alt="Profile Settings" className="profile-icon" />
          </Link>
        ) : (
          <button onClick={() => navigate('/login')}>Sign In</button>
        )}
      </div>
    </header>
  )
}

export default Header
