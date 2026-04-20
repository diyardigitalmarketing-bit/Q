import Link from 'next/link'
import Image from 'next/image'
import { FiPhone, FiFax, FiMapPin, FiMail, FiExternalLink, FiInstagram, FiFacebook, FiYoutube, FiTwitter } from 'react-icons/fi'

const Footer = () => {
  const year = new Date().getFullYear()

  const departments = [
    'Cardiology', 'Neurosurgery', 'Orthopedics', 'Nephrology',
    'Gastroenterology', 'Oncology', 'Pediatrics', 'Emergency',
  ]

  const quickLinks = [
    { label: 'About QIH', href: '/about-us' },
    { label: 'Our Consultants', href: '/consultant' },
    { label: 'Book Appointment', href: '/make-appointment' },
    { label: 'Careers', href: '/career' },
    { label: 'News & Events', href: '/about-us/news' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Sitemap', href: '/about-us/sitemap' },
  ]

  const services = [
    { label: 'Liver Transplant', href: '/services/liver-transplant' },
    { label: 'Kidney Transplant', href: '/services/kidney-transplant' },
    { label: 'Bone Marrow Transplant', href: '/services/bone-marrow-transplant' },
    { label: 'Critical Care', href: '/services/critical-care' },
    { label: 'Teleconsultation', href: '/services/teleconsultation-services' },
    { label: 'Radiology & Imaging', href: '/services/Radiology-&-Imaging' },
    { label: 'Hospital Facilities', href: '/services/hospital-facilities' },
    { label: 'Lab Portal', href: 'https://portal.qih.com.pk/', external: true },
  ]

  return (
    <footer className="qih-footer">
      {/* CTA strip */}
      <div className="qih-footer-cta">
        <div className="qih-footer-cta-inner">
          <div className="qih-footer-cta-text">
            <h3>Need medical assistance?</h3>
            <p>Our team is available 24/7 for emergencies and appointments</p>
          </div>
          <div className="qih-footer-cta-actions">
            <a href="tel:+920518449100" className="qih-footer-cta-phone">
              <FiPhone size={18} />
              <div>
                <span className="qih-cta-label">Call Us Now</span>
                <span className="qih-cta-number">+92 (051) 8449100</span>
              </div>
            </a>
            <Link href="/make-appointment" className="qih-footer-cta-btn">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="qih-footer-main">
        <div className="qih-footer-inner">
          {/* Brand column */}
          <div className="qih-footer-brand">
            <Link href="/" className="qih-footer-logo">
              <Image
                src="/assets/photos/qih.png"
                alt="QIH Logo"
                width={52}
                height={52}
                style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              />
              <div>
                <div className="qih-footer-logo-name">Quaid-e-Azam</div>
                <div className="qih-footer-logo-sub">International Hospital</div>
              </div>
            </Link>
            <p className="qih-footer-tagline">
              Providing world-class healthcare to the people of Pakistan since our founding. Excellence, compassion, and innovation in every patient encounter.
            </p>
            <div className="qih-footer-accreditation">
              <span className="qih-badge">JCI Accredited</span>
              <span className="qih-badge">ISO 9001</span>
            </div>
            <div className="qih-footer-social">
              <a href="#" className="qih-social-link" aria-label="Facebook"><FiFacebook size={16} /></a>
              <a href="#" className="qih-social-link" aria-label="Instagram"><FiInstagram size={16} /></a>
              <a href="#" className="qih-social-link" aria-label="YouTube"><FiYoutube size={16} /></a>
              <a href="#" className="qih-social-link" aria-label="Twitter"><FiTwitter size={16} /></a>
            </div>
          </div>

          {/* Departments */}
          <div className="qih-footer-col">
            <h4 className="qih-footer-heading">Departments</h4>
            <ul className="qih-footer-list">
              {departments.map((dept) => (
                <li key={dept}>
                  <Link href={`/departments/${dept}`} className="qih-footer-link">
                    {dept}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/departments" className="qih-footer-link qih-footer-link--more">
                  All Departments →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="qih-footer-col">
            <h4 className="qih-footer-heading">Quick Links</h4>
            <ul className="qih-footer-list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="qih-footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="qih-footer-col">
            <h4 className="qih-footer-heading">Specialized Services</h4>
            <ul className="qih-footer-list">
              {services.map((svc) => (
                <li key={svc.href}>
                  {svc.external ? (
                    <a
                      href={svc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="qih-footer-link"
                    >
                      {svc.label} <FiExternalLink size={11} />
                    </a>
                  ) : (
                    <Link href={svc.href} className="qih-footer-link">
                      {svc.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="qih-footer-col">
            <h4 className="qih-footer-heading">Contact</h4>
            <ul className="qih-footer-contact-list">
              <li>
                <div className="qih-contact-icon"><FiPhone size={14} /></div>
                <div>
                  <a href="tel:+920518449100" className="qih-footer-link">+92 (051) 8449100</a>
                  <a href="tel:+920518449101" className="qih-footer-link">+92 (051) 8449101</a>
                </div>
              </li>
              <li>
                <div className="qih-contact-icon"><FiFax size={14} /></div>
                <div>
                  <span className="qih-footer-text">+92 (051) 2315159</span>
                </div>
              </li>
              <li>
                <div className="qih-contact-icon"><FiMail size={14} /></div>
                <div>
                  <a href="mailto:info@qih.com.pk" className="qih-footer-link">info@qih.com.pk</a>
                </div>
              </li>
              <li>
                <div className="qih-contact-icon"><FiMapPin size={14} /></div>
                <div>
                  <span className="qih-footer-text">Near Golra Morr, Peshawar Road, Islamabad, Pakistan</span>
                  <a
                    href="https://www.google.com/maps?q=Quaid-e-Azam+International+Hospital+Islamabad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="qih-footer-map-link"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </li>
            </ul>

            <div className="qih-footer-hours">
              <h5>Clinic Hours</h5>
              <div className="qih-hours-row"><span>Morning Clinic</span><span>9:00am – 5:00pm</span></div>
              <div className="qih-hours-row"><span>Evening Clinic</span><span>7:00pm – 10:00pm</span></div>
              <div className="qih-hours-row qih-hours-emergency"><span>Emergency</span><span>24 / 7</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="qih-footer-bottom">
        <div className="qih-footer-bottom-inner">
          <p className="qih-footer-copy">
            © {year} Quaid-e-Azam International Hospital. All Rights Reserved.
          </p>
          <div className="qih-footer-bottom-links">
            <Link href="/about-us/sitemap" className="qih-footer-bottom-link">Sitemap</Link>
            <Link href="/contact/feedback-complaint" className="qih-footer-bottom-link">Feedback</Link>
          </div>
        </div>
      </div>

      <style>{`
        .qih-footer {
          font-family: inherit;
        }

        /* CTA strip */
        .qih-footer-cta {
          background: #0e8219;
          padding: 28px 0;
        }
        .qih-footer-cta-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .qih-footer-cta-text h3 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }
        .qih-footer-cta-text p {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          margin: 0;
        }
        .qih-footer-cta-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .qih-footer-cta-phone {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fff;
          text-decoration: none;
          background: rgba(255,255,255,0.12);
          padding: 10px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.2);
          transition: background 0.15s;
        }
        .qih-footer-cta-phone:hover { background: rgba(255,255,255,0.22); }
        .qih-cta-label { display: block; font-size: 11px; opacity: 0.8; }
        .qih-cta-number { display: block; font-size: 16px; font-weight: 700; }
        .qih-footer-cta-btn {
          display: inline-flex;
          align-items: center;
          padding: 12px 24px;
          background: #fff;
          color: #0e8219;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          border-radius: 10px;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .qih-footer-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        /* Main footer */
        .qih-footer-main {
          background: #1a1a1a;
          padding: 56px 0 40px;
        }
        .qih-footer-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
          gap: 40px;
        }

        /* Brand */
        .qih-footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          margin-bottom: 20px;
        }
        .qih-footer-logo-name {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
        }
        .qih-footer-logo-sub {
          font-size: 11px;
          color: #0e8219;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .qih-footer-tagline {
          font-size: 13.5px;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          margin: 0 0 20px;
        }
        .qih-footer-accreditation {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .qih-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          color: rgba(255,255,255,0.7);
        }
        .qih-footer-social {
          display: flex;
          gap: 8px;
        }
        .qih-social-link {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .qih-social-link:hover { background: #0e8219; color: #fff; border-color: #0e8219; }

        /* Columns */
        .qih-footer-heading {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 16px;
        }
        .qih-footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .qih-footer-link {
          font-size: 13.5px;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.15s;
        }
        .qih-footer-link:hover { color: #fff; }
        .qih-footer-link--more { color: rgba(14,130,25,0.85); font-weight: 500; }
        .qih-footer-link--more:hover { color: #0e8219; }

        /* Contact */
        .qih-footer-contact-list {
          list-style: none;
          padding: 0;
          margin: 0 0 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .qih-footer-contact-list li {
          display: flex;
          gap: 12px;
        }
        .qih-contact-icon {
          width: 28px;
          height: 28px;
          background: rgba(255,255,255,0.08);
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.6);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .qih-footer-contact-list div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .qih-footer-text {
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          line-height: 1.5;
        }
        .qih-footer-map-link {
          font-size: 12px;
          color: rgba(14,130,25,0.85);
          text-decoration: none;
          margin-top: 4px;
          display: inline-block;
        }
        .qih-footer-map-link:hover { color: #0e8219; }

        .qih-footer-hours {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 14px;
        }
        .qih-footer-hours h5 {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin: 0 0 10px;
        }
        .qih-hours-row {
          display: flex;
          justify-content: space-between;
          font-size: 12.5px;
          color: rgba(255,255,255,0.55);
          padding: 4px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .qih-hours-row:last-child { border-bottom: none; }
        .qih-hours-emergency { color: rgba(231,76,60,0.85); font-weight: 600; }
        .qih-hours-emergency span:last-child { color: #0e8219; }

        /* Bottom bar */
        .qih-footer-bottom {
          background: #1a1a1a;
          padding: 16px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .qih-footer-bottom-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .qih-footer-copy {
          font-size: 12.5px;
          color: rgba(255,255,255,0.35);
          margin: 0;
        }
        .qih-footer-bottom-links {
          display: flex;
          gap: 20px;
        }
        .qih-footer-bottom-link {
          font-size: 12.5px;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          transition: color 0.15s;
        }
        .qih-footer-bottom-link:hover { color: rgba(255,255,255,0.7); }

        @media (max-width: 1100px) {
          .qih-footer-inner {
            grid-template-columns: 1fr 1fr 1fr;
          }
          .qih-footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 700px) {
          .qih-footer-inner {
            grid-template-columns: 1fr 1fr;
            gap: 28px;
          }
          .qih-footer-cta-inner { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .qih-footer-inner { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  )
}

export default Footer
