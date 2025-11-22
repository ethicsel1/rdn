// liste.js - Carica liste da database
(async function() {
  while (!window.RDN_WP_CONFIG) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  try {
    const baseUrl = window.RDN_WP_CONFIG.base_url;
    const res = await fetch(`${baseUrl}/wp-json/rdn/v1/lists/rdn/all_data`);
    if (res.ok) {
      const data = await res.json();
      window.RDN = window.RDN || {};
      window.RDN.data = JSON.parse(data.list_data);
      console.log('✅ RDN.data caricato:', Object.keys(window.RDN.data));
    } else {
      console.error('❌ Errore HTTP:', res.status);
    }
  } catch(e) {
    console.error('❌ Errore caricamento liste:', e);
  }
})();
