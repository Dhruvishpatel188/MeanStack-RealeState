// MyFavorites.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiTrash2, FiMapPin } from 'react-icons/fi'
import { favoriteAPI } from '../../services/api'
import toast from 'react-hot-toast'
import '../../pages/owner/OwnerPages.css'

const formatPrice = (p) => {
  if (p >= 10000000) return `₹${(p/10000000).toFixed(1)} Cr`
  if (p >= 100000) return `₹${(p/100000).toFixed(1)} L`
  return `₹${p?.toLocaleString()}`
}

export default function MyFavorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const r = await favoriteAPI.getMy(); setFavorites(r.data.data || []) }
    catch { toast.error('Failed to load favorites') }
    finally { setLoading(false) }
  }

  const remove = async (propertyId) => {
    try { await favoriteAPI.remove(propertyId); toast.success('Removed!'); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="page-wrapper"><div className="container">
      <div className="owner-page-header">
        <div><h1 className="section-title"><FiHeart /> Saved Properties</h1><p className="section-sub">{favorites.length} saved properties</p></div>
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner" /></div>
      : favorites.length === 0 ? <div className="empty-state"><p>No saved properties yet.</p><Link to="/properties" className="btn btn-primary" style={{marginTop:16}}>Browse Properties</Link></div>
      : <div className="property-grid">
          {favorites.map(fav => {
            const p = fav.propertyId
            if (!p) return null
            return (
              <div key={fav._id} className="card" style={{overflow:'hidden'}}>
                <div style={{position:'relative',aspectRatio:'16/9'}}>
                  <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&q=70'} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  <button style={{position:'absolute',top:8,right:8,background:'white',border:'none',borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--danger)'}} onClick={() => remove(p._id)}><FiTrash2 /></button>
                </div>
                <div style={{padding:16}}>
                  <div style={{fontFamily:'var(--font-serif)',fontSize:'1.2rem',color:'var(--primary)',marginBottom:6}}>{formatPrice(p.price)}</div>
                  <h3 style={{fontSize:'0.9rem',fontWeight:600,marginBottom:8}}>{p.title}</h3>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
                    <span className={`badge badge-${p.listingType === 'Sale' ? 'sale' : 'rent'}`}>{p.listingType}</span>
                    <span className="tag">{p.bedrooms > 0 ? `${p.bedrooms} BHK` : p.propertyType}</span>
                    <span className="tag">{p.area} sq.ft</span>
                  </div>
                  <Link to={`/property/${p._id}`} className="btn btn-primary btn-sm" style={{width:'100%',justifyContent:'center'}}>View Property</Link>
                </div>
              </div>
            )
          })}
        </div>
      }
    </div></div>
  )
}
