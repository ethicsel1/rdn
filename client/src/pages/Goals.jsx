import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRDN } from '../context/RDNContext';
import TestGlobale from '../components/TestGlobale';

const Goals = () => {
  const { globalGoals, setGlobalGoals, mood, energy, time } = useRDN();
  const [showTest, setShowTest] = useState(false);

  const handleTestComplete = (goals) => {
    setGlobalGoals(goals);
    setShowTest(false);
  };

  const guidanceMessage = () => {
    if (mood === 'fragile' && energy === 'bassa') {
      return 'Oggi puoi scegliere di non concentrarti sugli obiettivi. Va bene così.';
    }
    if (mood === 'pronto' && energy === 'alta') {
      return 'Oggi hai l\'energia per lavorare sui tuoi obiettivi. È il momento giusto.';
    }
    return 'Oggi puoi concentrarti sui tuoi obiettivi. Vai al tuo ritmo.';
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 pb-16">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-secondary">
            Orientamento e Obiettivi
          </h2>
          <p className="text-base md:text-lg text-secondary/70 mt-2">
            Definisci la tua direzione e celebra i tuoi progressi
          </p>
        </motion.div>

        {/* Guidance Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background rounded-lg shadow-lg p-4 sm:p-6"
        >
          <p className="text-base sm:text-lg text-secondary text-center font-medium">
            {guidanceMessage()}
          </p>
        </motion.div>

        {/* Global Test Section */}
        {!showTest && globalGoals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border-2 border-primary/30 rounded-lg shadow-lg p-6 sm:p-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-secondary mb-4">
              Test Globale
            </h3>
            <p className="text-secondary/70 mb-6">
              Definisci i tuoi obiettivi di vita attraverso un percorso guidato di domande
              profonde. Questo test ti aiuterà a creare una direzione chiara per i prossimi 3
              mesi, 1 anno, 3 anni, 10 anni e per tutta la tua vita.
            </p>
            <button
              onClick={() => setShowTest(true)}
              className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all"
            >
              Inizia Test Globale
            </button>
          </motion.div>
        )}

        {/* Test in Progress */}
        {showTest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-primary rounded-lg shadow-lg p-4 sm:p-6"
          >
            <TestGlobale onComplete={handleTestComplete} />
          </motion.div>
        )}

        {/* Global Goals Display */}
        {globalGoals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-secondary">I Tuoi Obiettivi Globali</h3>
              <button
                onClick={() => setGlobalGoals([])}
                className="text-sm text-primary hover:underline"
              >
                Rifare Test
              </button>
            </div>
            <div className="grid gap-4">
              {globalGoals.map((goal, index) => (
                <div
                  key={index}
                  className="bg-background border-2 border-primary/20 rounded-lg p-4 sm:p-6"
                >
                  <h4 className="font-bold text-secondary mb-2">{goal.title}</h4>
                  <p className="text-secondary/70 mb-3">{goal.description}</p>
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <span className="text-secondary font-semibold">
                      Partenza: {goal.startScore}
                    </span>
                    <span className="text-primary font-semibold">
                      Obiettivo: {goal.targetScore}
                    </span>
                    {goal.deadline && (
                      <span className="text-secondary/60">
                        Scadenza: {new Date(goal.deadline).toLocaleDateString('it-IT')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-green/10 border-2 border-green rounded-lg p-4 text-center">
              <p className="text-green font-bold">
                🎉 Hai definito il tuo primo passo. Sei passato dal "non so dove sono" a "so
                esattamente dove voglio arrivare". Questo è coraggio.
              </p>
            </div>
          </motion.div>
        )}

        {/* Progress Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-background rounded-lg shadow-lg p-4 sm:p-6"
        >
          <h3 className="text-lg sm:text-xl font-bold text-secondary mb-4">
            🌟 Il Tuo Viaggio di Rinascita
          </h3>
          <div className="space-y-2 text-secondary/70">
            <p className="font-medium">Questa settimana hai:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Definito il tuo stato emotivo</li>
              <li>Completato il Motivatore Energizzante</li>
              {globalGoals.length > 0 && <li>Creato {globalGoals.length} obiettivi globali</li>}
            </ul>
          </div>
          <button className="mt-4 text-teal underline hover:text-teal/80 font-semibold">
            Vedi Cronologia Completa
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Goals;
