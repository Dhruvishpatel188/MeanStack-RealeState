import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiMessageSquare, FiEye } from 'react-icons/fi'
import { propertyAPI } from '../../services/api'
import toast from 'react-hot-toast'
import './OwnerPages.css'

const formatPrice = (p) => {
  if (p >= 10000000) return `₹${(p/10000000).toFixed(1)} Cr`
  if (p >= 100000) return `₹${(p/100000).toFixed(1)} L`
  return `₹${p?.toLocaleString()}`
}

export default function MyProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadProperties() }, [])

  const loadProperties = async () => {
    try {
      const res = await propertyAPI.getMy()
      setProperties(res.data.data || [])
    } catch { toast.error('Failed to load properties') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return
    try {
      await propertyAPI.delete(id)
      toast.success('Property deleted!')
      loadProperties()
    } catch { toast.error('Failed to delete') }
  }

  const approvalBadge = (status) => {
    const map = { Pending: 'badge-pending', Approved: 'badge-approved', Rejected: 'badge-rejected' }
    return <span className={`badge ${map[status] || ''}`}>{status}</span>
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="owner-page-header">
          <div>
            <h1 className="section-title">My Properties</h1>
            <p className="section-sub">Manage all your listed properties</p>
          </div>
          <Link to="/owner/add-property" className="btn btn-primary">
            <FiPlus /> List New Property
          </Link>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <p>No properties listed yet.</p>
            <Link to="/owner/add-property" className="btn btn-primary" style={{ marginTop: 16 }}>
              <FiPlus /> List Your First Property
            </Link>
          </div>
        ) : (
          <div className="prop-table-wrap">
            <table className="prop-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Approval</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=120&q=70'}
                          alt="" className="prop-thumb"
                        />
                        <div className="prop-name-cell">
                          <strong>{p.title}</strong>
                          <span>{p.propertyType} · {p.listingType}</span>
                        </div>
                      </div>
                    </td>
                    <td>{p.bedrooms > 0 ? `${p.bedrooms} BHK` : p.propertyType}</td>
                    <td><strong style={{ color: 'var(--primary)' }}>{formatPrice(p.price)}</strong></td>
                    <td>
                      <span className={`badge badge-${p.status === 'Available' ? 'approved' : 'sold'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>{approvalBadge(p.approvalStatus)}</td>
                    <td>
                      <div className="action-btns">
                        <Link to={`/property/${p._id}`} className="btn btn-ghost btn-sm" title="View"><FiEye /></Link>
                        <Link to={`/owner/inquiries/${p._id}`} className="btn btn-ghost btn-sm" title="Inquiries"><FiMessageSquare /></Link>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} title="Delete" onClick={() => handleDelete(p._id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
