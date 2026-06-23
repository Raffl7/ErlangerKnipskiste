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
