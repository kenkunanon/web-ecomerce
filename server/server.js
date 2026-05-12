const express = require('express');
const app = express();
const port = 5000;
const morgan = require('morgan'); // Fixed syntax error
const {readdirSync} = require('fs');
const cors = require('cors');
require('dotenv').config();
app.use(morgan('dev'));
app.use(express.json({limit : '20mb'}));
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL,
    'https://sk-snack.netlify.app'
  ].filter(Boolean),
  credentials: true,
}));
readdirSync('./routes')
.map((r) => app.use('/api', require('./routes/'+r)));
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});