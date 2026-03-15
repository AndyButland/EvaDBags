/* ===== NAV SCROLL BEHAVIOR ===== */
const nav = document.querySelector('.nav');
const handleNavScroll = () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 50);
};
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ===== MOBILE MENU ===== */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
hamburger.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('open');
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

/* ===== FADE-IN ON SCROLL ===== */
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
fadeEls.forEach(el => fadeObserver.observe(el));

/* ===== LIGHTBOX / CAROUSEL ===== */
const lightbox = document.querySelector('.lightbox');
const lbMain = lightbox.querySelector('.lightbox__main img');
const lbName = lightbox.querySelector('.lightbox__name');
const lbDesc = lightbox.querySelector('.lightbox__desc');
const lbThumbs = lightbox.querySelector('.lightbox__thumbs');
let currentBag = null;
let currentSlide = 0;
let triggeringCard = null;

// Bag data is embedded as data attributes on the cards
function getBagData(card) {
  const imagesAttr = card.getAttribute('data-images');
  if (!imagesAttr) return null;
  return {
    name: card.querySelector('.bag-card__name').textContent,
    desc: card.querySelector('.bag-card__desc').textContent,
    images: JSON.parse(imagesAttr),
    thumbs: JSON.parse(card.getAttribute('data-thumbs'))
  };
}

function showSlide(index) {
  const bag = currentBag;
  if (!bag) return;
  currentSlide = index;
  lbMain.src = bag.images[index];
  lbMain.alt = bag.name + ' — image ' + (index + 1) + ' of ' + bag.images.length;
  lbName.textContent = bag.name;
  lbDesc.textContent = bag.desc;
  lbThumbs.querySelectorAll('.lightbox__thumb').forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });
}

function openLightbox(card) {
  const bag = getBagData(card);
  if (!bag) return;
  currentBag = bag;
  currentSlide = 0;
  triggeringCard = card;

  lbThumbs.innerHTML = '';
  bag.thumbs.forEach((thumb, i) => {
    const div = document.createElement('div');
    div.className = 'lightbox__thumb' + (i === 0 ? ' active' : '');
    div.innerHTML = '<img src="' + thumb + '" alt="' + bag.name + ' — view ' + (i + 1) + '">';
    div.addEventListener('click', () => showSlide(i));
    lbThumbs.appendChild(div);
  });

  showSlide(0);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lightbox__close').focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  currentBag = null;
  if (triggeringCard) triggeringCard.focus();
  triggeringCard = null;
}

// Focus trap inside lightbox
lightbox.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const focusable = lightbox.querySelectorAll('button, [tabindex="0"]');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
lightbox.querySelector('.lightbox__arrow--prev').addEventListener('click', () => {
  if (!currentBag) return;
  showSlide((currentSlide - 1 + currentBag.images.length) % currentBag.images.length);
});
lightbox.querySelector('.lightbox__arrow--next').addEventListener('click', () => {
  if (!currentBag) return;
  showSlide((currentSlide + 1) % currentBag.images.length);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox__arrow--prev').click();
  if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox__arrow--next').click();
});

// Attach click and keyboard to bag cards
document.querySelectorAll('.bag-card:not(.bag-card--placeholder)').forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('click', () => openLightbox(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(card);
    }
  });
});

/* ===== LANGUAGE TOGGLE - preserve scroll hash ===== */
document.querySelectorAll('.lang-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    const hash = window.location.hash;
    window.location.href = href + hash;
  });
});
