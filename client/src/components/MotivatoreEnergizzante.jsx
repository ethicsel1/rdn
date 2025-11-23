import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTodayMotivatore } from '../data/motivatore';

const MotivatoreEnergizzante = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState(0); // 0: difficolta, 1: speranza, 2: rinascita
  const [narrative] = useState(getTodayMotivatore());
  const [isComplete, setIsComplete] = useState(false);

  const phases = [
    {
      title: 'La Difficoltà',
      text: narrative.difficolta,
      color: 'text-secondary/70',
      bg: 'bg-gray-100',
      duration: 6000,
    },
    {
      title: 'La Speranza',
      text: narrative.speranza,
      color: 'text-primary',
      bg: 'bg-primary/10',
      duration: 6000,
    },
    {
      title: 'La Rinascita',
      text: narrative.rinascita,
      color: 'text-green',
      bg: 'bg-green/10',
      duration: 6000,
    },
  ];

  useEffect(() => {
    if (currentPhase < phases.length - 1) {
      const timer = setTimeout(() => {
        setCurrentPhase((prev) => prev + 1);
      }, phases[currentPhase].duration);

      return () => clearTimeout(timer);
    } else if (currentPhase === phases.length - 1 && !isComplete) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        if (onComplete) onComplete();
      }, phases[currentPhase].duration);

      return () => clearTimeout(timer);
    }
  }, [currentPhase, isComplete]);

  const currentPhaseData = phases[currentPhase];

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-secondary">Motivatore Energizzante</span>
          <span className="text-sm text-secondary/60">
            Fase {currentPhase + 1} di {phases.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{
              width: `${((currentPhase + 1) / phases.length) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Narrative Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className={`${currentPhaseData.bg} rounded-lg p-6 md:p-8 shadow-lg`}
        >
          {/* Phase Title */}
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-lg font-bold ${currentPhaseData.color} mb-4 text-center`}
          >
            {currentPhaseData.title}
          </motion.h3>

          {/* Phase Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-lg md:text-xl ${currentPhaseData.color} text-center leading-relaxed font-medium`}
          >
            {currentPhaseData.text}
          </motion.p>

          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            className="mt-6 text-center text-4xl"
          >
            {currentPhase === 0 && '🌧️'}
            {currentPhase === 1 && '🌅'}
            {currentPhase === 2 && '🦋'}
          </motion.div>

          {/* Loading Animation for current phase */}
          {!isComplete && (
            <motion.div
              className="mt-4 h-1 bg-white/30 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="h-full bg-white/60"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: phases[currentPhase].duration / 1000,
                  ease: 'linear',
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Completion Message */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-center"
        >
          <p className="text-sm font-semibold text-green">
            ✨ Motivazione completata. Torna domani per un nuovo messaggio.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MotivatoreEnergizzante;
