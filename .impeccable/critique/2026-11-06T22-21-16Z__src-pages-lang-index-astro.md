---
target: portfolio site from a Romand small-business owner perspective
total_score: 20
max_score: 36
na_heuristics: 7
p0_count: 1
p1_count: 3
target_identity: "file:/Users/thomas/web/perso/side-projects/portfolio-2026/src/pages/[lang]/index.astro"
target_fingerprint: "sha256:153c036dbe9a6ce74051993650abdd158b30fd7f97d12b336bc5b97e994c5d2a"
target_path: /Users/thomas/web/perso/side-projects/portfolio-2026/src/pages/[lang]/index.astro
timestamp: 2026-11-06T22-21-16Z
slug: src-pages-lang-index-astro
---
Method: dual-agent (A: client-perspective review · B: detector and browser evidence)

# Critique: small-business owner in Romandie looking for a web developer

Overall: impressed, but would not write yet. The site proves capability but does not answer pre-contact questions, and much of it speaks to developers. The gap is words and proof, not more effects.

## Unanswered questions
Price range; availability given the day job; continuity if unavailable; after launch; ownership (domain, hosting, yearly cost, self-editing); who does design/text/photos (8 projects "avec macmac"); process (free first talk, quote, meeting); testimonials/results; legal identity (no impressum, address, phone, privacy notice; legal requirements not verified).

## Working
Honest provenance labels; real Swiss clients; portrait on About and "deux jours ouvrés".

## Priority issues
- [P0] Pre-contact questions unanswered. Fix: plain-French "Comment ça se passe" with 3-4 steps and FAQ using real facts. /impeccable shape
- [P1] Hero and services lead with name, employer and tools; Bulle only in footer; calqued French ("Ce que je construis", "Soyez trouvé, chargez vite", "Construisons quelque chose qui compte"). Fix: "Des sites web pour les PME et commerces de Romandie. Basé à Bulle.", employer second, services by outcome, move "La rigueur d'une agence, un seul interlocuteur" near hero. /impeccable clarify
- [P1] Work shown first is a nightclub, a game and an unlaunched site; butcher is card 16 of 17; filters by provenance only. Fix: feature Gruyère Padel, Bains de Lavey, Käserei Murten; sector filters; one owner-focused line per card; de-emphasise tool lists, surface languages. /impeccable layout
- [P1] Contact not reassuring: blank box, no phone, GitHub as channel, fallback before form on phone. Fix: form first on phone, phone or callback, regional meeting, drop GitHub, "Premier échange gratuit et sans engagement" if true, guided message prompt, no scramble on the contact lead. /impeccable clarify
- [P2] Glyph field reads cold; pixel reveal with "PASS 1/4" reads as a bug on proof images. Fix: keep dark and deck, calm hero field, different image reveal, face and Bulle on homepage, impressum and privacy page. /impeccable quieter, /impeccable harden

Impress with results: real load times behind "Mesuré, jamais supposé", real before/after.

## Challengeable claims
"Boutiques": no store among 17 projects. "Intégration IA": no project shows it. "La plupart… deux à quatre langues": 8 of 17 documented. "Freelance 5": 3 live client sites. Adler opens /de and Info Retour /en/ from French.

## Design health: 20/36 (56%, Acceptable), heuristic 7 n/a
1 Status 3; 2 Real-world match 1; 3 Control 3; 4 Consistency 3; 5 Error prevention 2; 6 Recognition 3; 7 n/a; 8 Minimalism 2; 9 Error recovery 3 (source, not triggered); 10 Help 0.

Specificity: authored parts (Moléson logo, real screenshots, badge portrait), standard developer-portfolio skeleton.

Detector: 14 advisory CLI findings, mostly off-scale values in effect CSS; 4 of 5 colour hits are CSS masks (false positives). Overlays 5-30 flagged elements per page, including false positives (project-link contrast) and dev-only FX panel items. Measured on /fr/ and /fr/contact/: no tel link, impressum, privacy link, address or JSON-LD.

## Persona red flags
First-timer: jargon; "Démarrer un projet" feels like commitment. Phone: no tap-to-call, /fr/work/ about 11,900px, footer language links 18x17px, lanyard strap crosses About heading. Romand owner: proximity, meeting, breakage during work hours unknown; many sites shown in German or English.

## Minor
Real availability date; orphan colon at src/i18n/ui.ts:225; "Site de club" ambiguous; untapped Bulle cluster.

## Questions
Butcher in Bulle or developer on LinkedIn? Show prices and lose some low-budget leads, or keep losing the shy? What can be said publicly about the week you are unavailable?

## Limits
Working tree on dev server, no production performance test; phone view via 375px frames, hamburger not opened; form not submitted, known missing key set aside.
