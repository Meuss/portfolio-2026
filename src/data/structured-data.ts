import type { Lang } from '../i18n/ui';
import { contact } from './contact';
import { headlineServices } from './services';
import type { SharePage } from './share';

/**
 * Structured data (schema.org JSON-LD) for every indexable page, rendered by
 * BaseLayout. One @graph per page, linked by @id:
 *
 * - the business (`LocalBusiness`; schema.org deprecated the more specific
 *   `ProfessionalService` and has no type for a web developer), with the
 *   owner's chosen public address (town, canton and country only, no street),
 *   the area served and the five homepage services;
 * - its founder, Thomas (`Person`);
 * - the site (`WebSite`);
 * - the page itself, typed by what it is (`AboutPage`, `ContactPage`, …).
 *
 * Only true facts: no street address, coordinates, opening hours, prices or
 * ratings. Everything else comes from contact.ts, services.ts and ui.ts.
 */

/** The indexable pages, the same list as the share images. */
export type StructuredDataPage = SharePage;

const pageType: Record<StructuredDataPage, string> = {
  home: 'WebPage',
  work: 'CollectionPage',
  about: 'AboutPage',
  contact: 'ContactPage',
  privacy: 'WebPage',
};

/** What a page is about, where that is one node of the graph. */
const pageAbout: Partial<Record<StructuredDataPage, 'business' | 'person'>> = {
  home: 'business',
  about: 'person',
  contact: 'business',
};

const jobTitle: Record<Lang, string> = { en: 'Web developer', fr: 'Développeur web' };

/** Where clients come from, narrowest first: the town, its district, the canton, the region. */
const areaServed: Record<Lang, Array<{ type: string; name: string }>> = {
  en: [
    { type: 'City', name: 'Bulle' },
    { type: 'AdministrativeArea', name: 'Gruyère District' },
    { type: 'State', name: 'Canton of Fribourg' },
    { type: 'Place', name: 'French-speaking Switzerland' },
  ],
  fr: [
    { type: 'City', name: 'Bulle' },
    { type: 'AdministrativeArea', name: 'District de la Gruyère' },
    { type: 'State', name: 'Canton de Fribourg' },
    { type: 'Place', name: 'Suisse romande' },
  ],
};

export interface StructuredDataInput {
  lang: Lang;
  page: StructuredDataPage;
  /** Production origin, e.g. https://thomasmiller.ch/ (Astro.site). */
  site: string;
  /** The page's canonical URL. */
  url: string;
  /** The page's <title> and meta description. */
  title: string;
  description: string;
  /** The business's description: the home meta description in the page language. */
  businessDescription: string;
  /** Absolute URLs: the square logo, the home share image and the portrait. */
  logo: string;
  image: string;
  portrait: string;
}

export function structuredData(input: StructuredDataInput) {
  const { lang, page, site, url } = input;
  const abs = (path: string) => new URL(path, site).toString();
  const home = abs('/');
  const ids = {
    business: `${home}#business`,
    person: `${home}#person`,
    website: `${home}#website`,
    webpage: `${url}#webpage`,
  };
  const telephone = contact.phoneHref.replace(/^tel:/, '');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': ids.business,
        name: 'Thomas Miller',
        url: abs(`/${lang}/`),
        description: input.businessDescription,
        email: contact.email,
        telephone,
        logo: input.logo,
        image: input.image,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Bulle',
          addressRegion: 'FR',
          addressCountry: 'CH',
        },
        areaServed: areaServed[lang].map(({ type, name }) => ({ '@type': type, name })),
        knowsLanguage: ['fr', 'en'],
        founder: { '@id': ids.person },
        makesOffer: headlineServices.map((s) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: s.title[lang], description: s.blurb[lang] },
        })),
      },
      {
        '@type': 'Person',
        '@id': ids.person,
        name: 'Thomas Miller',
        jobTitle: jobTitle[lang],
        url: abs(`/${lang}/about/`),
        image: input.portrait,
        email: contact.email,
        knowsLanguage: ['fr', 'en'],
        sameAs: [contact.githubUrl, contact.linkedinUrl],
      },
      {
        '@type': 'WebSite',
        '@id': ids.website,
        name: 'Thomas Miller',
        url: home,
        inLanguage: ['en', 'fr'],
        publisher: { '@id': ids.business },
      },
      {
        '@type': pageType[page],
        '@id': ids.webpage,
        url,
        name: input.title,
        description: input.description,
        inLanguage: lang,
        isPartOf: { '@id': ids.website },
        ...(pageAbout[page] && { about: { '@id': ids[pageAbout[page]] } }),
      },
    ],
  };
}

/** JSON for a <script type="application/ld+json">: every `<` escaped, so no
    string can close the script element. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
