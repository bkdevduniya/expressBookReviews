const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Check if username and password match records
const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user && user.password === password;
};

// Task 6: Register a new user
regd_users.post("/register", (req, res) => {
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

// Task 7: Login for registered users
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    let accessToken = jwt.sign({ username: username }, "access", { expiresIn: '1h' });
    
    // Store token in session
    req.session.authorization = {
      accessToken: accessToken,
      username: username
    };
    
    return res.status(200).json({ 
      message: "User successfully logged in",
      token: accessToken,
      username: username
    });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// TASK 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; // Review comes from query parameter
  const username = req.session.authorization?.username;
  
  // Check if user is logged in
  if (!username) {
    return res.status(401).json({ message: "You must be logged in to add/modify a review" });
  }
  
  // Check if review is provided
  if (!review) {
    return res.status(400).json({ message: "Review content is required. Please provide it as a query parameter: ?review=your review" });
  }
  
  // Check if book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found with ISBN: " + isbn });
  }
  
  // Initialize reviews object if it doesn't exist
  if (!book.reviews) {
    book.reviews = {};
  }
  
  // Check if this is a new review or modification
  const isNewReview = !book.reviews[username];
  
  // Add or modify review
  book.reviews[username] = review;
  
  return res.status(200).json({ 
    message: isNewReview ? "Review added successfully" : "Review modified successfully",
    isbn: isbn,
    username: username,
    review: review,
    all_reviews_for_book: book.reviews
  });
});

// TASK 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;
  
  // Check if user is logged in
  if (!username) {
    return res.status(401).json({ message: "You must be logged in to delete a review" });
  }
  
  // Check if book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found with ISBN: " + isbn });
  }
  
  // Initialize reviews if it doesn't exist
  if (!book.reviews) {
    book.reviews = {};
  }
  
  // Check if user has a review for this book
  if (!book.reviews[username]) {
    return res.status(404).json({ 
      message: "You don't have a review for this book to delete",
      your_reviews: getUsersReviews(books, username)
    });
  }
  
  // Store the deleted review for response
  const deletedReview = book.reviews[username];
  
  // Delete the review
  delete book.reviews[username];
  
  return res.status(200).json({ 
    message: "Review deleted successfully",
    deleted_review: deletedReview,
    remaining_reviews: book.reviews
  });
});

// Helper function to get all reviews by a specific user
function getUsersReviews(books, username) {
  const userReviews = {};
  for (let isbn in books) {
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      userReviews[isbn] = books[isbn].reviews[username];
    }
  }
  return userReviews;
}

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;