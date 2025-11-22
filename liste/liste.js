// liste.js - Carica liste da database - CARICA PRIMA DI REACT
(async function() {
  console.log('🔄 Inizio caricamento liste.js');
  
  while (!window.RDN_WP_CONFIG) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  try {
    const baseUrl = window.RDN_WP_CONFIG.base_url;
    const res = await fetch(`${baseUrl}/wp-json/rdn/v1/lists/rdn/all_data`);
    
    if (res.ok) {
      const data = await res.json();
      const parsedData = JSON.parse(data.list_data);
      
      // CREA window.RDN se non esiste
      if (!window.RDN) {
        window.RDN = {};
      }
      
      // IMPOSTA data
      window.RDN.data = parsedData;
      
      // MARCA come caricato
      window.RDN.dataLoaded = true;
      
      console.log('✅ RDN.data caricato:', Object.keys(window.RDN.data));
      console.log('✅ Motivators keys:', Object.keys(window.RDN.data.motivators || {}));
      
      // DISPATCHA evento
      window.dispatchEvent(new Event('rdn-data-loaded'));
    } else {
      console.error('❌ HTTP:', res.status);
    }
  } catch(e) {
    console.error('❌ Errore:', e);
  }
})();
