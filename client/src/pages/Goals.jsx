const Goals = () => {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary">Orientamento e Obiettivi</h2>
          <p className="text-lg text-secondary/70 mt-2">
            Definisci la tua direzione e celebra i tuoi progressi
          </p>
        </div>

        {/* Guidance Message */}
        <div className="bg-background rounded-lg shadow-lg p-6">
          <p className="text-lg text-secondary text-center">
            Oggi puoi concentrarti sui tuoi obiettivi. Vai al tuo ritmo.
          </p>
        </div>

        {/* Global Test Placeholder */}
        <div className="bg-white border-2 border-primary/30 rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-secondary mb-4">Test Globale</h3>
          <p className="text-secondary/70 mb-6">
            Definisci i tuoi obiettivi di vita attraverso un percorso guidato di domande profonde.
          </p>
          <button className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all">
            Inizia Test Globale
          </button>
        </div>

        {/* Progress Box Placeholder */}
        <div className="bg-background rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-secondary mb-4">🌟 Il Tuo Viaggio di Rinascita</h3>
          <div className="space-y-2 text-secondary/70">
            <p>Questa settimana hai:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Definito 3 stati emotivi</li>
              <li>Completato 5 rinforzi</li>
              <li>Lavorato su 8 emozioni</li>
            </ul>
          </div>
          <button className="mt-4 text-teal underline hover:text-teal/80">
            Vedi Cronologia Completa
          </button>
        </div>

        {/* Weekly Test Placeholder */}
        <div className="bg-white border-2 border-secondary/30 rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-secondary mb-4">Focus Settimanale</h3>
          <p className="text-secondary/70 mb-6">
            Scegli un obiettivo su cui concentrarti per i prossimi 7 giorni.
          </p>
          <button className="bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary/90 transition-all">
            Definisci Focus Settimanale
          </button>
        </div>

        {/* Daily Plan */}
        <div className="bg-primary/10 border-2 border-primary rounded-lg p-6">
          <h3 className="text-lg font-bold text-secondary mb-2">📋 Piano di Oggi</h3>
          <p className="text-secondary/70">
            Strumenti consigliati per il tuo obiettivo settimanale appariranno qui.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Goals;
