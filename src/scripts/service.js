/* ==========================================================
   HashSlash: service, hub & services-index pages
   ========================================================== */
import { gsap, ScrollTrigger, $, $$, track, prefersReduced } from './core.js';

export function initService() {
  signs();
  calculators();
  const reduce = prefersReduced();
  const moment = $('.moment');

  if (reduce) {
    if (moment) buildMoment(moment).progress(1);
    $$('.moment__steps li').forEach((li) => li.classList.add('is-on'));
    return;
  }

  /* ---------- hero intro ---------- */
  const delay = document.documentElement.classList.contains('pt-in') ? .55 : .1;
  const hero = $('.svc-hero, .hub-hero');
  if (hero) {
    const tl = gsap.timeline({ delay, defaults: { ease: 'expo.out' } });
    tl.fromTo($$('.line__in', hero), { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.2, stagger: .08 })
      .fromTo($$('.crumbs, .svc-hero__eye, .svc-hero__lede, .svc-hero__for, .hero__ctas, .hub-hero__meta', hero), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .07 }, .2);
    const orb = $('.svc-orb', hero);
    if (orb) {
      tl.fromTo(orb, { scale: .6, opacity: 0, rotate: -40 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.4, ease: 'expo.out' }, .1);
      const p = $('.svc-orb__scribble path', orb);
      if (p) { const len = p.getTotalLength(); gsap.set(p, { strokeDasharray: len, strokeDashoffset: len }); tl.to(p, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, .8); }
      tl.fromTo('.svc-orb__script', { opacity: 0, rotate: -20, scale: .6 }, { opacity: 1, rotate: -8, scale: 1, duration: .8, ease: 'back.out(2)' }, 1);
      gsap.to(orb, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    }
    const no = $('.hub-hero__no', hero);
    if (no) gsap.fromTo(no, { yPercent: 0 }, { yPercent: 30, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* ---------- signature moment (pinned + scrubbed) ---------- */
  if (moment) {
    const tl = buildMoment(moment);
    const steps = $$('.moment__steps li', moment);
    const bar = $('.moment__bar span', moment);
    tl.paused(false);
    ScrollTrigger.create({
      trigger: moment, start: 'top top', end: () => '+=' + Math.round(innerHeight * 2.2),
      pin: true, scrub: 1, animation: tl, invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: (self) => {
        const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999));
        steps.forEach((s, k) => s.classList.toggle('is-on', k <= i));
        bar.style.transform = `scaleX(${self.progress})`;
      }
    });
  }

  /* ---------- pairs map ---------- */
  if ($('.pairs')) {
    gsap.timeline({ scrollTrigger: { trigger: '.pairs__map', start: 'top 75%' } })
      .fromTo('.pairs__core', { scale: 0, rotate: -60 }, { scale: 1, rotate: 0, duration: .9, ease: 'back.out(1.8)' })
      .fromTo('.pairs__link', { scaleX: 0 }, { scaleX: 1, duration: .6, ease: 'power3.out' }, '-=.4')
      .fromTo('.pair', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .12, ease: 'expo.out' }, '-=.3');
  }
}

/* ==========================================================
   Moments: each returns a paused timeline of ~4 units (one per step)
   ========================================================== */
function typer(el, from = 0, to) {
  const q = el.dataset.q || '';
  const o = { n: 0 };
  return gsap.fromTo(o, { n: from }, { n: to ?? q.length, ease: 'none', onUpdate: () => { el.textContent = q.slice(0, Math.round(o.n)); } });
}
const rand = (seed) => { const x = Math.sin(seed * 999) * 10000; return x - Math.floor(x); };

