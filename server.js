const express = require('express');
const app = express();

app.set('view-engine', 'ejs');

// Define a route
app.get('/', (req, res) => {
    res.render('index.ejs', { name: 'Samuel' });
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/register', (req, res) => {
    
});


// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
