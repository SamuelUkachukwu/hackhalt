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
    res.render('index.ejs');
});

// Login route
app.get('/login', (req, res) => {
    res.render('login.ejs', { successMessage: req.session.successMessage });

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

        // Add user data to session 
        req.session.user = user;

        // Redirect to the profile page
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
});

// Register routes
app.get('/register', (req, res) => {
    res.render('register.ejs', { errorMessage: req.session.errorMessage });
});

// Handle Registration form post
function getPasswordStrength(dataPassword) {
    // Criteria scores
    const lengthScores = {
        8: 2,
        10: 3,
        14: 5,
    };

    const lowercaseScores = {
        1: 1,
        2: 2,
        3: 4,
    };

    const uppercaseScores = {
        1: 1,
        2: 2,
        3: 4,
    };

    const numberScores = {
        1: 1,
        2: 2,
        3: 4,
    };

    const specialCharScores = {
        1: 1,
        2: 2,
        3: 4,
    };

    // Initialize scores
    let score = 0;
    let lowercaseCount = 0;
    let uppercaseCount = 0;
    let numberCount = 0;
    let specialCharCount = 0;

    // Calculate scores based on criteria
    const passwordLength = dataPassword.length;
    score += lengthScores[8] || 0; // Default to 0 if not found in the criteria
    for (const char of dataPassword) {
        if (char.match(/[a-z]/)) lowercaseCount++;
        else if (char.match(/[A-Z]/)) uppercaseCount++;
        else if (char.match(/[0-9]/)) numberCount++;
        else if (char.match(/[!@#$%^&*()_+{}[\]:;<>,.?~\\\/\-="']/)) specialCharCount++;
    }

    score += lowercaseScores[Math.min(lowercaseCount, 3)] || 0;
    score += uppercaseScores[Math.min(uppercaseCount, 3)] || 0;
    score += numberScores[Math.min(numberCount, 3)] || 0;
    score += specialCharScores[Math.min(specialCharCount, 3)] || 0;

    // Determine the strength category based on the score
    let strengthCategory;
    if (score >= 20) {
        strengthCategory = 'Very Strong';
    } else if (score >= 15) {
        strengthCategory = 'Strong';
    } else if (score >= 10) {
        strengthCategory = 'Medium';
    } else {
        strengthCategory = 'Weak';
    }

    return {
        score: score,
        strength: strengthCategory,
    };
}


app.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        // Check if the passwords match
        if (password !== confirmPassword) {
            req.session.errorMessage = 'Passwords do not match';
            return res.redirect('/register');
        }
        const { score, strength } = getPasswordStrength(password);
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
            score: score,
            strength: strength,
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
    const user = req.session.user;

    const successMessage = req.session.successMessage;
    const errorMessage = req.session.errorMessage;
    req.session.successMessage = null;
    req.session.errorMessage = null;
    // Render the profile page since the user is authenticated
    res.render('profile.ejs', { user, successMessage, errorMessage });
});

function hasConsecutiveCharacters(inputString) {
    for (let i = 0; i < inputString.length - 1; i++) {
        if (inputString[i] === inputString[i + 1]) {
            return true;
        }
    }
    return false;
}

app.post('/change-password', async (req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            return res.redirect('/login');
        }

        const { currentPassword, newPassword, confirmPassword } = req.body;
        const user = data.members.find((member) => member.username === req.session.user.username);

        // Check if the provided current password matches the user's actual current password
        if (!(await bcrypt.compare(currentPassword, user.password))) {
            req.session.errorMessage = 'Incorrect current password';
            return res.redirect('/profile');
        }

        // Check if password is not empty
        if (!newPassword || newPassword.trim() === '') {
            req.session.errorMessage = 'Password should not be empty';
            return res.redirect('/profile');
        }

        // Check if password contains consecutive letters or numbers
        if (hasConsecutiveCharacters(newPassword)) {
            req.session.errorMessage = 'Password should not contain consecutive letters or numbers';
            return res.redirect('/profile');
        }

        // Check if password contains capital letters, numbers, and characters
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
        if (!passwordRegex.test(newPassword)) {
            req.session.errorMessage =
                'Password should contain capital letters, numbers, and special characters (@ $ ! % * ? &)';
            return res.redirect('/profile');
        }

        // Check if password is at least 8 characters long
        if (newPassword.length < 8) {
            req.session.errorMessage = 'Password should be at least 8 characters long';
            return res.redirect('/profile');
        }

        // Verify password match
        if (newPassword !== confirmPassword) {
            req.session.errorMessage = 'New passwords do not match';
            return res.redirect('/profile');
        }

        const { score, strength } = getPasswordStrength(newPassword);

        // Generate a new password hash for the user
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        if (user) {
            // Update the user's password in the data object
            user.password = hashedNewPassword;
            user.score = score;
            user.strength = strength

            // Write the updated data back to the db.json file
            fs.writeFile(dataPath, JSON.stringify(data, null, 2), (error) => {
                if (error) {
                    console.error('Error writing data:', error);
                    req.session.errorMessage = 'An error occurred during password change. Please try again.';
                } else {
                    req.session.successMessage = 'Password changed successfully!';
                }
                req.session.successMessage = 'Password changed successfully!';
                res.redirect('/login');
            });
        } else {
            req.session.errorMessage = 'User not found.';
            res.redirect('/profile');
        }
    } catch (error) {
        console.error(error);
        req.session.errorMessage = 'An error occurred during password change. Please try again.';
        res.redirect('/profile');
    }
});

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
