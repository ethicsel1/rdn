// Schermata3Strumenti.jsx - VERSIONE CORRETTA

// Helper: Verifica se lock attivo (<7 giorni)
const isLockActive = (timestamp) => {
  if (!timestamp) return false;
  const now = new Date();
  const locked = new Date(timestamp);
  const diffDays = (now - locked) / (1000 * 60 * 60 * 24);
  return diffDays < 7;
};

// Helper: Giorni rimanenti lock
const daysRemainingLock = (timestamp) => {
  if (!timestamp) return 0;
  const now = new Date();
  const locked = new Date(timestamp);
  const expiryDate = new Date(locked.getTime() + 7 * 24 * 60 * 60 * 1000);
  const diffMs = expiryDate - now;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours };
};

// Helper: Giorni iscrizione
const getDaysSinceRegistration = () => {
  const registration = localStorage.getItem('rdn_registration_date');
  if (!registration) return 0;
  const now = new Date();
  const regDate = new Date(registration);
  return Math.floor((now - regDate) / (1000 * 60 * 60 * 24));
};

const Schermata3Strumenti = ({ onNavigate }) => {
  const { user_level, callAI, todayMood, todaySelection, currentWeekGoal } = useRDN();
  
  const [toolUsage, setToolUsage] = useUserStorage('rdn_tool_usage', {});
  const [bannerDismissed, setBannerDismissed] = useUserStorage('rdn_banner_dismissed', null);
  const [rinforzoUsedToday, setRinforzoUsedToday] = useUserStorage('rdn_rinforzo_today', null);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [activeToolModal, setActiveToolModal] = useState(null);
  const [lockCountdown, setLockCountdown] = useState({ days: 0, hours: 0 });
  const [showBanner, setShowBanner] = useState(false);
  const [sessionUsage, setSessionUsage] = useState([]);

  const required_level = 1;
  if (!user_level || user_level < required_level) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-5">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-[#78350F] mb-4">Accesso Richiesto</h2>
          <p className="text-[#92400E]">Devi essere iscritto a RDN - Livello 1 per accedere.</p>
        </div>
      </div>
    );
  }

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

  useEffect(() => {
    if (currentWeekGoal && currentWeekGoal.timestamp && isLockActive(currentWeekGoal.timestamp)) {
      const updateCountdown = () => {
        setLockCountdown(daysRemainingLock(currentWeekGoal.timestamp));
      };
      updateCountdown();
      const interval = setInterval(updateCountdown, 60000);
      return () => clearInterval(interval);
    }
  }, [currentWeekGoal]);

  useEffect(() => {
    if (user_level >= 2) return;
    
    const daysSince = getDaysSinceRegistration();
    const totalUses = Object.values(toolUsage).reduce((sum, count) => sum + count, 0);
    const dismissed = bannerDismissed ? new Date(bannerDismissed) : null;
    const now = new Date();
    
    const shouldShow = (daysSince >= 7 || totalUses >= 10) && 
                       (!dismissed || (now - dismissed) > 7 * 24 * 60 * 60 * 1000);
    
    setShowBanner(shouldShow);
  }, [user_level, toolUsage, bannerDismissed]);

  useEffect(() => {
    const toolCounts = {};
    sessionUsage.forEach(use => {
      toolCounts[use.tool_name] = (toolCounts[use.tool_name] || 0) + 1;
    });
    
    Object.entries(toolCounts).forEach(([tool, count]) => {
      if (count === 5) {
        showCelebrationTooltip(`💡 Stai lavorando molto su ${tool}. Ottimo lavoro!`);
      }
    });
  }, [sessionUsage]);

  const handleToolUse = (toolName) => {
    if (user_level < 2) {
      const dailyLimits = {
        'Trasformatore Emotivo': 5,
        'Scudo AntiAbuso': 5,
        'SOS Situazioni Critiche': 3
      };
      
      const todayCount = sessionUsage.filter(u => 
        u.tool_name === toolName && isToday(u.timestamp)
      ).length;
      
      if (dailyLimits[toolName] && todayCount >= dailyLimits[toolName]) {
        alert(`Limite giornaliero raggiunto per ${toolName}. Upgrade a Livello 2 per uso illimitato.`);
        return;
      }
    }

    if (toolName === 'Rinforzo del Giorno') {
      if (rinforzoUsedToday && isToday(rinforzoUsedToday)) {
        alert('Rinforzo già utilizzato oggi. Torna domani per il nuovo contenuto.');
        return;
      }
    }

    const usage = {
      tool_name: toolName,
      timestamp: new Date().toISOString(),
      mood: todaySelection?.mood,
      energia: todaySelection?.energy,
      tempo: todaySelection?.time
    };
    
    setSessionUsage([...sessionUsage, usage]);
    setToolUsage({
      ...toolUsage,
      [toolName]: (toolUsage[toolName] || 0) + 1
    });

    if (toolName === 'Rinforzo del Giorno') {
      setRinforzoUsedToday(new Date().toISOString());
    }

    setActiveToolModal(toolName);
  };

  const handleChangeGoal = () => {
    if (currentWeekGoal && isLockActive(currentWeekGoal.timestamp)) {
      setShowLockModal(true);
    } else {
      navigateToTest();
    }
  };

  const handleOverrideLock = () => {
    setShowLockModal(false);
    navigateToTest();
    setTimeout(() => {
      showToast('Obiettivo cambiato. Nuovo lock 7 giorni attivo', 3000);
    }, 500);
  };

  const handleDismissBanner = () => {
    setBannerDismissed(new Date().toISOString());
    setShowBanner(false);
  };

  const navigateToTest = () => {
    if (onNavigate) {
      onNavigate('schermata2');
    }
  };

  const showToast = (message, duration = 3000) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-5 right-5 bg-[#F59E0B] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-fade-out');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  const showCelebrationTooltip = (message) => {
    const tooltip = document.createElement('div');
    tooltip.className = 'fixed top-20 right-5 bg-[#10B981] text-white px-5 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    tooltip.textContent = message;
    document.body.appendChild(tooltip);
    setTimeout(() => tooltip.remove(), 5000);
  };

  const getRecommendedTool = () => {
    if (!todaySelection) return null;
    
    const { mood, time, energy } = todaySelection;
    
    if (mood === 'fragile') {
      if (time === '5-10') return 'Rinforzo del Giorno';
      return 'Trasformatore Emotivo';
    }
    
    if (mood === 'incerto') {
      if (time === '5-10') return 'Scudo AntiAbuso';
      return 'Trasformatore Emotivo';
    }
    
    if (mood === 'pronto') {
      if (energy === 'alta' && user_level >= 2 && time === '45+') {
        return 'Trasformatore Emotivo Avanzato';
      }
      return user_level >= 2 ? 'Cosa Dire, Fare, Pensare' : 'Trasformatore Emotivo';
    }
    
    return 'Rinforzo del Giorno';
  };

  const getMoodSubtitle = () => {
    const mood = todaySelection?.mood || 'pronto';
    const subtitles = {
      fragile: 'Oggi scegli solo ciò che ti fa stare meglio',
      incerto: 'Esplora con calma, senza pressione',
      pronto: 'Oggi puoi fare passi concreti'
    };
    return subtitles[mood];
  };

  const getRemainingUses = (toolName, limit) => {
    if (user_level >= 2) return 'Illimitato';
    const todayCount = sessionUsage.filter(u => 
      u.tool_name === toolName && isToday(u.timestamp)
    ).length;
    return `${Math.max(0, limit - todayCount)} rimasti oggi`;
  };

  const daysSince = getDaysSinceRegistration();
  const recommendedTool = getRecommendedTool();

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F59E0B]"></div>
          <p className="mt-4 text-[#78350F] text-lg">Caricamento strumenti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-10">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .animate-fade-in { animation: fadeIn 0.3s ease-out; }
          .animate-fade-out { animation: fadeOut 0.3s ease-out; }
          .animate-bounce { animation: bounce 2s infinite; }
          .animate-pulse { animation: pulse 2s infinite; }
        `}
      </style>

      <div className="max-w-[1000px] mx-auto px-6 py-6">
        
        <nav className="text-[12px] text-[#6B7280] mb-4">
          <a href="/" className="hover:text-[#F59E0B] underline">Home</a>
          <span className="mx-2">→</span>
          <a href="/obiettivi" className="hover:text-[#F59E0B] underline">Obiettivi</a>
          <span className="mx-2">→</span>
          <span className="text-[#78350F] font-medium">Strumenti</span>
        </nav>

        <div className="sticky top-0 z-10 bg-[#FEF3C7] border-b-2 border-[#F59E0B] p-4 rounded-md mb-6 shadow-sm">
          {currentWeekGoal && isLockActive(currentWeekGoal.timestamp) ? (
            <div className="text-[14px] text-[#78350F] leading-relaxed">
              <strong>📋 IL TUO PIANO OGGI</strong> | 
              Basato su: {todaySelection?.mood || 'Pronto'} + {todaySelection?.time || '15-30 min'} + Energia {todaySelection?.energy || 'media'}
              {recommendedTool && ` | ✅ ${recommendedTool}: ${currentWeekGoal.title}`}
              <div className="flex gap-2 mt-2">
                <button className="px-3 py-1 bg-white border border-[#F59E0B] text-[#78350F] rounded text-[12px] hover:bg-[#FDE68A]">
                  Modifica piano
                </button>
                <button className="px-3 py-1 bg-[#10B981] text-white rounded text-[12px] hover:bg-[#059669]">
                  Fatto per oggi
                </button>
              </div>
            </div>
          ) : currentWeekGoal ? (
            <div className="text-center">
              <p className="text-[14px] text-[#78350F] font-bold mb-2">
                🎯 NUOVO OBIETTIVO SETTIMANALE DISPONIBILE
              </p>
              <p className="text-[13px] text-[#92400E] mb-3">
                Hai completato {currentWeekGoal.title}. Scegli nuovo focus!
              </p>
              <button
                onClick={navigateToTest}
                className="px-5 py-2 bg-[#F59E0B] text-white rounded-md text-[13px] font-medium hover:bg-[#D97706]"
              >
                FAI TEST SETTIMANALE
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-[14px] text-[#78350F] font-bold mb-2">
                📋 SCEGLI IL TUO FOCUS SETTIMANALE
              </p>
              <p className="text-[13px] text-[#92400E] mb-3">
                Personalizza piano basato su priorità
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={navigateToTest}
                  className="px-5 py-2 bg-[#F59E0B] text-white rounded-md text-[13px] font-medium hover:bg-[#D97706]"
                >
                  FAI TEST SETTIMANALE
                </button>
                <button className="px-5 py-2 bg-white border border-[#F59E0B] text-[#78350F] rounded-md text-[13px] hover:bg-[#FDE68A]">
                  SCEGLI MANUALMENTE
                </button>
              </div>
            </div>
          )}
        </div>

        <header className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-[#78350F] mb-3">
            I Tuoi Strumenti di Rinascita
          </h1>
          <p className="text-[16px] text-[#92400E]">
            {getMoodSubtitle()}
          </p>
        </header>

        {showBanner && user_level < 2 && (
          <div className="sticky top-20 z-[9] bg-gradient-to-br from-[#78350F] to-[#92400E] text-white p-5 rounded-xl mb-8 shadow-[0_6px_20px_rgba(120,53,15,0.4)] relative">
            <button
              onClick={handleDismissBanner}
              className="absolute top-4 right-4 text-white text-xl hover:opacity-80"
              aria-label="Chiudi banner"
            >
              ✕
            </button>
            <h3 className="text-[18px] font-bold mb-2">💎 Sblocca il Tuo Potenziale Completo</h3>
            <p className="text-[14px] mb-3">
              Accedi a strumenti avanzati, obiettivi guidati, percorso strutturato per trasformazione profonda
            </p>
            <ul className="text-[13px] leading-loose mb-4 space-y-1">
              <li>✓ Utilizzo illimitato tutti strumenti</li>
              <li>✓ Trasformatore Avanzato 15-20 min</li>
              <li>✓ Cosa Dire Fare Pensare approfondito</li>
              <li>✓ 50 Moduli Obiettivi</li>
              <li>✓ 300 Moduli Percorso Sequenziale</li>
              <li>✓ Tracciamento progressi avanzato</li>
            </ul>
            <button className="px-7 py-3 bg-[#F59E0B] text-white rounded-lg font-bold hover:bg-[#FBBF24] shadow-lg">
              Scopri Livello 2 →
            </button>
          </div>
        )}

        <section className="mb-10">
          <h2 className="text-[20px] font-bold text-[#78350F] mb-5">Strumenti di Base</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div
              onClick={() => handleToolUse('Rinforzo del Giorno')}
              className="bg-[#FEF3C7] border-l-[5px] border-[#F59E0B] p-5 rounded-lg cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 relative"
            >
              <span className="text-[32px] absolute top-4 left-4">💛</span>
              <div className="ml-12">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[18px] font-bold text-[#78350F]">Rinforzo del Giorno</h3>
                  <span className={`px-2 py-1 rounded text-[11px] font-medium ${
                    rinforzoUsedToday && isToday(rinforzoUsedToday)
                      ? 'bg-[#6B7280] text-white'
                      : 'bg-[#10B981] text-white'
                  }`}>
                    {rinforzoUsedToday && isToday(rinforzoUsedToday) ? 'Torna domani' : 'Disponibile oggi'}
                  </span>
                </div>
                <p className="text-[14px] text-[#92400E]">
                  Il tuo momento quotidiano di forza e validazione. 3-5 min
                </p>
              </div>
            </div>

            <div
              onClick={() => handleToolUse('Trasformatore Emotivo')}
              className="bg-[#FEF3C7] border-l-[5px] border-[#F59E0B] p-5 rounded-lg cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 relative"
            >
              <span className="text-[32px] absolute top-4 left-4">🔄</span>
              <div className="ml-12">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[18px] font-bold text-[#78350F]">Trasformatore Emotivo</h3>
                  <span className="px-2 py-1 bg-[#F59E0B] text-white rounded text-[11px] font-medium">
                    {getRemainingUses('Trasformatore Emotivo', 5)}
                  </span>
                </div>
                <p className="text-[14px] text-[#92400E]">
                  Liberati da emozioni pesanti o attiva forze interiori. 5-10 min
                </p>
              </div>
            </div>

            <div
              onClick={() => handleToolUse('Scudo AntiAbuso')}
              className="bg-[#FEF3C7] border-l-[5px] border-[#F59E0B] p-5 rounded-lg cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 relative"
            >
              <span className="text-[32px] absolute top-4 left-4">🛡️</span>
              <div className="ml-12">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[18px] font-bold text-[#78350F]">Scudo AntiAbuso</h3>
                  <span className="px-2 py-1 bg-[#F59E0B] text-white rounded text-[11px] font-medium">
                    {getRemainingUses('Scudo AntiAbuso', 5)}
                  </span>
                </div>
                <p className="text-[14px] text-[#92400E]">
                  Chiarezza immediata per situazioni tossiche appena vissute. 1-2 min
                </p>
              </div>
            </div>

            <div
              onClick={() => handleToolUse('SOS Situazioni Critiche')}
              className="bg-[#FEF3C7] border-l-[5px] border-[#F59E0B] border-r-4 border-r-[#DC2626] p-5 rounded-lg cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 relative"
            >
              <span className="text-[32px] absolute top-4 left-4">🚨</span>
              <div className="ml-12">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[18px] font-bold text-[#DC2626]">S.O.S. Situazioni Critiche</h3>
                  <span className="px-2 py-1 bg-[#DC2626] text-white rounded text-[11px] font-medium">
                    {getRemainingUses('SOS Situazioni Critiche', 3)}
                  </span>
                </div>
                <p className="text-[14px] text-[#92400E] mb-2">
                  Protocolli emergenza per crisi acute. 8-12 min
                </p>
                <p className="text-[12px] text-[#991B1B] opacity-80">
                  Per crisi crescita personale. Emergenze mediche/psichiatriche → 112/118
                </p>
              </div>
            </div>
          </div>
        </section>

        {user_level >= 2 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-[20px] font-bold text-[#78350F]">💎 Strumenti Premium</h2>
              <span className="px-3 py-1 bg-gradient-to-r from-[#F59E0B] to-[#78350F] text-white rounded-full text-[11px] font-medium">
                Premium Attivo
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div
                onClick={() => handleToolUse('Trasformatore Emotivo Avanzato')}
                className="bg-white border-l-[5px] border-[#78350F] p-6 rounded-lg cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 shadow-sm relative"
              >
                <span className="text-[32px] absolute top-5 left-5">🌀</span>
                <div className="ml-12">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[18px] font-bold text-[#78350F]">Trasformatore Emotivo Avanzato</h3>
                    <span className="px-2 py-1 bg-[#10B981] text-white rounded text-[11px]">Illimitato</span>
                  </div>
                  <p className="text-[14px] text-[#6B7280]">
                    Routine immersiva profonda con linguaggio raffinato ed esercizi mirati. 15-20 min
                  </p>
                </div>
              </div>

              <div
                onClick={() => handleToolUse('Cosa Dire, Fare, Pensare')}
                className="bg-white border-l-[5px] border-[#78350F] p-6 rounded-lg cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 shadow-sm relative"
              >
                <span className="text-[32px] absolute top-5 left-5">💬</span>
                <div className="ml-12">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[18px] font-bold text-[#78350F]">Cosa Dire, Fare, Pensare</h3>
                    <span className="px-2 py-1 bg-[#10B981] text-white rounded text-[11px]">Illimitato</span>
                  </div>
                  <p className="text-[14px] text-[#6B7280]">
                    Strategie complete: risposta verbale, comportamento, ristrutturazione pensiero. 3-5 min
                  </p>
                </div>
              </div>

              <div
                onClick={() => handleToolUse('Spada della Vittoria')}
                className="bg-white border-l-[5px] border-[#78350F] p-6 rounded-lg cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 shadow-sm relative"
              >
                <span className="text-[32px] absolute top-5 left-5">⚔️</span>
                <div className="ml-12">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[18px] font-bold text-[#78350F]">Spada della Vittoria</h3>
                    <span className="px-2 py-1 bg-[#6B7280] text-white rounded text-[11px]">Settimanale</span>
                  </div>
                  <p className="text-[14px] text-[#6B7280] mb-3">
                    Frase-simbolo settimanale che attiva forza interiore e orienta rinascita. 2 min
                  </p>
                  {currentWeekGoal && isLockActive(currentWeekGoal.timestamp) && (
                    <div className="bg-[#FEF3C7] p-3 rounded border-l-4 border-[#F59E0B] text-[13px]">
                      <strong className="text-[#78350F]">📌 Frase attiva questa settimana:</strong>
                      <p className="text-[#92400E] mt-1 italic">"Sei la forza che hai sempre cercato"</p>
                      <p className="text-[#6B7280] mt-1">Rinnovo: {lockCountdown.days} giorni</p>
                    </div>
                  )}
                </div>
              </div>

              <div
                onClick={() => handleToolUse('Obiettivi Settimanali')}
                className="bg-white border-l-[5px] border-[#78350F] p-6 rounded-lg cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 shadow-sm relative"
              >
                <span className="text-[32px] absolute top-5 left-5">🎯</span>
                <div className="ml-12">
                  <h3 className="text-[18px] font-bold text-[#78350F] mb-2">Obiettivi Settimanali</h3>
                  <p className="text-[14px] text-[#6B7280] mb-3">
                    50 obiettivi guidati per superare negatività e potenziare positività. 15-20 min
                  </p>
                  {currentWeekGoal?.type === 'modulo_obiettivi' && isLockActive(currentWeekGoal.timestamp) ? (
                    <div className="bg-[#FEF3C7] p-3 rounded border-l-4 border-[#F59E0B] text-[13px]">
                      <strong className="text-[#78350F]">📌 In corso: {currentWeekGoal.title}</strong>
                      <p className="text-[#92400E] mt-1">
                        Da: {currentWeekGoal.start} → A: {currentWeekGoal.target} • Progresso: 65%
                      </p>
                      <button className="mt-2 px-3 py-1 bg-[#F59E0B] text-white rounded text-[12px] hover:bg-[#D97706]">
                        Continua
                      </button>
                    </div>
                  ) : (
                    <p className="text-[13px] text-[#92400E]">
                      Nessun obiettivo attivo. <button onClick={navigateToTest} className="text-[#F59E0B] underline font-medium">Vai a Test →</button>
                    </p>
                  )}
                </div>
              </div>

              <div
                onClick={() => handleToolUse('Percorso Settimanale')}
                className="bg-white border-l-[5px] border-[#78350F] p-6 rounded-lg cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 shadow-sm relative md:col-span-2"
              >
                <span className="text-[32px] absolute top-5 left-5">🧭</span>
                <div className="ml-12">
                  <h3 className="text-[18px] font-bold text-[#78350F] mb-2">Percorso Settimanale</h3>
                  <p className="text-[14px] text-[#6B7280] mb-3">
                    300 moduli sequenziali progressivi dalla dipendenza alla rinascita completa. 20-25 min
                  </p>
                  {currentWeekGoal?.type === 'modulo_percorso' && isLockActive(currentWeekGoal.timestamp) ? (
                    <div className="bg-[#FEF3C7] p-3 rounded border-l-4 border-[#F59E0B] text-[13px]">
                      <strong className="text-[#78350F]">📌 Settimana {currentWeekGoal.week}: {currentWeekGoal.title}</strong>
                      <button className="mt-2 px-3 py-1 bg-[#F59E0B] text-white rounded text-[12px] hover:bg-[#D97706]">
                        Continua Modulo
                      </button>
                    </div>
                  ) : (
                    <p className="text-[13px] text-[#92400E]">
                      Inizia o riprendi il percorso. <button onClick={navigateToTest} className="text-[#F59E0B] underline font-medium">Vai a Test →</button>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <footer className="bg-[#FEF3C7] p-8 rounded-xl text-center mt-10">
          <p className="text-[16px] font-bold text-[#78350F] mb-2">
            Ogni strumento che usi è un atto d'amore verso te stesso. Continua così
          </p>
          <p className="text-[14px] text-[#92400E]">
            🌱 Sei in questo percorso da {daysSince} giorni. Questo è coraggio puro
          </p>
          {(daysSince === 7 || daysSince === 30 || daysSince >= 100) && (
            <div className="mt-3 inline-block px-4 py-2 bg-[#F59E0B] text-white rounded-xl font-bold animate-pulse">
              🏆 {daysSince} giorni consecutivi
            </div>
          )}
        </footer>

        <div className="bg-white p-4 rounded-lg border-t border-[#E5E7EB] mt-10" role="contentinfo">
          <p className="text-[13px] text-[#6B7280] leading-relaxed text-center">
            ℹ️ RDN è un ecosistema di crescita personale. Per supporto clinico rivolgiti a professionisti. 
            Emergenze → 112/118/Telefono Amico 800 86 00 22.
          </p>
          <div className="flex gap-4 mt-2 justify-center">
            <a href="/privacy" className="text-[13px] text-[#6B7280] underline hover:text-[#14B8A6]">Privacy</a>
            <a href="/termini" className="text-[13px] text-[#6B7280] underline hover:text-[#14B8A6]">Termini</a>
          </div>
        </div>
      </div>

      {showLockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-5 z-[100]">
          <div className="bg-white rounded-xl p-8 max-w-[500px] w-full text-center">
            <div className="text-[48px] mb-4">🔒</div>
            <h2 className="text-[24px] font-bold text-[#78350F] mb-3">Proteggi il Tuo Focus</h2>
            <p className="text-[16px] text-[#6B7280] leading-relaxed mb-4">
              Hai scelto <strong>{currentWeekGoal?.title}</strong> per questa settimana. 
              Completare il ciclo di 7 giorni massimizza risultati e costruisce disciplina. Confida nel processo.
            </p>
            <p className="text-[14px] text-[#92400E] mb-6">
              Sblocco tra: {lockCountdown.days} giorni {lockCountdown.hours} ore
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLockModal(false)}
                className="flex-1 px-7 py-3.5 bg-[#F59E0B] text-white rounded-lg font-bold hover:bg-[#D97706] transition-colors"
              >
                Continua con Questo
              </button>
              <button
                onClick={handleOverrideLock}
                className="flex-1 px-7 py-3.5 bg-transparent border-2 border-[#DC2626] text-[#DC2626] rounded-lg font-medium hover:bg-[#FEE2E2] transition-colors"
              >
                Cambia Comunque
              </button>
            </div>
          </div>
        </div>
      )}

      {activeToolModal && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-5">
          <div className="max-w-[800px] mx-auto">
            <button
              onClick={() => setActiveToolModal(null)}
              className="mb-4 px-5 py-2 bg-[#6B7280] text-white rounded-md hover:bg-[#4B5563]"
            >
              ← Torna agli Strumenti
            </button>
            <h2 className="text-[28px] font-bold text-[#78350F] mb-4">{activeToolModal}</h2>
            <p className="text-[#6B7280]">Contenuto strumento verrà caricato qui...</p>
          </div>
        </div>
      )}
    </div>
  );
};

window.Schermata3 = Schermata3Strumenti;
