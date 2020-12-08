const express = require('express');
const connectDb = require('./config/db');

const app = express();

//Config express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Conect Database
connectDb();

//Define routes
app.use('/api/locations', require('./routes/location'));
app.use('/api/episodes', require('./routes/episode'));
app.use('/api/characters', require('./routes/character'));
app.use('/api', require('./routes/index'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
    console.log(`Server started on port ${PORT}, open your browser on http://localhost:${PORT}/api`
));
