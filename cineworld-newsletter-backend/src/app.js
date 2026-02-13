const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:4200',
  'https://cine-world-app.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/newsletter', require('./routes/newsletter.routes'));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API running 🚀' });
});

module.exports = app;
