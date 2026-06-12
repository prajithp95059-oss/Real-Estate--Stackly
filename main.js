/* ============================================================
   STACKLY — MAIN JS · GSAP + Interactions
   ============================================================ */

/* ── NAVBAR SCROLL ───────────────────────────────────────── */
const navbar = document.querySelector('.navbar');
const backTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
    backTop?.classList.add('show');
  } else {
    navbar?.classList.remove('scrolled');
    backTop?.classList.remove('show');
  }
});

backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── HAMBURGER ───────────────────────────────────────────── */
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
  document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
});

mobileMenu?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── COUNTER ANIMATION ───────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target || el.textContent, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ── GSAP ANIMATIONS ─────────────────────────────────────── */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: use IntersectionObserver for reveals
    initFallbackReveal();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .from('.hero-badge',    { opacity:0, y:30, duration:0.6, ease:'power3.out' })
    .from('.hero-title',    { opacity:0, y:50, duration:0.9, ease:'power3.out' }, '-=0.3')
    .from('.hero-subtitle', { opacity:0, y:30, duration:0.7, ease:'power3.out' }, '-=0.5')
    .from('.hero-actions',  { opacity:0, y:20, duration:0.6, ease:'power3.out' }, '-=0.4')
    .from('.hero-stats',    { opacity:0, y:20, duration:0.6, ease:'power3.out' }, '-=0.3')
    .from('.hero-form-panel',{ opacity:0, x:60, duration:0.8, ease:'power3.out' }, '-=0.7');

  // Hero parallax
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  // Eyebrow + title combos
  gsap.utils.toArray('.eyebrow').forEach(el => {
    gsap.from(el, {
      opacity:0, x:-40, duration:0.7, ease:'power3.out',
      scrollTrigger: { trigger:el, start:'top 88%', toggleActions:'play none none none' }
    });
  });

  // Section titles
  gsap.utils.toArray('.section-title').forEach(el => {
    // Word-split animation
    const words = el.innerHTML.split(' ');
    el.innerHTML = words.map(w => `<span class="word-wrap" style="display:inline-block;overflow:hidden"><span class="word" style="display:inline-block">${w}&nbsp;</span></span>`).join('');
    gsap.from(el.querySelectorAll('.word'), {
      y:'100%', opacity:0, duration:0.7, stagger:0.08, ease:'power3.out',
      scrollTrigger: { trigger:el, start:'top 85%' }
    });
  });

  // Gold dividers draw
  gsap.utils.toArray('.gold-divider').forEach(el => {
    gsap.from(el, {
      scaleX:0, transformOrigin:'left center', duration:0.8, ease:'power3.out',
      scrollTrigger: { trigger:el, start:'top 90%' }
    });
  });

  // Cards stagger
  gsap.utils.toArray('.property-card, .feature-card, .blog-card, .testimonial-card, .kpi-card').forEach((el, i) => {
    gsap.from(el, {
      opacity:0, y:50, duration:0.7, delay: i * 0.08, ease:'power3.out',
      scrollTrigger: { trigger:el, start:'top 88%' }
    });
  });

  // Split sections
  document.querySelectorAll('.split-image').forEach(el => {
    gsap.from(el, {
      opacity:0, x: el.closest('.split-section')?.children[0] === el ? -80 : 80,
      duration:1, ease:'power3.out',
      scrollTrigger: { trigger:el, start:'top 80%' }
    });
  });
  document.querySelectorAll('.split-content').forEach(el => {
    gsap.from(el, {
      opacity:0, x:60, duration:1, ease:'power3.out',
      scrollTrigger: { trigger:el, start:'top 80%' }
    });
  });

  // Stats band numbers
  gsap.utils.toArray('.stat-num').forEach(el => {
    gsap.from(el, {
      opacity:0, scale:0.5, duration:0.6, ease:'back.out(1.5)',
      scrollTrigger: { trigger:el, start:'top 85%' }
    });
  });

  // Marquee strip
  gsap.from('.marquee-strip', { opacity:0, y:30, duration:0.5,
    scrollTrigger:{ trigger:'.marquee-strip', start:'top 95%' }
  });

  // Generic [data-gsap] targets
  gsap.utils.toArray('[data-gsap="fadeUp"]').forEach((el,i) => {
    gsap.to(el, {
      opacity:1, y:0, duration:0.8, delay:i*0.1, ease:'power3.out',
      scrollTrigger:{ trigger:el, start:'top 88%' }
    });
  });
}

