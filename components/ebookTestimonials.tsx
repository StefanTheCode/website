import Script from 'next/script';

const EbookNewsletter = () => (
  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-2 mb-5">
    <div className="senja-embed" data-id="10c7a30b-b873-48f1-9ccd-a5ffee794e34" data-lazyload="false"></div>
    <Script 
      src="https://static.senja.io/dist/platform.js" 
      async 
      type="text/javascript">
    </Script>
  </div>
);

export default EbookNewsletter;
