import { Metadata } from 'next'
import Footer from './footer'
import './globals.css'
import Head from './head'
import Header from './header'
import ogImage from './og-image.png'

export const metadata:Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  alternates: {
    canonical: 'https://thecodeman.net',
  },
  openGraph: {
    title: {
      default: "TheCodeMan | Master .NET Technologies",
      template: "%s | TheCodeMan"
    },
    description: "Stay updated with TheCodeMan.NET! Authored by Microsoft MVP Stefan Djokic, providing expert insights, tutorials, and news on .NET and C# technologies.",
    images: [
      {
        url: '/og-image.png',
        width: ogImage.width,
        height: ogImage.height
      }
    ],
    type: "website",
    url: "https://thecodeman.net"
  },
  title: {
    default: "TheCodeMan | Master .NET Technologies",
    template: "%s | TheCodeMan"
  } ,
  description: "Stay updated with TheCodeMan.NET! Authored by Microsoft MVP Stefan Djokic, providing expert insights, tutorials, and news on .NET and C# technologies.",
  twitter: {
    title: {
      default: "TheCodeMan | Master .NET Technologies",
      template: "%s | TheCodeMan"
    },
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description: "Stay updated with TheCodeMan.NET! Authored by Microsoft MVP Stefan Djokic, providing expert insights, tutorials, and news on .NET and C# technologies.",
    images: [
      {
        url: '/og-image.png',
        width: ogImage.width,
        height: ogImage.height
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
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
        {/* <script 
            dangerouslySetInnerHTML={{
                __html: `
                    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_2kSUiknNFrBvkvxUkoHZ48MALH7RDCkfzXITAvk6FMJ',{api_host:'https://eu.posthog.com'})
        `
            }}>

        </script> */}
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
