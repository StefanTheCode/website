import Script from 'next/script';

const SponsorsNewsletter = () => (
  <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5">
    <div className="senja-embed" data-id="c6f7c58a-753f-49e6-b422-82d7d4063ef3" data-lazyload="false"></div>
    <Script 
      src="https://static.senja.io/dist/platform.js" 
      async 
      type="text/javascript">
    </Script>
  </div>
);

export default SponsorsNewsletter;
