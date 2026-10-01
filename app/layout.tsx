import { Metadata } from 'next'
import Footer from './footer'
import './globals.css'
import './tcm-premium.css'
import Head from './head'
import Header from './header'
import ogImage from './og-image.webp'
import Script from "next/script";
import { THIRD_PARTY_STUBS, THIRD_PARTY_LOADER } from "@/components/thirdParty";

export const metadata: Metadata = {
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
        url: '/og-image.webp',
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
  },
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
        url: '/og-image.webp',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/space-grotesk-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Analytics queues only (no network). The real GA4 / GTM / Meta Pixel scripts are
            loaded on first user interaction by THIRD_PARTY_LOADER - see components/thirdParty.ts */}
        <script dangerouslySetInnerHTML={{ __html: THIRD_PARTY_STUBS }} />
        {/* <script 
            dangerouslySetInnerHTML={{
                __html: `
                    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_2kSUiknNFrBvkvxUkoHZ48MALH7RDCkfzXITAvk6FMJ',{api_host:'https://eu.posthog.com'})
        `
            }}>

        </script> */}

        <Script
          id="ld-json-person"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://thecodeman.net/#/schema/person/stefan-djokic",
              name: "Stefan Djokic",
              url: "https://thecodeman.net",
              jobTitle: "Microsoft MVP and .NET Engineer",
              worksFor: {
                "@type": "Organization",
                name: "TheCodeMan.net",
                url: "https://thecodeman.net"
              },
              sameAs: [
                "https://www.linkedin.com/in/djokic-stefan",
                "https://x.com/TheCodeMan__",
                "https://www.youtube.com/@thecodeman_"
              ]
            }),
          }}
        />

        <Script
          id="ld-json-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://thecodeman.net/#/schema/org",
              name: "TheCodeMan.net",
              url: "https://thecodeman.net",
              logo: "https://thecodeman.net/og-image.webp",
              sameAs: [
                "https://www.linkedin.com/in/djokic-stefan",
                "https://x.com/TheCodeMan__",
                "https://www.youtube.com/@thecodeman_"
              ]
            }),
          }}
        />

        <Script
          id="ld-json-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://thecodeman.net/#website",
              name: "TheCodeMan.NET",
              url: "https://thecodeman.net",
              description: "Practical .NET tutorials, C# tips, architecture patterns, and software engineering best practices by Microsoft MVP Stefan Djokic.",
              publisher: {
                "@id": "https://thecodeman.net/#/schema/org"
              },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://thecodeman.net/blog?category={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NBBCS5FT"
          height="0" width="0" className='display-none visible-hidden'></iframe></noscript>
        <noscript><img height="1" width="1" style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1321122855270380&ev=PageView&noscript=1" alt="" /></noscript>
        <Header></Header>
        <main id="main-content">{children}</main>
        <Footer></Footer>
        <script dangerouslySetInnerHTML={{ __html: THIRD_PARTY_LOADER }} />
      </body>
    </html>
  )
}
