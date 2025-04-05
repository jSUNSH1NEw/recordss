"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "fr" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  fr: {
    // Navigation
    "nav.whitelist": "Whitelist",
    "nav.privacy": "Confidentialité",
    "nav.offers": "Offres",
    "nav.start": "Commencer",
    "nav.test": "Essayer",

    // Footer
    "footer.copyright": "L'assistant intelligent pour vos configurations DNS",
    "footer.offers": "Nos offres",
    "footer.privacy": "Politique de confidentialité",
    "footer.whitelist": "Whitelist",
    "footer.contact": "Contactez-nous",

    // Home page
    "home.hero.title": "RECORDSS.AI",
    "home.hero.subtitle": "L'orchestrateur de DNS automatisé pour vos applications & services.",
    "home.hero.feature1": "Comparez les prix DNS entre registrars",
    "home.hero.feature2": "Achat, configuration et enregistrement",
    "home.hero.feature3": "Renouvellement automatique et vérification de sécurité",
    "home.hero.cta": "S'inscrire",
    "home.tables.vulnerabilities": "Configurations vulnérables",
    "home.tables.incidents": "Incidents Majeurs",
    "home.tables.company": "Entreprise",
    "home.tables.problems": "Problèmes",
    "home.tables.risk": "Risque",
    "home.tables.incident": "Incident",
    "home.tables.date": "Date",
    "home.tables.impact": "Impact",
    "home.tables.high": "Élevé",
    "home.tables.critical": "Critique",
    "home.usecases.title": "Cas d'utilisation",
    "home.usecases.subtitle": "RECORDSS.AI s'adapte à différents besoins et utilisateurs.",
    "home.usecases.individuals.title": "Particuliers",
    "home.usecases.individuals.desc":
      "Configuration DNS simplifiée pour vos sites personnels sans connaissances techniques.",
    "home.usecases.companies.title": "Entreprises",
    "home.usecases.companies.desc": "Gestion centralisée de multiples domaines avec orchestration DNS automatisée.",
    "home.usecases.web3devs.title": "Développeurs Web3",
    "home.usecases.web3devs.desc": "Intégration transparente entre domaines blockchain et applications décentralisées.",
    "home.usecases.agencies.title": "Agences web",
    "home.usecases.agencies.desc": "API complète pour gérer les configurations DNS de tous vos clients.",
    "home.usecases.learnmore": "En savoir plus",
    "home.features.title": "Fonctionnalités clés",
    "home.features.subtitle": "Des outils puissants pour gérer vos domaines et configurations DNS.",
    "home.features.verification.title": "Vérification et connexion des enregistrements",
    "home.features.verification.desc":
      "Notre agent vérifie et connecte automatiquement vos enregistrements DNS pour assurer une liaison parfaite entre vos domaines et vos applications, qu'ils soient Web2 ou Web3.",
    "home.features.verification.feature1": "Détection automatique des configurations requises",
    "home.features.verification.feature2": "Connexion transparente entre domaines et applications",
    "home.features.verification.feature3": "Validation en temps réel de la propagation DNS",
    "home.features.dns.title": "Gestion DNS automatisée",
    "home.features.dns.desc":
      "Configuration automatique des enregistrements DNS pour tous les registrars populaires, éliminant les erreurs manuelles.",
    "home.features.integration.title": "Intégration Web2/Web3",
    "home.features.integration.desc":
      "Connectez facilement vos domaines traditionnels et blockchain à vos applications et dApps sans connaissances techniques.",
    "home.features.api.title": "API pour développeurs",
    "home.features.api.desc":
      "Intégrez nos fonctionnalités dans vos propres applications avec notre API complète et notre documentation détaillée.",
    "home.features.discover": "Découvrir",
    "home.test.title": "Testez Maintenant – Simple & Efficace",
    "home.test.subtitle": "Achat, Configuration & Enregistrement Automatique en quelques Clics.",
    "home.test.domain": "Nom de domaine",
    "home.test.domain.placeholder": "exemple.com ou exemple.eth",
    "home.test.domain.help": "Entrez votre nom de domaine Web2 ou Web3",
    "home.test.type": "Type de domaine",
    "home.test.type.placeholder": "Sélectionnez un type de domaine",
    "home.test.type.web2": "Domaine traditionnel (Web2)",
    "home.test.type.ens": "ENS (Ethereum Name Service)",
    "home.test.type.unstoppable": "Unstoppable Domains",
    "home.test.type.other": "Autre blockchain",
    "home.test.registrar": "Registrar (pour Web2)",
    "home.test.registrar.placeholder": "Sélectionnez un registrar",
    "home.test.security": "Inclure un test de sécurité complet",
    "home.test.analyze": "Analyser mon domaine",
    // Ajouter la traduction pour le texte des réseaux sociaux
    "home.hero.social": "Rejoignez-nous sur les réseaux sociaux",

    // Nouveaux éléments pour les formulaires à onglets
    "home.tabs.availability": "Disponibilité du domaine",
    "home.tabs.connect": "Connecter un domaine",
    "home.tabs.security": "Sécurité email",
    "home.tabs.availability.domain": "Nom de domaine",
    "home.tabs.availability.placeholder": "exemple.com ou exemple.eth",
    "home.tabs.availability.help": "Entrez votre nom de domaine pour vérifier sa disponibilité",
    "home.tabs.availability.check": "Vérifier la disponibilité",
    "home.tabs.connect.type": "Type de domaine",
    "home.tabs.connect.web2": "Domaine Web2",
    "home.tabs.connect.web3": "Domaine Web3",
    "home.tabs.connect.domain": "Nom de domaine",
    "home.tabs.connect.placeholder": "exemple.com",
    "home.tabs.connect.canister": "ID du Canister ICP",
    "home.tabs.connect.canister.placeholder": "Entrez l'ID de votre canister ICP",
    "home.tabs.connect.canister.help": "Entrez l'ID du canister ICP de votre domaine Web3",
    "home.tabs.connect.web3.domain.help": "Entrez le nom de votre domaine Web3",
    "home.tabs.connect.button": "Connecter le domaine",
    "home.tabs.connect.web3.button": "Connecter le domaine Web3",
    "home.tabs.security.domain": "Nom de domaine",
    "home.tabs.security.placeholder": "exemple.com",
    "home.tabs.security.help": "Entrez votre nom de domaine pour vérifier et configurer la sécurité email",
    "home.tabs.security.check": "Vérifier la sécurité email",

    // Offers page
    "offers.title": "Nos offres",
    "offers.subtitle": "Des solutions adaptées à tous les besoins.",
    "offers.security.title": "Sécurité DNS renforcée",
    "offers.security.desc":
      "Notre agent vérifie la sécurité de vos configurations DNS pour protéger votre domaine contre les menaces courantes.",
    "offers.security.feature1": "Protection DNSSEC",
    "offers.security.feature1.desc": "Contre le DNS spoofing",
    "offers.security.feature2": "Sécurité email",
    "offers.security.feature2.desc": "SPF, DKIM et DMARC",
    "offers.security.feature3": "Audit Web3",
    "offers.security.feature3.desc": "Sécurité des domaines blockchain",
    "offers.security.feature4": "Surveillance continue",
    "offers.security.feature4.desc": "Alertes en temps réel",
    "offers.free.title": "Gratuit",
    "offers.free.price": "0€",
    "offers.free.subtitle": "3 requêtes",
    "offers.free.feature1": "1 domaine inclus",
    "offers.free.feature2": "Accès API limité",
    "offers.free.feature3": "Support communautaire",
    "offers.free.feature4": "Gestion DNS de base",
    "offers.free.cta": "Commencer gratuitement",
    "offers.pro.title": "Essential",
    "offers.pro.price": "19€",
    "offers.pro.period": "/mois",
    "offers.pro.subtitle": "Pour les freelancers",
    "offers.pro.feature1": "Agent IA de gestion DNS automatisée",
    "offers.pro.feature2": "10 domaines inclus",
    "offers.pro.feature3": "Tableau de bord personnalisé",
    "offers.pro.feature4": "Protection avancée",
    "offers.pro.feature5": "Accès API limité",
    "offers.pro.feature6": "Support par email & cal.com",
    "offers.pro.cta": "S'abonner",
    "offers.pro.popular": "Pour freelancers",
    "offers.enterprise.title": "PRO",
    "offers.enterprise.price": "Sur mesure",
    "offers.enterprise.subtitle": "Pour les entreprises",
    "offers.enterprise.feature1": "Agent IA de gestion DNS personnalisé",
    "offers.enterprise.feature2": "Domaines illimités",
    "offers.enterprise.feature3": "Intégrations assistées",
    "offers.enterprise.feature4": "Accès API illimité",
    "offers.enterprise.feature5": "Support dédié 24/7",
    "offers.enterprise.feature6": "Solution sur mesure",
    "offers.enterprise.cta": "Nous contacter",
    "offers.community.title": "Funds Community",
    "offers.community.price": "100€ ICP",
    "offers.community.subtitle": "Offre limitée à 1000 NFTs",
    "offers.community.feature1": "Agent IA de gestion DNS personnalisé",
    "offers.community.feature2": "20 domaines inclus",
    "offers.community.feature3": "Avantages exclusifs",
    "offers.community.feature4": "Support dédié 24/7",
    "offers.community.cta": "Investir",
    "offers.comparison.title": "Comparaison des fonctionnalités",
    "offers.comparison.feature": "Fonctionnalité",
    "offers.comparison.domains": "Nombre de domaines",
    "offers.comparison.web2": "Support Web2",
    "offers.comparison.web3": "Support Web3",
    "offers.comparison.security": "Tests de sécurité",
    "offers.comparison.security.basic": "Basiques",
    "offers.comparison.security.complete": "Complets",
    "offers.comparison.security.advanced": "Avancés",
    "offers.comparison.api": "Accès API",
    "offers.comparison.api.no": "Non",
    "offers.comparison.api.limited": "Limité",
    "offers.comparison.api.full": "Complet",
    "offers.comparison.support": "Support",
    "offers.comparison.support.community": "Communautaire",
    "offers.comparison.support.email": "Email",
    "offers.comparison.support.dedicated": "Dédié 24/7",
    "offers.comparison.integrations": "Intégrations personnalisées",
    "offers.comparison.integrations.yes": "Oui",
    "offers.comparison.integrations.no": "Non",
    "offers.contact.text": "Besoin d'une solution sur mesure pour votre entreprise ?",
    "offers.contact.cta": "Contactez notre équipe commerciale",
    "offers.free.feature1.desc": "Gérez un domaine avec notre plateforme",
    "offers.free.feature2.desc": "3 requêtes pour tester notre API",
    "offers.free.feature3.desc": "Accès à notre forum d'aide",
    "offers.pro.feature1.desc": "Automatisez votre gestion DNS",
    "offers.pro.feature2.desc": "Gérez jusqu'à 10 domaines différents",
    "offers.pro.feature3.desc": "Interface adaptée à vos besoins",
    "offers.pro.feature4.desc": "Sécurité contre la perte de données",
    "offers.enterprise.feature1.desc": "Solution sur mesure pour votre entreprise",
    "offers.enterprise.feature2.desc": "Aucune restriction sur le nombre de domaines",
    "offers.enterprise.feature3.desc": "Support pour toutes vos intégrations",
    "offers.enterprise.feature4.desc": "Aucune restriction sur les appels API",
    "offers.community.subtitle.badge": "Investissement Public",
    "offers.community.price.period": "/ token ICP",
    "offers.community.feature1.desc": "Solution sur mesure pour vos besoins",
    "offers.community.feature2.desc": "Gérez jusqu'à 20 domaines différents",
    "offers.community.feature3.desc": "Accès aux fonctionnalités exclusives",
    "offers.community.feature4.desc": "Assistance prioritaire à tout moment",

    // Whitelist page
    "whitelist.title": "Whitelist",
    "whitelist.subtitle": "Liste des services et plateformes compatibles avec RECORDSS.IA",
    "whitelist.join.title": "Rejoindre la whitelist",
    "whitelist.join.desc":
      "Inscrivez-vous pour être parmi les premiers à accéder à notre plateforme et bénéficier d'avantages exclusifs.",
    "whitelist.join.email": "Votre adresse email",
    "whitelist.join.email.placeholder": "vous@exemple.com",
    "whitelist.join.privacy": "Nous ne partagerons jamais votre email avec des tiers.",
    "whitelist.join.cta": "S'inscrire",
    "whitelist.web3.title": "Plateformes Web3 compatibles",
    "whitelist.web3.desc": "Ces plateformes blockchain sont compatibles avec notre service.",
    "whitelist.web2.title": "Registrars Web2 compatibles",
    "whitelist.web2.desc": "Ces registrars sont compatibles avec notre agent d'automatisation DNS.",
    "whitelist.hosting.title": "Plateformes d'hébergement compatibles",
    "whitelist.hosting.desc": "Ces plateformes d'hébergement sont compatibles avec notre service.",
    "whitelist.platform": "Plateforme",
    "whitelist.registrar": "Registrar",
    "whitelist.compatibility": "Compatibilité",
    "whitelist.notes": "Notes",
    "whitelist.compatibility.full": "Complète",
    "whitelist.compatibility.partial": "Partielle",
    "whitelist.compatibility.planned": "Planifiée",
    "whitelist.contact.text": "Vous souhaitez ajouter votre plateforme à notre liste de compatibilité ?",
    "whitelist.contact.cta": "Contactez-nous",

    // Privacy page
    "privacy.title": "Politique de confidentialité",
    "privacy.lastupdate": "Dernière mise à jour : 29 Mars 2025",
    "privacy.intro.title": "Introduction",
    "privacy.intro.content1":
      "Chez RECORDSS.AI, on ne plaisante pas avec la confidentialité et la sécurité de vos données. Vous nous faites confiance, et on s'engage à respecter et protéger vos informations avec les meilleurs standards en matière de cybersécurité.",
    "privacy.intro.content2":
      "Nous utilisons ICP et DFINITY pour garantir un chiffrement avancé et une gestion sécurisée des données. Contrairement à certaines plateformes qui adaptent leurs règles selon la région du monde où vous êtes (coucou Discord 👀, qui divise sa gestion des signalements entre l'UE et le reste du monde), chez nous, c'est 100% transparent et universel. Peu importe votre pays, vous bénéficiez des lois européennes, qui sont les plus exigeantes en matière de protection des données (RGPD & NIS2).",

    "privacy.collect.title": "Les données que nous collectons",
    "privacy.collect.auth.title": "Données d'authentification",
    "privacy.collect.auth.desc":
      "Quand vous créez un compte, on collecte uniquement ce qu'il faut pour garantir votre accès sécurisé :",
    "privacy.collect.auth.email": "Votre adresse e-mail",
    "privacy.collect.auth.id": "Un identifiant unique",
    "privacy.collect.auth.timestamps": "Les horodatages de connexion",
    "privacy.collect.auth.security":
      "Pour la sécurité, on utilise l'authentification DFINITY Identity, qui remplace les méthodes classiques par une approche plus décentralisée et privée.",

    "privacy.collect.dns.title": "Données liées aux enregistrements DNS",
    "privacy.collect.dns.desc": "Puisque RECORDSS.AI est là pour automatiser vos configurations DNS, on a besoin de :",
    "privacy.collect.dns.domains": "Vos noms de domaine",
    "privacy.collect.dns.settings": "Vos paramètres DNS existants",

    "privacy.collect.technical.title": "Données techniques et d'utilisation de nos services gratuitement",
    "privacy.collect.technical.desc":
      "Nous collectons des informations afin d'améliorer notre service et de garantir une expérience fluide pour tous nos utilisateurs, sans surcharge de l'API par des requêtes excessives des utilisateurs gratuits. Cela permet d'éviter de ralentir nos utilisateurs payants.",
    "privacy.collect.technical.ip":
      "Adresse IP et informations de connexion (navigateur, système d'exploitation), ce qui nous permet de gérer l'accès à notre API selon un nombre limité de requêtes (et oui, on pense aux VPN 😉).",
    "privacy.collect.technical.note":
      "Ces données, bien qu'anonymisées, ne sont jamais stockées sur nos serveurs. Elles sont utilisées uniquement via vos cookies et votre navigateur.",

    "privacy.why.title": "Pourquoi on collecte ces données",
    "privacy.why.desc":
      "Comme vous le savez, tout système a des besoins essentiels. Par exemple, nous devons savoir si le contenu est consulté depuis plusieurs endroits et, si c'est le cas, combien de fois. Cela nous permet d'avoir une vue d'ensemble et de développer notre projet avec une vision plus ambitieuse et adaptée au attentes de notre communauté grandissante.",
    "privacy.why.reason1": "Configurer automatiquement vos DNS sans prise de tête",
    "privacy.why.reason2": "Améliorer notre IA privée qui apprend à mieux gérer vos besoins",
    "privacy.why.reason3": "Vous envoyer des mises à jour et bien sûr répondre à vos questions primordiale.",

    "privacy.protection.title": "Comment les protège-t-on ?",
    "privacy.protection.method1":
      "Protéger et chiffrer sont nos mots d'ordre ! Nous utilisons les technologies de la blockchain pour mettre en mouvement vos données en toute sécurité. Elles seront hébergées sur un réseau blockchain nommé ICP, développé par la fondation DFINITY qui se distingue par son engagement à privilégier des solutions de protection avancées des données.",
    "privacy.protection.method2":
      "Respecter nos obligations légales sans vendre votre âme (ou vos infos) à qui que ce soit. Aucune vente de données, aucun partage caché de dossier sous le bureaux.",

    "privacy.storage.title": "Où sont stockées vos données et avec qui elles sont partagées ?",
    "privacy.storage.security.title": "Sécurité et chiffrement",
    "privacy.storage.security.desc":
      "Vos données ne sont pas sur un serveur centralisé vulnérable aux fuites. Tout est chiffré et stocké de manière décentralisée sur ICP, ce qui renforce considérablement la sécurité.",

    "privacy.storage.sharing.title": "Partage des données",
    "privacy.storage.sharing.desc": "On ne partage jamais vos données, sauf dans ces cas précis :",
    "privacy.storage.sharing.case1":
      "Avec des prestataires techniques si c'est indispensable pour que le service fonctionne bien.",
    "privacy.storage.sharing.case2": "Si la loi nous l'impose, mais uniquement en respectant les standards RGPD.",
    "privacy.storage.sharing.case3": "Avec votre consentement, et seulement si vous êtes d'accord.",

    "privacy.standard.title": "Une seule politique pour tous, pas de double standard !",
    "privacy.standard.desc":
      "Certaines plateformes (oui, on te voit, Discord 👀) appliquent deux politiques différentes selon que vous soyez en Europe ou ailleurs.",
    "privacy.standard.example.title": "Exemple :",
    "privacy.standard.example.eu":
      "Si vous signalez un problème en Europe, vous avez un lien spécifique et une protection renforcée.",
    "privacy.standard.example.noneu":
      "Si vous êtes hors Europe, ce n'est plus la même protection, et vos données peuvent être traitées différemment.",
    "privacy.standard.our_approach":
      "Chez RECORDSS.AI, c'est simple : on applique une seule politique pour tout le monde, en respectant les standards européens (RGPD & NIS2), qui sont les plus avancés en matière de confidentialité.",
    "privacy.standard.global":
      "Que vous soyez en France, aux États-Unis, en Asie ou en Antarctique 🐧, vos droits restent les mêmes.",

    "privacy.changes.title": "Modifications de cette politique",
    "privacy.changes.desc":
      "On peut être amenés à mettre à jour cette politique de confidentialité pour s'adapter aux évolutions techniques, réglementaires ou simplement pour l'améliorer.",
    "privacy.changes.notification":
      "Si des changements importants sont faits, on vous préviendra en publiant la nouvelle politique ici et, si nécessaire, en vous envoyant un e-mail.",
    "privacy.changes.trust":
      "Votre confiance est notre priorité, et on s'engage à toujours vous tenir informés de la manière dont vos données sont protégées.",

    "privacy.rights.title": "Vos droits et comment nous contacter",
    "privacy.rights.desc": "Vous avez le contrôle sur vos données. Conformément au RGPD, vous pouvez :",
    "privacy.rights.access": "Accéder et modifier vos informations personnelles",
    "privacy.rights.delete": "Demander la suppression de vos données",
    "privacy.rights.limit": "Limiter certains traitements si vous le souhaitez",
    "privacy.rights.contact": "Pour toute question ou demande, contactez-nous à : privacy@recordss.ai",

    // Commun
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.unknownError": "Une erreur inconnue s'est produite",
    "common.note": "Note",
    "common.yes": "Oui",
    "common.no": "Non",
    "common.copyScript": "Copier le script",
    "common.copy": "Copier",
    "common.download": "Télécharger",

    // Domain
    "domain.status.connected": "Connecté",
    "domain.status.connectionFailed": "Échec de connexion",
    "domain.status.validConfig": "Configuration valide",
    "domain.status.incompleteConfig": "Configuration incomplète",
    "domain.status.registered": "Domaine enregistré",
    "domain.status.available": "Disponible",
    "domain.status.unavailable": "Non disponible",
    "domain.status.active": "Actif",
    "domain.status.notDetected": "Non détecté",
    "domain.status.configured": "Configuré",
    "domain.status.notConfigured": "Non configuré",
    "domain.info.title": "Informations du domaine",
    "domain.info.status": "Statut",
    "domain.info.website": "Site web",
    "domain.info.email": "Email",
    "domain.info.ssl": "SSL",
    "domain.purchase.title": "Acheter ce domaine",
    "domain.purchase.buyAt": "Acheter ce domaine chez :",
    "domain.purchase.checkAt": "Vérifier ce domaine chez :",
    "domain.pricing.registration": "Prix d'enregistrement",
    "domain.pricing.renewal": "Renouvellement annuel",
    "domain.pricing.transfer": "Transfert",
    "domain.pricing.registrar": "Registrar",
    "domain.pricing.estimatedPrices": "Prix estimés",
    "domain.dnsRecords.found": "Enregistrements DNS trouvés",
    "domain.continue.toConnect": "Continuer vers Connecter un Domaine",

    // DNS
    "dns.records.noRecords": "Aucun enregistrement disponible pour ce registrar.",
    "dns.records.columns.type": "Type",
    "dns.records.columns.host": "Hôte",
    "dns.records.columns.name": "Nom",
    "dns.records.columns.value": "Valeur",
    "dns.records.columns.content": "Contenu",
    "dns.records.columns.ttl": "TTL",
    "dns.records.columns.notes": "Notes",
    "dns.records.required": "Requis",
    "dns.records.optional": "Optionnel",
    "dns.status.valid": "Valide",
    "dns.status.missing": "Manquant",
    "dns.status.info": "Info",
    "dns.checks.validConfig": "Configuration valide",
    "dns.checks.readyForIc": "Prêt pour l'Internet Computer",
    "dns.checks.missingRequired": "Enregistrements requis manquants",
    "dns.checks.apexDomain": "Domaine apex",
    "dns.checks.wwwSubdomain": "Sous-domaine www",
    "dns.checks.canisterIdRecord": "Enregistrement _canister-id",
    "dns.checks.acmeChallengeRecord": "Enregistrement _acme-challenge",
    "dns.checks.boundaryNodes": "Boundary Nodes",

    // Web3
    "web3.services.noInfo": "Aucune information sur les services Web3 disponible.",
    "web3.services.wallets.title": "Wallets",
    "web3.services.identity.title": "Identity",
    "web3.services.tokens.title": "Tokens",
    "web3.services.nfts.title": "NFTs",

    // ICP
    "icp.configFiles.title": "Fichiers de configuration ICP",
    "icp.configFiles.description": "Fichiers nécessaires pour configurer votre domaine sur Internet Computer",
    "icp.configFiles.path": "Chemin",
    "icp.configFiles.icDomains.description":
      "Ce fichier indique à Internet Computer quel domaine est associé à votre canister.",
    "icp.configFiles.icAssets.description":
      "Ce fichier configure les assets qui doivent être servis par votre canister.",
    "icp.configFiles.registerScript.title": "Script d'enregistrement",
    "icp.configFiles.registerScript.description":
      "Ce script permet d'enregistrer votre domaine auprès des boundary nodes d'Internet Computer.",
    "icp.configFiles.registerScript.note":
      "N'oubliez pas de remplacer le domaine dans le script et de le rendre exécutable avec",
    "icp.configFiles.checkStatusScript.title": "Script de vérification de statut",
    "icp.configFiles.checkStatusScript.description":
      "Ce script permet de vérifier le statut de l'enregistrement de votre domaine.",
    "icp.configFiles.checkStatusScript.note":
      "N'oubliez pas de remplacer YOUR_REQUEST_ID par l'ID obtenu lors de l'enregistrement et de rendre le script exécutable avec",
    "icp.configFiles.instructions.title": "Instructions détaillées",
    "icp.configFiles.instructions.description": "Guide complet pour configurer votre domaine sur Internet Computer.",
    "icp.configFiles.steps.title": "Étapes à suivre",
    "icp.configFiles.steps.step1": "Créez les fichiers de configuration dans votre projet",
    "icp.configFiles.steps.step2": "Déployez votre canister avec les fichiers mis à jour",
    "icp.configFiles.steps.step3": "Exécutez le script d'enregistrement pour enregistrer votre domaine",
    "icp.configFiles.steps.step4": "Vérifiez le statut de l'enregistrement avec le script de vérification",
    "icp.configFiles.steps.step5": "Une fois disponible, votre domaine sera accessible via HTTPS",
    "icp.configFiles.copyAll": "Copier tous les fichiers",
    "icp.configFiles.generateCustomScript": "Générer script personnalisé",
    "icp.configFiles.downloadAll": "Télécharger tous les fichiers",
    "icp.configFiles.downloadCustomScript": "Télécharger script personnalisé",

    "modal.usecase.features": "Fonctionnalités clés",
    "modal.usecase.benefits": "Avantages",
    "modal.usecase.individuals.feature1": "Interface intuitive pour la gestion de domaines",
    "modal.usecase.individuals.feature2": "Assistant de configuration DNS pas à pas",
    "modal.usecase.individuals.feature3": "Vérification automatique des erreurs",
    "modal.usecase.individuals.benefit1": "Économisez du temps sur la configuration",
    "modal.usecase.individuals.benefit2": "Protégez votre identité en ligne",
    "modal.usecase.individuals.benefit3": "Connectez facilement vos services",
    "modal.usecase.individuals.testimonial":
      "Grâce à RECORDSS.IA, j'ai pu configurer mon domaine personnel en quelques minutes, alors que j'avais passé des heures à essayer de comprendre les configurations DNS auparavant.",
    "modal.usecase.individuals.author": "Marie L., Blogueuse",

    "modal.usecase.companies.feature1": "Gestion centralisée de multiples domaines",
    "modal.usecase.companies.feature2": "Orchestration DNS automatisée",
    "modal.usecase.companies.feature3": "Surveillance continue et alertes",
    "modal.usecase.companies.benefit1": "Réduisez les temps d'arrêt",
    "modal.usecase.companies.benefit2": "Améliorez la sécurité de vos domaines",
    "modal.usecase.companies.benefit3": "Optimisez vos coûts de gestion DNS",
    "modal.usecase.companies.testimonial":
      "Notre entreprise gère plus de 50 domaines différents. RECORDSS.IA nous a permis de centraliser cette gestion et d'automatiser les tâches répétitives.",
    "modal.usecase.companies.author": "Thomas D., Directeur IT",

    "modal.usecase.web3devs.feature1": "Support natif pour les domaines blockchain",
    "modal.usecase.web3devs.feature2": "Configuration automatisée pour les dApps",
    "modal.usecase.web3devs.feature3": "Support pour les smart contracts",
    "modal.usecase.web3devs.benefit1": "Accélérez le développement Web3",
    "modal.usecase.web3devs.benefit2": "Simplifiez l'expérience utilisateur",
    "modal.usecase.web3devs.benefit3": "Créez des ponts entre Web2 et Web3",
    "modal.usecase.web3devs.testimonial":
      "En tant que développeur de dApps, la configuration DNS était toujours un défi. RECORDSS.IA a simplifié ce processus et m'a permis de me concentrer sur le développement.",
    "modal.usecase.web3devs.author": "Alex K., Développeur Web3",

    "modal.usecase.agencies.feature1": "API complète pour vos workflows",
    "modal.usecase.agencies.feature2": "Gestion multi-clients",
    "modal.usecase.agencies.feature3": "Rapports clients automatisés",
    "modal.usecase.agencies.benefit1": "Réduisez le temps de configuration",
    "modal.usecase.agencies.benefit2": "Offrez un service à valeur ajoutée",
    "modal.usecase.agencies.benefit3": "Augmentez votre efficacité opérationnelle",
    "modal.usecase.agencies.testimonial":
      "Notre agence livre environ 20 sites par mois. RECORDSS.IA nous a permis d'automatiser la configuration DNS pour chaque client, réduisant nos délais de livraison.",
    "modal.usecase.agencies.author": "Sophie M., Directrice d'agence",
    "modal.close": "Fermer",
  },
  en: {
    // Navigation
    "nav.whitelist": "Whitelist",
    "nav.privacy": "Privacy",
    "nav.offers": "Offers",
    "nav.start": "Get Started",
    "nav.test": "Try Now",

    // Footer
    "footer.copyright": "The intelligent assistant for your DNS configurations",
    "footer.offers": "Our offers",
    "footer.privacy": "Privacy policy",
    "footer.whitelist": "Whitelist",
    "footer.contact": "Contact us",

    // Home page
    "home.hero.title": "RECORDSS.AI",
    "home.hero.subtitle": "The Automated DNS orchestrator between your domain your services",
    "home.hero.feature1": "Compare DNS price across registrars",
    "home.hero.feature2": "Purchase, Configure & Register ",
    "home.hero.feature3": "Auto-renewal & Security-checks  ",
    "home.hero.cta": "Sign up",
    "home.tables.vulnerabilities": "Vulnerable Configurations",
    "home.tables.incidents": "Major Incidents",
    "home.tables.company": "Company",
    "home.tables.problems": "Issues",
    "home.tables.risk": "Risk",
    "home.tables.incident": "Incident",
    "home.tables.date": "Date",
    "home.tables.impact": "Impact",
    "home.tables.high": "High",
    "home.tables.critical": "Critical",
    "home.usecases.title": "Use Cases",
    "home.usecases.subtitle": "RECORDSS.AI adapts to different needs and users.",
    "home.usecases.individuals.title": "Individuals",
    "home.usecases.individuals.desc":
      "Simplified DNS configuration for your personal sites without technical knowledge.",
    "home.usecases.companies.title": "Companies",
    "home.usecases.companies.desc": "Centralized management of multiple domains with automated DNS orchestration.",
    "home.usecases.web3devs.title": "Web3 Developers",
    "home.usecases.web3devs.desc": "Seamless integration between blockchain domains and decentralized applications.",
    "home.usecases.agencies.title": "Web agencies",
    "home.usecases.agencies.desc": "Complete API to manage DNS configurations for all your clients.",
    "home.usecases.learnmore": "Learn more",
    "home.features.title": "Key Features",
    "home.features.subtitle": "Powerful tools to manage your domains and DNS configurations.",
    "home.features.verification.title": "Record verification and connection",
    "home.features.verification.desc":
      "Our agent automatically verifies and connects your DNS records to ensure a perfect link between your domains and applications, whether Web2 or Web3.",
    "home.features.verification.feature1": "Automatic detection of required configurations",
    "home.features.verification.feature2": "Seamless connection between domains and applications",
    "home.features.verification.feature3": "Real-time validation of DNS propagation",
    "home.features.dns.title": "Automated DNS Management",
    "home.features.dns.desc":
      "Automatic configuration of DNS records for all popular registrars, eliminating manual errors.",
    "home.features.integration.title": "Web2/Web3 Integration",
    "home.features.integration.desc":
      "Easily connect your traditional and blockchain domains to your applications and dApps without technical knowledge.",
    "home.features.api.title": "Developer API",
    "home.features.api.desc":
      "Integrate our features into your own applications with our complete API and detailed documentation.",
    "home.features.discover": "Discover",
    "home.test.title": "Try it now – Simple & Efficient",
    "home.test.subtitle": "Purchase, Configurate & Automatic Registration in a Few Clicks.",
    "home.test.domain": "Domain name",
    "home.test.domain.placeholder": "example.com or example.eth",
    "home.test.domain.help": "Enter your Web2 or Web3 domain name",
    "home.test.type": "Domain type",
    "home.test.type.placeholder": "Select a domain type",
    "home.test.type.web2": "Traditional domain (Web2)",
    "home.test.type.ens": "ENS (Ethereum Name Service)",
    "home.test.type.unstoppable": "Unstoppable Domains",
    "home.test.type.other": "Other blockchain",
    "home.test.registrar": "Registrar (for Web2)",
    "home.test.registrar.placeholder": "Select a registrar",
    "home.test.security": "Include a complete security test",
    "home.test.analyze": "Analyze my domain",
    // Dans la section en:
    "home.hero.social": "Join us on social media",

    // New elements for tabbed forms
    "home.tabs.availability": "Domain Availability",
    "home.tabs.connect": "Connect Domain",
    "home.tabs.security": "Email Security",
    "home.tabs.availability.domain": "Domain Name",
    "home.tabs.availability.placeholder": "example.com or example.eth",
    "home.tabs.availability.help": "Enter your domain name to check its availability",
    "home.tabs.availability.check": "Check Availability",
    "home.tabs.connect.type": "Domain Type",
    "home.tabs.connect.web2": "Web2 Domain",
    "home.tabs.connect.web3": "Web3 Domain",
    "home.tabs.connect.domain": "Domain Name",
    "home.tabs.connect.placeholder": "example.com",
    "home.tabs.connect.canister": "ICP Canister ID",
    "home.tabs.connect.canister.placeholder": "Enter your ICP canister ID",
    "home.tabs.connect.canister.help": "Enter the ICP canister ID of your Web3 domain",
    "home.tabs.connect.web3.domain.help": "Enter your Web3 domain name",
    "home.tabs.connect.button": "Connect Domain",
    "home.tabs.connect.web3.button": "Connect Web3 Domain",
    "home.tabs.security.domain": "Domain Name",
    "home.tabs.security.placeholder": "example.com",
    "home.tabs.security.help": "Enter your domain name to check and configure email security",
    "home.tabs.security.check": "Check Email Security",

    // Offers page
    "offers.title": "Our Offers",
    "offers.subtitle": "Solutions tailored to all needs.",
    "offers.security.title": "Enhanced DNS Security",
    "offers.security.desc":
      "Our agent checks the security of your DNS configurations to protect your domain against common threats.",
    "offers.security.feature1": "DNSSEC Protection",
    "offers.security.feature1.desc": "Against DNS spoofing",
    "offers.security.feature2": "Email security",
    "offers.security.feature2.desc": "SPF, DKIM and DMARC",
    "offers.security.feature3": "Web3 Audit",
    "offers.security.feature3.desc": "Blockchain domain security",
    "offers.security.feature4": "Continuous monitoring",
    "offers.security.feature4.desc": "Real-time alerts",
    "offers.free.title": "Free",
    "offers.free.price": "$0",
    "offers.free.subtitle": "3 requests",
    "offers.free.feature1": "1 domain included",
    "offers.free.feature2": "Limited API access",
    "offers.free.feature3": "Community support",
    "offers.free.feature4": "Basic DNS management",
    "offers.free.cta": "Start for free",
    "offers.pro.title": "Essential",
    "offers.pro.price": "$19",
    "offers.pro.period": "/month",
    "offers.pro.subtitle": "For freelancers",
    "offers.pro.feature1": "Automated DNS management AI agent",
    "offers.pro.feature2": "10 domains included",
    "offers.pro.feature3": "Custom dashboard",
    "offers.pro.feature4": "Advanced protection",
    "offers.pro.feature5": "Limited API access",
    "offers.pro.feature6": "Email & cal.com support",
    "offers.pro.cta": "Subscribe",
    "offers.pro.popular": "For freelancers",
    "offers.enterprise.title": "PRO",
    "offers.enterprise.price": "Custom",
    "offers.enterprise.subtitle": "For businesses",
    "offers.enterprise.feature1": "Custom DNS management AI agent",
    "offers.enterprise.feature2": "Unlimited domains",
    "offers.enterprise.feature3": "Assisted integrations",
    "offers.enterprise.feature4": "Unlimited API access",
    "offers.enterprise.feature5": "24/7 dedicated support",
    "offers.enterprise.feature6": "Tailored solution",
    "offers.enterprise.cta": "Contact us",
    "offers.community.title": "Funds Community",
    "offers.community.price": "100€ ICP",
    "offers.community.subtitle": "Limited offer to 1000 NFTs",
    "offers.community.feature1": "Custom DNS management AI agent",
    "offers.community.feature2": "20 domains included",
    "offers.community.feature3": "Exclusive benefits",
    "offers.community.feature4": "24/7 dedicated support",
    "offers.community.cta": "Invest",
    "offers.comparison.title": "Feature comparison",
    "offers.comparison.feature": "Feature",
    "offers.comparison.domains": "Number of domains",
    "offers.comparison.web2": "Web2 support",
    "offers.comparison.web3": "Web3 support",
    "offers.comparison.security": "Security tests",
    "offers.comparison.security.basic": "Basic",
    "offers.comparison.security.complete": "Complete",
    "offers.comparison.security.advanced": "Advanced",
    "offers.comparison.api": "API access",
    "offers.comparison.api.no": "No",
    "offers.comparison.api.limited": "Limited",
    "offers.comparison.api.full": "Complete",
    "offers.comparison.support": "Support",
    "offers.comparison.support.community": "Community",
    "offers.comparison.support.email": "Email",
    "offers.comparison.support.dedicated": "24/7 dedicated",
    "offers.comparison.integrations": "Custom integrations",
    "offers.comparison.integrations.yes": "Yes",
    "offers.comparison.integrations.no": "No",
    "offers.contact.text": "Need a custom solution for your business?",
    "offers.contact.cta": "Contact our sales team",
    "offers.free.feature1.desc": "Manage one domain with our platform",
    "offers.free.feature2.desc": "3 requests to test our API",
    "offers.free.feature3.desc": "Access to our help forum",
    "offers.pro.feature1.desc": "Automate your DNS management",
    "offers.pro.feature2.desc": "Manage up to 10 different domains",
    "offers.pro.feature3.desc": "Interface tailored to your needs",
    "offers.pro.feature4.desc": "Security against data loss",
    "offers.enterprise.feature1.desc": "Tailored solution for your business",
    "offers.enterprise.feature2.desc": "No restriction on the number of domains",
    "offers.enterprise.feature3.desc": "Support for all your integrations",
    "offers.enterprise.feature4.desc": "No restriction on API calls",
    "offers.community.subtitle.badge": "Public Investment",
    "offers.community.price.period": "/ ICP token",
    "offers.community.feature1.desc": "Tailored solution for your needs",
    "offers.community.feature2.desc": "Manage up to 20 different domains",
    "offers.community.feature3.desc": "Access to members-only features",
    "offers.community.feature4.desc": "Priority assistance anytime",

    // Whitelist page
    "whitelist.title": "Whitelist",
    "whitelist.subtitle": "List of services and platforms compatible with RECORDSS.IA",
    "whitelist.join.title": "Join the whitelist",
    "whitelist.join.desc":
      "Sign up to be among the first to access our platform and benefit from exclusive advantages.",
    "whitelist.join.email": "Your email address",
    "whitelist.join.email.placeholder": "you@example.com",
    "whitelist.join.privacy": "We will never share your email with third parties.",
    "whitelist.join.cta": "Sign up",
    "whitelist.web3.title": "Compatible Web3 platforms",
    "whitelist.web3.desc": "These blockchain platforms are compatible with our service.",
    "whitelist.web2.title": "Compatible Web2 registrars",
    "whitelist.web2.desc": "These registrars are compatible with our DNS automation agent.",
    "whitelist.hosting.title": "Compatible hosting platforms",
    "whitelist.hosting.desc": "These hosting platforms are compatible with our service.",
    "whitelist.platform": "Platform",
    "whitelist.registrar": "Registrar",
    "whitelist.compatibility": "Compatibility",
    "whitelist.notes": "Notes",
    "whitelist.compatibility.full": "Complete",
    "whitelist.compatibility.partial": "Partial",
    "whitelist.compatibility.planned": "Planned",
    "whitelist.contact.text": "Want to add your platform to our compatibility list?",
    "whitelist.contact.cta": "Contact us",

    // Privacy page
    "privacy.title": "Privacy Policy",
    "privacy.lastupdate": "Last updated: March 29, 2025",
    "privacy.intro.title": "Introduction",
    "privacy.intro.content1":
      "At RECORDSS.AI, we don't joke around with the privacy and security of your data. You trust us, and we commit to respecting and protecting your information with the highest cybersecurity standards.",
    "privacy.intro.content2":
      "We use ICP and DFINITY to ensure advanced encryption and secure data management. Unlike some platforms that adapt their rules depending on your region (looking at you, Discord 👀, which divides its reporting management between the EU and the rest of the world), with us, it's 100% transparent and universal. No matter your country, you benefit from European laws, which are the most demanding in terms of data protection (GDPR & NIS2).",

    "privacy.collect.title": "Data we collect",
    "privacy.collect.auth.title": "Authentication data",
    "privacy.collect.auth.desc":
      "When you create an account, we only collect what's necessary to ensure your secure access:",
    "privacy.collect.auth.email": "Your email address",
    "privacy.collect.auth.id": "A unique identifier",
    "privacy.collect.auth.timestamps": "Connection timestamps",
    "privacy.collect.auth.security":
      "For security, we use DFINITY Identity authentication, which replaces traditional methods with a more decentralized and private approach.",

    "privacy.collect.dns.title": "DNS record data",
    "privacy.collect.dns.desc": "Since RECORDSS.AI is here to automate your DNS configurations, we need:",
    "privacy.collect.dns.domains": "Your domain names",
    "privacy.collect.dns.settings": "Your existing DNS settings",

    "privacy.collect.technical.title": "Technical and usage data for our free services",
    "privacy.collect.technical.desc":
      "We collect information to improve our service and ensure a smooth experience for all our users, without API overload from excessive requests by free users. This prevents slowing down our paying users.",
    "privacy.collect.technical.ip":
      "IP address and connection information (browser, operating system), which allows us to manage access to our API according to a limited number of requests (and yes, we think about VPNs 😉).",
    "privacy.collect.technical.note":
      "This data, although anonymized, is never stored on our servers. It is used only via your cookies and your browser.",

    "privacy.why.title": "Why we collect this data",
    "privacy.why.desc":
      "As you know, every system has essential needs. For example, we need to know if content is viewed from multiple locations and, if so, how many times. This gives us an overview and helps us develop our project with a more ambitious vision adapted to the expectations of our growing community.",
    "privacy.why.reason1": "Automatically configure your DNS without hassle",
    "privacy.why.reason2": "Improve our private AI that learns to better manage your needs",
    "privacy.why.reason3": "Send you updates and of course answer your essential questions.",

    "privacy.protection.title": "How do we protect it?",
    "privacy.protection.method1":
      "Protect and encrypt are our watchwords! We use blockchain technologies to move your data securely. They will be hosted on a blockchain network called ICP, developed by the DFINITY foundation, which is distinguished by its commitment to prioritizing advanced data protection solutions.",
    "privacy.protection.method2":
      "Respect our legal obligations without selling your soul (or your info) to anyone. No data sales, no hidden file sharing under the desk.",

    "privacy.storage.title": "Where your data is stored and with whom it's shared",
    "privacy.storage.security.title": "Security and encryption",
    "privacy.storage.security.desc":
      "Your data is not on a centralized server vulnerable to leaks. Everything is encrypted and stored in a decentralized manner on ICP, which significantly strengthens security.",

    "privacy.storage.sharing.title": "Data sharing",
    "privacy.storage.sharing.desc": "We never share your data, except in these specific cases:",
    "privacy.storage.sharing.case1":
      "With technical service providers if it's essential for the service to function properly.",
    "privacy.storage.sharing.case2": "If the law requires us to, but only in compliance with GDPR standards.",
    "privacy.storage.sharing.case3": "With your consent, and only if you agree.",

    "privacy.standard.title": "One policy for all, no double standard!",
    "privacy.standard.desc":
      "Some platforms (yes, we see you, Discord 👀) apply two different policies depending on whether you're in Europe or elsewhere.",
    "privacy.standard.example.title": "Example:",
    "privacy.standard.example.eu":
      "If you report an issue in Europe, you have a specific link and enhanced protection.",
    "privacy.standard.example.noneu":
      "If you're outside Europe, it's no longer the same protection, and your data may be processed differently.",
    "privacy.standard.our_approach":
      "At RECORDSS.AI, it's simple: we apply a single policy for everyone, respecting European standards (GDPR & NIS2), which are the most advanced in terms of privacy.",
    "privacy.standard.global":
      "Whether you're in France, the United States, Asia, or Antarctica 🐧, your rights remain the same.",

    "privacy.changes.title": "Changes to this policy",
    "privacy.changes.desc":
      "We may need to update this privacy policy to adapt to technical or regulatory developments, or simply to improve it.",
    "privacy.changes.notification":
      "If significant changes are made, we'll notify you by publishing the new policy here and, if necessary, by sending you an email.",
    "privacy.changes.trust":
      "Your trust is our priority, and we commit to always keeping you informed about how your data is protected.",

    "privacy.rights.title": "Your rights and how to contact us",
    "privacy.rights.desc": "You have control over your data. In accordance with GDPR, you can:",
    "privacy.rights.access": "Access and modify your personal information",
    "privacy.rights.delete": "Request the deletion of your data",
    "privacy.rights.limit": "Limit certain processing if you wish",
    "privacy.rights.contact": "For any questions or requests, contact us at: privacy@recordss.ai",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.unknownError": "An unknown error occurred",
    "common.note": "Note",
    "common.yes": "Yes",
    "common.no": "No",
    "common.copyScript": "Copy script",
    "common.copy": "Copy",
    "common.download": "Download",

    // Domain
    "domain.status.connected": "Connected",
    "domain.status.connectionFailed": "Connection Failed",
    "domain.status.validConfig": "Valid Configuration",
    "domain.status.incompleteConfig": "Incomplete Configuration",
    "domain.status.registered": "Domain Registered",
    "domain.status.available": "Available",
    "domain.status.unavailable": "Unavailable",
    "domain.status.active": "Active",
    "domain.status.notDetected": "Not Detected",
    "domain.status.configured": "Configured",
    "domain.status.notConfigured": "Not Configured",
    "domain.info.title": "Domain Information",
    "domain.info.status": "Status",
    "domain.info.website": "Website",
    "domain.info.email": "Email",
    "domain.info.ssl": "SSL",
    "domain.purchase.title": "Buy this domain",
    "domain.purchase.buyAt": "Buy this domain at:",
    "domain.purchase.checkAt": "Check this domain at:",
    "domain.pricing.registration": "Registration Price",
    "domain.pricing.renewal": "Annual Renewal",
    "domain.pricing.transfer": "Transfer",
    "domain.pricing.registrar": "Registrar",
    "domain.pricing.estimatedPrices": "Estimated Prices",
    "domain.dnsRecords.found": "DNS Records Found",
    "domain.continue.toConnect": "Continue to Connect Domain",

    // DNS
    "dns.records.noRecords": "No records available for this registrar.",
    "dns.records.columns.type": "Type",
    "dns.records.columns.host": "Host",
    "dns.records.columns.name": "Name",
    "dns.records.columns.value": "Value",
    "dns.records.columns.content": "Content",
    "dns.records.columns.ttl": "TTL",
    "dns.records.columns.notes": "Notes",
    "dns.records.required": "Required",
    "dns.records.optional": "Optional",
    "dns.status.valid": "Valid",
    "dns.status.missing": "Missing",
    "dns.status.info": "Info",
    "dns.checks.validConfig": "Valid Configuration",
    "dns.checks.readyForIc": "Ready for Internet Computer",
    "dns.checks.missingRequired": "Missing Required Records",
    "dns.checks.apexDomain": "Apex Domain",
    "dns.checks.wwwSubdomain": "WWW Subdomain",
    "dns.checks.canisterIdRecord": "_canister-id Record",
    "dns.checks.acmeChallengeRecord": "_acme-challenge Record",
    "dns.checks.boundaryNodes": "Boundary Nodes",

    // Web3
    "web3.services.noInfo": "No Web3 services information available.",
    "web3.services.wallets.title": "Wallets",
    "web3.services.identity.title": "Identity",
    "web3.services.tokens.title": "Tokens",
    "web3.services.nfts.title": "NFTs",

    // ICP
    "icp.configFiles.title": "ICP Configuration Files",
    "icp.configFiles.description": "Files needed to configure your domain on Internet Computer",
    "icp.configFiles.path": "Path",
    "icp.configFiles.icDomains.description":
      "This file tells Internet Computer which domain is associated with your canister.",
    "icp.configFiles.icAssets.description": "This file configures the assets that should be served by your canister.",
    "icp.configFiles.registerScript.title": "Registration Script",
    "icp.configFiles.registerScript.description":
      "This script allows you to register your domain with Internet Computer boundary nodes.",
    "icp.configFiles.registerScript.note": "Remember to replace the domain in the script and make it executable with",
    "icp.configFiles.checkStatusScript.title": "Status Check Script",
    "icp.configFiles.checkStatusScript.description":
      "This script allows you to check the status of your domain registration.",
    "icp.configFiles.checkStatusScript.note":
      "Remember to replace YOUR_REQUEST_ID with the ID obtained during registration and make the script executable with",
    "icp.configFiles.instructions.title": "Detailed Instructions",
    "icp.configFiles.description": "Complete guide to configure your domain on Internet Computer.",
    "icp.configFiles.steps.title": "Steps to Follow",
    "icp.configFiles.steps.step1": "Create the configuration files in your project",
    "icp.configFiles.steps.step2": "Deploy your canister with the updated files",
    "icp.configFiles.steps.step3": "Run the registration script to register your domain",
    "icp.configFiles.steps.step4": "Check the registration status with the verification script",
    "icp.configFiles.steps.step5": "Once available, your domain will be accessible via HTTPS",
    "icp.configFiles.copyAll": "Copy all files",
    "icp.configFiles.generateCustomScript": "Generate custom script",
    "icp.configFiles.downloadAll": "Download all files",
    "icp.configFiles.downloadCustomScript": "Download custom script",

    "modal.usecase.features": "Key Features",
    "modal.usecase.benefits": "Benefits",
    "modal.usecase.individuals.feature1": "Intuitive interface for domain management",
    "modal.usecase.individuals.feature2": "Step-by-step DNS configuration assistant",
    "modal.usecase.individuals.feature3": "Automatic error checking",
    "modal.usecase.individuals.benefit1": "Save time on configuration",
    "modal.usecase.individuals.benefit2": "Protect your online identity",
    "modal.usecase.individuals.benefit3": "Easily connect your services",
    "modal.usecase.individuals.testimonial":
      "Thanks to RECORDSS.IA, I was able to configure my personal domain in minutes, whereas I had spent hours trying to understand DNS configurations before.",
    "modal.usecase.individuals.author": "Marie L., Blogger",

    "modal.usecase.companies.feature1": "Centralized management of multiple domains",
    "modal.usecase.companies.feature2": "Automated DNS orchestration",
    "modal.usecase.companies.feature3": "Continuous monitoring and alerts",
    "modal.usecase.companies.benefit1": "Reduce downtime",
    "modal.usecase.companies.benefit2": "Improve your domain security",
    "modal.usecase.companies.benefit3": "Optimize your DNS management costs",
    "modal.usecase.companies.testimonial":
      "Our company manages more than 50 different domains. RECORDSS.IA has allowed us to centralize this management and automate repetitive tasks.",
    "modal.usecase.companies.author": "Thomas D., IT Director",

    "modal.usecase.web3devs.feature1": "Native support for blockchain domains",
    "modal.usecase.web3devs.feature2": "Automated configuration for dApps",
    "modal.usecase.web3devs.feature3": "Support for smart contracts",
    "modal.usecase.web3devs.benefit1": "Accelerate Web3 development",
    "modal.usecase.web3devs.benefit2": "Simplify user experience",
    "modal.usecase.web3devs.benefit3": "Create bridges between Web2 and Web3",
    "modal.usecase.web3devs.testimonial":
      "As a dApp developer, DNS configuration was always a challenge. RECORDSS.IA simplified this process and allowed me to focus on development.",
    "modal.usecase.web3devs.author": "Alex K., Web3 Developer",

    "modal.usecase.agencies.feature1": "Complete API for your workflows",
    "modal.usecase.agencies.feature2": "Multi-client management",
    "modal.usecase.agencies.feature3": "Automated client reports",
    "modal.usecase.agencies.benefit1": "Reduce configuration time",
    "modal.usecase.agencies.benefit2": "Offer value-added service",
    "modal.usecase.agencies.benefit3": "Increase your operational efficiency",
    "modal.usecase.agencies.testimonial":
      "Our agency delivers about 20 sites per month. RECORDSS.IA has allowed us to automate DNS configuration for each client, reducing our delivery times.",
    "modal.usecase.agencies.author": "Sophie M., Agency Director",
    "modal.close": "Close",
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
  t: (key: string) => key,
})

export const useLanguage = () => useContext(LanguageContext)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("fr")

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "fr" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

