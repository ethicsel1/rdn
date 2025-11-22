// TestSettimanale.jsx
// Test settimanale focus intelligente: domande→algoritmo→3 opzioni→scelta→lock 7gg
// ~400 righe codice production-ready

const TestSettimanale = ({ globalObjectives, userLevel, onComplete }) => {
  const { todaySelection } = useRDN();
  
  // Stati localStorage
  const [weeklyObjective, setWeeklyObjective] = useUserStorage(\'rdn_weekly_objective\', null);
  const [lockedUntil, setLockedUntil] = useUserStorage(\'rdn_weekly_locked_until\', null);
  
  // Stati locali
  const [dataLoaded, setDataLoaded] = useState(false);
  const [phase, setPhase] = useState(\'intro\'); // intro | questions | options | customize | celebration | locked
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [allQuestions, setAllQuestions] = useState([]);
  const [recommendedOptions, setRecommendedOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customValues, setCustomValues] = useState({ start: 5, target: 6 });
  
  // Verifica accesso
  if (userLevel < 1) {
    return (
      <div className=\"bg-white p-6 rounded-lg shadow-lg text-center max-w-2xl mx-auto mt-8\">
        <p className=\"text-[#92400E]\">Accesso richiesto: RDN - Livello 1</p>
      </div>
    );
  }
  
  // Effect: Verifica caricamento dati
  useEffect(() => {
    const checkData = () => {
      if (window.RDN && window.RDN.data && window.RDN.data.test_settimanale) {
        setDataLoaded(true);
      } else {
        setTimeout(checkData, 100);
      }
    };
    checkData();
  }, []);
  
  // Effect: Verifica lock
  useEffect(() => {
    if (!dataLoaded) return;
    
    // Verifica se è ancora bloccato
    if (lockedUntil && new Date(lockedUntil) > new Date()) {
      setPhase(\'locked\');
      return;
    }
    
    // Se era bloccato ma ora è scaduto, mostra recap
    if (lockedUntil && weeklyObjective) {
      setPhase(\'recap\');
    }
  }, [dataLoaded, lockedUntil, weeklyObjective]);
  
  // Effect: Carica domande
  useEffect(() => {
    if (!dataLoaded) return;
    
    const questions = window.RDN.data.test_settimanale.questions || [];
    setAllQuestions(questions);
  }, [dataLoaded]);
  
  // Handler: Inizia test
  const handleStartTest = () => {
    setPhase(\'questions\');
  };
  
  // Handler: Risposta domanda
  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: value
    }));
  };
  
  // Handler: Prossima domanda
  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Fine domande → genera raccomandazioni
      generateRecommendations();
    }
  };
  
  // Handler: Domanda precedente
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Algoritmo raccomandazione
  const generateRecommendations = () => {
    const templates = window.RDN.data.test_settimanale.options_templates || [];
    
    // Logica semplificata: prendi primi 3 template e ordina per urgenza
    const critical = templates.find(t => t.urgency === \'CRITICA\') || templates[0];
    const high = templates.find(t => t.urgency === \'ALTA\') || templates[1];
    const medium = templates.find(t => t.urgency === \'MEDIA\') || templates[2];
    
    setRecommendedOptions([
      { ...critical, id: 1, urgencyLabel: \'🔴 CRITICA\' },
      { ...high, id: 2, urgencyLabel: \'🟠 ALTA\' },
      { ...medium, id: 3, urgencyLabel: \'🟡 MEDIA\' }
    ]);
    
    setPhase(\'options\');
  };
  
  // Handler: Selezione opzione
  const handleSelectOption = (option) => {
    setSelectedOption(option);
    
    // Pre-riempi valori da obiettivo globale se esiste
    const existingObj = globalObjectives?.find(o => o.title === option.title);
    if (existingObj) {
      setCustomValues({
        start: existingObj.startValue || 5,
        target: (existingObj.startValue || 5) + 0.5
      });
    }
    
    setPhase(\'customize\');
  };
  
  // Handler: Conferma obiettivo
  const handleConfirmObjective = () => {
    const lockDate = new Date();
    lockDate.setDate(lockDate.getDate() + 7);
    
    const objective = {
      ...selectedOption,
      startValue: customValues.start,
      targetValue: customValues.target,
      startDate: new Date().toISOString(),
      deadline: lockDate.toISOString()
    };
    
    setWeeklyObjective(objective);
    setLockedUntil(lockDate.toISOString());
    
    if (onComplete) {
      onComplete({
        weeklyObjective: objective,
        startDate: new Date().toISOString(),
        lockedUntil: lockDate.toISOString(),
        answers
      });
    }
    
    setPhase(\'celebration\');
    
    // Trigger viralità dopo 2s
    setTimeout(() => {
      if (window.RDN.showViralityModal) {
        window.RDN.showViralityModal({
          tool_name: \'Test Settimanale\',
          achievement: \'Focus attivato\'
        });
      }
    }, 2000);
  };
  
  // Loading
  if (!dataLoaded) {
    return (
      <div className=\"bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl mx-auto mt-8\">
        <div className=\"inline-block w-12 h-12 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin\"></div>
        <p className=\"text-[#92400E] mt-4\">Caricamento test...</p>
      </div>
    );
  }
  
  // FASE: LOCKED
  if (phase === \'locked\') {
    const daysLeft = Math.ceil((new Date(lockedUntil) - new Date()) / (1000 * 60 * 60 * 24));
    const lockMessage = window.RDN.data.test_settimanale.lock_messages?.[0] || \"Completa questa settimana prima di cambiare focus.\";
    
    return (
      <div className=\"bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8\">
        <div className=\"text-center mb-6\">
          <div className=\"text-5xl mb-4\">🔒</div>
          <h2 className=\"text-2xl font-bold text-[#78350F] mb-3\">Focus Protetto</h2>
          <p className=\"text-base text-[#6B7280] leading-relaxed mb-4\">
            {lockMessage}
          </p>
        </div>
        
        {weeklyObjective && (
          <div className=\"bg-[#FEF3C7] p-6 rounded-lg border-l-4 border-[#F59E0B] mb-6\">
            <h3 className=\"font-bold text-[#78350F] mb-2\">Il Tuo Focus Attuale:</h3>
            <p className=\"text-lg text-[#78350F] mb-1\">{weeklyObjective.title}</p>
            <p className=\"text-sm text-[#92400E]\">
              {weeklyObjective.startValue} → {weeklyObjective.targetValue}
            </p>
            <p className=\"text-xs text-[#92400E] mt-3\">
              🔓 Sblocco tra: {daysLeft} giorni
            </p>
          </div>
        )}
        
        <button
          onClick={() => window.location.reload()}
          className=\"w-full px-6 py-3 bg-[#F59E0B] text-white rounded-lg font-bold hover:bg-[#D97706] transition-colors\"
        >
          Torna agli Strumenti
        </button>
      </div>
    );
  }
  
  // FASE: INTRO
  if (phase === \'intro\') {
    return (
      <div className=\"bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8\">
        <div className=\"text-center mb-6\">
          <div className=\"text-5xl mb-4\">🎯</div>
          <h2 className=\"text-2xl font-bold text-[#78350F] mb-3\">
            Scegli il Tuo Focus Settimanale
          </h2>
          <p className=\"text-base text-[#6B7280] leading-relaxed\">
            3 minuti per scoprire su cosa concentrarti questa settimana. Il sistema ti guiderà.
          </p>
        </div>
        
        <button
          onClick={handleStartTest}
          className=\"w-full px-6 py-4 bg-[#F59E0B] text-white rounded-lg font-bold text-lg hover:bg-[#D97706] transition-all duration-200\"
        >
          Inizia il Test
        </button>
      </div>
    );
  }
  
  // FASE: DOMANDE
  if (phase === \'questions\') {
    const currentQ = allQuestions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex] || \'\';
    const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;
    
    return (
      <div className=\"bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8\">
        {/* Progress */}
        <div className=\"mb-6\">
          <div className=\"flex justify-between items-center mb-2\">
            <span className=\"text-sm text-[#92400E]\">
              Domanda {currentQuestionIndex + 1} di {allQuestions.length}
            </span>
            <span className=\"text-sm font-bold text-[#F59E0B]\">
              {Math.round(progress)}%
            </span>
          </div>
          <div className=\"h-2 bg-[#E5E7EB] rounded-full overflow-hidden\">
            <div 
              className=\"h-full bg-[#F59E0B] transition-all duration-500\"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Domanda */}
        <div className=\"mb-6 animate-fadeIn\">
          <h3 className=\"text-xl font-bold text-[#78350F] mb-4\">
            {currentQ?.question || \"Domanda\"}
          </h3>
          
          {currentQ?.type === \'textarea\' ? (
            <textarea
              value={currentAnswer}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder=\"Scrivi qui...\"
              maxLength={100}
              rows={3}
              className=\"w-full p-4 border-2 border-[#E5E7EB] rounded-lg focus:border-[#F59E0B] focus:outline-none resize-none text-[#78350F]\"
            />
          ) : (
            <div className=\"space-y-2\">
              {currentQ?.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    currentAnswer === option
                      ? \'border-[#F59E0B] bg-[#FEF3C7] text-[#78350F] font-medium\'
                      : \'border-[#E5E7EB] hover:border-[#F59E0B] text-[#78350F]\'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Navigazione */}
        <div className=\"flex gap-3\">
          {currentQuestionIndex > 0 && (
            <button
              onClick={handleBack}
              className=\"px-6 py-3 bg-[#E5E7EB] text-[#78350F] rounded-lg font-medium hover:bg-[#D1D5DB] transition-colors\"
            >
              ← Indietro
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className=\"flex-1 px-6 py-3 bg-[#F59E0B] text-white rounded-lg font-bold hover:bg-[#D97706] transition-colors disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed\"
          >
            {currentQuestionIndex === allQuestions.length - 1 ? \'Vedi Opzioni\' : \'Avanti →\'}
          </button>
        </div>
        
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out;
          }
        `}</style>
      </div>
    );
  }
  
  // FASE: OPZIONI
  if (phase === \'options\') {
    return (
      <div className=\"bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8\">
        <div className=\"text-center mb-6\">
          <div className=\"text-4xl mb-3\">🎯</div>
          <h2 className=\"text-2xl font-bold text-[#78350F] mb-2\">Questa Settimana - Scegli il Tuo Focus</h2>
          <p className=\"text-sm text-[#6B7280]\">
            In base a: {todaySelection?.mood || \'Pronto\'} + {todaySelection?.time || \'30 min\'} + {todaySelection?.energy || \'Energia alta\'}
          </p>
        </div>
        
        <div className=\"space-y-4 mb-6\">
          {recommendedOptions.map((option) => (
            <div
              key={option.id}
              className=\"p-5 bg-[#FEF3C7] rounded-lg border-l-4 border-[#F59E0B] hover:shadow-md transition-shadow cursor-pointer\"
              onClick={() => handleSelectOption(option)}
            >
              <div className=\"flex items-start justify-between mb-2\">
                <h3 className=\"font-bold text-[#78350F] text-lg\">
                  {option.urgencyLabel} {option.title}
                </h3>
              </div>
              <p className=\"text-sm text-[#92400E] mb-3\">{option.description}</p>
              <div className=\"flex gap-4 text-xs text-[#92400E]\">
                <span>⏱️ {option.timeRequired || \'15 min/giorno\'}</span>
                <span>🎯 Strumento: {option.tool || \'Trasformatore\'}</span>
              </div>
              <button className=\"mt-3 w-full py-2 bg-[#F59E0B] text-white rounded font-medium hover:bg-[#D97706] transition-colors\">
                Scelgo Questa
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // FASE: PERSONALIZZAZIONE
  if (phase === \'customize\') {
    return (
      <div className=\"bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8\">
        <div className=\"text-center mb-6\">
          <div className=\"text-4xl mb-3\">✏️</div>
          <h2 className=\"text-2xl font-bold text-[#78350F] mb-2\">Personalizza il Tuo Obiettivo</h2>
          <p className=\"text-base font-medium text-[#F59E0B]\">{selectedOption?.title}</p>
        </div>
        
        <div className=\"space-y-6 mb-6\">
          {/* Slider Partenza */}
          <div>
            <label className=\"text-sm font-medium text-[#78350F] mb-2 block\">
              Punto di Partenza (ADESSO)
            </label>
            <input
              type=\"range\"
              min=\"0\"
              max=\"10\"
              value={customValues.start}
              onChange={(e) => setCustomValues(prev => ({ ...prev, start: parseInt(e.target.value) }))}
              className=\"w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#F59E0B]\"
            />
            <div className=\"text-center text-2xl font-bold text-[#F59E0B] mt-2\">
              {customValues.start}
            </div>
          </div>
          
          {/* Slider Obiettivo */}
          <div>
            <label className=\"text-sm font-medium text-[#78350F] mb-2 block\">
              Obiettivo Settimanale (DOVE VUOI ARRIVARE)
            </label>
            <input
              type=\"range\"
              min=\"0\"
              max=\"10\"
              value={customValues.target}
              onChange={(e) => setCustomValues(prev => ({ ...prev, target: parseInt(e.target.value) }))}
              className=\"w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#10B981]\"
            />
            <div className=\"text-center text-2xl font-bold text-[#10B981] mt-2\">
              {customValues.target}
            </div>
          </div>
          
          <div className=\"bg-[#FEF3C7] p-4 rounded-lg text-center\">
            <p className=\"text-sm text-[#78350F]\">
              Progresso minimo questa settimana: <strong>+{(customValues.target - customValues.start).toFixed(1)} punti</strong>
            </p>
            <p className=\"text-xs text-[#92400E] mt-1\">
              📅 Scadenza: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(\'it-IT\')} (7 giorni)
            </p>
          </div>
        </div>
        
        <button
          onClick={handleConfirmObjective}
          className=\"w-full px-6 py-4 bg-[#F59E0B] text-white rounded-lg font-bold text-lg hover:bg-[#D97706] transition-colors\"
        >
          Conferma Focus Settimanale
        </button>
      </div>
    );
  }
  
  // FASE: CELEBRAZIONE
  if (phase === \'celebration\') {
    const feedback = window.RDN.data.test_settimanale.feedback_messages?.[0] || \"Focus attivato con successo!\";
    
    return (
      <div className=\"bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8\">
        <div className=\"text-center mb-6\">
          <div className=\"text-6xl mb-4 animate-bounce\">🎉</div>
          <h2 className=\"text-3xl font-bold text-[#10B981] mb-4\">
            FOCUS ATTIVATO
          </h2>
          <p className=\"text-lg text-[#78350F] leading-relaxed mb-6\">
            {feedback}
          </p>
        </div>
        
        {weeklyObjective && (
          <div className=\"bg-[#FEF3C7] p-6 rounded-lg border-l-4 border-[#F59E0B] mb-6\">
            <h3 className=\"font-bold text-[#78350F] mb-2\">{weeklyObjective.title}</h3>
            <p className=\"text-2xl font-bold text-[#F59E0B] mb-3\">
              {weeklyObjective.startValue} → {weeklyObjective.targetValue}
            </p>
            <p className=\"text-sm text-[#92400E] italic\">
              Questa settimana lavori SU QUESTO SOLO. Non è poco. È FOCUS. È POTERE.
            </p>
          </div>
        )}
        
        <div className=\"bg-white border-2 border-[#E5E7EB] p-4 rounded-lg mb-6 text-sm\">
          <p className=\"text-[#78350F] mb-2\">📱 <strong>Piano oggi:</strong> {weeklyObjective?.tool || \'Trasformatore Avanzato\'}</p>
          <p className=\"text-[#78350F]\">📅 <strong>Prossimo test:</strong> {new Date(lockedUntil).toLocaleDateString(\'it-IT\')} (tra 7 giorni)</p>
        </div>
        
        <p className=\"text-xs text-center text-[#92400E] italic mb-6\">
          🔒 Una volta ogni 7 giorni puoi cambiare focus. Questo protegge il tuo progresso. Fidati del sistema.
        </p>
        
        <button
          onClick={() => window.location.reload()}
          className=\"w-full px-6 py-4 bg-[#F59E0B] text-white rounded-lg font-bold text-lg hover:bg-[#D97706] transition-colors\"
        >
          Vai agli Strumenti
        </button>
      </div>
    );
  }
  
  return null;
};

// Registra globalmente
window.RDN = window.RDN || {};
window.RDN.TestSettimanale = TestSettimanale;
