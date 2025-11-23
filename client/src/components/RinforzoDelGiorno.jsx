import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const rinforzoMessages = [
  {
    text: 'La tua presenza qui è atto di coraggio. Ogni giorno scegli te stesso. Questa è la vera forza. Respira profondamente e lascia che questa verità ti attraversi: meriti di rinascere.',
    music: '🎵 Peaceful Piano',
  },
  {
    text: 'Non sei definito da quello che hai vissuto. Sei definito da come stai rinascendo. La tua resilienza è potere. La tua scelta di crescere è vittoria.',
    music: '🎵 Gentle Waves',
  },
];

const RinforzoDelGiorno = ({ onComplete }) => {
  const [message] = useState(rinforzoMessages[new Date().getDate() % rinforzoMessages.length]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
          className="text-6xl"
        >
          💎
        </motion.div>
        <h3 className="text-2xl font-bold text-primary">Il Tuo Rinforzo di Oggi</h3>
        <p className="text-sm text-secondary/60">{message.music}</p>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg md:text-xl text-secondary text-center leading-relaxed font-medium px-4"
      >
        {message.text}
      </motion.p>

      <div className="space-y-2">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-center text-secondary/60">
          Lascia che queste parole ti nutrano...
        </p>
      </div>
    </div>
  );
};

export default RinforzoDelGiorno;
