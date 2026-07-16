const select = document.querySelector('select[name="Paket"]');

document.querySelectorAll('[data-paket]').forEach(link => {
  link.addEventListener('click', () => {
    if (select) {
      setTimeout(() => { select.value = link.dataset.paket; }, 20);
    }
  });
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeButton = document.querySelector('.lightboxClose');

function placeholderSvg(label) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#38241c"/><stop offset="100%" stop-color="#181112"/></linearGradient></defs>
      <rect width="1200" height="900" fill="url(#g)"/>
      <rect x="70" y="70" width="1060" height="760" fill="none" stroke="#f7ead2" stroke-width="16"/>
      <text x="600" y="420" text-anchor="middle" fill="#f7ead2" font-family="Arial, sans-serif" font-size="72" font-weight="700">Platzhalter</text>
      <text x="600" y="500" text-anchor="middle" fill="#d9c7ad" font-family="Arial, sans-serif" font-size="34">${label || 'Bild'}</text>
    </svg>
  `)}`;
}

function openLightbox(src, caption) {
  lightboxImage.src = src;
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
document.querySelectorAll('.galleryItem').forEach(item => {
  item.addEventListener('click', () => {
    const caption = item.dataset.caption || '';
    const src = item.dataset.large || placeholderSvg(caption);
    openLightbox(src, caption);
  });
});
if (closeButton) closeButton.addEventListener('click', closeLightbox);
if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox(); });

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.priceCard,.galleryItem,.timeline article,.servicePanel,.inquiryPanel,.faqGrid details').forEach(el => observer.observe(el));

const mobileMenuButton = document.querySelector('.mobileMenuButton');
const mainNav = document.querySelector('.topbar nav');
if (mobileMenuButton && mainNav) {
  mobileMenuButton.addEventListener('click', () => mainNav.classList.toggle('is-open'));
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('is-open')));
}

// v23: Galerie-Klick ohne Layout-Sprung
(function(){
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  function fallbackSvg(label){
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#17110f"/><rect x="55" y="55" width="1090" height="565" fill="none" stroke="#f7ead2" stroke-width="14"/><text x="600" y="320" text-anchor="middle" fill="#f7ead2" font-family="Arial" font-size="68" font-weight="700">Platzhalter</text><text x="600" y="385" text-anchor="middle" fill="#d7c2a3" font-family="Arial" font-size="32">${label||''}</text></svg>`)}`;
  }
  document.querySelectorAll('.galleryItem').forEach(item=>{
    item.addEventListener('click', e=>{
      e.preventDefault();
      e.stopPropagation();
      const caption = item.dataset.caption || '';
      const src = item.dataset.large || item.querySelector('img')?.getAttribute('src') || fallbackSvg(caption);
      if(lightbox && lightboxImage && lightboxCaption){
        lightboxImage.src = src;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden','false');
        document.body.classList.add('lightbox-open');
      }
    });
  });
  document.querySelector('.lightboxClose')?.addEventListener('click',()=>{
    lightbox?.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
  });
})();


