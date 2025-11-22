// ===== GENERALI ultimo viralita.js (lo inserisco qui perchè è senza categoria) =====
// BadgeProgress.jsx - VERSIONE CORRETTA
// Sidebar component per visualizzare progresso viralità (Guide + Badge)

const BadgeProgress = () => {
  const { user_level } = useRDN();
  const [viralityData, setViralityData] = useUserStorage('rdn_virality_data', {
    total_shares: 0,
    unlocked_guides: [],
    unlocked_badges: [],
    last_share_timestamp: null
  });

  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentBadge, setCurrentBadge] = useState(null);

  // Verifica accesso
  if (user_level < 1) return null;

  // Effect: Verifica caricamento dati - CORRECTED
  useEffect(() => {
    const checkData = () => {
      if (window.RDN?.data?.virality_badges) {
        setDataLoaded(true);
      } else {
        setTimeout(checkData, 100);
      }
    };
    checkData();
  }, []);

  // Effect: Calcola badge corrente
  useEffect(() => {
    if (!dataLoaded) return;

    const badges = window.RDN.data.virality_badges;
    const earned = badges.filter(b => b.shares <= viralityData.total_shares);
    const current = earned.length > 0 ? earned[earned.length - 1] : badges[0];

    setCurrentBadge(current);
  }, [dataLoaded, viralityData.total_shares]);

  // Loading
  if (!dataLoaded || !currentBadge) {
    return (
      <div className="bg-[#FEF3C7] p-4 rounded-lg border-l-4 border-[#F59E0B] mb-4">
        <div className="h-4 bg-[#E5E7EB] rounded animate-pulse"></div>
      </div>
    );
  }

  const unlockedCount = viralityData.unlocked_guides.length;
  const progressPercent = Math.min((viralityData.total_shares / 30) * 100, 100);

  return (
    <div className="bg-[#FEF3C7] p-4 rounded-lg border-l-4 border-[#F59E0B] mb-4">
      {/* Header */}
      <h3 className="text-base font-bold text-[#78350F] mb-3">Il Tuo Impatto</h3>

      {/* Badge corrente */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{currentBadge.emoji}</span>
        <span className="text-sm font-bold text-[#78350F]">{currentBadge.name}</span>
      </div>

      {/* Guide sbloccate */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">📚</span>
        <span className="text-sm text-[#6B7280]">{unlockedCount}/30 Guide</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-[#F59E0B] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Link dashboard */}
      <a
        href="#virality-dashboard"
        className="text-xs text-[#14B8A6] underline hover:text-[#0D9488] transition-colors inline-block mt-2"
        onClick={(e) => {
          e.preventDefault();
          console.log('Apri dashboard viralità');
        }}
      >
        Vedi Tutte →
      </a>
    </div>
  );
};

// Registra globalmente senza sovrascrivere
if (window.RDN) {
  window.RDN.BadgeProgress = BadgeProgress;
} else {
  window.RDN = { BadgeProgress };
}
