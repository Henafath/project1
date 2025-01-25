const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

// Mapping subjects to OpenTDB category IDs
const SUBJECT_CATEGORIES = {
  'science': 17,  // Science & Nature
  'math': 19,     // Math
  'history': 23,  // History
  'geography': 22,// Geography
  'general': 9    // General Knowledge
};

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;
const STREAK_BONUS = 5;
let currentStreak = 0;

const selectedSubject = localStorage.getItem('selectedSubject') || 'general';
const categoryId = SUBJECT_CATEGORIES[selectedSubject];

fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=medium&type=multiple`)
  .then((res) => res.json())
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: decodeURIComponent(loadedQuestion.question),
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion['choice' + (index + 1)] = decodeURIComponent(choice);
      });

      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

function startGame() {
  questionCounter = 0;
  score = 0;
  currentStreak = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove('hidden');
  loader.classList.add('hidden');
}

function getNewQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem('mostRecentScore', score);
    return window.location.assign('/end.html');
  }
  
  questionCounter++;
  progressText.innerText = `${selectedSubject.toUpperCase()} Quiz - Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset['number'];
    choice.innerHTML = currentQuestion['choice' + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
}

choices.forEach((choice) => {
  choice.addEventListener('click', (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset['number'];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

    if (classToApply === 'correct') {
      incrementScore(CORRECT_BONUS);
      currentStreak++;
      
      // Streak bonus
      if (currentStreak % 3 === 0) {
        incrementScore(STREAK_BONUS);
        // Potential booster unlock
        localStorage.setItem('availableBoosters', currentStreak / 3);
      }
    } else {
      currentStreak = 0;
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

function incrementScore(num) {
  score += num;
  scoreText.innerText = score;
}