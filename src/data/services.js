/* ==========================================================
   HashSlash: services content model
   Every service page + hub page is generated from this file.
   - moment: the signature scroll animation for the page
       ads | serp | seo | chat | targeting | build | phone | flow | dashboard | ab
   - calc: optional interactive calculator  roas | leads | cro
   - formValue: pre-selects the matching pill in the enquiry form
   - tools: simple-icons slugs (falls back to text if an icon is missing)
   No metrics or client claims live here: results come from approved case studies only.
   ========================================================== */

export const disciplines = [
  {
    slug: 'dev-tech',
    name: 'Dev & Tech',
    short: 'Build',
    no: '01',
    headline: ['We build', 'what sells.'],
    lede: 'Websites, stores, apps and systems engineered to convert: fast, measurable and wired into your marketing from day one.',
    process: [
      { t: 'Discovery & scope', d: 'Goals, users, integrations and success metrics, agreed in writing.', w: 'Week 1' },
      { t: 'UX & design', d: 'Wireframes, then high-fidelity design you can click through before a line of code.', w: 'Weeks 2–3' },
      { t: 'Build & QA sprints', d: 'Weekly staging links. Performance, accessibility and tracking tested as we go.', w: 'Scope-dependent' },
      { t: 'Launch & care', d: 'Zero-drama launch, handover training and an optional care plan.', w: 'Ongoing' }
    ],
    packages: [
      { n: 'Launch', d: 'Get live, properly.', i: ['Template-led design', 'Core pages / store setup', 'Analytics & pixel setup', 'Handover training'] },
      { n: 'Grow', d: 'Custom, conversion-ready.', i: ['Custom UI/UX', 'CRM & payment integrations', 'CRO-ready page system', 'Speed & SEO foundations'], featured: true },
      { n: 'Scale', d: 'Systems that run the business.', i: ['Custom builds & apps', 'Automation & AI workflows', 'Performance budget & SLA', 'Dedicated dev pod'] }
    ]
  },
  {
    slug: 'marketing',
    name: 'Marketing',
    short: 'Market',
    no: '02',
    headline: ['We market', 'what matters.'],
    lede: 'Paid, organic and creative running off one shared data layer, so every channel knows what the others are doing.',
    process: [
      { t: 'Audit & tracking', d: 'Account and funnel audit. Pixels, conversions API and GA4 verified before budget scales.', w: 'Week 1' },
      { t: 'Strategy & creative', d: 'Audience map, offer angles and a first batch of creatives built to be tested.', w: 'Week 2' },
      { t: 'Launch & learn', d: 'Structured tests with a clear read on what is and isn\'t working.', w: 'Weeks 3–4' },
      { t: 'Optimise & scale', d: 'Kill losers, scale winners, refresh creative and report against revenue.', w: 'Monthly' }
    ],
    packages: [
      { n: 'Launch', d: 'One or two channels, done right.', i: ['Tracking & conversion setup', 'Campaign build', 'Starter creative pack', 'Monthly report & call'] },
      { n: 'Grow', d: 'Multi-channel, always testing.', i: ['2–3 channels managed', 'Weekly creative testing', 'Landing page optimisation', 'Fortnightly strategy calls'], featured: true },
      { n: 'Scale', d: 'Full-funnel growth pod.', i: ['All paid + organic channels', 'Dedicated strategist & creatives', 'CRM / offline conversion sync', 'Live revenue dashboard'] }
    ]
  },
  {
    slug: 'growth',
    name: 'Business Growth',
    short: 'Scale',
    no: '03',
    headline: ['We scale', 'what works.'],
    lede: 'Strategy, CRO, funnels and retention that turn traffic into revenue you can forecast.',
    process: [
      { t: 'Diagnose', d: 'Data, funnel and customer research to find the real constraint on growth.', w: 'Weeks 1–2' },
      { t: 'Prioritise', d: 'An impact-vs-effort roadmap so the team works on what moves revenue first.', w: 'Week 2' },
      { t: 'Test & implement', d: 'Experiments and builds shipped in monthly sprints, with clean measurement.', w: 'Monthly sprints' },
      { t: 'Review & compound', d: 'Monthly reviews, quarterly planning. Wins become the new baseline.', w: 'Ongoing' }
    ],
    packages: [
      { n: 'Audit', d: 'A clear diagnosis.', i: ['Funnel & data deep-dive', 'Customer research', 'Prioritised growth roadmap', 'Leadership walkthrough'] },
      { n: 'Sprint', d: 'Monthly momentum.', i: ['Experiments every month', 'Implementation included', 'Dashboard & reporting', 'Monthly growth review'], featured: true },
      { n: 'Partner', d: 'An embedded growth lead.', i: ['Fractional growth lead', 'Cross-team coordination', 'Quarterly planning', 'Board-ready reporting'] }
    ]
  }
];

