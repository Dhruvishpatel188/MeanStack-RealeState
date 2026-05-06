import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiMapPin, FiMaximize, FiDroplet, FiBriefcase } from 'react-icons/fi'
import { IoBedOutline } from 'react-icons/io5'
import { favoriteAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import './PropertyCard.css'

const formatPrice = (price) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`
  return `₹${price.toLocaleString()}`
}

export default function PropertyCard({ property, onFavoriteToggle }) {
  const { user } = useAuth()
  const [isFav, setIsFav] = useState(false)
  const [favLoading, setFavLoading] = useState(false)

  const img = property.images?.[0] || 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80'

  const handleFav = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please login to save properties')
    if (user.role !== 'BUYER') return toast.error('Only buyers can save properties')

    setFavLoading(true)
    try {
      if (isFav) {
        await favoriteAPI.remove(property._id)
        setIsFav(false)
        toast.success('Removed from favorites')
      } else {
        await favoriteAPI.add(property._id)
        setIsFav(true)
        toast.success('Saved to favorites!')
      }
      onFavoriteToggle?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setFavLoading(false)
    }
  }

  return (
    <Link to={`/property/${property._id}`} className="prop-card">
      <div className="prop-img-wrap">
        <img src={img} alt={property.title} loading="lazy" />
        <div className="prop-badges">
          <span className={`badge badge-${property.listingType === 'Sale' ? 'sale' : 'rent'}`}>
            {property.listingType}
          </span>
          {property.status !== 'Available' && (
            <span className={`badge badge-${property.status === 'Sold' ? 'sold' : 'rent'}`}>
              {property.status}
            </span>
          )}
        </div>
        <button
          className={`fav-btn ${isFav ? 'active' : ''} ${favLoading ? 'loading' : ''}`}
          onClick={handleFav}
          title="Save property"
        >
          <FiHeart />
        </button>
        <div className="prop-type-tag">{property.propertyType}</div>
      </div>

      <div className="prop-body">
        <div className="prop-price">{formatPrice(property.price)}</div>
        <h3 className="prop-title">{property.title}</h3>

        {property.location && (
          <p className="prop-location">
            <FiMapPin />
            {property.location.city}, {property.location.state}
          </p>
        )}

        <div className="prop-specs">
          {property.bedrooms > 0 && (
            <span><IoBedOutline /> {property.bedrooms} BHK</span>
          )}
          {property.bathrooms > 0 && (
            <span><FiDroplet /> {property.bathrooms} Bath</span>
          )}
          {property.area && (
            <span><FiMaximize /> {property.area} sq.ft</span>
          )}
        </div>

        <div className="prop-footer">
          <span className="prop-furnish">{property.furnishing || 'Unfurnished'}</span>
          {property.ownerId && (
            <span className="prop-owner">
              <FiBriefcase />
              {property.ownerId.firstName} {property.ownerId.lastName}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
