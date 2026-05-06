import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiUsers, FiHome, FiDollarSign, FiMessageSquare, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiClock, FiCalendar, FiStar } from 'react-icons/fi'
import { userAPI, propertyAPI, paymentAPI, supportAPI } from '../../services/api'
import './AdminPages.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, properties: 0, payments: 0, revenue: 0, pendingProps: 0, openTickets: 0 })
  const [recentProps, setRecentProps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  const loadStats = async () => {
    try {
      const [usersRes, propsRes, paymentsRes, ticketsRes] = await Promise.all([
        userAPI.getAll(),
        propertyAPI.getAllAdmin(),
        paymentAPI.getAll(),
        supportAPI.getAll({ status: 'Open' }),
      ])
      const payments = paymentsRes.data.data || []
      const allProps = propsRes.data.data || []
      setStats({
        users: usersRes.data.count || 0,
        properties: allProps.length,
        payments: payments.length,
        revenue: paymentsRes.data.totalRevenue || 0,
        pendingProps: allProps.filter(p => p.approvalStatus === 'Pending').length,
        openTickets: ticketsRes.data.count || 0,
      })
      setRecentProps(allProps.slice(0, 5))
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const formatPrice = (n) => {
    if (n >= 10000000) return `₹${(n/10000000).toFixed(1)} Cr`
    if (n >= 100000) return `₹${(n/100000).toFixed(1)} L`
    return `₹${n?.toLocaleString()}`
  }

  const STAT_CARDS = [
    { label: 'Total Users', value: stats.users, icon: <FiUsers />, color: '#2c5f8a', link: '/admin/users' },
    { label: 'Total Properties', value: stats.properties, icon: <FiHome />, color: '#c84b31', link: '/admin/properties' },
    { label: 'Total Revenue', value: formatPrice(stats.revenue), icon: <FiDollarSign />, color: '#28a745', link: '/admin/payments' },
    { label: 'Transactions', value: stats.payments, icon: <FiTrendingUp />, color: '#d4a843', link: '/admin/payments' },
    { label: 'Pending Approvals', value: stats.pendingProps, icon: <FiClock />, color: '#ffc107', link: '/admin/properties' },
    { label: 'Open Tickets', value: stats.openTickets, icon: <FiAlertCircle />, color: '#dc3545', link: '/admin/tickets' },
  ]

  if (loading) return <div className="spinner-wrap" style={{minHeight:'60vh'}}><div className="spinner" /></div>

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="admin-header">
          <div><h1 className="section-title">Admin Dashboard</h1><p className="section-sub">Platform overview and management</p></div>
        </div>

        {/* Stat cards */}
        <div className="stat-cards-grid">
          {STAT_CARDS.map((s, i) => (
            <Link to={s.link} key={i} className="stat-card">
              <div className="stat-card-icon" style={{ background: s.color + '18', color: s.color }}>{s.icon}</div>
              <div>
                <div className="stat-card-value">{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
              <FiTrendingUp className="stat-card-arrow" style={{ color: s.color }} />
            </Link>
          ))}
        </div>

        {/* Recent Properties */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h3>Recent Property Listings</h3>
            <Link to="/admin/properties" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="prop-table-wrap">
            <table className="prop-table">
              <thead>
                <tr><th>Property</th><th>Owner</th><th>Price</th><th>Type</th><th>Approval</th></tr>
              </thead>
              <tbody>
                {recentProps.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=80&q=60'} alt="" className="prop-thumb" />
                        <span className="prop-name-cell"><strong>{p.title}</strong><span>{p.propertyType}</span></span>
                      </div>
                    </td>
                    <td>{p.ownerId ? `${p.ownerId.firstName} ${p.ownerId.lastName}` : '—'}</td>
                    <td><strong style={{color:'var(--primary)'}}>₹{p.price?.toLocaleString()}</strong></td>
                    <td><span className={`badge badge-${p.listingType === 'Sale' ? 'sale' : 'rent'}`}>{p.listingType}</span></td>
                    <td><span className={`badge badge-${p.approvalStatus === 'Approved' ? 'approved' : p.approvalStatus === 'Rejected' ? 'rejected' : 'pending'}`}>{p.approvalStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick links */}
        <div className="quick-links">
          <h3>Quick Actions</h3>
          <div className="quick-links-grid">
            {[
              { to: '/admin/properties', icon: <FiHome />, label: 'Approve Properties', color: 'var(--primary)' },
              { to: '/admin/users', icon: <FiUsers />, label: 'Manage Users', color: 'var(--accent)' },
              { to: '/admin/payments', icon: <FiDollarSign />, label: 'View Payments', color: 'var(--success)' },
              { to: '/admin/visits', icon: <FiCalendar />, label: 'Visit Schedules', color: 'var(--accent)' },
              { to: '/admin/reviews', icon: <FiStar />, label: 'Reviews', color: 'var(--gold)' },
              { to: '/admin/tickets', icon: <FiMessageSquare />, label: 'Support Tickets', color: 'var(--danger)' },
            ].map(q => (
              <Link to={q.to} key={q.to} className="quick-link-card">
                <span style={{ color: q.color, fontSize: '1.5rem' }}>{q.icon}</span>
                <span>{q.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
