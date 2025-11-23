// Test Globale - 9 domande immersive per definire obiettivi di vita

export const testGlobaleQuestions = [
  {
    id: 1,
    question: 'Quando pensi ai prossimi 3 mesi, quale cambiamento nella tua vita quotidiana desideri di più?',
    placeholder: 'Esempio: Voglio sentirmi più sicuro di me nelle relazioni...',
    category: '3mesi',
  },
  {
    id: 2,
    question: 'Cosa vorresti saper fare o essere tra 1 anno che oggi ti sembra difficile?',
    placeholder: 'Esempio: Voglio saper porre confini senza sensi di colpa...',
    category: '1anno',
  },
  {
    id: 3,
    question: 'Se potessi cambiare una cosa del tuo modo di relazionarti con gli altri, cosa sarebbe?',
    placeholder: 'Esempio: Voglio smettere di accettare comportamenti che mi feriscono...',
    category: '1anno',
  },
  {
    id: 4,
    question: 'Tra 3 anni, come ti vorresti sentire rispetto a te stesso?',
    placeholder: 'Esempio: Voglio sentirmi completo anche da solo...',
    category: '3anni',
  },
  {
    id: 5,
    question: 'Quale paura vorresti aver superato completamente tra 3 anni?',
    placeholder: 'Esempio: La paura di essere abbandonato...',
    category: '3anni',
  },
  {
    id: 6,
    question: 'Guardando ai prossimi 10 anni, quale versione di te vuoi essere diventato?',
    placeholder: 'Esempio: Una persona che sa riconoscere le persone tossiche subito...',
    category: '10anni',
  },
  {
    id: 7,
    question: 'Se dovessi dare un consiglio al te stesso di oggi tra 10 anni, cosa pensi che ti diresti?',
    placeholder: 'Esempio: Che avevi ragione a fidarti del tuo istinto...',
    category: '10anni',
  },
  {
    id: 8,
    question: 'Alla fine della tua vita, guardando indietro, quale sarà stata la cosa più importante che hai imparato?',
    placeholder: 'Esempio: Che il mio valore non dipende da quanto do agli altri...',
    category: 'vita',
  },
  {
    id: 9,
    question: 'Quale eredità emotiva vuoi lasciare a chi ti ha voluto bene?',
    placeholder: 'Esempio: Che è possibile rinascere dopo qualsiasi ferita...',
    category: 'vita',
  },
];

// Genera obiettivi dal test
export const generateGoalsFromAnswers = (answers) => {
  const goals = [];
  const categories = {
    '3mesi': { months: 3, label: 'Traguardo 3 Mesi' },
    '1anno': { months: 12, label: 'Traguardo 1 Anno' },
    '3anni': { months: 36, label: 'Traguardo 3 Anni' },
    '10anni': { months: 120, label: 'Traguardo 10 Anni' },
    'vita': { months: null, label: 'Scopo di Vita' },
  };

  testGlobaleQuestions.forEach((question, index) => {
    const answer = answers[index];
    if (answer && answer.trim().length > 0) {
      const cat = categories[question.category];
      const deadline = cat.months
        ? new Date(Date.now() + cat.months * 30 * 24 * 60 * 60 * 1000)
        : null;

      goals.push({
        title: cat.label,
        description: answer,
        category: question.category,
        startScore: 0,
        targetScore: 10,
        currentScore: 0,
        deadline: deadline,
      });
    }
  });

  return goals;
};
