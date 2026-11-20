/* ==========================================================
   HashSlash: shared site behaviour (every page)
   ========================================================== */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
if (import.meta.env.DEV) Object.assign(window, { gsap, ScrollTrigger }); // dev-only debugging handle

/* ---- Site config: fill these in before launch ---- */
export const CONFIG = {
  whatsappNumber: '917259190306', // international format, digits only
  phone: '+917259190306',          // "Book a call" dials this on phones; desktops get the call-back form
  whatsappText: "Hi HashSlash, I'd like to talk about a project.",
  bookingUrl: '',            // Calendly / Cal.com link; empty = booking buttons open the enquiry form
  // Both forms post here (HashSlash Headless plugin): saved under Leads in wp-admin and emailed.
  leadEndpoint: 'https://cms.hash-slash.com/wp-json/hashslash/v1/lead'
};

export const $ = (s, c = document) => c.querySelector(s);
export const $$ = (s, c = document) => [...c.querySelectorAll(s)];
export const prefersReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export { gsap, ScrollTrigger };

/* ---------- Analytics: GA4 dataLayer + Meta Pixel with shared event_id ---------- */
const META_MAP = { booking_start: 'Schedule', generate_lead: 'Lead', whatsapp_click: 'Contact' };
export function track(name, params = {}) {
  const event_id = `${name}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, event_id, page_path: location.pathname, ...params });
  if (typeof window.fbq === 'function' && META_MAP[name]) window.fbq('track', META_MAP[name], params, { eventID: event_id });
  return event_id;
}

let started = false;
export function initCore() {
  if (started) return; started = true;
  const reduce = prefersReduced();
  if (reduce) document.documentElement.classList.remove('motion');

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (el) track(el.dataset.track, { cta_id: el.dataset.cta || el.dataset.track, location: el.dataset.loc || '' });
  });

  wireLinks();
  nav();
  mobileBar();
  chipFallback();
  enquiry();
  terrain(reduce);
  pageTransition(reduce);
  if (!reduce) sharedMotion(); else staticState();

  window.__hsReady = true;
  ScrollTrigger.sort();
  // One measuring pass instead of three, run once the page has loaded (keeps it out of the startup task);
  // refresh again only if web fonts finish after that, since they change text heights.
  const refreshOnce = () => { ScrollTrigger.refresh(); if (document.fonts?.status === 'loading') document.fonts.ready.then(() => ScrollTrigger.refresh()); };
  if (document.readyState === 'complete') refreshOnce(); else addEventListener('load', refreshOnce, { once: true });
}

/* ---------- conversion links ---------- */
function wireLinks() {
  const wa = CONFIG.whatsappNumber
    ? `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappText)}`
    : '#contact';
  $$('[data-whatsapp]').forEach((a) => { a.href = wa; if (CONFIG.whatsappNumber) { a.target = '_blank'; a.rel = 'noopener'; } });
  callLinks();
}

/* ---------- "Book a call": booking page if configured, else phones dial and desktops get a call-back form ---------- */
const canDial = () => matchMedia('(hover: none) and (pointer: coarse)').matches;
function callLinks() {
  const dlg = $('#callback');
  $$('[data-book], [data-book-url]').forEach((a) => {
    if (CONFIG.bookingUrl) { a.href = CONFIG.bookingUrl; a.target = '_blank'; a.rel = 'noopener'; return; }
    if (canDial()) { a.href = `tel:${CONFIG.phone}`; a.dataset.track = 'call_click'; return; }
    a.href = '#callback';
    a.addEventListener('click', (e) => { e.preventDefault(); openCallback(a.dataset.loc || ''); });
  });
  if (!dlg) return;
  $('[data-cb-close]', dlg).addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); }); // click outside the card
  callbackForm(dlg);
}
function openCallback(loc) {
  const dlg = $('#callback');
  if (!dlg) { location.hash = 'contact'; return; }
  const form = $('form', dlg);
  form.source.value = loc; form.page.value = location.pathname;
  dlg.showModal();
  setTimeout(() => form.name.focus(), 50);
  track('callback_open', { location: loc });
}
/* Post a form to the WordPress lead inbox (url-encoded, so no CORS preflight). Throws with a readable message on failure. */
async function sendLead(form, type, extra = {}) {
  const body = new URLSearchParams(new FormData(form));
  body.set('type', type);
  Object.entries(extra).forEach(([k, v]) => body.set(k, v));
  if (import.meta.env.DEV) { console.info('[HashSlash] Dev mode: lead not sent.', Object.fromEntries(body)); return; }
  const res = await fetch(CONFIG.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
  if (!res.ok) {
    const e = new Error(String(res.status));
    try { const j = await res.json(); if (j && j.message && res.status < 500) e.userMessage = j.message; } catch (x) { /* not JSON */ }
    throw e;
  }
}
function callbackForm(dlg) {
  const form = $('form', dlg), send = $('.cb__send', form), errEl = $('.ferr', form);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim(), digits = form.phone.value.replace(/\D/g, '');
    form.name.classList.toggle('is-invalid', !name); form.phone.classList.toggle('is-invalid', digits.length < 7);
    if (!name) { errEl.textContent = 'Your name, please.'; return; }
    if (digits.length < 7) { errEl.textContent = 'Add a phone number we can call.'; return; }
    errEl.textContent = ''; send.disabled = true; send.textContent = 'Sending…';
    track('generate_lead', { lead_type: 'callback', best_time: form.best_time.value, location: form.source.value });
    try {
      await sendLead(form, 'callback');
      location.href = '/thank-you/?type=call';
    } catch (ex) {
      errEl.textContent = ex.userMessage || `Couldn't send that. Call us on ${CONFIG.phone.replace('+91', '+91 ')} or use WhatsApp.`;
      send.disabled = false; send.innerHTML = 'Request my call &rarr;';
    }
  });
}

