import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { languages, ui, type Lang } from '../i18n/ui';
import { shareImage, shareImageAlt, shareImagePath, sharePages } from './share';

const langs = Object.keys(languages) as Lang[];
// The ui.ts prefix of each indexable page's <title> and meta description.
const metaKey = {
  home: 'home',
  work: 'workPage',
  about: 'aboutPage',
  contact: 'contactPage',
  privacy: 'privacyPage',
} as const;
const length = (s: string) => [...s].length;

describe('page titles and descriptions', () => {
  const all = langs.flatMap((lang) =>
    sharePages.map((page) => ({
      where: `${lang}/${page}`,
      title: ui[lang][`${metaKey[page]}.title`],
      description: ui[lang][`${metaKey[page]}.description`],
    })),
  );

  it('fit in search results', () => {
    for (const { where, title, description } of all) {
      expect(length(title), `${where} title: ${title}`).toBeGreaterThanOrEqual(30);
      expect(length(title), `${where} title: ${title}`).toBeLessThanOrEqual(60);
      expect(length(description), `${where} description`).toBeGreaterThanOrEqual(110);
      expect(length(description), `${where} description`).toBeLessThanOrEqual(160);
    }
  });

  it('are unique across pages and languages', () => {
    expect(new Set(all.map((p) => p.title)).size).toBe(all.length);
    expect(new Set(all.map((p) => p.description)).size).toBe(all.length);
  });
});

describe('share images', () => {
  it('have either a headline or their own alt text, for exactly the share pages', () => {
    for (const lang of langs) {
      const pages = Object.keys(ui[lang])
        .map((key) => key.match(/^og\.(\w+)\.(?:headline|imageAlt)$/)?.[1])
        .filter(Boolean)
        .sort();
      expect(pages, lang).toEqual([...sharePages].sort());
    }
  });

  it('have a truthful alt text', () => {
    for (const lang of langs) {
      for (const page of sharePages) {
        const alt = shareImageAlt(lang, page);
        expect(alt, `${lang}/${page}`).not.toMatch(/\{|undefined/);
        expect(alt, `${lang}/${page}`).toContain('Thomas Miller');
      }
    }
  });

  it('exist as 1200×630 PNGs under 300 KB (run brand/build_og.py after editing a headline or the tagline)', () => {
    for (const lang of langs) {
      for (const page of sharePages) {
        const file = `public${shareImagePath(lang, page)}`;
        expect(existsSync(file), file).toBe(true);
        const png = readFileSync(file);
        expect(png.toString('ascii', 1, 4), file).toBe('PNG');
        // IHDR: width and height are the first two big-endian uint32 after the chunk header.
        expect([png.readUInt32BE(16), png.readUInt32BE(20)], file).toEqual([
          shareImage.width,
          shareImage.height,
        ]);
        expect(statSync(file).size, file).toBeLessThan(300 * 1024);
      }
    }
  });

  it('show the current headline, or tagline (run brand/build_og.py after editing one)', () => {
    // build_og.py stores the text it drew in an iTXt "Title" chunk: the headline, or the tagline on the
    // images without one (home: the logo alone; about: the logo and the portrait).
    const drawnTitle = (png: Buffer) => {
      for (let at = 8; at < png.length;) {
        const size = png.readUInt32BE(at);
        if (png.toString('ascii', at + 4, at + 8) === 'iTXt') {
          const data = png.subarray(at + 8, at + 8 + size);
          if (data.toString('latin1', 0, 6) === 'Title\0')
            // keyword\0, compression flag and method, empty language tag\0 and translated keyword\0
            return data.subarray(10).toString('utf8');
        }
        at += size + 12;
      }
      return null;
    };
    for (const lang of langs) {
      for (const page of sharePages) {
        const file = `public${shareImagePath(lang, page)}`;
        const text = ui[lang][`og.${page}.headline`] ?? ui[lang]['brand.tagline'];
        expect(drawnTitle(readFileSync(file)), file).toBe(text);
      }
    }
  });
});
