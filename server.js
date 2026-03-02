const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// Simple JSON Data Persistence
const DATA_FILE = "expenses.json";

const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

const saveData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// --- API Routes ---

// Get all expenses
app.get("/api/expenses", (req, res) => {
    res.json(readData());
});

// Add new expense
app.post("/api/expenses", (req, res) => {
    const { title, amount, category, date } = req.body;
    
    if (!title || !amount || !category || !date) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const expenses = readData();
    const newExpense = {
        id: Date.now(), // Better unique ID
        title,
        amount: parseFloat(amount),
        category,
        date
    };

    expenses.push(newExpense);
    saveData(expenses);
    res.status(201).json(newExpense);
});

// Delete expense
app.delete("/api/expenses/:id", (req, res) => {
    const id = parseInt(req.params.id);
    let expenses = readData();
    const initialLength = expenses.length;
    expenses = expenses.filter(exp => exp.id !== id);

    if (expenses.length === initialLength) {
        return res.status(404).json({ error: "Expense not found" });
    }

    saveData(expenses);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🚀 Professional Tracker running at http://localhost:${PORT}`);
});