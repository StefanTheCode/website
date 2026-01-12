import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://thecodeman.net/about-me"),
  title: "About Me",
  description: "Hi Im Stefan.",
  openGraph: {
    title: "About Me",
    type: "website",
    url: "https://thecodeman.net/about-me",
    description: "Hi Im Stefan.",
  },
  twitter: {
    title: "About Me",
    card: "summary_large_image",
    site: "@TheCodeMan__",
    creator: "@TheCodeMan__",
    description:
      "Hi Im Stefan.",
  },
};

export default function Page() {
  return (
    <>
      {/* FIRST FULL SCREEN SECTION */}
      <section
        className="ftco-about ftco-section d-flex align-items-center"
        style={{
          backgroundColor:
            "linear-gradient(90deg, rgb(108 23 143), rgb(33 8 44))",
          minHeight: "100vh",
          paddingTop: "120px",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            {/* LEFT TEXT */}
            <div className="col-12 col-md-6 text-white mb-5 mb-md-0">
              <h1 className="mb-4 text-yellow">Hi, I’m Stefan 👋</h1>
              <p className="lead mb-4">
                I am a senior software engineer with years of industry
                experience. I help a large number of developers to become better
                in their daily work through the content I share on social
                networks, blog and newsletter.
              </p>
              <p className="mb-4 text-yellow">
                <strong>
                  "Keep it simple and focus on what matters. Don't let yourself
                  be overwhelmed."
                </strong>{" "}
                <span style={{ color: '#fff' }}>- Confucius</span>
              </p>
              <p className="mb-4">
                My goal is to convey knowledge to people in such a way -{" "}
                <strong className="text-yellow">simple</strong>.
              </p>
            </div>

            {/* RIGHT IMAGE */}
            <div className="col-12 col-md-6 text-center">
              <Image
                src="/images/stefan-djokic.png"
                alt="Erci profile image"
                width={380}
                height={380}
                className="img-fluid rounded"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECOND FULL SCREEN SECTION */}
      <section
        className="ftco-section d-flex align-items-center"
        style={{ backgroundColor: "#facc15", minHeight: "100vh" }}
      >
        <div className="container text-center">
          <h2 className="mb-4 text-font-2rem margin-top-minus-10" style={{ color: "#000" }}>
            Let’s stay connected
          </h2>

          <p className="mb-2" style={{ color: "#000", fontSize: "18px" }}>
            Follow me on social networks or join my community
          </p>

          {/* SOCIAL LINKS */}
            <section className="ftco-section contact-section ftco-no-pb" id="contact-section">
                    <div className="container">
                      <div className="row d-flex text-center contact-info mb-5">
                      <div className='col-md-2'></div>
                        <div className='col-md-8'>
                          <div className='row'>
                          <div className="col-md-2 d-flex">
                          <a href="https://www.skool.com/thecodeman" target="_blank" rel="noopener">
                            <Image src={'/images/icons/skool-icon.webp'} className='social-icon' alt={'Skool Community'} width={0} height={0} sizes="100vw" style={{ width: '30%', height: 'auto' }} />
                          </a>
                        </div>
                        <div className="col-md-2 d-flex">
                          <a href="https://www.youtube.com/@thecodeman_" target="_blank" rel="noopener">
                            <Image src={'/images/icons/youtube-icon.png'} className='social-icon' alt={'YouTube Channel'} width={0} height={0} sizes="100vw" style={{ width: '30%', height: 'auto' }} />
                          </a>
                        </div>
                        <div className="col-md-2 d-flex">
                          <a href="https://www.linkedin.com/in/djokic-stefan/" target="_blank" rel="noopener">
                            <Image src={'/images/icons/linkedin-icon.png'} className='social-icon' alt={'Linkedin'} width={0} height={0} sizes="100vw" style={{ width: '30%', height: 'auto' }} />
                          </a>
                        </div>
                        <div className="col-md-2 d-flex ">
                          <a href="https://twitter.com/TheCodeMan__" target="_blank" rel="noopener">
                            <Image src={'/images/icons/twitter-icon.png'} className='social-icon' alt={'Twitter (X)'} width={0} height={0} sizes="100vw" style={{ width: '30%', height: 'auto' }} />
                          </a>
                        </div>
                        <div className="col-md-2 d-flex ">
                          <a href="https://github.com/StefanTheCode" target="_blank" rel="noopener">
                            <Image src={'/images/icons/github-icon.png'} className='social-icon' alt={'Github'} width={0} height={0} sizes="100vw" style={{ width: '30%', height: 'auto' }} />
                          </a>
                        </div>
                        <div className="col-md-2 d-flex">
                          <a href="https://medium.com/@thecodeman" target="_blank" rel="noopener">
                            <Image src={'/images/icons/medium-icon.png'} className='social-icon' alt={'Medium'} width={0} height={0} sizes="100vw" style={{ width: '30%', height: 'auto' }} />
                          </a>
                        </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </section>

          {/* JOIN COMMUNITY */}
          <div className="row justify-content-center">
            <div className="col-12 col-md-8">
              <div
                className="p-5"
                style={{
                  backgroundColor: "#5c2a7d",
                  borderRadius: "12px",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                {/* Text Above Form */}
                <h3 className="text-white" style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>
                  {`Become a Better Backend Engineer`}
                </h3>
                <p style={{ fontSize: "16px", margin: 0 }}>
                  {`Join 10,000+ engineers who are improving their skills every Tuesday morning`}
                </p>

                {/* EOMail Form Embed safely within a wrapping div */}
                <div className="col-xs-4 col-sm-12 col-md-10 col-lg-6 col-xl-8 text-center">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<script async src='https://eomail4.com/form/861505f8-b3f8-11ef-896f-474a313dbc14.js' data-form='861505f8-b3f8-11ef-896f-474a313dbc14'></script>`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
         <br/><br/>        
        </div>
      </section>
    </>
  );
}
