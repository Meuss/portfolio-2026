import { describe, expect, it } from 'vitest';
import { languages, ui, type Lang } from '../i18n/ui';
import { contact } from './contact';
import { sharePages } from './share';
import { serializeJsonLd, structuredData, type StructuredDataPage } from './structured-data';

const langs = Object.keys(languages) as Lang[];
const site = 'https://thomasmiller.ch/';

const build = (lang: Lang, page: StructuredDataPage) =>
  structuredData({
    lang,
    page,
    site,
    url: `${site}${lang}/${page === 'home' ? '' : `${page}/`}`,
    title: 'Title',
    description: 'Description',
    businessDescription: ui[lang]['home.description'],
    logo: `${site}icon-512.png`,
    image: `${site}og/${lang}-home.png`,
    portrait: `${site}_astro/profile.jpg`,
  });

type Node = Record<string, unknown> & { '@type': string; '@id': string };
const nodes = (lang: Lang, page: StructuredDataPage) => build(lang, page)['@graph'] as Node[];
const byType = (graph: Node[], type: string) => graph.find((n) => n['@type'] === type)!;

/** Every { "@id": … } reference anywhere in a value. */
const refs = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(refs);
  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 1 && entries[0][0] === '@id') return [entries[0][1] as string];
    return entries.flatMap(([k, v]) => (k === '@id' ? [] : refs(v)));
  }
  return [];
};

describe('structured data', () => {
  it('links every @id reference to a node of the same graph', () => {
    for (const lang of langs) {
      for (const page of sharePages) {
        const graph = nodes(lang, page);
        const ids = new Set(graph.map((n) => n['@id']));
        expect(ids.size, `${lang}/${page}`).toBe(graph.length);
        for (const ref of refs(graph)) expect(ids, `${lang}/${page}: ${ref}`).toContain(ref);
      }
    }
  });

  it('uses absolute URLs only', () => {
    const urls = JSON.stringify(build('fr', 'home')).match(/"(?:https?:)?\/[^"]*"/g) ?? [];
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) expect(url).toMatch(/^"https:\/\//);
  });

  it('describes the business with the public facts only', () => {
    const business = byType(nodes('fr', 'home'), 'LocalBusiness');
    expect(business['@id']).toBe(`${site}#business`);
    expect(business.email).toBe(contact.email);
    expect(business.telephone).toBe('+41795602071');
    expect(business.description).toBe(ui.fr['home.description']);
    expect(business.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Bulle',
      addressRegion: 'FR',
      addressCountry: 'CH',
    });
    for (const left of ['geo', 'openingHoursSpecification', 'priceRange', 'aggregateRating'])
      expect(business, left).not.toHaveProperty(left);
  });

  it('follows the page language', () => {
    for (const lang of langs) {
      const graph = nodes(lang, 'about');
      expect(byType(graph, 'AboutPage').inLanguage).toBe(lang);
      expect(byType(graph, 'Person').jobTitle).toBe(
        lang === 'fr' ? 'Développeur web' : 'Web developer',
      );
    }
  });

  it('names the founder with GitHub and LinkedIn', () => {
    const person = byType(nodes('en', 'home'), 'Person');
    expect(person.sameAs).toEqual([contact.githubUrl, contact.linkedinUrl]);
  });

  it('serializes so that no string can close the script element', () => {
    const json = serializeJsonLd({ name: '</script><script>alert(1)</script>' });
    expect(json).not.toContain('<');
    expect(JSON.parse(json)).toEqual({ name: '</script><script>alert(1)</script>' });
  });
});