function buildMoment(root) {
  const type = root.dataset.moment;
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
  const v = $('.moment__visual', root);

  if (type === 'ads') {
    const cards = $$('.adcard', v), win = cards.filter((c) => c.dataset.win === '1'), lose = cards.filter((c) => c.dataset.win !== '1');
    tl.fromTo(cards, { y: 140, rotation: (i) => (rand(i + 1) - .5) * 40, opacity: 0, scale: .8 },
      { y: 0, rotation: 0, opacity: 1, scale: 1, duration: .8, stagger: .05, ease: 'back.out(1.4)' }, 0)
      .fromTo($('.mo-ads__scan', v), { top: '0%', opacity: 0 }, { top: '100%', opacity: 1, duration: 1, ease: 'none' }, 1.1)
      .to($('.mo-ads__scan', v), { opacity: 0, duration: .2 }, 2.1)
      .to(lose, { opacity: .16, scale: .9, filter: 'grayscale(1)', duration: .6, stagger: .04 }, 2.1)
      .to(win, { scale: 1.07, boxShadow: '0 0 0 2px #d7ff00, 0 30px 60px -20px rgba(215,255,0,.45)', duration: .6, stagger: .08 }, 3)
      .fromTo(win.map((w) => $('.adcard__win', w)), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .4, stagger: .08 }, 3.2)
      .to({}, { duration: .4 });
  }

  if (type === 'serp' || type === 'seo') {
    const q = $('.mo-q', v);
    tl.fromTo($('.browser', v), { y: 60, opacity: 0, rotateX: 18 }, { y: 0, opacity: 1, rotateX: 0, duration: .6 }, 0)
      .add(typer(q).duration(.8), .3);
    if (type === 'serp') {
      tl.fromTo('.serp .r--ad', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .5 }, 1.2)
        .to('.serp .r--ad', { borderColor: '#d7ff00', duration: .3 }, 1.6)
        .fromTo('.serp .shop', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .4, stagger: .08 }, 2)
        .fromTo('.serp .r--org', { opacity: 0 }, { opacity: .5, duration: .4 }, 2.5)
        .fromTo('.serp .r--yt', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .5 }, 3)
        .to('.serp .r--yt .yt', { backgroundColor: '#d7ff00', duration: .3 }, 3.4)
        .to({}, { duration: .3 });
    } else {
      const rows = $$('.seo .r', v), you = $('.r--you', v), others = rows.filter((r) => r !== you);
      const gap = () => parseFloat(getComputedStyle(you.parentElement).rowGap) || 0;
      const up = () => -others.reduce((h, r) => h + r.offsetHeight + gap(), 0);   // you climb past every other row
      const down = () => you.offsetHeight + gap();                                // each other row drops one slot
      const num = $('.seo__num', v), o = { n: 28 };
      tl.fromTo(rows, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: .4, stagger: .05 }, 1)
        .fromTo(you, { y: 0 }, { y: up, duration: 2, ease: 'power2.inOut' }, 1.5)
        .fromTo(others, { y: 0 }, { y: down, duration: 2, ease: 'power2.inOut' }, 1.5)
        .fromTo(o, { n: 28 }, { n: 1, duration: 2, ease: 'power2.inOut', onUpdate: () => { num.textContent = Math.round(o.n); } }, 1.5)
        .to(you, { boxShadow: '0 0 0 2px #d7ff00, 0 20px 50px -20px rgba(215,255,0,.5)', duration: .4 }, 3.5)
        .to({}, { duration: .3 });
    }
  }

  if (type === 'chat') {
    const q = $('.mo-q', v);
    tl.fromTo('.chatwin', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: .5 }, 0)
      .fromTo('.bubble--user', { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .3 }, .2)
      .add(typer(q).duration(.7), .3)
      .fromTo('.bubble--ai', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .3 }, 1.1)
      .fromTo('.bubble--ai .ln', { scaleX: 0 }, { scaleX: 1, duration: .5, stagger: .2, ease: 'none' }, 1.2)
      .fromTo('.sponsor', { y: 40, opacity: 0, scale: .95 }, { y: 0, opacity: 1, scale: 1, duration: .6, ease: 'back.out(1.6)' }, 2.1)
      .fromTo('.sources', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .4 }, 3)
      .fromTo('.src--you', { scale: .8 }, { scale: 1.12, duration: .4, ease: 'back.out(3)' }, 3.3)
      .to({}, { duration: .3 });
  }

  if (type === 'targeting') {
    const dots = $$('.tgt__dots i', v), chips = $$('.tgt__f', v);
    const keep = [.62, .38, .2, .1, .05];
    dots.forEach((d, i) => { d.dataset.r = rand(i + 7).toFixed(3); });
    tl.fromTo(dots, { scale: 0 }, { scale: 1, duration: .5, stagger: { each: .004, from: 'random' } }, 0);
    chips.forEach((c, k) => {
      const t = .6 + k * .6;
      const gone = dots.filter((d) => +d.dataset.r >= keep[k] && (k === 0 || +d.dataset.r < keep[k - 1]));
      tl.to(c, { backgroundColor: '#d7ff00', color: '#0b0d00', borderColor: '#d7ff00', duration: .2 }, t)
        .to(gone, { opacity: .1, scale: .6, duration: .4, stagger: .003 }, t + .1);
    });
    const survivors = dots.filter((d) => +d.dataset.r < keep[keep.length - 1]);
    tl.to(survivors, { backgroundColor: '#d7ff00', scale: 1.8, boxShadow: '0 0 14px #d7ff00', duration: .4 }, 3.6)
      .fromTo('.leadform', { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: .5, ease: 'back.out(1.4)' }, 3.7)
      .to({}, { duration: .3 });
  }

  if (type === 'build') {
    // Demo store: laid out at 1200px, scaled to the browser frame
    const browser = $('.browser--build', v), fitEl = $('.store-fit', v), store = $('.store', v);
    const k = () => fitEl.clientWidth / 1200;
    const fit = () => { browser.style.setProperty('--k', k()); /* inherited by the store and the toast */ fitEl.style.height = Math.ceil(store.offsetHeight * k()) + 'px'; };
    fit();
    ScrollTrigger.addEventListener('refreshInit', fit);

    const regions = $$('.sr', store), txt = $$('.st-x', store), imgs = $$('.st-img', store);
    const btn = $('.st-card .st-btn--cart', store), cartN = $('.st-cart__n', store);
    const cursor = $('.st-cursor', v), toast = $('.st-toast', v), speed = $('.st-speed', v), speedN = $('.st-speed__n', v);
    // position of an element inside the scaled store, in browser-frame pixels (offset* ignores transforms)
    const inFrame = (el, fx, fy) => {
      let x = 0, y = 0, n = el;
      while (n && n !== fitEl) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      return { x: fitEl.offsetLeft + (x + el.offsetWidth * fx) * k() - 4, y: fitEl.offsetTop + (y + el.offsetHeight * fy) * k() - 3 }; // minus cursor tip
    };
    const cart = { v: 0 }, score = { v: 0 };

    tl.fromTo(browser, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, 0)
      // 1 wireframe: dashed blocks assemble
      .fromTo(store, { '--wire': 1 }, { '--wire': 1, duration: .01 }, 0)
      .fromTo(regions, { x: (i) => (rand(i + 3) - .5) * 320, y: (i) => (rand(i + 9) - .5) * 260, rotation: (i) => (rand(i + 5) - .5) * 24, opacity: 0, scale: .82 },
        { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: .9, stagger: .05, ease: 'back.out(1.2)' }, .2)
      .fromTo(txt, { opacity: 0, y: 14 }, { opacity: 0, y: 14, duration: .01 }, 0)
      .fromTo(imgs, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 100% 0 0)', duration: .01 }, 0)
      // 2 design: outlines dissolve, real text and UI arrive
      .to(store, { '--wire': 0, duration: .6, ease: 'none' }, 1.7)
      .to(txt, { opacity: 1, y: 0, duration: .45, stagger: .025, ease: 'power3.out' }, 1.8)
      // 3 build: photography wipes in
      .to(imgs, { clipPath: 'inset(0 0% 0 0)', duration: .6, stagger: .08, ease: 'power3.inOut' }, 2.45)
      // 4 measure: a shopper adds to cart, speed score lands
      .fromTo(cursor, { opacity: 0, x: () => fitEl.offsetWidth * .9, y: () => fitEl.offsetTop + fitEl.offsetHeight * .98 }, { opacity: 1, duration: .15 }, 3.1)
      .to(cursor, { x: () => inFrame(btn, .5, .6).x, y: () => inFrame(btn, .5, .6).y, duration: .45, ease: 'power2.inOut' }, 3.15)
      .to(btn, { scale: .9, duration: .07, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 3.62)
      .fromTo(cart, { v: 0 }, { v: 1, duration: .04, onUpdate: () => { cartN.textContent = cart.v > .5 ? '3' : '2'; } }, 3.72)
      .fromTo(cartN, { scale: 1 }, { scale: 1.7, duration: .1, yoyo: true, repeat: 1 }, 3.72)
      .fromTo(toast, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: .25 }, 3.76)
      .fromTo(speed, { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: .25 }, 3.0)
      .fromTo(score, { v: 0 }, { v: 98, duration: .8, ease: 'power2.out', onUpdate: () => { speedN.textContent = Math.round(score.v); } }, 3.05)
      .to({}, { duration: .3 });
  }

  if (type === 'phone') {
    tl.fromTo('.phone', { y: 120, rotate: -12, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: .8, ease: 'expo.out' }, 0)
      .to('.phone__screens', { xPercent: -100 / 3, duration: .7, ease: 'power3.inOut' }, 1.1)
      .to('.phone__screens', { xPercent: -200 / 3, duration: .7, ease: 'power3.inOut' }, 2.1)
      .fromTo('.push', { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'back.out(1.6)' }, 3.1)
      .to({}, { duration: .4 });
  }

  if (type === 'flow') {
    const wrap = $('.flow', v), svg = $('.flow__svg', v), nodes = $$('.node', v);
    const ns = 'http://www.w3.org/2000/svg';
    const paths = nodes.slice(1).map(() => { const p = document.createElementNS(ns, 'path'); p.setAttribute('class', 'flow__path'); svg.appendChild(p); return p; });
    const pulses = nodes.slice(1).map(() => { const p = document.createElementNS(ns, 'path'); p.setAttribute('class', 'flow__pulse'); svg.appendChild(p); return p; });
    const layout = () => {
      const b = wrap.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
      nodes.slice(1).forEach((n, i) => {
        const a = nodes[i].getBoundingClientRect(), c = n.getBoundingClientRect();
        const x1 = a.left + a.width / 2 - b.left, y1 = a.top + a.height / 2 - b.top;
        const x2 = c.left + c.width / 2 - b.left, y2 = c.top + c.height / 2 - b.top;
        const horiz = Math.abs(x2 - x1) > Math.abs(y2 - y1);
        const d = horiz ? `M${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}` : `M${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`;
        paths[i].setAttribute('d', d); pulses[i].setAttribute('d', d);
        const L = paths[i].getTotalLength();
        paths[i].style.strokeDasharray = L;
        paths[i].dataset.len = L;
      });
    };
    layout();
    ScrollTrigger.addEventListener('refreshInit', layout);
    nodes.forEach((n, i) => {
      tl.fromTo(n, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .4, ease: 'back.out(2)' }, i * .75);
      if (i > 0) tl.fromTo(paths[i - 1], { strokeDashoffset: () => +paths[i - 1].dataset.len }, { strokeDashoffset: 0, duration: .5, ease: 'none' }, i * .75 - .45);
    });
    tl.to(nodes[nodes.length - 1], { backgroundColor: '#d7ff00', color: '#0b0d00', boxShadow: '0 0 40px rgba(215,255,0,.45)', duration: .4 }, 3.4)
      .fromTo(pulses, { opacity: 0 }, { opacity: 1, duration: .3 }, 3.5)
      .to({}, { duration: .3 });
  }

  if (type === 'dashboard') {
    const line = $('.dash__line', v), L = line.getTotalLength();
    const sparks = $$('.kpi path', v);
    gsap.set(line, { strokeDasharray: L, strokeDashoffset: L });
    sparks.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
    tl.fromTo('.dash', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: .5 }, 0)
      .fromTo('.kpi', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .4, stagger: .1 }, .3)
      .to(sparks, { strokeDashoffset: 0, duration: .8, stagger: .1, ease: 'none' }, .8)
      .to(line, { strokeDashoffset: 0, duration: 1.4, ease: 'none' }, 1.5)
      .fromTo('.dash__area', { opacity: 0 }, { opacity: 1, duration: .8 }, 2.2)
      .fromTo('.dash__bars span', { scaleY: 0 }, { scaleY: 1, duration: .5, stagger: .08, ease: 'back.out(1.4)' }, 2.8)
      .to({}, { duration: .3 });
  }

  if (type === 'ab') {
    tl.fromTo('.ab__v', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .15 }, 0)
      .fromTo('.ab__v--b .btnx', { backgroundColor: 'rgba(255,255,255,.15)' }, { backgroundColor: '#d7ff00', duration: .4 }, 1)
      .fromTo('.ab__v--a .ab__meter span', { scaleX: 0 }, { scaleX: .42, duration: 1.2, ease: 'none' }, 1.6)
      .fromTo('.ab__v--b .ab__meter span', { scaleX: 0 }, { scaleX: .74, duration: 1.2, ease: 'none' }, 1.6)
      .fromTo('.ab__win', { scale: 0, rotate: -20 }, { scale: 1, rotate: -6, duration: .4, ease: 'back.out(2.5)' }, 2.9)
      .to('.ab__v--a', { opacity: .2, scale: .92, filter: 'grayscale(1)', duration: .5 }, 3.2)
      .to('.ab__v--b', { scale: 1.06, boxShadow: '0 0 0 2px #d7ff00', duration: .5 }, 3.2)
      .to({}, { duration: .3 });
  }
  return tl;
}

