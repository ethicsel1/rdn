// =========================================
// AppWrapper.jsx - Orchestratore Principale Ecosistema RDN
// =========================================

const { useState, useEffect, useContext, createContext, useMemo, useCallback, lazy, Suspense } = React;

// ===== SEZIONE: CONTEXT =====
const RDNContext = createContext(null);

const useRDN = () => {
  const ctx = useContext(RDNContext);
  if (!ctx) throw new Error('useRDN deve essere usato dentro RDNProvider');
  return ctx;
};

// ===== SEZIONE: RDN PROVIDER =====
const RDNProvider = ({ children, user }) => {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [emergencyDetected, setEmergencyDetected] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(null);

  const { rateLimitData, checkRateLimit, incrementRateLimit, loadRateLimits } = useRateLimit(user?.user_id);
  const { checkModuleCache, saveModuleCache: utilsSaveModuleCache } = useModulesCache();

  const [todayMood, setTodayMood] = useUserStorage('todayMood', null);
  const [todaySelection, setTodaySelection] = useUserStorage('todaySelection', null);
  const [currentWeekGoal, setCurrentWeekGoal] = useUserStorage('currentWeekGoal', null);

  useEffect(() => { if (user?.user_id) loadRateLimits(user.subscription_level || 1); }, [user, loadRateLimits]);

  const wrappedCallAI = useCallback(async (promptText, toolType, userContext = {}, isSOS = false, sosIntensity = 0) => {
    const emergencyScan = scanEmergencyKeywords(promptText);
    if (emergencyScan.emergency) {
      setEmergencyDetected(true);
      trackEvent('emergency_triggered', { keyword: emergencyScan.keyword, tool_type: toolType, user_id: user?.user_id });
      return { emergency: true, keyword: emergencyScan.keyword };
    }

    const useSOS = isSOS && (sosIntensity >= 7 || emergencyScan.emergency);
    const limitType = useSOS ? 'sos' : 'base';
    const limitCheck = checkRateLimit(limitType, user?.subscription_level || 1);

    if (!limitCheck.canProceed) {
      trackEvent('rate_limit_hit', { type: limitType, user_id: user?.user_id });
      return { error: 'RATE_LIMIT', message: `Limite raggiunto: ${limitCheck.current}/${limitCheck.max}. SOS rimanenti: ${rateLimitData.sos.max - rateLimitData.sos.current}`, remaining: limitCheck.remaining };
    }

    const variantCheck = trackVariant(user?.user_id, toolType, promptText);
    let enhancedPrompt = promptText;
    if (variantCheck.isVariant) {
      enhancedPrompt += `\n\nNOTA VARIANTE: Utente ha lavorato ${variantCheck.count}× su questa situazione negli ultimi ${variantCheck.days_since_first} giorni. NON ripetere strategie identiche. Fornisci angolazione diversa riconoscendo pattern ricorrente.`;
    }

    setIsLoadingAI(true);
    try {
      const result = await callAI(enhancedPrompt, toolType, { ...userContext, user_id: user?.user_id, subscription_level: user?.subscription_level });
      if (result.success) {
        incrementRateLimit(limitType, user?.subscription_level || 1);
        trackEvent(`tool_used_${toolType}`, { user_id: user?.user_id, variant: variantCheck.isVariant, sos_mode: useSOS });
      }
      return result;
    } finally { setIsLoadingAI(false); }
  }, [user, checkRateLimit, incrementRateLimit, rateLimitData]);

  const openLegalModal = useCallback((type) => setShowLegalModal(type), []);
  const closeLegalModal = useCallback(() => setShowLegalModal(null), []);

  const contextValue = useMemo(() => ({
    user,
    todayMood, setTodayMood,
    todaySelection, setTodaySelection,
    currentWeekGoal, setCurrentWeekGoal,
    callAI: wrappedCallAI,
    trackEvent: (name, meta) => trackEvent(name, { ...meta, user_id: user?.user_id }),
    checkAccess: (level) => checkUserAccess(user, level),
    isLoadingAI,
    emergencyDetected,
    rateLimitRemaining: rateLimitData,
    checkModuleCache,
    saveModuleCache: (id, type, data) => utilsSaveModuleCache(id, type, data, user?.user_id),
    checkSituationCache,
    saveSituationCache: (tool, id, text, output) => saveSituationCache(tool, id, text, output, user?.user_id),
    trackVariant: (tool, situation) => trackVariant(user?.user_id, tool, situation),
    checkMilestone: (tool, count, milestones) => checkMilestone(user?.user_id, tool, count, milestones),
    openLegalModal,
    closeLegalModal
  }), [user, todayMood, todaySelection, currentWeekGoal, wrappedCallAI, isLoadingAI, emergencyDetected, rateLimitData, checkModuleCache, utilsSaveModuleCache, openLegalModal, closeLegalModal]);

  return (
    <RDNContext.Provider value={contextValue}>
      {children}
      {showLegalModal && (
        <Suspense fallback={<LoadingOverlay />}>
          <LegalModals type={showLegalModal} onClose={closeLegalModal} />
        </Suspense>
      )}
    </RDNContext.Provider>
  );
};

