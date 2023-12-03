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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2MN7C3CEX2"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', 'G-2MN7C3CEX2');
        `
          }}>
        </script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-NBBCS5FT');
        `
          }}>
        </script>
      </head>
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
