let url ='https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple';

const question = document.querySelector("#question");
const choices = Array.from(document.getElementsByClassName("choice-text"));

const progressBarFull = document.querySelector("#progressBarFull");
const progressText = document.querySelector("#progressText");
const scoreText = document.querySelector("#score");

const home = document.querySelector("#home");
const playing = document.querySelector("#playing");
const playButton = document.querySelector("#playButton");
const explanation = document.querySelector('.explanation');
const selectoptions = document.querySelector("#selectoptions");
const endPage = document.querySelector('.endPage');
const result = document.querySelector('.result');
const playAgainButton = document.querySelector('#playAgainButton');

const point = 10;
const maxQuestion = 10;
let score = 0;
let questionCounter = 0;
let acceptingAnswers = false;
let resultvalue = 0;

let allQuestionsArray = [];
let currentQuestion = {};


function urlSelection() {
    var x = selectoptions.value;
    if(x === 'easy') {
        url = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple';
    }
    if(x === 'medium') {
        url = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple';
    }
    if(x === 'hard') {
        url = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=hard&type=multiple';
    }
}
selectoptions.addEventListener('change', urlSelection)

function play() {
    explanation.innerHTML = 'Good Luck!'
    game.classList.add("hidden");
    loader.classList.remove("hidden");
    playing.classList.remove("hidden");
    home.classList.add("hidden");
    fetch(url)
    .then(response => {
        return response.json();
    })
    .then(response => {
        allQuestionsArray = response.results.map(q => {
            let allQuestionsObject = {};
            allQuestionsObject.question = q.question;
            allQuestionsObject.answer = Math.floor(Math.random() * 3) + 1;
            const choices = [...q.incorrect_answers];
            choices.splice(allQuestionsObject.answer - 1, 0, q['correct_answer']);
            choices.forEach((eachChoice, index) => {
                allQuestionsObject["choice" + (index + 1)] = eachChoice;
            });
            return allQuestionsObject;
            });
        startGame();
    })
}
playButton.addEventListener('click', play)

function startGame() {
    score = 0;
    questionCounter = 0;
    remainedQuestions = [...allQuestionsArray];
    getQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
}

function getQuestion() {
    if (remainedQuestions.length === 0 || questionCounter >= maxQuestion) {
        endGame();
        return;
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${maxQuestion}`;
    progressBarFull.style.width = `${(questionCounter / maxQuestion) * 100}%`;
    const questionIndex = Math.floor(Math.random() * remainedQuestions.length);
    currentQuestion = remainedQuestions[questionIndex];
    question.innerText = decoding(currentQuestion.question);
    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = decoding(currentQuestion["choice" + number]);
    });
    remainedQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
}

let incrementScore = num => {
    score += num;
    scoreText.innerText = score;
    resultvalue += num;
    result.innerHTML = `${resultvalue}%`;
}

function decoding(html) {
    let el = document.createElement( 'html' );
    el.innerHTML = html;
    return el.textContent;
}

choices.forEach(choice => {
    choice.addEventListener("click", e => {
      if (!acceptingAnswers) return;
  
      acceptingAnswers = false;
      const selectedChoice = e.target;
      const selectedAnswer = selectedChoice.dataset["number"];
      const classToApply =
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
  
      if (classToApply === "correct") {
        incrementScore(point);
      }
  
      selectedChoice.parentElement.classList.add(classToApply);

      setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        getQuestion();
      }, 500);
    });
  });


function endGame() {
    endPage.classList.remove("hidden");
    playing.classList.add("hidden");
    explanation.innerHTML = "";
}


function playAgain() {
    home.classList.remove("hidden");
    endPage.classList.add("hidden");
    scoreText.innerHTML = 0;
    resultvalue = 0;
    result.innerHTML = `0%`;
    questionCounter = 0;
    explanation.innerHTML = "You will be given random questions based on your level. Select your level and start playing!";
}

playAgainButton.addEventListener('click', playAgain);

