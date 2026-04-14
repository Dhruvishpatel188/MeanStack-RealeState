import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiPhone, FiMail } from 'react-icons/fi'
import { inquiryAPI } from '../../services/api'
import toast from 'react-hot-toast'
import './OwnerPages.css'

const STATUS_COLORS = { Pending: 'badge-pending', Contacted: 'badge-approved', Closed: 'badge-rejected' }

export default function PropertyInquiries() {
  const { propertyId } = useParams()
  const navigate = useNavigate()
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadInquiries() }, [propertyId])

  const loadInquiries = async () => {
    try {
      const res = await inquiryAPI.getByProperty(propertyId)
      setInquiries(res.data.data || [])
    } catch { toast.error('Failed to load inquiries') }
    finally { setLoading(false) }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await inquiryAPI.updateStatus(id, status)
      toast.success('Status updated!')
      loadInquiries()
    } catch { toast.error('Failed to update status') }
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="owner-page-header">
          <div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 8 }}>
              <FiArrowLeft /> Back to Properties
            </button>
            <h1 className="section-title">Property Inquiries</h1>
            <p className="section-sub">{inquiries.length} inquiry/ies received</p>
          </div>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : inquiries.length === 0 ? (
          <div className="empty-state"><p>No inquiries received yet for this property.</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {inquiries.map(inq => {
              const buyer = inq.buyerId
              return (
                <div key={inq._id} className="inq-card">
                  <div className="inq-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={buyer?.profilePic || `https://ui-avatars.com/api/?name=${buyer?.firstName}&background=c84b31&color=fff`}
                        alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <strong>{buyer?.firstName} {buyer?.lastName}</strong>
                        <div className="inq-meta" style={{ margin: 0 }}>
                          {buyer?.email && <span><FiMail /> {buyer.email}</span>}
                          {buyer?.phone && <span><FiPhone /> {buyer.phone}</span>}
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${STATUS_COLORS[inq.status]}`}>{inq.status}</span>
                  </div>

                  <div className="inq-meta">
                    {inq.contactPhone && <span><FiPhone /> {inq.contactPhone}</span>}
                    {inq.contactEmail && <span><FiMail /> {inq.contactEmail}</span>}
                    <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="inq-message">{inq.message}</div>

                  <div className="inq-actions">
                    {['Pending','Contacted','Closed'].map(s => (
                      <button key={s}
                        className={`btn btn-sm ${inq.status === s ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleStatusChange(inq._id, s)}>
                        {s}
                      </button>
                    ))}
                    {inq.contactPhone && (
                      <a href={`tel:${inq.contactPhone}`} className="btn btn-dark btn-sm"><FiPhone /> Call</a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
