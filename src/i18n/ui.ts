export const languages = { en: 'English', fr: 'Français' } as const;
export const defaultLang = 'en';
export type Lang = keyof typeof languages;

export const ui: Record<Lang, Record<string, string>> = {
  en: { 'nav.work': 'Work', 'nav.about': 'About', 'nav.contact': 'Contact' },
  fr: { 'nav.work': 'Projets', 'nav.about': 'À propos', 'nav.contact': 'Contact' },
};
