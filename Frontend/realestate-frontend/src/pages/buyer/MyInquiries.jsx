import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiMessageSquare } from 'react-icons/fi'
import { inquiryAPI } from '../../services/api'
import toast from 'react-hot-toast'
import '../owner/OwnerPages.css'

const STATUS_MAP = { Pending: 'badge-pending', Contacted: 'badge-approved', Closed: 'badge-rejected' }

export default function MyInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const r = await inquiryAPI.getMy(); setInquiries(r.data.data || []) }
    catch { toast.error('Failed to load inquiries') }
    finally { setLoading(false) }
  }

  return (
    <div className="page-wrapper"><div className="container">
      <div className="owner-page-header">
        <div><h1 className="section-title"><FiMessageSquare /> My Inquiries</h1><p className="section-sub">{inquiries.length} inquiry/ies sent</p></div>
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner" /></div>
      : inquiries.length === 0
        ? <div className="empty-state"><p>No inquiries sent yet.</p></div>
        : <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {inquiries.map(inq => {
              const p = inq.propertyId
              return (
                <div key={inq._id} className="inq-card">
                  <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                    <img src={p?.images?.[0] || 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=80&q=60'} alt="" style={{width:72,height:52,objectFit:'cover',borderRadius:'var(--radius-sm)',flexShrink:0}} />
                    <div style={{flex:1}}>
                      <div className="inq-header">
                        <strong>{p?.title || 'Property'}</strong>
                        <span className={`badge ${STATUS_MAP[inq.status] || ''}`}>{inq.status}</span>
                      </div>
                      <div className="inq-meta">
                        <span>₹{p?.price?.toLocaleString()}</span>
                        <span>·</span>
                        <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="inq-message">{inq.message}</div>
                    </div>
                  </div>
                  {p && <Link to={`/property/${p._id}`} className="btn btn-outline btn-sm" style={{marginTop:12}}>View Property</Link>}
                </div>
              )
            })}
          </div>
      }
    </div></div>
  )
}
