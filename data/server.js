// server.js

const express = require('express');
const fs = require('fs');
const app = express();

// Middleware to parse JSON in request body
app.use(express.json());

const DB_FILE_PATH = 'db.json';

// Function to read data from db.json
function readDatabase() {
  const data = fs.readFileSync(DB_FILE_PATH, 'utf8');
  return JSON.parse(data);
}

// Function to write data to db.json
function writeDatabase(data) {
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// API endpoint for creating members
app.post('/members', (req, res) => {
  const member = req.body;

  // Read existing members from db.json
  const membersData = readDatabase();

  // Check if the username already exists
  const existingMember = membersData.members.find(
    (existingMember) => existingMember.username === member.username
  );

  if (existingMember) {
    return res.status(409).json({ message: 'Username already exists.' });
  }

  // If the username doesn't exist, add the new member to the database
  membersData.members.push(member);

  // Write updated data back to db.json
  writeDatabase(membersData);

  // Respond with success
  return res.status(201).json({ message: 'Member created successfully.' });
});

// Your other routes and server setup...

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
