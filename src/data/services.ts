import type { Lang } from '../i18n/ui';

export type Service = { id: string; title: Record<Lang, string>; blurb: Record<Lang, string> };

export const headlineServices: Service[] = [
  {
    id: 'fullstack',
    title: { en: 'Full-stack web development', fr: 'Développement web full-stack' },
    blurb: { en: 'Frontend and backend, end to end.', fr: 'Frontend et backend, de bout en bout.' },
  },
  {
    id: 'frontend-craft',
    title: { en: 'Frontend craft & polish', fr: 'Excellence frontend' },
    blurb: { en: 'Pixel-perfect UI, motion, performance.', fr: 'Interfaces soignées, animation, performance.' },
  },
  {
    id: 'ecommerce-crm',
    title: { en: 'E-commerce & CRM', fr: 'E-commerce & CRM' },
    blurb: { en: 'Stores, integrations, business systems.', fr: 'Boutiques, intégrations, systèmes métier.' },
  },
  {
    id: 'ai',
    title: { en: 'AI integration', fr: 'Intégration IA' },
    blurb: { en: 'Chat, automation, smart features.', fr: 'Chat, automatisation, fonctions intelligentes.' },
  },
  {
    id: 'seo-perf',
    title: { en: 'SEO & performance', fr: 'SEO & performance' },
    blurb: { en: 'Get found, load fast.', fr: 'Soyez trouvé, chargez vite.' },
  },
];

export const capabilities: Service[] = [
  {
    id: 'api-integrations',
    title: { en: 'API & integrations', fr: 'API & intégrations' },
    blurb: { en: 'Stripe, shipping, third-party services.', fr: 'Stripe, livraison, services tiers.' },
  },
  {
    id: 'web-apps',
    title: { en: 'Web apps & dashboards', fr: 'Apps web & tableaux de bord' },
    blurb: { en: 'Internal tools and SaaS-style apps.', fr: 'Outils internes et apps SaaS.' },
  },
  {
    id: 'automation',
    title: { en: 'Automation', fr: 'Automatisation' },
    blurb: { en: 'Workflows that save manual work.', fr: 'Workflows qui éliminent le travail manuel.' },
  },
  {
    id: 'maintenance',
    title: { en: 'Maintenance & support', fr: 'Maintenance & support' },
    blurb: { en: 'Ongoing care and retainers.', fr: 'Suivi continu et forfaits.' },
  },
  {
    id: 'audits',
    title: { en: 'Technical audits', fr: 'Audits techniques' },
    blurb: { en: 'Code, performance, SEO reviews.', fr: 'Revues code, performance, SEO.' },
  },
];