// ===== SEZIONE: MAINTENANCE HOOK =====
const useMaintenanceCheck = () => {
  const [maintenance, setMaintenance] = useState(null);
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          setMaintenance(data.status === 'maintenance' ? { estimatedEnd: data.estimated_end, message: data.message } : null);
        }
      } catch {}
    };
    check();
    const i = setInterval(check, 300000);
    return () => clearInterval(i);
  }, []);
  return maintenance;
};

// ===== SEZIONE: RDN CONTEXT CONSUMER =====
const RDNContextConsumer = () => {
  const { emergencyDetected, isLoadingAI } = useRDN();
  return (
    <>
      {emergencyDetected && <EmergencyScreen />}
      {isLoadingAI && <LoadingOverlay />}
    </>
  );
};

// ===== SEZIONE: RDN GLOBAL EXPOSER =====
const RDNGlobalExposer = ({ user }) => {
  const rdnContext = useRDN();
 useEffect(() => {
  // NON sovrascrivere window.RDN, solo aggiungere proprietà
  window.RDN = window.RDN || {};
  
  // Aggiungi proprietà senza cancellare data
  Object.assign(window.RDN, {
    version: '1.0.0',
    config: {
      company: RDN_CONFIG.company,
      emergency: RDN_CONFIG.company.emergencyNumbers
    },
    levels: {
      level1: { price: '€9,90/settimana', limits: RDN_CONFIG.rateLimits.level1 },
      level2: { price: '€19,90/settimana', limits: RDN_CONFIG.rateLimits.level2 }
    },
    useRDN: () => rdnContext,
    callAI: rdnContext.callAI,
    trackEvent: rdnContext.trackEvent,
    checkAccess: rdnContext.checkAccess,
    trackVariant: rdnContext.trackVariant,
    checkMilestone: rdnContext.checkMilestone,
    checkModuleCache: rdnContext.checkModuleCache,
    saveModuleCache: rdnContext.saveModuleCache,
    checkSituationCache: rdnContext.checkSituationCache,
    saveSituationCache: rdnContext.saveSituationCache,
    openLegalModal: rdnContext.openLegalModal,
    user: {
      id: user?.user_id,
      email: user?.email,
      level: user?.subscription_level,
      status: user?.subscription_status
    },
    scanEmergencyKeywords,
    checkUserAccess: (level) => checkUserAccess(user, level)
  });
  
  console.log('✅ window.RDN aggiornato, data presente:', !!window.RDN.data);
}, [user, rdnContext]);
  return null;
};

