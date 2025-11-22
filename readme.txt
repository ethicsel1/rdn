=== RDN Multi-Ecosystem Manager ===
Contributors: yourname
Tags: react, ecosystem, amember, chatbot, multi-tenant
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 8.0
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Gestione 100+ ecosistemi React indipendenti con database condiviso, API REST, integrazione aMember, chatbot IA assistenza universale.

== Description ==

RDN Multi-Ecosystem Manager è un plugin production-ready per la gestione di ecosistemi React multipli e indipendenti. Ogni ecosistema è autonomo (utenti/codici/cache separati) ma condivide la stessa infrastruttura WordPress.

**Caratteristiche principali:**

* **Gestione Ecosistemi**: Crea e gestisci 100+ ecosistemi indipendenti
* **Editor Codici**: 23 codici React per ecosistema (utils, hooks, components, schermate, tools)
* **Database Condiviso**: 21 tabelle con separazione per ecosystem_slug
* **API REST**: 7 endpoint per cache, logging, chatbot
* **Integrazione aMember**: Sync utenti automatico, gestione livelli L1/L2
* **Chatbot IA Universale**: Un codice chatbot.jsx condiviso, FAQ universali + FAQ specifiche per ecosistema
* **Configurazioni**: AI providers (RunPod + fallback), company info, analytics, rate limits
* **Cache Intelligente**: Situazioni e moduli condivisi, zero duplicati
* **Rate Limiting**: Limiti giornalieri L1/L2 con reset automatico UTC
* **Logs Debug**: Tracking errori frontend per ecosistema

**Struttura Codici per Ecosistema:**

* GENERALI (5): utils.js, hooks.js, components.js, AppWrapper.jsx, LegalModals.jsx
* LISTE/OUTPUT (2): liste.js, output-ia.js
* VIRALITÀ (1): viralita.js
* SCHERMATE (3): schermata1.jsx, schermata2.jsx, schermata3.jsx
* TOOLS S1-S2 (3): motivatore.jsx, test-globale.jsx, test-settimanale.jsx
* TOOLS S3 (9): rinforzo.jsx, trasformatore-base.jsx, scudo.jsx, sos.jsx, spada.jsx, trasformatore-avanzato.jsx, cdfp.jsx, obiettivi.jsx, percorso.jsx

**Chatbot IA:**

* Codice universale unico per tutti gli ecosistemi
* FAQ universali globali (tempi risultati, pagamenti, supporto)
* FAQ specifiche per ecosistema (argomenti personalizzati)
* Toggle consulenze + URLs personalizzati
* Risposta intelligente con keyword detection

== Installation ==

1. Carica il file zip del plugin tramite WordPress Admin > Plugin > Aggiungi nuovo > Carica plugin
2. Attiva il plugin
3. Il plugin creerà automaticamente 21 tabelle database + ecosistema default "rdn"
4. Vai su RDN Manager nel menu admin
5. Configura AI providers, aMember, company info in Configurazioni
6. Popola i 23 codici React in Gestione Codici
7. Configura il chatbot universale in Chatbot IA Universale
8. Inserisci shortcode `[rdn-app ecosystem="rdn"]` in una pagina

== Frequently Asked Questions ==

= Quanti ecosistemi posso creare? =

Il plugin è ottimizzato per gestire 100+ ecosistemi. Ogni ecosistema è completamente isolato con i propri codici, configurazioni e dati utente.

= Come funziona l'integrazione aMember? =

Il plugin si integra con aMember 6.x+ leggendo `window.AM_USER` dal frontend. Configura i Product ID per Level 1 e Level 2 nelle Configurazioni. Il sync utenti avviene automaticamente via hooks aMember.

= Il chatbot è condiviso tra ecosistemi? =

Sì, il codice chatbot.jsx è unico e universale. Però ogni ecosistema ha le proprie FAQ specifiche e configurazioni (URL consulenze/supporto), quindi l'esperienza è personalizzata.

= Posso usare più shortcode nella stessa pagina? =

Sì, puoi inserire `[rdn-app ecosystem="rdn"]` e `[rdn-app ecosystem="dea"]` nella stessa pagina senza conflitti. Ogni bundle è isolato.

= Come funziona la cache? =

La cache situazioni (~2480 situazioni) e moduli (45 obiettivi + 300 percorso) è condivisa tra utenti dello stesso ecosistema. Questo riduce drasticamente le chiamate AI e migliora le performance.

= Dove vedo i log errori? =

In RDN Manager > Logs Debug. Puoi filtrare per ecosistema, user, tool type, e vedere gli ultimi 100 errori con stack trace completo.

== Screenshots ==

1. Gestione Ecosistemi - Tabella con status, codici, azioni
2. Gestione Codici - Editor con sidebar categorie e textarea
3. Configurazioni - Form multi-tab (AI, aMember, Company, Analytics, Rate Limits, Chatbot)
4. Database Status - Grid 21 tabelle con count e status
5. Logs Debug - Tabella errori filtrabili
6. Chatbot IA Universale - Editor codice + FAQ universali

== Changelog ==

= 1.0.0 =
* Release iniziale
* 21 tabelle database
* 6 sezioni admin panel
* 7 endpoint REST API
* Shortcode [rdn-app]
* Integrazione aMember
* Chatbot IA universale
* Cache situazioni e moduli
* Rate limiting L1/L2
* Logs debug

== Upgrade Notice ==

= 1.0.0 =
Prima release production-ready. Backup database consigliato prima dell'attivazione.

== Technical Details ==

**Requisiti:**
* WordPress 6.0+
* PHP 8.0+
* React 18 (caricato via CDN)
* aMember 6.x+ (opzionale)

**Database:**
* 21 tabelle (18 con ecosystem_slug, 3 chatbot globali)
* Indici ottimizzati per query ecosistema-specific
* Collation utf8mb4_unicode_ci

**Performance:**
* Bundle codici cached 1h con transient
* React 18 production minified da CDN
* Lazy load admin assets
* AJAX throttling
* Peso plugin: ~35KB

**Sicurezza:**
* Prepared statements SQL
* Sanitization input
* Escape output
* Nonce verification
* Capability checks
* Rate limiting API

== Support ==

Per supporto, bug report o feature request, visita il repository GitHub o contatta l'autore.
