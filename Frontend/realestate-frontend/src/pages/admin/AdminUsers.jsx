import { useState, useEffect } from 'react'
import { FiSearch, FiTrash2, FiUserX, FiUserCheck } from 'react-icons/fi'
import { userAPI } from '../../services/api'
import toast from 'react-hot-toast'
import './AdminPages.css'
import '../owner/OwnerPages.css'

const ROLE_CLASSES = { ADMIN:'role-admin', AGENT:'role-agent', OWNER:'role-owner', BUYER:'role-buyer', SUPPORT:'role-support' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => { load() }, [roleFilter])
  const load = async () => {
    setLoading(true)
    try {
      const params = {}
      if (roleFilter) params.role = roleFilter
      const r = await userAPI.getAll(params)
      setUsers(r.data.data || [])
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  const toggleStatus = async (id) => {
    try { await userAPI.toggleStatus(id); toast.success('Status updated!'); load() }
    catch { toast.error('Failed') }
  }

  const changeRole = async (id, role) => {
    try { await userAPI.changeRole(id, role); toast.success('Role updated!'); load() }
    catch { toast.error('Failed') }
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return
    try { await userAPI.delete(id); toast.success('User deleted!'); load() }
    catch { toast.error('Failed') }
  }

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-wrapper"><div className="container">
      <div className="admin-header">
        <div><h1 className="section-title">User Management</h1><p className="section-sub">{users.length} total users</p></div>
      </div>

      <div className="admin-filter-bar">
        <div style={{display:'flex',alignItems:'center',gap:8,flex:1,border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',padding:'0 12px',background:'white'}}>
          <FiSearch style={{color:'var(--text-3)'}} />
          <input style={{border:'none',outline:'none',fontSize:'0.88rem',width:'100%'}} placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          {['ADMIN','AGENT','OWNER','BUYER','SUPPORT'].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div>
      : <div className="prop-table-wrap">
          <table className="prop-table">
            <thead>
              <tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <img src={u.profilePic || `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=c84b31&color=fff`} alt="" className="user-avatar-sm" />
                      <div className="prop-name-cell">
                        <strong>{u.firstName} {u.lastName}</strong>
                        <span>{u.phone || '—'}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{fontSize:'0.85rem'}}>{u.email}</td>
                  <td>
                    <select className="role-select" value={u.role} onChange={e => changeRole(u._id, e.target.value)}>
                      {['ADMIN','AGENT','OWNER','BUYER','SUPPORT'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>
                    <span className={`badge badge-${u.isActive ? 'approved' : 'rejected'}`}>
                      {u.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td style={{fontSize:'0.82rem',color:'var(--text-3)'}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-ghost btn-sm" title={u.isActive ? 'Block' : 'Unblock'} onClick={() => toggleStatus(u._id)}
                        style={{color: u.isActive ? 'var(--warning)' : 'var(--success)'}}>
                        {u.isActive ? <FiUserX /> : <FiUserCheck />}
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{color:'var(--danger)'}} onClick={() => deleteUser(u._id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state" style={{padding:32}}><p>No users found.</p></div>}
        </div>
      }
    </div></div>
  )
}
