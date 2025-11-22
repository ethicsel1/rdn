// ===== GENERALI 2 di 5 components.js =====
// =========================================
// components.js - RDN UI React Components
// =========================================

// ===== COMPONENT: EmergencyScreen =====
const EmergencyScreen = memo(() => (
  <div style={{ position:'fixed', inset:0, zIndex:9999, backgroundColor:'#8B0000', color:'white', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px', textAlign:'center' }} role="alert" aria-live="assertive">
    <div style={{ fontSize:'80px', marginBottom:'20px' }}>🆘</div>
    <h1 style={{ fontSize:'32px', fontWeight:'bold', marginBottom:'20px' }}>Hai bisogno di aiuto immediato</h1>
    <p style={{ maxWidth:'600px', fontSize:'20px', marginBottom:'30px', lineHeight:1.5 }}>Se sei in pericolo immediato, contatta subito i servizi di emergenza. Non sei solo/a.</p>
    <div style={{ display:'flex', flexDirection:'column', gap:'15px', width:'100%', maxWidth:'400px' }}>
      <a href="tel:112" style={{ fontSize:'48px', padding:'20px', backgroundColor:'rgba(255,255,255,0.2)', border:'2px solid white', borderRadius:'10px', color:'white', textDecoration:'none', fontWeight:'bold' }}>📞 112 - Emergenza</a>
      <a href="tel:024" style={{ fontSize:'36px', padding:'20px', backgroundColor:'rgba(255,255,255,0.2)', border:'2px solid white', borderRadius:'10px', color:'white', textDecoration:'none', fontWeight:'bold' }}>💚 024 - Telefono Amico</a>
    </div>
    <p style={{ marginTop:'30px', fontSize:'16px', opacity:0.9 }}>Ricarica la pagina quando sei pronto/a a continuare</p>
  </div>
));
EmergencyScreen.displayName = 'EmergencyScreen';

// ===== COMPONENT: LoadingOverlay =====
const LoadingOverlay = memo(() => {
  const [msgIdx, setMsgIdx] = useState(0);
  const msgs = ['Preparando strumento...', 'Analizzando...', 'Quasi pronto...'];
  useEffect(() => {
    const i = setInterval(() => setMsgIdx(p => (p + 1) % msgs.length), 3000);
    return () => clearInterval(i);
  }, []);
  return (
    <div style={{ position:'fixed', inset:0, zIndex:9998, backgroundColor:'rgba(0,0,0,0.7)', backdropFilter:'blur(5px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }} role="status">
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:'60px', height:'60px', border:'4px solid rgba(255,255,255,0.3)', borderTop:'4px solid white', borderRadius:'50%', animation:'spin 1s linear infinite' }}></div>
      <p style={{ color:'white', fontSize:'18px', marginTop:'20px' }}>{msgs[msgIdx]}</p>
    </div>
  );
});
LoadingOverlay.displayName = 'LoadingOverlay';

// ===== COMPONENT: CookieBanner =====
const CookieBanner = memo(({ onAcceptAll, onEssentialOnly, onCustomize }) => (
  <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:9998, backgroundColor:'white', borderBottom:'3px solid #F59E0B', padding:'20px', boxShadow:'0 4px 6px rgba(0,0,0,0.1)' }}>
    <div style={{ maxWidth:'1200px', margin:'0 auto', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'15px' }}>
      <p style={{ flex:'1 1 300px', margin:0, fontSize:'14px' }}>Utilizziamo cookie per migliorare la tua esperienza. <a href="/privacy-policy" style={{ color:'#F59E0B', textDecoration:'underline' }}>Privacy Policy</a></p>
      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
        <button onClick={onAcceptAll} style={{ padding:'10px 20px', backgroundColor:'#F59E0B', color:'white', border:'none', borderRadius:'6px', fontWeight:'bold', cursor:'pointer', fontSize:'14px' }}>Accetta Tutto</button>
        <button onClick={onEssentialOnly} style={{ padding:'10px 20px', backgroundColor:'#6B7280', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'14px' }}>Solo Essenziali</button>
        <button onClick={onCustomize} style={{ padding:'10px 20px', backgroundColor:'white', color:'#374151', border:'2px solid #D1D5DB', borderRadius:'6px', cursor:'pointer', fontSize:'14px' }}>Personalizza</button>
      </div>
    </div>
  </div>
));
CookieBanner.displayName = 'CookieBanner';