// ===== SEZIONE: MAIN APP WRAPPER =====
const AppWrapper = ({ children }) => {
  const { user, isLoading: userLoading, error: userError } = useAmemberUser();
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const maintenance = useMaintenanceCheck();

  useEffect(() => {
    const consent = localStorage.getItem('rdn_cookies_consent');
    if (!consent) {
      setShowCookieBanner(true);
    } else {
      setAnalyticsConsent(consent === 'all');
      if (consent === 'all' && RDN_CONFIG.analytics.trackingId) loadGoogleAnalytics();
    }
  }, []);

  useEffect(() => {
    if (user?.user_id) {
      const completed = localStorage.getItem(`rdn_user_${user.user_id}_onboarding_completed`);
      if (!completed) {
        setShowOnboarding(true);
        trackEvent('first_access', { user_id: user.user_id, subscription_level: user.subscription_level });
      }
    }
  }, [user]);

  const loadGoogleAnalytics = useCallback(() => {
    if (!RDN_CONFIG.analytics.trackingId) return;
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${RDN_CONFIG.analytics.trackingId}`;
    script.async = true;
    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', RDN_CONFIG.analytics.trackingId);
      RDN_CONFIG.analytics.enabled = true;
    };
    document.head.appendChild(script);
  }, []);

  const handleCookieAcceptAll = useCallback(() => {
    localStorage.setItem('rdn_cookies_consent', 'all');
    setAnalyticsConsent(true);
    setShowCookieBanner(false);
    loadGoogleAnalytics();
    trackEvent('cookie_consent_all');
  }, [loadGoogleAnalytics]);

  const handleCookieEssentialOnly = useCallback(() => {
    localStorage.setItem('rdn_cookies_consent', 'essential');
    setAnalyticsConsent(false);
    setShowCookieBanner(false);
    trackEvent('cookie_consent_essential');
  }, []);

  const handleCookieCustomize = useCallback(() => {
    setShowCookieBanner(false);
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
    trackEvent('onboarding_completed', { user_id: user?.user_id });
  }, [user]);

  if (userLoading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
        <LoadingOverlay />
      </div>
    );
  }

  if (userError === 'NOT_AUTHENTICATED' || !user) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'20px', textAlign:'center', backgroundColor:'#F9FAFB' }}>
        <div style={{ fontSize:'64px', marginBottom:'20px' }}>🔐</div>
        <h1 style={{ fontSize:'28px', fontWeight:'bold', color:'#1F2937', marginBottom:'15px' }}>Errore: dati utente non disponibili</h1>
        <p style={{ color:'#6B7280', maxWidth:'400px' }}>Non siamo riusciti a recuperare i tuoi dati. Contatta il supporto tecnico.</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <RDNProvider user={user}>
        <RDNGlobalExposer user={user} />
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
          {maintenance && <MaintenanceBanner estimatedEnd={maintenance.estimatedEnd} message={maintenance.message} />}
          {showCookieBanner && <CookieBanner onAcceptAll={handleCookieAcceptAll} onEssentialOnly={handleCookieEssentialOnly} onCustomize={handleCookieCustomize} />}
          {showOnboarding && <OnboardingOverlay userId={user.user_id} onComplete={handleOnboardingComplete} />}
          <RDNContextConsumer />
          {children}
        </div>
      </RDNProvider>
    </ErrorBoundary>
  );
};

window.AppWrapper = AppWrapper;

// ===== MOUNT REACT =====
setTimeout(() => {
  const container = document.getElementById('rdn-app-rdn');
  if (!container) {
    console.error('❌ Container non trovato');
    return;
  }
  if (!window.Schermata1) {
    console.error('❌ Schermata1 non definita');
    return;
  }
  const root = ReactDOM.createRoot(container);
  const Schermata1Component = window.Schermata1;
  root.render(
    <AppWrapper>
      <Schermata1Component />
    </AppWrapper>
  );
  console.log('✅ React montato');
}, 1000);
