# Putting Swipewise on your iPhone (free, no $99 Apple fee)

This guide assumes you already:

- Installed **Node.js** (you did this last time)
- Installed **Xcode** from the Mac App Store
- Created a **free Apple ID developer account** at https://developer.apple.com/account
- Have an **Apple ID signed into Xcode** (see step 1)

You will need to re-run a quick refresh every **7 days** — that's the
trade-off for skipping the $99 paid developer enrollment.

---

## One-time setup (~15 min after Xcode is done downloading)

### 1. Add your Apple ID to Xcode
- Open **Xcode** → menu **Xcode** → **Settings…** → **Accounts** tab.
- Click **+** at the bottom-left → **Apple ID** → sign in with your free account.
- Close Settings.

### 2. Install CocoaPods (iOS dependency manager)
In **Terminal**, run:

```
sudo gem install cocoapods
```

It will ask for your Mac password. Takes a few minutes.

### 3. Clone and prepare the project
(If you already cloned it last time, skip to `git pull`.)

```
git clone https://github.com/vibecoderwa/Rewards-Optimizer-.git
cd Rewards-Optimizer-
git checkout claude/build-github-designs-izQNs
git pull
npm install
npm run build
npx cap sync ios
```

That last command prepares the iOS folder for Xcode.

### 4. Open the project in Xcode

```
npx cap open ios
```

Xcode opens showing the Swipewise project. Give it 30 seconds to "index" —
there's a progress bar at the top.

### 5. Set up signing (tells Xcode to build with your free Apple ID)
- In the left sidebar, click the **App** project (blue icon at the very top).
- In the middle pane, make sure **App** is selected under TARGETS.
- Click the **Signing & Capabilities** tab.
- **Team:** pick your Apple ID from the dropdown.
- **Bundle Identifier:** change `com.swipewise.app` to something unique to you,
  like `com.yourname.swipewise`. (Free accounts require a unique identifier —
  this just has to differ from anyone else's.)
- You may see a yellow warning that disappears in a second. Ignore it.

---

## Install on your iPhone

### 6. Plug your iPhone into your Mac with a cable
- Unlock your phone.
- If you see "Trust this computer?", tap **Trust** and enter your passcode.

### 7. Pick your phone as the build target
- In Xcode, next to the big play button at the top, click the dropdown that
  says "Any iOS Device" or "iPhone Simulator".
- Pick your iPhone from the list.

### 8. Press Play (▶)
- Xcode builds. First build takes ~3 minutes. Subsequent ones ~30 seconds.
- On your phone you may see: "Untrusted Developer". This is normal for free accounts.
  - Open **iPhone Settings** → **General** → **VPN & Device Management**.
  - Tap your Apple ID name.
  - Tap **Trust "Your Apple ID"** → **Trust** on the confirmation.
- Press Play again in Xcode.
- The Swipewise app icon appears on your phone and opens.

### 9. Grant permissions
- Tap through the prototype. When it asks for **Location**, choose
  **Allow While Using App** the first time. (You can upgrade to
  Always Allow later in Settings → Swipewise if you want auto-push.)
- When Settings → "Send test notification" asks for notifications, tap **Allow**.

---

## Every 7 days: refresh the app

Free developer accounts make builds expire after 7 days. When it stops
launching:

```
cd Rewards-Optimizer-
npx cap sync ios
npx cap open ios
```

Plug in your phone, press Play, done. Takes ~1 minute.

---

## Doing the same for your friend's phone

Your friend does not need a Mac. Just plug their iPhone into your Mac with
a cable and repeat steps 6–9 once. They'll also need to Trust the developer
on their phone (step 8 bullet).

They'll need to be within cable-reach of your Mac every 7 days, or
**switch to the $99 paid Apple Developer account** at which point you can
distribute via TestFlight and install apps remotely with no cable.

---

## What to test first

1. Open the app → tap **Get started — it's free**
2. Use any phone number → code is `421906`
3. Pick **Enter cards manually** → tap the cards you carry → Continue
4. You should see your real location load real nearby places with the right
   card highlighted for each one.

---

## If something breaks

- **Xcode shows red signing errors:** wrong Bundle Identifier. Change to
  something unique like `com.yourname.swipewise.<random>`.
- **"Could not install to device":** phone is locked. Unlock it.
- **Home screen is blank / spinning forever:** make sure you allowed location,
  and that you're actually outside or near shops. OpenStreetMap data is sparse
  inside some large buildings.
- **Weird cached build:** in Terminal run `rm -rf ios/App/Pods && cd ios/App && pod install && cd ../..`
