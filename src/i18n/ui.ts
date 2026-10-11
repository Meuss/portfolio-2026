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
    'home.title': 'Thomas Miller — Web developer in Switzerland',
    'home.description':
      'Web developer at Marvelous Digital in Vevey, and freelance on the side. Fast, multilingual websites for Swiss businesses and institutions.',

    // --- Homepage: hero ---
    'hero.name': 'Thomas Miller',
    'hero.tagline':
      'Web developer at Marvelous Digital in Vevey, and freelance on the side. I build fast, multilingual websites and see them through to launch.',
    'hero.cta': 'Start a project',
    'hero.ctaSecondary': 'See the work',
    'hero.availability': 'Open to a few freelance projects',
    'hero.based': 'Switzerland · FR / EN',
    'hero.wallPause': 'Pause',
    'hero.wallPlay': 'Play',

    // --- Homepage: services ---
    'services.heading': 'What I build',
    'services.intro': 'From a small showcase site to a custom web app, frontend through backend.',
    'capabilities.heading': 'Around the build',

    // --- Homepage: selected work ---
    'work.heading': 'Selected work',
    'work.intro':
      'Built directly for clients, with the macmac studio, and with the team at Marvelous Digital.',
    'work.viewAll': 'All projects',

    // --- Shared: project card ---
    'project.context.independent': 'Freelance',
    'project.context.macmac': 'With macmac',
    'project.context.marvelous': 'At Marvelous',
    'project.nda': 'Under NDA',
    'project.ndaFrame': 'Confidential',
    'project.soon': 'Launching soon',
    'project.newTab': 'opens in a new tab',
    'project.stackLabel': 'Stack',
    'project.screenshotAlt': 'Homepage of {name}',

    // --- Work page: page meta ---
    'workPage.title': 'Work — Thomas Miller',
    'workPage.description':
      'Websites and web apps for Swiss businesses and institutions: freelance projects, work with the macmac studio, and projects at Marvelous Digital.',

    // --- Work page: intro ---
    'workPage.heading': 'Work',
    'workPage.intro':
      'Everything I can show. Each project says how it came about: freelance, with the macmac studio, or with the team at Marvelous Digital.',
    'workPage.filterLabel': 'Filter projects',
    'workPage.filterAll': 'All',
    'workPage.filterStatus': '{n} projects shown',

    // --- About page: page meta ---
    'aboutPage.title': 'About — Thomas Miller',
    'aboutPage.description':
      'Web developer at Marvelous Digital in Vevey, taking on freelance projects alongside: directly for clients, and for the macmac studio.',

    // --- About page: intro & bio ---
    'aboutPage.heading': 'Developer at an agency, freelance on the side',
    'aboutPage.bioIntro':
      'I’m Thomas Miller, a web developer. I work at Marvelous Digital, an agency in Vevey, and take on freelance projects alongside it.',
    'aboutPage.bioParagraph1':
      'At Marvelous I work with the team on sites for Swiss institutions and brands, and on projects for large international clients I can’t name.',
    'aboutPage.bioParagraph2':
      'On my own time I build for clients directly, from a nightclub to a public-sector platform, and I develop sites for macmac, a branding and interiors studio in Marly.',
    'aboutPage.bioParagraph3':
      'I care about the details most visitors never notice. Load times, accessible markup, sensible defaults. They’re what separates a site that works from one that’s genuinely good to use.',
    'aboutPage.portraitAlt': 'Portrait of Thomas Miller',
    'aboutPage.waysHeading': 'Where the work comes from',
    'aboutPage.way1.name': 'Marvelous Digital',
    'aboutPage.way1.meta': 'Employer · Vevey',
    'aboutPage.way1.text':
      'Team projects for research, tourism and industry, among them CSEM, SPIE and Les Bains de Lavey.',
    'aboutPage.way2.name': 'macmac',
    'aboutPage.way2.meta': 'Studio partner · Marly',
    'aboutPage.way2.text':
      'Hotels, restaurants, architects and foundations, many of them around Murten.',
    'aboutPage.way3.name': 'Freelance',
    'aboutPage.way3.meta': 'Directly with you',
    'aboutPage.way3.text':
      'You deal with me, the person writing the code, from the first conversation to launch and the upkeep after.',

    // --- Homepage: approach ---
    'approach.heading': 'Agency standards, one person to talk to',
    'approach.point1.label': 'Craft',
    'approach.point1.text':
      'Every detail considered. Typography, motion, edge cases, the parts users feel but can’t point to.',
    'approach.point2.label': 'Languages',
    'approach.point2.text':
      'Most of these sites ship in two to four languages. We can work together in French or English.',
    'approach.point3.label': 'Performance',
    'approach.point3.text': 'Fast by default. Accessible by default. Measured, not assumed.',
    'approach.point4.label': 'Direct',
    'approach.point4.text':
      'On a freelance project there’s no one in between. You talk to the person building your site.',

    // --- Homepage: closing CTA ---
    'cta.heading': 'Let’s talk about your project',
    'cta.body': 'Tell me what you’re building. I’ll reply within two business days.',
    'cta.button': 'Get in touch',

    // --- Contact page: page meta ---
    'contactPage.title': 'Contact — Thomas Miller',
    'contactPage.description':
      'Get in touch about your next web project. Send a message, or reach me by email, GitHub, or LinkedIn.',

    // --- Contact page: intro & fallback ---
    'contactPage.heading': 'Let’s talk about your project',
    'contactPage.intro':
      'Tell me a bit about what you’re building. I read every message and reply within two business days.',
    'contactPage.fallbackHeading': 'Prefer to reach out directly?',
    'contactPage.fallbackIntro': 'Email, GitHub, or LinkedIn, whichever you prefer.',

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
      'Thanks, your message is on its way. I’ll reply within two business days.',
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
    'home.title': 'Thomas Miller — Développeur web en Suisse',
    'home.description':
      'Développeur web chez Marvelous Digital à Vevey, et freelance en parallèle. Des sites rapides et multilingues pour les entreprises et institutions suisses.',

    // --- Homepage: hero ---
    'hero.name': 'Thomas Miller',
    'hero.tagline':
      'Développeur web chez Marvelous Digital à Vevey, et freelance en parallèle. Je crée des sites rapides et multilingues, et je les mène jusqu’à la mise en ligne.',
    'hero.cta': 'Démarrer un projet',
    'hero.ctaSecondary': 'Voir les projets',
    'hero.availability': 'Ouvert à quelques projets freelance',
    'hero.based': 'Suisse · FR / EN',
    'hero.wallPause': 'Pause',
    'hero.wallPlay': 'Lecture',

    // --- Homepage: services ---
    'services.heading': 'Ce que je construis',
    'services.intro':
      'Du petit site vitrine à l’application web sur mesure, du frontend au backend.',
    'capabilities.heading': 'Autour du projet',

    // --- Homepage: selected work ---
    'work.heading': 'Projets choisis',
    'work.intro':
      'Réalisés en direct pour des clients, avec le studio macmac, et avec l’équipe de Marvelous Digital.',
    'work.viewAll': 'Tous les projets',

    // --- Shared: project card ---
    'project.context.independent': 'Freelance',
    'project.context.macmac': 'Avec macmac',
    'project.context.marvelous': 'Chez Marvelous',
    'project.nda': 'Sous NDA',
    'project.ndaFrame': 'Confidentiel',
    'project.soon': 'Bientôt en ligne',
    'project.newTab': 'ouvre un nouvel onglet',
    'project.stackLabel': 'Stack',
    'project.screenshotAlt': 'Page d’accueil de {name}',

    // --- Work page: page meta ---
    'workPage.title': 'Projets — Thomas Miller',
    'workPage.description':
      'Sites et applications web pour des entreprises et institutions suisses : projets freelance, collaborations avec le studio macmac et projets chez Marvelous Digital.',

    // --- Work page: intro ---
    'workPage.heading': 'Projets',
    'workPage.intro':
      'Tout ce que je peux montrer. Chaque projet indique son contexte : en freelance, avec le studio macmac, ou avec l’équipe de Marvelous Digital.',
    'workPage.filterLabel': 'Filtrer les projets',
    'workPage.filterAll': 'Tous',
    'workPage.filterStatus': '{n} projets affichés',

    // --- About page: page meta ---
    'aboutPage.title': 'À propos — Thomas Miller',
    'aboutPage.description':
      'Développeur web chez Marvelous Digital à Vevey, avec des projets freelance en parallèle : en direct pour des clients, et pour le studio macmac.',

    // --- About page: intro & bio ---
    'aboutPage.heading': 'Développeur en agence, freelance en parallèle',
    'aboutPage.bioIntro':
      'Je m’appelle Thomas Miller, développeur web. Je travaille chez Marvelous Digital, une agence à Vevey, et je mène des projets freelance en parallèle.',
    'aboutPage.bioParagraph1':
      'Chez Marvelous, je travaille en équipe sur des sites pour des institutions et des marques suisses, ainsi que sur des projets pour de grands clients internationaux que je ne peux pas citer.',
    'aboutPage.bioParagraph2':
      'À côté, je développe en direct pour des clients, d’un club à une plateforme du secteur public, et je réalise des sites pour macmac, un studio de branding et d’architecture d’intérieur à Marly.',
    'aboutPage.bioParagraph3':
      'Je porte attention aux détails que la plupart des visiteurs ne remarquent jamais. Temps de chargement, balisage accessible, réglages par défaut sensés. C’est ce qui distingue un site qui fonctionne d’un site vraiment agréable à utiliser.',
    'aboutPage.portraitAlt': 'Portrait de Thomas Miller',
    'aboutPage.waysHeading': 'D’où viennent les projets',
    'aboutPage.way1.name': 'Marvelous Digital',
    'aboutPage.way1.meta': 'Employeur · Vevey',
    'aboutPage.way1.text':
      'Des projets d’équipe pour la recherche, le tourisme et l’industrie, dont le CSEM, SPIE et les Bains de Lavey.',
    'aboutPage.way2.name': 'macmac',
    'aboutPage.way2.meta': 'Studio partenaire · Marly',
    'aboutPage.way2.text':
      'Hôtels, restaurants, architectes et fondations, souvent dans la région de Morat.',
    'aboutPage.way3.name': 'Freelance',
    'aboutPage.way3.meta': 'En direct avec vous',
    'aboutPage.way3.text':
      'Vous échangez avec moi, la personne qui écrit le code, du premier échange à la mise en ligne et au suivi.',

    // --- Homepage: approach ---
    'approach.heading': 'La rigueur d’une agence, un seul interlocuteur',
    'approach.point1.label': 'Exigence',
    'approach.point1.text':
      'Chaque détail compte. Typographie, animation, cas limites, ce que l’on ressent sans pouvoir le nommer.',
    'approach.point2.label': 'Langues',
    'approach.point2.text':
      'La plupart de ces sites existent en deux à quatre langues. Nous pouvons travailler en français ou en anglais.',
    'approach.point3.label': 'Performance',
    'approach.point3.text': 'Rapide par défaut. Accessible par défaut. Mesuré, jamais supposé.',
    'approach.point4.label': 'Direct',
    'approach.point4.text':
      'En freelance, il n’y a pas d’intermédiaire. Vous parlez à la personne qui construit votre site.',

    // --- Homepage: closing CTA ---
    'cta.heading': 'Parlons de votre projet',
    'cta.body': 'Dites-moi ce que vous construisez. Je réponds sous deux jours ouvrés.',
    'cta.button': 'Me contacter',

    // --- Contact page: page meta ---
    'contactPage.title': 'Contact — Thomas Miller',
    'contactPage.description':
      'Contactez-moi pour votre prochain projet web. Envoyez un message ou écrivez-moi par e-mail, GitHub ou LinkedIn.',

    // --- Contact page: intro & fallback ---
    'contactPage.heading': 'Parlons de votre projet',
    'contactPage.intro':
      'Dites-moi en quelques mots ce que vous construisez. Je lis chaque message et je réponds sous deux jours ouvrés.',
    'contactPage.fallbackHeading': 'Vous préférez me contacter directement ?',
    'contactPage.fallbackIntro': 'E-mail, GitHub ou LinkedIn, comme vous préférez.',

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
      'Merci, votre message est en route. Je réponds sous deux jours ouvrés.',
    'contactForm.errorMessage': 'Une erreur s’est produite. Réessayez, ou écrivez-moi directement.',
  },
};
