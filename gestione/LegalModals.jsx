// ===== GENERALI 4 di 5 LegalModals.jsx =====
// =========================================
// LegalModals.jsx - Modal Privacy Policy e Cookie Policy GDPR
// =========================================

// ===== COMPONENT: ModalLayout =====
const ModalLayout = memo(({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClick = (e) => {
      if (e.target === e.currentTarget) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position:'fixed', inset:0, zIndex:9999, backgroundColor:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }} role="dialog" aria-modal="true">
      <div style={{ backgroundColor:'white', maxWidth:'800px', maxHeight:'90vh', overflowY:'auto', borderRadius:'16px', padding:'40px 20px', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:'20px', right:'20px', fontSize:'24px', background:'none', border:'none', cursor:'pointer', color:'#6B7280', padding:'5px 10px' }} aria-label="Chiudi">✕</button>
        <h1 style={{ fontSize:'28px', fontWeight:'bold', marginBottom:'20px', color:'#1F2937' }}>{title}</h1>
        {children}
      </div>
    </div>
  );
});
ModalLayout.displayName = 'ModalLayout';

// ===== COMPONENT: PrivacyPolicyModal =====
const PrivacyPolicyModal = memo(({ isOpen, onClose }) => (
  <ModalLayout isOpen={isOpen} onClose={onClose} title="Privacy Policy">
    <div style={{ fontSize:'16px', lineHeight:1.6, color:'#374151' }}>
      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>1. Titolare del Trattamento</h2>
      <p><strong>Titolare:</strong> {RDN_CONFIG.company.owner}</p>
      <p><strong>Email:</strong> {RDN_CONFIG.company.email}</p>
      <p><strong>Indirizzo:</strong> {RDN_CONFIG.company.address}</p>
      <p><strong>NIE:</strong> {RDN_CONFIG.company.nie}</p>

      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>2. Dati Raccolti</h2>
      <p>Raccogliamo e trattiamo i seguenti dati personali:</p>
      <ul style={{ marginLeft:'20px', marginTop:'10px' }}>
        <li>Email e user_id</li>
        <li>Livello di abbonamento (subscription_level)</li>
        <li>Dati di utilizzo degli strumenti (tool usage, situazioni elaborate)</li>
        <li>Dati salvati in localStorage del browser</li>
      </ul>

      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>3. Finalità del Trattamento</h2>
      <p>I tuoi dati vengono trattati per:</p>
      <ul style={{ marginLeft:'20px', marginTop:'10px' }}>
        <li>Erogazione del servizio RDN e strumenti basati su IA</li>
        <li>Personalizzazione dell'esperienza utente</li>
        <li>Analisi statistiche aggregate (con consenso)</li>
        <li>Assistenza tecnica e supporto</li>
      </ul>

      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>4. Base Giuridica</h2>
      <p><strong>Contratto:</strong> Il trattamento è necessario per l'esecuzione del contratto ai sensi dell'art. 6(1)(b) GDPR.</p>
      <p><strong>Consenso:</strong> Per analytics utilizziamo Google Analytics solo previo consenso esplicito ai sensi dell'art. 6(1)(a) GDPR, revocabile in qualsiasi momento.</p>

      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>5. Conservazione dei Dati</h2>
      <ul style={{ marginLeft:'20px', marginTop:'10px' }}>
        <li><strong>Dati account:</strong> Conservati fino alla cancellazione dell'account</li>
        <li><strong>Dati utilizzo:</strong> 90 giorni per tracking varianti e milestone</li>
        <li><strong>Backup:</strong> 30 giorni per sicurezza sistema</li>
      </ul>

      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>6. Trasferimenti Internazionali</h2>
      <p>Utilizziamo RunPod (USA) per l'elaborazione IA. Il trasferimento è protetto da Standard Contractual Clauses (SCC) approvate dalla Commissione Europea ai sensi dell'art. 46 GDPR.</p>

      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>7. Diritti dell'Interessato</h2>
      <p>Ai sensi degli artt. 15-21 GDPR, hai diritto di:</p>
      <ul style={{ marginLeft:'20px', marginTop:'10px' }}>
        <li><strong>Accesso:</strong> Ottenere copia dei tuoi dati</li>
        <li><strong>Rettifica:</strong> Correggere dati inesatti</li>
        <li><strong>Cancellazione:</strong> Richiedere la cancellazione ("diritto all'oblio")</li>
        <li><strong>Limitazione:</strong> Limitare il trattamento</li>
        <li><strong>Portabilità:</strong> Ricevere dati in formato strutturato</li>
        <li><strong>Opposizione:</strong> Opporti al trattamento</li>
        <li><strong>Reclamo:</strong> Presentare reclamo al Garante Privacy</li>
      </ul>

      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>8. Esercizio dei Diritti</h2>
      <p>Per esercitare i tuoi diritti, invia email a <strong>{RDN_CONFIG.company.email}</strong> con oggetto "GDPR-[tipo richiesta]". Risponderemo entro 30 giorni.</p>

      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>9. Cookie</h2>
      <p><strong>Essenziali (sempre attivi):</strong></p>
      <ul style={{ marginLeft:'20px', marginTop:'10px' }}>
        <li>rdn_cookies_consent - Memorizza preferenze cookie</li>
        <li>rdn_user_* - Dati utente localStorage</li>
        <li>AM_USER - Gestione autenticazione aMember</li>
      </ul>
      <p style={{ marginTop:'10px' }}><strong>Opzionali (richiedono consenso):</strong></p>
      <ul style={{ marginLeft:'20px', marginTop:'10px' }}>
        <li>Google Analytics (_ga, _gid) - Durata 2 anni, IP anonimizzato</li>
      </ul>

      <p style={{ marginTop:'25px', fontSize:'14px', color:'#6B7280' }}>Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>
    </div>
  </ModalLayout>
));
PrivacyPolicyModal.displayName = 'PrivacyPolicyModal';

