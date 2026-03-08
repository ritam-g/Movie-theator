
# Deployment Guide for Render

This guide explains how to deploy the Movie Platform to Render.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **MongoDB**: You need a MongoDB database (can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier or Render's native MongoDB)
3. **TMDB API Key**: Get a free API key from [The Movie Database](https://www.themoviedb.org/settings/api)

## Environment Variables Setup

Before deploying, you need to set up the following environment variables. **Do NOT commit your .env file to GitHub** - add these directly in Render's dashboard.

### Required Environment Variables

| Variable | Description | How to Get | Required Value |
|----------|-------------|------------|----------------|
| `NODE_ENV` | Set environment to production | Manual | `production` |
| `PORT` | Render assigns this automatically | Auto-assigned | Leave blank or use `10000` |
| `MONGO_URI` | MongoDB connection string | MongoDB Atlas or Render | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | Generate yourself | Min 32 chars, e.g., `your-secure-random-string-here` |
| `TMDB_API_KEY` | TMDB API key | [TMDB API](https://www.themoviedb.org/settings/api) | Your API key |
| `CLIENT_URL` | Your Render URL | After deployment | `https://your-app.onrender.com` |

### How to Get Each Variable

1. **MONGO_URI**: 
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

2. **JWT_SECRET**: 
   - Generate a secure random string at least 32 characters
   - Or use: `openssl rand -base64 32` in terminal

3. **TMDB_API_KEY**: 
   - Go to [The Movie Database](https://www.themoviedb.org/)
   - Sign in → Settings → API
   - Create an API key (it's free)

## Deployment Steps

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create a Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `movie-platform` (or your preferred name)
     - **Environment**: `Node`
     - **Build Command**: `npm run build`
     - **Start Command**: `npm run start`
   - **IMPORTANT**: Add Environment Variables in the next step

3. **Add Environment Variables**
   - In the Render web service creation page, scroll to "Environment Variables"
   - Add each variable from the table above:
     ```
     NODE_ENV = production
     MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/moviedb
     JWT_SECRET = your-secure-random-string-at-least-32-characters
     TMDB_API_KEY = your-tmdb-api-key
     CLIENT_URL = https://your-app-name.onrender.com
     PORT = 10000
     ```
   - Click "Create Web Service"

4. **Wait for Deployment**
   - Render will:
     1. Install all dependencies (root, client, server)
     2. Build the React client with Vite
     3. Start the Express server
   - This may take 2-5 minutes

### Option 2: Deploy with render.yaml (One-Click)

1. The `render.yaml` file is already configured in your project
2. Go to Render Dashboard
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Render will detect the `render.yaml` and show the deployment configuration
6. Add the Environment Variables in theBlueprint settings
7. Click "Apply"

## Important: .env File Usage

### Local Development
Your local `.env` file (in `server/` folder) should look like:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/moviedb
JWT_SECRET=your-development-secret
TMDB_API_KEY=your-tmdb-api-key
CLIENT_URL=http://localhost:5173
```

### Production (Render)
Do NOT use the .env file! Add these as Environment Variables in Render:
```
NODE_ENV=production
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-production-secret (different from dev!)
TMDB_API_KEY=your-tmdb-api-key
CLIENT_URL=https://your-app.onrender.com
PORT=10000 (Render assigns this)
```

## How the Deployment Works

1. **Build Phase** (`npm run build`):
   - Installs root dependencies
   - Installs client dependencies (`cd client && npm install`)
   - Builds React app with Vite (`cd client && npm run build`)
   - Creates optimized files in `client/dist/`

2. **Runtime Phase** (`npm run start`):
   - Starts Express server
   - Serves API endpoints at `/api/*`
   - Serves React static files from `client/dist`
   - Handles SPA routing (all routes serve `index.html`)

## Local Production Test

Test the production build locally before deploying:

```bash
# From the root directory
npm install
npm run build
npm run start
```

Then visit `http://localhost:5000`

## Troubleshooting

### CORS Issues
If you see CORS errors:
- Make sure `CLIENT_URL` in Render matches your actual Render URL
- In production, CORS allows all origins

### 404 on Page Refresh
This is handled by Express - all non-API routes serve `index.html`

### Build Fails
- Run `npm run build` locally first to check for errors
- Make sure all dependencies are in `package.json`

### MongoDB Connection Issues
- Verify your `MONGO_URI` is correct
- Check MongoDB Atlas network whitelist allows all IPs (0.0.0.0/0)
- Make sure database user has proper permissions

### 502 Bad Gateway
- Check that the server started successfully
- Verify `PORT` environment variable is set

### Images Not Loading
- The CSP is configured to allow TMDB images
- If still issues, check browser console for specific CSP errors

## Project Structure

```
movie-theator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── styles/        # SCSS styles
│   ├── dist/              # Built frontend (generated)
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # Mongoose models
│   │   └── ...
│   └── package.json
├── package.json           # Root package.json
├── render.yaml            # Render deployment config
└── DEPLOY.md             # This file
```

## Security Notes

- **NEVER** commit `.env` files to version control
- Use different `JWT_SECRET` for production
- Keep your TMDB API key private
- In production, consider adding rate limiting
- The `.gitignore` file should include `server/.env`

