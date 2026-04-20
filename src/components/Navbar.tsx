'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Logout from './Logout'
import { getDepartments } from '@/app/lib/getDepartments'
import { FiPhone, FiChevronDown, FiMenu, FiX, FiGrid, FiUser, FiCalendar, FiSearch } from 'react-icons/fi'

interface User {
  id: number
  name: string
  email: string
  roles: [{ id: number; name: string }]
}

interface Department {
  id: number
  title: string
  description: string
  image: string
  user_id: number
  created_at: Date
}

const Navbar = ({ token, user }: { token: string; user: User | null }) => {
  const currentPath = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    getDepartments().then((res) => setDepartments(res.data || []))

    const handleScroll = () => setScrolled(window.scrollY > 20)
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null)
        setActiveSubmenu(null)
      }
    }
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getDashboardUrl = () => {
    if (!user || !user.roles.length) return '#'
    const roleName = user.roles[0].name.toLowerCase()
    if (roleName === 'admin') return '/admin'
    if (roleName === 'consultant') return '/consultant-dashboard'
    if (roleName === 'patient') return '/patient-dashboard'
    if (roleName === 'receptionist') return '/Receptionist'
    return '#'
  }

  const isActive = (path: string) => currentPath.startsWith(path)

  const navItems = [
    {
      id: 'about',
      label: 'About Us',
      children: [
        { label: 'About QIH', href: '/about-us' },
        { label: 'Company Profile', href: '/about-us/company-profile' },
        { label: 'Message from CEO', href: '/about-us/message-from-ceo' },
        { label: 'Our Partners', href: '/about-us/our-partners' },
        { label: 'News', href: '/about-us/news' },
        { label: 'Events', href: '/about-us/events' },
        { label: 'Highlights', href: '/about-us/highlights' },
      ],
    },
    {
      id: 'departments',
      label: 'Departments',
      href: '/departments',
      megamenu: true,
    },
    {
      id: 'services',
      label: 'Services',
      href: '/services',
      children: [
        { label: 'All Services', href: '/services' },
        { label: 'Emergency', href: '/services/Emergency' },
        { label: 'Cardiology', href: '/services/Cardiology' },
        { label: 'Neurosurgery', href: '/services/Neurosurgery' },
        { label: 'Liver Transplant', href: '/services/liver-transplant' },
        { label: 'Bone Marrow Transplant', href: '/services/bone-marrow-transplant' },
        { label: 'Critical Care', href: '/services/critical-care' },
        { label: 'Teleconsultation', href: '/services/teleconsultation-services' },
      ],
    },
    {
      id: 'consultants',
      label: 'Consultants',
      href: '/consultant',
    },
    {
      id: 'careers',
      label: 'Careers',
      href: '/career',
    },
    {
      id: 'contact',
      label: 'Contact',
      href: '/contact',
    },
  ]

  return (
    <>
      {/* Top bar */}
      <div className="qih-topbar">
        <div className="qih-topbar-inner">
          <div className="qih-topbar-left">
            <a href="tel:+920518449100" className="qih-topbar-link">
              <FiPhone size={13} />
              <span>+92 (051) 8449100</span>
            </a>
            <span className="qih-topbar-divider" />
            <span className="qih-topbar-hours">Mon – Sat: 9am – 10pm &nbsp;|&nbsp; Emergency: 24/7</span>
          </div>
          <div className="qih-topbar-right">
            <Link href="/about-us/news" className="qih-topbar-link">News</Link>
            <Link href="/gallery" className="qih-topbar-link">Gallery</Link>
            <a href="https://portal.qih.com.pk/" target="_blank" rel="noopener noreferrer" className="qih-topbar-link qih-topbar-portal">
              Lab Portal ↗
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header className={`qih-navbar${scrolled ? ' qih-navbar--scrolled' : ''}`} ref={menuRef}>
        <div className="qih-navbar-inner">
          {/* Logo */}
          <Link href="/" className="qih-logo" onClick={() => setMobileOpen(false)}>
            <Image
              src="/assets/photos/qih.png"
              alt="QIH Logo"
              width={48}
              height={48}
              style={{ objectFit: 'contain' }}
            />
            <div className="qih-logo-text">
              <span className="qih-logo-name">Quaid-e-Azam</span>
              <span className="qih-logo-sub">International Hospital</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="qih-nav-desktop">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`qih-nav-item${activeMenu === item.id ? ' qih-nav-item--open' : ''}${item.href && isActive(item.href) ? ' qih-nav-item--active' : ''}`}
                onMouseEnter={() => item.children || item.megamenu ? setActiveMenu(item.id) : undefined}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {item.href && !item.children && !item.megamenu ? (
                  <Link href={item.href} className="qih-nav-link">
                    {item.label}
                  </Link>
                ) : (
                  <button className="qih-nav-link" onClick={() => item.href && router.push(item.href)}>
                    {item.label}
                    {(item.children || item.megamenu) && <FiChevronDown size={13} className="qih-nav-chevron" />}
                  </button>
                )}

                {/* Regular dropdown */}
                {item.children && activeMenu === item.id && (
                  <div className="qih-dropdown">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="qih-dropdown-item" onClick={() => setActiveMenu(null)}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Mega menu for departments */}
                {item.megamenu && activeMenu === item.id && (
                  <div className="qih-megamenu">
                    <div className="qih-megamenu-header">
                      <span>All Departments</span>
                      <Link href="/departments" className="qih-megamenu-viewall" onClick={() => setActiveMenu(null)}>View all →</Link>
                    </div>
                    <div className="qih-megamenu-grid">
                      {departments.slice(0, 16).map((dept) => (
                        <Link
                          key={dept.id}
                          href={`/departments/${dept.title.replace(/\s+/g, '-')}`}
                          className="qih-megamenu-item"
                          onClick={() => setActiveMenu(null)}
                        >
                          {dept.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="qih-nav-actions">
            <button className="qih-search-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <FiSearch size={18} />
            </button>

            {token && user ? (
              <div
                className={`qih-nav-item${activeMenu === 'user' ? ' qih-nav-item--open' : ''}`}
                onMouseEnter={() => setActiveMenu('user')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className="qih-user-btn">
                  <div className="qih-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <span className="qih-user-name">{user.name.split(' ')[0]}</span>
                  <FiChevronDown size={13} />
                </button>
                {activeMenu === 'user' && (
                  <div className="qih-dropdown qih-dropdown--right">
                    <Link href={getDashboardUrl()} className="qih-dropdown-item" onClick={() => setActiveMenu(null)}>
                      <FiGrid size={14} /> Dashboard
                    </Link>
                    <div className="qih-dropdown-divider" />
                    <div className="qih-dropdown-item qih-dropdown-item--danger">
                      <Logout />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="qih-login-btn">
                <FiUser size={15} />
                <span>Sign In</span>
              </Link>
            )}

            <Link href="/make-appointment" className="qih-appt-btn">
              <FiCalendar size={15} />
              <span>Book Appointment</span>
            </Link>

            {/* Mobile hamburger */}
            <button className="qih-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="qih-search-bar">
            <div className="qih-search-inner">
              <FiSearch size={18} className="qih-search-icon" />
              <input
                type="text"
                placeholder="Search departments, doctors, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    router.push(`/departments?search=${encodeURIComponent(searchQuery)}`)
                    setSearchOpen(false)
                    setSearchQuery('')
                  }
                  if (e.key === 'Escape') setSearchOpen(false)
                }}
                autoFocus
                className="qih-search-input"
              />
              <button onClick={() => setSearchOpen(false)} className="qih-search-close">
                <FiX size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="qih-mobile-menu">
            {navItems.map((item) => (
              <div key={item.id} className="qih-mobile-item">
                {item.href && !item.children && !item.megamenu ? (
                  <Link
                    href={item.href}
                    className="qih-mobile-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <button
                      className="qih-mobile-link qih-mobile-link--parent"
                      onClick={() => setActiveSubmenu(activeSubmenu === item.id ? null : item.id)}
                    >
                      {item.label}
                      <FiChevronDown
                        size={14}
                        style={{ transform: activeSubmenu === item.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                      />
                    </button>
                    {activeSubmenu === item.id && (
                      <div className="qih-mobile-submenu">
                        {item.megamenu ? (
                          <>
                            <Link href="/departments" className="qih-mobile-sublink" onClick={() => setMobileOpen(false)}>
                              View All Departments
                            </Link>
                            {departments.slice(0, 10).map((dept) => (
                              <Link
                                key={dept.id}
                                href={`/departments/${dept.title.replace(/\s+/g, '-')}`}
                                className="qih-mobile-sublink"
                                onClick={() => setMobileOpen(false)}
                              >
                                {dept.title}
                              </Link>
                            ))}
                          </>
                        ) : (
                          item.children?.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="qih-mobile-sublink"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            <div className="qih-mobile-footer">
              {token && user ? (
                <>
                  <Link href={getDashboardUrl()} className="qih-mobile-link" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <Logout />
                </>
              ) : (
                <Link href="/auth/login" className="qih-mobile-link" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
              )}
              <Link href="/make-appointment" className="qih-appt-btn qih-appt-btn--full" onClick={() => setMobileOpen(false)}>
                <FiCalendar size={15} />
                Book Appointment
              </Link>
            </div>
          </div>
        )}
      </header>

      <style>{`
        .qih-topbar {
          background: #1b4d1b;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 0;
          font-size: 12px;
          color: rgba(255,255,255,0.75);
        }
        .qih-topbar-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 8px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .qih-topbar-left, .qih-topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .qih-topbar-link {
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: color 0.2s;
          font-size: 12px;
        }
        .qih-topbar-link:hover { color: #fff; }
        .qih-topbar-divider { width: 1px; height: 14px; background: rgba(255,255,255,0.2); }
        .qih-topbar-hours { color: rgba(255,255,255,0.6); }
        .qih-topbar-portal {
          background: rgba(255,255,255,0.1);
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: 500;
        }
        .qih-topbar-portal:hover { background: rgba(255,255,255,0.2); color: #fff; }

        .qih-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #fff;
          border-bottom: 1px solid #e8ecf0;
          transition: box-shadow 0.3s, background 0.3s;
        }
        .qih-navbar--scrolled {
          box-shadow: 0 4px 24px rgba(14,130,25,0.10);
        }
        .qih-navbar-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          height: 72px;
        }

        .qih-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
          margin-right: 8px;
        }
        .qih-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }
        .qih-logo-name {
          font-size: 15px;
          font-weight: 700;
          color: #1b4d1b;
          letter-spacing: -0.2px;
        }
        .qih-logo-sub {
          font-size: 10.5px;
          color: #0e8219;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .qih-nav-desktop {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
        }
        .qih-nav-item {
          position: relative;
        }
        .qih-nav-link {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 500;
          color: #1a2a3a;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
          font-family: inherit;
        }
        .qih-nav-link:hover { background: #f0f6ff; color: #1b4d1b; }
        .qih-nav-item--active .qih-nav-link { color: #1b4d1b; }
        .qih-nav-item--active .qih-nav-link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 14px;
          right: 14px;
          height: 2px;
          background: #0e8219;
          border-radius: 1px;
        }
        .qih-nav-chevron { transition: transform 0.2s; opacity: 0.5; }
        .qih-nav-item--open .qih-nav-chevron { transform: rotate(180deg); opacity: 1; }

        .qih-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background: #fff;
          border: 1px solid #e8ecf0;
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(14,130,25,0.12);
          padding: 6px;
          min-width: 200px;
          z-index: 1001;
          animation: qih-fade-in 0.15s ease;
        }
        .qih-dropdown--right { left: auto; right: 0; }
        .qih-dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          font-size: 13.5px;
          color: #2c3e50;
          text-decoration: none;
          border-radius: 8px;
          transition: background 0.12s, color 0.12s;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }
        .qih-dropdown-item:hover { background: #f0f6ff; color: #1b4d1b; }
        .qih-dropdown-item--danger { padding: 0; }
        .qih-dropdown-item--danger > * { padding: 9px 14px; width: 100%; }
        .qih-dropdown-divider { height: 1px; background: #f0f0f0; margin: 4px 8px; }

        .qih-megamenu {
          position: absolute;
          top: calc(100% + 8px);
          left: -120px;
          background: #fff;
          border: 1px solid #e8ecf0;
          border-radius: 14px;
          box-shadow: 0 16px 48px rgba(14,130,25,0.14);
          padding: 16px;
          width: 480px;
          z-index: 1001;
          animation: qih-fade-in 0.15s ease;
        }
        .qih-megamenu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 10px;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 12px;
          font-size: 12px;
          font-weight: 600;
          color: #6b7c8d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .qih-megamenu-viewall {
          color: #1b4d1b;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
        }
        .qih-megamenu-viewall:hover { text-decoration: underline; }
        .qih-megamenu-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        .qih-megamenu-item {
          padding: 8px 10px;
          font-size: 13px;
          color: #2c3e50;
          text-decoration: none;
          border-radius: 7px;
          transition: background 0.12s, color 0.12s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .qih-megamenu-item:hover { background: #f0f6ff; color: #1b4d1b; }

        .qih-nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }
        .qih-search-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #5a6a7a;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.15s, color 0.15s;
          display: flex;
          align-items: center;
        }
        .qih-search-btn:hover { background: #f0f6ff; color: #1b4d1b; }

        .qih-user-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: 1px solid #e8ecf0;
          border-radius: 50px;
          padding: 6px 12px 6px 6px;
          cursor: pointer;
          color: #1a2a3a;
          font-size: 13.5px;
          font-weight: 500;
          transition: border-color 0.15s, background 0.15s;
          font-family: inherit;
        }
        .qih-user-btn:hover { border-color: #1b4d1b; background: #f8fbff; }
        .qih-avatar {
          width: 28px; height: 28px;
          background: #1b4d1b;
          color: #fff;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600;
        }
        .qih-user-name { max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .qih-login-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          font-size: 13.5px;
          font-weight: 500;
          color: #1b4d1b;
          text-decoration: none;
          border: 1px solid #1b4d1b;
          border-radius: 50px;
          transition: background 0.15s, color 0.15s;
        }
        .qih-login-btn:hover { background: #1b4d1b; color: #fff; }

        .qih-appt-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          font-size: 13.5px;
          font-weight: 600;
          color: #fff;
          text-decoration: none;
          background: #0e8219;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .qih-appt-btn:hover { background: #0a6b14; transform: translateY(-1px); }
        .qih-appt-btn--full { width: 100%; justify-content: center; border-radius: 10px; margin-top: 8px; }

        .qih-search-bar {
          border-top: 1px solid #f0f0f0;
          background: #fafbfc;
          animation: qih-slide-down 0.2s ease;
        }
        .qih-search-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .qih-search-icon { color: #8a9ab0; flex-shrink: 0; }
        .qih-search-input {
          flex: 1;
          border: none;
          background: none;
          font-size: 15px;
          color: #1a2a3a;
          outline: none;
          font-family: inherit;
        }
        .qih-search-input::placeholder { color: #aab5c0; }
        .qih-search-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #8a9ab0;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .qih-search-close:hover { color: #1a2a3a; }

        .qih-mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #1a2a3a;
          padding: 6px;
          border-radius: 8px;
        }

        .qih-mobile-menu {
          display: none;
          background: #fff;
          border-top: 1px solid #f0f0f0;
          max-height: calc(100vh - 72px);
          overflow-y: auto;
          animation: qih-slide-down 0.2s ease;
        }
        .qih-mobile-item { border-bottom: 1px solid #f5f5f5; }
        .qih-mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 14px 24px;
          font-size: 15px;
          font-weight: 500;
          color: #1a2a3a;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
        }
        .qih-mobile-link:hover { color: #1b4d1b; background: #f8fbff; }
        .qih-mobile-submenu { background: #f8fbfc; padding: 4px 0; }
        .qih-mobile-sublink {
          display: block;
          padding: 10px 36px;
          font-size: 14px;
          color: #3a4a5a;
          text-decoration: none;
          transition: color 0.15s;
        }
        .qih-mobile-sublink:hover { color: #1b4d1b; }
        .qih-mobile-footer {
          padding: 16px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #f8fbfc;
        }

        @keyframes qih-fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes qih-slide-down {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1100px) {
          .qih-nav-desktop { display: none; }
          .qih-login-btn { display: none; }
          .qih-appt-btn:not(.qih-appt-btn--full) { display: none; }
          .qih-mobile-toggle { display: flex; }
          .qih-mobile-menu { display: block; }
        }
        @media (max-width: 600px) {
          .qih-topbar { display: none; }
          .qih-logo-text { display: none; }
          .qih-navbar-inner { padding: 0 16px; }
        }
      `}</style>
    </>
  )
}

export default Navbar
