import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testGlobaleQuestions, generateGoalsFromAnswers } from '../data/testGlobale';

const TestGlobale = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(testGlobaleQuestions.length).fill(''));
  const [currentAnswer, setCurrentAnswer] = useState('');

  const question = testGlobaleQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / testGlobaleQuestions.length) * 100;

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = currentAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < testGlobaleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer(newAnswers[currentQuestion + 1] || '');
    } else {
      // Test completed - generate goals
      const goals = generateGoalsFromAnswers(newAnswers);
      onComplete(goals);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCurrentAnswer(answers[currentQuestion - 1] || '');
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-secondary">Test Globale</span>
          <span className="text-secondary/60">Domanda {currentQuestion + 1} di {testGlobaleQuestions.length}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-secondary">{question.question}</h3>
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={question.placeholder}
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
          />
        </motion.div>
      </AnimatePresence>

      {/* Buttons */}
      <div className="flex gap-4">
        {currentQuestion > 0 && (
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gray-200 text-secondary font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Indietro
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!currentAnswer.trim()}
          className="flex-1 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion < testGlobaleQuestions.length - 1 ? 'Continua' : 'Completa Test'}
        </button>
      </div>
    </div>
  );
};

export default TestGlobale;
