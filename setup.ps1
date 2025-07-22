

Write-Host "🚀 Starting project setup for Windows..." -ForegroundColor Green

# --- 1. Backend Setup (Node.js & Express) ---
Write-Host "Setting up backend: leaderboard-backend..." -ForegroundColor Cyan

# Create the main backend directory and navigate into it
New-Item -ItemType Directory -Name "leaderboard-backend"
Set-Location -Path "leaderboard-backend"

# Create all the necessary subdirectories
New-Item -ItemType Directory -Name "config"
New-Item -ItemType Directory -Name "controllers"
New-Item -ItemType Directory -Name "models"
New-Item -ItemType Directory -Name "routes"

# Create the empty files in their respective directories
New-Item -ItemType File -Name "config/db.js"
New-Item -ItemType File -Name "controllers/userController.js"
New-Item -ItemType File -Name "models/userModel.js"
New-Item -ItemType File -Name "models/claimHistoryModel.js"
New-Item -ItemType File -Name "routes/api.js"
New-Item -ItemType File -Name "server.js"
New-Item -ItemType File -Name ".env"
New-Item -ItemType File -Name ".gitignore"

# Add initial content to .gitignore for Node.js
@"
# Dependencies
/node_modules

# Environment variables
.env

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
"@ | Set-Content -Path ".gitignore"

# Navigate back to the root project directory
Set-Location -Path ".."

Write-Host "✅ Backend structure created successfully." -ForegroundColor Green
Write-Host ""


# --- 2. Frontend Setup (React) ---
Write-Host "Setting up frontend: leaderboard-frontend..." -ForegroundColor Cyan

# Use create-react-app to generate the standard React project structure
# This command works in PowerShell as well
npx create-react-app leaderboard-frontend

# Navigate into the newly created frontend directory
Set-Location -Path "leaderboard-frontend"

# Create the components directory inside src/
New-Item -ItemType Directory -Name "src/components"

# Create the empty component files
New-Item -ItemType File -Name "src/components/Leaderboard.js"
New-Item -ItemType File -Name "src/components/UserManagement.js"
New-Item -ItemType File -Name "src/components/ThemeSwitcher.js"
New-Item -ItemType File -Name "src/components/UserAvatar.js"

# Navigate back to the root
Set-Location -Path ".."

Write-Host "✅ Frontend structure created successfully." -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Project setup complete!" -ForegroundColor Magenta
Write-Host "Next steps:"
Write-Host "1. In 'leaderboard-backend', run 'npm install express mongoose cors dotenv' and 'npm install --save-dev nodemon'"
Write-Host "2. In 'leaderboard-frontend', run 'npm install axios'"