/* ---------- nav, mega menu, mobile menu ---------- */
function nav() {
  const navEl = $('#nav'), burger = $('.nav__burger'), menu = $('#menu');
  let lastY = scrollY, ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      navEl.classList.toggle('is-scrolled', y > 40);
      if (!menu.hidden || navEl.matches(':focus-within, :hover')) navEl.classList.remove('is-hidden');
      else navEl.classList.toggle('is-hidden', y > lastY && y > 400);
      lastY = y; ticking = false;
    });
  }, { passive: true });

  // glass sheen follows the pointer across the header
  if (matchMedia('(hover: hover)').matches) {
    navEl.addEventListener('pointermove', (e) => {
      const r = navEl.getBoundingClientRect();
      navEl.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    });
  }

  const wrap = $('.mega-wrap'), trig = $('.mega-trigger');
  if (wrap) {
    const set = (v) => trig.setAttribute('aria-expanded', String(v));
    wrap.addEventListener('mouseenter', () => set(true));
    wrap.addEventListener('mouseleave', () => set(false));
    wrap.addEventListener('focusin', () => set(true));
    wrap.addEventListener('focusout', (e) => { if (!wrap.contains(e.relatedTarget)) set(false); });
  }

  const setMenu = (open) => {
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && !prefersReduced()) gsap.from($$('#menu nav > a, #menu nav > details'), { yPercent: 60, opacity: 0, stagger: .05, duration: .6, ease: 'expo.out' });
  };
  burger.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
}

function mobileBar() {
  const bar = $('.mbar'), hero = $('[data-hero], .hero, .svc-hero, .hub-hero'), contact = $('#contact');
  if (!bar || !('IntersectionObserver' in window)) return;
  let heroVisible = !!hero, contactVisible = false;
  const update = () => bar.classList.toggle('is-on', !heroVisible && !contactVisible);
  if (hero) new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; update(); }).observe(hero);
  if (contact) new IntersectionObserver(([e]) => { contactVisible = e.isIntersecting; update(); }, { threshold: .1 }).observe(contact);
  update();
}

function chipFallback() {
  $$('.chip img, .tool img').forEach((img) => {
    const fail = () => img.closest('.chip, .tool').classList.add('is-fallback');
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener('error', fail);
  });
}

