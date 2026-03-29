// ===================================================================
// 1. INITIALIZE LENIS (Buttery Smooth Scrolling)
// ===================================================================
const lenis = new Lenis({
  autoRaf: true,
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000) });
gsap.ticker.lagSmoothing(0, 0);

// ===================================================================
// 2. CUSTOM CURSOR ANIMATION (Desktop Only)
// ===================================================================
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

// 🚨 Screen එක 768px ට වඩා ලොකු නම් (Desktop) විතරක් Cursor එක වැඩ කරන්න හදලා තියෙන්නේ
if(cursor && cursorDot && window.innerWidth > 768) {
  
  // Cursor Movement
  window.addEventListener('mousemove', (e) => {
    gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power3.out" });
  });

  // Cursor Hover Effects (ලිංක් උඩට ගියාම ලොකු වෙන්න)
  const interactiveElements = document.querySelectorAll('a, button, .project-card, .accordion-header, .submit-btn, .nav-contact-btn');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => { 
      gsap.to(cursor, { scale: 1.6, backgroundColor: "rgba(204, 255, 0, 0.1)", borderColor: "transparent", duration: 0.3 }); 
    });
    el.addEventListener('mouseleave', () => { 
      gsap.to(cursor, { scale: 1, backgroundColor: "transparent", borderColor: "var(--accent)", duration: 0.3 }); 
    });
  });
}
// ===================================================================
// 3. NAVBAR LOGIC (Fixed GSAP Centering & Auto Hide)
// ===================================================================
const navFull = document.getElementById('nav-full');
const navCompact = document.getElementById('nav-compact');

