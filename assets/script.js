// variables for sections, button, answers & timer
var openingSection = document.getElementById("openingSection");
var questionSection = document.getElementById("questionSection");
var closingSection = document.getElementById("closingSection");
var highScoreSection = document.getElementById("highScoreSection");
var initialsForm = document.getElementById("initialsForm");
var scoresEl = document.getElementById("score");
var viewScores = document.getElementById("viewScores");
var highScoreList = document.getElementById("highScoreList");
var startButton = document.querySelector("#startButton");
var backButton = document.querySelector("#backButton");
var clearButton = document.querySelector("#clearButton");
var questionNumber = document.querySelector("#questionNumber");
var answers = document.querySelector("#answers");
var timer = document.querySelector("#timer");
var score = 0;
var timeLeft;
var gameFinished;
timer.textContent = "Timer: ";

//Array for high score
var highScores = [];

//Designate array details for questions
var QuestionIndex = 0;

//Questions & Answers for quiz
var myQuestions = [{
        q: 'Name the largest body of water in the world.',
        a: '2. The Pacific Ocean',
        multiChoices: [{
            choice: '1. The Atlantic Ocean'
        }, {
            choice: '2. The Pacific Ocean'
        }, {
            choice: '3. The Great Lakes'
        }, {
            choice: '4. The Bering Sea'
        }]
    },
    {
        q: 'Which is the hardest rock?',
        a: '4. Diamond',
        multiChoices: [{
            choice: '1. Granite'
        }, {
            choice: '2. Marble'
        }, {
            choice: '3. Obsidian '
        }, {
            choice: '4. Diamond'
        }]
    },
    {
        q: 'Which artist famously cut off his own ear?',
        a: '3. Vincent Van Gogh',
        multiChoices: [{
            choice: '1. Pablo Picasso'
        }, {
            choice: '2. Salvador Dali'
        }, {
            choice: '3. Vincent Van Gogh'
        }, {
            choice: '4. Andy Warhol'
        }]
    },
    {
        q: 'Which of the following ingredients is not normally used to brew beer?',
        a: '2. Vinegar',
        multiChoices: [{
            choice: '1. Yeast'
        }, {
            choice: '2. Vinegar'
        }, {
            choice: '3. Malt'
        }, {
            choice: '4. Hops'
        }]
    },
    {
        q: 'What is the most densely populated U.S. state?',
        a: '1. New Jersey',
        multiChoices: [{
            choice: '1. New Jersey'
        }, {
            choice: '2. New York'
        }, {
            choice: '3. California'
        }, {
            choice: '4. none of the above'
        }]
    },
];

//Define init variable to initiate page
var init = function () {
    highScoreSection.classList.add("hide");
    highScoreSection.classList.remove("show");
    openingSection.classList.remove("hide");
    openingSection.classList.add("show");
    scoresEl.removeChild(scoresEl.lastChild);
    QuestionIndex = 0;
    gameFinished = "";
    timer.textContent = "Timer: ";
    score = 0;
}

//60 second counter
var timerDown = function () {
    timeLeft = 60;

    var timercheck = setInterval(function () {
        timer.textContent = 'Timer: ' + timeLeft;
        timeLeft--;

        if (gameFinished) {
            clearInterval(timercheck)
        }

        if (timeLeft < 0) {
            showScore();
            timer.textContent = '';
            clearInterval(timercheck);
        }
    }, 1000)
}

//Create function to start quiz
var startGame = function () {
    openingSection.classList.add('hide');
    openingSection.classList.remove('show');
    questionSection.classList.remove('hide');
    questionSection.classList.add('show');

    //Setting questions to randomize appearance
    arrayShuffledQuestions = myQuestions.sort(() => Math.random() - 0.5)

    timerDown()
    setQuestion()
}

//Setting a function that calls questions
var setQuestion = function () {
    resetAnswers()
    displayQuestion(arrayShuffledQuestions[QuestionIndex])
}

var resetAnswers = function () {
    while (answers.firstChild) {
        answers.removeChild(answers.firstChild)
    };
};

