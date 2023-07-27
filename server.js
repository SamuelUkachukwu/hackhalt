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
    secret: process.env.SESSION_SECRET, // Replace 'your-secret-key' with a secret key for session encryption
    resave: false,
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

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login form submitted with data:', req.body);

        // Find the user with the given username in the data
        const user = findUserByUsername(username);
        console.log('User found by username:', user);
        // Check if the user exists and compare the hashed password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            // If the username or password is incorrect, redirect back to the login page
            return res.redirect('/login');
        }

        // User authentication successful; create a session to track authentication status
        req.session.isAuthenticated = true;

        // Redirect to the profile page
        console.log('User authenticated successfully! Redirecting to profile page.');
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

app.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        console.log('Registration form submitted with data:', req.body);
        // Check if the passwords match
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
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
        }

        // Create a new member object
        const newMember = {
            id: ++lastUsedId,
            username,
            email,
            password: hashedPassword,
            admin: false, // Set the default value for the 'admin' property here
        };
        console.log('New member object:', newMember);
        // Add the new member to the 'members' array in the data object
        data.members.push(newMember);

        // Write the updated data back to the 'db.json' file
        fs.writeFile(dataPath, JSON.stringify(data, null, 2), (error) => {
            if (error) {
                console.error('Error writing data:', error);
            } else {
                console.log('Member registered and data saved successfully!');
            }
        });
        req.session.isAuthenticated = true;
        // Redirect the user to the login page after successful registration
        console.log('User registered successfully! Redirecting to profile page.');
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.redirect('/register');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    // Destroy the session to log the user out
    req.session.destroy((error) => {
        if (error) {
            console.error('Error destroying session:', error);
        } else {
            console.log('User logged out successfully!');
            res.redirect('/login'); // Redirect the user to the login page after logout
        }
    });
});

// Profile route
app.get('/profile', (req, res) => {
    // Check if the user is authenticated (logged in)
    if (!req.session.isAuthenticated) {
        // If not authenticated, redirect back to the login page
        return res.redirect('/login');
    }

    // Render the profile page since the user is authenticated
    res.render('profile.ejs');
});

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
