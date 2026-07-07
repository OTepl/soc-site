const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'mysqlstudenti.litv.sssvt.cz',
    port: 3306,
    user: 'teplikotakar',
    password: '123456', 
    database: '4a2_teplikotakar_db2'
});

db.connect(err => {
    if (err) {
        console.error('DATABASE ERROR:', err.message);
        return;
    }
    console.log('Successfully connected to school database!');
});

app.post('/api/register', (req, res) => {
    const { firstName, lastName, age, username, password } = req.body;
    const sql = "INSERT INTO users (first_name, last_name, age, username, password) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [firstName, lastName, age, username, password], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT id, first_name, last_name FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (results && results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ success: false });
        }
    });
});

app.get('/api/posts', (req, res) => {
    const sql = "SELECT posts.*, users.first_name, users.last_name FROM posts JOIN users ON posts.author_id = users.id ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json([]);
        res.json(results);
    });
});

app.post('/api/posts', (req, res) => {
    const { author_id, title, content } = req.body;
    const sql = "INSERT INTO posts (author_id, title, content) VALUES (?, ?, ?)";
    db.query(sql, [author_id, title, content], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.listen(3000, () => console.log('Server: http://localhost:3000'));