# RDN Standalone Web App - Struttura Progetto

## Architettura Tecnica
- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **State Management**: React Context API + localStorage
- **Routing**: React Router v6
- **Backend API**: Node.js + Express + PostgreSQL
- **Auth**: JWT tokens
- **Payments**: Stripe integration

## Struttura Cartelle

```
rdn-stand-alone/
├── client/                      # Frontend React
│   ├── src/
│   │   ├── components/         # Componenti riutilizzabili
│   │   │   ├── common/        # Button, Modal, Loading, etc.
│   │   │   ├── layout/        # Header, Footer, Sidebar
│   │   │   └── shared/        # Badge, Progress, etc.
│   │   ├── pages/             # 3 Schermate principali
│   │   │   ├── Schermata1/   # Benvenuto e Stato Quotidiano
│   │   │   ├── Schermata2/   # Orientamento e Obiettivi
│   │   │   └── Schermata3/   # Strumenti di Rinascita
│   │   ├── tools/             # 8 Strumenti (L1 + L2)
│   │   │   ├── level1/       # 4 strumenti L1
│   │   │   └── level2/       # 4 strumenti L2
│   │   ├── contexts/          # RDN Context, Auth Context
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API calls
│   │   ├── utils/             # Helper functions
│   │   ├── config/            # Configurazioni
│   │   └── assets/            # Immagini, fonts
│   ├── public/
│   └── package.json
│
├── server/                     # Backend Node.js
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Database models
│   │   ├── middleware/       # Auth, validation
│   │   ├── services/         # AI, email, payments
│   │   └── config/           # DB, env configs
│   └── package.json
│
├── database/                   # SQL schemas
│   ├── schema.sql
│   └── seeds/
│
└── docs/                      # Documentazione
    ├── API.md
    └── DEPLOYMENT.md
```

## Componenti da Sviluppare

### 1. SCHERMATA 1: Benvenuto e Stato Quotidiano
**File**: `client/src/pages/Schermata1/index.jsx`

**Sotto-componenti**:
- `WelcomeMessage.jsx` - Messaggio rotante (30+ varianti)
- `MoodSelector.jsx` - Fragile/Incerto/Pronto
- `AdaptiveAffirmations.jsx` - 3-5 frasi per mood (40+ pool)
- `MotivatoreDinamico.jsx` - Arco narrativo Difficoltà→Speranza→Rinascita
- `TimeEnergySelector.jsx` - Tempo (5-10/15-30/45+) + Energia (Bassa/Media/Alta)
- `AdaptiveCTA.jsx` - Pulsante cambia per mood

**Funzionalità chiave**:
- Rotazione messaggi senza ripetizioni
- Persistenza scelta mood 24h
- Animazioni sequenziali motivatore
- Lock contenuto 24h poi reset

---

### 2. SCHERMATA 2: Orientamento e Obiettivi
**File**: `client/src/pages/Schermata2/index.jsx`

**Sotto-componenti**:
- `PersonalizedGuidance.jsx` - Messaggio basato mood+energia+tempo+livello
- `TestGlobale.jsx` - 6-9 domande → 4-5 obiettivi globali
- `ProgressBox.jsx` - Box "Il Tuo Viaggio di Rinascita"
- `ProgressTimeline.jsx` - Cronologia eventi dettagliata
- `TestSettimanale.jsx` - Focus settimanale con lock 7gg
- `WeeklyPlan.jsx` - Piano giornaliero strumenti consigliati

**Funzionalità chiave**:
- Test immersivi domanda per domanda
- Calcolo obiettivi con voto partenza/arrivo
- Tracking modifiche timestamp
- Lock 7gg con modal protezione
- Override possibile ma scoraggiato

---

### 3. SCHERMATA 3: Strumenti di Rinascita
**File**: `client/src/pages/Schermata3/index.jsx`

**Sotto-componenti**:
- `StickyPlan.jsx` - Box piano fisso sempre visibile
- `ToolsGrid.jsx` - Griglia strumenti L1 + L2 (conditional)
- `UpgradeBanner.jsx` - Banner L2 (timing intelligente, dismissable)
- `FooterMotivational.jsx` - Milestone + celebrazioni

**8 STRUMENTI da sviluppare separatamente**:

#### LIVELLO 1 (4 strumenti)
1. **RinforzoDelGiorno.jsx**
   - 1 uso/24h
   - Testo+voce+musica multisensoriale
   - Countdown ore disponibilità
   - Pool centinaia varianti

2. **TrasformatoreEmotivo.jsx**
   - Input libero o lista situazioni
   - Spiegazione + pratiche mirate
   - Limite: 5/giorno
   - 5-10 min durata

