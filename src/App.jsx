import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Outlet,
} from 'react-router-dom'
import './App.css'
import './components/Navbar.css'
import MinervaHome from './pages/MinervaHome'
import HabitTracker from './pages/HabitTracker'
import HabitMonthSummary from './pages/HabitMonthSummary'
import Todos from './pages/Todos'
import GoalTracker from './pages/GoalTracker'
import SleepTracker from './pages/SleepTracker'
import Achievements from './pages/Achievements'
import ExportPage from './pages/ExportPage'
import Flashcards from './pages/Flashcards'
import Calories from './pages/Calories'
import StoicJournal from './pages/StoicJournal'
import MealPlan from './pages/MealPlan'
import Pomodoro from './pages/Pomodoro'
import AccountPage from './pages/AccountPage'
import LoginSplash from './pages/LoginSplash'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { HabitDataProvider } from './context/HabitDataContext'

const NAV_ITEMS = [
  { to: '/habits', label: 'Habits', icon: 'habits', activePaths: ['/habits', '/month'] },
  { to: '/todos', label: 'Todos', icon: 'todos', activePaths: ['/todos'] },
  { to: '/goals', label: 'Goals', icon: 'goals', activePaths: ['/goals'] },
  { to: '/sleep', label: 'Sleep', icon: 'sleep', activePaths: ['/sleep'] },
  { to: '/achievements', label: 'Achievements', icon: 'achievements', activePaths: ['/achievements'] },
  { to: '/export', label: 'Export', icon: 'export', activePaths: ['/export'] },
  { to: '/flashcards', label: 'Flashcards', icon: 'flashcards', activePaths: ['/flashcards'] },
  { to: '/calories', label: 'Calories', icon: 'calories', activePaths: ['/calories'] },
  { to: '/stoic', label: 'Stoic', icon: 'stoic', activePaths: ['/stoic'] },
  { to: '/recipes', label: 'Recipes', icon: 'recipes', activePaths: ['/recipes'] },
  { to: '/pomodoro', label: 'Pomodoro', icon: 'pomodoro', activePaths: ['/pomodoro'] },
]

function NavIcon({ name }) {
  const commonProps = {
    className: 'nav-icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }

  switch (name) {
    case 'habits':
      return (
        <svg {...commonProps}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M8 2v4M16 2v4M3 10h18M8 15l2 2 4-4" />
        </svg>
      )
    case 'todos':
      return (
        <svg {...commonProps}>
          <path d="M9 6h11M9 12h11M9 18h11" />
          <path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" />
        </svg>
      )
    case 'goals':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      )
    case 'sleep':
      return (
        <svg {...commonProps}>
          <path d="M20 15.5A8 8 0 0 1 8.5 4 7 7 0 1 0 20 15.5Z" />
        </svg>
      )
    case 'achievements':
      return (
        <svg {...commonProps}>
          <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" />
          <path d="M5 5H3v2a4 4 0 0 0 4 4M19 5h2v2a4 4 0 0 1-4 4" />
        </svg>
      )
    case 'export':
      return (
        <svg {...commonProps}>
          <path d="M12 3v12M7 10l5 5 5-5" />
          <path d="M5 19h14" />
        </svg>
      )
    case 'flashcards':
      return (
        <svg {...commonProps}>
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <path d="M3 9V7a4 4 0 0 1 4-4h2M15 21h2a4 4 0 0 0 4-4v-2M9 12h6" />
        </svg>
      )
    case 'calories':
      return (
        <svg {...commonProps}>
          <path d="M12 21c4 0 7-3 7-7 0-3-2-5-4-8-.5 2-1.5 3.5-3 4.5C10 8 9 6 9 3 6 6 5 9 5 14c0 4 3 7 7 7Z" />
        </svg>
      )
    case 'stoic':
      return (
        <svg {...commonProps}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
          <path d="M9 7h7M9 11h5" />
        </svg>
      )
    case 'recipes':
      return (
        <svg {...commonProps}>
          <path d="M6 2v20M10 2v8a4 4 0 0 1-8 0V2M18 2v20M18 2c2 2 3 5 3 8h-3" />
        </svg>
      )
    case 'pomodoro':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="13" r="8" />
          <path d="M12 13V8M9 2h6M15 4l2 2" />
        </svg>
      )
    default:
      return null
  }
}

function DesktopNavLink({ item, isActive, onClick }) {
  return (
    <Link
      to={item.to}
      className={`nav-link nav-icon-link ${isActive ? 'active' : ''}`}
      onClick={onClick}
      aria-label={item.label}
      title={item.label}
    >
      <NavIcon name={item.icon} />
      <span className="nav-label-sr">{item.label}</span>
    </Link>
  )
}

