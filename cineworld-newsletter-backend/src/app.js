const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://cine-world-8sl9fzkgi-yards-projects-ee159c2c.vercel.app'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

app.use('/api/newsletter', require('./routes/newsletter.routes'));

module.exports = app;
