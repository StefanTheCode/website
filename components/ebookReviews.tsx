import Script from 'next/script';

const EbookReviews = () => (
  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
    <div className="senja-embed" data-id="06be163c-2292-4644-92c1-cc03e8b5dc7a" data-lazyload="false"></div>
    <Script 
      src="https://static.senja.io/dist/platform.js" 
      async 
      type="text/javascript">
    </Script>
  </div>
);

export default EbookReviews;