function Navbar() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setMoreOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMenuOpen(false)
  }

  const handleLogout = () => {
    setMenuOpen(false)
    setMoreOpen(false)
    setProfileOpen(false)
    logout()
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link
            to="/"
            className={`nav-logo-link${location.pathname === '/' ? ' is-active' : ''}`}
            onClick={scrollToTop}
          >
            <h2>Minerva</h2>
          </Link>
        </div>

        {/* Desktop nav links */}
        <div className="nav-links nav-links--desktop">
          {NAV_ITEMS.map((item) => (
            <DesktopNavLink
              key={item.to}
              item={item}
              isActive={item.activePaths.includes(location.pathname)}
              onClick={scrollToTop}
            />
          ))}
        </div>

        {/* Desktop right section */}
        <div className="nav-right nav-right--desktop">
          <p className="nav-time-muted">
            {currentTime.toLocaleDateString('en-IE', { weekday: 'short', month: 'short', day: 'numeric' })}{' '}
            {currentTime.toLocaleTimeString('en-IE', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <div className="nav-dropdown-wrap">
            <button
              type="button"
              className="nav-link nav-dropdown-btn"
              data-testid="nav-profile-menu"
              onClick={() => {
                setProfileOpen((v) => !v)
                setMoreOpen(false)
              }}
              aria-expanded={profileOpen}
            >
              Profile
            </button>
            <div className={`nav-dropdown-menu nav-dropdown-menu--profile ${profileOpen ? 'is-open' : ''}`} aria-hidden={!profileOpen}>
              {user?.email && (
                <span className="nav-user-email" title={user.email}>{user.email}</span>
              )}
              <Link
                to="/account"
                className="nav-dropdown-link"
                onClick={() => {
                  setProfileOpen(false)
                  scrollToTop()
                }}
              >
                Account
              </Link>
              <div className="nav-theme-wrap">
                <ThemeToggle />
              </div>
              <button
                type="button"
                className="nav-dropdown-link nav-dropdown-link-btn nav-logout"
                data-testid="nav-sign-out"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: theme toggle + hamburger always visible */}
        <div className="nav-mobile-controls">
          <ThemeToggle />
          <button
            type="button"
            className="nav-hamburger"
            data-testid="nav-mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={`nav-hamburger-icon ${menuOpen ? 'is-open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`nav-drawer ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <Link
          to="/habits"
          className={`nav-drawer-link ${location.pathname === '/habits' || location.pathname === '/month' ? 'active' : ''}`}
          onClick={scrollToTop}
        >
          Habits
        </Link>
        <Link to="/todos" className={`nav-drawer-link ${location.pathname === '/todos' ? 'active' : ''}`} onClick={scrollToTop}>
          Todos
        </Link>
        <Link to="/goals" className={`nav-drawer-link ${location.pathname === '/goals' ? 'active' : ''}`} onClick={scrollToTop}>
          Goals
        </Link>
        <Link to="/sleep" className={`nav-drawer-link ${location.pathname === '/sleep' ? 'active' : ''}`} onClick={scrollToTop}>
          Sleep
        </Link>
        <Link to="/achievements" className={`nav-drawer-link ${location.pathname === '/achievements' ? 'active' : ''}`} onClick={scrollToTop}>
          Achievements
        </Link>
        <Link to="/export" className={`nav-drawer-link ${location.pathname === '/export' ? 'active' : ''}`} onClick={scrollToTop}>
          Export
        </Link>
        <Link to="/flashcards" className={`nav-drawer-link ${location.pathname === '/flashcards' ? 'active' : ''}`} onClick={scrollToTop}>
          Flashcards
        </Link>
        <Link to="/calories" className={`nav-drawer-link ${location.pathname === '/calories' ? 'active' : ''}`} onClick={scrollToTop}>
          Calories
        </Link>
        <Link to="/stoic" className={`nav-drawer-link ${location.pathname === '/stoic' ? 'active' : ''}`} onClick={scrollToTop}>
          Stoic
        </Link>
        <Link to="/recipes" className={`nav-drawer-link ${location.pathname === '/recipes' ? 'active' : ''}`} onClick={scrollToTop}>
          Recipes
        </Link>
        <Link to="/pomodoro" className={`nav-drawer-link ${location.pathname === '/pomodoro' ? 'active' : ''}`} onClick={scrollToTop}>
          Pomodoro
        </Link>
        <hr className="nav-drawer-divider" />
        {user?.email && (
          <span className="nav-drawer-email">{user.email}</span>
        )}
        <Link to="/account" className="nav-drawer-link" onClick={scrollToTop}>
          Account
        </Link>
        <button type="button" className="nav-drawer-link nav-drawer-logout" data-testid="nav-drawer-sign-out" onClick={handleLogout}>
          Sign out
        </button>
        <div className="nav-drawer-time">
          {currentTime.toLocaleDateString('en-IE', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}{' '}
          {currentTime.toLocaleTimeString('en-IE', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>
    </nav>
  )
}

function ProtectedLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="auth-loading" role="status" aria-live="polite">
        <p>Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <LoginSplash />
  }

  return (
    <div className="app">
      <Navbar />
      <HabitDataProvider>
        <Outlet />
      </HabitDataProvider>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<MinervaHome />} />
        <Route path="/habits" element={<HabitTracker />} />
        <Route path="/month" element={<HabitMonthSummary />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/goals" element={<GoalTracker />} />
        <Route path="/sleep" element={<SleepTracker />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/export" element={<ExportPage />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/calories" element={<Calories />} />
        <Route path="/stoic" element={<StoicJournal />} />
        <Route path="/recipes" element={<MealPlan />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
