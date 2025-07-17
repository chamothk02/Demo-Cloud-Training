const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // use your DB username
  password: 'Pmck81491794',         // use your DB password
  database: 'customer_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Routes

// Get all customers
app.get('/customers', (req, res) => {
  db.query('SELECT * FROM customers', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Get a single customer
app.get('/customers/:id', (req, res) => {
  db.query('SELECT * FROM customers WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Customer not found' });
    res.json(results[0]);
  });
});

// Create a new customer
app.post('/customers', (req, res) => {
  const { name, email, phone } = req.body;
  db.query('INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)', [name, email, phone], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Customer created', id: result.insertId });
  });
});

// Update customer
app.put('/customers/:id', (req, res) => {
  const { name, email, phone } = req.body;
  db.query(
    'UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?',
    [name, email, phone, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Customer updated' });
    }
  );
});

// Delete customer
app.delete('/customers/:id', (req, res) => {
  db.query('DELETE FROM customers WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Customer deleted' });
  });
});

// Start Server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
