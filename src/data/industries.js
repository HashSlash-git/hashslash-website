/* Local fallback / seed content for industry pages.
   Once WordPress is connected, Industries are edited in wp-admin. */
export const industries = [
  {
    slug: 'ecommerce-d2c', name: 'E-commerce & D2C', no: 'A',
    tagline: 'Shopify builds, Meta and Google Shopping, retention flows: the full stack from first click to repeat order.',
    pains: ['ROAS looks fine in Meta but profit doesn\'t follow', 'Customers buy once and never come back', 'The store slows down every time you add an app', 'Ad platforms and Shopify report different numbers'],
    services: ['shopify-ecommerce', 'meta-ads', 'google-ads', 'email-marketing', 'retention', 'conversion-rate-optimisation'],
    faqs: [
      { q: 'Do you only work with Shopify stores?', a: 'Shopify is our main platform for D2C, but we also work with WooCommerce and custom builds when the business needs it.' },
      { q: 'Can you handle both the store and the ads?', a: 'Yes. That\'s the point of one team: the store is built to convert the traffic the ads bring in.' }
    ]
  },
  {
    slug: 'it-healthcare', name: 'IT & Healthcare', no: 'B',
    tagline: 'Trust-first websites, LinkedIn campaigns, compliant lead capture and CRM automation for long, considered sales cycles.',
    pains: ['Leads are slow to convert and easy to lose', 'Your website doesn\'t build enough trust for a big decision', 'Sales and marketing work from different lists', 'Compliance makes every campaign take longer'],
    services: ['custom-websites', 'linkedin-ads', 'crm-development', 'crm-marketing-automation', 'seo', 'ai-integrations'],
    faqs: [
      { q: 'Do you work within healthcare advertising rules?', a: 'Yes. We plan campaigns and lead capture around platform policies and your compliance team\'s requirements.' },
      { q: 'Can you integrate with our existing CRM?', a: 'In most cases, yes. We audit what you have before recommending any change.' }
    ]
  },
  {
    slug: 'hospitality', name: 'Hospitality', no: 'C',
    tagline: 'Direct bookings over OTA commissions: local SEO, social-first creative and booking-engine tracking.',
    pains: ['Too many bookings come through commission-heavy OTAs', 'Your property barely shows up in local search', 'Social content doesn\'t turn into bookings', 'You can\'t tell which campaigns fill rooms or tables'],
    services: ['seo', 'social-media', 'google-ads', 'meta-ads', 'tracking-analytics', 'content-video'],
    faqs: [
      { q: 'Can you track bookings from our booking engine?', a: 'Usually, yes. We connect booking-engine conversions to GA4 and the ad platforms wherever the engine allows it.' },
      { q: 'Do you shoot content on-site?', a: 'Yes. We plan and produce content built for social and ads.' }
    ]
  },
  {
    slug: 'real-estate', name: 'Real Estate', no: 'D',
    tagline: 'Qualified buyer leads from high-intent campaigns, fast landing pages and CRM-driven follow-up.',
    pains: ['Plenty of leads, very few genuine buyers', 'Leads wait hours before anyone calls them back', 'Every project launch starts marketing from scratch', 'You can\'t see cost per site visit or booking'],
    services: ['funnels-lead-generation', 'meta-ads', 'google-ads', 'linkedin-ads', 'crm-development', 'chatgpt-ads'],
    faqs: [
      { q: 'How do you improve lead quality?', a: 'Better qualification on the form, instant WhatsApp follow-up, and sending quality signals back to the ad platforms.' },
      { q: 'Can you run campaigns for individual projects?', a: 'Yes. Each project gets its own landing page, campaigns and reporting, built from a reusable launch kit.' }
    ]
  }
];
