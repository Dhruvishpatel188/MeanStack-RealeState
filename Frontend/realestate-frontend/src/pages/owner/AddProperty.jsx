import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUpload, FiX, FiCheck } from 'react-icons/fi'
import { propertyAPI } from '../../services/api'
import toast from 'react-hot-toast'
import './OwnerPages.css'

const AMENITIES_LIST = ['Gym','Swimming Pool','Garden','Security','Lift','Power Backup','Club House','Children Play Area','Jogging Track','Visitor Parking']

export default function AddProperty() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imagePreviews, setImagePreviews] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', propertyType: 'Apartment', listingType: 'Sale',
    price: '', area: '', bedrooms: '', bathrooms: '',
    furnishing: 'Unfurnished', parking: false, amenities: [],
    address: '', city: '', state: '', pincode: '', country: 'India',
    latitude: '', longitude: '',
    images: [],
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setForm(f => ({ ...f, images: [...f.images, ...files].slice(0, 10) }))
    const previews = files.map(f => URL.createObjectURL(f))
    setImagePreviews(p => [...p, ...previews].slice(0, 10))
  }

  const removeImage = (idx) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
    setImagePreviews(p => p.filter((_, i) => i !== idx))
  }

  const toggleAmenity = (a) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.price || !form.city) return toast.error('Please fill required fields')
    setLoading(true)
    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'images') v.forEach(img => formData.append('images', img))
      else if (k === 'amenities') formData.append('amenities', v.join(','))
      else if (v !== '' && v !== null && v !== undefined) formData.append(k, v)
    })
    try {
      await propertyAPI.add(formData)
      toast.success('Property listed! Pending admin approval.')
      navigate('/owner/properties')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list property')
    } finally { setLoading(false) }
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="owner-page-header">
          <div>
            <h1 className="section-title">List a Property</h1>
            <p className="section-sub">Fill in the details below to list your property on EstateHub</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="add-prop-form">
          {/* Basic Info */}
          <div className="form-card">
            <h3 className="form-card-title">Basic Information</h3>
            <div className="form-group">
              <label className="form-label">Property Title *</label>
              <input name="title" className="form-control" placeholder="e.g. 3BHK Apartment in Satellite" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea name="description" className="form-control" rows={4} placeholder="Describe the property in detail..." value={form.description} onChange={handleChange} required />
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Property Type</label>
                <select name="propertyType" className="form-control" value={form.propertyType} onChange={handleChange}>
                  {['Apartment','House','Villa','Commercial','Land','Plot'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Listing Type</label>
                <select name="listingType" className="form-control" value={form.listingType} onChange={handleChange}>
                  <option value="Sale">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Furnishing</label>
                <select name="furnishing" className="form-control" value={form.furnishing} onChange={handleChange}>
                  {['Furnished','Semi-Furnished','Unfurnished'].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Size */}
          <div className="form-card">
            <h3 className="form-card-title">Pricing & Size</h3>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input name="price" type="number" className="form-control" placeholder="5000000" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Area (sq.ft)</label>
                <input name="area" type="number" className="form-control" placeholder="1200" value={form.area} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Bedrooms</label>
                <select name="bedrooms" className="form-control" value={form.bedrooms} onChange={handleChange}>
                  <option value="">Select</option>
                  {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n === 0 ? 'Studio' : n + ' BHK'}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <select name="bathrooms" className="form-control" value={form.bathrooms} onChange={handleChange}>
                  <option value="">Select</option>
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-group parking-check">
                <label className="form-label">Parking</label>
                <label className="toggle-label">
                  <input type="checkbox" name="parking" checked={form.parking} onChange={handleChange} />
                  <span className="toggle-track"><span className="toggle-thumb" /></span>
                  <span>{form.parking ? 'Available' : 'Not Available'}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-card">
            <h3 className="form-card-title">Location</h3>
            <div className="form-group">
              <label className="form-label">Address *</label>
              <input name="address" className="form-control" placeholder="Street, Locality" value={form.address} onChange={handleChange} required />
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input name="city" className="form-control" placeholder="Ahmedabad" value={form.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input name="state" className="form-control" placeholder="Gujarat" value={form.state} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode *</label>
                <input name="pincode" className="form-control" placeholder="380001" value={form.pincode} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Latitude (optional)</label>
                <input name="latitude" type="number" className="form-control" placeholder="23.0225" value={form.latitude} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Longitude (optional)</label>
                <input name="longitude" type="number" className="form-control" placeholder="72.5714" value={form.longitude} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="form-card">
            <h3 className="form-card-title">Amenities</h3>
            <div className="amenity-picker">
              {AMENITIES_LIST.map(a => (
                <button type="button" key={a}
                  className={`amenity-chip ${form.amenities.includes(a) ? 'active' : ''}`}
                  onClick={() => toggleAmenity(a)}>
                  {form.amenities.includes(a) && <FiCheck />} {a}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="form-card">
            <h3 className="form-card-title">Property Images (max 10)</h3>
            <label className="image-upload-zone">
              <FiUpload size={28} />
              <span>Click to upload images</span>
              <span className="upload-hint">JPG, PNG, WEBP — Max 5MB each</span>
              <input type="file" accept="image/*" multiple onChange={handleImages} hidden />
            </label>
            {imagePreviews.length > 0 && (
              <div className="image-preview-grid">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="img-preview-item">
                    <img src={src} alt="" />
                    <button type="button" className="img-remove" onClick={() => removeImage(i)}><FiX /></button>
                    {i === 0 && <span className="img-main-badge">Main</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Listing Property...' : '🏠 List Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
