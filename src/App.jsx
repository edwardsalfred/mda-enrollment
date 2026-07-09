import React, { useState, useEffect, useRef } from "react";

/*
  MD Anderson — Intune Enrollment Interactive Walkthrough
  =======================================================
  Framework build with PLACEHOLDER screenshot slots.

  HOW TO ADD YOUR SANITIZED SCREENSHOTS LATER
  -------------------------------------------
  Each step has an `image` field, currently null.
  Replace null with a URL or imported image path, e.g.

      image: "https://yoursite.netlify.app/img/step-01.png"

  The placeholder phone frame auto-disappears once `image` is set.
  Hotspot coordinates (hx, hy) are PERCENTAGES of the phone screen
  area (0–100), so they line up regardless of image resolution.
  Tune them once your real screenshots are in.

  STRUCTURE
  ---------
  STEPS array drives everything. Each step:
    id        unique number
    section   grouping label (drives the progress chapters)
    title     short action title
    narration avatar/voiceover text (matches the HeyGen script)
    image      null  -> replace with screenshot
    hx, hy     hotspot center, % of screen (where the user taps)
    htext      tooltip on the hotspot
    wait       optional ms — shows a "please wait" gate
    branch     optional — renders a fork the user chooses
    sensitive  true -> shows a "credentials hidden" badge
*/

const IMG = {
  mdaLogo: "/img/mdaLogo.png",
  screen1: "/img/screen1.jpg",
  screen2: "/img/screen2.jpg",
  screen3: "/img/screen3.jpg",
  screen4: "/img/screen4.jpg",
  screen5: "/img/screen5.jpg",
  screen6: "/img/screen6.jpg",
  screen7: "/img/screen7.jpg",
  screen8: "/img/screen8.jpg",
  screen9: "/img/screen9.jpg",
  screen10: "/img/screen10.jpg",
  screen11: "/img/screen11.jpg",
  screen12: "/img/screen12.jpg",
  screen13: "/img/screen13.jpg",
  screen14: "/img/screen14.jpg",
  screen15: "/img/screen15.jpg",
  screen16: "/img/screen16.jpg",
  screen17: "/img/screen17.jpg",
  screen18: "/img/screen18.jpg",
  screen19: "/img/screen19.jpg",
  screen20: "/img/screen20.jpg",
  screen21: "/img/screen21.jpg",
  homeAuth: "/img/homeAuth.jpg",
  authPrivacy: "/img/authPrivacy.jpg",
  authWelcome: "/img/authWelcome.jpg",
  mfaVerify: "/img/mfaVerify.jpg",
  mfaOpenDuo: "/img/mfaOpenDuo.jpg",
  mfaEnterCode: "/img/mfaEnterCode.jpg",
  authNotAdded: "/img/authNotAdded.jpg",
  cpHome: "/img/cpHome.jpg",
  cpSetup: "/img/cpSetup.jpg",
  cpCategory: "/img/cpCategory.jpg",
  cpCategoryPicked: "/img/cpCategoryPicked.jpg",
  cpAllSet: "/img/cpAllSet.jpg",
  pcRequire: "/img/pcRequire.jpg",
  pcNew: "/img/pcNew.jpg",
  pcReenter: "/img/pcReenter.jpg",
  olHome: "/img/olHome.jpg",
  olWelcome: "/img/olWelcome.jpg",
  olAccountFound: "/img/olAccountFound.jpg",
  olEnableNotif: "/img/olEnableNotif.jpg",
  olAllowNotif: "/img/olAllowNotif.jpg",
  edgeHome: "/img/edgeHome.jpg",
  edgeMakeDefault: "/img/edgeMakeDefault.jpg",
  edgeSettings: "/img/edgeSettings.jpg",
  edgePicker: "/img/edgePicker.jpg",
  defHome: "/img/defHome.jpg",
  defAllow: "/img/defAllow.jpg",
  cidHome: "/img/cidHome.jpg",
  cidSettings: "/img/cidSettings.jpg",
  cidPhone: "/img/cidPhone.jpg",
  cidToggleOff: "/img/cidToggleOff.jpg",
  cidToggleOn: "/img/cidToggleOn.jpg",
  empHome: "/img/empHome.jpg",
  empSignIn: "/img/empSignIn.jpg",
  empPick: "/img/empPick.jpg",
  empPwd: "/img/empPwd.jpg",
  empOrgOk: "/img/empOrgOk.jpg",
  empAppHome: "/img/empAppHome.jpg",
  empRefresh: "/img/empRefresh.jpg",
  empUpdated: "/img/empUpdated.jpg",
  lkHome: "/img/lkHome.jpg",
  lkStart: "/img/lkStart.jpg",
  lkLocation: "/img/lkLocation.jpg",
  lkDnsSetup: "/img/lkDnsSetup.jpg",
  lkSettings: "/img/lkSettings.jpg",
  lkGeneral: "/img/lkGeneral.jpg",
  lkVpnMgmt: "/img/lkVpnMgmt.jpg",
  lkDnsPick: "/img/lkDnsPick.jpg",
  lkDnsDone: "/img/lkDnsDone.jpg",
};

const BRAND = {
  ink: "#2b2b2b",        // near-black text
  blue: "#E51937",       // MD Anderson red (primary action) — name kept so refs still resolve
  blueLight: "#f06277",  // lighter red
  cyan: "#E51937",       // accent / hotspot now red
  paper: "#faf6f7",      // warm off-white
  white: "#ffffff",
  line: "#ecdfe2",       // warm light divider
  gold: "#e8a33d",       // wait-state amber (kept for contrast)
  green: "#1f9d6b",      // success
  red: "#a3122a",        // deep red for hover/sensitive
  muted: "#6b6066",      // warm muted gray
};

// ElevenLabs voiceover clips for the Microsoft Multifactor + Duo sequence (step 24).
const AUDIO = {
  intro: "/audio/intro.mp3",
  verify: "/audio/verify.mp3",
  openDuo: "/audio/openDuo.mp3",
  enterCode: "/audio/enterCode.mp3",
};

// ---- Audio unlock -------------------------------------------------------
// Browsers (and the sandboxed iframe this runs in) refuse to start audio on
// their own. We create ONE audio element up front and "prime" it on the very
// first user interaction (e.g. tapping Start enrollment). After that, the
// element is trusted and later clips can play automatically.
let sharedAudio = null;
let audioUnlocked = false;

function getSharedAudio() {
  if (!sharedAudio && typeof window !== "undefined") {
    sharedAudio = new window.Audio();
    sharedAudio.preload = "auto";
    sharedAudio.playsInline = true;
  }
  return sharedAudio;
}

// A 0.05s silent mp3 — playing this during a real click unlocks the element.
const SILENT_MP3 =
  "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxAADwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

function unlockAudio() {
  if (audioUnlocked) return;
  const el = getSharedAudio();
  if (!el) return;
  try {
    el.src = SILENT_MP3;
    const p = el.play();
    if (p && p.then) {
      p.then(() => { el.pause(); audioUnlocked = true; }).catch(() => {});
    } else {
      el.pause(); audioUnlocked = true;
    }
  } catch (e) { /* ignore */ }
}
// -------------------------------------------------------------------------