3. **ScudoAntiAbuso.jsx**
   - 900 situazioni precaricate
   - Output: verità + pensiero guida + azione protezione
   - Limite: 5/giorno
   - 1-2 min durata

4. **SOSSituazioniCritiche.jsx**
   - Protocolli emergenza crisi emotive
   - Sistema sicurezza keywords
   - Blocco output + schermata rossa se emergenza vera
   - Limite: 3/giorno
   - 8-12 min durata

#### LIVELLO 2 (4 strumenti)
5. **SpadaDellaVittoria.jsx**
   - Frase-simbolo settimanale
   - Generazione automatica da obiettivo settimanale
   - Attiva 7 giorni poi rinnova
   - 2 min durata

6. **TrasformatoreAvanzato.jsx**
   - Routine immersiva 15-20 min
   - Linguaggio raffinato, spiegazioni profonde
   - Illimitato
   - Per stati emotivi complessi

7. **CosaDireFarePensare.jsx**
   - Evoluzione ScudoAntiAbuso
   - Output: risposta verbale + comportamento + reframe cognitivo
   - Illimitato
   - 3-5 min durata

8. **ModuliObiettivi.jsx**
   - 50 obiettivi guidati
   - Test giornaliero + routine + materiali
   - Tracking progresso % + scadenza
   - Illimitato
   - 15-20 min/giorno

---

### 4. SISTEMA VIRALITÀ
**File**: `client/src/components/virality/`

**Componenti**:
- `ViralityModal.jsx` - Modal condivisione post-strumento
- `BibliotecaSaggezza.jsx` - Dashboard 30 guide
- `ShareProgress.jsx` - Tracking condivisioni
- `BadgeSystem.jsx` - Badge 10/30 share

**Logica**:
- Ogni completamento strumento → attiva modal
- Sblocco progressivo 1 guida per share
- Verifica share reale
- Teaser guida successiva personalizzato

---

### 5. SISTEMA AUTH E ABBONAMENTI
**File**: `client/src/contexts/AuthContext.jsx`

**Funzionalità**:
- Login/Signup con JWT
- Trial 7gg €1 → L1/L2 automatico
- Verifica abbonamento attivo
- Gestione upgrade L1→L2
- Integrazione Stripe webhooks

---

### 6. DATABASE SCHEMA
**File**: `database/schema.sql`

**Tabelle principali**:
- `users` - Dati utente + subscription_level
- `user_moods` - Scelte mood giornaliere
- `user_goals` - Obiettivi globali con storico
- `weekly_focus` - Obiettivo settimanale + lock
- `tool_usage` - Tracking uso strumenti + limiti
- `virality_shares` - Condivisioni + guide sbloccate
- `user_progress` - Timeline eventi + celebrazioni
- `content_pool` - Welcome messages, affirmations, motivators, rinforzi

---

### 7. API ENDPOINTS
**File**: `server/src/routes/`

**Principali routes**:
- `POST /auth/signup` - Registrazione
- `POST /auth/login` - Login
- `GET /user/profile` - Profilo utente
- `POST /mood/select` - Salva mood giornaliero
- `GET /content/welcome` - Messaggio benvenuto random
- `GET /content/affirmations/:mood` - Affirmazioni per mood
- `POST /goals/global` - Crea/aggiorna obiettivi globali
- `POST /goals/weekly` - Imposta focus settimanale
- `POST /tools/:toolName/use` - Usa strumento (con rate limiting)
- `POST /virality/share` - Traccia condivisione
- `GET /virality/guides` - Lista guide sbloccate
- `POST /payments/create-checkout` - Stripe checkout
- `POST /payments/webhook` - Stripe webhook

---

### 8. CONFIGURAZIONI
**File**: `client/src/config/rdn.config.js`

**Costanti**:
```javascript
export const RDN_CONFIG = {
  colors: {
    primary: '#F59E0B',      // Oro vibrante
    secondary: '#78350F',    // Terra profondo
    background: '#FEF3C7',   // Ambra chiaro
    white: '#FFFFFF',
    red: '#DC2626',          // Emergenze
    green: '#10B981',        // Successi
    teal: '#14B8A6'          // Viralità
  },

  moods: {
    fragile: { emoji: '🌧️', label: 'Fragile' },
    incerto: { emoji: '🌫️', label: 'Incertə' },
    pronto: { emoji: '🔥', label: 'Prontə' }
  },

  levels: {
    1: { price: 9.90, currency: 'EUR', period: 'week' },
    2: { price: 19.90, currency: 'EUR', period: 'week' }
  },

  limits: {
    level1: {
      rinforzo: { daily: 1 },
      trasformatoreEmotivo: { daily: 5 },
      scudo: { daily: 5 },
      sos: { daily: 3 }
    },
    level2: {
      // Tutti illimitati eccetto rinforzo
      rinforzo: { daily: 1 }
    }
  },

  emergencyKeywords: [
    'suicidio', 'uccidermi', 'ammazzarmi', 'farla finita',
    'tagliarmi', 'autolesionismo', 'dissociazione',
    'violenza in atto', 'picchiare', 'aggredire'
  ],

  emergencyContacts: {
    emergency: '112',
    telefonoAmico: '800 86 00 22'
  }
}
```

