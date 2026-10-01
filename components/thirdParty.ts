/**
 * Third-party script loading (performance).
 *
 * Analytics, the EmailOctopus forms/popup and Lemon Squeezy used to
 * load during page load and cost ~1.5 s of main-thread time (reCAPTCHA alone ~700 KB).
 * Now:
 *   1. THIRD_PARTY_STUBS runs inline in <head>: it only creates the gtag / dataLayer /
 *      fbq queues (no network). Every gtag()/fbq() call made during load is queued,
 *      including page-level events such as fbq('track','ViewContent').
 *   2. THIRD_PARTY_LOADER runs inline at the end of <body>: on the visitor's first
 *      interaction (mouse move, wheel, touch, key, click) it loads GA4, GTM, Meta Pixel,
 *      the EmailOctopus popup, Lemon Squeezy (only on pages with a checkout button) and
 *      activates every <script type="text/lazy" data-src="..."> placeholder in place
 *      (EmailOctopus inline forms). The queued events are then sent.
 *
 * To lazy-load any embed, render it as:
 *   <script type="text/lazy" data-src="https://..." data-form="..."></script>
 * and a third-party iframe as <iframe data-lazy-src="https://..." title="..."></iframe>.
 */

export const GA_ID = 'G-2MN7C3CEX2';
export const GTM_ID = 'GTM-NBBCS5FT';
export const META_PIXEL_ID = '1321122855270380';
export const EO_POPUP_FORM_ID = '68cdd53c-a55f-11ed-a80d-c50d697f08bd';

/** Build the inert placeholder markup for an EmailOctopus inline form. */
export const eoFormScript = (formId: string) =>
  `<script type="text/lazy" data-src="https://eomail4.com/form/${formId}.js" data-form="${formId}"></script>`;

export const THIRD_PARTY_STUBS = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${GA_ID}');
dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
!function(f){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window);
fbq('init','${META_PIXEL_ID}');fbq('track','PageView');
`;

export const THIRD_PARTY_LOADER = `
(function(){
  /* No 'scroll'/'focusin': those also fire for programmatic scrolls / autofocus, not real users. */
  var done=false, EV=['pointerdown','pointermove','mousemove','touchstart','keydown','wheel'];
  function add(src,attrs,parent){var s=document.createElement('script');s.src=src;s.async=true;
    if(attrs){for(var k in attrs){s.setAttribute(k,attrs[k]);}}(parent||document.body).appendChild(s);return s;}
  function swapPlaceholder(wrap){
    /* An EmailOctopus form rendered next to a visual placeholder: keep typed email, drop placeholder. */
    if(!wrap)return;var ph=wrap.querySelector('.eo-placeholder');if(!ph)return;
    var mo=new MutationObserver(function(){var real=wrap.querySelector('.inline-container');if(!real)return;
      var typed=ph.querySelector('input');var target=real.querySelector('input[type=email]');
      if(typed&&target&&typed.value){target.value=typed.value;}
      var hadFocus=typed&&document.activeElement===typed;ph.remove();if(hadFocus&&target){target.focus();}mo.disconnect();});
    mo.observe(wrap,{childList:true,subtree:true});
  }
  function activate(root){
    (root||document).querySelectorAll('script[type="text/lazy"]').forEach(function(old){
      var s=document.createElement('script');
      for(var i=0;i<old.attributes.length;i++){var a=old.attributes[i];if(a.name!=='type'&&a.name!=='data-src'){s.setAttribute(a.name,a.value);}}
      s.setAttribute('data-lazy-loaded','');s.src=old.getAttribute('data-src');s.async=true;
      swapPlaceholder(old.closest('[data-eo-wrap]'));
      old.parentNode.replaceChild(s,old);
    });
    (root||document).querySelectorAll('iframe[data-lazy-src]').forEach(function(f){
      f.setAttribute('src',f.getAttribute('data-lazy-src'));f.removeAttribute('data-lazy-src');
    });
  }
  var lemonStarted=false;
  function lemon(){
    /* Load lemon.js at most once (guard stops a MutationObserver -> append -> observer loop). */
    if(lemonStarted||window.LemonSqueezy||!document.querySelector('.lemonsqueezy-button'))return;
    lemonStarted=true;
    add('https://app.lemonsqueezy.com/js/lemon.js').onload=function(){
      try{if(window.createLemonSqueezy){window.createLemonSqueezy();}
        window.LemonSqueezy&&window.LemonSqueezy.Setup({eventHandler:function(e){
          if(e&&e.event==='Checkout.Success'&&window.fbq){fbq('track','Purchase',{value:32.99,currency:'USD'});}}});}catch(e){}
    };
  }
  function run(){
    if(done)return;done=true;
    EV.forEach(function(e){window.removeEventListener(e,run,{passive:true,capture:true});});
    try{add('https://www.googletagmanager.com/gtag/js?id=${GA_ID}',null,document.head);}catch(e){}
    try{add('https://www.googletagmanager.com/gtm.js?id=${GTM_ID}',null,document.head);}catch(e){}
    try{add('https://connect.facebook.net/en_US/fbevents.js',null,document.head);}catch(e){}
    try{activate(document);}catch(e){}
    try{if(!document.querySelector('[data-no-eo-popup]')){add('https://eomail4.com/form/${EO_POPUP_FORM_ID}.js',{'data-form':'${EO_POPUP_FORM_ID}'});}}catch(e){}
    try{lemon();}catch(e){}
    /* Embeds rendered later by client components get activated as they appear. */
    /* Debounced, and only for nodes we actually care about - never for the scripts we add ourselves. */
    try{var pending=false;new MutationObserver(function(ms){
        if(pending)return;
        for(var i=0;i<ms.length;i++){var n=ms[i].addedNodes;for(var j=0;j<n.length;j++){var el=n[j];
          if(el.nodeType!==1||el.tagName==='SCRIPT'||el.tagName==='LINK'||el.tagName==='STYLE')continue;
          if(el.matches('script[type="text/lazy"],iframe[data-lazy-src],.lemonsqueezy-button')||el.querySelector('script[type="text/lazy"],iframe[data-lazy-src],.lemonsqueezy-button')){
            pending=true;setTimeout(function(){pending=false;try{activate(document);lemon();}catch(e){}},50);return;}}}
      }).observe(document.body,{childList:true,subtree:true});}catch(e){}
    window.__tcm3pLoaded=true;
    try{window.dispatchEvent(new Event('tcm:3p-loaded'));}catch(e){}
  }
  EV.forEach(function(e){window.addEventListener(e,run,{passive:true,capture:true});});
})();
`;
