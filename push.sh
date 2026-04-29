#!/bin/bash

echo "========================================="
echo "Pushing Changes to GitHub Repository"
echo "========================================="

# Set your GitHub credentials (REPLACE WITH YOUR ACTUAL INFO)
GIT_USERNAME="bkdevduniya"
GIT_EMAIL="your-email@gmail.com"  # CHANGE THIS!
REPO_NAME="expressBookReviews"
REPO_URL="https://github.com/$GIT_USERNAME/$REPO_NAME.git"

# Configure git
echo "1. Configuring git..."
git config --global user.name "$GIT_USERNAME"
git config --global user.email "$GIT_EMAIL"

# Navigate to project
echo "2. Navigating to project directory..."
cd /home/project/expressBookReviews

# Check if git repository exists
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ -z "$CURRENT_BRANCH" ]; then
    echo "Creating main branch..."
    git checkout -b main
else
    echo "Current branch: $CURRENT_BRANCH"
fi

# Check remote
if ! git remote | grep -q "origin"; then
    echo "Adding remote origin..."
    git remote add origin $REPO_URL
fi

# Add all changes
echo "3. Adding all changes..."
git add .

# Commit changes
echo "4. Committing changes..."
git commit -m "Complete Online Book Review Application

- All CRUD operations implemented
- JWT and Session authentication
- User registration and login
- Review management (add/modify/delete)
- Async/Promise implementations
- Complete working endpoints"

# Push to GitHub
echo "5. Pushing to GitHub..."
echo "NOTE: When prompted for password, use your PERSONAL ACCESS TOKEN (not your GitHub password)"
echo ""

git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "✅ SUCCESS! Code pushed to GitHub"
    echo "Repository URL: $REPO_URL"
    echo "========================================="
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "1. Your personal access token is correct"
    echo "2. You have write access to the repository"
    echo ""
    echo "To push with token, use:"
    echo "git push https://$GIT_USERNAME:YOUR_TOKEN@github.com/$GIT_USERNAME/$REPO_NAME.git main"
fi