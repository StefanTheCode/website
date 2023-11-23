import SponsorsNewsletter from '@/components/sponsorsTestimonials';
import config from '@/config.json'

const BlackFriday = () => {
  return (
    <>
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          <div className='row pt-5'>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 heading-section mt-5 pt-5 ">
              <h2 className="mb-4 text-align-center">Black Friday <br />
                <span className="text-yellow"><b>Sponsorship</b></span>
              </h2>
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6  mt-5 text-center">
              <img src='/images/discount.png' alt='Linkedin logo' width='50%' />
            </div>
          </div>
          <div className='row pb-5 '>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <h1 className='sponsorship-name text-center'>Sponsorship opportunities</h1>
              <div className="row">
                <div className="col-md-4 mt-5 mb-5">
                  <ul className="price">
                    <li className="header"><b>LinkedIn Sponsored Post</b></li>
                    <li className="grey padding-5 text-success"><span className='old-price'>$500.00</span>$300.00</li>
                    <li className='padding-5'><h5><b className='text-yellow'>What you'll get?</b></h5></li>
                    <li className='padding-5'>Complete post about your company, product or a service</li>
                    <li className='padding-5'>1+ URLs to your website</li>
                    <li className='padding-5'>Your image, carousel or video</li>
                    <li className='padding-5'><h5><b className='text-yellow'>Stats</b></h5></li>

                    <li className='padding-5'>Average post reach: ~50k people</li>
                    <li className='padding-5'>Number of followers: ~60k</li>
                    <li className='padding-5'>Growth: ~1500 - 3000 followers weekly</li>
                    <li className='padding-5'>Profile reach last month: ~ 2.5m views</li>
                    <li className='padding-5'>Average weekly profile reach: ~ 450k - 650k</li>
                    <li className='padding-5'><h5><b className='text-yellow'>Examples</b></h5></li>
                    <li className='padding-5'><a href='https://www.linkedin.com/posts/djokic-stefan_i-was-a-full-stack-developer-what-did-activity-7089598495766044673-xg8M/?utm_source=share&utm_medium=member_desktop' target='_blank'>Sponsored post - 41k reach</a></li>
                    <li className='padding-5'><a href='https://www.linkedin.com/posts/djokic-stefan_dotnet-softwareengineering-workflowautomation-activity-7127638947991552000-NI9K?utm_source=share&utm_medium=member_desktop' target='_blank'>Sponsored post - 70k reach</a></li>
                    <li className="grey">
                      <h5>Reserve here</h5>
                      <h5 className='mail-address'><a href="mailto:stefan@stefandjokic.tech">{config.Email}</a></h5>
                    </li>
                  </ul>
                </div>
                <div className="col-md-4 mt-5 mb-5">
                  <ul className="price">
                    <li className="header"><b>Newsletter Ad</b></li>
                    <li className="grey padding-5 text-success"><span className='old-price'>$300.00</span>$200.00</li>
                    <li className='padding-5'><h5><b className='text-yellow'>What you'll get?</b></h5></li>
                    <li className='padding-5'>1 of maximum 2 sponsors per issue</li>
                    <li className='padding-5'>Sponsorship will remain live forever on website</li>
                    <li className='padding-5'>2 links per sponsorship</li>
                    <li className='padding-5'>2 sentences maximum</li>
                    <li className='padding-5'><h5><b className='text-yellow'>Stats</b></h5></li>
                    <li className='padding-5'>Reach: 9400+ subscribers</li>
                    <li className='padding-5'>Growth: ~1200+ subscribers monthly</li>
                    <li className='padding-5'>Average Open Rate: 46%</li>
                    <li className='padding-5'>Ad Clicks Average: 100 - 300</li>
                    <li className='padding-5'><h5><b className='text-yellow'>Examples</b></h5></li>
                    <li className='padding-5'><a href='https://stefandjokic.tech/posts/improve-ef-core-performance-with-compiled-queries' target='_blank'>#42 Stefan's Newsletter</a></li>
                    <li className='padding-5'><a href='https://stefandjokic.tech/posts/background-tasks-how-to-use-them' target='_blank'>#38 Stefan's Newsletter</a></li>
                    <li className="grey">
                      <h5>Reserve here</h5>
                      <h5 className='mail-address'><a href="mailto:stefan@stefandjokic.tech">{config.Email}</a></h5>
                    </li>
                  </ul>
                </div>
                <div className="col-md-4 mt-5 mb-5">
                  <ul className="price">
                    <li className="header"><b>Twitter Sponsored Post</b></li>
                    <li className="grey padding-5 text-success"><span className='old-price'>$250.00</span>$100.00</li>
                    <li className='padding-5'><h5><b className='text-yellow'>What you'll get?</b></h5></li>
                    <li className='padding-5'>Complete post about your company, product or a service</li>
                    <li className='padding-5'>1+ URLs to your website</li>
                    <li className='padding-5'>Your image, document or video</li>
                    <li className='padding-5'><h5><b className='text-yellow'>Stats</b></h5></li>
                    <li className='padding-5'>Average post reach: ~10k people</li>
                    <li className='padding-5'>Number of followers: ~3k</li>
                    <li className='padding-5'>Growth: 200 - 400 followers weekly</li>
                    <li className='padding-5'>Profile reach last month: ~ 320k views</li>
                    <li className='padding-5'><h5><b className='text-yellow'>Examples</b></h5></li>
                    <li className='padding-5'><a href='https://twitter.com/TheCodeMan__/status/1727082995075391525' target='_blank'>Sponsored post - 12k reach</a></li>
                    <li className="grey">
                      <h5>Reserve here</h5>
                      <h5 className='mail-address'><a href="mailto:stefan@stefandjokic.tech">{config.Email}</a></h5>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex">
            <div className="col-sm-12 col-md-12 col-lg-12 pb-5">
              <div className="row pb-3">
                <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
                  <h2 className='text-center'>Previous Sponsors</h2>
                  <h2 className='pt-5'><b className='text-yellow'>{config.PreviousSponsors}</b></h2>
                  <br />
                  <h5>Reserve your sponsorship by sending me an email: <a href="mailto: stefan@stefandjokic.tech">{config.Email}</a></h5>
                </div>
                <SponsorsNewsletter />
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default BlackFriday;