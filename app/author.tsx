import './globals.css'
import config from '@/config.json'

export default function Author() {
  return (
    <section className="ftco-section contact-section mb-3">
      <div className="container">
        <div className="row justify-content-center pb-3">
          <div className="col-md-12 text-center mb-5">
            <h3><b>About the Author</b></h3>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <h5 className='text-center'>
              <b> Stefan Djokic</b> is a Microsoft MVP and senior .NET engineer with extensive experience designing enterprise-grade systems and teaching
              architectural best practices.
            </h5>
          </div>
        </div>
      </div>
    </section>
  )
}