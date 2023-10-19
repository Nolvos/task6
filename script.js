const stories = [
  {
    title: 'The Lion and the Rabbit',
    content: `Once there was a Lion in the jungle who used to kill 2-3 animals daily for his meal. All animals went to him to tell that daily one of them will come to him for his meal.`,
  },
  {
    title: 'The Hunter and the Pigeons',
    content: `One day a hunter sets a net to catch birds`,
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

function displayPreviousStory() {
  const storyCard = document.getElementById('story-card');
  const storyTitle = document.getElementById('story-title');
  const storyContent = document.getElementById('story-content');

  currentStoryIndex = (currentStoryIndex - 1 + stories.length) % stories.length;

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

document.getElementById('startRecording').addEventListener('click', () => {
  recognition.start();
});

recognition.onresult = (event) => {
  const spokenText = event.results[0][0].transcript;
  console.log('Spoken text:', spokenText);
  document.getElementById('spokenText').innerText = `Spoken Text: ${spokenText}`;
};

recognition.onerror = (event) => {
  console.error('Speech recognition error:', event.error);
};

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
