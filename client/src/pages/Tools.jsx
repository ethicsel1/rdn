const Tools = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary">Strumenti di Rinascita</h2>
          <p className="text-lg text-secondary/70 mt-2">
            Il tuo kit quotidiano per la trasformazione
          </p>
        </div>

        {/* Sticky Plan Box */}
        <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 sticky top-4">
          <h3 className="text-lg font-bold text-secondary mb-2">📋 IL TUO PIANO OGGI</h3>
          <p className="text-secondary/80">
            Basato su: <span className="font-semibold">Pronto + 30 min + Energia alta</span>
          </p>
        </div>

        {/* Level 1 Tools */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-secondary">Strumenti Livello 1</h3>

          {/* Tool Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rinforzo del Giorno */}
            <div className="bg-background border-2 border-primary rounded-lg p-6 shadow-lg">
              <h4 className="text-xl font-bold text-secondary mb-2">Rinforzo del Giorno</h4>
              <p className="text-secondary/70 mb-4">
                Messaggio multisensoriale con testo, voce e musica. Il tuo rituale quotidiano.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm bg-green/20 text-green px-3 py-1 rounded-full font-semibold">
                  Disponibile oggi
                </span>
                <span className="text-sm text-secondary/60">1/giorno</span>
              </div>
              <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all">
                Accedi al Rinforzo
              </button>
            </div>

            {/* Trasformatore Emotivo */}
            <div className="bg-background border-2 border-primary rounded-lg p-6 shadow-lg">
              <h4 className="text-xl font-bold text-secondary mb-2">Trasformatore Emotivo</h4>
              <p className="text-secondary/70 mb-4">
                Routine rapida 5-10 min per trasformare emozioni pesanti in forza.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-secondary/60">5/giorno</span>
                <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full font-semibold">
                  3 rimasti
                </span>
              </div>
              <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all">
                Usa Trasformatore
              </button>
            </div>

            {/* Scudo AntiAbuso */}
            <div className="bg-background border-2 border-primary rounded-lg p-6 shadow-lg">
              <h4 className="text-xl font-bold text-secondary mb-2">Scudo AntiAbuso</h4>
              <p className="text-secondary/70 mb-4">
                Chiarezza immediata per situazioni tossiche. 900 situazioni precaricate.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-secondary/60">5/giorno</span>
                <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full font-semibold">
                  5 rimasti
                </span>
              </div>
              <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all">
                Attiva Scudo
              </button>
            </div>

            {/* SOS Situazioni Critiche */}
            <div className="bg-background border-2 border-red rounded-lg p-6 shadow-lg">
              <h4 className="text-xl font-bold text-red mb-2">SOS Situazioni Critiche</h4>
              <p className="text-secondary/70 mb-4">
                Protocolli emergenza per crisi emotive acute. Supporto immediato.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-secondary/60">3/giorno</span>
                <span className="text-sm bg-red/20 text-red px-3 py-1 rounded-full font-semibold">
                  3 rimasti
                </span>
              </div>
              <button className="w-full bg-red text-white font-bold py-3 rounded-lg hover:bg-red/90 transition-all">
                SOS Supporto
              </button>
            </div>
          </div>
        </div>

        {/* Level 2 Upgrade Banner */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-3">Sblocca Livello 2</h3>
          <p className="text-lg mb-4 opacity-90">
            Accedi a 4 strumenti avanzati per una rinascita completa
          </p>
          <ul className="space-y-2 mb-6 opacity-90">
            <li>✨ Spada della Vittoria - Frase-simbolo settimanale</li>
            <li>✨ Trasformatore Avanzato - Routine immersive illimitate</li>
            <li>✨ Cosa Dire Fare Pensare - Evoluzione dello Scudo</li>
            <li>✨ Moduli Obiettivi - 50 obiettivi guidati</li>
          </ul>
          <button className="bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-white/90 transition-all">
            Scopri Livello 2
          </button>
        </div>

        {/* Footer Motivation */}
        <div className="text-center space-y-2 py-8">
          <p className="text-lg text-secondary">
            Ogni strumento che usi è un atto d'amore verso te stesso. Continua così.
          </p>
          <div className="inline-flex items-center gap-2 bg-green/20 text-green px-6 py-3 rounded-full font-bold">
            🏆 7 giorni consecutivi
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
