import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FiHome, FiSearch, FiHeart, FiUser, FiLogOut, FiMenu, FiX,
  FiChevronDown, FiPlusSquare, FiGrid, FiMessageSquare, FiCalendar,
  FiDollarSign, FiShield, FiList, FiUsers, FiStar
} from 'react-icons/fi'
import './Navbar.css'

export default function Navbar() {
  const { user, logout, isAdmin, isAgent, isOwner } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const buyerLinks = [
    { to: '/buyer/favorites', icon: <FiHeart />, label: 'Saved' },
    { to: '/buyer/visits', icon: <FiCalendar />, label: 'Visits' },
    { to: '/buyer/inquiries', icon: <FiMessageSquare />, label: 'Inquiries' },
    { to: '/buyer/payments', icon: <FiDollarSign />, label: 'Payments' },
  ]
  const ownerLinks = [
    { to: '/owner/properties', icon: <FiList />, label: 'My Properties' },
    { to: '/owner/add-property', icon: <FiPlusSquare />, label: 'List Property' },
  ]
  const adminLinks = [
    { to: '/admin', icon: <FiGrid />, label: 'Dashboard' },
    { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { to: '/admin/properties', icon: <FiHome />, label: 'Properties' },
    { to: '/admin/payments', icon: <FiDollarSign />, label: 'Payments' },
    { to: '/admin/visits', icon: <FiCalendar />, label: 'Visits' },
    { to: '/admin/reviews', icon: <FiStar />, label: 'Reviews' },
    { to: '/admin/tickets', icon: <FiShield />, label: 'Tickets' },
  ]

  const dashLinks = isAdmin ? adminLinks : isOwner || isAgent ? ownerLinks : buyerLinks

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon"><FiHome /></span>
          <span>Estate<strong>Hub</strong></span>
        </Link>

        {/* Center nav links */}
        <nav className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <Link to="/properties" className={`nav-link ${isActive('/properties') ? 'active' : ''}`}>
            <FiSearch /> Browse Properties
          </Link>
          {(isOwner || isAgent || isAdmin) && (
            <Link to="/owner/add-property" className={`nav-link ${isActive('/owner/add-property') ? 'active' : ''}`}>
              <FiPlusSquare /> List Property
            </Link>
          )}
          <Link to="/support" className={`nav-link ${isActive('/support') ? 'active' : ''}`}>
            <FiMessageSquare /> Support
          </Link>
        </nav>

        {/* Right side */}
        <div className="navbar-right">
          {user ? (
            <div className="user-menu" onMouseLeave={() => setDropOpen(false)}>
              <button className="user-trigger" onClick={() => setDropOpen(!dropOpen)}>
                <img
                  src={user.profilePic || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=c84b31&color=fff`}
                  alt="avatar"
                  className="user-avatar"
                />
                <span className="user-name">{user.firstName}</span>
                <FiChevronDown className={`chevron ${dropOpen ? 'rotated' : ''}`} />
              </button>

              {dropOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <img
                      src={user.profilePic || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=c84b31&color=fff`}
                      alt="avatar"
                    />
                    <div>
                      <p className="dropdown-name">{user.firstName} {user.lastName}</p>
                      <span className={`badge badge-role role-${user.role.toLowerCase()}`}>{user.role}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  {dashLinks.map(link => (
                    <Link key={link.to} to={link.to} className="dropdown-item" onClick={() => setDropOpen(false)}>
                      {link.icon} {link.label}
                    </Link>
                  ))}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}

          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  )
}
