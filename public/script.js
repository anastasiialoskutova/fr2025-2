let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Завантаження питань із JSON-файлу
function loadQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            loadQuestion();
            updateQuestionSelector();
        })
        .catch(error => console.error("Помилка завантаження питань:", error));
}

// Завантаження питання
function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("question-text").innerText = question.question;
    
    document.getElementById("svg-container").innerHTML = `<img src="${question.svg}" alt="SVG Image" width="100">`;

    const answersContainer = document.getElementById("answers");
    answersContainer.innerHTML = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => selectAnswer(index);
        answersContainer.appendChild(button);
    });

    // Оновлення кнопок
    document.getElementById("next-button").style.display = (currentQuestionIndex < questions.length - 1) ? "block" : "none";
    document.getElementById("finish-button").style.display = (currentQuestionIndex === questions.length - 1) ? "block" : "none";
}

// Обробка вибору відповіді
function selectAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    const correctIndex = question.correct;

    if (selectedIndex === correctIndex) {
        score++;
    }

    // Позначаємо правильну/неправильну відповідь кольорами
    const answersButtons = document.getElementById("answers").children;
for (let i = 0; i < answersButtons.length; i++) {
    // Видаляємо попередні класи, якщо вони є
    answersButtons[i].classList.remove('correct', 'incorrect');
    
    // Додаємо правильний клас для кожної кнопки
    if (i === correctIndex) {
        answersButtons[i].classList.add('correct');
    } else {
        answersButtons[i].classList.add('incorrect');
    }
}

    

    // Деактивація кнопок після вибору
    document.querySelectorAll("#answers button").forEach(button => button.disabled = true);

    // Відображаємо потрібну кнопку
    document.getElementById("next-button").style.display = (currentQuestionIndex < questions.length - 1) ? "block" : "none";
    document.getElementById("finish-button").style.display = (currentQuestionIndex === questions.length - 1) ? "block" : "none";
}

// Перехід до наступного питання
function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

// Завершення тесту
function finishTest() {
    // Приховуємо поле введення імені
    document.getElementById("username").style.display = "none";
    
    showResults();
    saveResults();
}


// Відображення результатів
function showResults() {
    const username = document.getElementById("username").value || "Анонім";
    const previousScore = localStorage.getItem('testResult') || "Немає попереднього результату";

    document.getElementById("question-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";
    document.getElementById("result-container").innerHTML = `
        <p>${username}, ваш результат: ${score} з ${questions.length}</p>
        <p>Попередній результат: ${previousScore}</p>
    `;

    localStorage.setItem('testResult', score);
}

// Збереження результатів у JSON
function saveResults() {
    const username = document.getElementById("username").value || "Анонім";
    const date = new Date().toISOString().split("T")[0];

    const resultData = { name: username, date: date, score: score };

    fetch("http://localhost:3000/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultData),
    })
    .then(response => response.json())
    .then(data => console.log("Результат збережено:", data))
    .catch(error => console.error("Помилка збереження:", error));
}

// Оновлення вибору питань
function updateQuestionSelector() {
    const questionNumbersContainer = document.getElementById("question-numbers");
    questionNumbersContainer.innerHTML = "";
    
    questions.forEach((_, index) => {
        const button = document.createElement("button");
        button.innerText = index + 1;
        button.onclick = () => goToQuestion(index);
        questionNumbersContainer.appendChild(button);
    });
}

// Перехід до вибраного питання
function goToQuestion(index) {
    currentQuestionIndex = index;
    loadQuestion();
}

// Додаємо обробники подій
document.getElementById("next-button").addEventListener("click", nextQuestion);
document.getElementById("finish-button").addEventListener("click", finishTest);

// Завантаження питань
loadQuestions();
