// Перемінна для збереження питань
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Функція для завантаження питань з JSON файлу
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

// Функція для завантаження питання
function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("question-text").innerText = question.question;
    
    // Підключаємо SVG-файл як <img>
    document.getElementById("svg-container").innerHTML = `<img src="${question.svg}" alt="SVG Image" width="100">`;

    const answersContainer = document.getElementById("answers");
    answersContainer.innerHTML = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => selectAnswer(index);
        answersContainer.appendChild(button);
    });

    // Оновлюємо інтерфейс кнопок
    document.getElementById("next-button").style.display = "block";
    document.getElementById("finish-button").style.display = "none";
}

// Функція для вибору відповіді
function selectAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    const correctIndex = question.correct;

    // Якщо відповідь правильна, збільшуємо рахунок
    if (selectedIndex === correctIndex) {
        score++;
    }

    // Додати візуальний ефект для правильної/неправильної відповіді
    const answersButtons = document.getElementById("answers").children;
    for (let i = 0; i < answersButtons.length; i++) {
        const button = answersButtons[i];
        if (i === correctIndex) {
            button.style.backgroundColor = "green"; // Правильна відповідь
        } else {
            button.style.backgroundColor = "red"; // Неправильна відповідь
        }
    }

    // Відключаємо кнопки після вибору
    const buttons = document.querySelectorAll("#answers button");
    buttons.forEach(button => button.disabled = true);

    // Показуємо кнопку "Наступне питання"
    document.getElementById("next-button").style.display = "block";
}

// Функція для переходу до наступного питання
function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
        // Якщо це останнє питання, показуємо результат
        showResults();
    } else {
        // Завантажуємо наступне питання
        loadQuestion();
        updateQuestionSelector();
    }
}

// Функція для завершення тесту
function finishTest() {
    showResults();
}

// Функція для показу результатів
function showResults() {
    document.getElementById("question-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";
    document.getElementById("result-container").innerHTML = `Ваш результат: ${score} з 5`;

    // Зберігаємо результат у LocalStorage
    localStorage.setItem('testResult', score);
}

// Оновлюємо блок вибору питань
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

// Перехід до конкретного питання
function goToQuestion(index) {
    currentQuestionIndex = index;
    loadQuestion();
}

// Обробник подій
document.getElementById("next-button").addEventListener("click", nextQuestion);
document.getElementById("finish-button").addEventListener("click", finishTest);

// Завантажуємо питання
loadQuestions();
