/* ==========================================================
   HashSlash: homepage motion (hero, #/. converge, manifesto, work)
   ========================================================== */
import { gsap, ScrollTrigger, $, $$ } from './core.js';

export function splitWords(root) {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) walk(child);
    });
  };
  walk(root);
  return $$('.w', root);
}

export function initHome() {
  const stage = $('.converge__stage');
  const chips = $$('.chip');
  // orbit centre comes from CSS (--cx / --cy)
  const centre = () => {
    const cs = getComputedStyle(stage);
    return [parseFloat(cs.getPropertyValue('--cx')) / 100 || .5, parseFloat(cs.getPropertyValue('--cy')) / 100 || .5];
  };

  /* Orbit layout: every visible chip gets an evenly spaced angle on an arc that skips the headline
     (bottom-left on desktop, the whole bottom on mobile), alternating between an inner and outer ring.
     Distances are measured from the core's edge to the stage edge, so chips never overlap the core or get clipped. */
  let layout = [];
  const computeLayout = () => {
    const W = stage.offsetWidth, H = stage.offsetHeight, [cx, cy] = centre();
    const mobile = W <= 768;
    const vis = chips.filter((c) => c.offsetParent !== null);
    const size = vis[0] ? vis[0].firstElementChild.offsetWidth : 80, half = size / 2;
    const coreR = $('.core').offsetWidth / 2 + 18;        // core plus its dashed ring
    const pad = mobile ? 10 : 20;
    const top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const room = {                                          // free space from the core centre to each edge
      l: cx * W - pad - half, r: (1 - cx) * W - pad - half,
      t: cy * H - top - 28 - half, b: (1 - cy) * H - (mobile ? 170 : 120) - half
    };
    const [from, to] = mobile ? [140, 400] : [168, 440];  // degrees, 0 = right, 90 = down
    const minR = coreR + half + 6;
    const at = (deg, ring) => {
      const a = (deg * Math.PI) / 180, cos = Math.cos(a), sin = Math.sin(a);
      const spanX = Math.max((cos >= 0 ? room.r : room.l) - minR, 0);
      const spanY = Math.max((sin >= 0 ? room.b : room.t) - minR, 0);
      return { x: cos * (minR + ring * spanX), y: sin * (minR + ring * spanY) };
    };
    // space chips by distance along the orbit (not equal angles), so roomier sides hold more chips
    const N = 240, pts = [], len = [0];
    for (let i = 0; i <= N; i++) pts.push(from + ((to - from) * i) / N);
    for (let i = 1; i <= N; i++) { const p = at(pts[i - 1], .7), q = at(pts[i], .7); len.push(len[i - 1] + Math.hypot(q.x - p.x, q.y - p.y)); }
    const degAt = (d) => { let i = 1; while (i < N && len[i] < d) i++; const t = (d - len[i - 1]) / (len[i] - len[i - 1] || 1); return pts[i - 1] + t * (pts[i] - pts[i - 1]); };
    const P = vis.map((c, k) => at(degAt((len[N] * k) / Math.max(vis.length - 1, 1)), k % 2 ? .3 : 1)); // alternate outer / inner ring

    // settle: nudge chips apart until none touch, keeping them off the core, headline, counter and screen edges
    const gap = mobile ? 8 : 14, S = size + gap;
    const ox = cx * W, oy = cy * H;                         // core centre in stage pixels
    const keepOut = ['.converge__title', '.converge__count', '.converge__kicker'].map((sel) => {
      const el = $(sel, stage); if (!el) return null;      // offset* ignores scroll transforms
      return { l: el.offsetLeft - ox - half - gap, r: el.offsetLeft + el.offsetWidth - ox + half + gap,
               t: el.offsetTop - oy - half - gap, b: el.offsetTop + el.offsetHeight - oy + half + gap };
    }).filter(Boolean);
    const clamp = (p) => { p.x = Math.min(Math.max(p.x, -room.l), room.r); p.y = Math.min(Math.max(p.y, -room.t), room.b); };
    for (let it = 0; it < 160; it++) {
      for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
        const dx = P[j].x - P[i].x, dy = P[j].y - P[i].y, px = S - Math.abs(dx), py = S - Math.abs(dy);
        if (px > 0 && py > 0) {                             // overlap: push apart along the shallower axis
          if (px < py) { const m = (px / 2) * Math.sign(dx || 1); P[i].x -= m; P[j].x += m; }
          else { const m = (py / 2) * Math.sign(dy || 1); P[i].y -= m; P[j].y += m; }
        }
      }
      P.forEach((p) => {
        const d = Math.hypot(p.x, p.y);
        if (d < minR) { const k = minR / (d || 1); p.x *= k; p.y *= k; }
        keepOut.forEach((z) => {
          if (p.x > z.l && p.x < z.r && p.y > z.t && p.y < z.b) {
            const out = [[p.x - z.l, 'x', z.l], [z.r - p.x, 'x', z.r], [p.y - z.t, 'y', z.t], [z.b - p.y, 'y', z.b]].sort((a, b) => a[0] - b[0])[0];
            p[out[1]] = out[2];
          }
        });
        clamp(p);
      });
    }
    layout = chips.map(() => null);
    vis.forEach((c, k) => { layout[chips.indexOf(c)] = P[k]; });
    const num = $('.converge__num'); if (num) num.textContent = vis.length;
  };
  const chipX = (i) => (layout[i] ? layout[i].x : 0);
  const chipY = (i) => (layout[i] ? layout[i].y : 0);
  const data = chips.map(() => ({ s: 1 }));

  const mm = gsap.matchMedia();
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 769px)' }, (ctx) => {
    const { motion, desktop } = ctx.conditions;
    computeLayout();
    ScrollTrigger.addEventListener('refreshInit', computeLayout); // re-measure on resize before positions are re-read

    if (!motion) {
      gsap.set(chips, { x: chipX, y: chipY, scale: (i) => data[i].s });
      const onR = () => { computeLayout(); gsap.set(chips, { x: chipX, y: chipY }); };
      addEventListener('resize', onR);
      return () => removeEventListener('resize', onR);
    }

    /* hero intro runs in CSS (global.css, 'Homepage hero intro') so it starts at first paint */

    const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero__line--1', { xPercent: -6, ease: 'none', scrollTrigger: heroST });
    gsap.to('.hero__line--3', { xPercent: 6, ease: 'none', scrollTrigger: { ...heroST } });
    gsap.to('.hero__bg', { yPercent: 25, ease: 'none', scrollTrigger: { ...heroST } });
    gsap.to('.hero__meta', { yPercent: -30, opacity: .2, ease: 'none', scrollTrigger: { ...heroST } });

    /* ---------- #/. converge ---------- */
    const core = $('.core');
    gsap.set(chips, { x: chipX, y: chipY, scale: (i) => data[i].s });
    $$('.chip__in').forEach((el, i) => gsap.to(el, {
      y: gsap.utils.random(-14, 14), rotation: gsap.utils.random(-8, 8),
      duration: gsap.utils.random(2.2, 3.6), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .08
    }));
    let onMove;
    if (desktop && matchMedia('(pointer: fine)').matches) {
      const orbit = $('.orbit');
      const ox = gsap.quickTo(orbit, 'x', { duration: 1.2, ease: 'power3' });
      const oy = gsap.quickTo(orbit, 'y', { duration: 1.2, ease: 'power3' });
      onMove = (e) => { ox((e.clientX / innerWidth - .5) * -40); oy((e.clientY / innerHeight - .5) * -30); };
      stage.addEventListener('pointermove', onMove);
    }
    gsap.fromTo('.converge__title .line__in', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.converge', start: 'top 55%' } });

    const total = layout.filter(Boolean).length, counter = { v: total }, numEl = $('.converge__num');
    // core is off-centre now: cover the distance to the farthest corner
    const coverScale = () => {
      const [cx, cy] = centre(), W = stage.offsetWidth, H = stage.offsetHeight;
      return (2 * Math.hypot(Math.max(cx, 1 - cx) * W, Math.max(cy, 1 - cy) * H) / core.offsetWidth) * 1.06;
    };
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: '.converge', start: 'top top', end: () => '+=' + innerHeight * 2.6, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 }
    })
      .fromTo(chips,
        { x: chipX, y: chipY, scale: (i) => data[i].s, rotation: 0, opacity: 1 },
        { x: 0, y: 0, scale: .15, rotation: (i) => (i % 2 ? 200 : -200), opacity: 0, ease: 'power2.in', duration: 1, stagger: { each: .05, from: 'edges' } }, 0)
      .fromTo(counter, { v: total }, { v: 1, duration: 1.4, onUpdate: () => { numEl.textContent = Math.round(counter.v); } }, 0)
      .to(core, { scale: 1.25, rotation: -8, duration: .9, ease: 'power1.inOut' }, .25)
      .to(core, { scale: 1, rotation: 0, duration: .35, ease: 'back.out(3)' }, 1.15)
      .to('.core__ring', { opacity: 0, scale: 1.6, duration: .4 }, 1.1)
      .to('.converge__title', { yPercent: -40, opacity: 0, filter: 'blur(8px)', duration: .45, ease: 'power2.in' }, 1.35)
      .to('.converge__kicker, .converge__count', { opacity: 0, duration: .3 }, 1.35)
      .to('.core__mark', { scale: .4, opacity: 0, duration: .35 }, 1.55)
      .to(core, { scale: coverScale, backgroundColor: '#d7ff00', duration: 1.1, ease: 'power3.in' }, 1.55);

    /* ---------- manifesto ---------- */
    const words = splitWords($('[data-words]'));
    gsap.fromTo(words, { opacity: .12 }, { opacity: 1, ease: 'none', stagger: .1, scrollTrigger: { trigger: '.manifesto', start: 'top 65%', end: 'bottom 75%', scrub: true } });
    gsap.from('.manifesto__script', { scale: 0, rotate: -30, duration: .9, ease: 'back.out(2.2)', scrollTrigger: { trigger: '.manifesto__foot', start: 'top 85%' } });

    /* ---------- horizontal work (desktop) ---------- */
    if (desktop && $('.work')) { // the work section only renders once a case study is approved
      const head = $('.work__head'), track = $('.work__track');
      const dist = () => head.offsetWidth + track.scrollWidth - innerWidth;
      gsap.to([head, track], { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.work', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
    }
    return () => { if (onMove) stage.removeEventListener('pointermove', onMove); ScrollTrigger.removeEventListener('refreshInit', computeLayout); };
  });
}
