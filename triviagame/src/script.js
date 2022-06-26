//require("dotenv").config();

// The identifiers for the HTML elements are defined here.
// The getElementById DOM method is used to get the element by id
// The querySelector DOM method is used to get the element by tag
const chkBtn = document.getElementById("checkBtn");
const nxtBtn = document.getElementById("nextBtn");
const ques = document.querySelector("h2");
const outMsg = document.querySelector("h3");
const tdTme = document.getElementById("tdTime");
const restartImg = document.getElementById("restartImg");
const stopImg = document.getElementById("stopImg");

// The variables used by the code
let ansArr = [];    // The array of questions and answers from the API call
let qc = 0;         // The count of questions displayed by the game
let points = 0;     // The points awarded to the pleyer for right answers
let timer = 30;     // The 30 second timer variable
let check = null;   // The setInterval variable used by the timer functions

// The following function is run when the page loads in the browser
window.onload = function (event) {
    async function callTriviaApi() {
        // Call the API and get the results
        let response = await axios.get("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple")
        ansArr = response.data.results;
        // Show the next question
        showNextQuestion();
        // Set points to 0
        setPoints(points);
    }

    // Call the trivia API and show the next question
    callTriviaApi();
}

// A random number function with min and max values
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// This function shows an alert message on the browser.
// This is used to show messages when the game ends.
function showMessage(msg) {
    alert(msg);
}

// This function displays the points on the HTML page
function setPoints(points) {
    let elem = document.getElementById("tdPoints");
    elem.innerHTML = `${points} Points`;
}

// This function starts the 30 second timer and
// displays the remaining time on the HTML page
function startTimer() {
    // If the check object is null then
    // start the timer using setInterval and on
    // every 1 second display the remaining time on
    // the HTML page
    if (check == null) {
        timer = 30;
        check = setInterval(function () {
            if (timer > 0)
                tdTme.innerHTML = `${timer}s Left`;
            else
                tdTme.innerHTML = `0s Left`;
            timer -= 1;
        }, 1000);
    }
}

// This function stops the timer
function stopTimer() {
    clearInterval(check); // Clear the function set by setInterval
    check = null; // Clear the check object
}

// This function displays the answer on 
// the label and sets the value of 
// the radio button for right/wrong answer
function setAnswer(pos, ansStr, right) {
    // Get the label for the pos position and set the answer
    let anslbl = document.querySelector(`label[for="ans${pos}"]`);
    anslbl.innerHTML = ansStr;

    // Get the answer radio element for the pos position 
    let ansrdo = document.getElementById(`ans${pos}`);

    // Set the ansrdo value to right or wrong
    if (right == true)
        ansrdo.value = "right";
    else
        ansrdo.value = "wrong";

    // Clear the radio button checked setting
    ansrdo.checked = false;

    // Enable the radio button
    ansrdo.disabled = false;
}

// This function displays the question and answers on
// the HTML page. It first checks if there are questions
// remaining (qc) to be asked. If there are no questions
// remaining, it ends the game and displays if the player won and
// how many points were awarded.
function showNextQuestion() {
    // Clear output message
    outMsg.innerHTML = "";

    if (qc < ansArr.length) {
        // Get the array of wrong answers
        let wrongAns = ansArr[qc].incorrect_answers;
        // Get the correct answer
        let corrAns = ansArr[qc].correct_answer;

        // Display the question
        ques.innerHTML = ansArr[qc].question;

        // Get a random position of the correct answer
        correctAnsPos = randomNumber(0, 3);

        // Display the correct answer at the random position
        setAnswer(correctAnsPos, corrAns, true);

        // Loop and display the incorrect answers
        let j = 0;
        for (let i = 0; i < 4; i++) {
            // Skip the correct answer radio button and label
            if (i == correctAnsPos) {
                continue;
            }

            // Display the wrong answer at the i position
            setAnswer(i, wrongAns[j], false);

            // Increment counter
            j++;
        }

        // Start the timer
        startTimer();
    }
    else {
        // If there are no questions remaining, then display
        // the messages at the end of the game
        if (points > 0)
            showMessage(`Congratulations! You scored ${points} points.`);
        else
            showMessage(`Game over! You scored ${points} points. Please try again.`);
    }
    qc++;
}

// This function checks if the answer picked by
// the player is right or wrong. It displays the
// right/wrong answer, gives points and stops the timer
function checkAnswer() {
    let ansRdo = document.getElementsByName('ans'); // array 
    let flag = 0
    let correctAns = "";
    let checkedValue = "";

    // Loop through the radio buttons. See if 
    // the player picked an answer (flag). Also, get
    // the correct answer (correctAns)
    for (i = 0; i < ansRdo.length; i++) {
        if (ansRdo[i].checked) {
            checkedValue = ansRdo[i].value
            flag = 1
        }
        if (ansRdo[i].value == "right")
            correctAns = document.querySelector(`label[for="ans${i}"]`).innerHTML;
    }

    // If the player did not pick an answer, display a message
    if (flag == 0) {
        outMsg.innerHTML = "No answer was selected.";
    }
    else {
        // Loop over radio buttons and disable them
        for (i = 0; i < ansRdo.length; i++) {
            ansRdo[i].disabled = true;
        }

        // If the player selected the right answer,
        // display a message
        if (checkedValue == "right") {
            outMsg.innerHTML = "Correct Answer!";
            if (timer > 0)
                points += 10;
        }
        else {
            // Otherwise, display the message for wrong answer
            outMsg.innerHTML = `Wrong Answer! The correct answer is ${correctAns}`;
        }

        // Display the points and stop the timer
        setPoints(points);
        stopTimer();
    }
}

// Add the event that runs when users click the Check Answer Button
chkBtn.addEventListener('click', async () => {
    checkAnswer();
})

// Add the event that runs when users click the Next button
nxtBtn.addEventListener('click', async () => {
    showNextQuestion();
})

// Add the event that runs when users click the Restart game Image
restartImg.addEventListener('click', async () => {
    location.reload();
})

// Add the event that runs when users click the Stop Game Image
stopImg.addEventListener('click', async () => {
    stopTimer();
    showMessage(`Game stopped! You scored ${points} points. Please click Restart to play again.`);
})