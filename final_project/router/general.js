const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    // Check if the username already exists
    if (users.some(user => user.username === username)) {
        return res.status(400).json({message: "Username already exists"});
    }

    // Add the new user
    users.push({username: username, password: password});
    return res.status(200).json({message: "User registered successfully"});
});

// Task 1: Get all books available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(JSON.stringify(books, null, 2));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const booksByAuthor = [];

    // Iterate through all books and find books by the specified author
    bookKeys.forEach(key => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor.push({
                isbn: key,
                ...books[key]
            });
        }
    });

    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({message: "No books found by this author"});
    }
});

// Task 4: Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const booksByTitle = [];

    // Iterate through all books and find books by the specified title
    bookKeys.forEach(key => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            booksByTitle.push({
                isbn: key,
                ...books[key]
            });
        }
    });

    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({message: "No books found with this title"});
    }
});

// Task 5: Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
        const reviews = books[isbn].reviews;
        return res.status(200).json(reviews);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// =============================================================================
// ASYNC/AWAIT IMPLEMENTATIONS FOR TASKS 10-13
// =============================================================================

// Task 10: Get all books using async-await
public_users.get('/async/', async function (req, res) {
    try {
        // Simulate async operation using Promise
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                resolve(books);
            });
        };
        
        const allBooks = await getBooks();
        return res.status(200).json(JSON.stringify(allBooks, null, 2));
    } catch (error) {
        return res.status(500).json({message: "Error retrieving books"});
    }
});

// Task 11: Get book details by ISBN using async-await
public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        
        // Simulate async operation using Promise
        const getBookByISBN = (isbn) => {
            return new Promise((resolve, reject) => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject(new Error("Book not found"));
                }
            });
        };
        
        const book = await getBookByISBN(isbn);
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
});

// Task 12: Get book details by Author using async-await
public_users.get('/async/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        
        // Simulate async operation using Promise
        const getBooksByAuthor = (author) => {
            return new Promise((resolve, reject) => {
                const bookKeys = Object.keys(books);
                const booksByAuthor = [];
                
                bookKeys.forEach(key => {
                    if (books[key].author.toLowerCase() === author.toLowerCase()) {
                        booksByAuthor.push({
                            isbn: key,
                            ...books[key]
                        });
                    }
                });
                
                if (booksByAuthor.length > 0) {
                    resolve(booksByAuthor);
                } else {
                    reject(new Error("No books found by this author"));
                }
            });
        };
        
        const booksByAuthor = await getBooksByAuthor(author);
        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
});

// Task 13: Get book details by Title using async-await
public_users.get('/async/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        
        // Simulate async operation using Promise
        const getBooksByTitle = (title) => {
            return new Promise((resolve, reject) => {
                const bookKeys = Object.keys(books);
                const booksByTitle = [];
                
                bookKeys.forEach(key => {
                    if (books[key].title.toLowerCase() === title.toLowerCase()) {
                        booksByTitle.push({
                            isbn: key,
                            ...books[key]
                        });
                    }
                });
                
                if (booksByTitle.length > 0) {
                    resolve(booksByTitle);
                } else {
                    reject(new Error("No books found with this title"));
                }
            });
        };
        
        const booksByTitle = await getBooksByTitle(title);
        return res.status(200).json(booksByTitle);
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
});

// =============================================================================
// ALTERNATIVE PROMISE IMPLEMENTATIONS (using .then() callbacks)
// =============================================================================

// Task 10 using Promise callbacks
public_users.get('/promise/', function (req, res) {
    const getBooks = () => {
        return new Promise((resolve, reject) => {
            resolve(books);
        });
    };
    
    getBooks()
        .then(result => {
            return res.status(200).json(JSON.stringify(result, null, 2));
        })
        .catch(error => {
            return res.status(500).json({message: "Error retrieving books"});
        });
});

// Task 11 using Promise callbacks
public_users.get('/promise/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject(new Error("Book not found"));
            }
        });
    };
    
    getBookByISBN(isbn)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(404).json({message: error.message});
        });
});

module.exports.general = public_users;