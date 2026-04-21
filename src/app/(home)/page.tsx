import CarousalComponent from '@/components/CarousalComponent'
import MakeAppointment from '@/components/MakeAppointment'
import Image from 'next/image'
import Link from 'next/link'
import { getDepartments } from '../lib/getDepartments'
import { cookies } from 'next/headers'
import { getEvents, getNews } from '../lib/getNews'
import HeroSection from '@/components/HeroSection'
import DepartmentsGrid from '@/components/DepartmentsGrid'

interface Department {
  status: string
  message: string
  data: [
    {
      id: number
      title: string
      description: string
      image: string
      is_featured: number
    }
  ]
}

const page = async () => {
  const departments: Department = await getDepartments()

  const getMonthsFromNum = (number: string) => {
    switch (number) {
      case '01':
        return 'January'
      case '02':
        return 'February'
      case '03':
        return 'March'
      case '04':
        return 'April'
      case '05':
        return 'May'
      case '06':
        return 'June'
      case '07':
        return 'July'
      case '08':
        return 'August'
      case '09':
        return 'September'
      case '10':
        return 'October'
      case '11':
        return 'November'
      case '12':
        return 'December'
    }
  }

  const newsData = await getNews()
  const eventData = await getEvents()
  const token = (await cookies()).get('token')?.value

  function stripHtmlTags(str: string) {
    return str.replace(/<[^>]*>?/gm, '')
  }

  return (
    <div className="wrapper clearfix" id="wrapperParallax">

      {/* ✅ UPGRADED: Replaced <CarousalComponent /> with premium HeroSection */}
      <HeroSection />

      <section
        className="features-bar"
        id="featuresBar-1"
        style={{ paddingBottom: '0px' }}
      >
        <div className="bg-section">
          {' '}
          {/* <Image src="" width={500} height={500} alt="background" /> */}
        </div>
        <div className="container">
          <div className="row g-0 features-holder">
            <div className="col-12 col-lg-3">
              <div
                className="feature-panel feature-opening-hours"
                style={{ height: '333px', minHeight: '333px' }}
              >
                <Link href="/make-appointment">
                  <div className="feature-content">
                    <i className="flaticon-042-clinic"></i>
                    <h5>Make Appointment</h5>
                    <p>Get your doctor appointment in one click</p>
                    <p>
                      <span className="fas fa-phone-alt"></span> (051) 8449100
                    </p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div
                className="feature-panel feature-timetable bg-secondary"
                style={{ height: '333px', minHeight: '333px' }}
              >
                <div className="feature-content">
                  <i className="flaticon-028-book"></i>
                  <h5>Morning Clinic / Evening Clinic</h5>
                  <p>Morning Clinic is open from 9:00 am to 5:00 pm</p>
                  <p>Evening Clinic is open from 7:00 pm to 10:00 pm</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div className="feature-panel feature-opening-hours ">
                <div className="feature-content">
                  <i className="flaticon-014-uniform"></i>
                  <h5>Organ Transplants </h5>
                  <ul className="list-unstyled">
                    <li>
                      {' '}
                      <span>
                        <Link
                          style={{ color: 'inherit' }}
                          href="/services/liver-transplant"
                        >
                          Liver transplant
                        </Link>
                      </span>
                    </li>
                    <li>
                      {' '}
                      <span>
                        <Link
                          style={{ color: 'inherit' }}
                          href="/services/bone-marrow-transplant"
                        >
                          Bone marrow transplant
                        </Link>
                      </span>
                    </li>
                    <li>
                      {' '}
                      <span>
                        <Link
                          style={{ color: 'inherit' }}
                          href="/services/kidney-transplant"
                        >
                          Kidney transplant
                        </Link>
                      </span>
                    </li>
                    <li>
                      {' '}
                      <span>
                        <Link
                          style={{ color: 'inherit' }}
                          href="/services/kidney-transplant"
                        >
                          Organ Transplant 
                        </Link>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div
                className="feature-panel feature-location"
                style={{ height: '333px', minHeight: '333px' }}
              >
                <a href="https://portal.qih.com.pk/" target="_blank">
                  <div className="feature-content">
                    <i className="flaticon-042-clinic"></i>
                    <h5>Lab Reports & Radiology</h5>
                    <p>Get your lab reports in one click</p>
                    <p>
                      <span className="fas fa-phone-alt"></span> (051) 8449100
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section
        className="blog blog-grid blog-grid-3"
        id="events"
        style={{ paddingBottom: '0px' }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-6 offset-lg-3">
              <div className="heading heading-7 text-center">
                <h2 className="heading-title">Events</h2>
              </div>
            </div>
          </div>
          <div
            className="carousel owl-carousel carousel-dots"
            data-slide="3"
            data-slide-rs="2"
            data-autoplay="true"
            data-nav="false"
            data-dots="true"
            data-space="30"
            data-loop="false"
            data-speed="200"
          >
            {eventData?.events?.length ? (
              eventData.events.map((item: any) => (
                <div key={item.id}>
                  <Link href={`/about-us/events/${item.id}`} passHref>
                    <div className="blog-entry" data-hover="">
                      <div className="entry-img">
                        <div className="entry-date">
                          <div className="entry-content">
                            <span className="day">
                              {item.start_date_details?.day}
                            </span>
                            <span className="month">
                              {getMonthsFromNum(item.start_date_details?.month)}
                            </span>
                            <span className="year">
                              {item.start_date_details?.year}
                            </span>
                          </div>
                        </div>
                        <img
                          src={item.image?.url}
                          width={500}
                          height={500}
                          alt={item.title || 'Event image'}
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>

                      <div className="entry-content ">
                        <div className="entry-title">
                          <h4>{item.title.substring(0, 50)}...</h4>
                        </div>
                        <div className="entry-bio">
                          <p>
                            {stripHtmlTags(item.description).substring(0, 110)}
                            ...
                          </p>
                        </div>
                        <div className="entry-more">
                          <Link
                            href={`/about-us/events/${item.id}`}
                            className="btn btn--white btn-line btn-line-before btn-line-inversed"
                          >
                            <div className="line">
                              <span></span>
                            </div>
                            <span>read more</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p>No Events</p>
            )}
          </div>
          {eventData && eventData?.events?.length > 0 && (
            <div className="d-flex justify-content-center align-content-center">
              <Link className="btn btn--primary" href="/about-us/events">
                View all events
              </Link>
            </div>
          )}
        </div>
      </section>
      {/* EVENTS */}

      <section className="blog blog-grid blog-grid-3" id="latestNews">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-6 offset-lg-3">
              <div className="heading heading-7 text-center">
                <h2 className="heading-title">Latest news</h2>
              </div>
            </div>
          </div>
          <div
            className="carousel owl-carousel carousel-dots mb-4"
            data-slide="3"
            data-slide-rs="2"
            data-autoplay="true"
            data-nav="false"
            data-dots="true"
            data-space="30"
            data-loop="true"
            data-speed="200"
          >
            {newsData && newsData.length ? (
              newsData.map((news: any) => (
                <div key={news?.id}>
                  <div className="blog-entry" data-hover="">
                    <div className="entry-img">
                      <a href="">
                        <img
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover',
                          }}
                          src={news?.featured_media_src_url}
                          width={500}
                          height={500}
                          alt={news?.title.rendered}
                        />
                      </a>
                    </div>

                    <div className="entry-content">
                      <div className="entry-title">
                        <h4>
                          <a href="">{news?.title.rendered}</a>
                        </h4>
                      </div>
                      <div className="entry-bio">
                        <p className="card-text small text-muted">
                          {stripHtmlTags(news.excerpt.rendered).substring(
                            0,
                            80
                          )}
                          ...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No News</p>
            )}
          </div>
          {newsData && newsData.length > 0 && (
            <div className="d-flex justify-content-center align-content-center">
              <Link className="btn btn--primary" href="/about-us/news">
                View all news
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="about about-2" id="about-2">
        <div className="container">
          <div className="d-flex justify-content-center">
            <div className="ratio ratio-16x9" style={{ maxWidth: '660px' }}>
              <iframe
                src="https://www.youtube.com/embed/Gg70v5uvh-Q?autoplay=1&mute=1"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; loop"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ UPGRADED: Replaced Featured Departments carousel with premium DepartmentsGrid */}
      <DepartmentsGrid departments={departments.data || []} />

      {/* Process steps — unchanged */}
      <section className="blog blog-grid blog-grid-3" id="blog-2">
        <div className="processes">
          <div className="row g-0">
            <div className="col-12 col-md-6 col-xl-3">
              <Link href="/make-appointment">
                <div className="process-panel" data-hover="">
                  <p className="process-number">01.</p>
                  <div className="process-body">
                    <div className="process-icon">
                      {' '}
                      <i className="flaticon-023-medical-history"></i>
                    </div>
                    <div className="process-content">
                      <h5>fill our medical application</h5>
                      <p>
                        Medisch offers free or low-cost health coverage for
                        adults.
                      </p>
                      <a
                        className="btn-line btn-line-before btn-line-inversed"
                        href=""
                      >
                        <span className="line">
                          {' '}
                          <span> </span>
                        </span>
                        <span>doctors timetable</span>
                      </a>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <Link href="/make-appointment">
                <div className="process-panel" data-hover="">
                  <p className="process-number">02.</p>
                  <div className="process-body">
                    <div className="process-icon">
                      {' '}
                      <i className="flaticon-043-cardiogram"></i>
                    </div>
                    <div className="process-content">
                      <h5>Review Your Family History</h5>
                      <p>
                        Health exams help find problems with early chances which
                        helps.
                      </p>
                      <a
                        className="btn-line btn-line-before btn-line-inversed"
                        href="javascript:void(0)"
                      >
                        <span className="line">
                          {' '}
                          <span> </span>
                        </span>
                        <span>Start A Check Up</span>
                      </a>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <Link href={'/departments'}>
                <div className="process-panel" data-hover="">
                  <p className="process-number">03.</p>
                  <div className="process-body">
                    <div className="process-icon">
                      {' '}
                      <i className="flaticon-027-medical-report"></i>
                    </div>
                    <div className="process-content">
                      <h5>Choose Between Our Programs </h5>
                      <p>
                        We have protocols to protect our patients to provide
                        necessary care.
                      </p>
                      <a
                        className="btn-line btn-line-before btn-line-inversed"
                        href="javascript:void(0)"
                      >
                        <span className="line">
                          {' '}
                          <span> </span>
                        </span>
                        <span>explore programs</span>
                      </a>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <Link href={'/departments'}>
                <div className="process-panel" data-hover="">
                  <p className="process-number">04.</p>
                  <div className="process-body">
                    <div className="process-icon">
                      {' '}
                      <i className=".flaticon-021-medical-1"></i>
                    </div>
                    <div className="process-content">
                      <h5>Introduce To Qualified Doctors </h5>
                      <p>
                        Our administration and support staff all have
                        exceptional people skills
                      </p>
                      <a
                        className="btn-line btn-line-before btn-line-inversed"
                        href=""
                      >
                        <span className="line">
                          {' '}
                          <span> </span>
                        </span>
                        <span>meet our doctors</span>
                      </a>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default page
