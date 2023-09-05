import Footer from './footer'
import './globals.css'
import Head from './head'
import Header from './header'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head />
      <body>
        <Header></Header>
        {children}
        <Footer></Footer>
        </body>
    </html>
  )
}
