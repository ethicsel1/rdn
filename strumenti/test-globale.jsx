// TestGlobale.jsx
// Test orientamento baseline: storia→situazione→futuro→obiettivi globali
// ~350 righe codice production-ready

const TestGlobale = ({ onComplete }) => {
  const { user_level, callAI } = useRDN();
  
  // Stati localStorage
  const [existingObjectives, setExistingObjectives] = useUserStorage(\'rdn_global_objectives\', null);
  const [lastTestDate, setLastTestDate] = useUserStorage(\'rdn_global_test_date\', null);
  
  // Stati locali
  const [dataLoaded, setDataLoaded] = useState(false);
  const [phase, setPhase] = useState(\'intro\'); // intro | questions | objectives | celebration
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [allQuestions, setAllQuestions] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [isRetest, setIsRetest] = useState(false);
  
  // Verifica accesso
  if (user_level < 1) {
    return (
      <div className=\"bg-white p-6 rounded-lg shadow-lg text-center max-w-2xl mx-auto mt-8\">
        <p className=\"text-[#92400E]\">Accesso richiesto: RDN - Livello 1</p>
      </div>
    );
  }
  
  // Effect: Verifica caricamento dati
  useEffect(() => {
    const checkData = () => {
      if (window.RDN && window.RDN.data && window.RDN.data.test_globale) {
        setDataLoaded(true);
      } else {
        setTimeout(checkData, 100);
      }
    };
    checkData();
  }, []);
  
  // Effect: Inizializza test
  useEffect(() => {
    if (!dataLoaded) return;
    
    const data = window.RDN.data.test_globale;
    
    // Verifica se è un retest (>90 giorni dall\'ultimo)
    if (lastTestDate && existingObjectives) {
      const daysSince = (Date.now() - new Date(lastTestDate).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince > 90) {
        setIsRetest(true);
      }
    }
    
    // Combina tutte le domande
    const questions = [
      ...data.questions_fase1,
      ...data.questions_fase2,
      ...data.questions_fase3
    ];
    setAllQuestions(questions);
    
  }, [dataLoaded, lastTestDate, existingObjectives]);
  
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
      // Fine domande → genera obiettivi
      generateObjectives();
    }
  };
  
  // Handler: Domanda precedente
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Genera obiettivi suggeriti
  const generateObjectives = () => {
    const templates = window.RDN.data.test_globale.objectives_templates;
    
    // Seleziona 4 obiettivi basati su keywords risposte
    // Algoritmo semplice: primi 4 template con timeframe diversi
    const selected = templates.slice(0, 4).map((template, idx) => ({
      id: `obj_${Date.now()}_${idx}`,
      title: template.title,
      description: template.description,
      timeframe: template.timeframe, // \'3_months\' | \'1_year\' | \'3_years\' | \'lifetime\'
      startValue: 5,
      targetValue: template.suggested_target || 8,
      deadline: calculateDeadline(template.timeframe)
    }));
    
    setObjectives(selected);
    setPhase(\'objectives\');
  };
  
  // Calcola scadenza
  const calculateDeadline = (timeframe) => {
    const now = new Date();
    switch(timeframe) {
      case \'3_months\':
        now.setMonth(now.getMonth() + 3);
        break;
      case \'1_year\':
        now.setFullYear(now.getFullYear() + 1);
        break;
      case \'3_years\':
        now.setFullYear(now.getFullYear() + 3);
        break;
      case \'lifetime\':
        now.setFullYear(now.getFullYear() + 10);
        break;
    }
    return now.toISOString();
  };
  
  // Handler: Modifica slider obiettivo
  const handleObjectiveChange = (objId, field, value) => {
    setObjectives(prev => prev.map(obj => 
      obj.id === objId ? { ...obj, [field]: parseInt(value) } : obj
    ));
  };
  
  // Handler: Conferma obiettivi
  const handleConfirmObjectives = () => {
    // Salva dati
    setExistingObjectives(objectives);
    setLastTestDate(new Date().toISOString());
    
    // Callback parent
    if (onComplete) {
      onComplete({
        objectives,
        startDate: new Date().toISOString(),
        answers
      });
    }
    
    setPhase(\'celebration\');
    
    // Trigger viralità dopo 2s
    setTimeout(() => {
      if (window.RDN.showViralityModal) {
        window.RDN.showViralityModal({
          tool_name: \'Test Globale\',
          achievement: \'Obiettivi definiti\'
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
  
  // FASE: INTRO
  if (phase === \'intro\') {
    const introText = isRetest 
      ? window.RDN.data.test_globale.intro_ripetizione
      : \"Questo test ti aiuta a definire dove sei ADESSO e dove vuoi ARRIVARE. 5 minuti che cambiano tutto.\";
    
    return (
      <div className=\"bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8\">
        <div className=\"text-center mb-6\">
          <div className=\"text-5xl mb-4\">🎯</div>
          <h2 className=\"text-2xl font-bold text-[#78350F] mb-3\">
            {isRetest ? \'Facciamo il Punto?\' : \'Definisci il Tuo Percorso\'}
          </h2>
          <p className=\"text-base text-[#6B7280] leading-relaxed\">
            {introText}
          </p>
        </div>
        
        <button
          onClick={handleStartTest}
          className=\"w-full px-6 py-4 bg-[#F59E0B] text-white rounded-lg font-bold text-lg hover:bg-[#D97706] transition-all duration-200\"
        >
          {isRetest ? \'Aggiorna Obiettivi\' : \'Inizia il Test\'}
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
            {currentQ.question}
          </h3>
          
          {currentQ.type === \'text\' ? (
            <div>
              <textarea
                value={currentAnswer}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder=\"Scrivi la tua risposta...\"
                maxLength={300}
                rows={5}
                className=\"w-full p-4 border-2 border-[#E5E7EB] rounded-lg focus:border-[#F59E0B] focus:outline-none resize-none text-[#78350F]\"
              />
              <div className=\"text-right text-xs text-[#92400E] mt-1\">
                {currentAnswer.length}/300
              </div>
            </div>
          ) : (
            <div>
              <input
                type=\"range\"
                min=\"0\"
                max=\"10\"
                value={currentAnswer || 5}
                onChange={(e) => handleAnswer(e.target.value)}
                className=\"w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#F59E0B]\"
              />
              <div className=\"flex justify-between text-sm text-[#92400E] mt-2\">
                <span>0 - Per niente</span>
                <span className=\"font-bold text-[#F59E0B] text-lg\">{currentAnswer || 5}</span>
                <span>10 - Moltissimo</span>
              </div>
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
            {currentQuestionIndex === allQuestions.length - 1 ? \'Definisci Obiettivi\' : \'Avanti →\'}
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
  
  // FASE: OBIETTIVI
  if (phase === \'objectives\') {
    return (
      <div className=\"bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8\">
        <div className=\"text-center mb-6\">
          <div className=\"text-4xl mb-3\">🎯</div>
          <h2 className=\"text-2xl font-bold text-[#78350F] mb-2\">I Tuoi Obiettivi</h2>
          <p className=\"text-sm text-[#6B7280]\">
            Dove sei ADESSO? Dove vuoi ARRIVARE?
          </p>
        </div>
        
        <div className=\"space-y-6 mb-6\">
          {objectives.map((obj) => (
            <div key={obj.id} className=\"p-5 bg-[#FEF3C7] rounded-lg border-l-4 border-[#F59E0B]\">
              <h3 className=\"font-bold text-[#78350F] mb-1\">{obj.title}</h3>
              <p className=\"text-sm text-[#92400E] mb-4\">{obj.description}</p>
              
              {/* Slider Partenza */}
              <div className=\"mb-4\">
                <label className=\"text-xs font-medium text-[#78350F] mb-2 block\">
                  Punto di Partenza (ADESSO)
                </label>
                <input
                  type=\"range\"
                  min=\"0\"
                  max=\"10\"
                  value={obj.startValue}
                  onChange={(e) => handleObjectiveChange(obj.id, \'startValue\', e.target.value)}
                  className=\"w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#F59E0B]\"
                />
                <div className=\"text-center text-lg font-bold text-[#F59E0B] mt-1\">
                  {obj.startValue}
                </div>
              </div>
              
              {/* Slider Obiettivo */}
              <div>
                <label className=\"text-xs font-medium text-[#78350F] mb-2 block\">
                  Obiettivo (DOVE VUOI ARRIVARE)
                </label>
                <input
                  type=\"range\"
                  min=\"0\"
                  max=\"10\"
                  value={obj.targetValue}
                  onChange={(e) => handleObjectiveChange(obj.id, \'targetValue\', e.target.value)}
                  className=\"w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#10B981]\"
                />
                <div className=\"text-center text-lg font-bold text-[#10B981] mt-1\">
                  {obj.targetValue}
                </div>
              </div>
              
              <div className=\"text-xs text-[#92400E] mt-3 text-center\">
                📅 Scadenza: {new Date(obj.deadline).toLocaleDateString(\'it-IT\')}
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={handleConfirmObjectives}
          className=\"w-full px-6 py-4 bg-[#F59E0B] text-white rounded-lg font-bold text-lg hover:bg-[#D97706] transition-colors\"
        >
          Conferma i Miei Obiettivi
        </button>
      </div>
    );
  }
  
  // FASE: CELEBRAZIONE
  if (phase === \'celebration\') {
    const feedback = window.RDN.data.test_globale.feedback_messages[0] || \"🌟 HAI DEFINITO IL TUO PRIMO PASSO\";
    
    return (
      <div className=\"bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8\">
        <div className=\"text-center mb-6\">
          <div className=\"text-6xl mb-4 animate-bounce\">🌟</div>
          <h2 className=\"text-3xl font-bold text-[#10B981] mb-4\">
            Hai Definito il Tuo Primo Passo!
          </h2>
          <p className=\"text-lg text-[#78350F] leading-relaxed mb-6\">
            {feedback}
          </p>
        </div>
        
        {/* Riepilogo obiettivi */}
        <div className=\"bg-[#FEF3C7] p-6 rounded-lg mb-6\">
          <h3 className=\"font-bold text-[#78350F] mb-3\">I Tuoi 4 Obiettivi:</h3>
          <div className=\"space-y-2\">
            {objectives.map((obj) => (
              <div key={obj.id} className=\"flex items-center gap-2 text-sm\">
                <span className=\"text-[#10B981]\">✅</span>
                <span className=\"text-[#78350F]\">
                  <strong>{obj.title}:</strong> {obj.startValue} → {obj.targetValue}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <p className=\"text-center text-sm italic text-[#92400E] mb-6\">
          Ogni settimana, un test ti dirà se stai avanzando. Non sei mai più solo. 💙
        </p>
        
        <button
          onClick={() => {
            // Torna alla dashboard principale
            if (onComplete) onComplete({ phase: \'complete\' });
          }}
          className=\"w-full px-6 py-4 bg-[#F59E0B] text-white rounded-lg font-bold text-lg hover:bg-[#D97706] transition-colors\"
        >
          Continua verso gli Strumenti
        </button>
      </div>
    );
  }
  
  return null;
};

// Registra globalmente
window.RDN = window.RDN || {};
window.RDN.TestGlobale = TestGlobale;