const SECTIONS = [
  "Setup",
  "Enroll",
  "iOS Screens",
  "Authenticator",
  "Company Portal",
  "Passcode",
  "Apps",
  "Lookout",
];

const STEPS = [
  // ---------- SECTION 1: Initial Setup ----------
  { id: 1, section: "Setup", title: "Power on and swipe up", narration: "Power on your device. On the Hello screen, swipe up to begin.", image: IMG.screen1, hx: 50, hy: 94, htext: "Swipe up from the bottom" },
  { id: 2, section: "Setup", title: "Choose English", narration: "Tap English as your language.", image: IMG.screen2, hx: 50, hy: 38, htext: "Tap English" },
  { id: 3, section: "Setup", title: "Choose United States", narration: "Choose United States for your country or region.", image: IMG.screen3, hx: 50, hy: 41, htext: "Tap United States" },
  { id: 4, section: "Setup", title: "Appearance → Continue", narration: "On the Appearance screen, tap Continue.", image: IMG.screen4, hx: 50, hy: 90, htext: "Tap Continue" },
  { id: 5, section: "Setup", title: "Set Up Without Another Device", narration: "On the Quick Start screen, tap Set Up Without Another Device.", image: IMG.screen5, hx: 50, hy: 90, htext: "Tap Set Up Without Another Device" },
  { id: 6, section: "Setup", title: "Wi-Fi Network", narration: "Connect to your Wi-Fi network. If your device has cellular data, you can tap Continue Without Wi-Fi instead.", image: IMG.screen6, hx: 50, hy: 52, htext: "Tap Continue Without Wi-Fi" },
  { id: 7, section: "Setup", title: "Continue Without Wi-Fi", narration: "A popup asks you to confirm. Tap Continue to proceed, or Use Wi-Fi to go back and connect.", image: IMG.screen7, hx: 31, hy: 57, htext: "Tap Continue" },
  { id: 8, section: "Setup", title: "Wait for your iPhone to activate", narration: "Your iPhone is activating. Wait here until activation completes and the next screen appears on its own. This can take a few minutes.", image: IMG.screen8, hx: null, hy: null, htext: "", wait: 3000, waitLabel: "Activating your iPhone…", doneLabel: "Activation complete →" },
  { id: 9, section: "Setup", title: "Data & Privacy → Continue", narration: "On the Data and Privacy screen, tap Continue.", image: IMG.screen9, hx: 50, hy: 86, htext: "Tap Continue" },

  // ---------- SECTION 2: Enroll & Sign In ----------
  { id: 10, section: "Enroll", title: "Enroll this iPhone/iPad", narration: "On the Device Management screen, this iPhone is owned by MD Anderson Cancer Center. Tap Enroll this iPhone.", image: IMG.screen10, hx: 50, hy: 88, htext: "Tap Enroll this iPhone" },
  { id: 11, section: "Enroll", title: "Enter MDA email", narration: "Enter your MD Anderson email address, then tap Next.", image: IMG.screen12, hx: 82, hy: 46, htext: "Type your email, then tap Next", sensitive: true },
  { id: 12, section: "Enroll", title: "Enter password", narration: "Enter your password, then tap Sign in.", image: IMG.screen13, hx: 82, hy: 43, htext: "Type your password, then tap Sign in", sensitive: true },
  { id: 13, section: "Enroll", title: "Open Duo Mobile", narration: "Duo needs to check this device. Tap Open Duo Mobile. After it opens, you'll approve your login.", image: IMG.screen14, hx: 50, hy: 47, htext: "Tap Open Duo Mobile" },
  { id: 14, section: "Enroll", title: "Enter the Duo code on your other phone", narration: "A six-digit verification code appears on this screen. On the separate phone that has Duo Mobile installed, open the Duo Mobile app and type in this code to approve your login. Once you've entered it here, tap the button below to continue.", image: IMG.screen15, hx: null, hy: null, htext: "", sensitive: true, doneLabel: "I've entered the code in Duo →" },
  { id: 15, section: "Enroll", title: "Sign-in success", narration: "Once the code is accepted, Duo shows a Success screen and logs you in. No action needed here — the next screen appears on its own.", image: IMG.screen16, hx: null, hy: null, htext: "", wait: 2500, waitLabel: "Logging you in…", doneLabel: "Continue →" },

  // ---------- SECTION 3: iOS Setup Screens ----------
  { id: 16, section: "iOS Screens", title: "Auto Updates → Continue", narration: "On the Update Your iPhone Automatically screen, tap Continue.", image: IMG.screen17, hx: 50, hy: 85, htext: "Tap Continue" },
  { id: 17, section: "iOS Screens", title: "Turn On Location Services", narration: "On the Location Services screen, tap Turn On Location Services.", image: IMG.screen18, hx: 50, hy: 85, htext: "Tap Turn On Location Services" },
  { id: 18, section: "iOS Screens", title: "Display → Continue", narration: "On the Light or Dark Display screen, choose an appearance, then tap Continue.", image: IMG.screen19, hx: 50, hy: 90, htext: "Tap Continue" },
  { id: 19, section: "iOS Screens", title: "Emergency SOS → Continue", narration: "If your device has cellular, tap Continue on the Emergency SOS screen.", image: IMG.screen20, hx: 50, hy: 90, htext: "Tap Continue", optional: true },
  { id: 20, section: "iOS Screens", title: "Apps are downloading", narration: "Your work apps begin downloading and show Waiting or Loading on the Home Screen. Let them finish — this can take a few minutes.", image: IMG.screen21, hx: null, hy: null, htext: "", wait: 3000, waitLabel: "Apps are downloading…", doneLabel: "Apps installed →" },

  // ---------- SECTION 4: Authenticator (BRANCH) ----------
  {
    id: 21, section: "Authenticator", title: "Open the Authenticator app",
    narration: "Once your apps finish downloading, find and tap the Authenticator app on your Home Screen.",
    image: IMG.homeAuth, hx: 44, hy: 59, htext: "Tap Authenticator",
  },
  { id: 22, section: "Authenticator", title: "Your data, your privacy → Continue", narration: "On the Your Data, Your Privacy screen, tap Continue.", image: IMG.authPrivacy, hx: 50, hy: 84, htext: "Tap Continue" },
  { id: 23, section: "Authenticator", title: "Add work or school account", narration: "On the Welcome to Authenticator screen, tap Add work or school account.", image: IMG.authWelcome, hx: 50, hy: 66, htext: "Tap Add work or school account" },
  {
    id: 24, section: "Authenticator", title: "Verify your identity (Microsoft Multifactor + DUO)",
    narration: "If your account uses Microsoft Multifactor plus DUO, you'll move through these three screens. Watch the sequence below — it plays automatically and explains what to look for on each screen. If you have DUO only, you'll simply get the DUO prompt.",
    image: null, hx: null, hy: null, htext: "",
    introAudio: "intro",
    sequence: [
      { img: "mfaVerify", audio: "verify", caption: "Verify your identity", voice: "First, the Verify Your Identity screen appears. Tap the Text option to have a verification code sent to your phone by text message.", hx: 50, hy: 32 },
      { img: "mfaOpenDuo", audio: "openDuo", caption: "Open Duo Mobile", voice: "Next, you'll see Open Duo Mobile. This means Duo needs to check your device. Tap Open Duo Mobile, then approve the login on your separate phone that has Duo installed.", hx: 50, hy: 45 },
      { img: "mfaEnterCode", audio: "enterCode", caption: "Enter code in Duo Mobile", voice: "Finally, a verification code appears on screen. On the separate phone that has Duo Mobile, enter this code to finish verifying. Once it's approved, you're all set.", hx: 50, hy: 42 },
    ],
    doneLabel: "Continue →",
  },
  { id: 25, section: "Authenticator", title: "Account not added → Done", narration: "After DUO and Microsoft verification, you may see an Account Not Added screen saying your organization doesn't allow adding your account to Microsoft Authenticator. This is normal and expected — your account is managed through Company Portal and DUO instead. Just tap Done to continue.", image: IMG.authNotAdded, hx: 50, hy: 92, htext: "Tap Done" },

  // ---------- SECTION 5: Company Portal ----------
  { id: 26, section: "Company Portal", title: "Open the Comp Portal app", narration: "Swipe up to close the Authenticator app, then find and tap the Comp Portal app on your Home Screen.", image: IMG.cpHome, hx: 62, hy: 59, htext: "Tap Comp Portal" },
  { id: 27, section: "Company Portal", title: "Set up access → Begin", narration: "On the Set up MD Anderson Cancer Center access screen, tap Begin.", image: IMG.cpSetup, hx: 50, hy: 89, htext: "Tap Begin" },
  { id: 28, section: "Company Portal", title: "Choose the Company category", narration: "On the Choose the Best Category screen, tap Company. Note: after setting this, you must contact your IT admin to change it.", image: IMG.cpCategory, hx: 50, hy: 44, htext: "Tap Company" },
  { id: 29, section: "Company Portal", title: "Confirm Company → Continue", narration: "Company now shows a checkmark. Tap Continue.", image: IMG.cpCategoryPicked, hx: 50, hy: 92, htext: "Tap Continue" },
  { id: 30, section: "Company Portal", title: "You're all set → Done", narration: "When you see You're All Set, your device is managed and both checks are complete. Tap Done. Now wait a few minutes — the device connects to mdamobile and your apps begin to download.", image: IMG.cpAllSet, hx: 50, hy: 91, htext: "Tap Done", wait: 3000, waitLabel: "Connecting to mdamobile…", doneLabel: "Done →" },

  // ---------- SECTION 6: Passcode & Home ----------
  { id: 31, section: "Passcode", title: "Passcode Requirement → Change Now", narration: "A Passcode Requirement prompt appears saying you must set an iPhone unlock passcode. Tap Change Now. If you're not prompted right away, wait about one minute for it to appear.", image: IMG.pcRequire, hx: 68, hy: 57, htext: "Tap Change Now" },
  { id: 32, section: "Passcode", title: "New Passcode → Continue", narration: "On the New Passcode prompt, enter a passcode with 6 or more digits, then tap Continue.", image: IMG.pcNew, hx: 50, hy: 41, htext: "Enter passcode, then Continue", sensitive: true },
  { id: 33, section: "Passcode", title: "Re-enter passcode → Set Passcode", narration: "You'll be asked to re-enter the same passcode to confirm it. Type it again, then tap Set Passcode.", image: IMG.pcReenter, hx: 50, hy: 38, htext: "Re-enter passcode, then Set Passcode", sensitive: true },

  // ---------- SECTION 7: App Configuration ----------
  { id: 34, section: "Apps", title: "Open the Outlook app", narration: "On the Home Screen, find and tap the Outlook app to set up your email.", image: IMG.olHome, hx: 62, hy: 15, htext: "Tap Outlook" },
  { id: 35, section: "Apps", title: "Welcome to Outlook → Add Account", narration: "On the Welcome to Outlook screen, tap Add Account.", image: IMG.olWelcome, hx: 50, hy: 82, htext: "Tap Add Account" },
  { id: 36, section: "Apps", title: "Add Work Account", narration: "Outlook finds your MD Anderson account. Tap Add Work Account.", image: IMG.olAccountFound, hx: 50, hy: 88, htext: "Tap Add Work Account", sensitive: true },
  { id: 37, section: "Apps", title: "Enable Notifications → Turn On", narration: "On the Enable Notifications prompt, tap Turn On.", image: IMG.olEnableNotif, hx: 67, hy: 57, htext: "Tap Turn On" },
  { id: 38, section: "Apps", title: "Allow notifications", narration: "On the iOS notifications prompt, tap Allow. Your inbox will load, then you can swipe up to close Outlook.", image: IMG.olAllowNotif, hx: 67, hy: 58, htext: "Tap Allow" },
  { id: 39, section: "Apps", title: "Open the Edge app", narration: "On the Home Screen, find and tap the Edge app.", image: IMG.edgeHome, hx: 62, hy: 72, htext: "Tap Edge" },
  { id: 40, section: "Apps", title: "Set as default browser", narration: "On the Make Microsoft Edge Your Default Browser screen, tap Set as default browser.", image: IMG.edgeMakeDefault, hx: 50, hy: 87, htext: "Tap Set as default browser" },
  { id: 41, section: "Apps", title: "Tap Default Browser App", narration: "In the Edge settings screen that opens, tap Default Browser App (it currently shows Safari).", image: IMG.edgeSettings, hx: 50, hy: 50, htext: "Tap Default Browser App" },
  { id: 42, section: "Apps", title: "Select Edge", narration: "On the Default Browser App screen, tap Edge so it shows a checkmark. Then close the app by swiping up.", image: IMG.edgePicker, hx: 50, hy: 20, htext: "Tap Edge" },
  { id: 43, section: "Apps", title: "Open the MS Defender app", narration: "On the Home Screen, find and tap the MS Defender app.", image: IMG.defHome, hx: 62, hy: 60, htext: "Tap MS Defender" },
  { id: 44, section: "Apps", title: "Allow Defender notifications", narration: "Microsoft Defender opens. On the notifications prompt, tap Allow so you're notified of threats and security updates.", image: IMG.defAllow, hx: 67, hy: 58, htext: "Tap Allow" },
  { id: 45, section: "Apps", title: "Open Settings", narration: "Now activate the Employee Caller ID. On the Home Screen, tap the Settings app.", image: IMG.cidHome, hx: 85, hy: 71, htext: "Tap Settings" },
  { id: 46, section: "Apps", title: "Scroll down and tap Apps", narration: "Scroll down in Settings until you see Apps, then tap it.", image: IMG.cidSettings, hx: 50, hy: 84, htext: "Tap Apps" },
  { id: 47, section: "Apps", title: "Tap Call Blocking & Identification", narration: "Open Phone, then tap Call Blocking and Identification.", image: IMG.cidPhone, hx: 50, hy: 48, htext: "Tap Call Blocking & Identification" },
  { id: 48, section: "Apps", title: "Toggle on the Employee app", narration: "Under Call Identification, toggle on the Employee app.", image: IMG.cidToggleOff, hx: 82, hy: 35, htext: "Toggle on Employee" },
  { id: 49, section: "Apps", title: "Employee Caller ID is on", narration: "The Employee toggle now shows green. Next, open the Employee app to refresh the Caller ID directory.", image: IMG.cidToggleOn, hx: null, hy: null, htext: "", doneLabel: "Continue →" },
  { id: 50, section: "Apps", title: "Open the Employee app", narration: "Go back to the Home Screen and tap the Employee app.", image: IMG.empHome, hx: 61, hy: 25, htext: "Tap Employee" },
  { id: 51, section: "Apps", title: "Sign in prompt → OK", narration: "A Sign In prompt explains your organization needs to manage this app. Tap OK.", image: IMG.empSignIn, hx: 50, hy: 60, htext: "Tap OK" },
  { id: 52, section: "Apps", title: "Pick your account", narration: "On the Pick Account screen, tap your MD Anderson account.", image: IMG.empPick, hx: 50, hy: 19, htext: "Tap your account", sensitive: true },
  { id: 53, section: "Apps", title: "Enter password → Sign in", narration: "Enter your MD Anderson password, then tap Sign in.", image: IMG.empPwd, hx: 81, hy: 48, htext: "Enter password, then Sign in", sensitive: true },
  { id: 54, section: "Apps", title: "Support team message → OK", narration: "A message confirms your organization's support team is helping protect work data in this app. Tap OK.", image: IMG.empOrgOk, hx: 50, hy: 60, htext: "Tap OK" },
  { id: 55, section: "Apps", title: "Tap Caller ID", narration: "The Employee app opens. Scroll down and tap Caller ID.", image: IMG.empAppHome, hx: 17, hy: 80, htext: "Tap Caller ID" },
  { id: 56, section: "Apps", title: "Tap Refresh Caller ID", narration: "On the Caller ID screen, tap the red Refresh Caller ID button.", image: IMG.empRefresh, hx: 50, hy: 57, htext: "Tap Refresh Caller ID" },
  { id: 57, section: "Apps", title: "Caller ID list updated → OK", narration: "The Caller ID directory refresh is complete. Tap OK.", image: IMG.empUpdated, hx: 50, hy: 57, htext: "Tap OK" },

  // ---------- SECTION 8: Lookout & Secure DNS ----------
  { id: 58, section: "Lookout", title: "Open the Lookout Work app", narration: "On the Home Screen, tap the Lookout Work app.", image: IMG.lkHome, hx: 15, hy: 13, htext: "Tap Lookout Work" },
  { id: 59, section: "Lookout", title: "Let's get started → Continue", narration: "Lookout explains it needs permission for notifications, Secure DNS, and location. Tap Continue.", image: IMG.lkStart, hx: 50, hy: 90, htext: "Tap Continue" },
  { id: 60, section: "Lookout", title: "Allow While Using App", narration: "On the location prompt, tap Allow While Using App.", image: IMG.lkLocation, hx: 50, hy: 82, htext: "Tap Allow While Using App" },
  { id: 61, section: "Lookout", title: "Setup Secure DNS → Go to Settings", narration: "Lookout shows the Secure DNS setup steps. Tap Go to Settings.", image: IMG.lkDnsSetup, hx: 50, hy: 75, htext: "Tap Go to Settings" },
  { id: 62, section: "Lookout", title: "Tap General", narration: "In Settings, tap General.", image: IMG.lkSettings, hx: 50, hy: 54, htext: "Tap General" },
  { id: 63, section: "Lookout", title: "Tap VPN & Device Management", narration: "Scroll down and tap VPN and Device Management.", image: IMG.lkGeneral, hx: 50, hy: 75, htext: "Tap VPN & Device Management" },
  { id: 64, section: "Lookout", title: "Tap DNS", narration: "Under Restrictions and Proxies, tap DNS.", image: IMG.lkVpnMgmt, hx: 50, hy: 31, htext: "Tap DNS" },
  { id: 65, section: "Lookout", title: "Select Lookout Work", narration: "On the DNS screen, tap Lookout Work to make it your DNS proxy.", image: IMG.lkDnsPick, hx: 50, hy: 36, htext: "Tap Lookout Work" },
  { id: 66, section: "Lookout", title: "Lookout Secure DNS is active", narration: "Lookout Work now shows a checkmark. Secure DNS is active and your enrollment is complete.", image: IMG.lkDnsDone, hx: null, hy: null, htext: "", doneLabel: "Finish enrollment →" },
];

