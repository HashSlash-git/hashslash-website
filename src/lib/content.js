/* ==========================================================
   Content source for the build.
   - WP_URL set  -> content comes from WordPress (headless, REST API)
   - WP_URL unset -> built-in fallback content in src/data/*
   Runs at build time only; nothing here ships to the browser.
   ========================================================== */
import sanitizeHtml from 'sanitize-html';
import { services as localServices } from '../data/services.js';
import { industries as localIndustries } from '../data/industries.js';

const WP_URL = (import.meta.env.WP_URL || process.env.WP_URL || '').replace(/\/$/, '');
export const usingWordPress = Boolean(WP_URL);

/* ---------- helpers ---------- */
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };
export const decode = (s = '') => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
const text = (s) => decode(String(s || '')).replace(/<[^>]*>/g, '').trim();
const lines = (s) => String(s || '').split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
const csv = (s) => String(s || '').split(',').map((x) => x.trim()).filter(Boolean);
const pairsOf = (s) => lines(s).map((l) => { const [a, ...b] = l.split('||'); return [a.trim(), b.join('||').trim()]; }).filter(([a, b]) => a && b);
const faqs = (s) => pairsOf(s).map(([q, a]) => ({ q, a }));

/** Allow-listed HTML for WordPress page/post bodies (the old site was compromised: never trust raw HTML). */
export const clean = (html = '') => sanitizeHtml(html, {
  allowedTags: ['h2', 'h3', 'h4', 'p', 'a', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'blockquote', 'figure', 'figcaption', 'img', 'hr', 'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'code', 'pre', 'iframe'],
  allowedAttributes: { a: ['href', 'target', 'rel'], img: ['src', 'alt', 'width', 'height', 'loading', 'srcset', 'sizes'], iframe: ['src', 'title', 'allow', 'allowfullscreen'], th: ['scope'] },
  allowedSchemes: ['https', 'mailto', 'tel'],
  allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com'],
  transformTags: {
    a: (tag, attribs) => ({ tagName: 'a', attribs: attribs.target === '_blank' ? { ...attribs, rel: 'noopener noreferrer' } : attribs }),
    img: (tag, attribs) => ({ tagName: 'img', attribs: { loading: 'lazy', ...attribs } })
  }
});

async function fetchAll(route, query = '') {
  const out = [];
  for (let page = 1; page < 50; page++) {
    const url = `${WP_URL}/wp-json/wp/v2/${route}?per_page=100&page=${page}${query}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (res.status === 400 && page > 1) break; // past the last page
    if (!res.ok) throw new Error(`WordPress ${route} → HTTP ${res.status} (${url})`);
    const items = await res.json();
    out.push(...items);
    const total = +res.headers.get('x-wp-totalpages') || 1;
    if (page >= total) break;
  }
  return out;
}

const memo = new Map();
const once = (key, fn) => { if (!memo.has(key)) memo.set(key, fn()); return memo.get(key); };

/* ---------- mappers: WordPress -> template shape ---------- */
const MOMENTS = ['ads', 'serp', 'seo', 'chat', 'targeting', 'build', 'phone', 'flow', 'dashboard', 'ab'];
function mapService(p) {
  const m = p.meta || {};
  const type = MOMENTS.includes(m.hs_moment) ? m.hs_moment : 'build';
  const items = lines(m.hs_moment_items).slice(0, 5);
  return {
    slug: p.slug,
    d: ['dev-tech', 'marketing', 'growth'].includes(m.hs_discipline) ? m.hs_discipline : null,
    name: text(p.title?.rendered),
    formValue: m.hs_form_value || '',
    tagline: m.hs_tagline || text(p.excerpt?.rendered),
    audit: m.hs_audit || 'free strategy call',
    forWho: lines(m.hs_for_who),
    signs: lines(m.hs_signs),
    deliverables: lines(m.hs_deliverables),
    moment: {
      type, label: m.hs_moment_label || 'How it works',
      query: m.hs_moment_query || '', prompt: m.hs_moment_query || '',
      nodes: type === 'flow' ? items : undefined,
      filters: type === 'targeting' ? items : undefined,
      variant: m.hs_moment_variant || undefined
    },
    calc: ['roas', 'leads', 'cro'].includes(m.hs_calc) ? m.hs_calc : undefined,
    pairs: csv(m.hs_pairs),
    tools: csv(m.hs_tools),
    faqs: faqs(m.hs_faqs),
    body: clean(p.content?.rendered || '')
  };
}
const mapIndustry = (p) => {
  const m = p.meta || {};
  return {
    slug: p.slug, name: text(p.title?.rendered), no: m.hs_letter || '',
    tagline: m.hs_tagline || text(p.excerpt?.rendered),
    pains: lines(m.hs_pains), services: csv(m.hs_services), faqs: faqs(m.hs_faqs),
    body: clean(p.content?.rendered || '')
  };
};
const mapCase = (p) => {
  const m = p.meta || {};
  return {
    slug: p.slug, title: text(p.title?.rendered), approved: m.hs_approved === true,
    client: m.hs_client || '', industry: m.hs_industry || '', services: csv(m.hs_services),
    challenge: m.hs_challenge || '', approach: m.hs_approach || '',
    results: pairsOf(m.hs_results).map(([value, label]) => ({ value, label })),
    quote: m.hs_quote || '', quoteAuthor: m.hs_quote_author || '',
    summary: text(p.excerpt?.rendered),
    image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
    imageAlt: p._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
    body: clean(p.content?.rendered || '')
  };
};

/* ---------- public API ---------- */
const ORDER = '&orderby=menu_order&order=asc';
const warn = (msg) => console.warn(`\x1b[33m[content]\x1b[0m ${msg}`);

export const getServices = () => once('services', async () => {
  if (!usingWordPress) return localServices;
  const list = (await fetchAll('services', ORDER)).map(mapService);
  const valid = list.filter((s) => { if (!s.d) warn(`Service "${s.slug}" has no discipline: skipped`); return s.d; });
  if (!valid.length) { warn('No published services in WordPress: using built-in content'); return localServices; }
  return valid;
});

export const getIndustries = () => once('industries', async () => {
  if (!usingWordPress) return localIndustries;
  const list = (await fetchAll('industries', ORDER)).map(mapIndustry);
  if (!list.length) { warn('No published industries in WordPress: using built-in content'); return localIndustries; }
  return list;
});

/** Only client-approved case studies are ever published. */
export const getCaseStudies = () => once('cases', async () => {
  if (!usingWordPress) return [];
  return (await fetchAll('case-studies', ORDER + '&_embed=wp:featuredmedia')).map(mapCase).filter((c) => c.approved);
});

const RESERVED = new Set(['services', 'industries', 'work', 'blog', 'index', '404']);
export const getPages = () => once('pages', async () => {
  if (!usingWordPress) return [];
  return (await fetchAll('pages', '&_fields=slug,title,content,excerpt,parent'))
    .filter((p) => !p.parent && !RESERVED.has(p.slug))
    .map((p) => ({ slug: p.slug, title: text(p.title?.rendered), excerpt: text(p.excerpt?.rendered), body: clean(p.content?.rendered || '') }));
});

/** Everything the shared layout needs (nav, footer, form). */
export async function getSiteData() {
  const [services, industries] = await Promise.all([getServices(), getIndustries()]);
  return { services, industries };
}
