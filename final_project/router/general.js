const express = require('express');
const axios = require('axios'); // Add this line
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully. You can now login." });
});

// Task 1: Get all books
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 10: Get all books using Axios (Promise)
public_users.get('/async-books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5001/');
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    res.send(JSON.stringify(book, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 11: Get book by ISBN using Axios
public_users.get('/async-isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5001/isbn/${isbn}`);
    res.send(response.data);
  } catch (error) {
    res.status(404).json({ message: `Book not found with ISBN: ${req.params.isbn}` });
  }
});

// Task 3: Get books by author
public_users.get('/author/:author', function (req, res) {
  const authorName = req.params.author.toLowerCase();
  const matchingBooks = [];
  
  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === authorName) {
      matchingBooks.push({
        isbn: isbn,
        title: books[isbn].title,
        author: books[isbn].author
      });
    }
  }
  
  if (matchingBooks.length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found" });
  }
});

// Task 12: Get books by author using Axios
public_users.get('/async-author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5001/author/${author}`);
    res.send(response.data);
  } catch (error) {
    res.status(404).json({ message: `No books found by author: ${req.params.author}` });
  }
});

// Task 4: Get book by title
public_users.get('/title/:title', function (req, res) {
  const titleName = req.params.title.toLowerCase();
  let foundBook = null;
  
  for (let isbn in books) {
    if (books[isbn].title.toLowerCase() === titleName) {
      foundBook = {
        isbn: isbn,
        title: books[isbn].title,
        author: books[isbn].author,
        reviews: books[isbn].reviews
      };
      break;
    }
  }
  
  if (foundBook) {
    res.send(JSON.stringify(foundBook, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 13: Get book by title using Axios
public_users.get('/async-title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5001/title/${title}`);
    res.send(response.data);
  } catch (error) {
    res.status(404).json({ message: `No book found with title: ${req.params.title}` });
  }
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    if (Object.keys(book.reviews).length > 0) {
      res.send(JSON.stringify(book.reviews, null, 4));
    } else {
      res.json({ message: "No reviews found for this book." });
    }
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
