import { useState } from 'react';

const Welcome = () => {
  const [mood, setMood] = useState(null);
  const [time, setTime] = useState(null);
  const [energy, setEnergy] = useState(null);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Welcome Message */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-secondary">
            Bentornato. Ogni volta che torni qui, scegli TE. Questa è forza pura 💫
          </h2>
        </div>

        {/* Mood Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-secondary mb-4">Oggi mi sento...</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setMood('fragile')}
              className={`p-6 rounded-lg border-2 transition-all ${
                mood === 'fragile'
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="text-4xl mb-2">🌧️</div>
              <div className="text-lg font-semibold text-secondary">Fragile</div>
            </button>
            <button
              onClick={() => setMood('incerto')}
              className={`p-6 rounded-lg border-2 transition-all ${
                mood === 'incerto'
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="text-4xl mb-2">🌫️</div>
              <div className="text-lg font-semibold text-secondary">Incertə</div>
            </button>
            <button
              onClick={() => setMood('pronto')}
              className={`p-6 rounded-lg border-2 transition-all ${
                mood === 'pronto'
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-lg font-semibold text-secondary">Prontə</div>
            </button>
          </div>
        </div>

        {/* Affirmations - Show when mood is selected */}
        {mood && (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
            <div className="space-y-3 text-center">
              {mood === 'fragile' && (
                <>
                  <p className="text-lg text-secondary">Respira. Sei al sicuro.</p>
                  <p className="text-lg text-secondary">La tua dolcezza è forza.</p>
                </>
              )}
              {mood === 'incerto' && (
                <>
                  <p className="text-lg text-secondary">La confusione è parte del cammino.</p>
                  <p className="text-lg text-secondary">Puoi fare chiarezza, un passo alla volta.</p>
                </>
              )}
              {mood === 'pronto' && (
                <>
                  <p className="text-lg text-secondary">Sii l'esempio della rinascita.</p>
                  <p className="text-lg text-secondary">Tu sei la tua scelta più importante.</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Time and Energy Selector */}
        {mood && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">Oggi ho...</h3>
              <div className="space-y-2">
                {['5-10 min', '15-30 min', '45+ min'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`w-full p-3 rounded-lg border-2 transition-all ${
                      time === t
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">Oggi sento...</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setEnergy('bassa')}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    energy === 'bassa'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  💧 Bassa
                </button>
                <button
                  onClick={() => setEnergy('media')}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    energy === 'media'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  🔥 Media
                </button>
                <button
                  onClick={() => setEnergy('alta')}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    energy === 'alta'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  ⚡ Alta
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        {mood && time && energy && (
          <button className="w-full bg-primary text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105">
            {mood === 'fragile' && 'Sì, Oggi Voglio Accogliermi'}
            {mood === 'incerto' && 'Sì, Oggi Voglio Fare Chiarezza'}
            {mood === 'pronto' && 'Sì, Voglio Fare il Mio Passo di Oggi'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Welcome;
