# Get Swipewise on your phone — no Mac, no Xcode, no $99

The whole flow is **5 minutes** and free. You'll deploy the app to a public
URL, then "Add to Home Screen" on your iPhone so it looks like a real app.

You only need:

- A web browser
- Your iPhone

You do **not** need: Xcode, a cable, an Apple Developer account.

---

## Step 1: Sign up for Vercel (~1 min)

1. Go to **https://vercel.com**
2. Click **Sign Up**
3. Click **Continue with GitHub** — this is the easiest path because your code
   is already on GitHub
4. Authorize Vercel when GitHub prompts you
5. Pick the **Hobby (free)** plan — that's the one we want

---

## Step 2: Import the repo (~1 min)

1. After signup, you land on a "Let's build something new" page. Click
   **Import Project** or **Add New… → Project**
2. You'll see your GitHub repos. Find **`Rewards-Optimizer-`** and click
   **Import**
3. On the next screen, Vercel auto-detects it's a Vite project. **Don't
   change anything** — defaults are correct.
4. Under **Branch** (it might be hidden under "Advanced" or shown by
   default), make sure it's set to **`claude/build-github-designs-izQNs`**.
   If you can't find that option, leave it as `main` for now and we'll
   change it after first deploy.
5. Click **Deploy**

Wait ~60 seconds. Vercel builds your app.

---

## Step 3: Get your URL

When deployment finishes, you see a celebratory confetti screen with a
URL like:

```
https://rewards-optimizer.vercel.app
```

Or similar. **Click it** to make sure it loads in your browser. You should
see the Swipewise landing page.

If it loaded → you have a real public app. Anyone with this URL can use it.

---

## Step 4: Switch the deploying branch (only if Vercel deployed `main`)

If your URL shows the old design instead of the new app:

1. In Vercel, click your project → **Settings** → **Git**
2. Find **Production Branch**, change it to `claude/build-github-designs-izQNs`
3. Save
4. Go to **Deployments** tab, click **...** on the latest one → **Redeploy**

Wait another 60 seconds. Reload the URL.

---

## Step 5: Put it on your iPhone

1. On your **iPhone**, open **Safari** (must be Safari, not Chrome — only
   Safari supports Add-to-Home-Screen properly on iOS)
2. Type or paste the Vercel URL from Step 3
3. Tap the **Share** button (square with up arrow at the bottom of Safari)
4. Scroll down → tap **Add to Home Screen**
5. Tap **Add** in the top-right

Now you have a Swipewise icon on your home screen. Tap it — opens in full
screen, no browser bars, looks like a real app.

---

## Step 6: Try it out

1. Tap the Swipewise icon on your home screen
2. Tap **Get started — it's free**
3. Type any phone number (it doesn't actually send anything) → **Send me a code**
4. Enter **421906** as the code → Verify
5. Tap **Enter cards manually** (you can skip Plaid)
6. Tap your cards (Amex Gold, Sapphire Preferred, etc.) → Continue
7. On the home screen, allow location when iOS asks
8. You should see real merchants near you with the best card for each one

---

## Sharing with your friend

Just send them the same URL by text. They open it in Safari, do Add to
Home Screen, done. No setup. No accounts. They have their own wallet
saved separately on their own phone.

---

## What works on the web version

✅ Real GPS / your actual location
✅ Real nearby merchants from OpenStreetMap
✅ Real card recommendations
✅ Wallet saves between sessions
✅ "Test notification" button works (one-time alert when you tap it)
✅ Works full-screen like an app once added to home screen

## What needs the native iOS build (for later, if you want)

❌ Auto-push when you walk into a place (iOS web apps can't run in background)
❌ Lock-screen widgets
❌ Dynamic Island integration

For initial testing of "is this idea good?" the web version is plenty.
You can graduate to the full native version anytime — the code is already
written and waiting.

---

## Updating the app

Whenever I push new code to the branch, Vercel automatically rebuilds and
your URL updates within 60 seconds. You don't need to do anything — just
reload the page on your phone.
