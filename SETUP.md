# RDN - Rinascita Definitiva dai Narcisisti

## Setup Progetto

### Prerequisiti
- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Struttura Progetto
```
rdn/
├── client/          # Frontend React + Vite
├── server/          # Backend Express + Prisma
└── README.md        # Documentazione progetto
```

## Installazione

### 1. Frontend (Client)
```bash
cd client
npm install
```

### 2. Backend (Server)
```bash
cd server
npm install
```

### 3. Database Setup

1. Crea database PostgreSQL:
```sql
CREATE DATABASE rdn;
```

2. Configura `.env` in `server/`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/rdn?schema=public"
JWT_SECRET="your-secret-key"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

3. Genera Prisma Client e esegui migrazioni:
```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```

## Avvio Sviluppo

### Terminal 1 - Backend
```bash
cd server
npm run dev
```
Server: http://localhost:5000

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```
Frontend: http://localhost:5173

## API Endpoints

### Auth
- `POST /api/auth/register` - Registrazione utente
- `POST /api/auth/login` - Login utente
- `GET /api/auth/me` - Profilo utente (protetto)

### Health Check
- `GET /api/health` - Stato server

## Stack Tecnologico

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router v6
- Framer Motion
- React Query
- Zustand

### Backend
- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT
- bcryptjs

## Palette Colori RDN

- Primary: #F59E0B (Oro vibrante)
- Secondary: #78350F (Terra profondo)
- Background: #FEF3C7 (Ambra chiaro)
- Red: #DC2626 (Emergenze)
- Green: #10B981 (Successi)
- Teal: #14B8A6 (Viralità)
