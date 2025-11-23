import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRDN } from '../context/RDNContext';
import { getRandomWelcomeMessage } from '../data/welcomeMessages';
import { getAffirmationsForMood } from '../data/affirmations';
import MotivatoreEnergizzante from '../components/MotivatoreEnergizzante';

const Welcome = () => {
  const navigate = useNavigate();
  const { mood: savedMood, energy: savedEnergy, time: savedTime, setMood, setEnergy, setTime, isMoodExpired } = useRDN();

  // Local state
  const [welcomeMessage] = useState(getRandomWelcomeMessage());
  const [localMood, setLocalMood] = useState(null);
  const [localEnergy, setLocalEnergy] = useState(null);
  const [localTime, setLocalTime] = useState(null);
  const [affirmations, setAffirmations] = useState([]);
  const [showMotivatore, setShowMotivatore] = useState(false);
  const [motivatoreCompleted, setMotivatoreCompleted] = useState(false);

  // Check if mood expired (24h) and reset if needed
  useEffect(() => {
    if (isMoodExpired()) {
      setMood(null);
      setEnergy(null);
      setTime(null);
      setLocalMood(null);
      setLocalEnergy(null);
      setLocalTime(null);
    } else {
      // Load saved state
      if (savedMood) setLocalMood(savedMood);
      if (savedEnergy) setLocalEnergy(savedEnergy);
      if (savedTime) setLocalTime(savedTime);
    }
  }, []);

  // Generate affirmations when mood changes
  useEffect(() => {
    if (localMood) {
      const newAffirmations = getAffirmationsForMood(localMood, 3);
      setAffirmations(newAffirmations);
    }
  }, [localMood]);

  const handleMoodSelect = (selectedMood) => {
    setLocalMood(selectedMood);
    setMood(selectedMood);
  };

  const handleEnergySelect = (selectedEnergy) => {
    setLocalEnergy(selectedEnergy);
    setEnergy(selectedEnergy);
  };

  const handleTimeSelect = (selectedTime) => {
    setLocalTime(selectedTime);
    setTime(selectedTime);
    // Show motivatore after selections complete
    setShowMotivatore(true);
  };

  const handleContinue = () => {
    // Navigate to goals page
    navigate('/goals');
  };

  const ctaText = {
    fragile: 'Sì, Oggi Voglio Accogliermi',
    incerto: 'Sì, Oggi Voglio Fare Chiarezza',
    pronto: 'Sì, Voglio Fare il Mio Passo di Oggi',
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 pb-16">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {/* Welcome Message - Always rotating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-secondary px-4">
            {welcomeMessage}
          </h2>
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-secondary mb-4">
            Oggi mi sento...
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <button
              onClick={() => handleMoodSelect('fragile')}
              className={`p-4 sm:p-6 rounded-lg border-2 transition-all ${
                localMood === 'fragile'
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="text-3xl sm:text-4xl mb-2">🌧️</div>
              <div className="text-base sm:text-lg font-semibold text-secondary">Fragile</div>
            </button>
            <button
              onClick={() => handleMoodSelect('incerto')}
              className={`p-4 sm:p-6 rounded-lg border-2 transition-all ${
                localMood === 'incerto'
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="text-3xl sm:text-4xl mb-2">🌫️</div>
              <div className="text-base sm:text-lg font-semibold text-secondary">Incertə</div>
            </button>
            <button
              onClick={() => handleMoodSelect('pronto')}
              className={`p-4 sm:p-6 rounded-lg border-2 transition-all ${
                localMood === 'pronto'
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="text-3xl sm:text-4xl mb-2">🔥</div>
              <div className="text-base sm:text-lg font-semibold text-secondary">Prontə</div>
            </button>
          </div>
        </motion.div>

        {/* Affirmations - Adaptive based on mood */}
        {localMood && affirmations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
          >
            <div className="space-y-3 text-center">
              {affirmations.map((affirmation, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="text-base sm:text-lg text-secondary font-medium"
                >
                  {affirmation}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Time and Energy Selector */}
        {localMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          >
            {/* Time */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-secondary mb-4">
                Oggi ho...
              </h3>
              <div className="space-y-2">
                {['5-10 min', '15-30 min', '45+ min'].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTimeSelect(t)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-sm sm:text-base ${
                      localTime === t
                        ? 'border-primary bg-primary/10 font-semibold'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-secondary mb-4">
                Oggi sento...
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleEnergySelect('bassa')}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-sm sm:text-base ${
                    localEnergy === 'bassa'
                      ? 'border-primary bg-primary/10 font-semibold'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  💧 Bassa
                </button>
                <button
                  onClick={() => handleEnergySelect('media')}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-sm sm:text-base ${
                    localEnergy === 'media'
                      ? 'border-primary bg-primary/10 font-semibold'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  🔥 Media
                </button>
                <button
                  onClick={() => handleEnergySelect('alta')}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-sm sm:text-base ${
                    localEnergy === 'alta'
                      ? 'border-primary bg-primary/10 font-semibold'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  ⚡ Alta
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Motivatore Energizzante */}
        {showMotivatore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
          >
            <MotivatoreEnergizzante onComplete={() => setMotivatoreCompleted(true)} />
          </motion.div>
        )}

        {/* CTA Button */}
        {localMood && localTime && localEnergy && motivatoreCompleted && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring' }}
            onClick={handleContinue}
            className="w-full bg-primary text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105 text-base sm:text-lg"
          >
            {ctaText[localMood]}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Welcome;
