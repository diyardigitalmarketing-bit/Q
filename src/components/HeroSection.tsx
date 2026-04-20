'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiPhone, FiCalendar, FiActivity, FiAward, FiUsers, FiHeart } from 'react-icons/fi'

const slides = [
  {
    id: 1,
    image: '/assets/photos/0-main.jpg',
    tag: 'Advanced Cardiac Care',
    headline: 'Your Heart\nDeserves the Best',
    sub: 'State-of-the-art Cardiac ICU, Cath Lab, and cardiac surgery with Pakistan\'s leading cardiologists.',
    cta: { label: 'Cardiology Services', href: '/services/Cardiology' },
  },
  {
    id: 2,
    image: '/assets/photos/1-lobby-pharmacy.jpg',
    tag: 'Organ Transplant Centre',
    headline: 'Pioneering\nTransplant Surgery',
    sub: 'Pakistan\'s premier liver, kidney, and bone marrow transplant program with international outcomes.',
    cta: { label: 'Transplant Services', href: '/services/liver-transplant' },
  },
  {
    id: 3,
    image: '/assets/photos/2-lab-emergency.jpg',
    tag: '24/7 Emergency Care',
    headline: 'Emergency Care\nWhen It Matters Most',
    sub: 'Fully equipped trauma centre and emergency department staffed around the clock by specialists.',
    cta: { label: 'Emergency Services', href: '/services/Emergency' },
  },
  {
    id: 4,
    image: '/assets/photos/4-icu-nicu.jpg',
    tag: 'Neonatal & Paediatric Care',
    headline: 'Protecting\nLittle Lives',
    sub: 'Dedicated NICU and PICU with advanced life-support and compassionate round-the-clock nursing care.',
    cta: { label: 'Paediatric Services', href: '/services/Pediatrics' },
  },
]

const stats = [
  { icon: <FiUsers />, number: '500+', label: 'Specialist Consultants' },
  { icon: <FiActivity />, number: '1000+', label: 'Beds Capacity' },
  { icon: <FiAward />, number: '25+', label: 'Years of Excellence' },
  { icon: <FiHeart />, number: '200+', label: 'Successful Transplants' },
]

