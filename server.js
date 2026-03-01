const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

let expenses = [];

app.post("/add", (req, res) => {
    const { title, amount } = req.body;
    expenses.push({ title, amount });
    res.json({ message: "Expense Added" });
});

app.get("/expenses", (req, res) => {
    res.json(expenses);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});