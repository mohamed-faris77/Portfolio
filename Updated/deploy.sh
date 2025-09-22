#!/bin/bash

# Portfolio Website Deployment Script
# This script helps deploy your portfolio to Netlify and backend to Railway/Render

echo "🚀 Portfolio Website Deployment Script"
echo "======================================"

# Check if Git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

echo "✅ Git repository found"

# Check if required files exist
required_files=("index.html" "script.js" "style.css" "backend/script.js" "backend/package.json")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Required file missing: $file"
        exit 1
    fi
done

echo "✅ All required files present"

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore file..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary files
*.tmp
*.temp

# Build directories
dist/
build/

# Netlify
.netlify/
EOF
    echo "✅ .gitignore created"
fi

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install
    cd ..
    echo "✅ Backend dependencies installed"
fi

echo ""
echo "🎯 Deployment Options:"
echo "===================="
echo "1. Deploy frontend to Netlify (recommended)"
echo "2. Deploy backend to Railway/Render"
echo "3. Full deployment guide"
echo ""

read -p "Choose an option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Deploying Frontend to Netlify:"
        echo "=================================="
        echo "1. Push your code to GitHub:"
        echo "   git add ."
        echo "   git commit -m 'Ready for Netlify deployment'"
        echo "   git push origin main"
        echo ""
        echo "2. Go to https://netlify.com"
        echo "3. Click 'New site from Git'"
        echo "4. Connect your GitHub repository"
        echo "5. Build settings: Leave default (static site)"
        echo "6. Deploy!"
        echo ""
        echo "7. Set environment variables in Netlify dashboard:"
        echo "   - API_URL = https://your-backend-service.railway.app"
        ;;
    2)
        echo ""
        echo "🖥️ Deploying Backend to Railway/Render:"
        echo "========================================"
        echo "1. Push your code to GitHub first"
        echo ""
        echo "For Railway (https://railway.app):"
        echo "2. Connect your GitHub repository"
        echo "3. Add environment variables:"
        echo "   - DB_USER, DB_HOST, DB_NAME, DB_PASS, DB_PORT"
        echo "   - DB_SSL=true"
        echo "   - NODE_ENV=production"
        echo "4. Deploy automatically"
        echo ""
        echo "For Render (https://render.com):"
        echo "2. Create new Web Service"
        echo "3. Connect your GitHub repository"
        echo "4. Set build command: npm install"
        echo "5. Set start command: npm start"
        echo "6. Add environment variables (same as Railway)"
        echo "7. Deploy!"
        ;;
    3)
        echo ""
        echo "📋 Complete Deployment Guide:"
        echo "=============================="
        echo ""
        echo "📁 Project Structure:"
        echo "  Updated/"
        echo "  ├── index.html          # Portfolio website"
        echo "  ├── script.js           # Frontend with API calls"
        echo "  ├── style.css           # Styles"
        echo "  ├── netlify.toml        # Netlify configuration"
        echo "  ├── backend/            # Backend API"
        echo "  │   ├── script.js       # Express server"
        echo "  │   └── package.json    # Dependencies"
        echo "  └── README.md           # This guide"
        echo ""
        echo "🔧 Environment Variables:"
        echo ""
        echo "Backend (.env file):"
        echo "  DB_USER=your_db_user"
        echo "  DB_HOST=your_db_host"
        echo "  DB_NAME=your_db_name"
        echo "  DB_PASS=your_db_password"
        echo "  DB_PORT=5432"
        echo "  DB_SSL=true"
        echo "  NODE_ENV=production"
        echo ""
        echo "Netlify (dashboard):"
        echo "  API_URL=https://your-backend-service.railway.app"
        echo ""
        echo "📊 Production Features:"
        echo "  ✅ Rate limiting (10 req/15min)"
        echo "  ✅ Input validation & sanitization"
        echo "  ✅ Error handling & logging"
        echo "  ✅ Health checks (/health, /test-db)"
        echo "  ✅ CORS configuration"
        echo "  ✅ Graceful shutdown"
        echo "  ✅ Database connection pooling"
        echo ""
        echo "🧪 Testing Your Deployment:"
        echo "  1. Test contact form submission"
        echo "  2. Check database for new entries"
        echo "  3. Verify health endpoints work"
        echo "  4. Test on different devices"
        echo ""
        echo "🔒 Security Features:"
        echo "  ✅ Rate limiting prevents spam"
        echo "  ✅ Input sanitization"
        echo "  ✅ CORS protection"
        echo "  ✅ Secure error handling"
        echo "  ✅ Environment variable security"
        ;;
    *)
        echo "❌ Invalid option. Please choose 1, 2, or 3."
        exit 1
        ;;
esac

echo ""
echo "🎉 Happy Deploying!"
echo ""
echo "Need help? Check the README.md file for detailed instructions."
