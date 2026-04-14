import { useState, useEffect } from 'react'
import { FiStar, FiTrash2 } from 'react-icons/fi'
import { reviewAPI } from '../../services/api'
import toast from 'react-hot-toast'
import './AdminPages.css'
import '../owner/OwnerPages.css'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const r = await reviewAPI.getAll(); setReviews(r.data.data || []) }
    catch { toast.error('Failed to load reviews') }
    finally { setLoading(false) }
  }

  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return
    try { await reviewAPI.delete(id); toast.success('Review deleted!'); load() }
    catch { toast.error('Failed') }
  }

  const stars = (n) => Array(5).fill(0).map((_, i) => (
    <span key={i} style={{ color: i < n ? 'var(--gold)' : 'var(--border)' }}>★</span>
  ))

  return (
    <div className="page-wrapper"><div className="container">
      <div className="admin-header">
        <div>
          <h1 className="section-title"><FiStar /> Reviews Management</h1>
          <p className="section-sub">{reviews.length} reviews</p>
        </div>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <div className="prop-table-wrap">
          <table className="prop-table">
            <thead>
              <tr><th>User</th><th>Property</th><th>Rating</th><th>Comment</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={r.userId?.profilePic || `https://ui-avatars.com/api/?name=${r.userId?.firstName}&background=c84b31&color=fff`}
                        alt="" className="user-avatar-sm"
                      />
                      <div className="prop-name-cell">
                        <strong>{r.userId ? `${r.userId.firstName} ${r.userId.lastName}` : '—'}</strong>
                        <span>{r.userId?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <strong>{r.propertyId?.title || '—'}</strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', fontSize: '1rem' }}>{stars(r.rating)}</div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-2)', maxWidth: 200 }}>
                    {r.comment || <span style={{ color: 'var(--text-3)' }}>No comment</span>}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => deleteReview(r._id)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr><td colSpan={6}><div className="empty-state" style={{ padding: 32 }}><p>No reviews found.</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div></div>
  )
}
