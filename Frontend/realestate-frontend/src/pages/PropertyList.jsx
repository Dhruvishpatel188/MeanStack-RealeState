import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiX, FiSearch, FiGrid, FiList } from 'react-icons/fi'
import { propertyAPI } from '../services/api'
import PropertyCard from '../components/user/PropertyCard'
import './PropertyList.css'

const CITIES = ['Mumbai','Delhi','Bangalore','Ahmedabad','Pune','Hyderabad','Chennai','Kolkata','Jaipur','Surat']

export default function PropertyList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // filters
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    listingType: searchParams.get('listingType') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    furnishing: searchParams.get('furnishing') || '',
    parking: searchParams.get('parking') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    page: Number(searchParams.get('page')) || 1,
  })

  useEffect(() => { fetchProperties() }, [filters])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([,v]) => v !== ''))
      const res = await propertyAPI.getAll({ ...params, limit: 9 })
      setProperties(res.data.data || [])
      setTotal(res.data.total || 0)
      setTotalPages(res.data.totalPages || 1)
    } catch { setProperties([]) }
    finally { setLoading(false) }
  }

  const handleFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({ search:'', listingType:'', propertyType:'', minPrice:'', maxPrice:'', bedrooms:'', furnishing:'', parking:'', sortBy:'createdAt', page: 1 })
    setSearchParams({})
  }

  const handlePageChange = (p) => setFilters(f => ({ ...f, page: p }))

  const activeFilterCount = [filters.listingType, filters.propertyType, filters.minPrice, filters.maxPrice, filters.bedrooms, filters.furnishing, filters.parking].filter(Boolean).length

  return (
    <div className="pl-page page-wrapper">
      <div className="container pl-inner">

        {/* ── Sidebar ── */}
        <aside className={`pl-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-head">
            <h3>Filters {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}</h3>
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}><FiX /> Clear All</button>
          </div>

          {/* Listing Type */}
          <div className="filter-section">
            <label className="filter-label">Looking For</label>
            <div className="filter-pills">
              {['', 'Sale', 'Rent'].map(v => (
                <button key={v} className={`pill ${filters.listingType === v ? 'active' : ''}`} onClick={() => handleFilter('listingType', v)}>
                  {v || 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div className="filter-section">
            <label className="filter-label">Property Type</label>
            <div className="filter-pills wrap">
              {['', 'Apartment', 'House', 'Villa', 'Commercial', 'Land', 'Plot'].map(v => (
                <button key={v} className={`pill ${filters.propertyType === v ? 'active' : ''}`} onClick={() => handleFilter('propertyType', v)}>
                  {v || 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="filter-section">
            <label className="filter-label">Budget (₹)</label>
            <div className="range-inputs">
              <input type="number" placeholder="Min Price" className="form-control" value={filters.minPrice}
                onChange={e => handleFilter('minPrice', e.target.value)} />
              <input type="number" placeholder="Max Price" className="form-control" value={filters.maxPrice}
                onChange={e => handleFilter('maxPrice', e.target.value)} />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="filter-section">
            <label className="filter-label">Bedrooms (BHK)</label>
            <div className="filter-pills">
              {['', '1', '2', '3', '4'].map(v => (
                <button key={v} className={`pill ${filters.bedrooms === v ? 'active' : ''}`} onClick={() => handleFilter('bedrooms', v)}>
                  {v || 'Any'}
                </button>
              ))}
            </div>
          </div>

          {/* Furnishing */}
          <div className="filter-section">
            <label className="filter-label">Furnishing</label>
            <div className="filter-pills wrap">
              {['', 'Furnished', 'Semi-Furnished', 'Unfurnished'].map(v => (
                <button key={v} className={`pill ${filters.furnishing === v ? 'active' : ''}`} onClick={() => handleFilter('furnishing', v)}>
                  {v || 'Any'}
                </button>
              ))}
            </div>
          </div>

          {/* Parking */}
          <div className="filter-section">
            <label className="filter-label">Parking</label>
            <div className="filter-pills">
              {[{ label: 'Any', val: '' }, { label: 'Yes', val: 'true' }, { label: 'No', val: 'false' }].map(o => (
                <button key={o.val} className={`pill ${filters.parking === o.val ? 'active' : ''}`} onClick={() => handleFilter('parking', o.val)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="pl-main">
          {/* Topbar */}
          <div className="pl-topbar">
            <div className="pl-search-wrap">
              <FiSearch />
              <input
                type="text" placeholder="Search properties, localities..."
                value={filters.search}
                onChange={e => handleFilter('search', e.target.value)}
              />
            </div>

            <div className="pl-controls">
              <span className="result-count">{total} Properties</span>
              <select className="form-control" value={filters.sortBy} onChange={e => handleFilter('sortBy', e.target.value)}>
                <option value="createdAt">Latest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="area">Area: Small to Large</option>
              </select>
              <button className="btn btn-outline btn-sm filter-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <FiFilter /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : properties.length === 0 ? (
            <div className="empty-state">
              <FiSearch size={48} style={{ color: 'var(--border)', marginBottom: 16 }} />
              <h3>No Properties Found</h3>
              <p>Try adjusting your filters or search query.</p>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="property-grid">
                {properties.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button className="btn btn-outline btn-sm" disabled={filters.page === 1} onClick={() => handlePageChange(filters.page - 1)}>← Prev</button>
                  <div className="page-nums">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                      <button key={p} className={`page-num ${filters.page === p ? 'active' : ''}`} onClick={() => handlePageChange(p)}>{p}</button>
                    ))}
                  </div>
                  <button className="btn btn-outline btn-sm" disabled={filters.page === totalPages} onClick={() => handlePageChange(filters.page + 1)}>Next →</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
