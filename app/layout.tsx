import Footer from './footer'
import './globals.css'
import Head from './dddd'
import Header from './header'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NBBCS5FT"
	height="0" width="0" className='display-none visible-hidden'></iframe></noscript>
        <Header></Header>
        {children}
        <Footer></Footer>
        </body>
    </html>
  )
}
