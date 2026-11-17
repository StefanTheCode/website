/**
 * Third-party script loading (performance).
 *
 * Analytics, the EmailOctopus forms/popup and Lemon Squeezy used to
 * load during page load and cost ~1.5 s of main-thread time (reCAPTCHA alone ~700 KB).
 * Now:
 *   1. THIRD_PARTY_STUBS runs inline in <head>: it only creates the gtag / dataLayer /
 *      fbq queues (no network). Every gtag()/fbq() call made during load is queued,
 *      including page-level events such as fbq('track','ViewContent').
 *   Meta Pixel needs consent in EU/EEA/UK time zones: THIRD_PARTY_LOADER shows a small consent bar
 *   there and loads the pixel only after "Accept" (choice kept in localStorage 'tcm_consent').
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
/** Business-owned pixel "TheCodeMan.net" (portfolio 276926579851399), used by the Meta ad campaigns.
 *  The old pixel above belongs to a personal ad account the business ad account can't use. Both get every event. */
export const META_ADS_PIXEL_ID = '1176475301997530';
export const EO_POPUP_FORM_ID = '68cdd53c-a55f-11ed-a80d-c50d697f08bd';

/** Build the inert placeholder markup for an EmailOctopus inline form. */
export const eoFormScript = (formId: string) =>
  `<script type="text/lazy" data-src="https://eomail4.com/form/${formId}.js" data-form="${formId}"></script>`;

export const THIRD_PARTY_STUBS = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${GA_ID}');
dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
/* Meta Pixel consent: EU/EEA/UK time zones (or unknown) must accept first. 'na' = not needed, 'ask' | 'yes' | 'no'. */
window.__tcmConsent=(function(){var tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch(e){}
  if(tz&&!/^(Europe|Atlantic\\/(Canary|Madeira|Azores|Faroe|Reykjavik))/.test(tz))return 'na';
  var c=null;try{c=localStorage.getItem('tcm_consent');}catch(e){}return c==='yes'||c==='no'?c:'ask';})();
window.__tcmPixelOk=function(){return window.__tcmConsent==='na'||window.__tcmConsent==='yes';};
!function(f){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window);
fbq('init','${META_PIXEL_ID}');fbq('init','${META_ADS_PIXEL_ID}');fbq('track','PageView');
/* Meta conversion events for paid traffic (Nov 2026):
   - InitiateCheckout: click on a "start free trial / join" link to the AI for Developers Skool group.
     Same-tab clicks wait until the pixel has loaded (max ~0.9 s) so the event isn't lost on navigation.
   - Lead: submit of an EmailOctopus inline form with a valid email (once per page view). */
(function(){
  var JOIN=['skool.com/ai-for-developers/about','skool.com/ai-for-dotnet-developers/about'];
  function isJoin(a){var c=a.getAttribute('data-cta')||'',h=a.href||'';return c.indexOf('ai-community')===0||JOIN.some(function(j){return h.indexOf(j)>-1;});}
  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a||!isJoin(a))return;
    try{fbq('track','InitiateCheckout',{content_name:'ai-for-developers',content_category:'community-trial',cta:a.getAttribute('data-cta')||'link'});}catch(_){}
    if(!window.__tcmPixelOk()||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank')return;
    e.preventDefault();var href=a.href,gone=false,t0=Date.now();
    function go(){if(gone)return;gone=true;location.href=href;}
    (function wait(){if(window.fbq&&window.fbq.callMethod){setTimeout(go,250);}else if(Date.now()-t0>900){go();}else{setTimeout(wait,60);}})();
  },true);
  var leadSent=false;
  document.addEventListener('submit',function(e){
    var f=e.target;if(leadSent||!f||!f.closest||!f.closest('[data-eo-wrap],.inline-container'))return;
    var em=f.querySelector('input[type=email]');if(!em||!em.value||(em.checkValidity&&!em.checkValidity()))return;
    leadSent=true;try{fbq('track','Lead',{content_name:location.pathname});}catch(_){}
  },true);
})();
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
  var pixelStarted=false;
  function loadPixel(){if(pixelStarted)return;pixelStarted=true;add('https://connect.facebook.net/en_US/fbevents.js',null,document.head);}
  /* Consent bar for EU/EEA/UK visitors. Queued fbq events are sent only after "Accept". */
  function consentBar(){
    if(window.__tcmConsent!=='ask'||document.getElementById('tcm-consent'))return;
    var b=document.createElement('div');b.id='tcm-consent';b.setAttribute('role','region');b.setAttribute('aria-label','Cookie consent');
    b.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;max-width:560px;margin:0 auto;background:#241530;color:#D5CCDB;border:1px solid rgba(255,255,255,.14);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.45);padding:12px 14px;display:flex;gap:10px 14px;align-items:center;justify-content:space-between;flex-wrap:wrap;font:500 14px/1.4 Manrope,system-ui,sans-serif';
    var btn='font:700 14px Manrope,system-ui,sans-serif;border-radius:999px;padding:8px 16px;cursor:pointer;';
    b.innerHTML='<span>We use cookies to measure our ads. <a href="/privacy" style="color:#F3B73F;text-decoration:underline">Privacy</a></span>'+
      '<span style="display:flex;gap:8px"><button type="button" data-c="no" style="'+btn+'background:transparent;color:#D5CCDB;border:1px solid rgba(255,255,255,.25)">Decline</button>'+
      '<button type="button" data-c="yes" style="'+btn+'background:#F3B73F;color:#1B0E25;border:1px solid #F3B73F">Accept</button></span>';
    b.addEventListener('click',function(e){var v=e.target&&e.target.getAttribute&&e.target.getAttribute('data-c');if(!v)return;
      try{localStorage.setItem('tcm_consent',v);}catch(_){}window.__tcmConsent=v;b.remove();if(v==='yes'&&done)loadPixel();});
    document.body.appendChild(b);
  }
  try{consentBar();}catch(e){}
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
    try{if(window.__tcmPixelOk())loadPixel();}catch(e){}
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
