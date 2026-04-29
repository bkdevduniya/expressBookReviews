const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ============ TASK 6: Register a new user ============
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  
  // Check if username already exists
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists. Please choose another one." });
  }
  
  // Register new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully. You can now login." });
});

// ============ TASK 1: Get the book list available in the shop ============
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// ============ TASK 10: Get books using Promise/Async-Await ============
// Using Promise
public_users.get('/async-books', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    if (books && Object.keys(books).length > 0) {
      resolve(books);
    } else {
      reject("No books found in the database");
    }
  });
  
  getBooks
    .then(booksData => {
      res.send(JSON.stringify(booksData, null, 4));
    })
    .catch(error => {
      res.status(500).json({ message: "Error fetching books", error: error });
    });
});

// Using Async/Await
public_users.get('/async-books-await', async function (req, res) {
  try {
    const booksData = await Promise.resolve(books);
    res.send(JSON.stringify(booksData, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// ============ TASK 2: Get book details based on ISBN ============
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    res.send(JSON.stringify(book, null, 4));
  } else {
    res.status(404).json({ message: "Book not found with ISBN: " + isbn });
  }
});

// ============ TASK 11: Get book by ISBN using Promise/Async-Await ============
// Using Promise
public_users.get('/async-isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  const getBookByISBN = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(`Book not found with ISBN: ${isbn}`);
    }
  });
  
  getBookByISBN
    .then(book => {
      res.send(JSON.stringify(book, null, 4));
    })
    .catch(error => {
      res.status(404).json({ message: error });
    });
});

// Using Async/Await
public_users.get('/async-isbn-await/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      const foundBook = books[isbn];
      if (foundBook) {
        resolve(foundBook);
      } else {
        reject(`Book not found with ISBN: ${isbn}`);
      }
    });
    res.send(JSON.stringify(book, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// ============ TASK 3: Get book details based on author ============
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
    res.status(404).json({ message: "No books found by author: " + req.params.author });
  }
});

// ============ TASK 12: Get books by author using Promise/Async-Await ============
// Using Promise
public_users.get('/async-author/:author', function (req, res) {
  const authorName = req.params.author.toLowerCase();
  
  const getBooksByAuthor = new Promise((resolve, reject) => {
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
      resolve(matchingBooks);
    } else {
      reject(`No books found by author: ${req.params.author}`);
    }
  });
  
  getBooksByAuthor
    .then(books => {
      res.send(JSON.stringify(books, null, 4));
    })
    .catch(error => {
      res.status(404).json({ message: error });
    });
});

// Using Async/Await
public_users.get('/async-author-await/:author', async function (req, res) {
  try {
    const authorName = req.params.author.toLowerCase();
    const matchingBooks = await new Promise((resolve, reject) => {
      const booksList = [];
      for (let isbn in books) {
        if (books[isbn].author.toLowerCase() === authorName) {
          booksList.push({
            isbn: isbn,
            title: books[isbn].title,
            author: books[isbn].author
          });
        }
      }
      if (booksList.length > 0) {
        resolve(booksList);
      } else {
        reject(`No books found by author: ${req.params.author}`);
      }
    });
    res.send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// ============ TASK 4: Get book details based on title ============
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
    res.status(404).json({ message: "No book found with title: " + req.params.title });
  }
});

// ============ TASK 13: Get book by title using Promise/Async-Await ============
// Using Promise
public_users.get('/async-title/:title', function (req, res) {
  const titleName = req.params.title.toLowerCase();
  
  const getBookByTitle = new Promise((resolve, reject) => {
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
      resolve(foundBook);
    } else {
      reject(`No book found with title: ${req.params.title}`);
    }
  });
  
  getBookByTitle
    .then(book => {
      res.send(JSON.stringify(book, null, 4));
    })
    .catch(error => {
      res.status(404).json({ message: error });
    });
});

// Using Async/Await
public_users.get('/async-title-await/:title', async function (req, res) {
  try {
    const titleName = req.params.title.toLowerCase();
    const foundBook = await new Promise((resolve, reject) => {
      let book = null;
      for (let isbn in books) {
        if (books[isbn].title.toLowerCase() === titleName) {
          book = {
            isbn: isbn,
            title: books[isbn].title,
            author: books[isbn].author,
            reviews: books[isbn].reviews
          };
          break;
        }
      }
      if (book) {
        resolve(book);
      } else {
        reject(`No book found with title: ${req.params.title}`);
      }
    });
    res.send(JSON.stringify(foundBook, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// ============ TASK 5: Get book reviews ============
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
    res.status(404).json({ message: "Book not found with ISBN: " + isbn });
  }
});

module.exports.general = public_users;