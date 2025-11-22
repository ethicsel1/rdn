// Schermata1Benvenuto.jsx - VERSIONE CORRETTA

// Helper: Verifica se la data è oggi
const isToday = (timestamp) => {
  if (!timestamp) return false;
  const today = new Date().setHours(0, 0, 0, 0);
  const savedDate = new Date(timestamp).setHours(0, 0, 0, 0);
  return today === savedDate;
};

// Helper: Seleziona elemento random evitando l'ultimo
const getRandomItem = (array, lastIndex) => {
  if (!array || array.length === 0) return null;
  if (array.length === 1) return { item: array[0], index: 0 };
  
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * array.length);
  } while (newIndex === lastIndex && array.length > 1);
  
  return { item: array[newIndex], index: newIndex };
};

// Helper: Seleziona N elementi random da array
const getRandomItems = (array, count) => {
  if (!array || array.length === 0) return [];
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
};

const Schermata1Benvenuto = ({ onNavigate }) => {
  // Context e verifica livello accesso
  const { user_level, callAI, rdn_today_mood } = useRDN();
  
  // Stati localStorage
  const [todaySelection, setTodaySelection] = useUserStorage('rdn_today_selection', {
    mood: null,
    time: null,
    energy: null,
    timestamp: null
  });
  const [lastWelcomeIndex, setLastWelcomeIndex] = useUserStorage('rdn_last_welcome_index', null);
  const [gdprConsent, setGdprConsent] = useUserStorage('rdn_gdpr_consent', false);
  const [viralityData, setViralityData] = useUserStorage('rdn_virality_data', null);

  // Stati locali
  const [dataLoaded, setDataLoaded] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [welcomeEmoji, setWelcomeEmoji] = useState('');
  const [affirmations, setAffirmations] = useState([]);
  const [showAffirmations, setShowAffirmations] = useState(false);
  const [showMotivator, setShowMotivator] = useState(false);
  const [isSelectionComplete, setIsSelectionComplete] = useState(false);

  // Verifica accesso livello
  const required_level = 1;
  if (user_level < required_level) {
    return (
      <div className="min-h-screen bg-[#FEF3C7] flex items-center justify-center p-5">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-[#78350F] mb-4">Accesso Richiesto</h2>
          <p className="text-[#92400E] mb-6">Devi essere iscritto a RDN - Livello 1 per accedere a questa schermata.</p>
        </div>
      </div>
    );
  }

  // Effect: Carica dati window.RDN.data
  useEffect(() => {
    const checkData = () => {
      if (window.RDN?.data) {
        setDataLoaded(true);
      } else {
        setTimeout(checkData, 100);
      }
    };
    checkData();
  }, []);

  // Effect: Reset mezzanotte
  useEffect(() => {
    const checkMidnight = () => {
      if (todaySelection.timestamp && !isToday(todaySelection.timestamp)) {
        setTodaySelection({
          mood: null,
          time: null,
          energy: null,
          timestamp: null
        });
        setShowAffirmations(false);
        setShowMotivator(false);
      }
    };

    checkMidnight();
    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, [todaySelection.timestamp]);

  // Effect: Genera benvenuto iniziale
  useEffect(() => {
    if (dataLoaded && window.RDN?.data?.welcome_messages) {
      generateWelcomeMessage();
    }
  }, [dataLoaded]);

  // Effect: Mostra affermazioni e motivatore se mood già selezionato
  useEffect(() => {
    if (todaySelection.mood && isToday(todaySelection.timestamp)) {
      loadAffirmations(todaySelection.mood);
      setShowAffirmations(true);
      setShowMotivator(true);
    }
  }, [todaySelection.mood, dataLoaded]);

  // Effect: Verifica selezione completa
  useEffect(() => {
    const complete = todaySelection.mood && todaySelection.time && todaySelection.energy;
    setIsSelectionComplete(complete);
  }, [todaySelection]);

  // Genera messaggio benvenuto
  const generateWelcomeMessage = () => {
    if (!window.RDN?.data?.welcome_messages) return;
    
    const emojis = ['🌱', '💫', '🛡️', '🌿', '✨', '🔥', '🌅'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const { item, index } = getRandomItem(
      window.RDN.data.welcome_messages,
      lastWelcomeIndex
    );
    
    setWelcomeEmoji(randomEmoji);
    setWelcomeMessage(item);
    setLastWelcomeIndex(index);
  };

  // Carica affermazioni per mood
  const loadAffirmations = (mood) => {
    if (!window.RDN?.data?.affirmations || !window.RDN?.data?.affirmations[mood]) return;
    
    const selectedAffirmations = getRandomItems(
      window.RDN.data.affirmations[mood],
      3
    );
    setAffirmations(selectedAffirmations);
  };

  // Handler selezione mood
  const handleMoodSelection = (mood) => {
    if (!gdprConsent) {
      setGdprConsent(true);
    }

    const newSelection = {
      ...todaySelection,
      mood,
      timestamp: new Date().toISOString()
    };
    setTodaySelection(newSelection);
    
    loadAffirmations(mood);
    setShowAffirmations(true);
    
    setTimeout(() => {
      setShowMotivator(true);
    }, 1200);
  };

  // Handler selezione tempo
  const handleTimeSelection = (time) => {
    setTodaySelection({
      ...todaySelection,
      time
    });
  };

  // Handler selezione energia
  const handleEnergySelection = (energy) => {
    setTodaySelection({
      ...todaySelection,
      energy
    });
  };

  // Handler navigazione
  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate('schermata2', todaySelection);
    }
  };

  // Handler navigazione diretta a strumenti
  const handleSkipToTools = () => {
    if (onNavigate) {
      onNavigate('schermata3', todaySelection);
    }
  };

  // Handler navigazione SOS
  const handleSOSClick = () => {
    if (onNavigate) {
      onNavigate('sos');
    }
  };

  // Testo adattivo CTA
  const getAdaptiveCTA = () => {
    switch (todaySelection.mood) {
      case 'fragile':
        return 'Sì, Oggi Voglio Accogliermi';
      case 'incerto':
        return 'Sì, Oggi Voglio Fare Chiarezza';
      case 'pronto':
        return 'Sì, Voglio Fare il Mio Passo di Oggi';
      default:
        return 'Inizia il Tuo Percorso Oggi';
    }
  };

  // Frase adattiva
  const getAdaptivePhrase = () => {
    switch (todaySelection.mood) {
      case 'fragile':
        return 'Oggi ti accompagno con delicatezza';
      case 'incerto':
        return 'Oggi esploriamo insieme con calma';
      case 'pronto':
        return 'Oggi costruiamo con energia';
      default:
        return '';
    }
  };

  // Loading state
  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-[#FEF3C7] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F59E0B]"></div>
          <p className="mt-4 text-[#78350F] text-lg">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEF3C7] pb-10">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .fade-in { animation: fadeIn 1s ease-out; }
          .slide-in { animation: slideIn 2s ease-out; }
          .pulse-animate { animation: pulse 2s infinite; }
          .affirmation-delay-1 { animation-delay: 0.3s; }
          .affirmation-delay-2 { animation-delay: 0.6s; }
          .affirmation-delay-3 { animation-delay: 0.9s; }
        `}
      </style>

      <div className="max-w-[600px] mx-auto px-5 py-8">
        <header className="text-center mb-8" role="banner">
          <h1 className="text-[32px] font-bold text-[#78350F] leading-tight">
            RDN – Rinascita Definitiva dai Narcisisti
          </h1>
          <p className="text-[20px] text-[#F59E0B] mt-3 fade-in" style={{ animationDelay: '0.5s' }}>
            Qui non si sopravvive. Qui si rinasce
          </p>
          <p className="text-[16px] text-[#92400E] mt-2 slide-in" style={{ animationDelay: '1s' }}>
            Ecosistema di crescita personale ed empowerment per chi ha vissuto relazioni con narcisisti
          </p>
        </header>

        <div className="bg-[#FEF3C7] p-5 rounded-lg border-l-4 border-[#F59E0B] mb-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-[18px] font-bold text-[#78350F] mb-3 text-center">
            Il Tuo Impatto 💙
          </h2>
          <BadgeProgress />
        </div>

        <div className="bg-white p-5 rounded-lg border-t-4 border-[#F59E0B] mt-8 fade-in">
          <p className="text-[18px] text-[#78350F] text-center leading-relaxed">
            <span className="text-2xl mr-2" role="img" aria-label="emoji">{welcomeEmoji}</span>
            {welcomeMessage}
          </p>
          <button
            onClick={generateWelcomeMessage}
            className="mt-3 mx-auto block px-5 py-2.5 bg-[#F59E0B] text-white rounded-md text-[14px] font-medium hover:bg-[#D97706] transition-colors duration-200"
            aria-label="Genera nuovo messaggio di benvenuto"
          >
            🔄 Nuovo messaggio
          </button>
        </div>

        <div className="bg-[#FEE2E2] border-l-[5px] border-[#EF4444] p-5 rounded-lg mt-5 mb-5">
          <p className="text-[18px] font-bold text-[#991B1B] mb-3">
            🚨 Sei in crisi ora?
          </p>
          <button
            onClick={handleSOSClick}
            className="w-full px-7 py-3.5 bg-[#EF4444] text-white rounded-lg font-bold hover:bg-[#DC2626] transition-colors duration-200 pulse-animate"
            aria-label="Accedi a SOS Immediato"
          >
            Vai a SOS Immediato
          </button>
          <p className="text-[12px] text-[#991B1B] opacity-80 mt-2 text-center">
            Per crisi crescita personale. Emergenze mediche → 112/118
          </p>
        </div>

        {!gdprConsent && (
          <div className="bg-[rgba(245,158,11,0.05)] p-2.5 rounded-md mb-5">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={false}
                onChange={() => {}}
                className="mt-1 w-4 h-4 accent-[#F59E0B]"
                aria-label="Consenso salvataggio preferenze"
              />
              <span className="text-[12px] italic text-[#92400E]">
                ☑️ Acconsento salvataggio preferenze (dati criptati). 
                <a href="/privacy" className="underline hover:text-[#14B8A6] ml-1">Privacy →</a>
              </span>
            </label>
          </div>
        )}

        <div className="bg-white border-t-4 border-[#F59E0B] p-6 rounded-lg mt-8">
          <p className="text-[14px] text-[#92400E] mb-4">
            Per personalizzare la tua esperienza oggi
          </p>
          <h2 className="text-[20px] font-bold text-[#78350F] mb-5">
            Oggi mi sento…
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { id: 'fragile', label: 'Fragile 🌧️' },
              { id: 'incerto', label: 'Incertə 🌫️' },
              { id: 'pronto', label: 'Prontə 🔥' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => handleMoodSelection(option.id)}
                className={`w-full p-4 rounded-lg text-[16px] font-semibold transition-all duration-200 ${
                  todaySelection.mood === option.id
                    ? 'bg-[#FDE68A] border-2 border-[#F59E0B]'
                    : 'bg-[#F9FAFB] border-2 border-[#F59E0B] hover:bg-[#FDE68A] hover:-translate-y-0.5 hover:shadow-md'
                }`}
                aria-label={`Seleziona stato emotivo: ${option.label}`}
                aria-pressed={todaySelection.mood === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {showAffirmations && affirmations.length > 0 && (
          <div className="mt-6 space-y-3">
            {affirmations.map((affirmation, index) => (
              <div
                key={index}
                className={`text-[16px] leading-relaxed text-[#78350F] text-center p-4 bg-[rgba(245,158,11,0.1)] rounded-md fade-in affirmation-delay-${index + 1}`}
                style={{ opacity: 0, animationFillMode: 'forwards' }}
              >
                {affirmation}
              </div>
            ))}
          </div>
        )}

        {showMotivator && todaySelection.mood && (
          <div className="mt-6">
            <MotivatoreDinamico mood={todaySelection.mood} />
          </div>
        )}

        {showMotivator && (
          <div className="bg-[#F9FAFB] p-5 rounded-lg mt-8">
            <h3 className="text-[18px] font-bold text-[#78350F] mb-4">
              ⏱️ Oggi ho…
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {[
                { id: '5-10', label: '5-10 min' },
                { id: '15-30', label: '15-30 min' },
                { id: '45+', label: '45+ min' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleTimeSelection(option.id)}
                  className={`flex-1 min-w-[100px] px-5 py-3 rounded-md text-[14px] font-medium transition-all duration-200 ${
                    todaySelection.time === option.id
                      ? 'bg-[#FDE68A] border-2 border-[#F59E0B]'
                      : 'bg-white border-2 border-[#D1D5DB] hover:border-[#F59E0B] hover:bg-[#FEF3C7]'
                  }`}
                  aria-label={`Seleziona tempo disponibile: ${option.label}`}
                  aria-pressed={todaySelection.time === option.id}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {showMotivator && todaySelection.time && (
          <div className="bg-[#F9FAFB] p-5 rounded-lg mt-5">
            <h3 className="text-[18px] font-bold text-[#78350F] mb-4">
              🔋 Oggi sento…
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {[
                { id: 'bassa', label: 'Bassa 💧' },
                { id: 'media', label: 'Media 🔥' },
                { id: 'alta', label: 'Alta ⚡' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleEnergySelection(option.id)}
                  className={`flex-1 min-w-[100px] px-6 py-3 rounded-md text-[14px] font-medium transition-all duration-200 ${
                    todaySelection.energy === option.id
                      ? 'bg-[#FDE68A] border-2 border-[#F59E0B]'
                      : 'bg-white border-2 border-[#D1D5DB] hover:border-[#F59E0B] hover:bg-[#FEF3C7]'
                  }`}
                  aria-label={`Seleziona energia disponibile: ${option.label}`}
                  aria-pressed={todaySelection.energy === option.id}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {isSelectionComplete && (
          <div className="mt-6 fade-in">
            <p className="text-[16px] text-[#92400E] text-center mb-4">
              {getAdaptivePhrase()}
            </p>
            <button
              onClick={handleNavigate}
              className="w-full px-9 py-4.5 bg-[#F59E0B] text-white rounded-lg text-[18px] font-bold shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:bg-[#D97706] hover:-translate-y-0.5 transition-all duration-200 pulse-animate"
              aria-label="Procedi alla schermata successiva"
            >
              {getAdaptiveCTA()}
            </button>
            <button
              onClick={handleSkipToTools}
              className="block mx-auto mt-4 text-[14px] text-[#92400E] underline hover:text-[#78350F] transition-colors duration-200"
              aria-label="Salta personalizzazione e vai direttamente agli strumenti"
            >
              Salta personalizzazione →
            </button>
          </div>
        )}

        <footer
          className="bg-white p-4 rounded-lg border-t border-[#E5E7EB] mt-10"
          role="contentinfo"
        >
          <p className="text-[13px] text-[#6B7280] leading-relaxed">
            ℹ️ RDN è un ecosistema di crescita personale. Per supporto clinico rivolgiti a professionisti. 
            Emergenze → 112/118/Telefono Amico 800 86 00 22.
          </p>
          <div className="flex gap-4 mt-2 justify-center">
            <a href="/privacy" className="text-[13px] text-[#6B7280] underline hover:text-[#14B8A6] transition-colors">Privacy</a>
            <a href="/termini" className="text-[13px] text-[#6B7280] underline hover:text-[#14B8A6] transition-colors">Termini</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

window.Schermata1 = Schermata1Benvenuto;

