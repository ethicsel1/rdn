// Schermata2Orientamento.jsx - VERSIONE CORRETTA

// Helper: Verifica se data è scaduta (>7 giorni)
const isExpired = (timestamp, days = 7) => {
  if (!timestamp) return true;
  const now = new Date();
  const saved = new Date(timestamp);
  const diffDays = (now - saved) / (1000 * 60 * 60 * 24);
  return diffDays >= days;
};

// Helper: Calcola giorni rimanenti
const daysRemaining = (timestamp) => {
  if (!timestamp) return 0;
  const now = new Date();
  const saved = new Date(timestamp);
  const expiryDate = new Date(saved.getTime() + 7 * 24 * 60 * 60 * 1000);
  const diffDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Helper: Formatta data italiana
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const Schermata2Orientamento = ({ onNavigate }) => {
  const { user_level, callAI, todayMood, todaySelection } = useRDN();
  
  const [globalResults, setGlobalResults] = useUserStorage('rdn_global_objectives', null);
  const [weeklyResults, setWeeklyResults] = useUserStorage('rdn_weekly_objective', null);
  const [progressData, setProgressData] = useUserStorage('rdn_progress_data', {
    moods: 0,
    reinforcements: 0,
    emotions: 0,
    objectives: 0,
    modules: 0,
    lastImprovement: null
  });
  const [historyEvents, setHistoryEvents] = useUserStorage('rdn_history_events', []);
  const [gdprConsent, setGdprConsent] = useUserStorage('rdn_gdpr_consent', false);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [showGlobalTest, setShowGlobalTest] = useState(false);
  const [showWeeklyTest, setShowWeeklyTest] = useState(false);
  const [showGlobalHistory, setShowGlobalHistory] = useState(false);
  const [showWeeklyHistory, setShowWeeklyHistory] = useState(false);
  const [showProgressHistory, setShowProgressHistory] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateType, setUpdateType] = useState(null);
  const [updateValue, setUpdateValue] = useState(0);
  const [weeklyCountdown, setWeeklyCountdown] = useState(0);

  const required_level = 1;
  if (!user_level || user_level < required_level) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-5">
        <div className="bg-[#FEF3C7] p-8 rounded-lg shadow-lg text-center max-w-md">
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
    if (weeklyResults && weeklyResults.timestamp) {
      const updateCountdown = () => {
        setWeeklyCountdown(daysRemaining(weeklyResults.timestamp));
      };
      updateCountdown();
      const interval = setInterval(updateCountdown, 60000);
      return () => clearInterval(interval);
    }
  }, [weeklyResults]);

  const handleGlobalComplete = (results) => {
    if (!gdprConsent) setGdprConsent(true);
    
    const timestamp = new Date().toISOString();
    setGlobalResults({
      objectives: results,
      timestamp,
      history: [...(globalResults?.history || []), { timestamp, objectives: results }]
    });
    
    const newEvents = results.map(obj => ({
      type: 'objective_set',
      timestamp,
      icon: '🎯',
      detail: `Obiettivo ${obj.timeframe}: ${obj.title}`
    }));
    setHistoryEvents([...newEvents, ...historyEvents]);
    
    setShowGlobalTest(false);
  };

  const handleWeeklyComplete = (result) => {
    if (!gdprConsent) setGdprConsent(true);
    
    const timestamp = new Date().toISOString();
    setWeeklyResults({
      ...result,
      timestamp,
      history: [...(weeklyResults?.history || []), { ...result, timestamp }]
    });
    
    setHistoryEvents([{
      type: 'weekly_objective',
      timestamp,
      icon: '🎯',
      detail: `Obiettivo settimanale: ${result.title}`
    }, ...historyEvents]);
    
    setShowWeeklyTest(false);
  };

  const handleUpdateValue = () => {
    const timestamp = new Date().toISOString();
    
    if (updateType === 'global') {
      const updated = globalResults.objectives.map(obj =>
        obj.id === updateValue.id ? { ...obj, current: updateValue.new, lastUpdate: timestamp } : obj
      );
      setGlobalResults({ ...globalResults, objectives: updated });
      
      if (updateValue.new > updateValue.old) {
        const improvement = {
          type: 'improvement',
          timestamp,
          icon: '🌟',
          detail: `${updateValue.title}: ${updateValue.old} → ${updateValue.new}`
        };
        setHistoryEvents([improvement, ...historyEvents]);
        setProgressData({
          ...progressData,
          lastImprovement: improvement
        });
      }
    } else if (updateType === 'weekly') {
      setWeeklyResults({
        ...weeklyResults,
        current: updateValue.new,
        lastUpdate: timestamp
      });
      
      if (updateValue.new > updateValue.old) {
        setHistoryEvents([{
          type: 'improvement',
          timestamp,
          icon: '🌟',
          detail: `Settimanale: ${updateValue.old} → ${updateValue.new}`
        }, ...historyEvents]);
      }
    }
    
    setShowUpdateModal(false);
    setUpdateType(null);
  };

  const handleResetGlobal = () => {
    if (window.confirm('Sicuro? Perderai obiettivi attuali')) {
      setGlobalResults(null);
      setShowGlobalTest(true);
    }
  };

  const generateDailyPlan = () => {
    if (!todaySelection || !weeklyResults) return null;
    
    const { mood, time, energy } = todaySelection;
    const plan = {
      mood: mood || 'pronto',
      time: time || '15-30',
      energy: energy || 'media',
      tools: [],
      weeklyObjective: weeklyResults
    };
    
    if (energy === 'alta') {
      plan.tools.push('Trasformatore Avanzato');
    }
    if (weeklyResults.type === 'modulo_obiettivi') {
      plan.tools.push(`Modulo Obiettivi: ${weeklyResults.title}`);
    }
    
    return plan;
  };

  const getOrientationMessage = () => {
    if (!dataLoaded || !window.RDN?.data?.orientation_messages) return '';
    
    const mood = todaySelection?.mood || 'pronto';
    const messages = window.RDN?.data?.orientation_messages[mood];
    if (!messages) return '';
    
    const baseMessage = messages.base || messages[user_level] || '';
    const premiumAdd = user_level >= 2 ? (messages.premium || '') : '';
    
    return baseMessage + (premiumAdd ? '\n\n💎 ' + premiumAdd : '');
  };

  const dailyPlan = generateDailyPlan();

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F59E0B]"></div>
          <p className="mt-4 text-[#78350F] text-lg">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-[800px] mx-auto px-6 py-8">
        
        <div className="bg-[#FEF3C7] border-l-[5px] border-[#F59E0B] p-5 rounded-lg mb-8">
          <p className="text-[16px] leading-relaxed text-[#78350F] whitespace-pre-line">
            {getOrientationMessage()}
          </p>
        </div>

        <div className="bg-white border-t-2 border-[#92400E] p-6 rounded-lg mb-5 shadow-sm">
          {!globalResults && !showGlobalTest && (
            <>
              <h2 className="text-[24px] font-bold text-[#78350F] mb-3">🎯 Obiettivi Globali</h2>
              <p className="text-[16px] text-[#6B7280] mb-5 leading-relaxed">
                Definisci dove sei stato, dove sei ora, dove vuoi arrivare. Acquisire visione crea sicurezza e direzione.
              </p>
              {!gdprConsent && (
                <div className="bg-[rgba(245,158,11,0.05)] p-2.5 rounded-md mb-4">
                  <label className="flex items-start gap-2 text-[12px] italic text-[#92400E]">
                    <input type="checkbox" className="mt-1 w-4 h-4 accent-[#F59E0B]" />
                    ☑️ Acconsento salvataggio obiettivi (dati criptati). 
                    <a href="/privacy" className="underline hover:text-[#14B8A6]">Privacy →</a>
                  </label>
                </div>
              )}
              <button
                onClick={() => setShowGlobalTest(true)}
                className="px-7 py-3.5 bg-[#F59E0B] text-white rounded-md font-medium hover:bg-[#D97706] transition-colors duration-200"
              >
                Inizia il Test
              </button>
            </>
          )}

          {showGlobalTest && (
            <div>Test Globale placeholder</div>
          )}

          {globalResults && !showGlobalTest && (
            <>
              <h2 className="text-[24px] font-bold text-[#78350F] mb-5">🎯 I Tuoi Obiettivi Globali</h2>
              <div className="space-y-4 mb-5">
                {globalResults.objectives?.map((obj, idx) => (
                  <div key={idx} className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-[#F59E0B] text-white text-[12px] font-bold rounded uppercase">
                        {obj.timeframe}
                      </span>
                      <h3 className="text-[16px] font-bold text-[#78350F]">{obj.title}</h3>
                    </div>
                    <p className="text-[14px] text-[#6B7280] mb-2">
                      Da: {obj.start} → A: {obj.target} • Attuale: {obj.current || obj.start}
                    </p>
                    <p className="text-[13px] text-[#92400E]">
                      Scadenza: {formatDate(obj.deadline)} • Compilato: {formatDate(globalResults.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setUpdateType('global');
                    setShowUpdateModal(true);
                  }}
                  className="px-4 py-2 bg-[#10B981] text-white rounded-md text-[14px] hover:bg-[#059669] transition-colors"
                >
                  Modifica Numero Attuale
                </button>
                <button
                  onClick={handleResetGlobal}
                  className="px-4 py-2 bg-[#6B7280] text-white rounded-md text-[14px] hover:bg-[#4B5563] transition-colors"
                >
                  Ripeti Test
                </button>
                <button
                  onClick={() => setShowGlobalHistory(true)}
                  className="px-4 py-2 bg-white border border-[#D1D5DB] text-[#78350F] rounded-md text-[14px] hover:bg-[#F9FAFB] transition-colors"
                >
                  Storico
                </button>
              </div>
            </>
          )}
        </div>

        {globalResults && (
          <div className="bg-[#F3F4F6] p-5 rounded-lg mb-5">
            <h2 className="text-[20px] font-bold text-[#78350F] mb-3">📊 I Tuoi Progressi</h2>
            <p className="text-[15px] text-[#6B7280] mb-3">
              Questa settimana: {progressData.moods} stati d'animo definiti, {progressData.reinforcements} rinforzi visualizzati, {progressData.emotions} emozioni/forze lavorate
              {user_level >= 2 && `, ${progressData.objectives} obiettivi attivati, ${progressData.modules} moduli completati`}.
            </p>
            {progressData.lastImprovement && (
              <p className="text-[15px] text-[#78350F] font-medium mb-3">
                🌟 {progressData.lastImprovement.detail}
              </p>
            )}
            <button
              onClick={() => setShowProgressHistory(true)}
              className="text-[14px] text-[#92400E] underline hover:text-[#F59E0B] transition-colors"
            >
              Vedi Cronologia Completa
            </button>
          </div>
        )}

        {globalResults && (
          <div className="bg-white border-2 border-[#F59E0B] p-6 rounded-lg mb-5 shadow-sm">
            {(!weeklyResults || isExpired(weeklyResults.timestamp)) && !showWeeklyTest && (
              <>
                <h2 className="text-[20px] font-bold text-[#78350F] mb-3">🎯 Obiettivo Settimanale</h2>
                <p className="text-[15px] text-[#6B7280] mb-5 leading-relaxed">
                  Definisci focus settimanale basato su energia e obiettivi globali. Rimane attivo 7 giorni, poi nuovo test.
                </p>
                <button
                  onClick={() => setShowWeeklyTest(true)}
                  className="px-7 py-3.5 bg-[#F59E0B] text-white rounded-md font-medium hover:bg-[#D97706] transition-colors"
                >
                  Inizia Test Settimanale
                </button>
              </>
            )}

            {showWeeklyTest && (
              <div>Test Settimanale placeholder</div>
            )}

            {weeklyResults && !isExpired(weeklyResults.timestamp) && !showWeeklyTest && (
              <>
                <h2 className="text-[20px] font-bold text-[#78350F] mb-4">🎯 Obiettivo Settimanale Attivo</h2>
                <div className="bg-[#FEF3C7] p-4 rounded-lg mb-4">
                  <h3 className="text-[16px] font-bold text-[#78350F] mb-2">{weeklyResults.title}</h3>
                  <p className="text-[14px] text-[#6B7280] mb-2">
                    Da: {weeklyResults.start} → A: {weeklyResults.target} • Progresso Attuale: {weeklyResults.current || weeklyResults.start}
                  </p>
                  <p className="text-[14px] text-[#92400E] font-medium">
                    Scadenza: {weeklyCountdown} giorni ({formatDate(new Date(new Date(weeklyResults.timestamp).getTime() + 7 * 24 * 60 * 60 * 1000))})
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setUpdateType('weekly');
                      setUpdateValue({
                        old: weeklyResults.current || weeklyResults.start,
                        new: weeklyResults.current || weeklyResults.start,
                        title: weeklyResults.title
                      });
                      setShowUpdateModal(true);
                    }}
                    className="px-4 py-2 bg-[#10B981] text-white rounded-md text-[14px] hover:bg-[#059669] transition-colors"
                  >
                    Registra Miglioramento
                  </button>
                  <button
                    onClick={() => setShowWeeklyHistory(true)}
                    className="px-4 py-2 bg-white border border-[#D1D5DB] text-[#78350F] rounded-md text-[14px] hover:bg-[#F9FAFB] transition-colors"
                  >
                    Storico Settimanale
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {weeklyResults && !isExpired(weeklyResults.timestamp) ? (
          <div className="bg-[#FEF3C7] border-l-4 border-[#F59E0B] p-4 rounded-lg mb-5">
            <p className="text-[15px] text-[#78350F] leading-relaxed">
              📋 <strong>IL TUO PIANO OGGI</strong> | Basato su: {todaySelection?.mood || 'Pronto'} + {todaySelection?.time || '15-30 min'} + Energia {todaySelection?.energy || 'media'}
              {dailyPlan?.tools.length > 0 && ` | ✅ ${dailyPlan.tools.join(' | ✅ ')}`}
            </p>
            <button className="mt-2 text-[13px] text-[#92400E] underline hover:text-[#F59E0B]">
              Modifica Piano
            </button>
          </div>
        ) : globalResults && (
          <div className="bg-[#FEF3C7] border-l-4 border-[#F59E0B] p-4 rounded-lg mb-5 text-center">
            <p className="text-[15px] text-[#92400E] mb-3">
              ⚠️ Completa il Test Settimanale per ricevere piano personalizzato
            </p>
            <button
              onClick={() => {
                setShowWeeklyTest(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2 bg-[#F59E0B] text-white rounded-md text-[14px] hover:bg-[#D97706] transition-colors"
            >
              Fai Test Ora
            </button>
          </div>
        )}

        <footer className="bg-white p-4 rounded-lg border-t border-[#E5E7EB] mt-10" role="contentinfo">
          <p className="text-[13px] text-[#6B7280] leading-relaxed">
            ℹ️ RDN è un ecosistema di crescita personale. Per supporto clinico rivolgiti a professionisti. 
            Emergenze → 112/118/Telefono Amico 800 86 00 22.
          </p>
          <div className="flex gap-4 mt-2 justify-center">
            <a href="/privacy" className="text-[13px] text-[#6B7280] underline hover:text-[#14B8A6]">Privacy</a>
            <a href="/termini" className="text-[13px] text-[#6B7280] underline hover:text-[#14B8A6]">Termini</a>
          </div>
        </footer>
      </div>

      <button
        onClick={() => onNavigate && onNavigate('schermata3', dailyPlan)}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 px-8 py-4 bg-[#F59E0B] text-white rounded-lg text-[18px] font-bold shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:bg-[#D97706] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(245,158,11,0.4)] transition-all duration-200"
      >
        Vai agli Strumenti →
      </button>

      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-5 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-[20px] font-bold text-[#78350F] mb-4">Aggiorna Progresso</h3>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={updateValue.new}
              onChange={(e) => setUpdateValue({ ...updateValue, new: parseFloat(e.target.value) })}
              className="w-full mb-4"
            />
            <p className="text-center text-[18px] font-bold text-[#78350F] mb-5">{updateValue.new}</p>
            <div className="flex gap-3">
              <button
                onClick={handleUpdateValue}
                className="flex-1 px-4 py-2 bg-[#10B981] text-white rounded-md hover:bg-[#059669]"
              >
                Salva
              </button>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 px-4 py-2 bg-[#6B7280] text-white rounded-md hover:bg-[#4B5563]"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {showProgressHistory && (
        <div className="fixed inset-0 bg-white overflow-y-auto z-50 p-5">
          <div className="max-w-[800px] mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[24px] font-bold text-[#78350F]">📊 Cronologia Completa</h2>
              <button
                onClick={() => setShowProgressHistory(false)}
                className="text-[24px] text-[#6B7280] hover:text-[#78350F]"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {historyEvents.map((event, idx) => (
                <div key={idx} className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB]">
                  <div className="flex items-start gap-3">
                    <span className="text-[24px]">{event.icon}</span>
                    <div className="flex-1">
                      <p className="text-[14px] text-[#78350F] font-medium">{event.detail}</p>
                      <p className="text-[12px] text-[#6B7280] mt-1">{formatDate(event.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

window.Schermata2 = Schermata2Orientamento;
