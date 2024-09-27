// State variables
let currentQuestionIndex = 0; // Track the current question index
let questions = []; // Store fetched questions
let userScore = 0; // Track user score

// Select HTML elements
const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const scoreCounter = document.getElementById('score-counter'); // Ensure this ID matches your HTML
const feedbackContainer = document.getElementById('feedback-container'); // New feedback container

// Fetch questions from Open Trivia DB API
async function fetchQuizQuestions() {
  const apiURL = 'https://opentdb.com/api.php?amount=10&type=multiple'; // Fetch 10 questions
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    questions = data.results;
    currentQuestionIndex = 0; // Reset index for new questions
    displayQuestion();
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
  }
}

// Display the current question and its options
function displayQuestion() {
  if (questions.length === 0) {
    fetchQuizQuestions();
    return;
  }

  if (currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];
    questionContainer.innerHTML = currentQuestion.question;

    // Remove previous options
    optionsContainer.innerHTML = '';

    const allOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    
    allOptions.forEach(option => {
      const optionElement = document.createElement('li');
      optionElement.textContent = option;
      optionElement.addEventListener('click', () => handleAnswer(option));
      optionsContainer.appendChild(optionElement);
    });
  } else {
    fetchQuizQuestions();
  }
}

// Handle the answer selection
function handleAnswer(selectedOption) {
  const currentQuestion = questions[currentQuestionIndex];

  // Check if the selected answer is correct
  if (selectedOption === currentQuestion.correct_answer) {
    userScore++; // Increment score
    displayFeedback("Correct answer!", true); // Show feedback
    updateScoreDisplay(); // Call to update the score display
  } else {
    displayFeedback("Wrong answer! The correct answer was: " + currentQuestion.correct_answer, false);
  }

  // Proceed to the next question
  currentQuestionIndex++;
  displayQuestion();
}

// Update the score display with animation
function updateScoreDisplay() {
  scoreCounter.textContent = `Score: ${userScore}`; // Update the score text
  scoreCounter.classList.add('animated'); // Add animation class

  setTimeout(() => {
    scoreCounter.classList.remove('animated'); // Remove animation class after 1 second
  }, 1000);
}

// Display feedback
function displayFeedback(message, isCorrect) {
  feedbackContainer.textContent = message; 
  feedbackContainer.className = 'feedback-container';
  feedbackContainer.classList.add(isCorrect ? 'feedback-correct' : 'feedback-wrong');
  feedbackContainer.style.display = 'block';

  setTimeout(() => {
    feedbackContainer.style.display = 'none';
  }, 3000);
}

// Initialize quiz
fetchQuizQuestions();

// Add event listener to the "Next Question" button
document.getElementById('next-button').addEventListener('click', () => {
  currentQuestionIndex++;
  displayQuestion();
});

// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Disable Dark Mode' : 'Enable Dark Mode';
});
