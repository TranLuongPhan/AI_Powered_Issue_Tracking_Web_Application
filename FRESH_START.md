# Fresh Start: Supabase Setup

Since the previous database had connection issues, let's start fresh.

## 1. Create a New Supabase Project

1.  Go to [supabase.com/dashboard](https://supabase.com/dashboard).
2.  Click **"New Project"**.
3.  **Name:** `vibecode-fresh`
4.  **Password:** `SimplePass12345` (Use exactly this simple password to avoid special character issues).
5.  **Region:** Choose **Singapore** or **Tokyo** (closest to Vietnam usually).
6.  Click **"Create new project"**.

## 2. Get Connection Strings

Wait for the project to be "Active" (green dot).

1.  Go to **Settings** (gear icon) -> **Database**.
2.  Scroll to **Connection string**.
3.  Click **URI**.
4.  **Copy the string.** It looks like:
    `postgresql://postgres.xxxx:SimplePass12345@aws-0-xxxx.pooler.supabase.com:6543/postgres`

## 3. Send me the string

Paste the string you copied into the chat. I will configure everything else.

