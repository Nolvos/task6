const stories = [
  {
    title: 'The Lion and the Rabbit Part 4',
    content: `Then the lion asks the rabbit to take him to that lion. The rabbit takes him to the well and said he lives here. When the lion looked in the well he saw his own reflection and jumped in the well and dies.`,
  },
  {
    title: 'The Lion and the Rabbit Part 1',
    content: `Once there was a Lion in the jungle who used to kill 2-3 animals daily for his meal. All animals went to him to tell, that daily one of them will come to him for his meal.`,
  },
  {
    title: 'The Lion and the Rabbit Part 2',
    content: `So, the Lion agreed and this started going for many days. One day, it was Rabbit’s turn. When he was on his way he saw a well.`,
  },
  {
    title: 'The Lion and the Rabbit Part 3',
    content: `Now he plans to kill the lion and save himself. He went to the lion and told him that, there is another lion who claims to be more powerful than him.`,
  },
  // Add more stories in a similar format
];

let currentStoryIndex = 0;

function displayNextStory() {
  const storyCard = document.getElementById('story-card');
  const storyTitle = document.getElementById('story-title');
  const storyContent = document.getElementById('story-content');

  currentStoryIndex = (currentStoryIndex + 1) % stories.length;

  storyTitle.innerText = stories[currentStoryIndex].title;
  storyContent.innerText = stories[currentStoryIndex].content;

  // Reset accuracy result when story changes
  const accuracyResultElement = document.getElementById('accuracyResult');
  accuracyResultElement.innerText = 'Accuracy Result: ';
}

// Display the first story initially
displayNextStory();

// Initialize speech recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = true;  // Listen continuously
recognition.interimResults = true;

let isListening = false;  // Track if recognition is running
let spokenText = '';  // Variable to store spoken text

recognition.onresult = (event) => {
  const interimTranscript = event.results[event.results.length - 1][0].transcript; // Get the last result
  spokenText += interimTranscript + ' ';  // Append the recognized text
  console.log('Spoken text:', spokenText);
  document.getElementById('spokenText').innerText = `Spoken Text: ${spokenText}`;
};

recognition.onerror = (event) => {
  console.error('Speech recognition error:', event.error);
};

document.getElementById('startRecording').addEventListener('click', () => {
  toggleRecognition();
});

document.getElementById('pauseContinueRecording').addEventListener('click', () => {
  toggleRecognition();
});
function checkAccuracy() {
  const spokenText = document.getElementById('spokenText').innerText.split(':')[1].trim().toLowerCase();
  console.log('Spoken text:', spokenText);

  const storyContent = stories[currentStoryIndex].content.toLowerCase();
  console.log('Story content:', storyContent);

  const spokenWords = spokenText.split(' ');
  console.log('Spoken words:', spokenWords);

  const storyWords = storyContent.split(' ');
  console.log('Story words:', storyWords);

  let matchedWords = 0;

  // Count the number of words that match between spoken text and story content (case-insensitive)
  for (const spokenWord of spokenWords) {
    const normalizedSpokenWord = spokenWord.toLowerCase();
    if (storyWords.includes(normalizedSpokenWord)) {
      matchedWords++;
    }
  }

  const totalWords = storyWords.length;  // Total words in the story
  const accuracy = (matchedWords / totalWords) * 100;
  console.log('Matched words:', matchedWords);
  console.log('Total words:', totalWords);
  console.log('Accuracy:', accuracy);

  // Display the accuracy for the current story
  const accuracyResultElement = document.getElementById('accuracyResult');
  accuracyResultElement.innerText = `Accuracy Result for "${stories[currentStoryIndex].title}": ${accuracy.toFixed(2)}%`;

  // Determine the feedback based on accuracy
  let feedback = '';
  if (accuracy >= 75) {
    feedback = 'Excellent';
  } else if (accuracy >= 50) {
    feedback = 'Very Good';
  } else {
    feedback = 'Let\'s try again.';
  }

  // Convert feedback to a playful, kid-friendly voice (female)
  const speechSynthesis = window.speechSynthesis;
  const speechMessage = new SpeechSynthesisUtterance(feedback);

  // Set a feminine voice if available, else use default
  const voices = speechSynthesis.getVoices();
  const femaleVoice = voices.find(voice => voice.name.includes('female'));
  speechMessage.voice = femaleVoice || voices[0]; // Use the first available voice if no feminine voice found

  speechMessage.pitch = 2;
  speechMessage.rate = 0.8;
  speechSynthesis.speak(speechMessage);
}

function readStory() {
  const storyContent = stories[currentStoryIndex].content;

  // Check if the story content is empty
  if (!storyContent.trim()) {
    console.log('No story content to read.');
    return;
  }

  const speechSynthesis = window.speechSynthesis;
  const speechMessage = new SpeechSynthesisUtterance(storyContent);

  // Set a feminine voice if available, else use default
  const voices = speechSynthesis.getVoices();
  const femaleVoice = voices.find(voice => voice.name.includes('female'));
  speechMessage.voice = femaleVoice || voices[0]; // Use the first available voice if no feminine voice found

  speechMessage.pitch = 2;
  speechMessage.rate = 0.8;

  // Start reading the story content
  speechSynthesis.speak(speechMessage);
}