/* ── FALLBACK REVEAL (no GSAP) ───────────────────────────── */
function initFallbackReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));
}

/* ── 3D CARD TILT ────────────────────────────────────────── */
document.querySelectorAll('.property-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── PROPERTY FILTER ─────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const propertyCards = document.querySelectorAll('[data-type]');
const searchInput = document.querySelector('#propertySearch');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter || 'all';
    filterProperties(filter, searchInput?.value || '');
  });
});

searchInput?.addEventListener('input', () => {
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  filterProperties(activeFilter, searchInput.value);
});

function filterProperties(type, search) {
  propertyCards.forEach(card => {
    const matchType = type === 'all' || card.dataset.type === type;
    const matchSearch = !search || card.textContent.toLowerCase().includes(search.toLowerCase());
    card.style.display = matchType && matchSearch ? '' : 'none';
  });
}

/* ── DASHBOARD TABS ──────────────────────────────────────── */
const sidebarLinks = document.querySelectorAll('.sidebar-link[data-panel]');
const dashPanels = document.querySelectorAll('.dash-panel');
const topbarTitle = document.querySelector('.topbar-title');

sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    sidebarLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    const target = link.dataset.panel;
    dashPanels.forEach(p => p.classList.remove('active'));
    document.getElementById(target)?.classList.add('active');
    if (topbarTitle) topbarTitle.textContent = link.querySelector('span')?.textContent || 'Dashboard';
  });
});

/* ── AUTH TABS ───────────────────────────────────────────── */
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form-content');

authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    authTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    authForms.forEach(f => f.classList.remove('active'));
    document.getElementById(tab.dataset.form)?.classList.add('active');
  });
});

/* ── FORM SUBMIT ─────────────────────────────────────────── */
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit], .form-submit');
    const orig = btn?.textContent;
    if (btn) { btn.textContent = 'Submitting…'; btn.disabled = true; }
    setTimeout(() => {
      if (btn) { btn.textContent = '✓ Submitted!'; }
      setTimeout(() => {
        if (btn) { btn.textContent = orig; btn.disabled = false; }
        form.reset();
      }, 2000);
    }, 1200);
  });
});

/* ── CHART BARS (dashboard) ──────────────────────────────── */
function initCharts() {
  document.querySelectorAll('.chart-bar').forEach(bar => {
    const h = bar.dataset.height || '60';
    bar.style.height = '0%';
    setTimeout(() => { bar.style.height = h + '%'; }, 300);
  });
}

/* ── TYPEWRITER ──────────────────────────────────────────── */
function typewriter(el) {
  const texts = (el.dataset.typewriter || '').split('|');
  let ti = 0, ci = 0, deleting = false;
  function tick() {
    const current = texts[ti];
    el.textContent = deleting ? current.slice(0, ci--) : current.slice(0, ci++);
    if (!deleting && ci > current.length) { deleting = true; setTimeout(tick, 1200); return; }
    if (deleting && ci < 0) { deleting = false; ti = (ti + 1) % texts.length; ci = 0; }
    setTimeout(tick, deleting ? 50 : 80);
  }
  tick();
}
document.querySelectorAll('[data-typewriter]').forEach(typewriter);

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined') initGSAP();
  else {
    window.addEventListener('load', () => {
      if (typeof gsap !== 'undefined') initGSAP();
      else initFallbackReveal();
    });
  }
  initCharts();
});
