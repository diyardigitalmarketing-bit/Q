import type { Metadata } from 'next'
import { Heebo, Roboto, Rubik } from 'next/font/google'
import './styles/vendor/all.css'
import './styles/vendor.min.css'
import './styles/vendor.css'
import './styles/vendor/animate.compat.css'
import './styles/vendor/carousel.css'
import './styles/vendor/dental.css'
import './styles/vendor/magnific-popup.css'
import './styles/vendor/medisch.css'
import './styles/vendor/nice-select.css'
import './styles/vendor/owl.theme.default.min.css'
import './styles/vendor/style.css'
import './styles/vendor/owl.carousel.min.css'
import './styles/vendor/bootstrap.min.css'
import './styles/vendor/flaticon.css'
import Script from 'next/script'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './styles/style.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import Wrapper from '@/components/Wrapper'
import { Toaster } from 'react-hot-toast'
import { initializeReceptionist } from "@/app/lib/initializeReceptionist"

const heebo = Heebo({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
})

const roboto = Roboto({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
})

const rubik = Rubik({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Quaid-e-Azam International Hospital',
  description: 'Quaid-e-Azam International Hospital',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // ✅ Call receptionist initializer
  await initializeReceptionist()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="/assets/js/vendor/jquery-3.6.0.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/js/vendor.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/js/vendor/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/js/vendor/imagesLoaded.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/js/vendor/index.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/js/vendor/isotope.pkgd.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/js/vendor/jquery-ui.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/js/vendor/owl.carousel.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/js/vendor/owl.carousel2.thumbs.min.js"
          strategy="afterInteractive"
        />
      </head>

      <body className={`${heebo.className} ${roboto.className} ${rubik.className}`}>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        <Wrapper>{children}</Wrapper>

        <div className="backtop" id="back-to-top" data-hover="">
          <svg
            className="bi bi-chevron-up"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
            />
          </svg>
        </div>
      </body>
    </html>
  )
}
