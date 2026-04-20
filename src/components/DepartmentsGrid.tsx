import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight } from 'react-icons/fi'

interface Department {
  id: number
  title: string
  description: string
  image: string
  is_featured: number
}

interface Props {
  departments: Department[]
}

const DepartmentsGrid = ({ departments }: Props) => {
  const featured = departments.filter((d) => d.is_featured === 1).slice(0, 6)
  const display = featured.length >= 6 ? featured : departments.slice(0, 6)

  const stripHtml = (str: string) =>
    str ? str.replace(/<[^>]*>?/gm, '').substring(0, 100) + '…' : ''

  return (
    <section className="qih-depts">
      <div className="qih-depts-inner">
        <div className="qih-section-header">
          <div className="qih-section-tag">Our Departments</div>
          <h2 className="qih-section-title">Comprehensive Medical Specialties</h2>
          <p className="qih-section-sub">
            World-class care across more than 40 specialties, led by Pakistan's most experienced consultants.
          </p>
        </div>

        <div className="qih-depts-grid">
          {display.map((dept, i) => (
            <Link
              key={dept.id}
              href={`/departments/${dept.title.replace(/\s+/g, '-')}`}
              className={`qih-dept-card${i === 0 ? ' qih-dept-card--large' : ''}`}
            >
              <div className="qih-dept-card-img">
                <Image
                  src={dept.image && dept.image.startsWith('/') ? dept.image : `/assets/images/departments/${dept.image || '1.jpg'}`}
                  alt={dept.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className="qih-dept-card-overlay" />
              </div>
              <div className="qih-dept-card-content">
                <h3 className="qih-dept-card-title">{dept.title}</h3>
                {i === 0 && (
                  <p className="qih-dept-card-desc">{stripHtml(dept.description)}</p>
                )}
                <span className="qih-dept-card-link">
                  Learn More <FiArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="qih-depts-footer">
          <Link href="/departments" className="qih-depts-all-btn">
            View All Departments
            <FiArrowRight size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        .qih-depts {
          padding: 80px 0;
          background: #f8fafd;
        }
        .qih-depts-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .qih-section-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 48px;
        }
        .qih-section-tag {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #0e8219;
          margin-bottom: 12px;
        }
        .qih-section-title {
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.5px;
          line-height: 1.2;
          margin: 0 0 16px;
        }
        .qih-section-sub {
          font-size: 15.5px;
          color: #6b7c8d;
          line-height: 1.7;
          margin: 0;
        }

        .qih-depts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: auto auto;
          gap: 16px;
        }

        .qih-dept-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          display: block;
          text-decoration: none;
          background: #1a2a3a;
          aspect-ratio: 4/3;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .qih-dept-card--large {
          grid-column: 1 / 2;
          grid-row: 1 / 3;
          aspect-ratio: auto;
        }
        .qih-dept-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(10,30,50,0.18);
        }

        .qih-dept-card-img {
          position: absolute;
          inset: 0;
          transition: transform 0.4s ease;
        }
        .qih-dept-card:hover .qih-dept-card-img { transform: scale(1.04); }

        .qih-dept-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(6, 19, 31, 0.92) 0%,
            rgba(6, 19, 31, 0.3) 60%,
            transparent 100%
          );
        }

        .qih-dept-card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px;
          z-index: 2;
        }
        .qih-dept-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px;
          line-height: 1.3;
        }
        .qih-dept-card--large .qih-dept-card-title { font-size: 26px; }

        .qih-dept-card-desc {
          font-size: 13.5px;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          margin: 0 0 14px;
        }
        .qih-dept-card-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #0e8219;
          transition: gap 0.15s;
        }
        .qih-dept-card:hover .qih-dept-card-link { gap: 10px; }

        .qih-depts-footer {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }
        .qih-depts-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          background: #1b4d1b;
          color: #fff;
          font-size: 14.5px;
          font-weight: 600;
          text-decoration: none;
          border-radius: 50px;
          transition: background 0.15s, transform 0.15s;
        }
        .qih-depts-all-btn:hover { background: #0d4f8a; transform: translateY(-2px); }

        @media (max-width: 900px) {
          .qih-depts-grid { grid-template-columns: repeat(2, 1fr); }
          .qih-dept-card--large { grid-column: 1 / -1; grid-row: auto; aspect-ratio: 16/7; }
        }
        @media (max-width: 600px) {
          .qih-depts-grid { grid-template-columns: 1fr; }
          .qih-dept-card--large { aspect-ratio: 4/3; }
          .qih-depts { padding: 48px 0; }
        }
      `}</style>
    </section>
  )
}

export default DepartmentsGrid