---

## Stack Tecnologico Dettagliato

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool veloce
- **React Router v6** - Routing
- **TailwindCSS** - Styling utility-first
- **Framer Motion** - Animazioni fluide
- **React Query** - Data fetching e caching
- **Zustand** - State management leggero
- **React Hook Form** - Form validation
- **Day.js** - Date manipulation

### Backend
- **Node.js 18+** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database relazionale
- **Prisma** - ORM moderno
- **JWT** - Autenticazione
- **bcrypt** - Password hashing
- **Stripe** - Pagamenti
- **OpenAI API** - Generazione contenuti AI
- **NodeMailer** - Email transazionali
- **Redis** - Caching e rate limiting

### DevOps
- **Docker** - Containerizzazione
- **Docker Compose** - Orchestrazione locale
- **GitHub Actions** - CI/CD
- **Vercel** - Deploy frontend
- **Railway/Render** - Deploy backend
- **Supabase** - Database hosting (alternativa)

---

## Milestone Sviluppo

### FASE 1: Setup e Base (Sprint 1)
- ✅ Setup progetto Vite + TailwindCSS
- ✅ Setup backend Express + PostgreSQL
- ✅ Database schema e migrations
- ✅ Auth system (signup/login/JWT)
- ✅ RDN Context provider
- ✅ Routing 3 schermate
- ✅ Layout base (header/footer)

### FASE 2: Schermata 1 (Sprint 2)
- ✅ Welcome message rotante
- ✅ Mood selector + persistenza 24h
- ✅ Affermazioni adaptive
- ✅ Motivatore Dinamico completo
- ✅ Time/Energy selector
- ✅ Adaptive CTA

### FASE 3: Schermata 2 (Sprint 3)
- ✅ Personalized guidance
- ✅ Test Globale completo
- ✅ Progress Box + Timeline
- ✅ Test Settimanale + lock 7gg
- ✅ Weekly plan strumenti

### FASE 4: Strumenti L1 (Sprint 4-5)
- ✅ Rinforzo del Giorno
- ✅ Trasformatore Emotivo
- ✅ Scudo AntiAbuso
- ✅ SOS Situazioni Critiche + sistema emergenza

### FASE 5: Strumenti L2 (Sprint 6-7)
- ✅ Spada della Vittoria
- ✅ Trasformatore Avanzato
- ✅ Cosa Dire Fare Pensare
- ✅ Moduli Obiettivi (50 moduli)

### FASE 6: Sistema Viralità (Sprint 8)
- ✅ Virality modal
- ✅ Biblioteca Saggezza (30 guide)
- ✅ Share tracking
- ✅ Badge system

### FASE 7: Pagamenti e Deploy (Sprint 9)
- ✅ Integrazione Stripe
- ✅ Trial 7gg €1
- ✅ Upgrade L1→L2
- ✅ Deploy production

---

## Note Implementazione

### Persistenza Dati
- **localStorage**: Scelte temporanee (mood 24h, cache UI)
- **Database**: Tutti i dati permanenti (obiettivi, progressi, tracking)
- **Sync strategy**: Ottimistic updates + background sync

### Rate Limiting
- **Client-side**: Disabilita bottoni se limite raggiunto
- **Server-side**: Middleware verifica limiti da DB
- **Reset**: Automatico mezzanotte (cron job)

### Animazioni
- **Motivatore**: Sequenziale con delay calcolati
- **Affermazioni**: Fade-in con stagger
- **Progressi**: Pulse su nuove milestone
- **Lock 7gg**: Shake + modal se tentativo early change

### Sistema Emergenza
- **Pre-output check**: Analisi keywords prima generazione
- **Hard block**: Se keyword critica → blocco totale
- **Schermata rossa**: 112 + 800 86 00 22 prominent
- **No salvataggio**: Dati input NON salvati se emergenza

### AI Integration
- **Provider**: OpenAI GPT-4
- **Prompt system**: Template modulari per strumenti
- **Fallback**: Contenuti pre-generati se API down
- **Caching**: Response comuni cachate in Redis

---

## Prompt AI per Strumenti

Ogni strumento ha template prompt specifico che include:
- Contesto utente (mood, energia, tempo, livello)
- Tipo output richiesto
- Tone of voice RDN
- Limiti lunghezza
- Formattazione

**Ti chiederò i prompt specifici per ogni strumento quando necessario.**
