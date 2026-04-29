const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user && user.password === password;
};

// Task 7: Login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ username: username }, "access", { expiresIn: '1h' });
    
    req.session.authorization = {
      accessToken: accessToken,
      username: username
    };
    
    return res.status(200).json({ message: "Customer successfully logged in" });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Task 8: Add or modify a book review - NOTE: endpoint is /review (no /customer)
regd_users.put("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;
  
  if (!username) {
    return res.status(401).json({ message: "You must be logged in" });
  }
  
  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }
  
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  if (!book.reviews) {
    book.reviews = {};
  }
  
  book.reviews[username] = review;
  
  return res.status(200).json({ 
    message: "Review added successfully", 
    reviews: book.reviews 
  });
});

// Task 9: Delete a book review - NOTE: endpoint is /review (no /customer)
regd_users.delete("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;
  
  if (!username) {
    return res.status(401).json({ message: "You must be logged in" });
  }
  
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "No review found to delete" });
  }
  
  delete book.reviews[username];
  
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
