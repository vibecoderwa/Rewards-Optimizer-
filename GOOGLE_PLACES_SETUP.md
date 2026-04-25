# Google Places — setup with zero-bill protection

This wires the app to Google Places (New) for richer nearby-place coverage,
**locked to the free tier** so you can't accidentally rack up a bill.

## Three layers of protection

1. **Hard quota cap in Google Cloud Console** — Google itself rejects calls
   beyond the daily limit. This is the only real safety net. Step 4 below.
2. **24-hour cache** keyed by rounded lat/lon — reopening the app at the
   same spot hits cache, not the API.
3. **Client-side monthly counter** capped at 4,500 (90% of the 5,000 free
   Pro tier). Belt-and-suspenders only — clearable per-device.

## Step-by-step

### 1. Create a Google Cloud project (one-time)

1. Go to https://console.cloud.google.com/
2. Top bar → **Select a project** → **New project**
3. Name it "swipewise" (or anything), no organization, **Create**

### 2. Enable the Places API (New)

1. Search bar → "Places API (New)" → click it
2. **Enable**
3. Wait ~30 seconds for it to activate

### 3. Create an API key

1. Side menu → **APIs & Services** → **Credentials**
2. **+ CREATE CREDENTIALS** → **API key**
3. Copy the key — you'll paste it in step 5
4. Click **EDIT API KEY** to restrict it (important):
   - **Application restrictions** → **Websites**
   - Add your Vercel URL, e.g. `https://your-app.vercel.app/*`
   - For local dev also add `http://localhost:5173/*`
   - **API restrictions** → **Restrict key** → check only **Places API (New)**
   - **Save**

### 4. Set the hard quota cap (THE CRITICAL STEP)

This is what stops Google from billing you. Without this step, layers 2-3
won't save you if something goes wrong.

1. **APIs & Services** → **Places API (New)** → **Quotas & System Limits**
2. Find **Requests per day** → click the pencil
3. Set to **165** (= 5000/month ÷ 30 days, with rounding)
4. **Save**

Now Google itself will return errors past 165/day. You can never be billed
without raising this cap manually.

> Optional: also set **Requests per minute** to ~30 to dampen burst usage.

### 5. Add the key to Vercel

1. Vercel dashboard → your project → **Settings** → **Environment Variables**
2. Add new variable:
   - **Name:** `VITE_GOOGLE_PLACES_KEY`
   - **Value:** the key from step 3
   - **Environments:** Production + Preview + Development
3. **Save**, then **Redeploy** the latest commit (Deployments → ⋯ → Redeploy)

### 6. Turn it on

In the app: **Settings** → toggle **"Better place coverage (Google)"** on.

## How to verify it's working

After enabling and refreshing the home screen:
- You should see noticeably more places than before (especially independent
  restaurants, ethnic grocers, local shops)
- In Chrome DevTools → Network tab → filter for `places.googleapis.com`,
  you should see one POST per location lookup (not per second — the cache
  prevents that)

## How to verify the cap is working

1. Cloud Console → **APIs & Services** → **Places API (New)** → **Metrics**
2. You'll see daily/monthly call counts. They should be tiny.
3. Set a **Budget alert**: **Billing** → **Budgets & alerts** → **Create
   Budget** → set to $1, alert at 50% / 90% / 100%. You'll get an email
   if anything ever leaks past the cap (it shouldn't).

## If you change your mind

Toggle off in the app, or remove the env var in Vercel and redeploy. The
app silently falls back to OSM so nothing breaks.

## Rough math at 5,000 calls/mo

- ~165 lookups/day available
- With 24h caching, one user opening the app 5×/day at 3 different spots
  ≈ 3 actual API calls/day
- ~50 active daily users fits free
- Past that, raise the cap and pay ~$32/1k calls (Pro tier)
