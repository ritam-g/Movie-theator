
# Deployment Guide for Render

This guide explains how to deploy the Movie Platform to Render.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **MongoDB**: You need a MongoDB database (can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier or Render's native MongoDB)
3. **TMDB API Key**: Get a free API key from [The Movie Database](https://www.themoviedb.org/settings/api)

## Deployment Options

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
     - **Name**: `movie-platform`
     - **Environment**: `Node`
     - **Build Command**: `npm run build`
     - **Start Command**: `npm run start`
   - Add Environment Variables:
     - `NODE_ENV` = `production`
     - `MONGO_URI` = your MongoDB connection string
     - `JWT_SECRET` = a secure random string (min 32 characters)
     - `TMDB_API_KEY` = your TMDB API key
     - `PORT` = `10000` (Render assigns this automatically)
   - Click "Create Web Service"

3. **Deploy**
   - Render will automatically build the client and start the server
   - The frontend will be served from the `/dist` folder

### Option 2: Deploy with render.yaml (One-Click)

1. Create the `render.yaml` file (already created)
2. Go to Render Dashboard
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Render will detect the `render.yaml` and deploy automatically

## Environment Variables

Required for production:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Set to `production` | `production` |
| `PORT` | Render assigns this (usually 10000) | `10000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | `your-secure-secret-key` |
| `TMDB_API_KEY` | TMDB API key | `abc123...` |
| `CLIENT_URL` | Your Render URL (optional) | `https://movie-platform.onrender.com` |

## How It Works

1. **Build Phase**: When deploying, `npm run build` runs which:
   - Installs client dependencies
   - Runs `vite build` to create the `client/dist` folder
   - Generates optimized React production files

2. **Runtime Phase**: The Express server:
   - Serves API endpoints (`/api/*`)
   - Serves static React files from `client/dist`
   - Handles React Router (SPA routing)

## Local Production Test

Test the production build locally:

```bash
# From the root directory
npm run build
npm run start
```

Then visit `http://localhost:5000`

## Troubleshooting

### CORS Issues
If you see CORS errors, make sure:
- `CLIENT_URL` in server `.env` matches your Render URL
- In production, CORS is set to allow all origins

### 404 on Page Refresh
This is handled by the Express catch-all route that serves `index.html` for all non-API routes.

### Build Fails
- Make sure all dependencies are properly listed in `package.json`
- Check that the client builds successfully locally first

### MongoDB Connection Issues
- Verify your `MONGO_URI` is correct
- Ensure your MongoDB IP whitelist includes Render's IPs

## Project Structure

```
movie-theator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── styles/       # SCSS styles
│   │   └── ...
│   ├── dist/             # Built frontend (generated)
│   └── package.json
├── server/               # Express backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # Mongoose models
│   │   └── ...
│   └── package.json
├── package.json           # Root package.json
└── render.yaml           # Render deployment config
```

## Security Notes

- Never commit `.env` files to version control
- Use strong `JWT_SECRET` values
- Keep your TMDB API key private
- In production, consider adding rate limiting

