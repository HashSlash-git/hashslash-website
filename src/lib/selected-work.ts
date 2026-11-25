// Shared by SelectedWork.astro (build-time HTML) and its client script (swaps, wall).
import data from '../data/selected-work.json';

export interface Brand {
  name: string;
  market: string;
  color: string;
  assets: {
    logo: string; wide: string; thumb: string; tall: string; square: string; alt: string;
    logoRaw?: boolean; logoScale?: number; pos?: string;
  };
}

export const brands = data as Brand[];

export const esc = (s: unknown) =>
  String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export const pad = (n: number) => String(n).padStart(2, '0');

export const brandStyle = (b: Brand) => `--c:${b.color}`;

type Kind = 'wide' | 'thumb' | 'tall' | 'square';

/** A brand's photo with its logo on top. Decorative copies (the wall) get empty alt text. */
export const realHTML = (b: Brand, kind: Kind, { decorative = false, eager = false } = {}) => {
  const a = b.assets;
  const pos = a.pos ? ` style="object-position:${esc(a.pos)}"` : '';
  const w = { wide: 1200, thumb: 480, tall: 800, square: 480 }[kind];
  return `<figure class="sw-real"><img class="sw-real__img" src="${esc(a[kind])}" alt="${decorative ? '' : esc(a.alt || b.name)}"${pos} width="${w}" decoding="async"${eager ? ' fetchpriority="low"' : ' loading="lazy"'}><img class="sw-real__logo${a.logoRaw ? ' sw-real__logo--raw' : ''}" src="${esc(a.logo)}"${a.logoScale ? ` style="--ls:${+a.logoScale}"` : ''} alt="" aria-hidden="true" loading="lazy" decoding="async"></figure>`;
};
