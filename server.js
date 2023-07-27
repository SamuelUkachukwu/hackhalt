const express = require('express');
const session = require('express-session');
const app = express();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
const dataPath = path.join(__dirname, 'data', 'db.json');

// sets view engine
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false
}));

// Handles creation of member id
let data = { members: [] };
try {
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    data = JSON.parse(jsonData);
} catch (error) {
    console.error('Error reading data:', error);
}

// Function to find a user by username
const findUserByUsername = (username) => {
    return data.members.find((member) => member.username === username);
};

let lastUsedId = data.members.length;

// routes are defined below
// Home page route
app.get('/', (req, res) => {
    res.render('index.ejs', { name: 'Samuel' });
});

// Login route
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

// Handle login form post
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find the user with the given username in the data
        const user = findUserByUsername(username);

        // Check if the user exists and compare the hashed password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            // If the username or password is incorrect, redirect back to the login page
            return res.redirect('/login');
        }

        // User authentication successful; create a session to track authentication status
        req.session.isAuthenticated = true;

        // Redirect to the profile page
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
});

// Register routes
app.get('/register', (req, res) => {
    res.render('register.ejs');
});

// Handle Registration form post
app.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        // Check if the passwords match
        if (password !== confirmPassword) {
            req.session.errorMessage = 'Passwords do not match';
            return res.redirect('/register');
        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Read existing data from the 'db.json' file
        let data = { members: [] };
        try {
            const jsonData = fs.readFileSync(dataPath, 'utf8');
            data = JSON.parse(jsonData);
        } catch (error) {
            console.error('Error reading data:', error);
            req.session.errorMessage = 'An error occurred during registration. Please try again.';
            return res.redirect('/register');
        }

        // Check if the username or email already exists
        const existingUsername = data.members.find(member => member.username === username);
        const existingEmail = data.members.find(member => member.email === email);

        if (existingUsername) {
            req.session.errorMessage = 'Username already exists';
            return res.redirect('/register');
        }

        if (existingEmail) {
            req.session.errorMessage = 'Email already exists';
            return res.redirect('/register');
        }

        // Create a new member object
        const newMember = {
            id: ++lastUsedId,
            username,
            email,
            password: hashedPassword,
            admin: false,
        };
        // Add the new member to the 'members' array in the data object
        data.members.push(newMember);

        // Write the updated data back to the 'db.json' file
        fs.writeFile(dataPath, JSON.stringify(data, null, 2), (error) => {
            if (error) {
                console.error('Error writing data:', error);
                req.session.errorMessage = 'An error occurred during registration. Please try again.';
            } else {
                req.session.successMessage = 'Registration successful! You can now log in with your credentials.';
            }
            res.redirect('/login');
        });
    } catch (error) {
        console.error(error);
        req.session.errorMessage = 'An error occurred during registration. Please try again.';
        res.redirect('/register');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    // Destroy the session to log the user out
    req.session.destroy((error) => {
        if (error) {
            req.session.errorMessage = 'Error logging out of session. Please try again.';
        } else {
            res.redirect('/');
        }
    });
});

// Profile route
app.get('/profile', (req, res) => {
    // Check if the user is authenticated
    if (!req.session.isAuthenticated) {
        // If not authenticated, redirect back to the login page
        return res.redirect('/login');
    }
    const successMessage = req.session.successMessage;
    const errorMessage = req.session.errorMessage;
    req.session.successMessage = null;
    req.session.errorMessage = null;
    // Render the profile page since the user is authenticated
    res.render('profile.ejs', { successMessage, errorMessage });
});

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
