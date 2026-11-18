# HashSlash: headless WordPress setup

WordPress is where you **edit** content. The public site is a fast static Astro build that pulls that content in and rebuilds automatically about a minute after you publish.

```
 wp-admin (cms.yourdomain.com)  ──publish──▶  deploy hook  ──▶  host rebuilds Astro  ──▶  www.yourdomain.com
            ▲                                                          │
            └──────────────── REST API (read-only, at build time) ─────┘
```

## 1. Secure WordPress first (the old site was compromised)

- Update WordPress core, the theme and every plugin. Delete plugins/themes you don't use.
- Users → remove any admin account you don't recognise. Change every password.
- Turn on two-factor login (e.g. the *Two Factor* plugin) for all admins.
- Ask your host for a malware scan and fresh salts in `wp-config.php`.
- Ideally move WordPress to a subdomain such as `cms.yourdomain.com`.

## 2. Install the plugin

1. wp-admin → Plugins → Add New → **Upload Plugin** → `wordpress-plugin/hashslash-headless.zip` → Activate.
2. You'll now see **Services**, **Industries** and **Case Studies** in the admin menu.
3. Settings → **HashSlash Headless** → **Import starter content**. This creates the 24 services and 4 industries the site ships with (tick "Import as drafts" if you want to review them first).

The plugin also turns off XML-RPC, hides the public user list (stops username harvesting) and never exposes unapproved case-study results through the API.

## 3. Host the Astro site

Netlify, Vercel or Cloudflare Pages all work:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 20 or newer |
| Environment variable | `WP_URL=https://cms.yourdomain.com` |

Then create a **deploy hook / build hook** in the host and paste its URL into Settings → HashSlash Headless → *Deploy hook URL*. Set *Front-end URL* to the live site and tick **Redirect old theme** so visitors never land on the WordPress theme.

> If `WP_URL` is missing or WordPress has no published services, the build falls back to the built-in content, so the site never goes blank.

## 4. Editing content

| In wp-admin | Appears on the site at |
|---|---|
| Services | `/services/<slug>/` + nav, footer, hubs, homepage |
| Industries | `/industries/<slug>/` + homepage industries |
| Case Studies (approved only) | `/work/<slug>/` + homepage work, matching service & industry pages |
| Pages (top level) | `/<slug>/` (e.g. About, Privacy, Terms) |

Field formats in the **HashSlash page content** box:

- *One per line* fields: put each item on its own line.
- **FAQs**: `Question || Answer`, one per line.
- **Results** (case studies): `Value || Label`, e.g. `3.2x || ROAS in 90 days`. Use verified numbers only.
- **Service slugs** / **tool icons**: comma separated. Tool icons use [simple-icons](https://simpleicons.org) slugs, e.g. `meta, googleads, shopify`.
- A case study is only published on the site when **"Client has approved…"** is ticked.
- Use the main editor for any extra long-form copy; it appears below the scroll animation.

HTML from WordPress is cleaned at build time: scripts, inline event handlers and iframes other than YouTube/Vimeo are stripped.

Reserved slugs that WordPress pages can't use: `services`, `industries`, `work`, `blog`.

## 5. Local development

```bash
cp .env.example .env      # set WP_URL, or leave it empty for built-in content
npm install
npm run dev
```

`npm run wp:seed` regenerates the plugin's starter content from `src/data/` (re-zip the plugin afterwards).
