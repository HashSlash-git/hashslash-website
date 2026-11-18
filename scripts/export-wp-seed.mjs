// Writes the plugin's starter content from the local data files.
// Run: npm run wp:seed   (then zip wordpress-plugin/hashslash-headless)
import { writeFileSync, mkdirSync } from 'node:fs';
import { services } from '../src/data/services.js';
import { industries } from '../src/data/industries.js';

const out = new URL('../wordpress-plugin/hashslash-headless/seed/', import.meta.url);
mkdirSync(out, { recursive: true });

const lines = (a = []) => a.join('\n');
const faqs = (a = []) => a.map((f) => `${f.q} || ${f.a}`).join('\n');

const svc = services.map((s) => ({
  slug: s.slug,
  title: s.name,
  excerpt: s.tagline,
  meta: {
    hs_discipline: s.d,
    hs_tagline: s.tagline,
    hs_audit: s.audit,
    hs_form_value: s.formValue,
    hs_for_who: lines(s.forWho),
    hs_signs: lines(s.signs),
    hs_deliverables: lines(s.deliverables),
    hs_moment: s.moment.type,
    hs_moment_label: s.moment.label,
    hs_moment_query: s.moment.query || s.moment.prompt || '',
    hs_moment_items: lines(s.moment.nodes || s.moment.filters || []),
    hs_moment_variant: s.moment.variant || '',
    hs_calc: s.calc || '',
    hs_pairs: s.pairs.join(', '),
    hs_tools: s.tools.join(', '),
    hs_faqs: faqs(s.faqs)
  }
}));

const ind = industries.map((i) => ({
  slug: i.slug,
  title: i.name,
  excerpt: i.tagline,
  meta: {
    hs_letter: i.no,
    hs_tagline: i.tagline,
    hs_pains: lines(i.pains),
    hs_services: i.services.join(', '),
    hs_faqs: faqs(i.faqs)
  }
}));

writeFileSync(new URL('services.json', out), JSON.stringify(svc, null, 2));
writeFileSync(new URL('industries.json', out), JSON.stringify(ind, null, 2));
console.log(`Seed written: ${svc.length} services, ${ind.length} industries`);