const TOTAL = STEPS.length;

function PhoneFrame({ step, onHotspot, done }) {
  const hasImage = !!step.image;
  return (
    <div className="ew-phone" style={{
      position: "relative",
      borderRadius: 46, background: "#0c1220",
      padding: 11, boxShadow: "0 30px 70px rgba(10,30,60,0.35), inset 0 0 0 2px #2a3550",
      flexShrink: 0,
    }}>
      {/* notch */}
      <div style={{
        position: "absolute", top: 22, left: "50%", transform: "translateX(-50%)",
        width: 120, height: 26, background: "#0c1220", borderRadius: 16, zIndex: 5,
      }} />
      {/* screen */}
      <div style={{
        position: "absolute", inset: 11,
        borderRadius: 36, overflow: "hidden",
        background: hasImage ? "#000" : `linear-gradient(160deg, ${BRAND.paper}, #f3e7ea)`,
      }}>
        {hasImage ? (
          <img src={step.image} alt={step.title} loading="lazy" decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, marginBottom: 18,
              background: BRAND.white, border: `2px dashed ${BRAND.blueLight}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, color: BRAND.blueLight,
            }}>＋</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.muted, letterSpacing: 1, textTransform: "uppercase" }}>
              Screenshot slot
            </div>
            <div style={{ fontSize: 13, color: BRAND.ink, marginTop: 8, fontWeight: 600 }}>
              Step {step.id}
            </div>
            <div style={{ fontSize: 11, color: BRAND.muted, marginTop: 6, lineHeight: 1.4 }}>
              Drop <code style={{ background: "#fff", padding: "1px 5px", borderRadius: 4 }}>step-{String(step.id).padStart(2, "0")}.png</code> here
            </div>
          </div>
        )}

        {/* hotspot */}
        {step.hx != null && (
          <button onClick={onHotspot} aria-label={step.htext}
            style={{
              position: "absolute", left: `${step.hx}%`, top: `${step.hy}%`,
              transform: "translate(-50%,-50%)", width: 52, height: 52,
              borderRadius: "50%", border: "none", cursor: "pointer",
              background: "rgba(229,25,55,0.16)", zIndex: 8,
            }}>
            <span style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: `3px solid ${BRAND.cyan}`, animation: "ping 1.6s ease-out infinite",
            }} />
            <span style={{
              position: "absolute", inset: 14, borderRadius: "50%", background: BRAND.cyan,
              boxShadow: "0 2px 10px rgba(229,25,55,0.55)",
            }} />
          </button>
        )}

        {/* sensitive badge */}
        {step.sensitive && (
          <div style={{
            position: "absolute", top: 44, left: "50%", transform: "translateX(-50%)",
            background: "rgba(26,43,74,0.92)", color: "#fff", fontSize: 10.5,
            padding: "5px 11px", borderRadius: 20, fontWeight: 600, zIndex: 9,
            display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
          }}>
            <span>🔒</span> Credentials stay hidden in this guide
          </div>
        )}
      </div>
    </div>
  );
}

export default function EnrollmentWalkthrough() {
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [waiting, setWaiting] = useState(false);
  const [waitLeft, setWaitLeft] = useState(0);
  const [branchPick, setBranchPick] = useState(null);
  const [tapped, setTapped] = useState(false);
  const timerRef = useRef(null);

  const step = STEPS[i];
  const isLast = i === TOTAL - 1;
  const pct = Math.round((completed.size / TOTAL) * 100);

  useEffect(() => () => clearInterval(timerRef.current), []);

  // Prime the audio element on the very first user interaction, so the
  // voiceover on step 24 can start on its own when the user gets there.
  useEffect(() => {
    const prime = () => unlockAudio();
    window.addEventListener("pointerdown", prime, { once: true });
    window.addEventListener("keydown", prime, { once: true });
    return () => {
      window.removeEventListener("pointerdown", prime);
      window.removeEventListener("keydown", prime);
    };
  }, []);

  // On every step change: kill any timer left over from the previous step
  // and clear the waiting state so a stale spinner/advance can't fire.
  useEffect(() => {
    clearInterval(timerRef.current);
    setWaiting(false);
  }, [i]);

  // Auto-start the wait when landing on a no-hotspot wait step (e.g. activation).
  useEffect(() => {
    if (started && i < TOTAL && step && step.hx == null && step.wait && !completed.has(step.id)) {
      runWait(step.wait);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, started]);

  function markAndAdvance() {
    const next = new Set(completed); next.add(step.id); setCompleted(next);
    setTapped(false); setBranchPick(null);
    setI((cur) => (cur < TOTAL - 1 ? cur + 1 : TOTAL));
  }

  function handleHotspot() {
    if (step.branch && branchPick === null) { setTapped(true); return; }
    if (step.wait) { runWait(step.wait); return; }
    markAndAdvance();
  }

  function runWait(ms) {
    const startIndex = i; // the step that started this wait
    const secs = Math.max(1, Math.ceil(ms / 1000));
    setWaiting(true); setWaitLeft(secs);
    let remaining = secs;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setWaiting(false);
        // Only advance if we are still on the step that started this wait.
        setI((cur) => {
          if (cur !== startIndex) return cur; // stale timer, ignore
          setCompleted((c) => new Set(c).add(STEPS[cur].id));
          return cur < TOTAL - 1 ? cur + 1 : TOTAL;
        });
      } else {
        setWaitLeft(remaining);
      }
    }, 1000);
  }

  function continueAfterBranch() {
    if (step.wait) { runWait(step.wait); return; }
    markAndAdvance();
  }

  // ---------- INTRO ----------
  if (!started) {
    return (
      <Shell>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", padding: "8px 0" }}>
          <BrandLogo />
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: BRAND.cyan, textTransform: "uppercase" }}>
            Mobile Device Services
          </div>
          <h1 className="ew-h1" style={{ fontSize: 38, lineHeight: 1.1, color: BRAND.ink, margin: "14px 0 10px", fontWeight: 800 }}>
            Enroll your iPhone or iPad into Intune
          </h1>
          <p style={{ color: BRAND.muted, fontSize: 16, lineHeight: 1.6, maxWidth: 620, margin: "0 auto" }}>
            A guided, tap-along walkthrough. Follow each step in order — skipping steps can cause extra logins.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", margin: "28px 0" }}>
            <Stat n="~30 min" l="To complete" />
            <Stat n="1 hour" l="Finish window" />
            <Stat n={TOTAL} l="Guided steps" />
          </div>

          <div style={{
            background: "#fff7ec", border: `1px solid ${BRAND.gold}`, borderRadius: 14,
            padding: "16px 20px", textAlign: "left", maxWidth: 620, margin: "0 auto 14px",
          }}>
            <div style={{ fontWeight: 700, color: BRAND.ink, marginBottom: 8, fontSize: 14 }}>Before you start — DUO</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: BRAND.muted, fontSize: 13.5, lineHeight: 1.7 }}>
              <li>If DUO is required, it must already be set up on a <strong>separate device</strong>.</li>
              <li>If DUO is on <strong>this</strong> device, contact 4INFO before continuing.</li>
            </ul>
          </div>

          <div style={{ fontSize: 12.5, color: BRAND.muted, maxWidth: 620, margin: "0 auto 26px", lineHeight: 1.6 }}>
            Instructions may vary slightly by device model or configuration. Supported: iPhone 14–17; iPad 8th gen+, Air 3rd gen+, Mini 5th gen+, Pro 11" 3rd gen+, Pro 12.9" 5th gen+, Pro 13" M4 &amp; M5.
          </div>

          <button onClick={() => setStarted(true)} style={primaryBtn}>Start enrollment →</button>

          <div style={{ marginTop: 24, fontSize: 12, color: BRAND.muted }}>
            Need help? 4INFO 713-794-4636 · Mobile Device Team 713-792-7233 (ext. 2-7233) · FCT3.5005
          </div>
        </div>
        <Keyframes />
      </Shell>
    );
  }

  // ---------- FINISH ----------
  if (i >= TOTAL) {
    return (
      <Shell>
        <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center", padding: "30px 0" }}>
          <div style={{
            width: 96, height: 96, borderRadius: "50%", margin: "0 auto 22px",
            background: BRAND.green, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 48, color: "#fff", boxShadow: "0 16px 40px rgba(31,157,107,0.4)",
            animation: "pop 0.5s ease-out",
          }}>✓</div>
          <h1 className="ew-h1" style={{ fontSize: 34, color: BRAND.ink, fontWeight: 800, margin: "0 0 10px" }}>You're enrolled!</h1>
          <p style={{ color: BRAND.muted, fontSize: 16, lineHeight: 1.6 }}>
            Your device is now managed and ready to use. All {TOTAL} steps complete.
          </p>
          <div style={{
            display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", margin: "26px 0",
          }}>
            <Stat n={`${TOTAL}/${TOTAL}`} l="Steps done" />
            <Stat n="100%" l="Complete" />
          </div>
          <div style={{ fontSize: 13, color: BRAND.muted, lineHeight: 1.6, marginBottom: 24 }}>
            Issues or questions? 4INFO 713-794-4636 · Mobile Device Team 713-792-7233 (ext. 2-7233) · ITSMobileDeviceTeam@mdanderson.org · FCT3.5005
          </div>
          <button onClick={() => { setStarted(false); setI(0); setCompleted(new Set()); }} style={secondaryBtn}>
            Restart walkthrough
          </button>
        </div>
        <Keyframes />
      </Shell>
    );
  }

  // ---------- STEP VIEW ----------
  const activeSection = step.section;
  return (
    <Shell>
      {/* progress chapters */}
      <div className="ew-chapters">
        {SECTIONS.map((s) => {
          const stepsIn = STEPS.filter((x) => x.section === s);
          const doneIn = stepsIn.filter((x) => completed.has(x.id)).length;
          const isActive = s === activeSection;
          const allDone = doneIn === stepsIn.length;
          return (
            <div key={s} className="ew-chapter">
              <div style={{
                height: 5, borderRadius: 3, background: BRAND.line, overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: `${(doneIn / stepsIn.length) * 100}%`,
                  background: allDone ? BRAND.green : BRAND.cyan, transition: "width 0.4s ease",
                }} />
              </div>
              <div style={{
                fontSize: 10, marginTop: 5, fontWeight: isActive ? 700 : 500,
                color: isActive ? BRAND.ink : BRAND.muted, textAlign: "center",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{s}</div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 12.5, color: BRAND.muted, textAlign: "center", margin: "10px 0 18px" }}>
        Step {i + 1} of {TOTAL} · {pct}% complete
      </div>

      {step.sequence ? (
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: BRAND.blue, padding: "4px 11px", borderRadius: 20 }}>Step {step.id}</span>
          </div>
          <h2 style={{ fontSize: 23, color: BRAND.ink, fontWeight: 800, textAlign: "center", margin: "10px 0 8px", lineHeight: 1.2 }}>
            {step.title}
          </h2>
          <p style={{ fontSize: 14.5, color: BRAND.muted, lineHeight: 1.6, textAlign: "center", maxWidth: 560, margin: "0 auto 22px" }}>
            {step.narration}
          </p>
          <MfaSequence steps={step.sequence} introAudio={step.introAudio} />
          <div style={{ textAlign: "center", marginTop: 26 }}>
            <button onClick={handleHotspot} style={primaryBtn}>
              {isLast ? "Finish" : (step.doneLabel || "Continue →")}
            </button>
          </div>
        </div>
      ) : (
      <div className="ew-row" style={{
        display: "flex", gap: 36, alignItems: "center", justifyContent: "center", flexWrap: "wrap",
      }}>
        <PhoneFrame step={step} onHotspot={handleHotspot} done={completed.has(step.id)} />

        {/* instruction panel */}
        <div className="ew-panel" style={{ maxWidth: 380, flex: "1 1 320px", minWidth: 280 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{
              fontSize: 12, fontWeight: 700, color: "#fff", background: BRAND.blue,
              padding: "4px 11px", borderRadius: 20,
            }}>Step {step.id}</span>
            {step.optional && <span style={{ fontSize: 11.5, color: BRAND.muted, fontStyle: "italic" }}>if applicable</span>}
            {step.sensitive && <span style={{ fontSize: 11.5, color: BRAND.red, fontWeight: 600 }}>🔒 sensitive</span>}
          </div>

          <h2 className="ew-h2" style={{ fontSize: 25, color: BRAND.ink, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>
            {step.title}
          </h2>
          <p style={{ fontSize: 15.5, color: BRAND.muted, lineHeight: 1.65, margin: "0 0 20px" }}>
            {step.narration}
          </p>

          {/* explainer video (non-branch steps) */}
          {step.video !== undefined && !step.branch && (
            step.video ? (
              <div style={{
                borderRadius: 10, overflow: "hidden", marginBottom: 18,
                border: `1px solid ${BRAND.line}`, background: "#000",
              }}>
                <video src={step.video} controls autoPlay muted playsInline
                  style={{ width: "100%", display: "block" }} />
              </div>
            ) : (
              <div style={{
                borderRadius: 10, marginBottom: 18, padding: "22px 14px", textAlign: "center",
                border: `1px dashed ${BRAND.blueLight}`, background: "#fff", color: BRAND.muted,
              }}>
                <div style={{ fontSize: 26 }}>🎬</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, marginTop: 6, letterSpacing: 0.3 }}>
                  HeyGen explainer video slot
                </div>
                <div style={{ fontSize: 11, marginTop: 3 }}>
                  Explains the DUO and Microsoft Multifactor paths — add your clip here
                </div>
              </div>
            )
          )}

          {/* branch */}
          {step.branch && tapped && (
            <div style={{
              background: BRAND.paper, border: `1px solid ${BRAND.line}`, borderRadius: 12,
              padding: 16, marginBottom: 18,
            }}>
              {step.video && (
                <div style={{
                  borderRadius: 10, overflow: "hidden", marginBottom: 14,
                  border: `1px solid ${BRAND.line}`, background: "#000",
                }}>
                  <video src={step.video} controls autoPlay muted playsInline
                    style={{ width: "100%", display: "block" }} />
                </div>
              )}
              {step.video === null && (
                <div style={{
                  borderRadius: 10, marginBottom: 14, padding: "22px 14px", textAlign: "center",
                  border: `1px dashed ${BRAND.blueLight}`, background: "#fff", color: BRAND.muted,
                }}>
                  <div style={{ fontSize: 26 }}>🎬</div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, marginTop: 6, letterSpacing: 0.3 }}>
                    HeyGen explainer video slot
                  </div>
                  <div style={{ fontSize: 11, marginTop: 3 }}>
                    Explains the two options below — add your clip here
                  </div>
                </div>
              )}
              <div style={{ fontWeight: 700, color: BRAND.ink, fontSize: 14, marginBottom: 10 }}>
                {step.branch.question}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {step.branch.options.map((opt, idx) => (
                  <button key={idx} onClick={() => setBranchPick(idx)}
                    style={{
                      textAlign: "left", padding: "11px 14px", borderRadius: 9, cursor: "pointer",
                      border: branchPick === idx ? `2px solid ${BRAND.blue}` : `1px solid ${BRAND.line}`,
                      background: branchPick === idx ? "#fbeef0" : "#fff",
                      fontWeight: 600, color: BRAND.ink, fontSize: 13.5,
                    }}>{opt.label}</button>
                ))}
              </div>
              {branchPick !== null && (
                <ol style={{ margin: "14px 0 0", paddingLeft: 18, color: BRAND.muted, fontSize: 13, lineHeight: 1.7 }}>
                  {step.branch.options[branchPick].steps.map((s, k) => <li key={k}>{s}</li>)}
                </ol>
              )}
            </div>
          )}

          {/* hotspot hint / wait / actions */}
          {waiting ? (
            <div style={{
              background: "#fff7ec", border: `1px solid ${BRAND.gold}`, borderRadius: 10,
              padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
            }}>
              <Spinner />
              <div>
                <div style={{ fontWeight: 700, color: BRAND.ink, fontSize: 14 }}>
                  {step.waitLabel || "Please wait…"}
                </div>
                <div style={{ fontSize: 12.5, color: BRAND.muted }}>
                  On a real device this can take a few minutes. Simulating {waitLeft}s here.
                </div>
              </div>
            </div>
          ) : step.branch && branchPick !== null ? (
            <button onClick={continueAfterBranch} style={primaryBtn}>
              {isLast ? "Finish" : "Got it, continue →"}
            </button>
          ) : step.hx == null ? (
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
                color: BRAND.muted, fontSize: 12.5,
              }}>
                <span style={{ fontSize: 14 }}>👉</span>
                No tap needed on the phone for this screen.
              </div>
              <button onClick={handleHotspot} style={primaryBtn}>
                {isLast ? "Finish" : (step.doneLabel || "Continue →")}
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: 10, color: BRAND.blue,
                fontSize: 13.5, fontWeight: 600, marginBottom: 12,
              }}>
                <span style={{
                  display: "inline-block", width: 9, height: 9, borderRadius: "50%",
                  background: BRAND.cyan, animation: "pulse 1.4s infinite",
                }} />
                {step.branch ? "Tap the highlighted spot, then answer the question" : `Tap the highlighted spot — ${step.htext}`}
              </div>
              {!step.branch && (
                <button onClick={handleHotspot} style={{
                  background: "none", border: `1.5px solid ${BRAND.line}`, borderRadius: 8,
                  padding: "8px 14px", fontSize: 13, fontWeight: 600, color: BRAND.blue, cursor: "pointer",
                }}>
                  {isLast ? "Finish" : "Continue →"}
                </button>
              )}
            </div>
          )}

          {/* back link */}
          {i > 0 && !waiting && (
            <button onClick={() => { setI(i - 1); setTapped(false); setBranchPick(null); }}
              style={{
                marginTop: 18, background: "none", border: "none", color: BRAND.muted,
                fontSize: 13, cursor: "pointer", textDecoration: "underline", padding: 0,
              }}>← Back a step</button>
          )}
        </div>
      </div>
      )}
      <Keyframes />
    </Shell>
  );
}

/* ---------- small components ---------- */
function MfaSequence({ steps, introAudio }) {
  // phase: "intro" -> plays the overview clip, then "screens" -> one clip per screen
  const [phase, setPhase] = React.useState(introAudio ? "intro" : "screens");
  const [idx, setIdx] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const [soundOn, setSoundOn] = React.useState(true);
  const [blocked, setBlocked] = React.useState(false); // autoplay blocked by the browser
  const audioRef = React.useRef(null);
  if (!audioRef.current && typeof window !== "undefined") audioRef.current = getSharedAudio();
  const tryPlayRef = React.useRef(() => {});
  const timerRef = React.useRef(null);

  const cur = steps[idx];
  const srcKey = phase === "intro" ? introAudio : cur.audio;
  const clip = srcKey ? AUDIO[srcKey] : null;

  // Advance to whatever comes after the current clip.
  const advance = React.useCallback(() => {
    if (phase === "intro") { setPhase("screens"); setIdx(0); return; }
    setIdx((i) => (i + 1) % steps.length);
  }, [phase, steps.length]);

  // Point the shared element at the current clip and listen for its end.
  React.useEffect(() => {
    const el = audioRef.current;
    if (!el || !clip) return;
    if (el.src !== clip) { el.src = clip; try { el.load(); } catch (e) {} }
    const onEnded = () => advance();
    const onPlaying = () => setBlocked(false);
    const onCanPlay = () => { if (playing && soundOn) tryPlayRef.current(); };
    el.addEventListener("ended", onEnded);
    el.addEventListener("playing", onPlaying);
    el.addEventListener("canplay", onCanPlay);
    return () => {
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("canplay", onCanPlay);
    };
  }, [clip, advance, playing, soundOn]);

  // Attempt playback. Safely: never touch currentTime before data is ready.
  const tryPlay = React.useCallback(() => {
    const el = audioRef.current;
    if (!el || !clip) return;
    try {
      if (el.readyState > 0) { el.currentTime = 0; }
    } catch (e) { /* ignore: not seekable yet */ }
    const p = el.play();
    if (p && typeof p.then === "function") {
      p.then(() => setBlocked(false)).catch(() => setBlocked(true));
    } else {
      // Older browsers return undefined; verify it actually started.
      setTimeout(() => {
        const a = audioRef.current;
        if (a && a.paused) setBlocked(true);
      }, 350);
    }
  }, [clip]);

  React.useEffect(() => { tryPlayRef.current = tryPlay; }, [tryPlay]);

  // Drive playback whenever the clip or play state changes.
  React.useEffect(() => {
    clearTimeout(timerRef.current);
    const el = audioRef.current;
    if (!el) return;

    if (!playing) { try { el.pause(); } catch (e) {} return; }

    if (soundOn && clip) {
      tryPlay();
      return;
    }

    // Muted: fall back to a readable-length timer so the sequence still moves.
    try { el.pause(); } catch (e) {}
    const text = phase === "intro" ? "" : (cur.voice || "");
    const ms = phase === "intro" ? 9000 : Math.max(4500, text.length * 55);
    timerRef.current = setTimeout(advance, ms);
    return () => clearTimeout(timerRef.current);
  }, [clip, playing, soundOn, phase, idx, cur, advance, tryPlay]);

  React.useEffect(() => () => {
    clearTimeout(timerRef.current);
    if (audioRef.current) { try { audioRef.current.pause(); } catch (e) {} }
  }, []);

  function replayCurrent() {
    setBlocked(false);
    setPlaying(true);
    if (!soundOn) setSoundOn(true);
    tryPlay();
  }
  function goNextScreen() {
    if (phase === "intro") { setPhase("screens"); setIdx(0); return; }
    setIdx((i) => (i + 1) % steps.length);
  }
  function replayIntro() {
    setPhase("intro"); setIdx(0); setPlaying(true); setBlocked(false);
  }

  const showingIntro = phase === "intro";
  const frame = showingIntro ? steps[0] : cur;

  return (
    <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
      {/* phone showing current frame */}
      <div className="ew-seq-phone" style={{
        position: "relative", width: 240, height: 496, borderRadius: 38, background: "#0c1220",
        padding: 9, boxShadow: "0 24px 56px rgba(10,30,60,0.32)", flexShrink: 0,
        opacity: showingIntro ? 0.45 : 1, transition: "opacity 0.4s",
      }}>
        <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", width: 96, height: 21, background: "#0c1220", borderRadius: 13, zIndex: 5 }} />
        <div style={{ position: "absolute", inset: 9, borderRadius: 30, overflow: "hidden", background: "#000" }}>
          <img src={IMG[frame.img]} alt={frame.caption} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s" }} />
          {!showingIntro && frame.hx != null && (
            <span style={{
              position: "absolute", left: `${frame.hx}%`, top: `${frame.hy}%`,
              transform: "translate(-50%,-50%)", width: 42, height: 42, pointerEvents: "none",
            }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${BRAND.cyan}`, animation: "ping 1.6s ease-out infinite" }} />
              <span style={{ position: "absolute", inset: 12, borderRadius: "50%", background: BRAND.cyan, boxShadow: "0 2px 10px rgba(229,25,55,0.6)" }} />
            </span>
          )}
        </div>
      </div>

      {/* caption + controls */}
      <div className="ew-panel" style={{ maxWidth: 320, flex: "1 1 260px", minWidth: 240 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          <div style={{
            flex: 1, height: 4, borderRadius: 2,
            background: showingIntro ? BRAND.blue : BRAND.line, transition: "background 0.3s",
          }} />
          {steps.map((_, k) => (
            <div key={k} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: !showingIntro && k === idx ? BRAND.blue : BRAND.line, transition: "background 0.3s",
            }} />
          ))}
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.blue, marginBottom: 6 }}>
          {showingIntro ? "Overview" : `Screen ${idx + 1} of ${steps.length}`}
        </div>
        <div style={{ fontSize: 19, fontWeight: 800, color: BRAND.ink, marginBottom: 8 }}>
          {showingIntro ? "What to expect" : cur.caption}
        </div>
        <p style={{ fontSize: 14, color: BRAND.muted, lineHeight: 1.6, margin: "0 0 16px" }}>
          {showingIntro
            ? "If your account uses Microsoft Multifactor plus Duo, you'll move through these three screens. Watch the sequence below — it plays automatically and explains what to look for on each screen. If you have Duo only, you'll simply get the Duo prompt."
            : cur.voice}
        </p>

        {blocked && soundOn && (
          <div style={{
            background: "#fff7ec", border: `1px solid ${BRAND.gold}`, borderRadius: 10,
            padding: 12, marginBottom: 12,
          }}>
            <div style={{ fontSize: 12.5, color: BRAND.muted, marginBottom: 8 }}>
              Your browser blocked audio from starting on its own.
            </div>
            <button className="ew-btn" onClick={replayCurrent} style={{
              ...primaryBtn, padding: "11px 20px", fontSize: 14, width: "100%",
            }}>
              ▶ Play voiceover
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="ew-btn" onClick={() => setPlaying((p) => !p)} style={seqBtn}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button className="ew-btn" onClick={() => { setSoundOn((v) => !v); if (audioRef.current) audioRef.current.pause(); }} style={seqBtn}>
            {soundOn ? "🔊 Sound on" : "🔇 Sound off"}
          </button>
          <button className="ew-btn" onClick={replayCurrent} style={seqBtn}>↻ Replay</button>
          <button className="ew-btn" onClick={goNextScreen} style={seqBtn}>Next screen →</button>
          {!showingIntro && (
            <button className="ew-btn" onClick={replayIntro} style={seqBtn}>Replay overview</button>
          )}
        </div>
      </div>
    </div>
  );
}
const seqBtn = {
  background: "#fff", color: BRAND.blue, border: `1.5px solid ${BRAND.line}`,
  borderRadius: 8, padding: "8px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
};
function BrandLogo() {
  return (
    <img
      src={IMG.mdaLogo}
      alt="UT MD Anderson Cancer Center"
      style={{ width: 260, maxWidth: "70%", height: "auto", display: "block", margin: "0 auto 22px" }}
    />
  );
}
function Shell({ children }) {
  return (
    <div className="ew-shell" style={{
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      background: `radial-gradient(1200px 600px at 50% -10%, #fbeef0, ${BRAND.white})`,
      minHeight: "100vh", padding: "28px 22px",
    }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>{children}</div>
    </div>
  );
}
function Stat({ n, l }) {
  return (
    <div className="ew-stat" style={{
      background: "#fff", border: `1px solid ${BRAND.line}`, borderRadius: 12,
      padding: "14px 22px", minWidth: 104,
    }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: BRAND.blue }}>{n}</div>
      <div style={{ fontSize: 11.5, color: BRAND.muted, marginTop: 2, letterSpacing: 0.3 }}>{l}</div>
    </div>
  );
}
function Spinner() {
  return <div style={{
    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
    border: `3px solid ${BRAND.line}`, borderTopColor: BRAND.gold,
    animation: "spin 0.8s linear infinite",
  }} />;
}
const primaryBtn = {
  background: BRAND.blue, color: "#fff", border: "none", borderRadius: 11,
  padding: "14px 30px", fontSize: 16, fontWeight: 700, cursor: "pointer", minHeight: 44,
  boxShadow: "0 10px 26px rgba(229,25,55,0.30)",
};
const secondaryBtn = {
  background: "#fff", color: BRAND.blue, border: `1.5px solid ${BRAND.blue}`,
  borderRadius: 11, padding: "12px 26px", fontSize: 15, fontWeight: 700, cursor: "pointer",
};
function Keyframes() {
  return <style>{`
    @keyframes ping { 0%{transform:scale(1);opacity:1} 80%,100%{transform:scale(1.7);opacity:0} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
    @keyframes spin { to { transform: rotate(360deg) } }
    @keyframes pop { 0%{transform:scale(0.4);opacity:0} 60%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
    button:focus-visible { outline: 3px solid ${BRAND.cyan}; outline-offset: 2px; }

    /* never let anything cause sideways scrolling on a phone */
    *, *::before, *::after { box-sizing: border-box; }
    .ew-shell { overflow-x: hidden; }

    /* progress chapters: horizontally scrollable strip on small screens */
    .ew-chapters { display: flex; gap: 6px; margin-bottom: 6px; flex-wrap: wrap; }
    .ew-chapter { flex: 1; min-width: 78px; }

    /* phone frame scales down instead of overflowing */
    .ew-phone { width: 300px; height: 620px; }

    /* tap targets stay comfortable */
    .ew-btn { min-height: 44px; }

    @media (max-width: 720px) {
      .ew-shell { padding: 18px 14px !important; }

      /* 8 chapters won't fit side-by-side: let them scroll horizontally */
      .ew-chapters {
        flex-wrap: nowrap;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        padding-bottom: 2px;
      }
      .ew-chapters::-webkit-scrollbar { display: none; }
      .ew-chapter { flex: 0 0 auto; min-width: 64px; width: 64px; }

      /* phone shrinks to fit the viewport, keeping its aspect ratio */
      .ew-phone {
        width: min(300px, 78vw) !important;
        height: auto !important;
        aspect-ratio: 300 / 620;
      }
      .ew-seq-phone {
        width: min(240px, 66vw) !important;
        height: auto !important;
        aspect-ratio: 240 / 496;
      }

      .ew-h1 { font-size: 27px !important; }
      .ew-h2 { font-size: 21px !important; }
      .ew-row { gap: 22px !important; }
      .ew-panel { min-width: 0 !important; width: 100%; }
      .ew-stat { padding: 11px 16px !important; min-width: 92px !important; }
    }

    @media (max-width: 380px) {
      .ew-h1 { font-size: 24px !important; }
      .ew-phone { width: 84vw !important; }
    }
  `}</style>;
}