if (navFull && navCompact) {
  // CSS එකේ තියෙන මැදට කරන කෝඩ් එක GSAP වලට අඳුන්වලා දෙනවා
  gsap.set([navFull, navCompact], { xPercent: -50, left: "50%" });
  
  // මුලින්ම Compact Nav එක හංගලා තියමු
  gsap.set(navCompact, { y: -100, autoAlpha: 0 });

  // පේජ් එක ලෝඩ් වෙද්දි Main Nav එක පල්ලෙහාට එන Animation එක
  gsap.fromTo(navFull, 
    { y: -100, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 1.5, ease: 'expo.out', delay: 0.2 }
  );

  ScrollTrigger.create({
    start: 'top top',
    end: 99999,
    onUpdate: (self) => {
      if (window.scrollY < 50) {
        // උඩම ඉද්දි Main Nav එක පෙන්වනවා
        gsap.to(navFull, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
        gsap.to(navCompact, { y: -100, autoAlpha: 0, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
      } else if (self.direction === 1) { 
        // පල්ලෙහාට Scroll කරද්දි Compact Nav එක (Available Now) මතු වෙනවා
        gsap.to(navFull, { y: -100, autoAlpha: 0, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
        gsap.to(navCompact, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
      } else if (self.direction === -1) { 
        // උඩට Scroll කරද්දි ආයෙත් Main Nav එක එනවා
        gsap.to(navFull, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
        gsap.to(navCompact, { y: -100, autoAlpha: 0, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
      }
    }
  });
}

// ===================================================================
// 3.1. MOBILE NAVBAR MENU TOGGLE
// ===================================================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinksBox = document.getElementById('nav-links');

if (mobileMenuBtn && navLinksBox) {
  // Button එක Click කරද්දි Menu එක Open/Close වෙන්න
  mobileMenuBtn.addEventListener('click', () => {
    navLinksBox.classList.toggle('active');
  });

  // ලින්ක් එකක් Click කළාම Menu එක ඔටෝ වැහෙන්න
  navLinksBox.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksBox.classList.remove('active');
    });
  });
}

// ===================================================================
// 4. HERO SECTION ANIMATIONS
// ===================================================================
if (document.querySelector('.hero-title')) {
  const titleLeft = new SplitType('.hero-title', { types: 'chars' });
  const titleRight = new SplitType('.hero-title-right', { types: 'chars' });
  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl.from(titleLeft.chars, { y: 100, opacity: 0, rotateX: -80, stagger: 0.05, duration: 1, ease: 'expo.out' })
        .from(titleRight.chars, { y: 100, opacity: 0, rotateX: -80, stagger: 0.05, duration: 1, ease: 'expo.out' }, "-=0.8")
        .from('.hero-hi-badge', { scale: 0, opacity: 0, duration: 1, ease: 'elastic.out(1, 0.5)' }, "-=0.6")
        .from('.hero-name, .hero-sub', { opacity: 0, y: 20, duration: 1, stagger: 0.1, ease: 'power2.out' }, "-=0.8");

  // Hi Badge Hover Effect
  const hiBadge = document.querySelector('.hero-hi-badge');
  if(hiBadge) {
    window.addEventListener('mousemove', (e) => {
      if(window.scrollY < window.innerHeight) { 
        const xPos = (e.clientX / window.innerWidth - 0.5) * 40;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 40;
        gsap.to(hiBadge, { x: xPos, y: yPos, duration: 1, ease: 'power2.out' });
      }
    });
  }
}

// ===================================================================
// 05. 3D CONTINUOUS SHARED ELEMENT MOTION (Desktop Only)
// ===================================================================
const magicCard = document.getElementById('magic-card');
const cardInner = document.querySelector('.magic-card-inner');
const heroDock = document.getElementById('hero-dock');
const servicesDock = document.getElementById('services-dock');
const aboutDock = document.getElementById('about-dock');

function getTranslationX(source, target) {
  if(!source || !target) return 0;
  const s = source.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  return (t.left + t.width/2) - (s.left + s.width/2);
}

function getTranslationY(source, target) {
  if(!source || !target) return 0;
  const s = source.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  const sCenterY = (s.top + window.scrollY) + s.height/2;
  const tCenterY = (t.top + window.scrollY) + t.height/2;
  return tCenterY - sCenterY;
}

function getScaleXY(source, target, axis) {
  if(!source || !target) return 1;
  const s = source.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  if(axis === 'x') return t.width / s.width;
  if(axis === 'y') return t.height / s.height;
}

if(magicCard && heroDock && servicesDock && aboutDock) {
  let mm = gsap.matchMedia();

  // ----- DESKTOP වලට විතරයි (> 768px) -----
  mm.add("(min-width: 769px)", () => {
    // Desktop වලදි අර Services/About එකේ තියෙන අමතර පින්තූර දෙක හංගමු 
    gsap.set('#services-dock img, #about-dock img', { opacity: 0 });

    const flipTl1 = gsap.timeline({
      scrollTrigger: { trigger: '#services', start: 'top 80%', end: 'center center', scrub: 1, invalidateOnRefresh: true }
    });

    flipTl1.to(magicCard, {
      x: () => getTranslationX(heroDock, servicesDock),
      y: () => getTranslationY(heroDock, servicesDock),
      scaleX: () => getScaleXY(heroDock, servicesDock, 'x'),
      scaleY: () => getScaleXY(heroDock, servicesDock, 'y'),
      rotationZ: -6, 
      rotationX: 10, 
      ease: 'power1.inOut'
    }, 0).to(cardInner, { rotateY: 180, ease: 'power1.inOut' }, 0);

    const flipTl2 = gsap.timeline({
      scrollTrigger: { trigger: '#about', start: 'top 80%', end: 'center center', scrub: 1, invalidateOnRefresh: true }
    });

    flipTl2.to(magicCard, {
      x: () => getTranslationX(heroDock, aboutDock),
      y: () => getTranslationY(heroDock, aboutDock),
      scaleX: () => getScaleXY(heroDock, aboutDock, 'x'),
      scaleY: () => getScaleXY(heroDock, aboutDock, 'y'),
      rotationZ: 5, 
      rotationX: 8, 
      ease: 'power1.inOut'
    }, 0).to(cardInner, { rotateY: 360, ease: 'power1.inOut' }, 0);

    // Screen එක පොඩි කරද්දි Animation එක අයින් කරලා සාමාන්‍ය තත්වෙට ගේනවා
    return () => { 
      gsap.set(magicCard, { clearProps: "all" });
      gsap.set(cardInner, { clearProps: "all" });
      gsap.set('#services-dock img, #about-dock img', { opacity: 1 });
    };
  });

  // ----- MOBILE වලට විතරයි (<= 768px) -----
  mm.add("(max-width: 768px)", () => {
    // Mobile වලදි Animation මුකුත් නෑ, පින්තූර 3 වෙන වෙනම පේනවා
    gsap.set(magicCard, { clearProps: "all" });
    gsap.set(cardInner, { clearProps: "all" });
    gsap.set('#services-dock img, #about-dock img', { opacity: 1 });
  });
}

// ===================================================================
// 6. NUMBERS COUNT-UP EFFECT (REPEATING EVERY TIME)
// ===================================================================
const allCounters = document.querySelectorAll('.stat-number, .testi-count');

if(allCounters.length > 0) {
  allCounters.forEach(number => {
    const target = parseInt(number.getAttribute('data-target'));
    
    ScrollTrigger.create({
      trigger: number,
      start: 'top 90%', 
      onEnter: playCounter,       
      onEnterBack: playCounter    
    });

    function playCounter() {
      gsap.fromTo(number, 
        { textContent: 0 }, 
        { 
          textContent: target, 
          duration: 2.5, 
          ease: 'expo.out', 
          snap: { textContent: 1 }, 
          onUpdate: function () { 
            number.textContent = this.targets()[0].textContent; 
          }
        }
      );
    }
  });
}

// ===================================================================
// 7. DARK / LIGHT MODE TOGGLE LOGIC
// ===================================================================
const themeToggle = document.getElementById('themeToggle');
const toggleThumb = document.querySelector('.toggle-thumb');
if(themeToggle && toggleThumb) {
  let isLightMode = localStorage.getItem('theme') === 'light';
  if (isLightMode) {
    document.body.classList.add('light-mode');
    gsap.set(toggleThumb, { x: 24 }); 
    gsap.set(themeToggle, { background: 'var(--text-secondary)' }); 
  }
  themeToggle.addEventListener('click', () => {
    isLightMode = !isLightMode; 
    const tl = gsap.timeline({ defaults: { duration: 0.4, ease: 'power2.inOut' } });
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light'); 
      tl.to(toggleThumb, { x: 24 }).to(themeToggle, { background: 'var(--text-secondary)' }, '<'); 
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark'); 
      tl.to(toggleThumb, { x: 0 }).to(themeToggle, { background: 'var(--accent)' }, '<'); 
    }
  });
}

// ===================================================================
// 8. SERVICES ACCORDION & FAQ ACCORDION LOGIC (Force Closed on Load)
// ===================================================================
function initAccordion(itemsSelector) {
  const items = document.querySelectorAll(itemsSelector);
  
  items.forEach(item => {
    const header = item.querySelector(itemsSelector.includes('faq') ? '.faq-header' : '.accordion-header');
    const body = item.querySelector(itemsSelector.includes('faq') ? '.faq-body' : '.accordion-body');

    // 🚨 පේජ් එක ලෝඩ් වෙද්දි බලහත්කාරයෙන්ම ඔක්කොම වහලා දානවා (Force Close) 🚨
    item.classList.remove('open');
    if (body) {
      body.style.maxHeight = null; // HTML එකේ style එකක් තිබුණත් ඒක මකලා දානවා
    }

    if(header && body) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        // අනිත් ඇරිලා තියෙන ඒවා වහනවා
        document.querySelectorAll(`${itemsSelector}.open`).forEach(openItem => {
          openItem.classList.remove('open');
          const openBody = openItem.querySelector(itemsSelector.includes('faq') ? '.faq-body' : '.accordion-body');
          gsap.to(openBody, { maxHeight: 0, duration: 0.4, ease: 'power2.inOut' });
        });
        
        // Click කරපු එක අරිනවා
        if (!isOpen) {
          item.classList.add('open');
          gsap.to(body, { maxHeight: body.scrollHeight, duration: 0.5, ease: 'power2.inOut' });
        }
      });
    }
  });
}

initAccordion('.accordion-item');
initAccordion('.faq-item');
// ===================================================================
// 9. ABOUT ME - TEXT REVEALS
// ===================================================================
if (document.querySelector('.about-me-heading')) {
  const aboutHeading = new SplitType('.about-me-heading', { types: 'chars' });
  gsap.set('.about-me-bio, .about-me-stats, .about-me-contact, .about-me-footer', { opacity: 0, y: 30 });
  gsap.set(aboutHeading.chars, { opacity: 0 });

  ScrollTrigger.create({
    trigger: '#about', start: 'top 65%', 
    onEnter: () => {
      gsap.to(aboutHeading.chars, { opacity: 1, y: 0, rotateX: 0, stagger: 0.05, duration: 1, ease: 'expo.out' });
      gsap.to('.about-me-bio', { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power2.out' });
      gsap.to('.about-me-stats, .about-me-contact, .about-me-footer', { opacity: 1, y: 0, stagger: 0.2, duration: 1, delay: 0.5, ease: 'power2.out' });
    }, once: true 
  });
}

// ===================================================================
// 10. PROJECTS SECTION - STAGGERED SMOOTH ENTRANCE
// ===================================================================
if(document.querySelector('.projects-top')) {
  const projectsHeading = new SplitType('.projects-heading', { types: 'chars' });
  ScrollTrigger.create({
    trigger: '.projects-top', start: 'top 85%', 
    onEnter: () => {
      gsap.from(projectsHeading.chars, { y: 60, opacity: 0, rotateX: -60, stagger: 0.03, duration: 1, ease: 'expo.out' });
    }, once: true
  });
}

if(document.querySelector('.projects-grid')) {
  gsap.from('.project-card', {
    scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' },
    y: 80, opacity: 0, stagger: 0.15, duration: 1.2, ease: 'expo.out', clearProps: 'all'
  });
}

// ===================================================================
// 11. TESTIMONIALS & CONTACT REVEALS
// ===================================================================
if(document.querySelector('.testimonials-grid')) {
  gsap.from('.testi-card', { scrollTrigger: { trigger: '.testimonials-grid', start: 'top 80%' }, y: 80, opacity: 0, stagger: 0.15, duration: 1.2, ease: 'power3.out' });
}

// ===================================================================
// 12. PREMIUM CONTACT & FOOTER LOGIC
// ===================================================================
function updateTime() {
  const timeDisplay = document.getElementById('live-time');
  if(timeDisplay) {
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit', hour12: true }) + " (GMT+5:30)";
  }
}
setInterval(updateTime, 1000); updateTime();

// Footer Animation
if(document.querySelector('.footer-neon')) {
  ScrollTrigger.create({
    trigger: '.footer-neon', start: 'top 90%',
    onEnter: () => {
      gsap.from('.footer-block', { y: 40, opacity: 0, stagger: 0.15, duration: 1, ease: 'power3.out' });
      gsap.from('.footer-divider', { scaleX: 0, duration: 1.2, delay: 0.4, ease: 'power3.inOut' });
      gsap.from('.footer-bottom-flex', { opacity: 0, y: 20, duration: 1, delay: 0.8, ease: 'power2.out' });
    }, once: true
  });
}

// ===================================================================
// 13. GLOBAL SCROLLTRIGGER REFRESH (CRITICAL)
// ===================================================================
window.addEventListener('load', () => { setTimeout(() => { ScrollTrigger.refresh(); }, 500); });
const resizeObserver = new ResizeObserver(() => { ScrollTrigger.refresh(); });
resizeObserver.observe(document.body);
