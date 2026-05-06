import { Link } from 'react-router-dom'
import { FiHome, FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon"><FiHome /></span>
            <span>Estate<strong>Hub</strong></span>
          </div>
          <p>India's most trusted real estate platform connecting buyers, sellers, and agents seamlessly.</p>
          <div className="footer-socials">
            <a href="#"><FiFacebook /></a>
            <a href="#"><FiTwitter /></a>
            <a href="#"><FiInstagram /></a>
            <a href="#"><FiLinkedin /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/properties">Buy Property</Link>
          <Link to="/properties?listingType=Rent">Rent Property</Link>
          <Link to="/owner/add-property">Sell / List Property</Link>
          <Link to="/properties?propertyType=Commercial">Commercial</Link>
        </div>

        <div className="footer-col">
          <h4>Property Types</h4>
          <Link to="/properties?propertyType=Apartment">Apartments</Link>
          <Link to="/properties?propertyType=House">Houses & Villas</Link>
          <Link to="/properties?propertyType=Plot">Plots & Land</Link>
          <Link to="/properties?propertyType=Commercial">Office / Shops</Link>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          <p><FiMapPin /> 4th Floor, EstateHub Tower, Ahmedabad, Gujarat</p>
          <p><FiPhone /> +91 98765 43210</p>
          <p><FiMail /> support@estatehub.in</p>
          <Link to="/support" className="btn btn-outline btn-sm" style={{marginTop:'12px', display:'inline-flex'}}>
            Get Support
          </Link>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>© {new Date().getFullYear()} EstateHub. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  )
}
