const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Віддаємо статичні файли

// Завантаження питань
app.get("/questions", (req, res) => {
    fs.readFile("public/questions.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ message: "Помилка зчитування питань" });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Збереження результатів у JSON-файл
app.post("/save-result", (req, res) => {
    const newResult = req.body;
    fs.readFile("results.json", "utf8", (err, data) => {
        let results = [];
        if (err) {
            // Якщо є помилка зчитування (наприклад, файл не існує або пошкоджений), просто ініціалізуємо порожній масив
            if (err.code === 'ENOENT') {
                console.log("Файл не знайдений, ініціалізуємо порожній масив.");
            } else {
                res.status(500).json({ message: "Помилка зчитування результату" });
                return;
            }
        } else {
            try {
                results = JSON.parse(data);
            } catch (parseError) {
                // Якщо файл пошкоджений або має неправильний формат, ініціалізуємо порожній масив
                console.log("Помилка парсингу JSON, ініціалізуємо порожній масив.");
                results = [];
            }
        }

        results.push(newResult);

        fs.writeFile("results.json", JSON.stringify(results, null, 2), (err) => {
            if (err) {
                res.status(500).json({ message: "Помилка збереження результату" });
            } else {
                res.json({ message: "Результат збережено!" });
            }
        });
    });
});


app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
