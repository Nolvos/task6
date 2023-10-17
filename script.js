const stories = [
  {
    title: 'The Lion and the Rabbit',
    content: `Once there was a Lion in the jungle`,
  },
  {
    title: 'The Hunter and the Pigeons',
    content: `One day a hunter sets a net to catch birds`,
  },
  // Add more stories in a similar format
];

let currentStoryIndex = 0;

function displayNextStory() {
  currentStoryIndex = (currentStoryIndex + 1) % stories.length;
  const storyCard = document.getElementById('story-card');
  const storyTitle = document.getElementById('story-title');
  const storyContent = document.getElementById('story-content');

  storyTitle.innerText = stories[currentStoryIndex].title;
  storyContent.innerText = stories[currentStoryIndex].content;
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

  // ... (rest of the code for calculating accuracy)

  // Determine the feedback based on accuracy
  let feedback = '';
  if (oppositeAccuracy >= 75) {
    feedback = 'Excellent';
  } else if (oppositeAccuracy >= 50) {
    feedback = 'Very Good';
  } else {
    feedback = 'Let\'s try again.';
  }

  // Convert feedback to speech
  const speechSynthesis = window.speechSynthesis;
  const speechMessage = new SpeechSynthesisUtterance(feedback);
  speechSynthesis.speak(speechMessage);
}

function readStory() {
  const storyContent = document.getElementById('story-content').innerText;

  // Check if the story content is empty
  if (!storyContent.trim()) {
    console.log('No story content to read.');
    return;
  }

  const speechSynthesis = window.speechSynthesis;
  const speechMessage = new SpeechSynthesisUtterance(storyContent);

  // Start reading the story content
  speechSynthesis.speak(speechMessage);
}
