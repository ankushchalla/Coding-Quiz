var index = 0;
var highScores = [];
var container = document.getElementsByClassName("container")[0];
var quizItems;
var timerId;
var time;

function buildCard(quizItem) {
    // Building the question element.
    var question = document.createElement('div');
    setAttributes(question, ["class"], ["row p-3 mb-2 bg-info text-white"], quizItem.question)
    container.appendChild(question);

    // Building the answer elements.
    var row = document.createElement('div');
    var col = document.createElement('div');
    var listGroup = document.createElement('div');

    col.setAttribute("class", "col-8");
    listGroup.setAttribute("class", "list-group");
    container.appendChild(row).appendChild(col).appendChild(listGroup)

    var listItem;
    for (ans in quizItem) {
        // ans is a string in for-in loop.
        if ((ans === "question") || (ans === "correct")) {
            continue;
        }
        listItem = document.createElement('button');
        setAttributes(listItem, ["class", "id"], ["list-group-item list-group-item-action", ans], quizItem[ans]);
        listGroup.appendChild(listItem);
    }

    // Cycling through the questions. End of list triggers endQuiz().
    listGroup.addEventListener("click", function (event) {
        container.innerHTML = "";
        // Check correctness of user choice before building the new card.
        var choice = event.target.textContent;
        if (choice !== quizItem.correct) {
            time = time - 10;
        }
        if (index < quizItems.length - 1) {
            buildCard(quizItems[++index]);
        }
        else {
            timer.textContent = "Time: " + time;
            endQuiz();
        }
    })
}

function quizTimer() {
    var timer = document.getElementById("timer");
    time = 60;
    timerId = setInterval(function () {
        if (time > 0) {
            time--;
            timer.textContent = "Time: " + time;
        }
        else {
            endQuiz();
        }
    }, 1000)
}

// Helper. Sets multiple attributes of an element. attributes.length must equal setTo.length.
function setAttributes(element, attributes, setTo, text) {
    for (var i = 0; i < attributes.length; i++) {
        element.setAttribute(attributes[i], setTo[i]);
    }
    element.textContent = text;
}

// Helper. Set multiple children to parent element in order of children array.
function appendChildren(parent, children) {
    for (var i = 0; i < children.length; i++) {
        parent.appendChild(children[i]);
    }
}

// Display 'all done' page at end of game.
function endQuiz() {
    clearInterval(timerId);
    container.innerHTML = "";
    var allDone = document.createElement("div");
    allDone.setAttribute("class", "jumbotron text-center");
    var header = document.createElement("h1");
    setAttributes(header, ["class"], ["display-1"], "All done!");

    var score = document.createElement("h1");
    setAttributes(score, ["class"], ["display-4"], "You're final score is " + time + ".")

    // Bootstrap specific styling. 
    var form = document.createElement("form");
    form.setAttribute("class", "form-inline justify-content-center");
    var label = document.createElement("label");
    setAttributes(label, ["for", "class"], ["initials", "mr-1"], "Enter initials:");

    var input = document.createElement("input");
    setAttributes(input, ["type", "class", "id"], ["text", "form-control mb-2 mr-sm-2", "initials"])

    var submit = document.createElement("button");
    setAttributes(submit, ["type", "class"], ["submit", "btn btn-primary mb-2"], "Submit");

    container.appendChild(allDone);
    appendChildren(allDone, [header, score, form]);
    appendChildren(form, [label, input, submit]);

    // Submitting score.
    submit.addEventListener("click", function (event) {
        event.preventDefault();
        var initials = document.getElementById("initials").value;
        var score = {
            name: initials,
            score: time
        }
        if (localStorage.getItem("highscores") === null) {
            highScores.push(score);
        }
        else {
            highScores = JSON.parse(localStorage.getItem("highscores"));
            highScores.push(score);
        }
        localStorage.setItem("highscores", JSON.stringify(highScores));
        displayScores();
    })

}

function displayScores() {
    container.innerHTML = "";
    var jumbo = document.createElement("div");
    jumbo.setAttribute("class", "jumbotron");
    var header = document.createElement("h1");
    setAttributes(header, ["class"], ["display-1"], "Highscores");

    // Loops through the highscores stored in local storage and 
    // displays them.
    var scoreList = document.createElement("ul");
    scoreList.setAttribute("class", "list-group pt-2");
    if (!(highScores === null)) {
        var score;
        var text;
        for (var i = 0; i < highScores.length; i++) {
            score = document.createElement("li");
            text = highScores[i]["name"] + " - " + highScores[i]["score"];
            setAttributes(score, ["class"], ["list-group-item display-4"], text);
            scoreList.appendChild(score);
        }
    }
    // Styling, structure of page.
    var home = document.createElement("button");
    var clear = document.createElement("button");
    setAttributes(home, ["type", "class"], ["button", "btn btn-primary mt-2 mr-2"], "Home");
    setAttributes(clear, ["type", "class"], ["button", "btn btn-primary mt-2"], "Clear Highscores");
    container.appendChild(jumbo).appendChild(header);
    appendChildren(jumbo, [scoreList, home, clear]);

    home.addEventListener("click", function () {
        location.reload();
    });
    clear.addEventListener("click", function () {
        localStorage.clear();
        highScores = [];
        displayScores();
    });

}

function startQuiz() {
    // Quiz question objects used in buildCard().
    var first = {
        question: "String values must be enclosed within ____ when being assigned to variables.",
        a: "commas",
        b: "curly brackets",
        c: "quotes",
        d: "parentheses",
        correct: "quotes"
    };
    var second = {
        question: "Which of the following is NOT an example of a semantic HTML tag?",
        a: "<strong>",
        b: "<b>",
        c: "<aside>",
        d: "<article>",
        correct: "<b>"
    };
    var third = {
        question: "Commonly used data types do NOT include:",
        a: "string",
        b: "number",
        c: "boolean",
        d: "tundra",
        correct: "tundra"
    };
    quizItems = [first, second, third];
    document.getElementsByClassName("jumbotron")[0].remove();

    quizTimer();
    buildCard(quizItems[index]);
}
var viewScores = document.getElementById("view-scores");
viewScores.addEventListener("click", function () {
    highScores = JSON.parse(localStorage.getItem("highscores"));
    displayScores();
});
var startBtn = document.getElementById("start-button");
startBtn.addEventListener("click", startQuiz);