/* ---------- shared scroll motion ---------- */
function sharedMotion() {
  gsap.set('.reveal', { y: 60, opacity: 0 });
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%', once: true,
    onEnter: (b) => gsap.to(b, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: .1 })
  });

  if ($('.trust')) gsap.from('.trust__logos li', { opacity: 0, y: 20, stagger: .06, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: '.trust', start: 'top 80%' } });
  if ($('.inds')) gsap.from('.ind', { yPercent: 18, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.inds', start: 'top 80%' } });

  // crossing bands: loop + scroll-velocity boost
  const tracks = $$('.band__track');
  if (tracks.length) {
    const loops = tracks.map((t, i) => gsap.fromTo(t, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 28, ease: 'none', repeat: -1 }));
    $$('.bands').forEach((b) => {
      ScrollTrigger.create({
        trigger: b, start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 350);
          loops.forEach((tw) => gsap.to(tw, { timeScale: boost, duration: .15, overwrite: true, onComplete: () => gsap.to(tw, { timeScale: 1, duration: 1.2, ease: 'power2.out' }) }));
        }
      });
      const st = { trigger: b, start: 'top bottom', end: 'bottom top', scrub: true };
      gsap.fromTo($('.band--lime', b), { rotate: -7 }, { rotate: -2, ease: 'none', scrollTrigger: st });
      gsap.fromTo($('.band--dark', b), { rotate: 7 }, { rotate: 2, ease: 'none', scrollTrigger: { ...st } });
    });
  }

  // process rail + steps
  $$('.steps').forEach((s) => {
    gsap.to($('.steps__fill', s), { scaleY: 1, ease: 'none', scrollTrigger: { trigger: s, start: 'top 60%', end: 'bottom 60%', scrub: true } });
    $$('.step', s).forEach((st) => ScrollTrigger.create({ trigger: st, start: 'top 62%', toggleClass: 'is-on' }));
  });

  if ($('.contact')) {
    gsap.fromTo('.contact__title .line__in', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 70%' } });
    gsap.from('.enquiry', { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 60%' } });
  }
  gsap.fromTo('.footer__word span', { yPercent: 100 }, { yPercent: 0, duration: 1, stagger: .045, ease: 'expo.out', scrollTrigger: { trigger: '.footer__word', start: 'top 95%' } });

  // magnetic CTAs
  if (matchMedia('(pointer: fine)').matches) {
    $$('.magnetic').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .25); yTo((e.clientY - r.top - r.height / 2) * .35);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }
}
function staticState() {
  $$('.step').forEach((s) => s.classList.add('is-on'));
  gsap.set('.steps__fill', { scaleY: 1 });
}

/* ---------- #/. page transition ---------- */
function pageTransition(reduce) {
  const pt = $('.pt'), circle = $('.pt__circle'), mark = $('.pt__mark'), html = document.documentElement;
  if (!pt) return;
  try { sessionStorage.removeItem('hs-pt'); } catch (e) {}

  if (html.classList.contains('pt-in')) {
    const reveal = () => { html.classList.remove('pt-in'); gsap.set([circle, mark], { clearProps: 'all' }); };
    if (reduce) reveal();
    else {
      gsap.timeline({ delay: .05, onComplete: reveal })
        .to(mark, { opacity: 0, scale: .7, duration: .3, ease: 'power2.in' }, 0)
        .fromTo(circle, { scale: 1 }, { scale: 0, duration: .85, ease: 'expo.inOut' }, .1);
      setTimeout(() => { if (html.classList.contains('pt-in')) reveal(); }, 2000); // never leave the page covered
    }
  }
  if (reduce) return;

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    e.preventDefault();
    try { sessionStorage.setItem('hs-pt', '1'); } catch (err) {}
    const x = e.clientX || innerWidth / 2, y = e.clientY || innerHeight / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    gsap.set(circle, { width: r * 2, height: r * 2, left: x - r, top: y - r, margin: 0, scale: 0 });
    pt.classList.add('is-on');
    let gone = false;
    const leave = () => { if (!gone) { gone = true; location.href = url.href; } };
    setTimeout(leave, 1100); // navigate even if animation frames are throttled
    gsap.timeline({ onComplete: leave })
      .to(circle, { scale: 1, duration: .7, ease: 'expo.inOut' })
      .fromTo(mark, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .3, ease: 'back.out(2)' }, '-=.25');
  });
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    pt.classList.remove('is-on'); html.classList.remove('pt-in');
    gsap.set([circle, mark], { clearProps: 'all' });
  });
}

