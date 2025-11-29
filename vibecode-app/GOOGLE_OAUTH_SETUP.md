# Google OAuth Setup Guide

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top and select **New Project**.
3. Name it `Vibecode` (or similar) and click **Create**.
4. Select the newly created project.

## Step 2: Configure OAuth Consent Screen

1. In the left sidebar, go to **APIs & Services** > **OAuth consent screen**.
2. Select **External** user type and click **Create**.
3. Fill in the required fields:
   - **App name**: Vibecode
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **Save and Continue** through the scopes and test users sections (you can leave defaults for now).
5. On the Summary page, click **Back to Dashboard**.

## Step 3: Create Credentials

1. In the left sidebar, go to **Credentials**.
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
3. Select **Web application** as the application type.
4. Name it `Vibecode Web`.
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/api/auth/callback/google`
7. Click **Create**.
8. Copy your **Client ID** and **Client Secret**.

## Step 4: Configure Environment Variables

1. Create a file named `.env` in the `vibecode-app` folder.
2. Add the following content, replacing the placeholders with your actual values:

```env
# Database (See DATABASE_SETUP.md if you haven't set this up)
DATABASE_URL="postgresql://postgres:password@localhost:5432/vibecode"

# Auth Secret (Run 'npx auth secret' or 'openssl rand -base64 32' to generate one)
AUTH_SECRET="your-generated-secret-here"

# Google OAuth
AUTH_GOOGLE_ID="your-client-id-from-step-3"
AUTH_GOOGLE_SECRET="your-client-secret-from-step-3"
```

## Step 5: Run the App

1. Make sure your database is running.
2. Run migrations if you haven't: `npx prisma migrate dev`
3. Start the server: `npm run dev`
4. Go to `http://localhost:3000/login` and click "Sign in with Google".

