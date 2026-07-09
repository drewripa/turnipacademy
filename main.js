// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.textContent = '☰';
    });
  });
}

// Shrink header on scroll
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.style.boxShadow = '0 2px 20px rgba(0,0,0,.10)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// Fade-in sections on scroll
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(
  '.card, .testimonial, .gallery-item, .two-col-text, .two-col-image'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Inject fade-in styles dynamically (avoids a FOUC on first load)
const style = document.createElement('style');
style.textContent = `
  .fade-in { opacity: 0; transform: translateY(20px); transition: opacity .55s ease, transform .55s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);

// ── Scrollspy ────────────────────────────────────────────────
(function () {
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)'));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(a => {
      const matches = a.getAttribute('href') === '#' + id;
      a.classList.toggle('nav-active', matches);
    });
  }

  // Use IntersectionObserver — mark whichever section is most visible
  const visible = new Map();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      visible.set(e.target.id, e.intersectionRatio);
    });
    // Pick the section with the highest visible ratio
    let best = null, bestRatio = 0;
    sections.forEach(s => {
      const r = visible.get(s.id) || 0;
      if (r > bestRatio) { bestRatio = r; best = s.id; }
    });
    if (best) setActive(best);
  }, {
    threshold: Array.from({ length: 21 }, (_, i) => i / 20),
    rootMargin: '-10% 0px -10% 0px'
  });

  sections.forEach(s => observer.observe(s));
}());

// ── Credentials modal ────────────────────────────────────────
(function () {
  const modal  = document.getElementById('credentials-modal');
  const btnOpen = document.getElementById('btn-credentials');
  const btnClose = document.getElementById('cred-close');
  if (!modal || !btnOpen) return;

  function open()  { modal.classList.add('is-open');    document.body.style.overflow = 'hidden'; btnClose.focus(); }
  function close() { modal.classList.remove('is-open'); document.body.style.overflow = ''; }

  btnOpen.addEventListener('click', open);
  btnClose.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });
}());

// ── Gallery Lightbox ─────────────────────────────────────────
(function () {
  const lb      = document.getElementById('lightbox');
  if (!lb) return;

  const lbImg   = document.getElementById('lb-img');
  const lbCount = document.getElementById('lb-counter');
  const items   = Array.from(document.querySelectorAll('.gallery-item'));
  const total   = items.length;
  let current   = 0;
  let scrollY   = 0;

  function show(index) {
    current = (index + total) % total;
    const img = items[current].querySelector('img');
    // Force animation replay
    lbImg.style.animation = 'none';
    lbImg.offsetHeight; // reflow
    lbImg.style.animation = '';
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCount.textContent = (current + 1) + ' / ' + total;
  }

  function open(index) {
    scrollY = window.scrollY;
    show(index);
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Open on click
  items.forEach((item, i) => item.addEventListener('click', () => open(i)));

  // Buttons
  document.getElementById('lb-close').addEventListener('click', close);
  document.getElementById('lb-prev').addEventListener('click', () => show(current - 1));
  document.getElementById('lb-next').addEventListener('click', () => show(current + 1));

  // Click backdrop
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'Escape')     close();
  });

  // Close on scroll
  window.addEventListener('scroll', () => {
    if (!lb.classList.contains('is-open')) return;
    if (Math.abs(window.scrollY - scrollY) > 60) close();
  }, { passive: true });
}());


