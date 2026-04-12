import { useState, useEffect } from 'react'
import { FiDollarSign } from 'react-icons/fi'
import { paymentAPI } from '../../services/api'
import toast from 'react-hot-toast'
import './AdminPages.css'
import '../owner/OwnerPages.css'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => { load() }, [statusFilter])
  const load = async () => {
    setLoading(true)
    try {
      const params = {}
      if (statusFilter) params.status = statusFilter
      const r = await paymentAPI.getAll(params)
      setPayments(r.data.data || [])
      setTotalRevenue(r.data.totalRevenue || 0)
    } catch { toast.error('Failed to load payments') }
    finally { setLoading(false) }
  }

  const updateStatus = async (id, status) => {
    try { await paymentAPI.updateStatus(id, status); toast.success('Payment updated!'); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="page-wrapper"><div className="container">
      <div className="admin-header">
        <div><h1 className="section-title">Payment Management</h1><p className="section-sub">Total Revenue: <strong style={{color:'var(--success)'}}>₹{totalRevenue.toLocaleString()}</strong></p></div>
      </div>

      <div className="admin-filter-bar">
        {['','Pending','Completed','Failed'].map(s => (
          <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter(s)}>{s || 'All'}</button>
        ))}
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div>
      : <div className="prop-table-wrap">
          <table className="prop-table">
            <thead>
              <tr><th>Property</th><th>Buyer</th><th>Owner</th><th>Amount</th><th>Method</th><th>Txn ID</th><th>Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {payments.map(pay => (
                <tr key={pay._id}>
                  <td><div className="prop-name-cell"><strong>{pay.propertyId?.title || '—'}</strong><span>{pay.propertyId?.listingType}</span></div></td>
                  <td style={{fontSize:'0.82rem'}}>{pay.buyerId ? `${pay.buyerId.firstName} ${pay.buyerId.lastName}` : '—'}</td>
                  <td style={{fontSize:'0.82rem'}}>{pay.ownerId ? `${pay.ownerId.firstName} ${pay.ownerId.lastName}` : '—'}</td>
                  <td><strong style={{color:'var(--primary)'}}>₹{pay.amount?.toLocaleString()}</strong></td>
                  <td style={{fontSize:'0.82rem'}}>{pay.paymentMethod}</td>
                  <td><code style={{fontSize:'0.72rem',background:'var(--bg)',padding:'2px 6px',borderRadius:4}}>{pay.transactionId?.slice(0,16)}...</code></td>
                  <td style={{fontSize:'0.78rem',color:'var(--text-3)'}}>{new Date(pay.paymentDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${pay.status === 'Completed' ? 'approved' : pay.status === 'Failed' ? 'rejected' : 'pending'}`}>{pay.status}</span>
                  </td>
                  <td>
                    {pay.status === 'Pending' && (
                      <div className="action-btns">
                        <button className="btn btn-sm" style={{background:'var(--success)',color:'white'}} onClick={() => updateStatus(pay._id, 'Completed')}>Complete</button>
                        <button className="btn btn-sm btn-outline" style={{color:'var(--danger)',borderColor:'var(--danger)'}} onClick={() => updateStatus(pay._id, 'Failed')}>Fail</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && <div className="empty-state" style={{padding:32}}><p>No payments found.</p></div>}
        </div>
      }
    </div></div>
  )
}