/* ---------- final-CTA wireframe terrain ---------- */
function terrain(reduce) {
  const canvas = $('.terrain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, t = 0, raf = null, visible = false;
  const n = (x, r) => (Math.sin(x * 1.7 + t + r * .3) + Math.sin(x * 3.3 - t * .7 + r * .55) + Math.sin(x * 6.1 + r * .9 + t * .4)) / 3;
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const rows = 26, cols = 90;
    for (let r = 0; r < rows; r++) {
      const z = r / (rows - 1), base = h * .1 + Math.pow(z, 1.5) * h * .95, amp = h * (.12 + z * .5);
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const xn = c / cols, x = w / 2 + (xn - .5) * w * (.55 + z * 1.6);
        const env = Math.exp(-Math.pow((xn - .52) * 3.2, 2)) + .35 * Math.exp(-Math.pow((xn - .2) * 5, 2)) + .3 * Math.exp(-Math.pow((xn - .82) * 5, 2));
        const y = base - env * amp * (.65 + .35 * n(xn * 4, r)) - n(xn * 9, r) * 6 * z;
        c ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = `rgba(215,255,0,${.05 + z * .32})`; ctx.lineWidth = .6 + z * .6; ctx.stroke();
    }
  };
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
  };
  const loop = () => { t += .006; draw(); raf = visible ? requestAnimationFrame(loop) : null; };
  addEventListener('resize', resize); resize();
  if (reduce || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }).observe(canvas);
}

/* ---------- multi-step project enquiry ---------- */
function enquiry() {
  const form = $('#enquiry');
  if (!form) return;
  const steps = $$('.fstep', form);
  const prev = $('[data-prev]', form), next = $('[data-next]', form), submit = $('[data-submit]', form);
  const bar = $('.enquiry__bar span', form), now = $('[data-step-now]', form);
  let cur = 0, begun = false;

  form.addEventListener('input', () => { if (!begun) { begun = true; track('lead_form_start', { location: form.dataset.loc }); } });

  const show = (i) => {
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    prev.hidden = i === 0; next.hidden = i === steps.length - 1; submit.hidden = i !== steps.length - 1;
    bar.style.width = ((i + 1) / steps.length) * 100 + '%'; now.textContent = i + 1;
    const first = $('input, select, textarea', steps[i]);
    if (first && i > 0) first.focus({ preventScroll: true });
  };
  const err = (msg) => { $('.ferr', steps[cur]).textContent = msg; return !msg; };
  const mark = (el, bad) => el.classList.toggle('is-invalid', bad);

  function validate() {
    const fd = new FormData(form);
    if (cur === 0) {
      mark(form.industry, !form.industry.value);
      if (!fd.getAll('services').length) return err('Pick at least one service.');
      if (!form.industry.value) return err('Select your industry.');
    }
    if (cur === 1) {
      const d = form.description; mark(d, !d.value.trim());
      if (!fd.get('budget')) return err('Choose an approximate budget.');
      if (!d.value.trim()) return err('A line or two about the project helps us prepare.');
    }
    if (cur === 2) {
      const { name, email, phone } = form;
      const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      const okPhone = phone.value.replace(/\D/g, '').length >= 7;
      mark(name, !name.value.trim()); mark(email, !okEmail); mark(phone, !okPhone);
      if (!name.value.trim()) return err('Your name, please.');
      if (!okEmail) return err("That email doesn't look right.");
      if (!okPhone) return err('Add a phone number we can reach.');
    }
    return err('');
  }

  next.addEventListener('click', () => { if (!validate()) return; cur++; show(cur); track('lead_form_step', { step: cur + 1, location: form.dataset.loc }); });
  prev.addEventListener('click', () => { cur--; show(cur); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    payload.services = fd.getAll('services');
    payload.page = location.pathname;
    submit.disabled = true; submit.textContent = 'Sending…';
    payload.event_id = track('generate_lead', { services: payload.services.join(', '), industry: payload.industry, budget: payload.budget, location: form.dataset.loc });
    form.page.value = payload.page; form.event_id.value = payload.event_id || '';
    try {
      await sendLead(form, 'enquiry', { services: payload.services.join(', ') });
      location.href = '/thank-you/'; // conversion page (also gives ad platforms a URL to count)
    } catch (ex) {
      err(ex.userMessage || 'Something went wrong sending that. Please try WhatsApp or email instead.');
      submit.disabled = false; submit.innerHTML = 'Send enquiry &rarr;';
    }
  });
  show(0);
}
