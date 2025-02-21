const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3000;

// Використовуємо cors для дозволу запитів з різних доменів
app.use(cors());

// Для парсингу JSON запитів
app.use(express.json());

// Віддаємо статичні файли з папки public
app.use(express.static("public"));

// Перевіряємо, чи існує results.json, якщо ні — створюємо порожній масив
const resultsFile = "results.json";
if (!fs.existsSync(resultsFile)) {
    fs.writeFileSync(resultsFile, "[]", "utf8");
}

// Завантаження питань
app.get("/questions", (req, res) => {
    fs.readFile(path.join(__dirname, "public", "questions.json"), "utf8", (err, data) => {
        if (err) {
            console.error("Помилка зчитування питань:", err);
            return res.status(500).json({ message: "Помилка зчитування питань" });
        }
        res.json(JSON.parse(data));
    });
});

// Збереження результатів у JSON-файл
// Обробник POST-запиту для збереження результату
app.post("/save-result", (req, res) => {
    const newResult = req.body;

    // Перевірка коректності структури даних
    if (!newResult.name || !newResult.date || newResult.score === undefined) {
        return res.status(400).json({ message: "Невірний формат результату" });
    }

    // Зчитуємо поточні результати
    fs.readFile(resultsFile, "utf8", (err, data) => {
        let results = [];

        if (!err) {
            try {
                results = JSON.parse(data);
            } catch (parseError) {
                console.error("Помилка парсингу JSON. Створюємо новий файл.");
                results = [];
            }
        }

        // Додаємо новий результат
        results.push(newResult);

        // Записуємо в файл
        fs.writeFile(resultsFile, JSON.stringify(results, null, 2), (err) => {
            if (err) {
                console.error("Помилка збереження результату:", err);
                return res.status(500).json({ message: "Помилка збереження результату" });
            }
            res.json({ message: "Результат збережено!", data: newResult });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