const HeroSection = () => {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setCurrent((c) => (c + 1) % slides.length)
        setAnimating(false)
      }, 400)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (idx: number) => {
    if (idx === current) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
    }, 300)
  }

  const slide = slides[current]

  return (
    <>
      {/* Hero */}
      <section className="qih-hero">
        {/* Background image */}
        <div className={`qih-hero-bg${animating ? ' qih-hero-bg--fade' : ''}`}>
          <Image
            src={slide.image}
            alt={slide.headline}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          <div className="qih-hero-overlay" />
        </div>

        {/* Content */}
        <div className="qih-hero-content">
          <div className={`qih-hero-text${animating ? ' qih-hero-text--fade' : ''}`}>
            <div className="qih-hero-tag">
              <span className="qih-hero-tag-dot" />
              {slide.tag}
            </div>
            <h1 className="qih-hero-headline">
              {slide.headline.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </h1>
            <p className="qih-hero-sub">{slide.sub}</p>
            <div className="qih-hero-actions">
              <Link href={slide.cta.href} className="qih-hero-btn-primary">
                {slide.cta.label}
                <FiArrowRight size={16} />
              </Link>
              <Link href="/make-appointment" className="qih-hero-btn-secondary">
                <FiCalendar size={16} />
                Book Appointment
              </Link>
            </div>
          </div>

          {/* Quick contact card */}
          <div className="qih-hero-card">
            <div className="qih-hero-card-header">
              <FiPhone size={16} />
              <span>Emergency & Appointments</span>
            </div>
            <a href="tel:+920518449100" className="qih-hero-card-number">
              +92 (051) 8449100
            </a>
            <div className="qih-hero-card-availability">
              <span className="qih-hero-dot-green" />
              Emergency line available 24/7
            </div>
            <div className="qih-hero-card-divider" />
            <div className="qih-hero-card-hours">
              <div>
                <span>Morning Clinic</span>
                <strong>9am – 5pm</strong>
              </div>
              <div>
                <span>Evening Clinic</span>
                <strong>7pm – 10pm</strong>
              </div>
            </div>
            <Link href="/make-appointment" className="qih-hero-card-btn">
              Book Online Now
            </Link>
          </div>
        </div>

        {/* Slide controls */}
        <div className="qih-hero-controls">
          <div className="qih-hero-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`qih-hero-dot${i === current ? ' qih-hero-dot--active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="qih-hero-counter">
            <span className="qih-hero-counter-current">{String(current + 1).padStart(2, '0')}</span>
            <span className="qih-hero-counter-sep">/</span>
            <span className="qih-hero-counter-total">{String(slides.length).padStart(2, '0')}</span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="qih-stats-bar">
        <div className="qih-stats-inner">
          {stats.map((stat, i) => (
            <div key={i} className="qih-stat">
              <div className="qih-stat-icon">{stat.icon}</div>
              <div>
                <div className="qih-stat-number">{stat.number}</div>
                <div className="qih-stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .qih-hero {
          position: relative;
          height: 85vh;
          min-height: 580px;
          max-height: 820px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .qih-hero-bg {
          position: absolute;
          inset: 0;
          transition: opacity 0.4s ease;
        }
        .qih-hero-bg--fade { opacity: 0; }

        .qih-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            rgba(6, 19, 31, 0.88) 0%,
            rgba(6, 19, 31, 0.65) 55%,
            rgba(6, 19, 31, 0.2) 100%
          );
        }

        .qih-hero-content {
          position: relative;
          z-index: 2;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }

        .qih-hero-text {
          max-width: 580px;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .qih-hero-text--fade {
          opacity: 0;
          transform: translateY(12px);
        }

        .qih-hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-bottom: 20px;
        }
        .qih-hero-tag-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0e8219;
          animation: qih-pulse 2s infinite;
        }

        .qih-hero-headline {
          font-size: clamp(36px, 5vw, 58px);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -1px;
          margin: 0 0 20px;
        }

        .qih-hero-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
          max-width: 460px;
          margin: 0 0 32px;
        }

        .qih-hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .qih-hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 26px;
          background: #0e8219;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          border-radius: 50px;
          transition: background 0.15s, transform 0.15s;
        }
        .qih-hero-btn-primary:hover { background: #0a6b14; transform: translateY(-2px); }

        .qih-hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 26px;
          background: rgba(255,255,255,0.1);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.2);
          transition: background 0.15s;
          backdrop-filter: blur(4px);
        }
        .qih-hero-btn-secondary:hover { background: rgba(255,255,255,0.2); }

        /* Contact card */
        .qih-hero-card {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 28px;
          width: 280px;
          flex-shrink: 0;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }
        .qih-hero-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #6b7c8d;
          margin-bottom: 10px;
        }
        .qih-hero-card-number {
          display: block;
          font-size: 22px;
          font-weight: 800;
          color: #1b4d1b;
          text-decoration: none;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .qih-hero-card-number:hover { color: #0e8219; }
        .qih-hero-card-availability {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #0e8219;
          font-weight: 500;
          margin-bottom: 16px;
        }
        .qih-hero-dot-green {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #0e8219;
          animation: qih-pulse 2s infinite;
        }
        .qih-hero-card-divider {
          height: 1px;
          background: #f0f0f0;
          margin-bottom: 16px;
        }
        .qih-hero-card-hours {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .qih-hero-card-hours > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .qih-hero-card-hours span {
          font-size: 12.5px;
          color: #8a9ab0;
        }
        .qih-hero-card-hours strong {
          font-size: 13px;
          color: #1a2a3a;
          font-weight: 600;
        }
        .qih-hero-card-btn {
          display: block;
          text-align: center;
          padding: 12px;
          background: #1b4d1b;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          border-radius: 12px;
          transition: background 0.15s, transform 0.15s;
        }
        .qih-hero-card-btn:hover { background: #0d4f8a; transform: translateY(-1px); }

        /* Controls */
        .qih-hero-controls {
          position: absolute;
          bottom: 32px;
          left: 0;
          right: 0;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 3;
        }
        .qih-hero-dots {
          display: flex;
          gap: 8px;
        }
        .qih-hero-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          padding: 0;
        }
        .qih-hero-dot--active {
          background: #fff;
          transform: scale(1.3);
        }
        .qih-hero-counter {
          display: flex;
          align-items: baseline;
          gap: 4px;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
        }
        .qih-hero-counter-current {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }
        .qih-hero-counter-sep { color: rgba(255,255,255,0.3); }

        /* Stats bar */
        .qih-stats-bar {
          background: #1b4d1b;
          padding: 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .qih-stats-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .qih-stat {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          border-right: 1px solid rgba(255,255,255,0.1);
          transition: background 0.15s;
        }
        .qih-stat:last-child { border-right: none; }
        .qih-stat:hover { background: rgba(255,255,255,0.05); }
        .qih-stat-icon {
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 20px;
          flex-shrink: 0;
        }
        .qih-stat-number {
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
          line-height: 1;
          margin-bottom: 4px;
        }
        .qih-stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.55);
          font-weight: 500;
        }

        @keyframes qih-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }

        @media (max-width: 1100px) {
          .qih-hero-card { display: none; }
          .qih-stats-inner { grid-template-columns: repeat(2, 1fr); }
          .qih-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .qih-stat:nth-child(odd) { border-right: 1px solid rgba(255,255,255,0.1); }
          .qih-stat:nth-last-child(-n+2) { border-bottom: none; }
        }
        @media (max-width: 600px) {
          .qih-hero { height: 70vh; }
          .qih-hero-headline { font-size: 32px; }
          .qih-stats-inner { grid-template-columns: repeat(2, 1fr); }
          .qih-hero-controls { bottom: 16px; }
        }
      `}</style>
    </>
  )
}

export default HeroSection
