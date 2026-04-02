import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiMapPin, FiArrowRight, FiStar, FiShield, FiTrendingUp } from 'react-icons/fi'
import { propertyAPI } from '../services/api'
import PropertyCard from '../components/user/PropertyCard'
import './Home.css'

const CITIES = [
  { name: 'Mumbai', img: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&q=80', count: '12,400+' },
  { name: 'Delhi', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80', count: '9,800+' },
  { name: 'Bangalore', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80', count: '8,200+' },
  { name: 'Ahmedabad', img: 'https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40?w=400&q=80', count: '5,100+' },
  { name: 'Pune', img: 'https://images.unsplash.com/photo-1612810806695-30f7a8258391?w=400&q=80', count: '6,500+' },
  { name: 'Hyderabad', img: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400&q=80', count: '4,700+' },
]

const PROPERTY_TYPES = [
  { label: 'All', value: '' },
  { label: 'Apartment', value: 'Apartment' },
  { label: 'House', value: 'House' },
  { label: 'Villa', value: 'Villa' },
  { label: 'Commercial', value: 'Commercial' },
  { label: 'Plot', value: 'Plot' },
]

const STATS = [
  { icon: <FiTrendingUp />, value: '50,000+', label: 'Properties Listed' },
  { icon: <FiStar />, value: '4.8★', label: 'Average Rating' },
  { icon: <FiShield />, value: '99%', label: 'Verified Listings' },
  { icon: <FiMapPin />, value: '100+', label: 'Cities Covered' },
]

export default function Home() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('Buy')
  const [search, setSearch] = useState('')
  const [propType, setPropType] = useState('')
  const [featuredProps, setFeaturedProps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeatured()
  }, [])

  const loadFeatured = async () => {
    try {
      const res = await propertyAPI.getAll({ limit: 6, page: 1 })
      setFeaturedProps(res.data.data || [])
    } catch {
      setFeaturedProps([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (propType) params.set('propertyType', propType)
    params.set('listingType', tab === 'Buy' ? 'Sale' : 'Rent')
    navigate(`/properties?${params.toString()}`)
  }

  const handleCityClick = (city) => {
    navigate(`/properties?city=${city}`)
  }

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80" alt="hero" />
          <div className="hero-overlay" />
        </div>

        <div className="hero-content container">
          <div className="hero-text fade-up">
            <span className="hero-eyebrow">India's #1 Real Estate Platform</span>
            <h1 className="hero-title">
              Find Your Perfect<br />
              <em>Dream Property</em>
            </h1>
            <p className="hero-sub">
              Over 50,000 verified listings across 100+ cities. Buy, sell, or rent with complete confidence.
            </p>
          </div>

          {/* Search Box */}
          <div className="search-box fade-up">
            <div className="search-tabs">
              {['Buy', 'Rent'].map(t => (
                <button
                  key={t}
                  className={`search-tab ${tab === t ? 'active' : ''}`}
                  onClick={() => setTab(t)}
                >{t}</button>
              ))}
            </div>

            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-type-select">
                <select value={propType} onChange={e => setPropType(e.target.value)}>
                  {PROPERTY_TYPES.map(p => (
                    <option key={p.value} value={p.value}>{p.label || 'All Types'}</option>
                  ))}
                </select>
              </div>
              <div className="search-input-wrap">
                <FiMapPin className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by city, locality or property name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="search-btn">
                <FiSearch /> Search
              </button>
            </form>

            <div className="search-popular">
              <span>Popular:</span>
              {['Mumbai', 'Delhi', 'Bangalore', 'Ahmedabad'].map(c => (
                <button key={c} onClick={() => navigate(`/properties?search=${c}`)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-strip">
        <div className="container stats-grid">
          {STATS.map((s, i) => (
            <div className="stat-item" key={i}>
              <span className="stat-icon">{s.icon}</span>
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Browse by City ── */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Browse by City</h2>
            <p className="section-sub">Explore properties across India's top cities</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/properties')}>
            View All <FiArrowRight />
          </button>
        </div>

        <div className="city-grid">
          {CITIES.map(city => (
            <div key={city.name} className="city-card" onClick={() => handleCityClick(city.name)}>
              <img src={city.img} alt={city.name} loading="lazy" />
              <div className="city-overlay">
                <h3>{city.name}</h3>
                <p>{city.count} Properties</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Properties ── */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-sub">Handpicked properties just for you</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/properties')}>
            View All <FiArrowRight />
          </button>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : featuredProps.length === 0 ? (
          <div className="empty-state">
            <p>No properties available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="property-grid">
            {featuredProps.map(p => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </section>

      {/* ── Why EstateHub ── */}
      <section className="why-section">
        <div className="container why-inner">
          <div className="why-text">
            <h2 className="section-title">Why Choose EstateHub?</h2>
            <p className="section-sub">We make property search simple, transparent and reliable.</p>
            <ul className="why-list">
              <li><FiShield /> <span><strong>100% Verified Listings</strong> — All properties are verified by our team before going live.</span></li>
              <li><FiStar /> <span><strong>No Brokerage</strong> — Connect directly with owners and save on brokerage fees.</span></li>
              <li><FiTrendingUp /> <span><strong>Real-time Updates</strong> — Get instant notifications on inquiries and status changes.</span></li>
              <li><FiMapPin /> <span><strong>Pan-India Coverage</strong> — Properties across 100+ cities and growing.</span></li>
            </ul>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              Get Started Free <FiArrowRight />
            </button>
          </div>
          <div className="why-img">
            <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80" alt="modern home" />
          </div>
        </div>
      </section>
    </div>
  )
}
