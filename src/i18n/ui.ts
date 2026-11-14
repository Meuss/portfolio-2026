export const languages = { en: 'English', fr: 'Français' } as const;
export const defaultLang = 'en';
export type Lang = keyof typeof languages;

export const ui: Record<Lang, Record<string, string>> = {
  en: {
    'nav.work': 'Work',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.home': 'Home',
    'brand.tagline': 'Web developer · Bulle',
    'nav.primary': 'Primary navigation',
    'nav.menuOpen': 'Open menu',
    'nav.menuClose': 'Close menu',
    'nav.skipToContent': 'Skip to content',
    'lang.switcher': 'Language',
    'lang.switcherFooter': 'Language (footer)',
    'footer.tagline': 'Reach me directly',
    'footer.email': 'Email',
    'footer.phone': 'Phone',
    'footer.github': 'GitHub',
    'footer.linkedin': 'LinkedIn',
    'footer.whatsapp': 'WhatsApp',
    'footer.privacy': 'Privacy & legal notice',

    // --- Homepage: page meta ---
    'home.title': 'Thomas Miller — Web developer in Bulle, Switzerland',
    'home.description':
      'Websites and apps for small businesses and independents in French-speaking Switzerland, built and looked after by Thomas Miller, a web developer in Bulle.',

    // --- Homepage: hero ---
    'hero.name': 'Thomas Miller',
    'hero.tagline':
      'I build and look after websites and apps for small businesses and independents in French-speaking Switzerland. I’m also a developer at the Marvelous Digital agency.',
    'hero.cta': 'Talk about your project',
    'hero.ctaSecondary': 'See the work',
    'hero.availability': 'Available for a few projects',
    'hero.based': 'Bulle, Switzerland · FR / EN',
    'hero.wallPause': 'Pause',
    'hero.wallPlay': 'Play',

    // --- Homepage: services ---
    'services.heading': 'What I can do for you',
    'services.intro': 'From a small showcase site to a custom application.',
    'capabilities.heading': 'Also',

    // --- Homepage: selected work ---
    'work.heading': 'Latest projects',
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
    'project.tagMultilingual': 'Multilingual',
    'project.screenshotAlt': 'Homepage of {name}',

    // --- Work page: page meta ---
    'workPage.title': 'Work — Thomas Miller',
    'workPage.description':
      'Websites and web apps for Swiss businesses and institutions: freelance projects, work with the macmac studio, and projects at Marvelous Digital.',

    // --- Work page: intro ---
    'workPage.heading': 'Work',
    'workPage.intro':
      'I’ve worked on hundreds of websites since 2014. These are the most recent, and a few others that are representative. Each project says how it came about: freelance, with the macmac studio, or with the team at Marvelous Digital.',
    'workPage.filterLabel': 'Filter projects',
    'workPage.filterAll': 'All',
    'workPage.listHeading': 'Projects',
    'workPage.filterStatus': '{n} projects shown',
    'work.teaser.frame': 'Your site here',
    'work.teaser.kind': 'Next project',
    'work.teaser.title': 'Your project?',
    'work.teaser.body':
      'This spot is open. Tell me what you need, and it could be the next one on this page.',

    // --- About page: page meta ---
    'aboutPage.title': 'About — Thomas Miller',
    'aboutPage.description':
      'Web developer since 2014. At Marvelous Digital in Vevey, taking on freelance projects alongside: directly for clients, and for the macmac studio.',

    // --- About page: intro & bio ---
    'aboutPage.heading': 'One person to talk to, from idea to launch',
    'aboutPage.bioIntro':
      'I’m Thomas Miller, a web developer. I’ve been building for the web since 2014, from showcase sites to custom applications. I work at Marvelous Digital, an agency in Vevey, and take on freelance projects alongside it.',
    'aboutPage.bioParagraph1':
      'At Marvelous I work with the team on sites for Swiss institutions and brands, and on projects for large international clients.',
    'aboutPage.bioParagraph2':
      'On my own time I build directly for individuals, small businesses and public institutions, and I develop sites for macmac, a branding and interiors studio in Marly.',
    'aboutPage.bioParagraph3':
      'AI has changed how I work. I can take on more myself and deliver faster, so a freelance project now costs less than it used to. That’s why I’m gradually giving more of my time to freelance work.',
    'aboutPage.portraitAlt': 'Portrait of Thomas Miller',
    'aboutPage.waysHeading': 'Who I work with',
    'aboutPage.way1.name': 'Marvelous Digital',
    'aboutPage.way1.meta': 'Employer · Vevey',
    'aboutPage.way1.text':
      'A web agency that develops tailor-made digital solutions. I work there with a very talented team of project managers, designers and developers. For a larger project, I can put you in touch with them.',
    'aboutPage.way2.name': 'macmac',
    'aboutPage.way2.meta': 'Studio partner · Marly',
    'aboutPage.way2.text':
      'I worked there for four years, until 2019, and we have stayed on very good terms: I still build some of their new projects and maintain the older ones. Hotels, restaurants, architects and foundations, many of them around Murten or Fribourg.',
    'aboutPage.way3.name': 'Freelance',
    'aboutPage.way3.meta': 'Directly with you',
    'aboutPage.way3.text':
      'You deal with me, the person writing the code, from the first conversation to launch and the upkeep after.',

    // --- Homepage: approach ---
    'approach.heading': 'Agency standards, one person to talk to',
    'approach.point1.title': 'Building for the web since 2014',
    'approach.point1.text':
      'Showcase sites, online shops, custom applications. I take care over every detail: layout, animation, how it feels on a phone, how fast it loads.',
    'approach.point2.title': 'AI has changed the game',
    'approach.point2.text':
      'I use AI tools such as Claude Code every day. They let me work faster and better than before, for a budget that is often well below an agency’s.',
    'approach.point3.title': 'The result is my responsibility',
    'approach.point3.text':
      'You deal directly with the person building your site, in French or English. I take full responsibility for delivering quality work.',

    // --- Homepage: how it works ---
    'how.heading': 'How it works',
    'how.intro': 'Every project is different, so I adapt to what you need.',
    'how.step1.title': 'You tell me what you need',
    'how.step1.text':
      'An email or a call is enough, no technical terms required. This first conversation is free.',
    'how.step2.title': 'I suggest how to do it',
    'how.step2.text':
      'I tell you what I’d recommend, what it would cost and when I could work on it.',
    'how.step3.title': 'We sign, then I build it',
    'how.step3.text': 'Billing only starts once the project is signed and under way.',
    'how.step4.title': 'I stay on after launch',
    'how.step4.text':
      'If needed, I take care of maintenance, changes, updates and future developments.',
    'how.faqHeading': 'Common questions',
    'how.faq1.q': 'How much does it cost?',
    'how.faq1.a':
      'It depends on what you need, and I adapt to your project. So far, my projects have ranged from around CHF 1’000 for the smallest to around CHF 30’000 for the largest. With AI, a site goes live faster than it did a year ago, so it costs less.',
    'how.faq2.q': 'When can you start?',
    'how.faq2.a':
      'It depends on the project. I also have a job at an agency, so if your deadline is tight, tell me early so I can plan for it. I’ll give you an estimate when we talk.',
    'how.faq3.q': 'Can I edit the site myself?',
    'how.faq3.a':
      'Yes. Most of my projects use a CMS, a tool that lets you manage your own content. If you’d rather not, I can make the changes for you.',
    'how.faq4.q': 'What if I don’t know much about any of this?',
    'how.faq4.a':
      'That’s fine, it’s my job. I explain the choices without jargon and tell you what I’d recommend. I can manage the domain name and hosting for you, or help you manage them yourself. And if you want, we can set up a maintenance contract for the long run.',
    'how.faq5.q': 'What if I don’t have a design yet?',
    'how.faq5.a':
      'If you need one, I bring in colleagues and contacts who can help. I can also generate several design variants with AI and let you choose the one you like best.',
    'how.faq6.q': 'What should I prepare?',
    'how.faq6.a':
      'Not much. An idea of what the site should do, two or three sites you like and, if possible, a budget and a deadline in mind. We work out the rest together.',
    'how.faq7.q': 'What if my project is too big for one person?',
    'how.faq7.a':
      'Then I can take it through Marvelous Digital, the agency where I work. You get a full team: project management, designers, a QA team, planning, maintenance and more. We work out which setup fits when we talk.',
    'how.faq8.q': 'What if I already have a designer or developers?',
    'how.faq8.a':
      'That works. I can build from your existing designs, work alongside your designers, or support your developers on a project. I adapt to your tools and your way of working.',

    // --- Homepage: closing CTA ---
    'cta.heading': 'Let’s talk about your project',
    'cta.body': 'Tell me what you need. I’ll reply within two business days.',
    'cta.button': 'Get in touch',

    // --- Contact page: page meta ---
    'contactPage.title': 'Contact — Thomas Miller',
    'contactPage.description':
      'Get in touch about your next web project. Send a message, call me, or reach me by email, WhatsApp, or LinkedIn.',

    // --- 404 ---
    'notFound.title': 'Page not found — Thomas Miller',
    'notFound.description': 'This page doesn’t exist or has moved.',
    'notFound.line1': 'Error 404',
    'notFound.line2': 'Not found',
    'notFound.home': 'Get me out of here',

    // --- Contact page: intro & fallback ---
    'contactPage.heading': 'Let’s talk about your project',
    'contactPage.intro':
      'Tell me briefly what you need. I read every message and reply within two business days.',
    'contactPage.fallbackHeading': 'Prefer to reach out directly?',
    'contactPage.fallbackIntro': 'Email, phone, WhatsApp, or LinkedIn, whichever you prefer.',

    // --- Contact page: form ---
    'contactForm.nameLabel': 'Name',
    'contactForm.namePlaceholder': 'Your name',
    'contactForm.emailLabel': 'Email',
    'contactForm.emailPlaceholder': 'you@example.com',
    'contactForm.messageLabel': 'Message',
    'contactForm.messagePlaceholder': 'Tell me about your project…',
    'contactForm.honeypotLabel': 'Leave this field empty',
    'contactForm.attachmentToggle': 'Add an attachment?',
    'contactForm.attachmentLabel': 'Attachment (optional)',
    'contactForm.attachmentRemove': 'Remove',
    'contactForm.attachmentRemoveLabel': 'Remove the attached file',
    'contactForm.attachmentTypeError':
      'This file type isn’t accepted. Please choose a PDF, Word, Pages, JPG, PNG or WebP file.',
    'contactForm.attachmentSizeError':
      'This file is too large. Please choose a file of {max} MB or less.',
    'contactForm.expand': 'Open the form in a larger view',
    'contactForm.collapse': 'Close the larger view',
    'contactForm.submit': 'Send message',
    'contactForm.sending': 'Sending…',
    'contactForm.privacyNote': 'Your message is handled as described in the {link}.',
    'contactForm.privacyLink': 'privacy notice',
    'contactForm.successMessage':
      'Thanks, your message is on its way. I’ll reply within two business days.',
    'contactForm.errorMessage': 'Something went wrong. Please try again, or email me directly.',

    // --- Contact form: success page (no-JS submissions land here) ---
    'contactSent.title': 'Message sent — Thomas Miller',
    'contactSent.description': 'Your message has been sent.',
    'contactSent.heading': 'Message sent',
    'contactSent.home': 'Back to the home page',

    // --- Privacy & legal notice ---
    // {email} and {fdpic} are replaced with links by the page.
    'privacyPage.title': 'Privacy & legal notice — Thomas Miller',
    'privacyPage.description':
      'Who runs thomasmiller.ch, what personal data the site handles and why: the contact form, hosting by Netlify and cookie-free visitor counts with GoatCounter.',
    'privacyPage.heading': 'Privacy & legal notice',
    'privacyPage.updated': 'Last updated: November 2026',
    'privacyPage.intro':
      'Who is behind this site, what data it handles and why. In short: no cookies, no tracking of individuals, and your messages are only used to reply to you.',
    'privacyPage.who.heading': 'Who is responsible',
    'privacyPage.who.text': 'This site presents my work as an independent web developer.',
    'privacyPage.who.location': 'Bulle, Switzerland',
    'privacyPage.who.controller':
      'I am the person responsible for the personal data described on this page.',
    'privacyPage.form.heading': 'The contact form',
    'privacyPage.form.text1':
      'When you write to me through the contact form, I receive your name, your email address, your message, the file you attach if you add one, and the language of the page you sent it from. I use them only to reply to your request and, if we work together, to follow it up.',
    'privacyPage.form.text2':
      'The form is handled by Netlify, Inc. (USA), which hosts this site: Netlify stores your message and forwards it to me by email. Netlify checks submissions for spam with Akismet, a service of Automattic (USA).',
    'privacyPage.form.text3':
      'I delete messages once they are no longer needed for our exchange, and you can ask me to delete yours sooner at any time. The same applies if you write to me directly by email.',
    'privacyPage.hosting.heading': 'Hosting',
    'privacyPage.hosting.text':
      'This site is hosted by Netlify, Inc., in the United States. Like any host, Netlify processes the technical data needed to deliver the pages, such as your IP address, your browser and the page requested, and may keep it in its server logs. Your data may therefore be processed outside Switzerland, in particular in the United States. Netlify is certified under the Swiss-U.S. Data Privacy Framework.',
    'privacyPage.stats.heading': 'Visitor statistics',
    'privacyPage.stats.text1':
      'To know how many people visit the site, I use GoatCounter, a privacy-friendly statistics service. It counts page views without cookies and stores nothing on your device.',
    'privacyPage.stats.text2':
      'GoatCounter does not store IP addresses. To tell a new visit from a reload, it keeps your IP address and browser details in memory for at most eight hours, without writing them to disk. It only records totals: pages viewed, the site you came from, browser, operating system, screen size, language and country. No profile is built and you are not followed from one site to another.',
    'privacyPage.stats.text3':
      'GoatCounter is run from Ireland and stores its data on servers in Finland and Germany.',
    'privacyPage.cookies.heading': 'Cookies and other services',
    'privacyPage.cookies.text1':
      'This site uses no cookies and stores nothing in your browser. That is why there is no cookie banner.',
    'privacyPage.cookies.text2':
      'The fonts are served by this site itself, so loading a page sends no request to Google or any other font service. Links to other sites, such as GitHub, LinkedIn, WhatsApp or the projects shown, take you to services whose own privacy policies apply once you follow them.',
    'privacyPage.rights.heading': 'Your rights',
    'privacyPage.rights.text1':
      'You can ask me at any time what data I hold about you, and have it corrected or deleted. Just write to me at {email}.',
    'privacyPage.rights.text2':
      'If you think your data is being mishandled, you can contact the Federal Data Protection and Information Commissioner ({fdpic}).',
    'privacyPage.rights.fdpic': 'FDPIC',
    'privacyPage.rights.law':
      'This site is subject to Swiss law, in particular the Federal Act on Data Protection (FADP).',
  },
  fr: {
    'nav.work': 'Projets',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.home': 'Accueil',
    'brand.tagline': 'Développeur web · Bulle',
    'nav.primary': 'Navigation principale',
    'nav.menuOpen': 'Ouvrir le menu',
    'nav.menuClose': 'Fermer le menu',
    'nav.skipToContent': 'Aller au contenu',
    'lang.switcher': 'Langue',
    'lang.switcherFooter': 'Langue (pied de page)',
    'footer.tagline': 'Me joindre directement',
    'footer.email': 'E-mail',
    'footer.phone': 'Téléphone',
    'footer.github': 'GitHub',
    'footer.linkedin': 'LinkedIn',
    'footer.whatsapp': 'WhatsApp',
    'footer.privacy': 'Confidentialité et mentions légales',

    // --- Homepage: page meta ---
    'home.title': 'Thomas Miller — Développeur web à Bulle, Suisse romande',
    'home.description':
      'Sites web et applications pour les petites entreprises et les indépendants de Suisse romande, créés et suivis par Thomas Miller, développeur web à Bulle.',

    // --- Homepage: hero ---
    'hero.name': 'Thomas Miller',
    'hero.tagline':
      "Je crée et je maintiens des sites web et des applications pour les petites entreprises et les indépendants de Suisse romande. Je suis aussi développeur à l'agence Marvelous Digital.",
    'hero.cta': 'Parlons de votre projet',
    'hero.ctaSecondary': 'Voir les projets',
    'hero.availability': 'Disponible pour des projets',
    'hero.based': 'Bulle, Suisse romande · FR / EN',
    'hero.wallPause': 'Pause',
    'hero.wallPlay': 'Lecture',

    // --- Homepage: services ---
    'services.heading': 'Ce que je peux faire pour vous',
    'services.intro': 'Du petit site vitrine à l’application sur mesure.',
    'capabilities.heading': 'Et aussi',

    // --- Homepage: selected work ---
    'work.heading': 'Derniers projets',
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
    'project.tagMultilingual': 'Multilingue',
    'project.screenshotAlt': 'Page d’accueil de {name}',

    // --- Work page: page meta ---
    'workPage.title': 'Projets — Thomas Miller',
    'workPage.description':
      'Sites et applications web pour des entreprises et institutions suisses : projets freelance, collaborations avec le studio macmac et projets chez Marvelous Digital.',

    // --- Work page: intro ---
    'workPage.heading': 'Projets',
    'workPage.intro':
      'J’ai travaillé sur des centaines de sites depuis 2014. Voici les plus récents, et quelques autres représentatifs. Chaque projet indique son contexte : en freelance, avec le studio macmac, ou avec l’équipe de Marvelous Digital.',
    'workPage.filterLabel': 'Filtrer les projets',
    'workPage.filterAll': 'Tous',
    'workPage.listHeading': 'Projets',
    'workPage.filterStatus': '{n} projets affichés',
    'work.teaser.frame': 'Votre site ici',
    'work.teaser.kind': 'Prochain projet',
    'work.teaser.title': 'Votre projet ?',
    'work.teaser.body':
      'Cette place est libre. Dites-moi ce dont vous avez besoin, et ce pourrait être le prochain projet de cette page.',

    // --- About page: page meta ---
    'aboutPage.title': 'À propos — Thomas Miller',
    'aboutPage.description':
      'Développeur web depuis 2014. Chez Marvelous Digital à Vevey, avec des projets freelance en parallèle : en direct pour des clients, et pour le studio macmac.',

    // --- About page: intro & bio ---
    'aboutPage.heading': 'Un seul interlocuteur, de l’idée à la mise en ligne',
    'aboutPage.bioIntro':
      'Je m’appelle Thomas Miller, développeur web. Je développe pour le web depuis 2014, du site vitrine à l’application sur mesure. Je travaille chez Marvelous Digital, une agence à Vevey, et je mène des projets freelance en parallèle.',
    'aboutPage.bioParagraph1':
      'Chez Marvelous, je travaille en équipe sur des sites pour des institutions et des marques suisses, ainsi que sur des projets pour de grands clients internationaux.',
    'aboutPage.bioParagraph2':
      'À côté, je développe en direct pour des particuliers, des PME et des institutions publiques, et je réalise des sites pour macmac, un studio de branding et d’architecture d’intérieur à Marly.',
    'aboutPage.bioParagraph3':
      'L’IA a changé ma façon de travailler. Je peux prendre en charge davantage de choses moi-même et livrer plus vite\u00a0: un projet freelance coûte donc moins cher qu’avant. C’est pourquoi je consacre peu à peu plus de temps au freelance.',
    'aboutPage.portraitAlt': 'Portrait de Thomas Miller',
    'aboutPage.waysHeading': 'Avec qui je travaille',
    'aboutPage.way1.name': 'Marvelous Digital',
    'aboutPage.way1.meta': 'Employeur · Vevey',
    'aboutPage.way1.text':
      'Une agence web qui développe des solutions digitales sur mesure. J’y travaille avec une équipe très douée, qui réunit chefs de projet, designers et développeurs. Pour un projet plus important, je peux vous mettre en relation avec elle.',
    'aboutPage.way2.name': 'macmac',
    'aboutPage.way2.meta': 'Studio partenaire · Marly',
    'aboutPage.way2.text':
      'J’y ai travaillé quatre ans, jusqu’en 2019, et nous sommes restés en très bons termes : je développe encore certains de leurs nouveaux projets et je maintiens les anciens. Hôtels, restaurants, architectes et fondations, souvent dans la région de Morat ou de Fribourg.',
    'aboutPage.way3.name': 'Freelance',
    'aboutPage.way3.meta': 'En direct avec vous',
    'aboutPage.way3.text':
      'Vous échangez avec moi, la personne qui écrit le code, du premier échange à la mise en ligne et au suivi.',

    // --- Homepage: approach ---
    'approach.heading': 'La rigueur d’une agence, un seul interlocuteur',
    'approach.point1.title': 'Développeur web depuis 2014',
    'approach.point1.text':
      'Sites vitrines, boutiques en ligne, applications sur mesure. Je soigne chaque détail : la mise en page, les animations, le confort sur mobile, la vitesse d’affichage.',
    'approach.point2.title': 'L’IA a changé la donne',
    'approach.point2.text':
      'J’utilise tous les jours des outils d’IA comme Claude Code. Ils me permettent de travailler plus vite et mieux qu’avant, pour un budget souvent bien inférieur à celui d’une agence.',
    'approach.point3.title': 'Je réponds du résultat',
    'approach.point3.text':
      'Vous parlez directement à la personne qui construit votre site, en français ou en anglais. Je prends l’entière responsabilité de livrer un travail de qualité.',

    // --- Homepage: how it works ---
    'how.heading': 'Comment ça se passe',
    'how.intro': 'Chaque projet est différent, alors je m’adapte à vos besoins.',
    'how.step1.title': 'Vous m’expliquez votre besoin',
    'how.step1.text':
      'Un e-mail ou un appel suffit, sans termes techniques. Ce premier échange est gratuit.',
    'how.step2.title': 'Je vous propose une solution',
    'how.step2.text':
      'Je vous dis ce que je vous conseille, ce que cela coûterait et quand je pourrais m’y mettre.',
    'how.step3.title': 'On signe, puis je réalise',
    'how.step3.text': 'La facturation ne commence qu’une fois le projet signé et démarré.',
    'how.step4.title': 'Je reste là après la mise en ligne',
    'how.step4.text':
      'Si besoin, je m’occupe de la maintenance, des modifications, des mises à jour ou des évolutions futures.',
    'how.faqHeading': 'Questions fréquentes',
    'how.faq1.q': 'Combien ça coûte ?',
    'how.faq1.a':
      'Cela dépend de vos besoins, et je m’adapte à votre projet. Jusqu’ici, mes projets sont allés d’environ CHF 1’000 pour les plus petits à environ CHF 30’000 pour les plus gros. Avec l’IA, un site se met en ligne plus vite qu’il y a un an, et coûte donc moins cher.',
    'how.faq2.q': 'Quand pouvez-vous commencer ?',
    'how.faq2.a':
      'Cela dépend du projet. Je travaille aussi dans une agence : si votre délai est serré, prévenez-moi tôt pour que je puisse m’organiser. Je vous donne une estimation quand on en parle.',
    'how.faq3.q': 'Puis-je modifier le site moi-même ?',
    'how.faq3.a':
      'Oui. La plupart de mes projets utilisent un CMS, un outil qui vous permet de gérer vos contenus vous-même. Si vous préférez, je fais les modifications pour vous.',
    'how.faq4.q': 'Et si je n’y connais pas grand-chose ?',
    'how.faq4.a':
      'Ce n’est pas un problème, c’est mon travail. Je vous explique les choix sans jargon et je vous fais des recommandations. Je peux gérer le nom de domaine et l’hébergement pour vous, ou vous aider à les gérer vous-même. Et si vous le souhaitez, on met en place un contrat de maintenance pour la suite.',
    'how.faq5.q': 'Et si je n’ai pas encore de design ?',
    'how.faq5.a':
      'Si vous en avez besoin, je fais appel à des collègues et à des contacts qui peuvent aider. Je peux aussi générer plusieurs variantes de design avec l’IA et vous laisser choisir celle qui vous plaît le plus.',
    'how.faq6.q': 'Qu’est-ce que je dois préparer ?',
    'how.faq6.a':
      'Pas grand-chose. Une idée de ce que le site doit faire, deux ou trois sites que vous aimez et, si possible, un budget et une échéance en tête. Le reste, on le voit ensemble.',
    'how.faq7.q': 'Et si mon projet est trop grand pour une seule personne ?',
    'how.faq7.a':
      'Dans ce cas, je peux le faire passer par Marvelous Digital, l’agence où je travaille. Vous y gagnez une équipe complète : gestion de projet, designers, équipe de QA, planification, maintenance, etc. On voit ensemble quelle formule convient quand on en parle.',
    'how.faq8.q': 'Et si j’ai déjà un designer ou des développeurs ?',
    'how.faq8.a':
      'Aucun problème. Je peux partir de vos maquettes existantes, travailler avec vos designers ou renforcer votre équipe de développement sur un projet. Je m’adapte à vos outils et à votre façon de travailler.',

    // --- Homepage: closing CTA ---
    'cta.heading': 'Parlons de votre projet',
    'cta.body': 'Dites-moi ce dont vous avez besoin. Je réponds sous deux jours ouvrés.',
    'cta.button': 'Me contacter',

    // --- Contact page: page meta ---
    'contactPage.title': 'Contact — Thomas Miller',
    'contactPage.description':
      'Contactez-moi pour votre prochain projet web. Envoyez un message, appelez-moi ou écrivez-moi par e-mail, WhatsApp ou LinkedIn.',

    // --- 404 ---
    'notFound.title': 'Page introuvable — Thomas Miller',
    'notFound.description': 'Cette page n’existe pas ou a été déplacée.',
    'notFound.line1': 'Erreur 404',
    'notFound.line2': 'Page introuvable',
    'notFound.home': 'Sortez-moi d’ici',

    // --- Contact page: intro & fallback ---
    'contactPage.heading': 'Parlons de votre projet',
    'contactPage.intro':
      'Dites-moi en quelques mots ce dont vous avez besoin. Je lis chaque message et je réponds sous deux jours ouvrés.',
    'contactPage.fallbackHeading': 'Vous préférez me contacter directement ?',
    'contactPage.fallbackIntro': 'E-mail, téléphone, WhatsApp ou LinkedIn, comme vous préférez.',

    // --- Contact page: form ---
    'contactForm.nameLabel': 'Nom',
    'contactForm.namePlaceholder': 'Votre nom',
    'contactForm.emailLabel': 'E-mail',
    'contactForm.emailPlaceholder': 'vous@exemple.com',
    'contactForm.messageLabel': 'Message',
    'contactForm.messagePlaceholder': 'Parlez-moi de votre projet…',
    'contactForm.honeypotLabel': 'Laissez ce champ vide',
    'contactForm.attachmentToggle': 'Ajouter une pièce jointe ?',
    'contactForm.attachmentLabel': 'Pièce jointe (facultative)',
    'contactForm.attachmentRemove': 'Retirer',
    'contactForm.attachmentRemoveLabel': 'Retirer le fichier joint',
    'contactForm.attachmentTypeError':
      'Ce type de fichier n’est pas accepté. Choisissez un fichier PDF, Word, Pages, JPG, PNG ou WebP.',
    'contactForm.attachmentSizeError':
      'Ce fichier est trop lourd. Choisissez un fichier de {max} Mo au maximum.',
    'contactForm.expand': 'Ouvrir le formulaire en grand',
    'contactForm.collapse': 'Fermer la vue agrandie',
    'contactForm.submit': 'Envoyer le message',
    'contactForm.sending': 'Envoi en cours…',
    'contactForm.privacyNote': 'Votre message est traité comme indiqué dans la {link}.',
    'contactForm.privacyLink': 'déclaration de protection des données',
    'contactForm.successMessage':
      'Merci, votre message est en route. Je réponds sous deux jours ouvrés.',
    'contactForm.errorMessage': 'Une erreur s’est produite. Réessayez, ou écrivez-moi directement.',

    // --- Contact form: success page (no-JS submissions land here) ---
    'contactSent.title': 'Message envoyé — Thomas Miller',
    'contactSent.description': 'Votre message a bien été envoyé.',
    'contactSent.heading': 'Message envoyé',
    'contactSent.home': 'Retour à l’accueil',

    // --- Confidentialité et mentions légales ---
    // {email} et {fdpic} sont remplacés par des liens dans la page.
    'privacyPage.title': 'Confidentialité et mentions légales — Thomas Miller',
    'privacyPage.description':
      'Qui exploite thomasmiller.ch, quelles données personnelles le site traite et pourquoi : formulaire de contact, hébergement chez Netlify et statistiques sans cookies avec GoatCounter.',
    'privacyPage.heading': 'Confidentialité et mentions légales',
    'privacyPage.updated': 'Dernière mise à jour : novembre 2026',
    'privacyPage.intro':
      'Qui se trouve derrière ce site, quelles données il traite et pourquoi. En bref : pas de cookies, aucun suivi individuel, et vos messages servent uniquement à vous répondre.',
    'privacyPage.who.heading': 'Responsable du site',
    'privacyPage.who.text': 'Ce site présente mon travail de développeur web indépendant.',
    'privacyPage.who.location': 'Bulle, Suisse',
    'privacyPage.who.controller':
      'Je suis le responsable du traitement des données personnelles décrites sur cette page.',
    'privacyPage.form.heading': 'Formulaire de contact',
    'privacyPage.form.text1':
      'Lorsque vous m’écrivez au moyen du formulaire de contact, je reçois votre nom, votre adresse e-mail, votre message, le fichier joint si vous en ajoutez un, ainsi que la langue de la page depuis laquelle vous l’avez envoyé. Ces données me servent uniquement à répondre à votre demande et, si nous travaillons ensemble, à en assurer le suivi.',
    'privacyPage.form.text2':
      'Le formulaire est géré par Netlify, Inc. (États-Unis), qui héberge ce site : Netlify enregistre votre message et me le transmet par e-mail. Les envois passent par Akismet, le filtre anti-spam d’Automattic (États-Unis).',
    'privacyPage.form.text3':
      'Je supprime les messages dès qu’ils ne sont plus utiles à notre échange, et vous pouvez me demander à tout moment de supprimer le vôtre plus tôt. Il en va de même si vous m’écrivez directement par e-mail.',
    'privacyPage.hosting.heading': 'Hébergement',
    'privacyPage.hosting.text':
      'Ce site est hébergé par Netlify, Inc., aux États-Unis. Comme tout hébergeur, Netlify traite les données techniques nécessaires à l’affichage des pages, par exemple votre adresse IP, votre navigateur et la page demandée, et peut les conserver dans ses journaux de serveur. Vos données peuvent donc être traitées hors de Suisse, notamment aux États-Unis. Netlify est certifié selon le Swiss-U.S. Data Privacy Framework.',
    'privacyPage.stats.heading': 'Statistiques de visite',
    'privacyPage.stats.text1':
      'Pour savoir combien de personnes visitent le site, j’utilise GoatCounter, un service de statistiques respectueux de la vie privée. Il compte les pages vues sans cookies et n’enregistre rien sur votre appareil.',
    'privacyPage.stats.text2':
      'GoatCounter ne conserve pas les adresses IP. Pour distinguer une nouvelle visite d’un simple rechargement, il garde votre adresse IP et les informations de votre navigateur en mémoire pendant huit heures au plus, sans les écrire sur disque. Il n’enregistre que des totaux : pages vues, site de provenance, navigateur, système d’exploitation, taille d’écran, langue et pays. Aucun profil n’est établi et vous n’êtes pas suivi d’un site à l’autre.',
    'privacyPage.stats.text3':
      'GoatCounter est exploité depuis l’Irlande et stocke ses données sur des serveurs situés en Finlande et en Allemagne.',
    'privacyPage.cookies.heading': 'Cookies et services tiers',
    'privacyPage.cookies.text1':
      'Ce site n’utilise aucun cookie et n’enregistre rien dans votre navigateur. C’est pourquoi il n’affiche pas de bannière de cookies.',
    'privacyPage.cookies.text2':
      'Les polices de caractères sont servies par ce site lui-même : l’affichage d’une page n’envoie aucune requête à Google ni à un autre service de polices. Les liens vers d’autres sites, comme GitHub, LinkedIn, WhatsApp ou les projets présentés, mènent à des services dont les propres politiques de confidentialité s’appliquent dès que vous les suivez.',
    'privacyPage.rights.heading': 'Vos droits',
    'privacyPage.rights.text1':
      'Vous pouvez à tout moment me demander quelles données je détiens à votre sujet, et les faire rectifier ou supprimer. Il suffit de m’écrire à {email}.',
    'privacyPage.rights.text2':
      'Si vous estimez que vos données sont mal traitées, vous pouvez vous adresser au Préposé fédéral à la protection des données et à la transparence ({fdpic}).',
    'privacyPage.rights.fdpic': 'PFPDT',
    'privacyPage.rights.law':
      'Ce site est soumis au droit suisse, en particulier à la loi fédérale sur la protection des données (LPD).',
  },
};