/* ==========================================================
   "Sounds familiar?" self-qualifier
   ========================================================== */
function signs() {
  const box = $('.signs');
  if (!box) return;
  const btns = $$('.sign', box), msg = $('.signs__msg', box);
  const msgs = ['Tap the ones that sound like you.', 'One is a warning sign. Worth a look.', "That's a pattern. Let's fix it.", "That's a pattern. Let's fix it.", 'All of them? We should talk today.'];
  let tracked = false;
  btns.forEach((b) => b.addEventListener('click', () => {
    b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
    const n = btns.filter((x) => x.getAttribute('aria-pressed') === 'true').length;
    msg.textContent = msgs[Math.min(n, msgs.length - 1)];
    box.classList.toggle('has-picks', n > 0);
    if (n >= 2 && !tracked) { tracked = true; track('qualifier_match', { count: n }); }
    if (!prefersReduced()) gsap.fromTo(msg, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: .35 });
  }));
}

/* ==========================================================
   Calculators
   ========================================================== */
function calculators() {
  $$('[data-calc]').forEach((root) => {
    const type = root.dataset.calc;
    const get = (k) => parseFloat($(`[data-k="${k}"]`, root).value) || 0;
    const out = (k) => $(`[data-out="${k}"]`, root);
    const fmt = (n, d = 0) => (isFinite(n) ? n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }) : '∞');
    const vals = {};
    const set = (k, n, d, suf = '') => {
      const el = out(k), from = vals[k] ?? n; vals[k] = n;
      if (prefersReduced() || !isFinite(n)) { el.textContent = fmt(n, d) + suf; return; }
      const o = { v: from };
      gsap.to(o, { v: n, duration: .5, ease: 'power2.out', overwrite: true, onUpdate: () => { el.textContent = fmt(o.v, d) + suf; } });
    };
    const run = () => {
      if (type === 'roas') {
        const m = get('margin') / 100, p = get('profit') / 100;
        set('be', m > 0 ? 1 / m : Infinity, 2, 'x');
        set('target', m - p > 0 ? 1 / (m - p) : Infinity, 2, 'x');
        set('cpa', get('aov') * m, 0);
      } else if (type === 'leads') {
        const rate = get('close') / 100;
        const leads = rate > 0 ? Math.ceil(get('cust') / rate) : Infinity;
        const budget = leads * get('cpl');
        set('leads', leads, 0); set('budget', budget, 0); set('cac', get('cust') > 0 ? budget / get('cust') : 0, 0);
      } else if (type === 'cro') {
        const now = get('sess') * get('cr') / 100 * get('aov');
        const next = get('sess') * get('tcr') / 100 * get('aov');
        set('now', now, 0); set('next', next, 0); set('year', Math.max(0, (next - now) * 12), 0);
      }
    };
    let used = false;
    root.addEventListener('input', () => { if (!used) { used = true; track('calculator_used', { calculator: type }); } run(); });
    run();
  });
}
