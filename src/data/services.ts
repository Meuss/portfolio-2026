import type { Lang } from '../i18n/ui';

export type Service = { id: string; title: Record<Lang, string>; blurb: Record<Lang, string> };

export const headlineServices: Service[] = [
  {
    id: 'websites',
    title: { en: 'Showcase websites', fr: 'Sites vitrines' },
    blurb: {
      en: 'A carefully made site that presents your business, on computer and phone.',
      fr: 'Un site soigné qui présente votre activité, sur ordinateur et sur mobile.',
    },
  },
  {
    id: 'ecommerce',
    title: { en: 'Online shops and bookings', fr: 'Boutiques en ligne et réservations' },
    blurb: {
      en: 'Sell and take bookings online, connected to the tools you manage your business with.',
      fr: 'Vendre et prendre des réservations en ligne, en lien avec vos outils de gestion.',
    },
  },
  {
    id: 'web-apps',
    title: { en: 'Custom applications', fr: 'Applications sur mesure' },
    blurb: {
      en: 'Internal tools and dashboards built around how you work.',
      fr: 'Des outils internes et des tableaux de bord adaptés à votre façon de travailler.',
    },
  },
  {
    id: 'seo-perf',
    title: { en: 'Search visibility and speed', fr: 'Référencement et rapidité' },
    blurb: {
      en: 'Help people find you on Google, with a site that loads quickly.',
      fr: 'Qu’on vous trouve sur Google, avec un site qui s’affiche vite.',
    },
  },
  {
    id: 'maintenance',
    title: { en: 'Maintenance and support', fr: 'Maintenance et suivi' },
    blurb: {
      en: 'Hosting, security updates, backups and changes, so your site stays in good shape.',
      fr: 'Hébergement, mises à jour de sécurité, sauvegardes et modifications, pour que votre site reste en forme.',
    },
  },
];

export const capabilities: Service[] = [
  {
    id: 'multilingual',
    title: { en: 'Multilingual sites', fr: 'Sites multilingues' },
    blurb: {
      en: 'In French, German, English or Italian.',
      fr: 'En français, en allemand, en anglais ou en italien.',
    },
  },
  {
    id: 'api-integrations',
    title: { en: 'Connecting your tools', fr: 'Liaison avec vos outils' },
    blurb: {
      en: 'Payment, shipping and other outside services.',
      fr: 'Paiement, livraison et autres services externes.',
    },
  },
  {
    id: 'automation',
    title: { en: 'Automation', fr: 'Automatisation' },
    blurb: {
      en: 'Less repetitive manual work.',
      fr: 'Moins de tâches manuelles répétitives.',
    },
  },
  {
    id: 'ai',
    title: { en: 'AI features', fr: 'Fonctions d’IA' },
    blurb: {
      en: 'A chat or smart features on your site.',
      fr: 'Un chat ou des fonctions intelligentes sur votre site.',
    },
  },
  {
    id: 'audits',
    title: { en: 'Site reviews', fr: 'Audit de votre site' },
    blurb: {
      en: 'A close look at your code, speed and search visibility.',
      fr: 'Un examen du code, de la rapidité et du référencement.',
    },
  },
];
