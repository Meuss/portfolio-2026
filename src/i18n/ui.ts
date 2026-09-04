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

    // --- Work page: page meta ---
    'workPage.title': 'Work — Thomas Miller',
    'workPage.description':
      'A curated selection of web development projects — e-commerce, dashboards, marketing sites, and client platforms.',

    // --- Work page: intro ---
    'workPage.eyebrow': 'Work',
    'workPage.heading': 'Projects',
    'workPage.intro':
      'A selection of sites, apps, and platforms I’ve designed and built — from public launches to confidential client work.',

    // --- About page: page meta ---
    'aboutPage.title': 'About — Thomas Miller',
    'aboutPage.description':
      'Swiss freelance web developer working across front-end and back-end — currently building at Marvelous Digital, available for independent projects.',

    // --- About page: intro & bio ---
    'aboutPage.eyebrow': 'About',
    'aboutPage.heading': 'The person behind the code',
    'aboutPage.bioIntro':
      'I’m Thomas Miller, a freelance web developer based in Switzerland, working across the front end and back end to ship products people actually use.',
    'aboutPage.bioParagraph1':
      'Day to day, I work as part of the team at Marvelous Digital, and take on independent projects alongside that — from marketing sites to full-stack web apps. Either way, the standard doesn’t change: clean code, considered design, and software that holds up once it’s live.',
    'aboutPage.bioParagraph2':
      'I care about the details most visitors never consciously notice — load times, accessible markup, sensible defaults — because they’re the difference between a site that merely works and one that feels right. If that sounds like what your project needs, I’d be glad to talk it through.',
    'aboutPage.portraitAlt': 'Portrait of Thomas Miller',

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
    'approach.point3.text': 'Fast by default. Accessible by default. Measured, not assumed.',
    'approach.point4.label': 'Direct',
    'approach.point4.text':
      'You work with the person writing the code — clear communication, no layers in between.',

    // --- Homepage: closing CTA ---
    'cta.eyebrow': 'Let’s talk',
    'cta.heading': 'Let’s talk about your project',
    'cta.body': 'Tell me what you’re building. I’ll reply within two business days.',
    'cta.button': 'Get in touch',

    // --- Contact page: page meta ---
    'contactPage.title': 'Contact — Thomas Miller',
    'contactPage.description':
      'Get in touch about your next web project — send a message, or reach out by email, GitHub, or LinkedIn.',

    // --- Contact page: intro & fallback ---
    'contactPage.eyebrow': 'Contact',
    'contactPage.heading': 'Let’s talk about your project',
    'contactPage.intro':
      'Tell me a bit about what you’re building. I read every message and reply within two business days.',
    'contactPage.fallbackHeading': 'Prefer to reach out directly?',
    'contactPage.fallbackIntro': 'Email, GitHub, or LinkedIn — whichever you prefer.',

    // --- Contact page: form ---
    'contactForm.nameLabel': 'Name',
    'contactForm.namePlaceholder': 'Your name',
    'contactForm.emailLabel': 'Email',
    'contactForm.emailPlaceholder': 'you@example.com',
    'contactForm.messageLabel': 'Message',
    'contactForm.messagePlaceholder': 'Tell me about your project…',
    'contactForm.honeypotLabel': 'Leave this field empty',
    'contactForm.submit': 'Send message',
    'contactForm.sending': 'Sending…',
    'contactForm.successMessage':
      'Thanks — your message is on its way. I’ll reply within two business days.',
    'contactForm.errorMessage': 'Something went wrong. Please try again, or email me directly.',
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

    // --- Work page: page meta ---
    'workPage.title': 'Projets — Thomas Miller',
    'workPage.description':
      'Une sélection de projets de développement web : e-commerce, tableaux de bord, sites vitrines et plateformes clients.',

    // --- Work page: intro ---
    'workPage.eyebrow': 'Portfolio',
    'workPage.heading': 'Projets',
    'workPage.intro':
      'Une sélection de sites, d’applications et de plateformes que j’ai conçus et développés — des lancements publics aux projets clients confidentiels.',

    // --- About page: page meta ---
    'aboutPage.title': 'À propos — Thomas Miller',
    'aboutPage.description':
      'Développeur web freelance en Suisse, actif du frontend au backend — actuellement chez Marvelous Digital, disponible pour des projets indépendants.',

    // --- About page: intro & bio ---
    'aboutPage.eyebrow': 'À propos',
    'aboutPage.heading': 'La personne derrière le code',
    'aboutPage.bioIntro':
      'Je m’appelle Thomas Miller, développeur web freelance basé en Suisse, actif du frontend au backend pour livrer des produits que les gens utilisent vraiment.',
    'aboutPage.bioParagraph1':
      'Au quotidien, je fais partie de l’équipe de Marvelous Digital, et je mène en parallèle des projets indépendants — de sites vitrines à des applications web full-stack. Dans les deux cas, l’exigence reste la même : un code propre, un design réfléchi, et un logiciel qui tient la route une fois en ligne.',
    'aboutPage.bioParagraph2':
      'Je porte attention aux détails que la plupart des visiteurs ne remarquent jamais consciemment — temps de chargement, balisage accessible, réglages par défaut sensés — car c’est ce qui distingue un site qui fonctionne d’un site qui donne une bonne impression. Si c’est ce dont votre projet a besoin, je serai heureux d’en discuter.',
    'aboutPage.portraitAlt': 'Portrait de Thomas Miller',

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
    'approach.point3.text': 'Rapide par défaut. Accessible par défaut. Mesuré, jamais supposé.',
    'approach.point4.label': 'Direct',
    'approach.point4.text':
      'Vous échangez avec la personne qui écrit le code — communication claire, sans intermédiaires.',

    // --- Homepage: closing CTA ---
    'cta.eyebrow': 'Parlons-en',
    'cta.heading': 'Parlons de votre projet',
    'cta.body': 'Dites-moi ce que vous construisez. Je réponds sous deux jours ouvrés.',
    'cta.button': 'Me contacter',

    // --- Contact page: page meta ---
    'contactPage.title': 'Contact — Thomas Miller',
    'contactPage.description':
      'Contactez-moi pour votre prochain projet web — envoyez un message ou écrivez-moi par e-mail, GitHub ou LinkedIn.',

    // --- Contact page: intro & fallback ---
    'contactPage.eyebrow': 'Contact',
    'contactPage.heading': 'Parlons de votre projet',
    'contactPage.intro':
      'Dites-moi en quelques mots ce que vous construisez. Je lis chaque message et je réponds sous deux jours ouvrés.',
    'contactPage.fallbackHeading': 'Vous préférez me contacter directement ?',
    'contactPage.fallbackIntro': 'E-mail, GitHub ou LinkedIn — comme vous préférez.',

    // --- Contact page: form ---
    'contactForm.nameLabel': 'Nom',
    'contactForm.namePlaceholder': 'Votre nom',
    'contactForm.emailLabel': 'E-mail',
    'contactForm.emailPlaceholder': 'vous@exemple.com',
    'contactForm.messageLabel': 'Message',
    'contactForm.messagePlaceholder': 'Parlez-moi de votre projet…',
    'contactForm.honeypotLabel': 'Laissez ce champ vide',
    'contactForm.submit': 'Envoyer le message',
    'contactForm.sending': 'Envoi en cours…',
    'contactForm.successMessage':
      'Merci — votre message est en route. Je réponds sous deux jours ouvrés.',
    'contactForm.errorMessage': 'Une erreur s’est produite. Réessayez, ou écrivez-moi directement.',
  },
};
