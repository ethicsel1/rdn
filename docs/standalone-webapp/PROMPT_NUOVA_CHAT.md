# PROMPT PER NUOVA CHAT - RDN STANDALONE WEB APP

Copia e incolla questo prompt all'inizio della nuova chat:

---

# RDN Standalone Web App - Sviluppo Completo

Devo creare una web app standalone completa per "RDN - Rinascita Definitiva dai Narcisisti", un ecosistema digitale di crescita personale ed empowerment.

## Contesto del Progetto

RDN è una piattaforma di crescita personale per persone uscite da relazioni tossiche con narcisisti patologici. L'obiettivo è creare un'esperienza web trasformativa con:

- **3 Schermate principali** (Benvenuto, Orientamento, Strumenti)
- **8 Strumenti** di rinascita (4 Livello 1, 4 Livello 2)
- **Sistema viralità** con Biblioteca Saggezza (30 guide)
- **Rituali quotidiani** che creano dipendenza positiva
- **Abbonamento**: L1 €9,90/sett, L2 €19,90/sett, Trial 7gg €1

## Stack Tecnologico

**Frontend**:
- React 18 + Vite
- TailwindCSS
- React Router v6
- Framer Motion (animazioni)
- React Query (data fetching)
- Zustand (state management)

**Backend**:
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT auth
- Stripe payments
- OpenAI API (generazione contenuti)

## Palette Colori RDN

```javascript
colors: {
  primary: '#F59E0B',      // Oro vibrante (CTA, accenti)
  secondary: '#78350F',    // Terra profondo (testi, titoli)
  background: '#FEF3C7',   // Ambra chiaro (sfondo L1)
  white: '#FFFFFF',        // Sfondo L2
  red: '#DC2626',          // Emergenze
  green: '#10B981',        // Successi
  teal: '#14B8A6'          // Viralità
}
```

## Tone of Voice

**Approvati**: Rinascita, crescita personale, empowerment, trasformazione, forza interiore, consapevolezza, energia, evoluzione, protezione, validazione.

**VIETATI**: Trauma, terapia, diagnosi, sintomi, patologia, disturbo, paziente, cura, trattamento, guarigione clinica.

**Stile**: Validante mai giudicante, protettivo mai infantilizzante, attivante mai pressante, celebrativo mai manipolativo. Sempre seconda persona singolare ("Tu sei...", "Oggi puoi...").

## Architettura 3 Schermate

### SCHERMATA 1: Benvenuto e Stato Quotidiano

**Componenti**:
1. **Header fisso**: Titolo "RDN – Rinascita Definitiva dai Narcisisti" + Slogan "Qui non si sopravvive. Qui si rinasce"
2. **Welcome rotante**: 30+ messaggi mai identici con emoji (es: "Bentornato. Ogni volta che torni qui, scegli TE. Questa è forza pura 💫")
3. **Mood selector**: 3 opzioni (Fragile 🌧️ / Incertə 🌫️ / Prontə 🔥) → scelta attiva personalizzazione 24h
4. **Affermazioni adaptive**: 3-5 frasi specifiche per mood da pool 40+ (es. Fragile: "Respira. Sei al sicuro" / Pronto: "Sii l'esempio della rinascita")
5. **Motivatore Energizzante**: Arco narrativo Difficoltà→Speranza→Rinascita con animazioni sequenziali. Contenuto unico 24h poi reset.
6. **Time/Energy selector**: Tempo (5-10/15-30/45+ min) + Energia (Bassa💧/Media🔥/Alta⚡)
7. **CTA adaptiva**: Testo cambia per mood (Fragile: "Sì, Oggi Voglio Accogliermi" / Pronto: "Sì, Voglio Fare il Mio Passo di Oggi")

**Retention hooks**: Novità perpetua, ownership scelta, validazione efficace, breakthrough emotivo, desiderio tornare domani.

---

### SCHERMATA 2: Orientamento e Obiettivi

**Componenti**:
1. **Guidance personalizzata**: Messaggio basato mood+energia+tempo+livello (es: Fragile + bassa energia: "Oggi puoi scegliere di non concentrarti sugli obiettivi. Va bene così")
2. **Test Globale**: 6-9 domande immersive → Output 4-5 obiettivi (3 mesi/1 anno/3 anni/10 anni/vita) con voto partenza/arrivo + scadenze
3. **Box Progressi**: Sommario automatico settimana + ultimo miglioramento + link cronologia completa
4. **Test Settimanale**: Basato su obiettivi globali → Output 3 opzioni focus ordinate CRITICA→ALTA→MEDIA → Utente sceglie 1 con voto partenza/obiettivo → Lock 7gg con modal protezione se tenta cambio anticipato
5. **Piano giornaliero**: Box reminder strumenti consigliati per obiettivo settimanale

