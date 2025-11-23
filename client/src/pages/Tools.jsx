import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRDN } from '../context/RDNContext';
import RinforzoDelGiorno from '../components/RinforzoDelGiorno';

const Tools = () => {
  const { mood, energy, time } = useRDN();
  const [showRinforzo, setShowRinforzo] = useState(false);

  const planMessage = mood && energy && time
    ? `Basato su: ${mood === 'fragile' ? 'Fragile' : mood === 'incerto' ? 'Incerto' : 'Pronto'} + ${time} + Energia ${energy}`
    : 'Completa il benvenuto per vedere il tuo piano personalizzato';

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 pb-16">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-secondary">Strumenti di Rinascita</h2>
          <p className="text-base md:text-lg text-secondary/70 mt-2">
            Il tuo kit quotidiano per la trasformazione
          </p>
        </motion.div>

        {/* Sticky Plan Box */}
        <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-secondary mb-2">📋 IL TUO PIANO OGGI</h3>
          <p className="text-sm sm:text-base text-secondary/80">
            {planMessage}
          </p>
        </div>

        {/* Rinforzo Modal */}
        {showRinforzo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <RinforzoDelGiorno onComplete={() => {
                alert('✨ Rinforzo completato! Torna domani per un nuovo messaggio.');
                setShowRinforzo(false);
              }} />
              <button
                onClick={() => setShowRinforzo(false)}
                className="mt-6 w-full bg-gray-200 text-secondary font-semibold py-2 rounded-lg hover:bg-gray-300"
              >
                Chiudi
              </button>
            </motion.div>
          </div>
        )}

        {/* Level 1 Tools */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold text-secondary">Strumenti Livello 1</h3>

          {/* Tool Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Rinforzo del Giorno */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-background border-2 border-primary rounded-lg p-4 sm:p-6 shadow-lg"
            >
              <h4 className="text-lg sm:text-xl font-bold text-secondary mb-2">Rinforzo del Giorno</h4>
              <p className="text-sm sm:text-base text-secondary/70 mb-4">
                Messaggio multisensoriale con testo e musica. Il tuo rituale quotidiano.
              </p>
              <div className="flex items-center justify-between mb-4 text-sm">
                <span className="bg-green/20 text-green px-3 py-1 rounded-full font-semibold">
                  Disponibile oggi
                </span>
                <span className="text-secondary/60">1/giorno</span>
              </div>
              <button
                onClick={() => setShowRinforzo(true)}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all"
              >
                Accedi al Rinforzo
              </button>
            </motion.div>

            {/* Trasformatore Emotivo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-background border-2 border-primary rounded-lg p-4 sm:p-6 shadow-lg"
            >
              <h4 className="text-lg sm:text-xl font-bold text-secondary mb-2">Trasformatore Emotivo</h4>
              <p className="text-sm sm:text-base text-secondary/70 mb-4">
                Routine rapida 5-10 min per trasformare emozioni pesanti in forza.
              </p>
              <div className="flex items-center justify-between mb-4 text-sm">
                <span className="text-secondary/60">5/giorno</span>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full font-semibold">
                  5 rimasti
                </span>
              </div>
              <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all">
                Usa Trasformatore
              </button>
            </motion.div>

            {/* Scudo AntiAbuso */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-background border-2 border-primary rounded-lg p-4 sm:p-6 shadow-lg"
            >
              <h4 className="text-lg sm:text-xl font-bold text-secondary mb-2">Scudo AntiAbuso</h4>
              <p className="text-sm sm:text-base text-secondary/70 mb-4">
                Chiarezza immediata per situazioni tossiche. 900 situazioni precaricate.
              </p>
              <div className="flex items-center justify-between mb-4 text-sm">
                <span className="text-secondary/60">5/giorno</span>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full font-semibold">
                  5 rimasti
                </span>
              </div>
              <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all">
                Attiva Scudo
              </button>
            </motion.div>

            {/* SOS Situazioni Critiche */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-background border-2 border-red rounded-lg p-4 sm:p-6 shadow-lg"
            >
              <h4 className="text-lg sm:text-xl font-bold text-red mb-2">SOS Situazioni Critiche</h4>
              <p className="text-sm sm:text-base text-secondary/70 mb-4">
                Protocolli emergenza per crisi emotive acute. Supporto immediato.
              </p>
              <div className="flex items-center justify-between mb-4 text-sm">
                <span className="text-secondary/60">3/giorno</span>
                <span className="bg-red/20 text-red px-3 py-1 rounded-full font-semibold">
                  3 rimasti
                </span>
              </div>
              <button className="w-full bg-red text-white font-bold py-3 rounded-lg hover:bg-red/90 transition-all">
                SOS Supporto
              </button>
            </motion.div>
          </div>
        </div>

        {/* Level 2 Upgrade Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 sm:p-8 text-white shadow-xl"
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-3">Sblocca Livello 2</h3>
          <p className="text-base sm:text-lg mb-4 opacity-90">
            Accedi a 4 strumenti avanzati per una rinascita completa
          </p>
          <ul className="space-y-2 mb-6 opacity-90 text-sm sm:text-base">
            <li>✨ Spada della Vittoria - Frase-simbolo settimanale</li>
            <li>✨ Trasformatore Avanzato - Routine immersive illimitate</li>
            <li>✨ Cosa Dire Fare Pensare - Evoluzione dello Scudo</li>
            <li>✨ Moduli Obiettivi - 50 obiettivi guidati</li>
          </ul>
          <button className="bg-white text-primary font-bold py-3 px-6 sm:px-8 rounded-lg hover:bg-white/90 transition-all">
            Scopri Livello 2
          </button>
        </motion.div>

        {/* Footer Motivation */}
        <div className="text-center space-y-3 sm:space-y-4 py-6 sm:py-8">
          <p className="text-base sm:text-lg text-secondary px-4">
            Ogni strumento che usi è un atto d'amore verso te stesso. Continua così.
          </p>
          <div className="inline-flex items-center gap-2 bg-green/20 text-green px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base">
            🏆 Sei in questo percorso
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
