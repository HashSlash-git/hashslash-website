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
  const data = chips.map((c) => ({ a: (+c.dataset.a * Math.PI) / 180, r: +c.dataset.r, s: +c.dataset.s }));
  // orbit centre comes from CSS (--cx / --cy); radius stretches/shrinks per side so chips stay on screen
  const centre = () => {
    const cs = getComputedStyle(stage);
    return [parseFloat(cs.getPropertyValue('--cx')) / 100 || .5, parseFloat(cs.getPropertyValue('--cy')) / 100 || .5];
  };
  const chipX = (i) => {
    const c = Math.cos(data[i].a), [cx] = centre();
    const narrow = stage.offsetWidth <= 768 ? .82 : 1; // keep chips inside small screens
    return c * data[i].r * stage.offsetWidth * ((c >= 0 ? 1 - cx : cx) / .5) * narrow;
  };
  const chipY = (i) => {
    const s = Math.sin(data[i].a), [, cy] = centre();
    return s * data[i].r * stage.offsetHeight * 0.82 * ((s >= 0 ? 1 - cy : cy) / .5);
  };

  const mm = gsap.matchMedia();
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 769px)' }, (ctx) => {
    const { motion, desktop } = ctx.conditions;

    if (!motion) {
      gsap.set(chips, { x: chipX, y: chipY, scale: (i) => data[i].s });
      const onR = () => gsap.set(chips, { x: chipX, y: chipY });
      addEventListener('resize', onR);
      return () => removeEventListener('resize', onR);
    }

    /* ---------- hero intro ---------- */
    $$('.scribble path').forEach((p) => { const len = p.getTotalLength(); gsap.set(p, { strokeDasharray: len, strokeDashoffset: len }); });
    gsap.timeline({ defaults: { ease: 'expo.out' }, delay: document.documentElement.classList.contains('pt-in') ? .55 : .15 })
      .to('.hero .line__in', { yPercent: 0, y: 0, duration: 1.25, stagger: .12 })
      .to('.hero__eyebrow', { opacity: 1, y: 0, duration: .8 }, .1)
      .fromTo('.hero__script', { opacity: 0, y: 14, rotate: -14 }, { opacity: 1, y: 0, rotate: -6, duration: .9, stagger: .12, ease: 'back.out(2)' }, '-=.85')
      .to('.scribble path', { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: .2 }, '-=.8')
      .to('.hero__meta > *', { opacity: 1, y: 0, duration: .9, stagger: .1 }, '-=1')
      .fromTo('.badge', { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 1.1, ease: 'back.out(1.6)' }, '-=.9');

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

    const counter = { v: 12 }, numEl = $('.converge__num');
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
      .fromTo(counter, { v: 12 }, { v: 1, duration: 1.4, onUpdate: () => { numEl.textContent = Math.round(counter.v); } }, 0)
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
    return () => { if (onMove) stage.removeEventListener('pointermove', onMove); };
  });
}
