const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors({
  origin: 'https://your-frontend-domain.vercel.app',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

app.use('/api/newsletter', require('./routes/newsletter.routes'));

module.exports = app;
