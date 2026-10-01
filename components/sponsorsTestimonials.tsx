import TestimonialWall from './TestimonialWall';

/**
 * Sponsor testimonials: the "sponsors" wall from the testimonials app.
 * Until that wall has approved testimonials, the previous Senja widget is shown instead,
 * so the section never goes empty. Once the wall has entries, the next build switches over.
 */
const SenjaSponsors = () => (
  <>
    <div className="senja-embed" data-id="c6f7c58a-753f-49e6-b422-82d7d4063ef3" data-lazyload="false"></div>
    <div dangerouslySetInnerHTML={{ __html: '<script type="text/lazy" data-src="https://static.senja.io/dist/platform.js"></script>' }} />
  </>
);

const SponsorsNewsletter = () => (
  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
    <TestimonialWall slug="sponsors" fallback={<SenjaSponsors />} />
  </div>
);

export default SponsorsNewsletter;
