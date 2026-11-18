/* ==========================================================
   HashSlash: interactions & GSAP motion
   ========================================================== */

/* ---- Site config: fill these in before launch ---- */
const CONFIG = {
  whatsappNumber: '',        // international format, digits only, e.g. '9198XXXXXXXX'
  whatsappText: "Hi HashSlash, I'd like to talk about a project.",
  bookingUrl: '',            // Calendly / Cal.com link
  formEndpoint: ''           // POST endpoint for project enquiries (CRM / form backend)
};

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
if (!hasGsap) document.documentElement.classList.remove('motion');

/* ==========================================================
   Analytics: GA4 (dataLayer) + Meta Pixel, with shared event_id for dedup
   ========================================================== */
const META_MAP = { booking_start: 'Schedule', generate_lead: 'Lead', whatsapp_click: 'Contact' };
function track(name, params = {}) {
  const event_id = `${name}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, event_id, ...params });
  if (typeof window.fbq === 'function' && META_MAP[name]) {
    window.fbq('track', META_MAP[name], params, { eventID: event_id });
  }
  return event_id;
}
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-track]');
  if (!el) return;
  track(el.dataset.track, { cta_id: el.dataset.cta || el.dataset.track, location: el.dataset.loc || '' });
});

/* ==========================================================
   Conversion links
   ========================================================== */
(function wireLinks() {
  const wa = CONFIG.whatsappNumber
    ? `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappText)}`
    : '#contact';
  $$('[data-whatsapp]').forEach((a) => {
    a.href = wa;
    if (CONFIG.whatsappNumber) { a.target = '_blank'; a.rel = 'noopener'; }
  });
  $$('[data-book], [data-book-url]').forEach((a) => {
    if (CONFIG.bookingUrl) { a.href = CONFIG.bookingUrl; a.target = '_blank'; a.rel = 'noopener'; }
    else if (a.hasAttribute('data-book-url')) a.href = '#enquiry';
  });
  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();

/* ==========================================================
   Nav: hide on scroll down, show on scroll up
   ========================================================== */
(function nav() {
  const nav = $('#nav');
  const burger = $('.nav__burger');
  const menu = $('#menu');
  let lastY = scrollY, ticking = false;

  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      nav.classList.toggle('is-scrolled', y > 40);
      if (!menu.hidden) nav.classList.remove('is-hidden');
      else nav.classList.toggle('is-hidden', y > lastY && y > 400);
      lastY = y; ticking = false;
    });
  }, { passive: true });

  const setMenu = (open) => {
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && hasGsap && document.documentElement.classList.contains('motion')) {
      gsap.from($$('#menu nav a'), { yPercent: 60, opacity: 0, stagger: .05, duration: .6, ease: 'expo.out' });
    }
  };
  burger.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
})();

/* ==========================================================
   Mobile sticky CTA bar: visible after hero, hidden at contact
   ========================================================== */
(function mobileBar() {
  const bar = $('.mbar');
  if (!('IntersectionObserver' in window) || !bar) return;
  let heroVisible = true, contactVisible = false;
  const update = () => bar.classList.toggle('is-on', !heroVisible && !contactVisible);
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; update(); }).observe($('.hero'));
  new IntersectionObserver(([e]) => { contactVisible = e.isIntersecting; update(); }, { threshold: .1 }).observe($('#contact'));
})();

/* ==========================================================
   Tool chips: text fallback if an icon fails to load
   ========================================================== */
$$('.chip img').forEach((img) => {
  const fail = () => img.closest('.chip').classList.add('is-fallback');
  if (img.complete && img.naturalWidth === 0) fail();
  img.addEventListener('error', fail);
});

/* ==========================================================
   Word splitter (keeps inline tags like <b>)
   ========================================================== */
function splitWords(root) {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span');
          s.className = 'w'; s.textContent = part;
          frag.appendChild(s);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) walk(child);
    });
  };
  walk(root);
  return $$('.w', root);
}

/* ==========================================================
   Signature chip positions (shared by motion + reduced-motion)
   ========================================================== */
const stage = $('.converge__stage');
const chips = $$('.chip');
const chipData = chips.map((c) => ({ a: (+c.dataset.a * Math.PI) / 180, r: +c.dataset.r, s: +c.dataset.s }));
const chipX = (i) => Math.cos(chipData[i].a) * chipData[i].r * stage.offsetWidth;
const chipY = (i) => Math.sin(chipData[i].a) * chipData[i].r * stage.offsetHeight * 0.82;

/* ==========================================================
   GSAP
   ========================================================== */
if (hasGsap) {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)',
      desktop: '(min-width: 769px)',
      mobile: '(max-width: 768px)'
    },
    (ctx) => {
      const { motion, desktop } = ctx.conditions;

      /* ---------- reduced motion: static, fully visible ---------- */
      if (!motion) {
        document.documentElement.classList.remove('motion');
        gsap.set(chips, { x: chipX, y: chipY, scale: (i) => chipData[i].s });
        $$('.step').forEach((s) => s.classList.add('is-on'));
        gsap.set('.steps__fill', { scaleY: 1 });
        const onR = () => gsap.set(chips, { x: chipX, y: chipY });
        addEventListener('resize', onR);
        return () => removeEventListener('resize', onR);
      }

      /* ---------- HERO intro ---------- */
      $$('.scribble path').forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: .15 });
      intro
        .to('.hero .line__in', { yPercent: 0, y: 0, duration: 1.25, stagger: .12 })
        .to('.hero__eyebrow', { opacity: 1, y: 0, duration: .8 }, 0.1)
        .fromTo('.hero__script', { opacity: 0, y: 14, rotate: -14 }, { opacity: 1, y: 0, rotate: -6, duration: .9, stagger: .12, ease: 'back.out(2)' }, '-=.85')
        .to('.scribble path', { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: .2 }, '-=.8')
        .to('.hero__meta > *', { opacity: 1, y: 0, duration: .9, stagger: .1 }, '-=1')
        .fromTo('.badge', { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 1.1, ease: 'back.out(1.6)' }, '-=.9');

      // hero scroll parallax (scrub)
      const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero__line--1', { xPercent: -6, ease: 'none', scrollTrigger: heroST });
      gsap.to('.hero__line--3', { xPercent: 6, ease: 'none', scrollTrigger: heroST });
      gsap.to('.hero__bg', { yPercent: 25, ease: 'none', scrollTrigger: heroST });
      gsap.to('.hero__meta', { yPercent: -30, opacity: .2, ease: 'none', scrollTrigger: heroST });

      /* ---------- SIGNATURE: tools converge into #/. then it takes over the screen ---------- */
      const core = $('.core');
      gsap.set(chips, { x: chipX, y: chipY, scale: (i) => chipData[i].s });

      // idle float (on inner element so it never fights the scrubbed transform)
      $$('.chip__in').forEach((el, i) => {
        gsap.to(el, {
          y: gsap.utils.random(-14, 14), rotation: gsap.utils.random(-8, 8),
          duration: gsap.utils.random(2.2, 3.6), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .08
        });
      });
      // mouse parallax on desktop: chips drift against the cursor
      let onMove;
      if (desktop && matchMedia('(pointer: fine)').matches) {
        const orbit = $('.orbit');
        const ox = gsap.quickTo(orbit, 'x', { duration: 1.2, ease: 'power3' });
        const oy = gsap.quickTo(orbit, 'y', { duration: 1.2, ease: 'power3' });
        onMove = (e) => { ox((e.clientX / innerWidth - .5) * -40); oy((e.clientY / innerHeight - .5) * -30); };
        stage.addEventListener('pointermove', onMove);
      }

      // title reveal on arrival
      gsap.fromTo('.converge__title .line__in', { yPercent: 110 }, {
        yPercent: 0, duration: 1.1, stagger: .1, ease: 'expo.out',
        scrollTrigger: { trigger: '.converge', start: 'top 55%' }
      });

      const counter = { v: 12 };
      const numEl = $('.converge__num');
      const coverScale = () => (Math.hypot(stage.offsetWidth, stage.offsetHeight) / core.offsetWidth) * 1.08;

      const conv = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.converge', start: 'top top', end: () => '+=' + innerHeight * 2.6,
          pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
        }
      });
      conv
        // 1. tools spiral into the core
        .fromTo(chips,
          { x: chipX, y: chipY, scale: (i) => chipData[i].s, rotation: 0, opacity: 1 },
          { x: 0, y: 0, scale: .15, rotation: (i) => (i % 2 ? 200 : -200), opacity: 0, ease: 'power2.in', duration: 1, stagger: { each: .05, from: 'edges' } }, 0)
        .fromTo(counter, { v: 12 }, { v: 1, duration: 1.4, onUpdate: () => { numEl.textContent = Math.round(counter.v); } }, 0)
        // 2. core "swallows" them: swell + tilt
        .to(core, { scale: 1.25, rotation: -8, duration: .9, ease: 'power1.inOut' }, .25)
        .to(core, { scale: 1, rotation: 0, duration: .35, ease: 'back.out(3)' }, 1.15)
        .to('.core__ring', { opacity: 0, scale: 1.6, duration: .4 }, 1.1)
        // 3. copy exits
        // (exit animates the parent so it never fights the line reveal tween)
        .to('.converge__title', { yPercent: -40, opacity: 0, filter: 'blur(8px)', duration: .45, ease: 'power2.in' }, 1.35)
        .to('.converge__kicker, .converge__count', { opacity: 0, duration: .3 }, 1.35)
        // 4. #/. expands to fill the viewport and hands off to the lime manifesto
        .to('.core__mark', { scale: .4, opacity: 0, duration: .35 }, 1.55)
        .to(core, { scale: coverScale, backgroundColor: '#d7ff00', duration: 1.1, ease: 'power3.in' }, 1.55);

      /* ---------- MANIFESTO: word-by-word ink-in ---------- */
      const words = splitWords($('[data-words]'));
      gsap.fromTo(words, { opacity: .12 }, {
        opacity: 1, ease: 'none', stagger: .1,
        scrollTrigger: { trigger: '.manifesto', start: 'top 65%', end: 'bottom 75%', scrub: true }
      });
      gsap.from('.manifesto__script', {
        scale: 0, rotate: -30, duration: .9, ease: 'back.out(2.2)',
        scrollTrigger: { trigger: '.manifesto__foot', start: 'top 85%' }
      });

      /* ---------- generic reveals ---------- */
      gsap.set('.reveal', { y: 60, opacity: 0 });
      ScrollTrigger.batch('.reveal', {
        start: 'top 88%', once: true,
        onEnter: (b) => gsap.to(b, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: .1 })
      });
      gsap.from('.trust__logos li', {
        opacity: 0, y: 20, stagger: .06, duration: .7, ease: 'power3.out',
        scrollTrigger: { trigger: '.trust', start: 'top 80%' }
      });
      gsap.from('.ind', {
        yPercent: 18, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: '.inds', start: 'top 80%' }
      });

      /* ---------- crossing bands: loop + scroll-velocity boost ---------- */
      const loops = $$('.band__track').map((t, i) =>
        gsap.fromTo(t, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 28, ease: 'none', repeat: -1 })
      );
      ScrollTrigger.create({
        trigger: '.bands', start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 350);
          loops.forEach((tw) => gsap.to(tw, {
            timeScale: boost, duration: .15, overwrite: true,
            onComplete: () => gsap.to(tw, { timeScale: 1, duration: 1.2, ease: 'power2.out' })
          }));
        }
      });
      gsap.fromTo('.band--lime', { rotate: -7 }, { rotate: -2, ease: 'none', scrollTrigger: { trigger: '.bands', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('.band--dark', { rotate: 7 }, { rotate: 2, ease: 'none', scrollTrigger: { trigger: '.bands', start: 'top bottom', end: 'bottom top', scrub: true } });

      /* ---------- WORK: horizontal pinned gallery (desktop) ---------- */
      if (desktop) {
        const head = $('.work__head');
        const track = $('.work__track');
        const dist = () => head.offsetWidth + track.scrollWidth - innerWidth;
        gsap.to([head, track], {
          x: () => -dist(), ease: 'none',
          scrollTrigger: {
            trigger: '.work', start: 'top top', end: () => '+=' + dist(),
            pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
          }
        });
      }

      /* ---------- PROCESS: rail draws, steps light up ---------- */
      gsap.to('.steps__fill', {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.steps', start: 'top 60%', end: 'bottom 60%', scrub: true }
      });
      $$('.step').forEach((s) => ScrollTrigger.create({ trigger: s, start: 'top 62%', toggleClass: 'is-on' }));

      /* ---------- CONTACT + FOOTER ---------- */
      gsap.from('.contact__title .line__in', {
        yPercent: 110, duration: 1.1, stagger: .12, ease: 'expo.out',
        scrollTrigger: { trigger: '.contact', start: 'top 70%' }
      });
      gsap.from('.enquiry', {
        y: 60, opacity: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: '.contact', start: 'top 60%' }
      });
      gsap.from('.footer__word span', {
        yPercent: 100, duration: 1, stagger: .045, ease: 'expo.out',
        scrollTrigger: { trigger: '.footer__word', start: 'top 95%' }
      });

      /* ---------- magnetic CTAs ---------- */
      const mags = [];
      if (matchMedia('(pointer: fine)').matches) {
        $$('.magnetic').forEach((el) => {
          const xTo = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' });
          const yTo = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
          const move = (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * .25);
            yTo((e.clientY - r.top - r.height / 2) * .35);
          };
          const leave = () => { xTo(0); yTo(0); };
          el.addEventListener('pointermove', move);
          el.addEventListener('pointerleave', leave);
          mags.push([el, move, leave]);
        });
      }

      return () => {
        if (onMove) stage.removeEventListener('pointermove', onMove);
        mags.forEach(([el, m, l]) => { el.removeEventListener('pointermove', m); el.removeEventListener('pointerleave', l); });
      };
    }
  );

  // fonts change metrics: recalc pin distances once they're in
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
}

/* ==========================================================
   Final-CTA wireframe terrain (canvas), a nod to the original "Deploy the arsenal" mountain
   ========================================================== */
(function terrain() {
  const canvas = $('.terrain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, t = 0, raf = null, visible = false;

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };
  const n = (x, r) => (Math.sin(x * 1.7 + t + r * .3) + Math.sin(x * 3.3 - t * .7 + r * .55) + Math.sin(x * 6.1 + r * .9 + t * .4)) / 3;

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const rows = 26, cols = 90;
    for (let r = 0; r < rows; r++) {
      const z = r / (rows - 1);
      const base = h * .1 + Math.pow(z, 1.5) * h * .95;
      const amp = h * (.12 + z * .5);
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const xn = c / cols;
        const spread = .55 + z * 1.6;
        const x = w / 2 + (xn - .5) * w * spread;
        const env = Math.exp(-Math.pow((xn - .52) * 3.2, 2)) + .35 * Math.exp(-Math.pow((xn - .2) * 5, 2)) + .3 * Math.exp(-Math.pow((xn - .82) * 5, 2));
        const y = base - env * amp * (.65 + .35 * n(xn * 4, r)) - n(xn * 9, r) * 6 * z;
        c ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = `rgba(215,255,0,${.05 + z * .32})`;
      ctx.lineWidth = .6 + z * .6;
      ctx.stroke();
    }
  }
  const loop = () => { t += .006; draw(); raf = visible ? requestAnimationFrame(loop) : null; };

  addEventListener('resize', resize);
  resize();
  if (reduce || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(loop);
  }).observe(canvas);
})();

/* ==========================================================
   Multi-step project enquiry
   ========================================================== */
(function enquiry() {
  const form = $('#enquiry');
  if (!form) return;
  const steps = $$('.fstep', form);
  const prev = $('[data-prev]', form), next = $('[data-next]', form), submit = $('[data-submit]', form);
  const bar = $('.enquiry__bar span', form), now = $('#stepNow');
  let cur = 0, started = false;

  form.addEventListener('input', () => {
    if (!started) { started = true; track('lead_form_start', { location: 'contact' }); }
  }, { once: false });

  const show = (i) => {
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    prev.hidden = i === 0;
    next.hidden = i === steps.length - 1;
    submit.hidden = i !== steps.length - 1;
    bar.style.width = ((i + 1) / steps.length) * 100 + '%';
    now.textContent = i + 1;
    const first = $('input, select, textarea', steps[i]);
    if (first && i > 0) first.focus({ preventScroll: true });
  };

  const err = (msg) => { $('.ferr', steps[cur]).textContent = msg; return !msg; };
  const mark = (el, bad) => el.classList.toggle('is-invalid', bad);

  function validate() {
    const fd = new FormData(form);
    if (cur === 0) {
      const ind = form.industry;
      mark(ind, !ind.value);
      if (!fd.getAll('services').length) return err('Pick at least one service.');
      if (!ind.value) return err('Select your industry.');
    }
    if (cur === 1) {
      const d = form.description;
      mark(d, !d.value.trim());
      if (!fd.get('budget')) return err('Choose an approximate budget.');
      if (!d.value.trim()) return err('A line or two about the project helps us prepare.');
    }
    if (cur === 2) {
      const { name, email, phone } = form;
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      mark(name, !name.value.trim()); mark(email, !emailOk); mark(phone, phone.value.replace(/\D/g, '').length < 7);
      if (!name.value.trim()) return err('Your name, please.');
      if (!emailOk) return err('That email doesn\'t look right.');
      if (phone.value.replace(/\D/g, '').length < 7) return err('Add a phone number we can reach.');
    }
    return err('');
  }

  next.addEventListener('click', () => {
    if (!validate()) return;
    cur++; show(cur);
    track('lead_form_step', { step: cur + 1 });
  });
  prev.addEventListener('click', () => { cur--; show(cur); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    payload.services = fd.getAll('services');
    submit.disabled = true; submit.textContent = 'Sending…';

    const event_id = track('generate_lead', {
      services: payload.services.join(', '), industry: payload.industry, budget: payload.budget, location: 'contact'
    });
    payload.event_id = event_id; // pass to backend / CAPI for dedup

    try {
      if (CONFIG.formEndpoint) {
        const res = await fetch(CONFIG.formEndpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(res.status);
      } else {
        console.info('[HashSlash] No formEndpoint configured. Enquiry payload:', payload);
      }
      form.classList.add('is-done');
      $('.enquiry__done', form).hidden = false;
      if (hasGsap) gsap.from('.enquiry__done > *', { y: 20, opacity: 0, stagger: .08, duration: .7, ease: 'expo.out' });
    } catch (ex) {
      err('Something went wrong sending that. Please try WhatsApp or email instead.');
      submit.disabled = false; submit.textContent = 'Send enquiry →';
    }
  });

  show(0);
})();