// v24: Lightbox robust schließen + Anfrage markieren
(function(){
  const lightbox = document.getElementById('lightbox');
  const close = document.querySelector('.lightboxClose');
  function unlockScroll(){
    document.body.classList.remove('lightbox-open');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
  function closeLightboxFully(){
    if(lightbox){
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden','true');
    }
    unlockScroll();
  }
  close?.addEventListener('click', closeLightboxFully);
  lightbox?.addEventListener('click', (e)=>{
    if(e.target === lightbox) closeLightboxFully();
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeLightboxFully();
  });

  function highlightAnfrage(){
    const box = document.querySelector('#anfrage');
    if(!box) return;
    setTimeout(()=>{
      box.classList.remove('pulseHighlight');
      void box.offsetWidth;
      box.classList.add('pulseHighlight');
    }, 380);
  }

  document.querySelectorAll('a[href="#anfrage"], [data-highlight-anfrage]').forEach(el=>{
    el.addEventListener('click', highlightAnfrage);
  });
})();


// v25: FAQ ganze Box klickbar + Anfrage erst nach Scroll markieren
(function(){
  document.querySelectorAll('.faqGrid details').forEach((details)=>{
    details.addEventListener('click', (e)=>{
      if(e.target.tagName.toLowerCase() === 'summary') return;
      e.preventDefault();
      details.open = !details.open;
    });
  });

  function highlightAnfrageDelayed(){
    const box = document.querySelector('#anfrage');
    if(!box) return;
    setTimeout(()=>{
      box.classList.remove('pulseHighlight');
      void box.offsetWidth;
      box.classList.add('pulseHighlight');
    }, 850);
  }

  document.querySelectorAll('a[href="#anfrage"], [data-highlight-anfrage]').forEach(el=>{
    el.addEventListener('click', highlightAnfrageDelayed);
  });
})();


// v26: Anfrage-Markierung kontrolliert, langsam, nur ein Durchlauf
(function(){
  function pulseInquiryOnce(){
    const box = document.querySelector('#anfrage');
    if(!box) return;
    setTimeout(()=>{
      box.classList.remove('pulseHighlight');
      void box.offsetWidth;
      box.classList.add('pulseHighlight');
      setTimeout(()=>box.classList.remove('pulseHighlight'), 2600);
    }, 950);
  }

  document.querySelectorAll('a[href="#anfrage"], [data-highlight-anfrage]').forEach(el=>{
    el.addEventListener('click', pulseInquiryOnce, {capture:true});
  });
})();


// v30: Anfrage-Puls bereinigt - nur einmal, keine alte doppelte Animation
(function(){
  function pulseOnceClean(event){
    const link = event.target.closest && event.target.closest('a[href="#anfrage"], [data-highlight-anfrage]');
    if(!link) return;

    event.stopImmediatePropagation();

    const box = document.querySelector('#anfrage');
    if(!box) return;

    setTimeout(()=>{
      box.classList.remove('pulseHighlight', 'pulseHighlightOnce');
      void box.offsetWidth;
      box.classList.add('pulseHighlightOnce');
      setTimeout(()=>box.classList.remove('pulseHighlightOnce'), 1800);
    }, 950);
  }

  document.addEventListener('click', pulseOnceClean, true);
})();


// v31: Anfrage-Animation nur einmal und ohne doppeltes altes Blinken
(function(){
  function cleanRequestGlow(e){
    const trigger = e.target.closest && e.target.closest('a[href="#anfrage"], [data-highlight-anfrage]');
    if(!trigger) return;
    e.stopImmediatePropagation();

    const box = document.querySelector('#anfrage');
    if(!box) return;

    setTimeout(()=>{
      box.classList.remove('pulseHighlight','pulseHighlightOnce','requestGlow');
      void box.offsetWidth;
      box.classList.add('requestGlow');
      setTimeout(()=>box.classList.remove('requestGlow'), 1450);
    }, 720);
  }

  document.addEventListener('click', cleanRequestGlow, true);

  document.querySelectorAll('.inlineImageTag[data-large]').forEach(el=>{
    el.addEventListener('click',()=>{
      const lightbox = document.getElementById('lightbox');
      const lightboxImage = document.getElementById('lightboxImage');
      const lightboxCaption = document.getElementById('lightboxCaption');
      if(lightbox && lightboxImage && lightboxCaption){
        lightboxImage.src = el.dataset.large;
        lightboxCaption.textContent = 'Requisiten Auswahl';
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden','false');
      }
    });
  });
})();


// Formspree AJAX Fix: kein mailto, kein E-Mail-Programm
(function(){
  const form = document.getElementById('bookingForm') || document.querySelector('form[action*="formspree"]');
  if (!form) return;

  form.setAttribute('action', 'https://formspree.io/f/mnjkpbgq');
  form.setAttribute('method', 'POST');

  const status = document.getElementById('formStatus');
  const button = form.querySelector('button[type="submit"], button:not([type]), input[type="submit"]');

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    if (status) {
      status.className = 'formStatus is-loading';
      status.textContent = 'Anfrage wird gesendet...';
    }
    if (button) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = 'Wird gesendet...';
    }

    try {
      const response = await fetch('https://formspree.io/f/mnjkpbgq', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        if (status) {
          status.className = 'formStatus is-success';
          status.textContent = '✓ Vielen Dank! Deine Anfrage wurde versendet. Ich melde mich schnellstmöglich.';
        }
        form.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        const msg = data?.errors?.[0]?.message || 'Das hat leider nicht geklappt. Bitte versuche es erneut oder schreib direkt per E-Mail.';
        if (status) {
          status.className = 'formStatus is-error';
          status.textContent = msg;
        }
      }
    } catch (err) {
      if (status) {
        status.className = 'formStatus is-error';
        status.textContent = 'Keine Verbindung möglich. Bitte versuche es erneut.';
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = button.dataset.originalText || 'Anfrage senden';
      }
    }
  }, true);
})();


// Impressum-Popup
(function(){
  const modal = document.getElementById('impressumModal');
  if (!modal) return;
  const openers = document.querySelectorAll('[data-open-impressum]');
  const closeButton = modal.querySelector('.legalModalClose');
  let lastFocused = null;

  function openModal(){
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    closeButton?.focus();
  }
  function closeModal(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    lastFocused?.focus?.();
  }

  openers.forEach(button => button.addEventListener('click', openModal));
  closeButton?.addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();