// ===== COMPONENT: CookiePolicyModal =====
const CookiePolicyModal = memo(({ isOpen, onClose }) => (
  <ModalLayout isOpen={isOpen} onClose={onClose} title="Cookie Policy">
    <div style={{ fontSize:'16px', lineHeight:1.6, color:'#374151' }}>
      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>1. Cosa sono i Cookie</h2>
      <p>I cookie sono piccoli file di testo che vengono memorizzati sul tuo browser quando visiti il nostro sito. Utilizziamo cookie per garantire il corretto funzionamento del servizio e, con il tuo consenso, per migliorare l'esperienza utente.</p>

      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>2. Cookie Essenziali (sempre attivi)</h2>
      <p>Questi cookie sono necessari per il funzionamento del sito e non possono essere disattivati:</p>
      <table style={{ width:'100%', marginTop:'15px', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ borderBottom:'2px solid #E5E7EB' }}>
            <th style={{ padding:'10px', textAlign:'left', fontWeight:'bold' }}>Nome</th>
            <th style={{ padding:'10px', textAlign:'left', fontWeight:'bold' }}>Funzione</th>
            <th style={{ padding:'10px', textAlign:'left', fontWeight:'bold' }}>Durata</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom:'1px solid #E5E7EB' }}>
            <td style={{ padding:'10px' }}>rdn_cookies_consent</td>
            <td style={{ padding:'10px' }}>Memorizza le tue preferenze sui cookie</td>
            <td style={{ padding:'10px' }}>1 anno</td>
          </tr>
          <tr style={{ borderBottom:'1px solid #E5E7EB' }}>
            <td style={{ padding:'10px' }}>rdn_user_*</td>
            <td style={{ padding:'10px' }}>Salva dati utente localStorage (mood, goal, onboarding)</td>
            <td style={{ padding:'10px' }}>Sessione</td>
          </tr>
          <tr style={{ borderBottom:'1px solid #E5E7EB' }}>
            <td style={{ padding:'10px' }}>AM_USER</td>
            <td style={{ padding:'10px' }}>Gestione autenticazione aMember</td>
            <td style={{ padding:'10px' }}>Sessione</td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>3. Cookie Analytics (opzionali)</h2>
      <p>Con il tuo consenso, utilizziamo Google Analytics per raccogliere statistiche aggregate sull'utilizzo del sito:</p>
      <ul style={{ marginLeft:'20px', marginTop:'10px' }}>
        <li><strong>_ga, _gid:</strong> Cookie Google Analytics per statistiche anonimizzate (durata: 2 anni, IP anonimizzato)</li>
        <li>Puoi revocare il consenso in qualsiasi momento dalle impostazioni cookie</li>
      </ul>

      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>4. Cookie NON Utilizzati</h2>
      <p>NON utilizziamo:</p>
      <ul style={{ marginLeft:'20px', marginTop:'10px' }}>
        <li>Cookie pubblicitari o di advertising</li>
        <li>Cookie di social media tracking</li>
        <li>Cookie di retargeting</li>
        <li>Cookie di profilazione</li>
      </ul>

      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>5. Gestione delle Preferenze</h2>
      <p>Puoi modificare le tue preferenze sui cookie in qualsiasi momento cliccando su "Gestisci preferenze cookie" nel footer del sito.</p>

      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>6. Disabilitazione Cookie dal Browser</h2>
      <p>Puoi disabilitare i cookie direttamente dal tuo browser:</p>
      <ul style={{ marginLeft:'20px', marginTop:'10px' }}>
        <li><strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie</li>
        <li><strong>Firefox:</strong> Opzioni → Privacy e sicurezza → Cookie e dati dei siti</li>
        <li><strong>Safari:</strong> Preferenze → Privacy → Blocca tutti i cookie</li>
      </ul>
      <p style={{ marginTop:'10px', fontStyle:'italic', color:'#6B7280' }}>Nota: La disabilitazione dei cookie essenziali potrebbe compromettere il funzionamento del sito.</p>

      <h2 style={{ fontSize:'20px', fontWeight:'bold', marginTop:'25px', marginBottom:'10px', color:'#1F2937' }}>7. Aggiornamenti</h2>
      <p>Questa Cookie Policy può essere aggiornata periodicamente. Le modifiche sostanziali verranno comunicate via email.</p>

      <p style={{ marginTop:'25px', fontSize:'14px', color:'#6B7280' }}>Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>
    </div>
  </ModalLayout>
));
CookiePolicyModal.displayName = 'CookiePolicyModal';

// ===== SEZIONE: DEFAULT EXPORT =====
const LegalModals = memo(({ type, onClose }) => {
  if (type === 'privacy') return <PrivacyPolicyModal isOpen={true} onClose={onClose} />;
  if (type === 'cookie') return <CookiePolicyModal isOpen={true} onClose={onClose} />;
  return null;
});

window.LegalModals = LegalModals;
