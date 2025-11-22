// ===== GENERALI 3 di 5 hooks.js =====
// =========================================
// hooks.js - RDN Custom React Hooks
// =========================================

// ===== HOOK: useAmemberUser =====
function useAmemberUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const parseUser = useCallback(() => {
    try {
      if (!window.AM_USER) {
        // Mock user per testing
        setUser({
          user_id: 999,
          email: 'test@test.com',
          subscription_level: 1,
          subscription_status: 'active',
          subscription_start_date: new Date().toISOString()
        });
        setError(null);
        return;
      }
      const am = window.AM_USER;
      let level = 1;
      if (am.product_id === RDN_CONFIG.amember.productIdL2 || (Array.isArray(am.product_id) && am.product_id.includes(RDN_CONFIG.amember.productIdL2))) level = 2;
      setUser({
        user_id: am.user_id || am.id,
        email: am.email,
        subscription_level: level,
        subscription_status: (am.status === 1 || am.status === 'active') ? 'active' : 'inactive',
        subscription_start_date: am.start_date || am.subscription_start_date
      });
      setError(null);
    } catch (e) {
      console.error('Error parsing AM_USER:', e);
      setError('PARSE_ERROR');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    parseUser();
    const interval = setInterval(parseUser, 60000);
    return () => clearInterval(interval);
  }, [parseUser]);

  return { user, isLoading, error };
}

// ===== HOOK: useRateLimit =====
function useRateLimit(userId) {
  const [rateLimitData, setRateLimitData] = useState({
    base: { current: 0, max: 0 },
    sos: { current: 0, max: 0 }
  });

  const getUTCDate = useCallback(() => new Date().toISOString().split('T')[0], []);
  const getStorageKey = useCallback((type) => `rdn_ratelimit_${type === 'sos' ? 'sos_' : ''}${userId}_${getUTCDate()}`, [userId, getUTCDate]);

  const loadRateLimits = useCallback((userLevel) => {
    try {
      const limits = userLevel === 2 ? RDN_CONFIG.rateLimits.level2 : RDN_CONFIG.rateLimits.level1;
      const baseKey = getStorageKey('base'), sosKey = getStorageKey('sos');
      const baseCurrent = parseInt(localStorage.getItem(baseKey) || '0', 10);
      const sosCurrent = parseInt(localStorage.getItem(sosKey) || '0', 10);
      setRateLimitData({
        base: { current: baseCurrent, max: limits.daily },
        sos: { current: sosCurrent, max: limits.sos }
      });
    } catch (e) {
      console.error('Error loading rate limits:', e);
    }
  }, [getStorageKey]);

  const checkRateLimit = useCallback((type, userLevel) => {
    try {
      const limits = userLevel === 2 ? RDN_CONFIG.rateLimits.level2 : RDN_CONFIG.rateLimits.level1;
      const max = type === 'sos' ? limits.sos : limits.daily;
      const current = parseInt(localStorage.getItem(getStorageKey(type)) || '0', 10);
      return { canProceed: current < max, current, max, remaining: max - current };
    } catch (e) {
      console.error('Error checking rate limit:', e);
      return { canProceed: false, current: 0, max: 0, remaining: 0 };
    }
  }, [getStorageKey]);

  const incrementRateLimit = useCallback((type = 'base', userLevel) => {
    try {
      const key = getStorageKey(type);
      const limits = userLevel === 2 ? RDN_CONFIG.rateLimits.level2 : RDN_CONFIG.rateLimits.level1;
      const max = type === 'sos' ? limits.sos : limits.daily;
      const current = parseInt(localStorage.getItem(key) || '0', 10);
      if (current >= max) return false;
      localStorage.setItem(key, String(current + 1));
      loadRateLimits(userLevel);
      return true;
    } catch (e) {
      console.error('Error incrementing rate limit:', e);
      return false;
    }
  }, [getStorageKey, loadRateLimits]);

  return { rateLimitData, checkRateLimit, incrementRateLimit, loadRateLimits };
}

// ===== HOOK: useUserStorage =====
function useUserStorage(key, defaultValue = null) {
  const userId = 999; // Per ora hardcoded, poi verrà passato dal context
  const getKey = useCallback((k) => `rdn_user_${userId}_${k}`, [userId]);

  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(getKey(key));
      if (!stored) return defaultValue;
      const parsed = JSON.parse(stored);
      return parsed.value !== undefined ? parsed.value : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const saveValue = useCallback((newValue) => {
    try {
      const data = { value: newValue, timestamp: new Date().toISOString() };
      localStorage.setItem(getKey(key), JSON.stringify(data));
      setValue(newValue);
      return true;
    } catch {
      return false;
    }
  }, [getKey, key]);

  return [value, saveValue];
}

// ===== HOOK: useModulesCache =====
function useModulesCache() {
  const checkModuleCache = useCallback(async (moduleId) => {
    try {
      return await window.checkModuleCache(moduleId);
    } catch (e) {
      console.error('Error checking module cache:', e);
      return null;
    }
  }, []);

  const saveModuleCache = useCallback(async (moduleId, type, data, userId) => {
    try {
      await window.saveModuleCache(moduleId, type, data, userId);
      return true;
    } catch (e) {
      console.error('Error saving module cache:', e);
      setTimeout(() => window.saveModuleCache(moduleId, type, data, userId), 5000);
      return false;
    }
  }, []);

  return { checkModuleCache, saveModuleCache };
}

// Esporta su window
window.useAmemberUser = useAmemberUser;
window.useRateLimit = useRateLimit;
window.useUserStorage = useUserStorage;
window.useModulesCache = useModulesCache;
