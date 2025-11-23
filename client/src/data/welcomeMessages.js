// 35 Welcome messages - Mai identici, sempre validanti
export const welcomeMessages = [
  'Bentornato. Ogni volta che torni qui, scegli TE. Questa è forza pura 💫',
  'Eccoti di nuovo. Ogni accesso è un atto di coraggio. Lo vedi? 🌟',
  'Sei tornato. Questo è prendersi cura di sé. È rinascita 🔥',
  'Benvenuto nel tuo spazio. Qui nessuno ti giudica. Solo crescita 🌱',
  'Ogni volta che apri questa pagina, stai scegliendo te stesso. Continua 💪',
  'Bentornato. La costanza è forza. Tu stai costruendo qualcosa di reale ⚡',
  'Eccoti qui. Questo è il tuo momento. Prendilo tutto 🎯',
  'Sei di nuovo qui. Questo non è caso. È intenzione. È potere 🌊',
  'Benvenuto. Ogni passo conta. Anche questo. Soprattutto questo 🦋',
  'Tornare qui è già una vittoria. Non dimenticarlo mai 🏆',
  'Bentornato nel tuo percorso. La direzione è chiara. Vai avanti 🧭',
  'Eccoti. Scegliere se stessi ogni giorno è rivoluzione silenziosa 🌙',
  'Benvenuto. Il fatto che tu sia qui dice tutto di te 🌈',
  'Sei tornato. Questo è impegno. Questo è rispetto per te stesso ✨',
  'Bentornato. Non stai solo sopravvivendo. Stai rinascendo davvero 🦅',
  'Eccoti di nuovo. La tua presenza qui è atto di ribellione positiva 🎭',
  'Benvenuto. Ogni giorno che torni, diventi più forte. Lo senti? 🔱',
  'Sei qui. Questo è scegliere la vita che meriti. Continua così 🌺',
  'Bentornato. Non mollare mai su te stesso. Mai. Promettilo 💎',
  'Eccoti qui. Stai scrivendo una storia nuova. Una pagina alla volta 📖',
  'Benvenuto. Il solo fatto di essere qui ti rende esempio per altri 🌻',
  'Sei di nuovo qui. La tua rinascita è in corso. Respira. Vai 🌬️',
  'Bentornato. Ogni accesso è una dichiarazione: io valgo. Ripetila 🎪',
  'Eccoti. Stai costruendo una vita nuova. Mattone dopo mattone 🏗️',
  'Benvenuto. La tua presenza qui è prova che puoi farcela 🌅',
  'Sei tornato. Questo è credere in te stesso. È tutto 🌟',
  'Bentornato. Non importa come ti senti oggi. Sei nel posto giusto 🏡',
  'Eccoti qui. Il cambiamento vero parte da piccoli gesti come questo 🌸',
  'Benvenuto. Scegliere se stessi è il più grande atto d\'amore 💝',
  'Sei di nuovo qui. Questo è il tuo viaggio. Goditi ogni tappa 🚶',
  'Bentornato. La forza che cerchi è già dentro di te. Cercala qui 🔍',
  'Eccoti. Ogni volta che torni, stai dicendo: io esisto. Ed è vero 🎨',
  'Benvenuto. Non sei solo. Non sei mai stato solo. Ricordalo sempre 🤝',
  'Sei qui. Questo è il primo passo. E i primi passi cambiano tutto 👣',
  'Bentornato. La tua rinascita è reale. È in corso. È adesso 🌄',
];

// Funzione per ottenere un messaggio random mai uguale
let lastMessageIndex = -1;

export const getRandomWelcomeMessage = () => {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * welcomeMessages.length);
  } while (newIndex === lastMessageIndex && welcomeMessages.length > 1);

  lastMessageIndex = newIndex;
  return welcomeMessages[newIndex];
};
