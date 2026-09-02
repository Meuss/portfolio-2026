export const languages = { en: 'English', fr: 'Français' } as const;
export const defaultLang = 'en';
export type Lang = keyof typeof languages;

export const ui: Record<Lang, Record<string, string>> = {
  en: {
    'nav.work': 'Work',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.home': 'Home',
    'nav.primary': 'Primary navigation',
    'nav.menuOpen': 'Open menu',
    'nav.menuClose': 'Close menu',
    'nav.skipToContent': 'Skip to content',
    'lang.switcher': 'Language',
    'footer.tagline': "Let's build something worth shipping.",
    'footer.email': 'Email',
    'footer.github': 'GitHub',
    'footer.linkedin': 'LinkedIn',
    'footer.rights': 'All rights reserved.',

    // --- Homepage: page meta ---
    'home.title': 'Thomas Miller — Freelance web developer in Switzerland',
    'home.description':
      'Swiss freelance web developer building fast, bilingual websites, e-commerce, and web apps — from frontend craft to full-stack delivery.',

    // --- Homepage: hero ---
    'hero.eyebrow': 'Freelance web developer · Switzerland',
    'hero.name': 'Thomas Miller',
    'hero.tagline':
      'I design and build fast, bilingual web experiences — from the first pixel to production.',
    'hero.cta': 'Start a project',
    'hero.ctaSecondary': 'See selected work',
    'hero.availability': 'Available for new projects',
    'hero.based': 'Based in Switzerland · working remotely',

    // --- Homepage: services ---
    'services.eyebrow': 'Services',
    'services.heading': 'What I build',
    'services.intro': 'Five ways I help teams and founders ship.',
    'services.featuredLabel': 'Where I go deepest',

    // --- Homepage: capabilities strip ---
    'capabilities.eyebrow': 'Capabilities',
    'capabilities.lead': 'Supporting skills that round out a project.',

    // --- Homepage: selected work ---
    'work.eyebrow': 'Selected work',
    'work.heading': 'Recent projects',
    'work.viewAll': 'See all work',

    // --- Shared: project card ---
    'project.nda': 'Client work',
    'project.visit': 'Visit site',
    'project.newTab': 'opens in a new tab',
    'project.roleLabel': 'Role',

    // --- Homepage: approach ---
    'approach.eyebrow': 'How I work',
    'approach.heading': 'Senior craft, without the agency overhead',
    'approach.point1.label': 'Craft',
    'approach.point1.text':
      'Every detail considered — typography, motion, edge cases, the parts users feel but never notice.',
    'approach.point2.label': 'Bilingual',
    'approach.point2.text':
      'Native-quality work in English and French, built for Switzerland’s multilingual market.',
    'approach.point3.label': 'Performance',
    'approach.point3.text':
      'Fast by default. Accessible by default. Measured, not assumed.',
    'approach.point4.label': 'Direct',
    'approach.point4.text':
      'You work with the person writing the code — clear communication, no layers in between.',

    // --- Homepage: closing CTA ---
    'cta.eyebrow': 'Let’s talk',
    'cta.heading': 'Let’s talk about your project',
    'cta.body': 'Tell me what you’re building. I’ll reply within two business days.',
    'cta.button': 'Get in touch',
  },
  fr: {
    'nav.work': 'Projets',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.home': 'Accueil',
    'nav.primary': 'Navigation principale',
    'nav.menuOpen': 'Ouvrir le menu',
    'nav.menuClose': 'Fermer le menu',
    'nav.skipToContent': 'Aller au contenu',
    'lang.switcher': 'Langue',
    'footer.tagline': 'Construisons quelque chose qui compte.',
    'footer.email': 'E-mail',
    'footer.github': 'GitHub',
    'footer.linkedin': 'LinkedIn',
    'footer.rights': 'Tous droits réservés.',

    // --- Homepage: page meta ---
    'home.title': 'Thomas Miller — Développeur web freelance en Suisse',
    'home.description':
      'Développeur web freelance en Suisse : sites, e-commerce et apps web rapides et bilingues — du frontend soigné à la livraison full-stack.',

    // --- Homepage: hero ---
    'hero.eyebrow': 'Développeur web freelance · Suisse',
    'hero.name': 'Thomas Miller',
    'hero.tagline':
      'Je conçois et développe des expériences web rapides et bilingues — du premier pixel à la production.',
    'hero.cta': 'Démarrer un projet',
    'hero.ctaSecondary': 'Voir les projets',
    'hero.availability': 'Disponible pour de nouveaux projets',
    'hero.based': 'Basé en Suisse · à distance',

    // --- Homepage: services ---
    'services.eyebrow': 'Services',
    'services.heading': 'Ce que je construis',
    'services.intro': 'Cinq façons d’aider équipes et fondateurs à livrer.',
    'services.featuredLabel': 'Là où je vais le plus loin',

    // --- Homepage: capabilities strip ---
    'capabilities.eyebrow': 'Capacités',
    'capabilities.lead': 'Des compétences complémentaires pour compléter un projet.',

    // --- Homepage: selected work ---
    'work.eyebrow': 'Projets sélectionnés',
    'work.heading': 'Projets récents',
    'work.viewAll': 'Voir tous les projets',

    // --- Shared: project card ---
    'project.nda': 'Projet client',
    'project.visit': 'Voir le site',
    'project.newTab': 'ouvre un nouvel onglet',
    'project.roleLabel': 'Rôle',

    // --- Homepage: approach ---
    'approach.eyebrow': 'Ma façon de travailler',
    'approach.heading': 'Un travail soigné, sans les lourdeurs d’agence',
    'approach.point1.label': 'Exigence',
    'approach.point1.text':
      'Chaque détail compte — typographie, animation, cas limites, ce que l’on ressent sans jamais le voir.',
    'approach.point2.label': 'Bilingue',
    'approach.point2.text':
      'Un travail de qualité native en anglais et en français, pensé pour le marché suisse multilingue.',
    'approach.point3.label': 'Performance',
    'approach.point3.text':
      'Rapide par défaut. Accessible par défaut. Mesuré, jamais supposé.',
    'approach.point4.label': 'Direct',
    'approach.point4.text':
      'Vous échangez avec la personne qui écrit le code — communication claire, sans intermédiaires.',

    // --- Homepage: closing CTA ---
    'cta.eyebrow': 'Parlons-en',
    'cta.heading': 'Parlons de votre projet',
    'cta.body': 'Dites-moi ce que vous construisez. Je réponds sous deux jours ouvrés.',
    'cta.button': 'Me contacter',
  },
};
