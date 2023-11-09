import SponsorsNewsletter from '@/components/sponsorsTestimonials';
import config from '@/config.json'

const Sponsorship = () => {
    return (
      <>
       <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
    <div className="container">
      <div className="pb-5">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 heading-section mt-5">
          <h2 className="mb-4 text-align-center">Stefan's .NET Newsletter <br/>
          <span className="text-yellow"><b>Sponsorship</b></span>
          </h2>
        </div>
      </div>
      <div className="d-flex">
        <div className="col-sm-12 col-md-12 col-lg-12 pb-5">
          <div className="row pb-3">
            <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
              <h1>Audience</h1>
              <br/>
              <h5>• Reach: <span  className="text-yellow">{config.NewsletterSubCount}</span></h5>
              <h5>• Growth: <span  className="text-yellow">{config.Growth}</span></h5>
              <h5>• Number of issues so far: <span  className="text-yellow">{config.IssuesCount}</span></h5>
              <h5>• Average Open Rate: <span  className="text-yellow">{config.OpenRate}</span></h5>
              <h5>• Audience: <span  className="text-yellow">{config.Audience} </span></h5>
              <br/>
              <h5>Reserve your sponsorship by sending me an email: <a href="mailto: stefan@stefandjokic.tech">{config.Email}</a></h5>
             {/* <h5><b>Currently booked out 2 weeks</b></h5> */}
              <h5>Previous Sponsors: <b>{config.PreviousSponsors}</b></h5>
            </div>
            <SponsorsNewsletter />
          </div>
          <div className="pb-3 mt-5">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <h1>Sponsorship opportunities</h1>
              <div className="row">
              <div className="col-md-4 mt-5 mb-5">
                <ul className="price">
                  <li className="header"><b>Shared Sponsorship</b></li>
                  <li className="grey" >{config.SharedPrice}</li>
                  <li>1 of maximum 3 sponsors per issue</li>
                  <li>Sponsorship will remain live forever on website</li>
                  <li>2 links per sponsorship</li>
                  <li>2 sentences maximum</li>
                  <li className="grey" >
                    <h5>Reserve here</h5>
                   <h5>  <a href="mailto: stefan@stefandjokic.tech">{config.Email}</a></h5>
                  </li>
                </ul>
              </div>
              <div className="col-md-4  mb-5">
                <ul className="price">
                  <li className="header"><b>Exclusive Sponsorship</b></li>
                  <li className="grey">{config.ExclusivePrice}</li>
                  <li>Only your sponsorship per issue</li>
                  <li>Sponsorship will remain live forever on website</li>
                  <li>Logo included</li>
                  <li>2 links per sponsorship</li>
                  <li>2 sentences maximum</li>
                  <li className="grey" >
                    <h5>Reserve here</h5>
                   <h5><a href="mailto: stefan@stefandjokic.tech">{config.Email}</a></h5>
                  </li>
                </ul>
              </div>
              <div className="col-md-4  mb-5">
               <p> Available once a month only</p>
                <ul className="price">
                  <li className="header"><b>Sponsored Content</b></li>
                  <li className="grey">{config.SponsoredPrice}</li>
                  <li>**Article or tutorial related to .NET or C#</li>
                  <li>Sponsorship will remain live forever on website</li>
                  <li>Logo included</li>
                  <li className="grey">
                    <h5>Reserve here</h5>
                   <h5>  <a href="mailto: stefan@stefandjokic.tech">{config.Email}</a></h5>
                  </li>
                </ul>
               <p> *Article or tutorial related to C#/.NET</p> The entire newsletter issue is written on the topic of the sponsor's product/service so that it fits into the C#/.NET content.
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

      </>
    )
  }
  
  export default Sponsorship;