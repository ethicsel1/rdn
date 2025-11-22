// ===== GENERALI 5 di 5 utils.js =====
// =========================================
// utils.js - RDN Core Configuration & Utilities
// =========================================

// ===== SEZIONE: CONFIGURATION =====
const RDN_CONFIG = {
  ai: {
    // Configurazione AI gestita dal plugin - non modificare
  },
  amember: {
    productIdL1: 1,
    productIdL2: 2
  },
  wordpress: {
    baseUrl: window.location.origin,
    apiNamespace: '/wp-json/rdn/v1'
  },
  analytics: {
    trackingId: '',
    enabled: false
  },
  rateLimits: {
    level1: { daily: 5, sos: 3 },
    level2: { daily: 15, sos: 3 }
  },
  company: {
    name: 'RDN - Rinascita Definitiva dai Narcisisti',
    owner: 'Fabrizio Mardegan',
    email: 'info@narcisismopatologicosconfitto.com',
    address: 'Paraje Ardal sn, 35100 Yecla, Murcia, España',
    nie: 'Y5979647Y',
    emergencyNumbers: {
      emergency: '112',
      telefonoAmico: '024'
    }
  }
};

// ===== SEZIONE: EMERGENCY DETECTION =====
function scanEmergencyKeywords(text) {
  const keywords = ['suicidio','voglio morire','togliermi la vita','uccidermi','autolesionismo','mi taglio','mi faccio del male','non sento corpo','dissocio','mi sta picchiando','violenza ora','non ce la faccio più','farla finita'];
  try {
    const norm = text.toLowerCase().trim();
    for (const kw of keywords) if (norm.includes(kw)) return { emergency: true, keyword: kw, timestamp: new Date().toISOString() };
    return { emergency: false };
  } catch (e) {
    console.error('Error scanning emergency:', e);
    return { emergency: false };
  }
}

// ===== SEZIONE: AI API INTEGRATION =====
// Gestita dal plugin backend - non modificare

// ===== SEZIONE: VARIANT TRACKING =====
function trackVariant(userId, toolName, situationText) {
  try {
    const key = `rdn_variants_${userId}`, vars = JSON.parse(localStorage.getItem(key) || '{}');
    const hash = btoa(situationText).substring(0, 16), now = Date.now(), cutoff = now - 7776000000;
    if (!vars[toolName]) vars[toolName] = {};
    if (!vars[toolName][hash]) vars[toolName][hash] = [];
    vars[toolName][hash] = vars[toolName][hash].filter(e => e.timestamp > cutoff);
    if (vars[toolName][hash].length >= 3) {
      const first = vars[toolName][hash][0];
      return { isVariant: true, count: vars[toolName][hash].length, days_since_first: Math.floor((now - first.timestamp) / 86400000) };
    }
    vars[toolName][hash].push({ timestamp: now, count: vars[toolName][hash].length + 1 });
    localStorage.setItem(key, JSON.stringify(vars));
    return { isVariant: false };
  } catch (e) {
    console.error('Error tracking variant:', e);
    return { isVariant: false };
  }
}

// ===== SEZIONE: MILESTONE TRACKING =====
function checkMilestone(userId, toolName, currentCount, milestones = [5,15,30,60,100,200]) {
  try {
    const msgs = {
      5:{emoji:'🌱',message:'Primi passi completati! Continua così.'},
      15:{emoji:'🌿',message:'Grande progresso! Stai costruendo abitudini sane.'},
      30:{emoji:'🌳',message:'Un mese di crescita! Sei sulla strada giusta.'},
      60:{emoji:'🏆',message:'Due mesi di impegno! Risultati straordinari.'},
      100:{emoji:'⭐',message:'Traguardo centenario! La tua dedizione è ispiratrice.'},
      200:{emoji:'💎',message:'Maestro del percorso! 200 passi verso la libertà.'}
    };
    const m = milestones.find(x => x === currentCount);
    if (!m) return { showModal: false };
    const key = `rdn_milestone_${userId}_${toolName}_${m}`;
    if (localStorage.getItem(key)) return { showModal: false };
    localStorage.setItem(key, 'true');
    return { showModal: true, milestone_reached: m, emoji: msgs[m]?.emoji || '🎉', message: msgs[m]?.message || 'Traguardo raggiunto!' };
  } catch (e) {
    console.error('Error checking milestone:', e);
    return { showModal: false };
  }
}

