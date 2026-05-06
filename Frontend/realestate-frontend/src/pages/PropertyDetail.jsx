import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiMapPin, FiPhone, FiMail, FiMaximize, FiDroplet, FiCheck,
         FiCalendar, FiMessageSquare, FiHeart, FiShare2, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { IoBedOutline } from 'react-icons/io5'
import { propertyAPI, inquiryAPI, visitAPI, reviewAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './PropertyDetail.css'

const formatPrice = (p) => {
  if (p >= 10000000) return `₹${(p/10000000).toFixed(2)} Cr`
  if (p >= 100000) return `₹${(p/100000).toFixed(1)} L`
  return `₹${p?.toLocaleString()}`
}

export default function PropertyDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')

  // forms
  const [inquiry, setInquiry] = useState({ message: '', contactPhone: '', contactEmail: '' })
  const [visit, setVisit] = useState({ visitDate: '', visitTime: '' })
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadProperty()
    loadReviews()
  }, [id])

  const loadProperty = async () => {
    try {
      const res = await propertyAPI.getById(id)
      setProperty(res.data.data)
    } catch { toast.error('Property not found') }
    finally { setLoading(false) }
  }

  const loadReviews = async () => {
    try {
      const res = await reviewAPI.getByProperty(id)
      setReviews(res.data.data || [])
    } catch (err) {
      // Silently ignore or log review loading error
    }
  }

  const handleInquiry = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    setSubmitting(true)
    try {
      await inquiryAPI.create({ propertyId: id, ...inquiry })
      toast.success('Inquiry sent! The owner will contact you soon.')
      setInquiry({ message: '', contactPhone: '', contactEmail: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send inquiry')
    } finally { setSubmitting(false) }
  }

  const handleVisit = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    setSubmitting(true)
    try {
      await visitAPI.schedule({ propertyId: id, ...visit })
      toast.success('Visit scheduled! Waiting for owner approval.')
      setVisit({ visitDate: '', visitTime: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule visit')
    } finally { setSubmitting(false) }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    setSubmitting(true)
    try {
      await reviewAPI.add({ propertyId: id, ...review })
      toast.success('Review added!')
      setReview({ rating: 5, comment: '' })
      loadReviews()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add review')
    } finally { setSubmitting(false) }
  }

  if (loading) return <div className="spinner-wrap" style={{ minHeight: '60vh' }}><div className="spinner" /></div>
  if (!property) return <div className="empty-state"><p>Property not found.</p></div>

  const images = property.images?.length > 0 ? property.images : ['https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80']
  const owner = property.ownerId
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  return (
    <div className="pd-page page-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">← Back</button>
          <span>{property.propertyType}</span> / <span>{property.location?.city}</span> / <strong>{property.title}</strong>
        </div>

        <div className="pd-layout">
          {/* LEFT: main content */}
          <div className="pd-left">
            {/* Image gallery */}
            <div className="gallery">
              <div className="gallery-main">
                <img src={images[imgIdx]} alt={property.title} />
                {images.length > 1 && (
                  <>
                    <button className="gal-btn gal-prev" onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}><FiChevronLeft /></button>
                    <button className="gal-btn gal-next" onClick={() => setImgIdx(i => (i + 1) % images.length)}><FiChevronRight /></button>
                    <div className="gal-counter">{imgIdx + 1} / {images.length}</div>
                  </>
                )}
                <div className="gal-badges">
                  <span className={`badge badge-${property.listingType === 'Sale' ? 'sale' : 'rent'}`}>{property.listingType}</span>
                  {property.status !== 'Available' && <span className="badge badge-sold">{property.status}</span>}
                </div>
              </div>
              {images.length > 1 && (
                <div className="gallery-thumbs">
                  {images.map((img, i) => (
                    <img key={i} src={img} alt="" className={imgIdx === i ? 'active' : ''} onClick={() => setImgIdx(i)} />
                  ))}
                </div>
              )}
            </div>

            {/* Title + price */}
            <div className="pd-header">
              <div>
                <h1 className="pd-title">{property.title}</h1>
                {property.location && (
                  <p className="pd-location"><FiMapPin />{property.location.address}, {property.location.city}, {property.location.state}</p>
                )}
              </div>
              <div className="pd-price-wrap">
                <div className="pd-price">{formatPrice(property.price)}</div>
                {property.listingType === 'Rent' && <span className="pd-price-sub">/month</span>}
              </div>
            </div>

            {/* Key specs */}
            <div className="pd-specs">
              {property.bedrooms > 0 && <div className="spec-item"><IoBedOutline /><span>{property.bedrooms} Bedrooms</span></div>}
              {property.bathrooms > 0 && <div className="spec-item"><FiDroplet /><span>{property.bathrooms} Bathrooms</span></div>}
              {property.area && <div className="spec-item"><FiMaximize /><span>{property.area} sq.ft</span></div>}
              {property.furnishing && <div className="spec-item"><FiCheck /><span>{property.furnishing}</span></div>}
              {property.parking && <div className="spec-item"><FiCheck /><span>Parking Available</span></div>}
            </div>

            {/* Tabs */}
            <div className="pd-tabs">
              {['overview','amenities','reviews'].map(tab => (
                <button key={tab} className={`pd-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'reviews' && reviews.length > 0 && <span className="tab-count">{reviews.length}</span>}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="pd-section">
                <h3>Description</h3>
                <p className="pd-desc">{property.description}</p>
                <div className="pd-details-grid">
                  <div><span>Property Type</span><strong>{property.propertyType}</strong></div>
                  <div><span>Listing Type</span><strong>{property.listingType}</strong></div>
                  <div><span>Status</span><strong>{property.status}</strong></div>
                  <div><span>Furnishing</span><strong>{property.furnishing}</strong></div>
                  {property.area && <div><span>Area</span><strong>{property.area} sq.ft</strong></div>}
                  {property.parking !== undefined && <div><span>Parking</span><strong>{property.parking ? 'Yes' : 'No'}</strong></div>}
                </div>
              </div>
            )}

            {activeTab === 'amenities' && (
              <div className="pd-section">
                <h3>Amenities</h3>
                {property.amenities?.length > 0 ? (
                  <div className="amenities-grid">
                    {property.amenities.map((a, i) => (
                      <div key={i} className="amenity-item"><FiCheck /> {a}</div>
                    ))}
                  </div>
                ) : <p className="text-muted">No amenities listed.</p>}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="pd-section">
                <h3>Reviews {avgRating && <span className="avg-rating">★ {avgRating}</span>}</h3>
                <div className="reviews-list">
                  {reviews.map(r => (
                    <div key={r._id} className="review-item">
                      <img src={r.userId?.profilePic || `https://ui-avatars.com/api/?name=${r.userId?.firstName}&background=c84b31&color=fff`} alt="" />
                      <div>
                        <div className="review-meta">
                          <strong>{r.userId?.firstName} {r.userId?.lastName}</strong>
                          <div className="stars">{Array(r.rating).fill('★').join('')}</div>
                        </div>
                        <p>{r.comment}</p>
                      </div>
                    </div>
                  ))}
                  {reviews.length === 0 && <p className="text-muted">No reviews yet.</p>}
                </div>
                {user?.role === 'BUYER' && (
                  <form className="review-form" onSubmit={handleReview}>
                    <h4>Write a Review</h4>
                    <div className="form-group">
                      <label className="form-label">Rating</label>
                      <div className="rating-input">
                        {[1,2,3,4,5].map(n => (
                          <button type="button" key={n} className={`star-btn ${review.rating >= n ? 'active' : ''}`} onClick={() => setReview(r => ({...r, rating: n}))}>★</button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <textarea className="form-control" rows={3} placeholder="Share your experience..."
                        value={review.comment} onChange={e => setReview(r => ({...r, comment: e.target.value}))} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>Submit Review</button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: contact forms */}
          <div className="pd-right">
            {/* Owner contact */}
            {owner && (
              <div className="pd-widget">
                <h4>Contact Owner</h4>
                <div className="owner-info">
                  <img src={owner.profilePic || `https://ui-avatars.com/api/?name=${owner.firstName}&background=c84b31&color=fff`} alt="" />
                  <div>
                    <strong>{owner.firstName} {owner.lastName}</strong>
                    <p>Property Owner</p>
                  </div>
                </div>
                {owner.phone && <a href={`tel:${owner.phone}`} className="btn btn-outline btn-sm" style={{width:'100%',justifyContent:'center'}}><FiPhone /> {owner.phone}</a>}
                {owner.email && <a href={`mailto:${owner.email}`} className="btn btn-ghost btn-sm" style={{width:'100%',justifyContent:'center',marginTop:8}}><FiMail /> Email Owner</a>}
              </div>
            )}

            {/* Inquiry form */}
            <div className="pd-widget">
              <h4><FiMessageSquare /> Send Inquiry</h4>
              <form onSubmit={handleInquiry} className="widget-form">
                <div className="form-group">
                  <textarea className="form-control" rows={3} placeholder="I'm interested in this property..."
                    value={inquiry.message} onChange={e => setInquiry(i => ({...i, message: e.target.value}))} required />
                </div>
                <div className="form-group">
                  <input className="form-control" type="tel" placeholder="Your phone number"
                    value={inquiry.contactPhone} onChange={e => setInquiry(i => ({...i, contactPhone: e.target.value}))} />
                </div>
                <div className="form-group">
                  <input className="form-control" type="email" placeholder="Your email"
                    value={inquiry.contactEmail} onChange={e => setInquiry(i => ({...i, contactEmail: e.target.value}))} />
                </div>
                <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </div>

            {/* Visit form */}
            <div className="pd-widget">
              <h4><FiCalendar /> Schedule a Visit</h4>
              <form onSubmit={handleVisit} className="widget-form">
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input className="form-control" type="date" value={visit.visitDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setVisit(v => ({...v, visitDate: e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Time</label>
                  <select className="form-control" value={visit.visitTime} onChange={e => setVisit(v => ({...v, visitTime: e.target.value}))} required>
                    <option value="">Select time</option>
                    {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-dark" style={{width:'100%',justifyContent:'center'}} disabled={submitting}>
                  {submitting ? 'Scheduling...' : 'Schedule Visit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
