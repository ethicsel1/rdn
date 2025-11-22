// MotivatoreDinamico.jsx - VERSIONE CORRETTA
// Esperienza quotidiana trasformativa: arco narrativo Difficoltà→Speranza→Rinascita
// ~340 righe codice production-ready

const MotivatoreDinamico = ({ mood }) => {
  const { user_level } = useRDN();
  
  // localStorage persistence
  const [motivatorDate, setMotivatorDate] = useUserStorage('rdn_motivator_date', null);
  const [motivatorShownToday, setMotivatorShownToday] = useUserStorage('rdn_motivator_shown_today', false);
  const [motivatorCache, setMotivatorCache] = useUserStorage('rdn_motivator_content_cache', null);
  
  // Stati locali
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [animationPhase, setAnimationPhase] = useState('idle');
  
  // Verifica accesso
  if (user_level < 1) {
    return (
      <div className="bg-white border-t-3 border-[#F59E0B] p-6 rounded-lg mt-6 text-center">
        <p className="text-[#92400E]">Accesso richiesto: RDN - Livello 1</p>
      </div>
    );
  }
  
  // Effect: Verifica caricamento dati - CORRECTED
  useEffect(() => {
    const checkData = () => {
      if (window.RDN?.data?.motivators?.[mood] && window.RDN?.data?.motivators?.final_phrases) {
        setDataLoaded(true);
      } else {
        setTimeout(checkData, 100);
      }
    };
    checkData();
  }, [mood]);
  
  // Effect: Reset mezzanotte
  useEffect(() => {
    const checkMidnight = () => {
      if (motivatorDate && !isToday(motivatorDate)) {
        setMotivatorDate(null);
        setMotivatorShownToday(false);
        setMotivatorCache(null);
        setIsShowing(false);
        setAnimationPhase('idle');
      }
    };
    checkMidnight();
    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, [motivatorDate]);
  
  // Effect: Carica cached se già mostrato oggi
  useEffect(() => {
    if (dataLoaded && motivatorShownToday && motivatorCache && isToday(motivatorDate)) {
      setCurrentContent(motivatorCache);
      setIsShowing(true);
      setAnimationPhase('complete');
    }
  }, [dataLoaded, motivatorShownToday, motivatorCache, motivatorDate]);
  
  // Helper: Seleziona random da array
  const getRandomItem = (array) => {
    if (!array || array.length === 0) return '';
    return array[Math.floor(Math.random() * array.length)];
  };
  
  // Helper: Seleziona N random da array
  const getRandomItems = (array, count) => {
    if (!array || array.length === 0) return [];
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
  };
  
  // Genera nuovo contenuto - CORRECTED
  const generateContent = () => {
    if (!window.RDN?.data?.motivators?.[mood]) {
      console.error('Mood non valido:', mood);
      return null;
    }
    
    const motivatorData = window.RDN.data.motivators[mood];
    const finalData = window.RDN.data.motivators.final_phrases;
    
    // Intro statica per sezione 1
    const section1Intros = {
      fragile: [
        "Ti hanno detto:",
        "Ti è stato ripetuto:",
        "Ti hanno fatto credere che:",
        "Hanno cercato di convincerti che:",
        "Ti hanno inculcato che:"
      ],
      incerto: [
        "Dentro ti sei sentito e detto:",
        "Hai dubitato di te con pensieri come:",
        "Ti hanno portato a pensare:",
        "Troppo spesso hai pensato che:",
        "Le frasi che ti sei detto sono:"
      ],
      pronto: [
        "Senti dentro un'energia che:",
        "Avverti un'energia che:",
        "Riconosci un'energia che:",
        "Percepisci un'energia che:"
      ]
    };
    
    // Label animata per sezione 1
    const section1Labels = {
      fragile: "FALSO",
      incerto: "INCOMPLETO / ERRATO",
      pronto: "SBAGLIATO"
    };
    
    const section1Colors = {
      fragile: "#FF4444",
      incerto: "#FFAA33",
      pronto: "#33FFAA"
    };
    
    // Label sezione 2
    const section2Label1 = mood === 'pronto' ? "VERITÀ UNIVERSALE" : "VERITÀ SU DI LORO";
    const section2Label2 = "VERITÀ SU DI TE";
    
    // Intro statica per sezione 3
    const section3Intros = [
      "Grazie a questa nuova conoscenza:",
      "Per questa ragione:",
      "Con questa nuova consapevolezza:",
      "Sapendo questo:",
      "Con questa nuova verità:"
    ];
    
    // Emoji finali per sezione 3
    const section3Emojis = {
      fragile: ["🌱", "🌿", "🍀"],
      incerto: ["🌅", "🌀", "🔶"],
      pronto: ["✊", "🌟", "⚡"]
    };
    
    const content = {
      section1: {
        intro: getRandomItem(section1Intros[mood]),
        phrases: getRandomItems(motivatorData.phrase1, 3),
        label: section1Labels[mood],
        labelColor: section1Colors[mood]
      },
      section2: {
        phrases1: getRandomItems(motivatorData.phrase2, 3),
        label1: section2Label1,
        phrases2: mood === 'pronto' ? [] : getRandomItems(motivatorData.phrase2b, 3),
        label2: mood === 'pronto' ? null : section2Label2
      },
      section3: {
        intro: getRandomItem(section3Intros),
        phrase1: getRandomItem(finalData.phrase1),
        phrase2: getRandomItem(finalData.phrase2),
        phrase3: getRandomItem(finalData.phrase3),
        emoji: getRandomItem(section3Emojis[mood]),
        finalPhrase: getRandomItem(finalData.phrase4)
      }
    };
    
    return content;
  };
  
  // Handler: Mostra motivatore
  const handleShowMotivator = () => {
    if (!dataLoaded) return;
    
    // Se già mostrato oggi, ripeti animazione
    if (motivatorShownToday && motivatorCache && isToday(motivatorDate)) {
      setAnimationPhase('idle');
      setTimeout(() => {
        setIsShowing(true);
        startAnimation();
      }, 100);
      return;
    }
    
    // Genera nuovo contenuto
    const content = generateContent();
    if (!content) return;
    
    setCurrentContent(content);
    setMotivatorCache(content);
    setMotivatorDate(new Date().toISOString());
    setMotivatorShownToday(true);
    setIsShowing(true);
    startAnimation();
  };
  
  // Sequenza animazione
  const startAnimation = () => {
    setAnimationPhase('section1');
    
    setTimeout(() => {
      setAnimationPhase('section2');
    }, 6000);
    
    setTimeout(() => {
      setAnimationPhase('section3');
    }, 16000);
    
    setTimeout(() => {
      setAnimationPhase('complete');
    }, 22000);
  };
  
  // Loading state
  if (!dataLoaded) {
    return (
      <div className="bg-white border-t-3 border-[#F59E0B] p-6 rounded-lg mt-6 shadow-sm text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#92400E] mt-4">Caricamento motivatore...</p>
      </div>
    );
  }
  
  // Stato iniziale: pulsante
  if (!isShowing) {
    return (
      <div className="bg-white border-t-3 border-[#F59E0B] p-6 rounded-lg mt-6 shadow-sm text-center">
        <button
          onClick={handleShowMotivator}
          className="px-7 py-3.5 bg-[#F59E0B] text-white rounded-lg font-bold text-base hover:bg-[#D97706] transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          style={{ boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)' }}
        >
          💫 Mostra il Tuo Motivatore di Oggi
        </button>
      </div>
    );
  }
  
  // Contenuto motivatore
  if (!currentContent) return null;
  
  return (
    <div className="bg-white border-t-3 border-[#F59E0B] p-6 rounded-lg mt-6 shadow-sm">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 10px currentColor; }
          50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
        }
        
        @keyframes scaleBounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .pulse-anim {
          animation: pulse 1s ease-in-out 3;
        }
        
        .glow-anim {
          animation: glow 2s ease-in-out 3;
        }
        
        .scale-bounce {
          animation: scaleBounce 0.6s ease-out forwards;
        }
      `}</style>
      
      {/* SEZIONE 1 - DIFFICOLTÀ */}
      {(animationPhase === 'section1' || animationPhase === 'section2' || animationPhase === 'section3' || animationPhase === 'complete') && (
        <div className="mb-8">
          <div className="text-center mb-4 text-3xl">💔</div>
          <p className="text-sm font-bold text-[#78350F] mb-3">{currentContent.section1.intro}</p>
          
          {currentContent.section1.phrases.map((phrase, idx) => (
            <div
              key={idx}
              className="fade-in-up text-[15px] text-[#92400E] leading-relaxed p-3 mb-2.5 rounded border-l-3"
              style={{
                animationDelay: `${idx * 1.2}s`,
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                borderLeftColor: '#EF4444'
              }}
            >
              {phrase}
            </div>
          ))}
          
          <div
            className="fade-in-up text-center uppercase font-bold text-lg mt-4 mb-8 pulse-anim"
            style={{
              animationDelay: '3.6s',
              color: currentContent.section1.labelColor
            }}
          >
            {currentContent.section1.label}
          </div>
        </div>
      )}
      
      {/* SEZIONE 2 - SPERANZA */}
      {(animationPhase === 'section2' || animationPhase === 'section3' || animationPhase === 'complete') && (
        <div className="mb-8">
          <div className="text-center mb-4 text-3xl">✨</div>
          <p className="text-sm font-bold text-[#78350F] mb-3">Ma la verità è che:</p>
          
          {currentContent.section2.phrases1.map((phrase, idx) => (
            <div
              key={`2a-${idx}`}
              className="fade-in-up text-[15px] text-[#78350F] leading-relaxed p-3 mb-2.5 rounded border-l-3"
              style={{
                animationDelay: `${idx * 1.2}s`,
                backgroundColor: 'rgba(0, 246, 255, 0.08)',
                borderLeftColor: '#00F6FF'
              }}
            >
              {phrase}
            </div>
          ))}
          
          <div
            className="fade-in-up text-center uppercase font-bold text-base mt-5 mb-5 glow-anim"
            style={{
              animationDelay: '3.6s',
              color: '#00F6FF'
            }}
          >
            {currentContent.section2.label1}
          </div>
          
          {currentContent.section2.phrases2.length > 0 && (
            <>
              <p className="text-sm font-bold text-[#78350F] mb-3 mt-5">E che:</p>
              
              {currentContent.section2.phrases2.map((phrase, idx) => (
                <div
                  key={`2b-${idx}`}
                  className="fade-in-up text-[15px] text-[#78350F] leading-relaxed p-3 mb-2.5 rounded border-l-3"
                  style={{
                    animationDelay: `${idx * 1.2}s`,
                    backgroundColor: 'rgba(0, 246, 255, 0.08)',
                    borderLeftColor: '#00F6FF'
                  }}
                >
                  {phrase}
                </div>
              ))}
              
              <div
                className="fade-in-up text-center uppercase font-bold text-base mt-5 mb-8 glow-anim"
                style={{
                  animationDelay: '3.6s',
                  color: '#00F6FF'
                }}
              >
                {currentContent.section2.label2}
              </div>
            </>
          )}
        </div>
      )}
      
      {/* SEZIONE 3 - RINASCITA */}
      {(animationPhase === 'section3' || animationPhase === 'complete') && (
        <div className="mb-6">
          <div className="text-center mb-4 text-3xl">🌅</div>
          <p className="text-sm font-bold text-[#78350F] mb-3">{currentContent.section3.intro}</p>
          
          <div
            className="fade-in-up text-[15px] text-[#78350F] leading-relaxed p-3 mb-2.5 rounded border-l-3"
            style={{
              animationDelay: '0s',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderLeftColor: '#F59E0B'
            }}
          >
            {currentContent.section3.phrase1}
          </div>
          
          <div
            className="fade-in-up text-[15px] text-[#78350F] leading-relaxed p-3 mb-2.5 rounded border-l-3"
            style={{
              animationDelay: '1.5s',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderLeftColor: '#F59E0B'
            }}
          >
            {currentContent.section3.phrase2}
          </div>
          
          <div
            className="fade-in-up text-[15px] text-[#78350F] leading-relaxed p-3 mb-2.5 rounded border-l-3"
            style={{
              animationDelay: '3s',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderLeftColor: '#F59E0B'
            }}
          >
            {currentContent.section3.phrase3}
          </div>
          
          <div
            className="fade-in-up scale-bounce text-center text-4xl mt-5 mb-5"
            style={{ animationDelay: '4.5s' }}
          >
            {currentContent.section3.emoji}
          </div>
          
          <div
            className="fade-in-up text-base font-bold text-[#F59E0B] text-center leading-relaxed p-4 rounded"
            style={{
              animationDelay: '5s',
              backgroundColor: 'rgba(245, 158, 11, 0.15)'
            }}
          >
            {currentContent.section3.finalPhrase}
          </div>
        </div>
      )}
      
      {/* FINALE */}
      {animationPhase === 'complete' && (
        <div className="text-center mt-6">
          <button
            onClick={handleShowMotivator}
            className="px-6 py-3 bg-[#D97706] text-white rounded-md font-medium text-sm hover:bg-[#B45309] transition-colors duration-200"
          >
            🔄 Ripeti Motivatore
          </button>
          <p className="text-sm text-[#92400E] mt-3 italic">
            Domani troverai il tuo nuovo motivatore… Ci sarò… Sempre.
          </p>
        </div>
      )}
    </div>
  );
};