**Retention hooks**: Direzione laser, progressi tangibili, celebrazioni automatiche, lock 7gg commitment, countdown urgenza positiva.

---

### SCHERMATA 3: Strumenti di Rinascita

**Componenti**:
1. **Piano sticky**: Box fisso sempre visibile con strumenti consigliati (es: "📋 IL TUO PIANO OGGI | Basato su: Pronto + 30 min + Energia alta | ✅ Trasformatore Avanzato | ✅ Obiettivo Settimana: Confini Sani (4→6)")
2. **Strumenti L1** (4 sempre visibili):
   - **Rinforzo del Giorno**: Testo+voce+musica, 1/24h, countdown disponibilità
   - **Trasformatore Emotivo**: Input libero o lista, spiegazione+pratiche, 5/giorno, 5-10 min
   - **Scudo AntiAbuso**: 900 situazioni, output verità+guida+azione, 5/giorno, 1-2 min
   - **SOS Situazioni Critiche**: Protocolli emergenza, sistema sicurezza keywords, 3/giorno, 8-12 min
3. **Banner Upgrade L1**: Appare dopo 7gg O 10+ usi strumenti, dismissable 7gg, zero popup aggressivi
4. **Strumenti L2** (conditional, 4 premium):
   - **Spada della Vittoria**: Frase-simbolo settimanale auto-generata, 7gg attiva, 2 min
   - **Trasformatore Avanzato**: Routine immersiva 15-20 min, illimitato
   - **Cosa Dire Fare Pensare**: Evoluzione Scudo, output verbale+comportamento+reframe, illimitato, 3-5 min
   - **Moduli Obiettivi**: 50 obiettivi guidati, test+routine+materiali, tracking %, illimitato, 15-20 min/giorno
5. **Footer motivazionale**: Celebrazione milestone 7/30/100gg, badge streak

**Retention hooks**: Routing intelligente, limiti L1 = scarsità, Rinforzo = rituale irrinunciabile, lock 7gg protezione focus, celebrazioni fedeltà.

---

## Sistema Viralità

**Meccanica**:
- Ogni completamento strumento → modal condivisione
- Offerta: condividi per sbloccare progressivamente 30 guide pratiche Biblioteca Saggezza (1 guida per share)
- Tracking condivisioni reali
- Badge 10/30 share
- Teaser guida successiva personalizzato

---

## Sistema Emergenza

**Prioritario**: Pre-output check keywords (suicidio, autolesionismo, dissociazione grave, violenza in atto)
**Se rilevate**: BLOCCO totale output → Schermata rossa con 🔴 112 + 🔵 800 86 00 22 (Telefono Amico 24/7)
**Messaggio**: "Questo strumento non può aiutarti ora. Contatta subito questi numeri"
**Dati**: NON salvati se emergenza

---

## Task Iniziale

**CREA SETUP BASE PROGETTO**:

1. Setup Vite + React 18 + TailwindCSS
2. Configura palette colori RDN in tailwind.config.js
3. Setup React Router con 3 route schermate
4. Crea RDNContext con state management base:
   - User (id, email, level, subscription_status)
   - Mood (fragile/incerto/pronto, timestamp 24h)
   - Energy/Time selections
   - Current goals (global + weekly)
5. Crea layout base con Header + Footer
6. Setup backend Express + PostgreSQL
7. Database schema iniziale (users, moods, goals)
8. JWT auth (signup/login)

**Output atteso**:
- Progetto funzionante con routing 3 schermate
- Login/signup funzionante
- Palette colori RDN applicata
- Header/Footer base

**Dopo setup base, procederemo con sviluppo Schermata 1 completa.**

---

## Documentazione di Riferimento

Ho la specifica completa del progetto in `/home/user/rdn-stand-alone/STRUTTURA_PROGETTO.md` con:
- Architettura dettagliata
- Tutti i componenti da sviluppare
- Schema database
- API endpoints
- Configurazioni

**Consulta quel file per dettagli implementativi.**

---

**INIZIA CON SETUP BASE E DIMMI QUANDO SEI PRONTO PER SCHERMATA 1.**