// ===== COMPONENT: OnboardingOverlay =====
const OnboardingOverlay = memo(({ onComplete, userId }) => {
  const steps = [
    { title:'Benvenuto in RDN', desc:'Inizia il tuo percorso di riconnessione dopo il narcisismo.' },
    { title:'Strumenti Personalizzati', desc:'Accedi a tool basati su IA per supportare il tuo percorso.' },
    { title:'Crescita Continua', desc:'Monitora i tuoi progressi e celebra i traguardi raggiunti.' },
    { title:'Sei Pronto', desc:'Inizia ora il tuo viaggio verso la libertà emotiva.' }
  ];
  const [step, setStep] = useState(() => {
    try {
      return parseInt(localStorage.getItem(`rdn_user_${userId}_onboarding_step`) || '0', 10);
    } catch { return 0; }
  });
  useEffect(() => {
    try {
      localStorage.setItem(`rdn_user_${userId}_onboarding_step`, String(step));
    } catch {}
  }, [step, userId]);
  const handleComplete = () => {
    try {
      localStorage.setItem(`rdn_user_${userId}_onboarding_completed`, 'true');
    } catch {}
    onComplete?.();
  };
  return (
    <div style={{ position:'fixed', inset:0, zIndex:9000, background:'linear-gradient(135deg, #FEF3C7 0%, #FFFFFF 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ backgroundColor:'white', borderRadius:'20px', padding:'40px', maxWidth:'600px', width:'100%', boxShadow:'0 10px 25px rgba(0,0,0,0.1)' }}>
        <div style={{ display:'flex', gap:'10px', justifyContent:'center', marginBottom:'30px' }}>
          {steps.map((_, i) => <div key={i} style={{ width:'10px', height:'10px', borderRadius:'50%', backgroundColor: i === step ? '#F59E0B' : '#D1D5DB' }}></div>)}
        </div>
        <h2 style={{ fontSize:'28px', fontWeight:'bold', marginBottom:'15px', textAlign:'center', color:'#1F2937' }}>{steps[step].title}</h2>
        <p style={{ fontSize:'16px', color:'#6B7280', textAlign:'center', marginBottom:'30px', lineHeight:1.6 }}>{steps[step].desc}</p>
        <div style={{ display:'flex', gap:'10px', justifyContent:'space-between' }}>
          {step > 0 && <button onClick={() => setStep(step - 1)} style={{ padding:'12px 24px', backgroundColor:'#E5E7EB', color:'#374151', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'500' }}>Indietro</button>}
          {step < steps.length - 1 ? (
            <>
              <button onClick={() => setStep(step + 1)} style={{ padding:'12px 24px', backgroundColor:'#F59E0B', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', flex:1 }}>Avanti</button>
              <button onClick={handleComplete} style={{ padding:'12px 24px', backgroundColor:'transparent', color:'#6B7280', border:'none', cursor:'pointer' }}>Salta</button>
            </>
          ) : (
            <button onClick={handleComplete} style={{ padding:'12px 24px', backgroundColor:'#10B981', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', flex:1 }}>Inizia</button>
          )}
        </div>
      </div>
    </div>
  );
});
OnboardingOverlay.displayName = 'OnboardingOverlay';

// ===== COMPONENT: MaintenanceBanner =====
const MaintenanceBanner = memo(({ estimatedEnd, message }) => {
  const [countdown, setCountdown] = useState('');
  useEffect(() => {
    const calc = () => {
      try {
        const diff = new Date(estimatedEnd) - new Date();
        if (diff <= 0) {
          setCountdown('');
          return;
        }
        const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000);
        setCountdown(h > 0 ? `${h}h ${m}m` : `${m}m`);
      } catch {}
    };
    calc();
    const i = setInterval(calc, 60000);
    return () => clearInterval(i);
  }, [estimatedEnd]);
  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:9997, backgroundColor:'#FBBF24', padding:'15px', textAlign:'center', fontSize:'14px', fontWeight:'500', color:'#78350F' }}>
      🔧 {message}{countdown && ` - Tempo stimato: ${countdown}`}
    </div>
  );
});
MaintenanceBanner.displayName = 'MaintenanceBanner';

// ===== COMPONENT: RateLimitBanner =====
const RateLimitBanner = memo(({ current, max, sosRemaining, userLevel }) => (
  <div style={{ backgroundColor:'#FEE2E2', border:'2px solid #EF4444', borderRadius:'8px', padding:'15px', margin:'20px 0' }}>
    <div style={{ fontWeight:'bold', color:'#991B1B', marginBottom:'8px', fontSize:'16px' }}>⚠️ Limite giornaliero raggiunto</div>
    <p style={{ fontSize:'14px', color:'#7F1D1D', margin:'5px 0' }}>Hai utilizzato {current}/{max} richieste (Livello {userLevel})</p>
    {sosRemaining > 0 && <p style={{ fontSize:'14px', color:'#7F1D1D', margin:'5px 0' }}>SOS disponibili: {sosRemaining}</p>}
    <p style={{ fontSize:'12px', color:'#991B1B', marginTop:'10px', opacity:0.9 }}>
      {userLevel === 1 ? 'Passa al Livello 2 per più richieste giornaliere' : 'Reset alle 00:00 UTC'}
    </p>
  </div>
));
RateLimitBanner.displayName = 'RateLimitBanner';

// ===== COMPONENT: ErrorBoundary =====
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    try {
      fetch('/wp-json/rdn/v1/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.toString(),
          stack: error.stack,
          info: errorInfo,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {});
    } catch {}
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'400px', padding:'40px', textAlign:'center' }}>
          <div style={{ fontSize:'64px', marginBottom:'20px' }}>⚠️</div>
          <h1 style={{ fontSize:'24px', fontWeight:'bold', color:'#1F2937', marginBottom:'15px' }}>Qualcosa è andato storto</h1>
          <p style={{ color:'#6B7280', marginBottom:'30px', maxWidth:'500px' }}>Si è verificato un errore imprevisto. Puoi ricaricare la pagina o tornare alla home.</p>
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={() => window.location.reload()} style={{ padding:'12px 24px', backgroundColor:'#F59E0B', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' }}>Ricarica Pagina</button>
            <button onClick={() => window.location.href = '/'} style={{ padding:'12px 24px', backgroundColor:'#6B7280', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' }}>Vai alla Home</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
ErrorBoundary.displayName = 'ErrorBoundary';

// Esporta su window per uso globale
window.EmergencyScreen = EmergencyScreen;
window.LoadingOverlay = LoadingOverlay;
window.CookieBanner = CookieBanner;
window.OnboardingOverlay = OnboardingOverlay;
window.MaintenanceBanner = MaintenanceBanner;
window.RateLimitBanner = RateLimitBanner;
window.ErrorBoundary = ErrorBoundary;