// ===== SEZIONE: ANALYTICS =====
function trackEvent(eventName, metadata = {}) {
  try {
    const ts = new Date().toISOString();
    console.debug(`[RDN Event] ${eventName}`, { ...metadata, timestamp_utc: ts });
    if (RDN_CONFIG.analytics.enabled && typeof window.gtag === 'function') window.gtag('event', eventName, { ...metadata, timestamp_utc: ts });
  } catch (e) {
    console.error('Error tracking event:', e);
  }
}

// ===== SEZIONE: SITUATION CACHE =====
async function checkSituationCache(toolName, situationId) {
  try {
    const res = await fetch(`${RDN_CONFIG.wordpress.baseUrl}${RDN_CONFIG.wordpress.apiNamespace}/situations-cache/${toolName}/${situationId}`);
    return res.ok ? await res.json() : null;
  } catch (e) {
    console.error('Error checking situation cache:', e);
    return null;
  }
}

async function saveSituationCache(toolName, situationId, situationText, output, userId) {
  try {
    const res = await fetch(`${RDN_CONFIG.wordpress.baseUrl}${RDN_CONFIG.wordpress.apiNamespace}/situations-cache`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_name: toolName, situation_id: situationId, situation_text: situationText, output, timestamp: new Date().toISOString(), generator_user_id: userId })
    });
    return res.ok ? await res.json() : null;
  } catch (e) {
    console.error('Error saving situation cache:', e);
    return null;
  }
}

// ===== SEZIONE: MODULE CACHE =====
async function checkModuleCache(moduleId) {
  try {
    const ctrl = new AbortController(), tid = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(`${RDN_CONFIG.wordpress.baseUrl}${RDN_CONFIG.wordpress.apiNamespace}/modules-cache/${moduleId}`, { signal: ctrl.signal });
    clearTimeout(tid);
    if (res.ok) {
      const d = await res.json();
      return { sections: d.sections, generated: true, timestamp: d.timestamp };
    }
    return null;
  } catch (e) {
    console.error('Error checking module cache:', e);
    return null;
  }
}

async function saveModuleCache(moduleId, moduleType, sectionsData, userId) {
  try {
    const res = await fetch(`${RDN_CONFIG.wordpress.baseUrl}${RDN_CONFIG.wordpress.apiNamespace}/modules-cache`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module_id: moduleId, type: moduleType, sections: sectionsData, timestamp: new Date().toISOString(), generator_user_id: userId })
    });
    if (!res.ok) setTimeout(() => saveModuleCache(moduleId, moduleType, sectionsData, userId), 5000);
  } catch (e) {
    console.error('Error saving module cache:', e);
    setTimeout(() => saveModuleCache(moduleId, moduleType, sectionsData, userId), 5000);
  }
}

// ===== SEZIONE: USER ACCESS CONTROL =====
function checkUserAccess(user, requiredLevel = 1) {
  try {
    return !!(user && user.subscription_status === 'active' && user.subscription_level >= requiredLevel);
  } catch (e) {
    console.error('Error checking user access:', e);
    return false;
  }
}

// Esporta su window
window.RDN_CONFIG = RDN_CONFIG;
window.scanEmergencyKeywords = scanEmergencyKeywords;
window.trackVariant = trackVariant;
window.checkMilestone = checkMilestone;
window.trackEvent = trackEvent;
window.checkSituationCache = checkSituationCache;
window.saveSituationCache = saveSituationCache;
window.checkModuleCache = checkModuleCache;
window.saveModuleCache = saveModuleCache;
window.checkUserAccess = checkUserAccess;
