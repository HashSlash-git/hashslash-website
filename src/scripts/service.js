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
        steps.forEach((s, k) => { s.classList.toggle('is-on', k <= i); s.classList.toggle('is-current', k === i); });
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

/* Scale a full-size mock page (designW px wide) into a browser frame; --k is inherited by children.
   inFrame() maps an element inside the scaled page to frame pixels (offset* ignores transforms) for the cursor. */
function fitFrame(browser, fitEl, page, designW) {
  const k = () => fitEl.clientWidth / designW;
  const fit = () => { browser.style.setProperty('--k', k()); fitEl.style.height = Math.ceil(page.offsetHeight * k()) + 'px'; };
  fit();
  ScrollTrigger.addEventListener('refreshInit', fit);
  const inFrame = (el, fx, fy) => {
    let x = 0, y = 0, n = el;
    while (n && n !== fitEl) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x: fitEl.offsetLeft + (x + el.offsetWidth * fx) * k() - 4, y: fitEl.offsetTop + (y + el.offsetHeight * fy) * k() - 3 }; // minus cursor tip
  };
  return { k, inFrame };
}

function buildMoment(root) {
  const type = root.dataset.moment;
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
  const v = $('.moment__visual', root);

  if (type === 'ads') {
    const cards = $$('.adcard', v), win = cards.filter((c) => c.dataset.win === '1'), lose = cards.filter((c) => c.dataset.win !== '1');
    const stats = cards.map((c) => $('.adcard__stats', c));
    tl // 1 launch a batch of creatives
      .fromTo(cards, { y: 140, rotation: (i) => (rand(i + 1) - .5) * 40, opacity: 0, scale: .8 },
        { y: 0, rotation: 0, opacity: 1, scale: 1, duration: .8, stagger: .05, ease: 'back.out(1.4)' }, 0)
      // 2 read the results: scan passes, each ad's numbers appear
      .fromTo($('.mo-ads__scan', v), { top: '0%', opacity: 0 }, { top: '100%', opacity: 1, duration: 1, ease: 'none' }, 1.1)
      .fromTo(stats, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .3, stagger: .06 }, 1.2)
      .to($('.mo-ads__scan', v), { opacity: 0, duration: .2 }, 2.1)
      // 3 cut the losers fast
      .to(lose, { opacity: .38, scale: .94, filter: 'grayscale(1)', duration: .6, stagger: .04 }, 2.1)
      .fromTo(lose.map((c) => $('.adcard__flag--off', c)), { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .3, stagger: .04 }, 2.2)
      // 4 scale the winners
      .to(win, { scale: 1.06, zIndex: 2, boxShadow: '0 0 0 2px rgba(215,255,0,1)', duration: .6, stagger: .08 }, 3)
      .fromTo(win.map((c) => $('.adcard__flag--on', c)), { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .4, stagger: .08, ease: 'back.out(2)' }, 3.15)
      .fromTo(win.map((c) => $('.adcard__cta', c)).filter(Boolean), { backgroundColor: '#262626', color: '#ffffff' }, { backgroundColor: '#d7ff00', color: '#0b0d00', duration: .4, stagger: .08 }, 3.2)
      .to({}, { duration: .4 });
  }

  if (type === 'serp') {
    const browser = $('.browser--serp', v), f = fitFrame(browser, $('.store-fit', v), $('.g', v), 1200);
    const q = $('.mo-q', v), caret = $('.g-search .caret', v), cursor = $('.st-cursor', v), btn = $('.g-search__btn', v);
    const stats = $('.g-stats', v), ad = $('.g-ad', v), shop = $('.g-shop', v), cards = $$('.g-pc', v), org = $('.g-org', v), vid = $('.g-vid', v);
    const prog = $('.g-prog i', v), play = $('.g-play', v);
    const at = (fx, fy) => f.inFrame(btn, fx, fy);
    tl.fromTo(browser, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, 0)
      .fromTo([stats, ad, shop, org, vid], { opacity: 0, y: 24 }, { opacity: 0, y: 24, duration: .01 }, 0)
      // 1 they search: query types out, cursor hits search
      .add(typer(q).duration(.6), .3)
      .fromTo(cursor, { opacity: 0, x: () => at(.5, .5).x + 70, y: () => at(.5, .5).y + 60 }, { opacity: 1, duration: .1 }, .72)
      .to(cursor, { x: () => at(.5, .55).x, y: () => at(.5, .55).y, duration: .28, ease: 'power2.inOut' }, .76)
      .to(btn, { scale: .82, backgroundColor: 'rgba(26,115,232,.15)', duration: .06, yoyo: true, repeat: 1 }, 1.05)
      .to(caret, { opacity: 0, duration: .05 }, 1.05)
      .to(cursor, { opacity: 0, duration: .15 }, 1.2)
      // 2 your ad answers first
      .to([stats, ad], { opacity: 1, y: 0, duration: .4, stagger: .08 }, 1.15)
      .fromTo(ad, { boxShadow: '0 0 0 0px rgba(215,255,0,0)' }, { boxShadow: '0 0 0 4px rgba(215,255,0,1), 0 0 0 5px rgba(11,13,0,.25)', duration: .3 }, 1.6)
      // 3 Shopping & PMax own the page
      .to(shop, { opacity: 1, y: 0, duration: .35 }, 2.0)
      .fromTo(cards, { opacity: 0, y: 30, scale: .94 }, { opacity: 1, y: 0, scale: 1, duration: .4, stagger: .08, ease: 'back.out(1.4)' }, 2.1)
      .to(cards, { boxShadow: '0 0 0 3px rgba(215,255,0,1)', duration: .2, stagger: .06 }, 2.6)
      .to(org, { opacity: .45, y: 0, duration: .35 }, 2.75)
      // 4 video keeps you top of mind
      .to(vid, { opacity: 1, y: 0, duration: .4 }, 3.0)
      .to(play, { scale: 0, opacity: 0, duration: .2 }, 3.35)
      .fromTo(prog, { scaleX: 0 }, { scaleX: .72, duration: .6, ease: 'none' }, 3.4)
      .to({}, { duration: .3 });
  }

  if (type === 'seo') {
    // Search Console-style report laid out at 1000px
    const browser = $('.browser--gsc', v);
    fitFrame(browser, $('.store-fit', v), $('.gsc', v), 1000);
    const count = (el, from, to, dec, suf, at, dur) => {
      const o = { n: from };
      tl.fromTo(o, { n: from }, { n: to, duration: dur, ease: 'power2.inOut', onUpdate: () => { el.textContent = o.n.toFixed(dec) + suf; } }, at);
    };
    const px = $('.gsc-px', v), bar = $('.gsc-px__bar i', v), rows = $$('.gsc-q__r', v), links = $('.gsc-links', v), chips = $$('.gsc-links__chips i', v);
    const lines = $$('.gsc-line', v), pos = $$('.gsc-q__p', v), kpis = $$('.gsc-kpi b', v);
    lines.forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.dataset.len = L; });
    tl.fromTo(browser, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, 0)
      .fromTo([...rows, ...chips], { opacity: 0 }, { opacity: 0, duration: .01 }, 0)
      .fromTo(lines, { strokeDashoffset: (i, p) => +p.dataset.len * .55 }, { strokeDashoffset: (i, p) => +p.dataset.len * .55, duration: .01 }, 0)
      // 1 fix the technical foundations
      .fromTo(px, { boxShadow: '0 0 0 0 rgba(215,255,0,0)' }, { boxShadow: '0 0 0 3px rgba(215,255,0,1)', duration: .3 }, .3)
      .fromTo(bar, { width: '18%' }, { width: '96%', duration: .7, ease: 'power2.inOut' }, .4)
      .to(px, { boxShadow: '0 0 0 0 rgba(215,255,0,0)', duration: .3 }, 1.25);
    count($('.gsc-px__pct', v), 18, 96, 0, '%', .4, .7);
    count($('.gsc-px__lcp', v), 4.8, 1.9, 1, ' s', .4, .7);
    count($('.gsc-px__iss', v), 142, 3, 0, '', .4, .7);
    // 2 match what people search for
    tl.fromTo(rows, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: .3, stagger: .1 }, 1.35)
    // 3 earn authority and links
      .fromTo(links, { boxShadow: '0 0 0 0 rgba(215,255,0,0)' }, { boxShadow: '0 0 0 3px rgba(215,255,0,1)', duration: .3 }, 2.2)
      .fromTo(chips, { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: .25, stagger: .1, ease: 'back.out(2)' }, 2.3)
      .to(links, { boxShadow: '0 0 0 0 rgba(215,255,0,0)', duration: .3 }, 3.0);
    count($('.gsc-links__n', v), 14, 86, 0, '', 2.3, .7);
    // 4 climb, then hold the spot: the lines finish, totals rise, every query moves up
    tl.to(lines, { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut' }, 3.05);
    kpis.forEach((b) => count(b, +b.dataset.from, +b.dataset.to, +b.dataset.dec, b.dataset.suf, 3.05, 1.1));
    pos.forEach((p, i) => {
      const o = { n: +p.dataset.from };
      tl.to(o, { n: +p.dataset.to, duration: .9, ease: 'power2.inOut', onUpdate: () => { p.textContent = Math.round(o.n); } }, 3.1 + i * .05)
        .fromTo(p, { color: '#202124' }, { color: '#137333', duration: .3 }, 3.6 + i * .05);
    });
    tl.to({}, { duration: .3 });
  }

  if (type === 'chat') {
    // ChatGPT-style thread laid out at 760px: ask, answer streams in, sponsored unit, click through
    const browser = $('.browser--gpt', v), f = fitFrame(browser, $('.store-fit', v), $('.gpt', v), 760);
    const q = $('.gpt-input .mo-q', v), caret = $('.gpt-input .caret', v), ph = $('.gpt-input__ph', v), send = $('.gpt-input__send', v);
    const user = $('.gpt-user', v), lines = $$('.gpt-l', v), ad = $('.gpt-ad', v), adBtn = $('.gpt-ad__btn', v), land = $('.gpt-land', v), cursor = $('.st-cursor', v);
    const at = (el, fx, fy) => f.inFrame(el, fx, fy);
    tl.fromTo(browser, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, 0)
      .fromTo([user, ...lines, ad, land], { opacity: 0 }, { opacity: 0, duration: .01 }, 0)
      // 1 a customer asks AI
      .to(ph, { opacity: 0, duration: .1 }, .25)
      .add(typer(q).duration(.6), .3)
      .to(send, { scale: .85, duration: .06, yoyo: true, repeat: 1 }, .95)
      .to([q, caret], { opacity: 0, duration: .1 }, 1.05)
      .to(ph, { opacity: 1, duration: .2 }, 1.1)
      .fromTo(user, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .3 }, 1.05)
      // 2 the assistant answers, line by line
      .fromTo(lines, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .22, stagger: .14 }, 1.3)
      // 3 your brand appears in context
      .fromTo(ad, { opacity: 0, y: 30, scale: .97 }, { opacity: 1, y: 0, scale: 1, duration: .45, ease: 'back.out(1.5)' }, 2.35)
      .fromTo($('.gpt-ad__body', v), { boxShadow: '0 0 0 0 rgba(215,255,0,0)' }, { boxShadow: '0 0 0 3px rgba(215,255,0,1)', duration: .3 }, 2.7)
      // 4 they click through
      .fromTo(cursor, { opacity: 0, x: () => at(adBtn, .5, .5).x - 120, y: () => at(adBtn, .5, .5).y + 90 }, { opacity: 1, duration: .1 }, 3.0)
      .to(cursor, { x: () => at(adBtn, .55, .6).x, y: () => at(adBtn, .55, .6).y, duration: .3, ease: 'power2.inOut' }, 3.05)
      .to(adBtn, { scale: .92, duration: .06, yoyo: true, repeat: 1 }, 3.38)
      .fromTo(land, { opacity: 0, y: 20, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .35, ease: 'back.out(2)' }, 3.5)
      .to(cursor, { opacity: 0, duration: .2 }, 3.7)
      .to({}, { duration: .3 });
  }

  if (type === 'targeting') {
    // LinkedIn Campaign Manager laid out at 900px: criteria narrow the audience, then the ad and Lead Gen Form
    const browser = $('.browser--li', v), f = fitFrame(browser, $('.store-fit', v), $('.li', v), 900);
    const crits = $$('.li-crit', v), num = $('.li-fc__n', v), knob = $('.li-fc__meter b', v), leads = $('.li-fc__leads', v);
    const post = $('.li-post', v), dl = $('.li-post__btn', v), form = $('.li-form', v), fields = $$('.li-field', v), submit = $('.li-form__btn', v), done = $('.li-form__done', v), cursor = $('.st-cursor', v);
    const at = (el, fx, fy) => f.inFrame(el, fx, fy);
    const sizes = [24000000, 2100000, 540000, 96000, 38000, 4200], knobs = [92, 74, 58, 44, 34, 24];
    const fmt = (n) => Math.round(n).toLocaleString('en-US') + (n >= 24000000 ? '+' : '');
    const o = { n: sizes[0] };
    tl.fromTo(browser, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, 0)
      .fromTo([...crits, post, form], { opacity: 0 }, { opacity: 0, duration: .01 }, 0)
      .fromTo(num, { opacity: 0 }, { opacity: 1, duration: .3 }, .3);
    // 2-3 each criterion lands and the forecast shrinks
    crits.forEach((c, k) => {
      const t = .7 + k * .5;
      tl.fromTo(c, { opacity: 0, y: 14, backgroundColor: '#fffbe0' }, { opacity: 1, y: 0, duration: .25 }, t)
        .to(c, { backgroundColor: '#ffffff', duration: .4 }, t + .25)
        .to(o, { n: sizes[Math.min(k + 1, sizes.length - 1)], duration: .45, ease: 'power2.out', onUpdate: () => { num.textContent = fmt(o.n); } }, t + .05)
        .to(knob, { left: knobs[Math.min(k + 1, knobs.length - 1)] + '%', duration: .45 }, t + .05);
    });
    const tEnd = .7 + crits.length * .5;
    tl.call(() => { leads.textContent = tl.time() > tEnd ? '40–70' : '–'; }, null, tEnd)
      // 4 reach the people who sign: sponsored post, Lead Gen Form prefilled, submit
      .fromTo($('.li-scrim', v), { opacity: 0 }, { opacity: 1, duration: .3 }, tEnd + .05)
      .fromTo(post, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .4, ease: 'back.out(1.4)' }, tEnd + .1)
      .fromTo(cursor, { opacity: 0, x: () => at(dl, .5, .5).x - 90, y: () => at(dl, .5, .5).y + 70 }, { opacity: 1, duration: .1 }, tEnd + .45)
      .to(cursor, { x: () => at(dl, .5, .6).x, y: () => at(dl, .5, .6).y, duration: .25, ease: 'power2.inOut' }, tEnd + .5)
      .to(dl, { scale: .9, duration: .06, yoyo: true, repeat: 1 }, tEnd + .78)
      .fromTo(form, { opacity: 0, x: 40, scale: .96 }, { opacity: 1, x: 0, scale: 1, duration: .35 }, tEnd + .9)
      .fromTo(fields, { backgroundColor: '#ffffff' }, { backgroundColor: '#eef5fd', duration: .15, stagger: .08 }, tEnd + 1.1)
      .to(cursor, { x: () => at(submit, .5, .6).x, y: () => at(submit, .5, .6).y, duration: .3, ease: 'power2.inOut' }, tEnd + 1.4)
      .to(submit, { scale: .95, duration: .06, yoyo: true, repeat: 1 }, tEnd + 1.72)
      .fromTo(done, { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .3, ease: 'back.out(2)' }, tEnd + 1.85)
      .to(cursor, { opacity: 0, duration: .2 }, tEnd + 2)
      .to({}, { duration: .3 });
  }

  if (type === 'build') {
    // Demo store: laid out at 1200px, scaled to the browser frame
    const browser = $('.browser--build', v), fitEl = $('.store-fit', v), store = $('.store', v);
    const { k, inFrame } = fitFrame(browser, fitEl, store, 1200); // --k is inherited by the store and the toast

    const regions = $$('.sr', store), txt = $$('.st-x', store), imgs = $$('.st-img', store);
    const btn = $('.st-card .st-btn--cart', store), cartN = $('.st-cart__n', store);
    const cursor = $('.st-cursor', v), toast = $('.st-toast', v), speed = $('.st-speed', v), speedN = $('.st-speed__n', v);
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
    // Workflow builder: one contact runs through the service's steps
    const browser = $('.browser--flow', v);
    fitFrame(browser, $('.store-fit', v), $('.wf', v), 1000);
    const nodes = $$('.wf-node', v), oks = $$('.wf-node__ok', v), lit = $$('.wf-wire--lit', v), rows = $$('.wf-log__row', v);
    const token = $('.wf-token', v), runs = $('.wf-runs__n', v), run = { n: 0 };
    // the token rides the connectors: it enters a node at its left port and leaves from its right port
    const portIn = (i) => nodes[i].offsetLeft - 4, portOut = (i) => nodes[i].offsetLeft + nodes[i].offsetWidth + 4;
    const hit = (i, t) => {
      // token arrives at node i: highlight it, tick it, write the log line
      tl.to(token, { x: () => (i ? portIn(i) : portOut(0)), duration: i ? .32 : .01, ease: 'power1.inOut' }, t - (i ? .32 : 0));
      if (i > 0 && i < nodes.length - 1) tl.set(token, { x: () => portOut(i) }, t + .22);
      tl
        .to(nodes[i], { borderColor: '#1d211c', boxShadow: '0 0 0 3px rgba(215,255,0,1)', duration: .15 }, t)
        .to(nodes[i], { boxShadow: '0 0 0 0px rgba(215,255,0,0)', borderColor: '#cfe3c8', duration: .3 }, t + .3)
        .fromTo(oks[i], { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: .2, ease: 'back.out(2)' }, t + .05)
        .fromTo(rows[i], { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: .2 }, t + .05);
      if (i > 0) tl.fromTo(lit[i - 1], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .32, ease: 'power1.inOut' }, t - .32);
    };
    tl.fromTo(browser, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, 0)
      .fromTo(nodes, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .3, stagger: .06 }, .2)
      .fromTo('.wf-contact', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .3 }, .7)
      .fromTo(token, { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .2 }, .75);
    // 1 something happens
    hit(0, .85);
    // 2 the system reacts instantly: goes live, steps 2 and 3 fire
    tl.to('.wf-switch', { backgroundColor: '#2fbf4a', duration: .2 }, 1.1)
      .to('.wf-switch i', { x: 20, duration: .2 }, 1.1)
      .to('.wf-live__off', { opacity: 0, duration: .15 }, 1.1)
      .to('.wf-live__on', { opacity: 1, duration: .15 }, 1.15);
    hit(1, 1.6);
    hit(2, 2.0);
    // 3 the right follow-up fires
    hit(3, 2.5);
    tl.fromTo('.wf-msg', { opacity: 0, y: 12, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .3, ease: 'back.out(1.6)' }, 2.6);
    // 4 nothing falls through: outcome, stage moves, run counted
    hit(4, 3.2);
    tl.to('.wf-stage__a', { opacity: 0, duration: .15 }, 3.3)
      .fromTo('.wf-stage__b', { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .25, ease: 'back.out(2)' }, 3.3)
      .fromTo(rows[rows.length - 1], { opacity: 0 }, { opacity: 1, duration: .25 }, 3.45)
      .fromTo(run, { n: 0 }, { n: 1, duration: .05, onUpdate: () => { runs.textContent = run.n > .5 ? '1,284' : '1,283'; } }, 3.45)
      .to(token, { opacity: 0, duration: .2 }, 3.6)
      .to({}, { duration: .35 });
  }

  if (type === 'dashboard') {
    // Stockroom growth dashboard, scaled into the browser frame
    const browser = $('.browser--dash', v), f = fitFrame(browser, $('.store-fit', v), $('.db', v), 1200);
    const chips = $$('.db-chip', v), dots = $$('.db-dot', v), kpis = $$('.db-kpi', v), nums = $$('.db-kpi b', v), chg = $$('.db-kpi em', v);
    const bars = $$('.db-bar__track i', v), apply = $('.db-apply', v), applied = $('.db-apply__b', v), cursor = $('.st-cursor', v);
    const fmt = (el, x) => {
      const d = +el.dataset.d, n = d ? x.toFixed(d) : Math.round(x).toLocaleString('en-IN');
      el.textContent = `${el.dataset.p}${n}${el.dataset.s}`;
    };
    tl.fromTo(browser, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, 0)
      // 1 connect every source: chips appear, each dot turns green
      .fromTo(chips, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .3, stagger: .08 }, .3)
      .to(dots, { backgroundColor: '#2fbf4a', scale: 1.3, duration: .15, stagger: .1 }, .55)
      .to(dots, { scale: 1, duration: .15, stagger: .1 }, .7)
      .fromTo('.db-sync', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: .3 }, 1.15)
      // 2 one version of truth: KPI cards count up
      .fromTo(kpis, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .35, stagger: .07 }, 1.2);
    nums.forEach((el) => {
      const o = { x: 0 };
      tl.to(o, { x: +el.dataset.v, duration: .8, ease: 'power2.out', onUpdate: () => fmt(el, o.x), onReverseComplete: () => fmt(el, 0) }, 1.3);
    });
    tl.fromTo(chg, { opacity: 0 }, { opacity: 1, duration: .25, stagger: .06 }, 2.0)
      // 3 what drives revenue: chart draws, channels fill, peak explained
      .fromTo('.db-main', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .35 }, 2.15)
      .fromTo('.db-line', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .8, ease: 'none' }, 2.3)
      .fromTo('.db-prev', { opacity: 0 }, { opacity: 1, duration: .4 }, 2.4)
      .fromTo('.db-area', { opacity: 0 }, { opacity: 1, duration: .5 }, 2.7)
      .fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: .5, stagger: .07, ease: 'power3.out' }, 2.4)
      .fromTo('.db-tip', { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .3, ease: 'back.out(2)', transformOrigin: '0 0' }, 2.95)
      // 4 decide faster: recommendation, click Apply, confirmation
      .fromTo('.db-insight', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .35 }, 3.1)
      .fromTo(cursor, { opacity: 0, x: () => f.inFrame(apply, .5, .5).x - 120, y: () => f.inFrame(apply, .5, .5).y - 70 }, { opacity: 1, duration: .1 }, 3.3)
      .to(cursor, { x: () => f.inFrame(apply, .5, .6).x, y: () => f.inFrame(apply, .5, .6).y, duration: .3, ease: 'power2.inOut' }, 3.35)
      .to(apply, { scale: .9, duration: .07, yoyo: true, repeat: 1 }, 3.68)
      .fromTo(applied, { opacity: 0 }, { opacity: 1, duration: .15 }, 3.76)
      .to({}, { duration: .35 });
  }

  if (type === 'ab') {
    // Experiment dashboard laid out at 1000px: funnel drop-off, hypothesis, 50/50 split, winner shipped
    const browser = $('.browser--xp', v);
    fitFrame(browser, $('.store-fit', v), $('.xp', v), 1000);
    const steps = $$('.xp-step', v), drop = $('.xp-step--drop', v), dropTag = $('.xp-drop', v), hyp = $('.xp-hyp', v);
    const varA = $('.xp-var--a', v), varB = $('.xp-var--b', v), res = $('.xp-res', v), ship = $('.xp-res__ship', v);
    const status = $('.xp-status', v), statusT = $('.xp-status__t', v), dot = $('.xp-status i', v);
    const setStatus = (t, c) => () => { statusT.textContent = t; dot.style.background = c; };
    const count = (el, to, dec, suf, at, dur) => {
      const o = { n: 0 };
      tl.fromTo(o, { n: 0 }, { n: to, duration: dur, ease: 'none', onUpdate: () => { el.textContent = (dec ? o.n.toFixed(dec) : Math.round(o.n).toLocaleString('en-IN')) + suf; } }, at);
    };
    tl.fromTo(browser, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, 0)
      .fromTo([dropTag, hyp, varA, varB, res, ship], { opacity: 0 }, { opacity: 0, duration: .01 }, 0)
      // 1 find the drop-off
      .fromTo(steps, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .3, stagger: .08 }, .2)
      .fromTo(drop, { scale: 1 }, { scale: 1.04, duration: .2, yoyo: true, repeat: 1 }, .75)
      .fromTo(dropTag, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: .25 }, .8)
      // 2 form a hypothesis
      .fromTo(hyp, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: .4, ease: 'back.out(1.4)' }, 1.2)
      .fromTo(hyp, { boxShadow: '0 0 0 0 rgba(215,255,0,0)' }, { boxShadow: '0 0 0 3px rgba(215,255,0,1)', duration: .25, yoyo: true, repeat: 1 }, 1.55)
      // 3 split the traffic: both versions go live, visitors and rates tick up
      .fromTo([varA, varB], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .35, stagger: .1 }, 2.0)
      .call(() => (tl.time() >= 2.05 ? setStatus('Running', '#2f9e44') : setStatus('Draft', '#9aa1b0'))(), null, 2.05)
      .fromTo(res, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: .35 }, 2.3);
    [varA, varB].forEach((card, i) => {
      count($('.xp-vis', card), i ? 12514 : 12480, 0, '', 2.3, 1.2);
      const cr = $('.xp-cr', card); count(cr, +cr.dataset.to, 1, '%', 2.3, 1.2);
    });
    count($('.xp-res__lift span', v), 41.9, 1, '', 2.3, 1.2);
    const prob = $('.xp-res__prob', v), pb = { n: 50 };
    tl.fromTo(pb, { n: 50 }, { n: 98, duration: 1.2, ease: 'power1.in', onUpdate: () => { prob.textContent = Math.round(pb.n) + '%'; } }, 2.3)
      .fromTo($('.xp-res__bar i', v), { width: '50%' }, { width: '98%', duration: 1.2, ease: 'power1.in' }, 2.3)
      // 4 ship the winner (status text follows the playhead in both scroll directions)
      .call(() => (tl.time() >= 3.6 ? setStatus('Winner: B', '#2f9e44') : setStatus('Running', '#2f9e44'))(), null, 3.6)
      .to(varA, { opacity: .35, scale: .97, filter: 'grayscale(1)', duration: .4 }, 3.6)
      .to(varB, { boxShadow: '0 0 0 3px rgba(215,255,0,1)', duration: .3 }, 3.6)
      .to(status, { backgroundColor: '#d3f9d8', duration: .3 }, 3.6)
      .fromTo(ship, { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .35, ease: 'back.out(2)' }, 3.75)
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
