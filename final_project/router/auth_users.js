const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    // Check if username exists in users array
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
    // Check if username and password match the one we have in records
    return users.some(user => user.username === username && user.password === password);
}

// Task 7: Login as a registered user
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    // Check if user is authenticated
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    // Check if review is provided
    if (!review) {
        return res.status(400).json({message: "Review is required"});
    }

    // Check if book exists
    if (books[isbn]) {
        // Add or modify the review for this user
        books[isbn].reviews[username] = review;
        return res.status(200).json({message: "Review successfully added/updated"});
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    // Check if book exists
    if (books[isbn]) {
        // Check if user has a review for this book
        if (books[isbn].reviews[username]) {
            // Delete the user's review
            delete books[isbn].reviews[username];
            return res.status(200).json({message: "Review successfully deleted"});
        } else {
            return res.status(404).json({message: "Review not found for this user"});
        }
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;