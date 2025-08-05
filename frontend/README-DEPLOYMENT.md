# Deployment Instructions for NYCT No-Writer MVP

## GitHub Repository
The code is available at: https://github.com/joshuamtm/nyct-no-writer-mvp

## Frontend Deployment to Netlify

The frontend is ready to be deployed to Netlify. You have two options:

### Option 1: Deploy via Netlify UI (Recommended)

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub and select `joshuamtm/nyct-no-writer-mvp`
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Node version**: 18 (will be auto-detected from netlify.toml)
5. Add environment variable:
   - **VITE_API_URL**: Your backend API URL (e.g., `https://your-backend.com`)
6. Click "Deploy site"

### Option 2: Deploy via Netlify Drop

1. The frontend has been built and is ready in the `dist` folder
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder to deploy
4. Note: You'll need to set up environment variables separately

## Backend Deployment

The backend is a FastAPI application that needs to be deployed separately. Options include:

### For Development/Testing:
- Deploy to Railway.app, Render.com, or Heroku
- Use ngrok to expose local backend

### For Production:
- Deploy to Azure App Service (as mentioned in README)
- Set up proper authentication and database

## Environment Variables

### Frontend (Netlify):
- `VITE_API_URL`: Backend API URL (defaults to `http://localhost:8000`)

### Backend:
- `OPENAI_API_KEY`: For GPT-4 integration (when implemented)
- `DATABASE_URL`: PostgreSQL connection string (when implemented)

## Current Status

✅ Frontend built successfully
✅ GitHub repository created
✅ Netlify configuration added
⚠️ Backend uses mock data (no real AI/database yet)

## Next Steps

1. Deploy frontend to Netlify via UI
2. Deploy backend to a hosting service
3. Update `VITE_API_URL` in Netlify to point to backend
4. Implement real AI integration and database