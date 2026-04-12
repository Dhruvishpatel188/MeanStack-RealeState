import { useState, useEffect } from 'react'
import { FiDollarSign, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi'
import { paymentAPI } from '../../services/api'
import toast from 'react-hot-toast'
import '../owner/OwnerPages.css'

const STATUS_ICON = { Completed: <FiCheckCircle color="var(--success)" />, Failed: <FiXCircle color="var(--danger)" />, Pending: <FiClock color="var(--gold)" /> }

export default function MyPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const r = await paymentAPI.getMy(); setPayments(r.data.data || []) }
    catch { toast.error('Failed to load payments') }
    finally { setLoading(false) }
  }

  return (
    <div className="page-wrapper"><div className="container">
      <div className="owner-page-header">
        <div><h1 className="section-title"><FiDollarSign /> My Payments</h1><p className="section-sub">{payments.length} transaction(s)</p></div>
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner" /></div>
      : payments.length === 0
        ? <div className="empty-state"><p>No transactions yet.</p></div>
        : <div className="prop-table-wrap">
            <table className="prop-table">
              <thead><tr><th>Property</th><th>Amount</th><th>Method</th><th>Transaction ID</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {payments.map(pay => {
                  const p = pay.propertyId
                  return (
                    <tr key={pay._id}>
                      <td>
                        <div className="prop-name-cell">
                          <strong>{p?.title || '—'}</strong>
                          <span>{p?.listingType}</span>
                        </div>
                      </td>
                      <td><strong style={{color:'var(--primary)'}}>₹{pay.amount?.toLocaleString()}</strong></td>
                      <td>{pay.paymentMethod}</td>
                      <td><code style={{fontSize:'0.78rem',background:'var(--bg)',padding:'2px 8px',borderRadius:4}}>{pay.transactionId}</code></td>
                      <td>{new Date(pay.paymentDate).toLocaleDateString()}</td>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          {STATUS_ICON[pay.status]}
                          <span className={`badge badge-${pay.status === 'Completed' ? 'approved' : pay.status === 'Failed' ? 'rejected' : 'pending'}`}>{pay.status}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
      }
    </div></div>
  )
}
