/* ============================================================
   LAVANYA GUGULOTHU — PORTFOLIO JAVASCRIPT
   Features:
     1. Typewriter effect (hero role)
     2. Navbar scroll behaviour + active link highlighting
     3. Mobile hamburger menu
     4. Scroll-reveal animations (IntersectionObserver)
     5. Contact form validation + success message
     6. Project card tilt micro-interaction
     7. Dynamic footer year
   ============================================================ */

/* ── 1. TYPEWRITER EFFECT ────────────────────────────────── */
const PHRASES = [
  'Daily Problem Solver.',
  'CS Student.',
  'Java Developer.',
  'Building real-world projects.',
  'Open to opportunities.',
];

const typewriterEl = document.getElementById('typewriter');
let phraseIndex   = 0;
let charIndex     = 0;
let isDeleting    = false;

function typeLoop() {
  const current = PHRASES[phraseIndex];

  if (isDeleting) {
    // Remove one character
    typewriterEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
  } else {
    // Add one character
    typewriterEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
  }

  // Speed: faster deleting, slower typing
  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIndex === current.length) {
    // Pause at end of phrase before deleting
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Move to next phrase
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % PHRASES.length;
    delay = 400;
  }

  setTimeout(typeLoop, delay);
}

// Kick off typewriter after a short page-load pause
setTimeout(typeLoop, 800);


/* ── 2. NAVBAR — SCROLL BEHAVIOUR & ACTIVE LINK ─────────── */
const navbar    = document.getElementById('navbar');
const navAnchors = document.querySelectorAll('.nav-links a');

// Add .scrolled class once user scrolls past 60px
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  highlightActiveNav();
}, { passive: true });

// Highlight nav link matching the current scroll position
function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollMid = window.scrollY + window.innerHeight / 3;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (link) {
      link.classList.toggle('active', scrollMid >= top && scrollMid < bottom);
    }
  });
}

// Smooth-scroll for nav links + close mobile menu on click
navAnchors.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close mobile menu
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});


/* ── 3. MOBILE HAMBURGER MENU ────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when clicking outside
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  }
});


/* ── 4. SCROLL-REVEAL ANIMATIONS ─────────────────────────── */
const revealTargets = document.querySelectorAll(
  '.section-header, .about-grid, .skills-grid, .project-card, .contact-grid, .skill-card'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children slightly for grid items
      const delay = entry.target.closest('.skills-grid, .projects-grid') ? i * 60 : 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
});

revealTargets.forEach(el => revealObserver.observe(el));


/* ── 5. CONTACT FORM VALIDATION ─────────────────────────── */
const form           = document.getElementById('contact-form');
const nameInput      = document.getElementById('name');
const emailInput     = document.getElementById('email');
const messageInput   = document.getElementById('message');
const nameError      = document.getElementById('name-error');
const emailError     = document.getElementById('email-error');
const messageError   = document.getElementById('message-error');
const successBanner  = document.getElementById('form-success');

// Email format regex
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns error message string, or '' if valid */
function validateName(val)    { return val.trim() ? '' : 'Please enter your name.'; }
function validateEmail(val)   {
  if (!val.trim()) return 'Please enter your email.';
  return EMAIL_RE.test(val.trim()) ? '' : 'Please enter a valid email address.';
}
function validateMessage(val) {
  if (!val.trim()) return 'Please write a message.';
  return val.trim().length < 10 ? 'Message is too short (min. 10 characters).' : '';
}

/** Show/clear a field error */
function setError(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.toggle('error', !!message);
}

// Inline validation on blur (better UX than wait-for-submit)
nameInput.addEventListener('blur',    () => setError(nameInput,    nameError,    validateName(nameInput.value)));
emailInput.addEventListener('blur',   () => setError(emailInput,   emailError,   validateEmail(emailInput.value)));
messageInput.addEventListener('blur', () => setError(messageInput, messageError, validateMessage(messageInput.value)));

// Clear error on input
[nameInput, emailInput, messageInput].forEach(field => {
  field.addEventListener('input', () => {
    field.classList.remove('error');
  });
});

// Form submit
form.addEventListener('submit', e => {
  e.preventDefault();

  const nameMsg    = validateName(nameInput.value);
  const emailMsg   = validateEmail(emailInput.value);
  const messageMsg = validateMessage(messageInput.value);

  setError(nameInput,    nameError,    nameMsg);
  setError(emailInput,   emailError,   emailMsg);
  setError(messageInput, messageError, messageMsg);

  const isValid = !nameMsg && !emailMsg && !messageMsg;

  if (isValid) {
    // ── In production, replace this block with your actual API call / form service ──
    showSuccess();
  }
});

function showSuccess() {
  // Disable inputs to prevent double-submit
  form.querySelectorAll('input, textarea, button').forEach(el => el.setAttribute('disabled', true));

  successBanner.classList.add('show');
  successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Reset after 6 seconds
  setTimeout(() => {
    form.reset();
    form.querySelectorAll('input, textarea, button').forEach(el => el.removeAttribute('disabled'));
    successBanner.classList.remove('show');
    [nameInput, emailInput, messageInput].forEach(f => f.classList.remove('error'));
    [nameError, emailError, messageError].forEach(e => e.textContent = '');
  }, 6000);
}


/* ── 6. PROJECT CARD TILT MICRO-INTERACTION ─────────────── */
document.querySelectorAll('.project-card:not(.placeholder-card)').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width / 2;
    const cy     = rect.height / 2;
    const tiltX  = ((y - cy) / cy) * 4;   // max 4deg
    const tiltY  = ((x - cx) / cx) * -4;

    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ── 7. DYNAMIC FOOTER YEAR ─────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
