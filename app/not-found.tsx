import Image from 'next/image'
import styles from './page.module.css'
import config from '@/config.json'
import Subscribe from './subscribe'
import getPostMetadata from '@/components/getPostMetadata'
import MyComponent from '@/components/newsletterTestimonials'
import { Metadata } from 'next'


export default function NotFound() {
  return (
      <section className="text-center">
        <div className="row d-md-flex no-gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 slider-text padding-top-10per" >
              <p className="header-text">404 - Not found page </p>
            </div>
          </div>
      </section>
  )
}