//shows questions/answers
var displayQuestion = function (index) {
    questionNumber.textContent = index.q;
    for (var i = 0; i < index.multiChoices.length; i++) {
        var answerButton = document.createElement('button');
        answerButton.textContent = index.multiChoices[i].choice;
        answerButton.classList.add('btn');
        answerButton.classList.add('answerbtn');
        answerButton.addEventListener("click", answerCheck);
        answers.appendChild(answerButton);
    }
};

//Verifies correct answer, If incorrect answer is chosen there is a 5 second deduction from timer
var answerCheck = function (event) {
    var chosenAnswer = event.target
    if (arrayShuffledQuestions[QuestionIndex].a === chosenAnswer.textContent) {
        score = score + 5
    } else {
        score = score;
        timeLeft = timeLeft - 5;
    };

    //proceeds to next question if there is one
    QuestionIndex++
    if (arrayShuffledQuestions.length > QuestionIndex + 1) {
        setQuestion()
    } else {
        gameFinished = "true";
        showScore();
    }
}

//Display total score screen at end of game
var showScore = function () {
    questionSection.classList.add("hide");
    closingSection.classList.remove("hide");
    closingSection.classList.add("show");

    var scoreDisplay = document.createElement("p");
    scoreDisplay.innerText = ("Your final score is " + score + "!");
    scoresEl.appendChild(scoreDisplay);
}

//create high score values
var createHighScore = function (event) {
    event.preventDefault()
    var initials = document.querySelector("#initials").value;
    if (!initials) {
        alert("Enter your initials!");
        return;
    }

    initialsForm.reset();

    var highScore = {
        initials: initials,
        score: score
    }

    highScores.push(highScore);
    highScores.sort((a, b) => {
        return b.score - a.score
    });

    while (highScoreList.firstChild) {
        highScoreList.removeChild(highScoreList.firstChild)
    }
    //Element is created in order of the high score
    for (var i = 0; i < highScores.length; i++) {
        var highscoreEl = document.createElement("li");
        highscoreEl.className = "high-score"
        highscoreEl.innerHTML = highScores[i].initials + " - " + highScores[i].score;
        highScoreList.appendChild(highscoreEl);
    }

    saveHighScore();
    displayHighScores();
}

//Save high score, strings data to store into local storage
var saveHighScore = function () {
    localStorage.setItem("highScores", JSON.stringify(highScores));
}

//Loads scores when quiz is either complete or timer runs out
var loadHighScore = function () {
    var loadedHighScores = localStorage.getItem("highScores")
    if (!loadedHighScores) {
        return false;
    }

    loadedHighScores = JSON.parse(loadedHighScores);
    loadedHighScores.sort((a, b) => {
        return b.score - a.score
    })


    for (var i = 0; i < loadedHighScores.length; i++) {
        var highscoreEl = document.createElement("li");
        highscoreEl.className = "highScore";
        highscoreEl.innerText = loadedHighScores[i].initials + " - " + loadedHighScores[i].score;
        highScoreList.appendChild(highscoreEl);

        highScores.push(loadedHighScores[i]);
    }
}

//Display high score screen from link or when initials entered
var displayHighScores = function () {

    highScoreSection.classList.remove("hide");
    highScoreSection.classList.add("show");
    gameFinished = true;

    if (closingSection.className == "show") {
        closingSection.classList.remove("show");
        closingSection.classList.add("hide");
    }
    if (openingSection.className == "show") {
        openingSection.classList.remove("show");
        openingSection.classList.add("hide");
    }

    if (questionSection.className == "show") {
        questionSection.classList.remove("show");
        questionSection.classList.add("hide");
    }
}

//Clears out all previously saved high scores
var clearScores = function () {
    highScores = [];

    while (highScoreList.firstChild) {
        highScoreList.removeChild(highScoreList.firstChild);
    }

    localStorage.clear(highScores);
}

loadHighScore();

//Placed Eventlistener for different click functions
startButton.addEventListener("click", startGame)
initialsForm.addEventListener("submit", createHighScore)
viewScores.addEventListener("click", displayHighScores)
backButton.addEventListener("click", init)

//Click to reset/removed saved scores
clearButton.addEventListener("click", clearScores)