export const services = [
  /* ---------------------------- DEV & TECH ---------------------------- */
  {
    slug: 'shopify-ecommerce', d: 'dev-tech', name: 'Shopify & E-commerce', formValue: 'Website / Shopify',
    tagline: 'Stores built to sell: fast themes, frictionless checkout and every event tracked for your ads.',
    audit: 'free Shopify CRO teardown',
    forWho: ['D2C brands', 'Retail going online', 'Stores outgrowing a template'],
    signs: ['Your store looks fine but the conversion rate doesn\'t move', 'Pages take more than a few seconds to load on mobile', 'Your ads team says the pixel data is "off"', 'Apps keep piling up and slowing everything down'],
    deliverables: ['Custom Shopify / Shopify Plus theme', 'Product, collection & bundle UX', 'Checkout & payment optimisation', 'Apps audit and clean-up', 'Pixel, CAPI & GA4 e-commerce events', 'Speed optimisation (Core Web Vitals)'],
    moment: { type: 'build', label: 'Your store, assembled for conversion' },
    calc: 'cro', pairs: ['meta-ads', 'conversion-rate-optimisation'],
    tools: ['shopify', 'meta', 'googleanalytics', 'klaviyo', 'figma'],
    faqs: [
      { q: 'Can you migrate us from WooCommerce or another platform?', a: 'Yes. We migrate products, customers, orders and URLs with redirects so you keep your SEO equity.' },
      { q: 'Do you use themes or build custom?', a: 'Both. We recommend based on budget and how unique your buying experience needs to be, and tell you why.' },
      { q: 'Will our ad tracking survive the rebuild?', a: 'Tracking is built in from day one: Meta CAPI, Google and GA4 events are tested before launch.' }
    ]
  },
  {
    slug: 'wordpress-development', d: 'dev-tech', name: 'WordPress Development', formValue: 'Website / Shopify',
    tagline: 'Fast, secure WordPress sites your team can actually edit, without breaking the design.',
    audit: 'free WordPress health check',
    forWho: ['Service businesses', 'Content-heavy brands', 'Teams that publish often'],
    signs: ['Every small edit needs a developer', 'The site has been hacked or flagged before', 'Plugins are outdated and nobody wants to touch them', 'PageSpeed scores are in the red'],
    deliverables: ['Custom block-based theme', 'Editor-friendly page builder setup', 'Security hardening & backups', 'Speed & caching optimisation', 'SEO & schema foundations', 'Forms wired to your CRM'],
    moment: { type: 'build', label: 'A site your team can run' },
    pairs: ['seo', 'maintenance-performance'],
    tools: ['wordpress', 'php', 'cloudflare', 'googlesearchconsole', 'figma'],
    faqs: [
      { q: 'Can you fix our existing site instead of rebuilding?', a: 'Often, yes. We start with a health check and only recommend a rebuild when fixing would cost more.' },
      { q: 'Is WordPress secure?', a: 'With the right hosting, updates and hardening, yes. Security is part of every build and care plan.' },
      { q: 'Will we be able to edit it ourselves?', a: 'That\'s the point. You get reusable blocks and a short training session.' }
    ]
  },
  {
    slug: 'custom-websites', d: 'dev-tech', name: 'Custom Websites', formValue: 'Website / Shopify',
    tagline: 'Bespoke, high-performance websites with motion, personality and a clear job: turning visitors into leads.',
    audit: 'free website conversion review',
    forWho: ['Brands that need to stand out', 'Funded startups', 'B2B with complex offers'],
    signs: ['Your site looks like everyone else\'s', 'Visitors leave without understanding what you do', 'Marketing can\'t launch landing pages fast', 'The tech stack is holding growth back'],
    deliverables: ['Brand-led UI design system', 'React / Next.js or Astro build', 'Motion & interaction design', 'Headless CMS setup', 'Landing page system for campaigns', 'Analytics & event tracking'],
    moment: { type: 'build', label: 'Designed, engineered, measured' },
    calc: 'cro', pairs: ['ui-ux-design', 'google-ads'],
    tools: ['react', 'nextdotjs', 'astro', 'figma', 'vercel'],
    faqs: [
      { q: 'Why custom instead of a template?', a: 'When your positioning, speed or integrations matter to revenue. If a template will do the job, we\'ll tell you.' },
      { q: 'Can marketing still edit content?', a: 'Yes. We connect a headless CMS so the team can publish without developers.' },
      { q: 'Do you handle hosting?', a: 'We set up and can manage modern hosting with a CDN, SSL and monitoring.' }
    ]
  },
  {
    slug: 'ui-ux-design', d: 'dev-tech', name: 'UI/UX Design', formValue: 'Website / Shopify',
    tagline: 'Interfaces people understand in seconds, designed around how your customers decide and buy.',
    audit: 'free UX review',
    forWho: ['Product teams', 'E-commerce', 'SaaS & apps'],
    signs: ['Users get lost or drop off mid-flow', 'Design is inconsistent across pages', 'Developers guess at spacing and states', 'You redesign without knowing what to fix'],
    deliverables: ['User research & journey mapping', 'Wireframes & user flows', 'High-fidelity UI design', 'Design system & component library', 'Interactive prototypes', 'Usability testing'],
    moment: { type: 'build', label: 'From wireframe to "oh, that\'s easy"' },
    calc: 'cro', pairs: ['custom-websites', 'conversion-rate-optimisation'],
    tools: ['figma', 'framer', 'hotjar', 'miro'],
    faqs: [
      { q: 'Do you only design, or build too?', a: 'Both. Design and development sit in the same team, so nothing gets lost in handover.' },
      { q: 'Do you test with real users?', a: 'Yes, where budget allows. Even five users reveal most of the big issues.' },
      { q: 'Will we own the design files?', a: 'Always. You get the full Figma file and design system.' }
    ]
  },
  {
    slug: 'mobile-apps', d: 'dev-tech', name: 'Mobile Apps', formValue: 'Mobile app',
    tagline: 'iOS and Android apps that people keep on their home screen, built cross-platform to ship faster.',
    audit: 'free app scoping session',
    forWho: ['Startups', 'Brands with loyal customers', 'Ops-heavy businesses'],
    signs: ['Customers ask "do you have an app?"', 'Repeat orders rely on WhatsApp messages', 'Your current app has poor reviews', 'Field teams run on spreadsheets'],
    deliverables: ['Product scoping & MVP roadmap', 'App UX/UI design', 'Flutter / React Native build', 'APIs & backend integration', 'Push notifications & analytics', 'App Store & Play Store launch'],
    moment: { type: 'phone', label: 'An app, screen by screen' },
    pairs: ['ui-ux-design', 'retention'],
    tools: ['flutter', 'react', 'firebase', 'apple', 'googleplay'],
    faqs: [
      { q: 'Native or cross-platform?', a: 'Cross-platform for most products: one codebase, both stores. Native when hardware or performance demands it.' },
      { q: 'Can you start with an MVP?', a: 'We recommend it. Launch the core, learn from real users, then invest in what they use.' },
      { q: 'Do you handle store submission?', a: 'Yes, including listings, screenshots and review guidelines.' }
    ]
  },
  {
    slug: 'maintenance-performance', d: 'dev-tech', name: 'Maintenance & Performance', formValue: 'Website / Shopify',
    tagline: 'Keep your site fast, secure and updated, so it keeps selling while you focus on the business.',
    audit: 'free speed & security scan',
    forWho: ['Any live website', 'Stores in peak season', 'Teams without in-house devs'],
    signs: ['Nobody owns updates or backups', 'Load times creep up every month', 'Small fixes take weeks', 'You\'d only find out about downtime from a customer'],
    deliverables: ['Core Web Vitals optimisation', 'Updates, backups & monitoring', 'Security hardening', 'Monthly dev hours for changes', 'Uptime & error alerts', 'Monthly health report'],
    moment: { type: 'build', label: 'Faster, safer, every month' },
    pairs: ['wordpress-development', 'seo'],
    tools: ['cloudflare', 'googlesearchconsole', 'wordpress', 'shopify'],
    faqs: [
      { q: 'Can you look after a site you didn\'t build?', a: 'Yes. We start with an audit, fix the urgent issues, then keep it healthy.' },
      { q: 'What if something breaks at night?', a: 'Monitoring alerts us automatically. Response times depend on your plan.' },
      { q: 'Do unused hours roll over?', a: 'We agree this upfront. Most plans let you bank a portion for bigger changes.' }
    ]
  },
  {
    slug: 'crm-development', d: 'dev-tech', name: 'CRM Development', formValue: 'CRM & automation',
    tagline: 'A CRM your team actually uses: every lead captured, routed and followed up automatically.',
    audit: 'free CRM & lead-flow audit',
    forWho: ['Sales-led businesses', 'Real estate & healthcare', 'Teams living in spreadsheets'],
    signs: ['Leads sit untouched for hours', 'Nobody knows which campaign closed the deal', 'Sales updates live in WhatsApp chats', 'Your CRM is expensive and mostly empty'],
    deliverables: ['CRM selection & setup (HubSpot, Zoho, custom)', 'Pipeline & deal-stage design', 'Lead capture from every source', 'Routing, tasks & SLAs', 'WhatsApp & email integration', 'Ad platform offline-conversion sync'],
    moment: { type: 'flow', nodes: ['Ad / form', 'CRM', 'Auto-assign', 'WhatsApp', 'Closed deal'], label: 'Every lead, routed in seconds' },
    calc: 'leads', pairs: ['business-automation', 'linkedin-ads'],
    tools: ['hubspot', 'zoho', 'whatsapp', 'zapier', 'googlesheets'],
    faqs: [
      { q: 'Which CRM should we use?', a: 'It depends on team size, budget and workflow. We recommend one after the audit.' },
      { q: 'Can you migrate our existing data?', a: 'Yes: contacts, deals and history, cleaned and de-duplicated.' },
      { q: 'Will this connect to our ads?', a: 'Yes. Sending qualified leads and closed deals back to Meta and Google is one of the biggest wins.' }
    ]
  },
  {
    slug: 'business-automation', d: 'dev-tech', name: 'Business Automation', formValue: 'CRM & automation',
    tagline: 'Remove the repetitive work: invoices, onboarding, reporting and follow-ups that run themselves.',
    audit: 'free automation opportunity map',
    forWho: ['Ops-heavy teams', 'Agencies & services', 'Growing SMEs'],
    signs: ['People copy-paste between tools all day', 'Errors come from manual data entry', 'Onboarding a client takes too many steps', 'Reports are rebuilt by hand every week'],
    deliverables: ['Process mapping & ROI ranking', 'Zapier / Make / n8n workflows', 'Custom integrations & APIs', 'Document & invoice automation', 'Alerting and approvals', 'Documentation & training'],
    moment: { type: 'flow', nodes: ['Trigger', 'Validate', 'Sync tools', 'Notify team', 'Done'], label: 'Work that runs while you sleep' },
    pairs: ['ai-integrations', 'crm-development'],
    tools: ['zapier', 'make', 'n8n', 'googlesheets', 'slack'],
    faqs: [
      { q: 'What should we automate first?', a: 'The tasks that are frequent, rule-based and error-prone. We rank them by time saved.' },
      { q: 'What if a tool changes its API?', a: 'We build with monitoring and alerts, and can maintain workflows on a care plan.' },
      { q: 'Is our data safe?', a: 'We follow least-privilege access and document every connection.' }
    ]
  },
  {
    slug: 'ai-integrations', d: 'dev-tech', name: 'AI Integrations', formValue: 'AI integration',
    tagline: 'Put AI to work on real tasks: support, sales qualification, content ops and internal search.',
    audit: 'free AI use-case workshop',
    forWho: ['Support-heavy teams', 'Content teams', 'Businesses with lots of documents'],
    signs: ['Your team answers the same questions daily', 'Leads wait for a first reply', 'Knowledge lives in scattered docs', 'You\'ve tried ChatGPT but nothing stuck'],
    deliverables: ['Use-case discovery & ROI scoring', 'AI chat & WhatsApp assistants', 'Lead qualification agents', 'Knowledge-base search (RAG)', 'AI content & ops workflows', 'Guardrails, logging & evaluation'],
    moment: { type: 'flow', nodes: ['Question', 'AI agent', 'Your knowledge', 'Answer / action', 'Human handoff'], label: 'AI with guardrails, wired into your tools' },
    pairs: ['business-automation', 'chatgpt-ads'],
    tools: ['anthropic', 'googlegemini', 'n8n', 'whatsapp', 'python'],
    faqs: [
      { q: 'Will AI replace our team?', a: 'It removes repetitive work so your team spends time on the conversations that need a human.' },
      { q: 'How do you stop it making things up?', a: 'Grounding in your own content, guardrails, human handoff and ongoing evaluation.' },
      { q: 'Which models do you use?', a: 'Whichever fits the task, cost and data requirements. We stay model-agnostic.' }
    ]
  },

  /* ---------------------------- MARKETING ---------------------------- */
  {
    slug: 'meta-ads', d: 'marketing', name: 'Meta Ads', formValue: 'Meta Ads',
    tagline: 'Facebook and Instagram ads built on creative testing, clean data and offers people stop scrolling for.',
    audit: 'free Meta Ads account audit',
    forWho: ['E-commerce & D2C', 'Local & hospitality', 'Lead-gen businesses'],
    signs: ['ROAS swings wildly week to week', 'You\'re running the same 3 creatives for months', 'Meta and your store report different numbers', 'Scaling budget always tanks performance'],
    deliverables: ['Account & pixel audit', 'Conversions API setup', 'Creative strategy & testing system', 'UGC, static & video production', 'Campaign structure (Advantage+ & manual)', 'Weekly optimisation & reporting'],
    moment: { type: 'ads', label: 'Launch many. Learn fast. Scale winners.' },
    calc: 'roas', pairs: ['content-video', 'shopify-ecommerce'],
    tools: ['meta', 'instagram', 'facebook', 'googleanalytics', 'canva'],
    faqs: [
      { q: 'How much should we spend?', a: 'Enough to exit learning and test creative properly. We\'ll recommend a starting budget from your margins and goals.' },
      { q: 'Do you make the creatives?', a: 'Yes. Our creative team produces statics, UGC-style video and motion ads built for testing.' },
      { q: 'How fast will we see results?', a: 'You\'ll get a clear read on what works within the first test cycles. Scaling comes after.' }
    ]
  },
  {
    slug: 'google-ads', d: 'marketing', name: 'Google Ads', formValue: 'Google Ads',
    tagline: 'Show up when people are searching for exactly what you sell: Search, Shopping, Performance Max and YouTube.',
    audit: 'free Google Ads wasted-spend audit',
    forWho: ['High-intent services', 'E-commerce', 'B2B & SaaS'],
    signs: ['You pay for clicks on irrelevant searches', 'Performance Max is a black box', 'Conversions are counted twice (or not at all)', 'Competitors outrank you on your own brand name'],
    deliverables: ['Account restructure & keyword strategy', 'Search, Shopping & PMax campaigns', 'Merchant Center & feed optimisation', 'YouTube & Demand Gen', 'Enhanced conversions & GA4', 'Negative keyword & query mining'],
    moment: { type: 'serp', query: 'best running shoes for flat feet', label: 'Own the moment of intent' },
    calc: 'roas', pairs: ['seo', 'tracking-analytics'],
    tools: ['googleads', 'google', 'youtube', 'googleanalytics', 'googletagmanager'],
    faqs: [
      { q: 'Search or Performance Max?', a: 'Usually both, structured so PMax doesn\'t cannibalise branded search. We decide from your data.' },
      { q: 'Can you fix our Merchant Center issues?', a: 'Yes, from disapprovals to feed titles that actually match how people search.' },
      { q: 'Do you charge a percentage of spend?', a: 'We agree a model upfront: fixed retainer or tiered, with no surprises.' }
    ]
  },
  {
    slug: 'linkedin-ads', d: 'marketing', name: 'LinkedIn Ads', formValue: 'LinkedIn Ads',
    tagline: 'Reach decision-makers by job title, seniority and company, then turn that attention into booked meetings.',
    audit: 'free LinkedIn Ads & B2B funnel audit',
    forWho: ['B2B & SaaS', 'IT & healthcare services', 'High-ticket consulting'],
    signs: ['Clicks are expensive and leads go nowhere', 'You target "everyone in the industry"', 'Sales says lead quality is poor', 'You have no plan for people who clicked but didn\'t convert'],
    deliverables: ['ICP & account list (ABM) building', 'Sponsored content & thought leader ads', 'Lead Gen Forms synced to your CRM', 'Conversation & document ads', 'Insight Tag & conversions API', 'Retargeting & nurture sequences'],
    moment: { type: 'targeting', filters: ['Job title', 'Seniority', 'Company size', 'Industry', 'Target accounts'], label: 'From everyone to exactly who signs' },
    calc: 'leads', pairs: ['crm-development', 'funnels-lead-generation'],
    tools: ['linkedin', 'hubspot', 'googleanalytics', 'zapier'],
    faqs: [
      { q: 'Isn\'t LinkedIn too expensive?', a: 'The cost per click is higher, but so is the deal value. We judge it on cost per qualified meeting.' },
      { q: 'Lead Gen Forms or landing pages?', a: 'Often both: forms for volume, landing pages for intent. We test and keep what qualifies better.' },
      { q: 'Can you target specific companies?', a: 'Yes. Account-based campaigns using your target list are one of LinkedIn\'s strengths.' }
    ]
  },
  {
    slug: 'chatgpt-ads', d: 'marketing', name: 'ChatGPT Ads', formValue: 'ChatGPT / AI Ads',
    tagline: 'Be the answer when customers ask AI. Ads inside ChatGPT, plus organic visibility across AI assistants.',
    audit: 'free AI visibility check',
    forWho: ['Early-mover brands', 'E-commerce & D2C', 'B2B researched purchases'],
    signs: ['Customers say "ChatGPT recommended a competitor"', 'Your brand never shows up in AI answers', 'Search traffic is flattening as AI answers grow', 'You want to test a new channel before it gets crowded'],
    deliverables: ['ChatGPT ads strategy & setup (where available)', 'Conversational ad copy & offers', 'AI visibility audit across assistants', 'Answer-engine optimisation (AEO / GEO)', 'Structured data & citation-ready content', 'Measurement & attribution plan'],
    moment: { type: 'chat', prompt: 'What\'s a good CRM for a 10-person real estate team?', label: 'Show up inside the answer' },
    calc: 'roas', pairs: ['seo', 'ai-integrations'],
    tools: ['openai', 'anthropic', 'googlegemini', 'perplexity', 'googlesearchconsole'],
    faqs: [
      { q: 'Are ChatGPT ads available in our market?', a: 'Availability, formats and targeting are still rolling out by region and plan. We confirm what\'s live for your market during the audit.' },
      { q: 'What if ads aren\'t available yet?', a: 'We start with AI visibility: making sure assistants understand, trust and cite your brand. That work compounds either way.' },
      { q: 'How is this measured?', a: 'With tracked landing pages, UTMs and conversion events, plus regular checks of how AI assistants describe you.' }
    ]
  },
  {
    slug: 'seo', d: 'marketing', name: 'SEO', formValue: 'SEO',
    tagline: 'Technical and on-page SEO that earns rankings and traffic you don\'t pay for per click.',
    audit: 'free SEO quick-scan',
    forWho: ['Content-led brands', 'Local businesses', 'E-commerce catalogues'],
    signs: ['You rank on page 2 for the keywords that matter', 'Traffic dropped after a site change', 'Google Search Console shows errors nobody fixes', 'Content gets published but never ranks'],
    deliverables: ['Technical audit & fixes', 'Keyword & topic strategy', 'On-page optimisation', 'Content briefs & production', 'Local SEO & Google Business Profile', 'Schema & AI-search readiness'],
    moment: { type: 'seo', query: 'digital marketing agency near me', label: 'Climb, then stay there' },
    pairs: ['chatgpt-ads', 'google-ads'],
    tools: ['google', 'googlesearchconsole', 'semrush', 'googleanalytics', 'wordpress'],
    faqs: [
      { q: 'How long does SEO take?', a: 'Technical fixes can show impact quickly. Competitive rankings take months of consistent work. We show progress monthly.' },
      { q: 'Do you guarantee #1 rankings?', a: 'No one honestly can. We commit to the work, the process and transparent reporting.' },
      { q: 'Does SEO still matter with AI answers?', a: 'More than ever: AI assistants lean on well-structured, authoritative pages. We optimise for both.' }
    ]
  },
  {
    slug: 'social-media', d: 'marketing', name: 'Social Media Marketing', formValue: 'Social & content',
    tagline: 'Social that builds a brand people follow: platform-native content, community and consistency.',
    audit: 'free social profile review',
    forWho: ['Consumer brands', 'Hospitality', 'Founder-led businesses'],
    signs: ['You post, but engagement is flat', 'Your content looks like ads', 'There\'s no plan beyond "post 3x a week"', 'DMs and comments go unanswered'],
    deliverables: ['Social strategy & content pillars', 'Monthly content calendar', 'Reels, carousels & stories', 'Community management', 'Influencer & creator partnerships', 'Monthly insights report'],
    moment: { type: 'ads', variant: 'feed', label: 'Content made for the feed' },
    pairs: ['content-video', 'meta-ads'],
    tools: ['instagram', 'tiktok', 'youtube', 'linkedin', 'canva'],
    faqs: [
      { q: 'Which platforms should we be on?', a: 'Where your customers actually spend time. Usually two done well beats five done badly.' },
      { q: 'Do you shoot content?', a: 'Yes. We plan, shoot and edit, or work with your in-house creators.' },
      { q: 'How do you measure social?', a: 'Reach and engagement for brand, plus tracked clicks, leads and sales where it matters.' }
    ]
  },
  {
    slug: 'content-video', d: 'marketing', name: 'Content & Performance Creative', formValue: 'Social & content',
    tagline: 'Ads and content built to perform: hooks, UGC, motion and video produced at testing speed.',
    audit: 'free creative audit',
    forWho: ['Brands running paid social', 'D2C', 'Launches & campaigns'],
    signs: ['Creative fatigue hits within days', 'You can\'t produce ads fast enough to test', 'Ads look polished but don\'t convert', 'Nobody knows which hooks actually work'],
    deliverables: ['Creative strategy & hook bank', 'UGC & creator content', 'Static & motion ads', 'Short-form video editing', 'Product & lifestyle shoots', 'Creative performance reporting'],
    moment: { type: 'ads', label: 'Hooks tested, winners scaled' },
    pairs: ['meta-ads', 'social-media'],
    tools: ['adobe', 'canva', 'capcut', 'figma', 'meta'],
    faqs: [
      { q: 'How many creatives per month?', a: 'Depends on spend and channels. Enough to keep testing without fatigue: we scope it with you.' },
      { q: 'Do you work with influencers?', a: 'Yes, from micro-creators to UGC specialists, briefed for performance.' },
      { q: 'Can you match our brand guidelines?', a: 'Always. Performance and brand aren\'t opposites.' }
    ]
  },
  {
    slug: 'email-marketing', d: 'marketing', name: 'Email Marketing & Automation', formValue: 'Social & content',
    tagline: 'Flows and campaigns that make money while you sleep: welcome, abandon, post-purchase and win-back.',
    audit: 'free email flow audit',
    forWho: ['E-commerce', 'Subscription businesses', 'B2B with long cycles'],
    signs: ['You only email when there\'s a sale', 'Abandoned carts get no follow-up', 'Open rates keep dropping', 'Your list grows but revenue from email doesn\'t'],
    deliverables: ['Flow architecture & build', 'Campaign calendar & design', 'Segmentation & personalisation', 'Deliverability setup (SPF, DKIM, DMARC)', 'List growth & pop-ups', 'A/B testing & reporting'],
    moment: { type: 'flow', nodes: ['Sign-up', 'Welcome', 'Browse / cart', 'Reminder', 'Purchase'], label: 'The right message at the right moment' },
    pairs: ['retention', 'shopify-ecommerce'],
    tools: ['klaviyo', 'mailchimp', 'hubspot', 'shopify'],
    faqs: [
      { q: 'Klaviyo, Mailchimp or something else?', a: 'For e-commerce, usually Klaviyo. We recommend based on your stack and goals.' },
      { q: 'Will we annoy our customers?', a: 'Not with good segmentation. Relevant emails earn opens; frequency follows behaviour.' },
      { q: 'Do you handle WhatsApp too?', a: 'Yes. WhatsApp and SMS flows can sit alongside email.' }
    ]
  },
  {
    slug: 'tracking-analytics', d: 'marketing', name: 'Conversion Tracking & Analytics', formValue: 'Growth strategy / CRO',
    tagline: 'One version of the truth: GA4, pixels, conversions API and server-side tracking set up properly.',
    audit: 'free tracking health check',
    forWho: ['Anyone running paid ads', 'Multi-channel brands', 'Teams arguing about numbers'],
    signs: ['Every platform claims credit for the same sale', 'GA4 numbers don\'t match your store or CRM', 'You lost data after iOS / cookie changes', 'Nobody trusts the dashboard'],
    deliverables: ['Measurement plan & event map', 'GA4 & Google Tag Manager', 'Meta CAPI & Google enhanced conversions', 'Server-side tracking', 'Consent mode setup', 'Looker Studio dashboards'],
    moment: { type: 'dashboard', label: 'Numbers everyone agrees on' },
    pairs: ['google-ads', 'reporting'],
    tools: ['googleanalytics', 'googletagmanager', 'meta', 'looker', 'googlebigquery'],
    faqs: [
      { q: 'Why do platforms report different numbers?', a: 'Different attribution windows and models. We set a source of truth and explain the gaps.' },
      { q: 'Is server-side tracking necessary?', a: 'Increasingly, for accuracy and privacy. We recommend it when spend justifies it.' },
      { q: 'Are you compliant with consent rules?', a: 'We implement consent mode and respect user choices. Your legal team signs off on policy.' }
    ]
  },

  /* ---------------------------- GROWTH ---------------------------- */
  {
    slug: 'growth-consulting', d: 'growth', name: 'Growth Consulting', formValue: 'Growth strategy / CRO',
    tagline: 'A clear, prioritised plan for growth, and a partner who helps you execute it.',
    audit: 'free growth diagnostic call',
    forWho: ['Founders & leadership', 'Brands at a plateau', 'Businesses entering new markets'],
    signs: ['Growth has stalled and nobody agrees why', 'Every channel is "kind of working"', 'Priorities change every week', 'You\'re spending more to grow less'],
    deliverables: ['Growth model & unit economics', 'Funnel & channel diagnosis', 'Positioning & offer review', 'Prioritised 90-day roadmap', 'KPI framework', 'Monthly advisory sessions'],
    moment: { type: 'dashboard', label: 'Find the constraint. Fix it. Repeat.' },
    pairs: ['conversion-rate-optimisation', 'reporting'],
    tools: ['googleanalytics', 'looker', 'notion', 'hubspot'],
    faqs: [
      { q: 'Is this just a strategy deck?', a: 'No. The roadmap comes with owners, timelines and, if you want, our team to execute it.' },
      { q: 'Who do we work with?', a: 'A senior strategist, backed by the tech and marketing teams when execution starts.' },
      { q: 'Can this be a one-off?', a: 'Yes. The audit stands on its own; ongoing support is optional.' }
    ]
  },
  {
    slug: 'conversion-rate-optimisation', d: 'growth', name: 'Conversion Rate Optimisation', formValue: 'Growth strategy / CRO',
    tagline: 'Get more revenue from the traffic you already pay for, with research-led tests.',
    audit: 'free CRO teardown',
    forWho: ['E-commerce', 'SaaS & lead-gen', 'Brands with steady traffic'],
    signs: ['Traffic is up, sales are flat', 'You change things based on opinions', 'Checkout or form drop-off is high', 'Landing pages don\'t match the ad'],
    deliverables: ['Analytics & heatmap research', 'User testing & surveys', 'Hypothesis backlog & prioritisation', 'A/B test design & build', 'Landing page optimisation', 'Test reporting & learnings library'],
    moment: { type: 'ab', label: 'Test, don\'t guess' },
    calc: 'cro', pairs: ['ui-ux-design', 'shopify-ecommerce'],
    tools: ['googleanalytics', 'hotjar', 'figma', 'shopify'],
    faqs: [
      { q: 'How much traffic do we need for A/B tests?', a: 'Enough for statistically sound results. If you\'re below that, we use research-led changes instead.' },
      { q: 'What do you test first?', a: 'The pages with the most traffic and the biggest drop-off, usually product, checkout or landing pages.' },
      { q: 'Will tests slow the site down?', a: 'We use lightweight methods and monitor performance throughout.' }
    ]
  },
  {
    slug: 'funnels-lead-generation', d: 'growth', name: 'Funnels & Lead Generation', formValue: 'Growth strategy / CRO',
    tagline: 'Lead systems that fill the pipeline with people ready to talk.',
    audit: 'free funnel audit',
    forWho: ['Real estate', 'Healthcare & clinics', 'B2B services'],
    signs: ['Plenty of leads, few qualified ones', 'Leads go cold before sales calls', 'One channel brings almost all your leads', 'You can\'t see cost per qualified lead'],
    deliverables: ['Offer & lead magnet design', 'Landing pages & quiz funnels', 'Qualification & scoring', 'Instant follow-up (WhatsApp, email, call)', 'Booking & calendar flows', 'Cost-per-qualified-lead reporting'],
    moment: { type: 'flow', nodes: ['Ad', 'Landing page', 'Qualify', 'Instant follow-up', 'Booked call'], label: 'From click to booked call' },
    calc: 'leads', pairs: ['linkedin-ads', 'crm-marketing-automation'],
    tools: ['meta', 'googleads', 'hubspot', 'whatsapp', 'calendly'],
    faqs: [
      { q: 'How do you improve lead quality?', a: 'Better offers, smarter qualification and sending quality signals back to the ad platforms.' },
      { q: 'Do you build the landing pages?', a: 'Yes. Design, build and testing are all in-house.' },
      { q: 'Can leads go straight to WhatsApp?', a: 'Yes. Instant WhatsApp follow-up is one of our most effective setups.' }
    ]
  },
  {
    slug: 'crm-marketing-automation', d: 'growth', name: 'CRM & Marketing Automation', formValue: 'CRM & automation',
    tagline: 'Nurture every lead and customer automatically, with the right message at the right stage.',
    audit: 'free lifecycle audit',
    forWho: ['B2B with long sales cycles', 'Clinics & services', 'E-commerce with repeat buyers'],
    signs: ['Leads who aren\'t ready are simply forgotten', 'Sales and marketing use different lists', 'Follow-ups depend on someone remembering', 'You can\'t tell which nurture emails work'],
    deliverables: ['Lifecycle stage design', 'Lead scoring', 'Nurture sequences (email + WhatsApp)', 'Sales handoff & alerts', 'Re-engagement campaigns', 'Pipeline & attribution reporting'],
    moment: { type: 'flow', nodes: ['New lead', 'Score', 'Nurture', 'Sales-ready', 'Customer'], label: 'Nurture on autopilot' },
    calc: 'leads', pairs: ['crm-development', 'email-marketing'],
    tools: ['hubspot', 'zoho', 'klaviyo', 'whatsapp', 'zapier'],
    faqs: [
      { q: 'How is this different from CRM development?', a: 'CRM development builds the system. This service runs the marketing inside it.' },
      { q: 'Do we need a big list to start?', a: 'No. Automation pays off from the first leads, because nothing slips through.' },
      { q: 'Can sales see the nurture history?', a: 'Yes. Every touchpoint is visible on the contact record.' }
    ]
  },
  {
    slug: 'retention', d: 'growth', name: 'Retention & Lifecycle', formValue: 'Growth strategy / CRO',
    tagline: 'Turn first-time buyers into repeat customers with loyalty, lifecycle and win-back programmes.',
    audit: 'free retention audit',
    forWho: ['D2C & e-commerce', 'Subscriptions', 'Hospitality'],
    signs: ['Most customers buy once and disappear', 'You rely on discounts to bring people back', 'There\'s no loyalty or referral programme', 'You don\'t know your repeat-purchase rate'],
    deliverables: ['Cohort & LTV analysis', 'Post-purchase journeys', 'Loyalty & referral programmes', 'Win-back campaigns', 'Subscription & replenishment flows', 'Retention dashboard'],
    moment: { type: 'flow', nodes: ['1st order', 'Onboard', 'Replenish', 'Loyalty', 'Advocate'], label: 'The second order is the real win' },
    pairs: ['email-marketing', 'reporting'],
    tools: ['klaviyo', 'shopify', 'whatsapp', 'googleanalytics'],
    faqs: [
      { q: 'Where should we start?', a: 'With the post-purchase journey. It\'s usually the biggest gap and the fastest win.' },
      { q: 'Do loyalty programmes work for small brands?', a: 'Yes, when the reward fits why customers buy. We design around your margins.' },
      { q: 'How do we measure retention?', a: 'Cohort repeat rates and lifetime value, tracked monthly.' }
    ]
  },
  {
    slug: 'reporting', d: 'growth', name: 'Analytics & Reporting', formValue: 'Growth strategy / CRO',
    tagline: 'Dashboards leadership actually reads: revenue, CAC, LTV and pipeline in one place.',
    audit: 'free reporting review',
    forWho: ['Leadership teams', 'Multi-channel brands', 'Investor-backed companies'],
    signs: ['Monday reporting takes half a day', 'Each team reports a different number', 'You can\'t see CAC or LTV by channel', 'Decisions wait on data requests'],
    deliverables: ['KPI framework & definitions', 'Data pipelines & warehouse setup', 'Looker Studio / BI dashboards', 'Channel & cohort reporting', 'Automated weekly summaries', 'Monthly insight reviews'],
    moment: { type: 'dashboard', label: 'From data to decisions' },
    pairs: ['tracking-analytics', 'growth-consulting'],
    tools: ['looker', 'googlebigquery', 'googleanalytics', 'googlesheets'],
    faqs: [
      { q: 'Which BI tool do you use?', a: 'Looker Studio for most teams; we work with your existing tool if you have one.' },
      { q: 'Can you combine ad, store and CRM data?', a: 'Yes. That\'s exactly what the pipelines are for.' },
      { q: 'Who maintains the dashboards?', a: 'We can, or we train your team and hand over documentation.' }
    ]
  }
];

export const getDiscipline = (slug) => disciplines.find((d) => d.slug === slug);
export const getService = (slug) => services.find((s) => s.slug === slug);
export const servicesIn = (d) => services.filter((s) => s.d === d);

/* Enquiry form pill values (single source of truth) */
export const formServices = [
  'Website / Shopify', 'Mobile app', 'CRM & automation', 'AI integration',
  'Meta Ads', 'Google Ads', 'LinkedIn Ads', 'ChatGPT / AI Ads', 'SEO', 'Social & content', 'Growth strategy / CRO'
];
