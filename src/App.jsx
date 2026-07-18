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

  // ---- BYOD flow screenshots (numbered per the walkthrough order) ----
  b01: "/img/clickonappstore1.PNG",
  b02: "/img/searchcompanyportal2.PNG",
  b03: "/img/signintocompportal3.PNG",
  b04: "/img/signinwithemail4.PNG",
  b05: "/img/clickopenduo5.PNG",
  b06: "/img/headbacktocompportal6.PNG",
  b07: "/img/clickok7.PNG",
  b08: "/img/allownotifications8.PNG",
  b09: "/img/clickbegin9.PNG",
  b09a: "/img/clickoncan9.PNG",
  b10: "/img/clickoncontinue10.PNG",
  b11: "/img/signinwithemail11.PNG",
  b12: "/img/openduo12.PNG",
  b13: "/img/acceptduo13.PNG",
  b14: "/img/allow14.PNG",
  b15: "/img/closeprofiledownload15.PNG",
  b16: "/img/continuetocompanyportal16.PNG",
  b16a: "/img/setupaccessdownloaded16a.PNG",
  b17: "/img/howtoinstall17.PNG",
  b18: "/img/clickonsettings18.PNG",
  b19: "/img/profile_download_edited.png",
  b20: "/img/clickviewprofile20.PNG",
  b21: "/img/clickinstallprofile21.PNG",
  b22: "/img/enterpasscode22.PNG",
  b23: "/img/installprofile23.PNG",
  b24: "/img/installprofile24.PNG",
  b25: "/img/clicktrust25.PNG",
  b26: "/img/enrollingcertificate26.PNG",
  b27: "/img/clickcheckcircle27.PNG",
  b28: "/img/choosepersonal28.PNG",
  b29: "/img/installmanagementprofile29.PNG",
  b30: "/img/checkingdevicesetting30.PNG",
  b31: "/img/step37.png",
  b32: "/img/installedapps32.PNG",
  b33: "/img/youreallset35.PNG",

  // ---- Security Delay (Stolen Device Protection) removal, BYOD step 1 ----
  sd01: "/img/sd01_settings.png",
  sd02: "/img/sd02_faceid_passcode.png",
  sd03: "/img/sd03_enter_passcode.png",
  sd04: "/img/sd04_stolen_device.png",
  sd05: "/img/sd05_toggle_off.png",
  sd06: "/img/sd06_start_delay.png",
  sd07: "/img/sd07_done.png",
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
  intro: "/audio/watch-the-sequence.mp3",
  verify: "/audio/verify.mp3",
  openDuo: "/audio/openDuo.mp3",
  enterCode: "/audio/enterCode.mp3",
};

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
  { id: 39, section: "Apps", title: "Open the Edge app", narration: "On the Home Screen, find and tap the Edge app.", image: IMG.edgeHome, hx: 70, hy: 68, htext: "Tap Edge" },
  { id: 40, section: "Apps", title: "Set as default browser", narration: "On the Make Microsoft Edge Your Default Browser screen, tap Set as default browser.", image: IMG.edgeMakeDefault, hx: 50, hy: 87, htext: "Tap Set as default browser" },
  { id: 41, section: "Apps", title: "Tap Default Browser App", narration: "In the Edge settings screen that opens, tap Default Browser App (it currently shows Safari).", image: IMG.edgeSettings, hx: 68, hy: 51, htext: "Tap Default Browser App" },
  { id: 42, section: "Apps", title: "Select Edge", narration: "On the Default Browser App screen, tap Edge so it shows a checkmark. Then close the app by swiping up.", image: IMG.edgePicker, hx: 50, hy: 20, htext: "Tap Edge" },
  { id: 43, section: "Apps", title: "Open the MS Defender app", narration: "On the Home Screen, find and tap the MS Defender app.", image: IMG.defHome, hx: 62, hy: 60, htext: "Tap MS Defender" },
  { id: 44, section: "Apps", title: "Allow Defender notifications", narration: "Microsoft Defender opens. On the notifications prompt, tap Allow so you're notified of threats and security updates.", image: IMG.defAllow, hx: 67, hy: 58, htext: "Tap Allow" },
  { id: 45, section: "Apps", title: "Open Settings", narration: "Now activate the Employee Caller ID. On the Home Screen, tap the Settings app.", image: IMG.cidHome, hx: 90, hy: 78, htext: "Tap Settings" },
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
  { id: 58, section: "Lookout", title: "Open the Lookout Work app", narration: "On the Home Screen, tap the Lookout Work app.", image: IMG.lkHome, hx: 23, hy: 18, htext: "Tap Lookout Work" },
  { id: 59, section: "Lookout", title: "Let's get started → Continue", narration: "Lookout explains it needs permission for notifications, Secure DNS, and location. Tap Continue.", image: IMG.lkStart, hx: 50, hy: 90, htext: "Tap Continue" },
  { id: 60, section: "Lookout", title: "Allow While Using App", narration: "On the location prompt, tap Allow While Using App.", image: IMG.lkLocation, hx: 50, hy: 82, htext: "Tap Allow While Using App" },
  { id: 61, section: "Lookout", title: "Setup Secure DNS → Go to Settings", narration: "Lookout shows the Secure DNS setup steps. Tap Go to Settings.", image: IMG.lkDnsSetup, hx: 50, hy: 75, htext: "Tap Go to Settings" },
  { id: 62, section: "Lookout", title: "Tap General", narration: "In Settings, tap General.", image: IMG.lkSettings, hx: 50, hy: 54, htext: "Tap General" },
  { id: 63, section: "Lookout", title: "Tap VPN & Device Management", narration: "Scroll down and tap VPN and Device Management.", image: IMG.lkGeneral, hx: 50, hy: 75, htext: "Tap VPN & Device Management" },
  { id: 64, section: "Lookout", title: "Tap DNS", narration: "Under Restrictions and Proxies, tap DNS.", image: IMG.lkVpnMgmt, hx: 50, hy: 31, htext: "Tap DNS" },
  { id: 65, section: "Lookout", title: "Select Lookout Work", narration: "On the DNS screen, tap Lookout Work to make it your DNS proxy.", image: IMG.lkDnsPick, hx: 50, hy: 36, htext: "Tap Lookout Work" },
  { id: 66, section: "Lookout", title: "Lookout Secure DNS is active", narration: "Lookout Work now shows a checkmark. Secure DNS is active and your enrollment is complete.", image: IMG.lkDnsDone, hx: null, hy: null, htext: "", doneLabel: "Finish enrollment →" },
];

// -----------------------------------------------------------------------------
// BYOD (Bring Your Own Device) — personal iPhone/iPad Intune enrollment
// -----------------------------------------------------------------------------
const SECTIONS_BYOD = [
  "Security Delay",
  "Install",
  "Sign In",
  "Setup Access",
  "Download Profile",
  "Install Profile",
  "Finish Setup",
  "Apps",
];

const STEPS_BYOD = [
  // ---------- SECTION 1: Security Delay (Stolen Device Protection off) ----------
  {
    id: 1, section: "Security Delay",
    title: "Open Settings",
    narration: "Before we begin enrollment, you'll turn off the Stolen Device Protection security delay so nothing blocks you later. On your Home Screen, tap the Settings app.",
    image: IMG.sd01, hx: 84, hy: 38, htext: "Tap Settings",
    spotlight: { x: 75, y: 32.5, w: 21, h: 12.5 },
  },
  {
    id: 2, section: "Security Delay",
    title: "Tap Face ID & Passcode",
    narration: "In Settings, scroll down and tap Face ID & Passcode.",
    image: IMG.sd02, hx: 35, hy: 68, htext: "Tap Face ID & Passcode",
  },
  {
    id: 3, section: "Security Delay",
    title: "Enter your screen passcode",
    narration: "Enter your iPhone screen passcode to unlock Face ID & Passcode settings.",
    image: IMG.sd03, hx: 50, hy: 50, htext: "Enter passcode", sensitive: true,
  },
  {
    id: 4, section: "Security Delay",
    title: "Tap Stolen Device Protection",
    narration: "Scroll down in Face ID & Passcode and tap Stolen Device Protection.",
    image: IMG.sd04, fit: "contain", imgRatio: 217 / 352, hx: 80, hy: 63, htext: "Tap Stolen Device Protection",
  },
  {
    id: 5, section: "Security Delay",
    title: "Turn off Stolen Device Protection",
    narration: "Tap the toggle to turn Stolen Device Protection off. A Security Delay warning window will appear next.",
    image: IMG.sd05, fit: "contain", imgRatio: 210 / 351, hx: 83, hy: 13, htext: "Toggle off",
  },
  {
    id: 6, section: "Security Delay",
    title: "Tap Start Security Delay",
    narration: "On the Security Delay prompt, tap Start Security Delay. A one-hour countdown begins.",
    image: IMG.sd06, fit: "contain", imgRatio: 187 / 352, hx: 50, hy: 88, htext: "Tap Start Security Delay",
  },
  {
    id: 7, section: "Security Delay",
    title: "Tap Done",
    narration: "The Security Delay is now in progress and the one-hour countdown has started. Tap Done. After the hour, come back to Face ID & Passcode → Stolen Device Protection, verify Face ID, and turn it off. Then continue with enrollment below.",
    image: IMG.sd07, fit: "contain", imgRatio: 177 / 353, hx: 50, hy: 84, htext: "Tap Done",
  },

  // ---------- SECTION 2: Install ----------
  {
    id: 8, section: "Install",
    title: "Before you start — previous AirWatch enrollment?",
    narration: "If your device was previously enrolled with AirWatch, you'll need to remove that first. Pick the option that matches your device to continue.",
    image: null, hx: null, hy: null, htext: "",
    branch: {
      question: "Were you previously enrolled with AirWatch?",
      options: [
        {
          label: "No — this device has never been enrolled",
          steps: ["You're good to go. Tap Continue to move on."],
        },
        {
          label: "Yes — I need to remove the old profile",
          steps: [
            "Open Settings, tap General, then tap VPN & Device Management.",
            "Under Mobile Device Management, tap Device Manager.",
            "Tap Remove Management.",
            "Manually delete the AirWatch Hub Agent app from your Home Screen.",
            "If you're not sure or something doesn't match, contact 4INFO before continuing.",
          ],
        },
      ],
    },
  },
  {
    id: 9, section: "Install",
    title: "Open the App Store",
    narration: "On your device, tap the App Store on your Home Screen.",
    image: IMG.b01, hx: 88, hy: 40, htext: "Tap App Store",
    spotlight: { x: 74, y: 31, w: 21, h: 14 },
  },
  {
    id: 10, section: "Install",
    title: "Search Intune Company Portal and tap Get",
    narration: "Search for Intune Company Portal and tap Get to install it. Once it finishes, swipe up and tap the Comp Portal app to open it.",
    image: IMG.b02, hx: 92, hy: 65, htext: "Tap Get",
  },

  // ---------- SECTION 3: Sign In ----------
  {
    id: 11, section: "Sign In",
    title: "Sign in to Comp Portal",
    narration: "The Comp Portal app opens on the sign-in screen. Tap Sign in to begin.",
    image: IMG.b03, hx: 62, hy: 57, htext: "Tap Sign in",
  },
  {
    id: 12, section: "Sign In",
    title: "Enter your MDA email",
    narration: "Type your MD Anderson email address, then tap Next. On the next screen, enter your password and tap Sign in.",
    image: IMG.b04, hx: 91, hy: 44, htext: "Tap Sign in",
    sensitive: true,
    blurAreas: [{ x: 4, y: 18, w: 18.5, h: 4 }],
  },
  {
    id: 13, section: "Sign In",
    title: "Open Duo Mobile",
    narration: "Duo needs to check this device. Tap Open Duo Mobile. On the separate phone that has Duo Mobile installed, approve the push notification.",
    image: IMG.b05, hx: 72, hy: 42, htext: "Tap Open Duo Mobile",
  },
  {
    id: 14, section: "Sign In",
    title: "Head back to Comp Portal",
    narration: "After you approve the login in Duo Mobile, tap Comp Portal in the top-left corner to head back to the enrollment flow.",
    image: IMG.b06, hx: 20, hy: 6, htext: "Tap Comp Portal",
  },

  // ---------- SECTION 4: Setup Access ----------
  {
    id: 15, section: "Setup Access",
    title: "Get notified so you don't lose access → OK",
    narration: "On the Get Notified So You Don't Lose Access screen, tap OK.",
    image: IMG.b07, hx: 60, hy: 91, htext: "Tap OK",
  },
  {
    id: 16, section: "Setup Access",
    title: "Allow Comp Portal notifications",
    narration: "When iOS asks whether Comp Portal can send notifications, tap Allow.",
    image: IMG.b08, hx: 78, hy: 59, htext: "Tap Allow",
  },
  {
    id: 17, section: "Setup Access",
    title: "Set up MDA access → Begin",
    narration: "On the Set Up MD Anderson Cancer Center Access screen, tap Begin.",
    image: IMG.b09, hx: 60, hy: 91, htext: "Tap Begin",
  },
  {
    id: 18, section: "Setup Access",
    title: "Device Management & Your Privacy → Can",
    narration: "The Device Management and Your Privacy screen shows what MD Anderson can and cannot see on your device. Tap Can to review the list, then tap Continue at the bottom.",
    image: IMG.b09a, hx: 85, hy: 42, htext: "Tap Can, then Continue",
    extraDots: [{ x: 66, y: 95 }],
  },
  {
    id: 19, section: "Setup Access",
    title: "Back at the setup checklist → Continue",
    narration: "Privacy review is complete — the setup checklist reappears with the first item checked. Tap Continue.",
    image: IMG.b10, hx: 66, hy: 90, htext: "Tap Continue",
  },

  // ---------- SECTION 5: Download Profile ----------
  {
    id: 20, section: "Download Profile",
    title: "Sign in again to download the profile",
    narration: "Enter your MD Anderson email again to re-authenticate for the profile download, then tap Sign in.",
    image: IMG.b11, hx: 91, hy: 44, htext: "Tap Sign in",
    sensitive: true,
    blurAreas: [{ x: 4, y: 18, w: 18.5, h: 4 }],
  },
  {
    id: 21, section: "Download Profile",
    title: "Open Duo Mobile again",
    narration: "Tap Open Duo Mobile so Duo can verify this download.",
    image: IMG.b12, hx: 72, hy: 42, htext: "Tap Open Duo Mobile",
  },
  {
    id: 22, section: "Download Profile",
    title: "Accept the Duo push",
    narration: "On your separate phone with Duo Mobile, tap the green Approve icon to approve the profile download.",
    image: IMG.b13, hx: 83, hy: 85, htext: "Tap Approve",
    blurAreas: [{ x: 19, y: 23.5, w: 47, h: 6 }, { x: 14, y: 67.5, w: 55, h: 4 }],
  },
  {
    id: 23, section: "Download Profile",
    title: "Allow the configuration profile download",
    narration: "iOS asks whether portal.manage.microsoft.com can download a configuration profile. Tap Allow.",
    image: IMG.b14, hx: 92, hy: 57, htext: "Tap Allow",
  },
  {
    id: 24, section: "Download Profile",
    title: "Head back to your app",
    narration: "Once the push is approved in Duo, you'll see Head Back to Your App. Tap the top-left corner to return to the Comp Portal profile download.",
    image: IMG.b06, hx: 20, hy: 6, htext: "Tap to head back",
  },
  {
    id: 25, section: "Download Profile",
    title: "Profile Downloaded → Close",
    narration: "When you see the Profile Downloaded prompt, tap Close. You'll install the profile in the next section.",
    image: IMG.b15, hx: 62, hy: 57, htext: "Tap Close",
  },
  { id: 26, section: "Download Profile", title: "Continue to Company Portal", narration: "On the Continue to Company Portal screen, tap Continue.", image: IMG.b16, hx: 60, hy: 60, htext: "Tap Continue" },

  { id: 27, section: "Download Profile", title: "Setup checklist — download done → Continue", narration: "Back in Comp Portal, the setup checklist now shows Review Privacy Information and Download Management Profile checked. Tap Continue to move on to installing the profile.", image: IMG.b16a, hx: 66, hy: 90, htext: "Tap Continue" },

  // ---------- SECTION 6: Install Profile ----------
  { id: 28, section: "Install Profile", title: "How to install the profile", narration: "Comp Portal shows the steps for installing the management profile. Read them, then follow along on the next screens.", image: IMG.b17, hx: null, hy: null, htext: "", doneLabel: "Got it, continue →" },
  { id: 29, section: "Install Profile", title: "Open Settings", narration: "Swipe up to close Comp Portal, then tap the Settings app on your Home Screen.", image: IMG.b18, hx: 88, hy: 40, htext: "Tap Settings", spotlight: { x: 74, y: 31, w: 21, h: 14 } },
  { id: 30, section: "Install Profile", title: "Tap the downloaded profile banner", narration: "At the top of Settings, tap the banner showing Profile Downloaded (under your Apple ID card).", image: IMG.b19, hx: 50, hy: 57, htext: "Tap Profile Downloaded" },
  { id: 31, section: "Install Profile", title: "Tap Install", narration: "On the profile detail screen, tap Install in the top-right corner.", image: IMG.b21, hx: 91, hy: 12, htext: "Tap Install" },
  { id: 32, section: "Install Profile", title: "Enter your device passcode", narration: "iOS asks for your device passcode to authorize the installation. Enter it now.", image: IMG.b22, hx: 50, hy: 50, htext: "Enter passcode", sensitive: true },
  { id: 33, section: "Install Profile", title: "Confirm Install", narration: "On the warning sheet, tap Install to confirm.", image: IMG.b23, hx: 77, hy: 57, htext: "Tap Install" },
  { id: 34, section: "Install Profile", title: "Install one more time", narration: "One more Install confirmation appears. Tap Install.", image: IMG.b24, hx: 91, hy: 12, htext: "Tap Install" },
  { id: 35, section: "Install Profile", title: "Tap Trust", narration: "iOS asks whether you trust MD Anderson to manage this device. Tap Trust.", image: IMG.b25, hx: 76, hy: 58, htext: "Tap Trust" },
  { id: 36, section: "Install Profile", title: "Enrolling certificate…", narration: "The profile is being enrolled. Wait here — this can take a minute.", image: IMG.b26, hx: null, hy: null, htext: "", wait: 3000, waitLabel: "Enrolling certificate…", doneLabel: "Continue →" },
  { id: 37, section: "Install Profile", title: "Tap Done", narration: "When you see the profile with a checkmark, tap Done to close Settings.", image: IMG.b27, hx: 93, hy: 13, htext: "Tap the blue checkmark" },

  // ---------- SECTION 7: Finish Setup ----------
  { id: 38, section: "Finish Setup", title: "Choose the Personal category", narration: "Reopen Comp Portal. On the Choose the Best Category for This Device screen, tap Personal, then Continue.", image: IMG.b28, hx: 50, hy: 50, htext: "Tap Personal, then Continue" },
  { id: 39, section: "Finish Setup", title: "Install the management profile", narration: "On the You Need to Install the Management Profile screen, tap Continue.", image: IMG.b29, hx: 66, hy: 90, htext: "Tap Continue" },
  { id: 40, section: "Finish Setup", title: "Checking device settings…", narration: "Comp Portal checks that your device meets MDA policy. If it stalls, tap Retry. Full compliance can take up to 30 minutes — you can close the Comp Portal app while you wait.", image: IMG.b30, hx: 50, hy: 50, htext: "Tap Retry if needed", wait: 3000, waitLabel: "Checking device settings…", doneLabel: "Continue →" },

  { id: 41, section: "Finish Setup", title: "You're all set!", narration: "Comp Portal confirms enrollment is complete — you now have access to your email, devices, Wi-Fi, and apps for work. Tap Done.", image: IMG.b33, hx: 60, hy: 90, htext: "Tap Done" },

  // ---------- SECTION 8: Apps ----------
  { id: 42, section: "Apps", title: "Your work apps are installed", narration: "Your Home Screen now shows the managed work apps. Your device is enrolled and ready to use.", image: IMG.b32, hx: null, hy: null, htext: "", blurAreas: [{ x: 84, y: 6, w: 13, h: 7 }], doneLabel: "Continue →" },
  {
    id: 42, section: "Apps",
    title: "If prompted, manage or install an app",
    narration: "Work apps (Outlook, Authenticator, OneDrive, MS Defender, Teams, Edge, Employee) install automatically. If an app was already on your device, you may see a Manage the App prompt — tap OK. If an app didn't install on its own, open Comp Portal, tap the app, then Install, and follow the App Store prompt.",
    image: IMG.b31, hx: null, hy: null, htext: "",
    doneLabel: "Finish enrollment →",
  },
];

const FLOWS = {
  corporate: { steps: STEPS, sections: SECTIONS },
  byod: { steps: STEPS_BYOD, sections: SECTIONS_BYOD },
};

// Phone screen inner dimensions (see .ew-phone CSS: 300×620 frame, inset 11).
const SCREEN_RATIO = 278 / 598; // width / height
// When a step uses fit:"contain", the screenshot is narrower-tall than the
// screen so it fills the full width and letterboxes top/bottom. Hotspot
// coordinates for those steps are authored relative to the IMAGE (0–100%);
// this maps an image-relative point to a screen-relative one. x is unchanged
// (image fills width); y is compressed into the letterboxed band and centered.
function fitPoint(px, py, imgRatio) {
  const h = SCREEN_RATIO / imgRatio; // rendered image height as fraction of screen
  return { x: px, y: (1 - h) / 2 * 100 + py * h };
}

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
            style={{ width: "100%", height: "100%", objectFit: step.fit === "contain" ? "contain" : "cover" }} />
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

        {/* blur specific regions (e.g. email addresses on sign-in screens) */}
        {Array.isArray(step.blurAreas) && step.blurAreas.map((b, k) => (
          <div key={`blur-${k}`} aria-hidden="true" style={{
            position: "absolute",
            left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`,
            backdropFilter: "blur(9px)", WebkitBackdropFilter: "blur(9px)",
            background: "rgba(255,255,255,0.06)", borderRadius: 4, zIndex: 6,
          }} />
        ))}

        {/* spotlight: dim + blur everything except a target rectangle */}
        {step.spotlight && (() => {
          const s = step.spotlight;
          const overlay = {
            position: "absolute",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            background: "rgba(6,10,20,0.55)", zIndex: 7,
          };
          return (
            <>
              <div style={{ ...overlay, left: 0, right: 0, top: 0, height: `${s.y}%` }} />
              <div style={{ ...overlay, left: 0, right: 0, top: `${s.y + s.h}%`, bottom: 0 }} />
              <div style={{ ...overlay, left: 0, top: `${s.y}%`, width: `${s.x}%`, height: `${s.h}%` }} />
              <div style={{ ...overlay, left: `${s.x + s.w}%`, top: `${s.y}%`, right: 0, height: `${s.h}%` }} />
              <div style={{
                position: "absolute",
                left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, height: `${s.h}%`,
                border: `2px solid ${BRAND.cyan}`, borderRadius: 12,
                boxShadow: `0 0 0 4px rgba(229,25,55,0.25)`,
                pointerEvents: "none", zIndex: 7,
              }} />
            </>
          );
        })()}

        {/* hotspot(s) — solid dot. Primary dot is hx/hy; a step may add
            more via extraDots: [{x,y}]. Positions sit just off the target
            so the word/icon underneath still peeks out. */}
        {step.hx != null && [{ x: step.hx, y: step.hy }, ...(step.extraDots || [])].map((raw, k) => {
          const d = step.fit === "contain" ? fitPoint(raw.x, raw.y, step.imgRatio) : raw;
          return (
          <button key={`hs-${k}`} onClick={onHotspot} aria-label={step.htext}
            style={{
              position: "absolute", left: `${d.x}%`, top: `${d.y}%`,
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
          );
        })}

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
  const [path, setPath] = useState(null); // null | "corporate" | "byod"
  const [i, setI] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [waiting, setWaiting] = useState(false);
  const [waitLeft, setWaitLeft] = useState(0);
  const [branchPick, setBranchPick] = useState(null);
  const [tapped, setTapped] = useState(false);
  const timerRef = useRef(null);

  const flow = path ? FLOWS[path] : FLOWS.corporate;
  const activeSteps = flow.steps;
  const activeSections = flow.sections;
  const total = activeSteps.length;

  const step = activeSteps[i];
  const isLast = i === total - 1;
  const pct = Math.round((completed.size / total) * 100);

  function startPath(p) {
    setPath(p);
    setI(0);
    setCompleted(new Set());
    setTapped(false);
    setBranchPick(null);
  }
  function restart() {
    setPath(null);
    setI(0);
    setCompleted(new Set());
    setTapped(false);
    setBranchPick(null);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  // On every step change: kill any timer left over from the previous step
  // and clear the waiting state so a stale spinner/advance can't fire.
  // Also auto-reveal the branch UI on no-hotspot branch steps.
  useEffect(() => {
    clearInterval(timerRef.current);
    setWaiting(false);
    const s = activeSteps[i];
    if (s && s.branch && s.hx == null) setTapped(true);
  }, [i, activeSteps]);

  // Auto-start the wait when landing on a no-hotspot wait step (e.g. activation).
  useEffect(() => {
    if (path && i < total && step && step.hx == null && step.wait && !completed.has(step.id)) {
      runWait(step.wait);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, path]);

  // Auto-play: advance on a timer while still showing the step's hotspot as a cue.
  useEffect(() => {
    if (!(path && i < total && step && step.autoPlay && !completed.has(step.id))) return;
    const startIndex = i;
    const t = setTimeout(() => {
      setI((cur) => {
        if (cur !== startIndex) return cur; // moved on already; ignore
        setCompleted((c) => new Set(c).add(activeSteps[cur].id));
        return cur < total - 1 ? cur + 1 : total;
      });
    }, step.autoPlay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, path]);

  function markAndAdvance() {
    const next = new Set(completed); next.add(step.id); setCompleted(next);
    setTapped(false); setBranchPick(null);
    setI((cur) => (cur < total - 1 ? cur + 1 : total));
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
          setCompleted((c) => new Set(c).add(activeSteps[cur].id));
          return cur < total - 1 ? cur + 1 : total;
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

  // ---------- INTRO / PATH PICKER ----------
  if (!path) {
    return (
      <Shell>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", padding: "8px 0" }}>
          <BrandLogo />
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: BRAND.cyan, textTransform: "uppercase" }}>
            Mobile Device Services
          </div>
          <h1 className="ew-h1" style={{ fontSize: 38, lineHeight: 1.1, color: BRAND.ink, margin: "14px 0 10px", fontWeight: 800 }}>
            Set up your iPhone or iPad with Intune
          </h1>
          <p style={{ color: BRAND.muted, fontSize: 16, lineHeight: 1.6, maxWidth: 620, margin: "0 auto" }}>
            Choose the path that matches your device. Each is a guided, tap-along walkthrough.
          </p>

          <div style={{
            maxWidth: 520, margin: "22px auto 0",
            background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 14,
            padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.ink, whiteSpace: "nowrap" }}>
              Intro voiceover
            </div>
            <audio
              controls
              preload="none"
              src="/audio/mds-intro.mp3"
              style={{ flex: 1, height: 36 }}
            >
              Your browser does not support audio playback.
            </audio>
          </div>

          <div className="ew-cards" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20,
            maxWidth: 780, margin: "32px auto 8px",
          }}>
            <PathCard
              badge="MDA-issued device"
              title="Enroll your iPhone or iPad in Intune"
              description="For iPhones and iPads owned and issued by MD Anderson."
              meta={`~30 min · ${STEPS.length} guided steps`}
              onClick={() => startPath("corporate")}
            />
            <PathCard
              badge="Personal device (BYOD)"
              title="Set up BYOD Intune on your personal device"
              description="For your own iPhone or iPad. Requires iOS 18 or higher (iOS 26 recommended)."
              meta={`~15 min · ${STEPS_BYOD.length} guided steps`}
              onClick={() => startPath("byod")}
            />
          </div>

          <div style={{
            background: "#fff7ec", border: `1px solid ${BRAND.gold}`, borderRadius: 14,
            padding: "16px 20px", textAlign: "left", maxWidth: 620, margin: "24px auto 14px",
          }}>
            <div style={{ fontWeight: 700, color: BRAND.ink, marginBottom: 8, fontSize: 14 }}>Before you start — DUO</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: BRAND.muted, fontSize: 13.5, lineHeight: 1.7 }}>
              <li>If DUO is required, it must already be set up on a <strong>separate device</strong>.</li>
              <li>If DUO is on <strong>this</strong> device, contact 4INFO before continuing.</li>
            </ul>
          </div>

          <div style={{ fontSize: 12.5, color: BRAND.muted, maxWidth: 620, margin: "0 auto 26px", lineHeight: 1.6 }}>
            MDA-issued device support: iPhone 14–17; iPad 8th gen+, Air 3rd gen+, Mini 5th gen+, Pro 11" 3rd gen+, Pro 12.9" 5th gen+, Pro 13" M4 &amp; M5. Instructions may vary slightly by model or configuration.
          </div>

          <div style={{ marginTop: 24, fontSize: 12, color: BRAND.muted }}>
            Need help? 4INFO 713-794-4636 · Mobile Device Team 713-792-7233 (ext. 2-7233) · FCT3.5005
          </div>
        </div>
        <Keyframes />
      </Shell>
    );
  }

  // ---------- FINISH ----------
  if (i >= total) {
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
            Your device is now managed and ready to use. All {total} steps complete.
          </p>
          <div style={{
            display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", margin: "26px 0",
          }}>
            <Stat n={`${total}/${total}`} l="Steps done" />
            <Stat n="100%" l="Complete" />
          </div>
          <div style={{ fontSize: 13, color: BRAND.muted, lineHeight: 1.6, marginBottom: 24 }}>
            Issues or questions? 4INFO 713-794-4636 · Mobile Device Team 713-792-7233 (ext. 2-7233) · ITSMobileDeviceTeam@mdanderson.org · FCT3.5005
          </div>
          <button onClick={restart} style={secondaryBtn}>
            Back to path picker
          </button>
        </div>
        <Keyframes />
      </Shell>
    );
  }

  // ---------- STEP VIEW ----------
  const activeSection = step.section;
  const hidePhone = !!(step.branch && !step.image); // branch-only decision step
  return (
    <Shell>
      {/* progress chapters */}
      <div className="ew-chapters">
        {activeSections.map((s) => {
          const stepsIn = activeSteps.filter((x) => x.section === s);
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
        Step {i + 1} of {total} · {pct}% complete
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
          {i > 0 && (
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <button onClick={() => { setI(i - 1); setTapped(false); setBranchPick(null); }}
                style={{
                  background: "none", border: "none", color: BRAND.muted,
                  fontSize: 13, cursor: "pointer", textDecoration: "underline", padding: 0,
                }}>← Back a step</button>
            </div>
          )}
        </div>
      ) : (
      <div className="ew-row" style={{
        display: "flex", gap: 36, alignItems: "center", justifyContent: "center", flexWrap: "wrap",
      }}>
        {!hidePhone && (
          <PhoneFrame step={step} onHotspot={handleHotspot} done={completed.has(step.id)} />
        )}

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
          ) : step.branch && step.hx == null && branchPick === null ? (
            <div style={{
              color: BRAND.muted, fontSize: 13, fontStyle: "italic", marginTop: 4,
            }}>
              Pick an option above to continue.
            </div>
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
  // Playlist: intro clip (if any) followed by one entry per screen. Each entry
  // drives both the phone image and the audio source.
  const playlist = React.useMemo(() => {
    const list = [];
    if (introAudio) {
      list.push({
        isIntro: true,
        audio: introAudio,
        caption: "What to expect",
        voice: "If your account uses Microsoft Multifactor plus Duo, you'll move through these three screens. Each clip explains what to look for on that screen. If you have Duo only, you'll simply get the Duo prompt.",
        img: steps[0]?.img,
        hx: null, hy: null,
      });
    }
    steps.forEach((s) => list.push({ ...s, isIntro: false }));
    return list;
  }, [steps, introAudio]);

  const [idx, setIdx] = React.useState(0);
  const audioRef = React.useRef(null);
  const cur = playlist[idx];
  const clip = cur && cur.audio ? AUDIO[cur.audio] : null;
  const showingIntro = !!cur?.isIntro;

  // When a clip ends, roll to the next entry. If the user had the current
  // clip playing, try to continue playback on the next one — Chrome/Edge
  // generally allow this because the audio element already has user
  // activation from the initial play click.
  const handleEnded = React.useCallback(() => {
    setIdx((i) => (i + 1 < playlist.length ? i + 1 : i));
  }, [playlist.length]);

  // On idx change: swap src and try to keep playing if we already were.
  React.useEffect(() => {
    const el = audioRef.current;
    if (!el || !clip) return;
    const wasPlaying = !el.paused && !el.ended;
    if (el.src !== new URL(clip, window.location.href).href) {
      el.src = clip;
      try { el.load(); } catch (e) {}
    }
    if (wasPlaying) {
      const p = el.play();
      if (p && p.catch) p.catch(() => { /* user can click play on native controls */ });
    }
  }, [clip]);

  const atStart = idx === 0;
  const atEnd = idx === playlist.length - 1;

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
          <img src={IMG[cur.img]} alt={cur.caption} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s" }} />
          {!showingIntro && cur.hx != null && (
            <span style={{
              position: "absolute", left: `${cur.hx}%`, top: `${cur.hy}%`,
              transform: "translate(-50%,-50%)", width: 42, height: 42, pointerEvents: "none",
            }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${BRAND.cyan}`, animation: "ping 1.6s ease-out infinite" }} />
              <span style={{ position: "absolute", inset: 12, borderRadius: "50%", background: BRAND.cyan, boxShadow: "0 2px 10px rgba(229,25,55,0.6)" }} />
            </span>
          )}
        </div>
      </div>

      {/* caption + native audio + jump buttons */}
      <div className="ew-panel" style={{ maxWidth: 340, flex: "1 1 280px", minWidth: 260 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {playlist.map((_, k) => (
            <div key={k} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: k === idx ? BRAND.blue : BRAND.line, transition: "background 0.3s",
            }} />
          ))}
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.blue, marginBottom: 6 }}>
          {showingIntro ? "Overview" : `Screen ${idx} of ${steps.length}`}
        </div>
        <div style={{ fontSize: 19, fontWeight: 800, color: BRAND.ink, marginBottom: 8 }}>
          {cur.caption}
        </div>
        <p style={{ fontSize: 14, color: BRAND.muted, lineHeight: 1.6, margin: "0 0 14px" }}>
          {cur.voice}
        </p>

        <audio
          ref={audioRef}
          controls
          preload="none"
          src={clip || undefined}
          onEnded={handleEnded}
          style={{ width: "100%", height: 40, marginBottom: 12 }}
        >
          Your browser does not support audio playback.
        </audio>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="ew-btn" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={atStart} style={{
            ...seqBtn, opacity: atStart ? 0.4 : 1, cursor: atStart ? "default" : "pointer",
          }}>← Previous</button>
          <button className="ew-btn" onClick={() => setIdx((i) => Math.min(playlist.length - 1, i + 1))} disabled={atEnd} style={{
            ...seqBtn, opacity: atEnd ? 0.4 : 1, cursor: atEnd ? "default" : "pointer",
          }}>Next →</button>
          {!showingIntro && introAudio && (
            <button className="ew-btn" onClick={() => setIdx(0)} style={seqBtn}>↻ Replay overview</button>
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
function PathCard({ badge, title, description, meta, onClick }) {
  return (
    <button className="ew-path-card" onClick={onClick} style={{
      textAlign: "left", background: "#fff", border: `1.5px solid ${BRAND.line}`,
      borderRadius: 16, padding: "22px 22px 20px", cursor: "pointer",
      boxShadow: "0 8px 24px rgba(20,20,40,0.06)",
      transition: "transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{
        display: "inline-block", alignSelf: "flex-start",
        fontSize: 11, fontWeight: 700, color: "#fff", background: BRAND.blue,
        padding: "4px 10px", borderRadius: 20, letterSpacing: 0.4, textTransform: "uppercase",
      }}>{badge}</div>
      <div style={{ fontSize: 19, fontWeight: 800, color: BRAND.ink, lineHeight: 1.25 }}>
        {title}
      </div>
      <div style={{ fontSize: 13.5, color: BRAND.muted, lineHeight: 1.55 }}>
        {description}
      </div>
      <div style={{
        marginTop: 6, fontSize: 12, color: BRAND.muted, fontWeight: 600, letterSpacing: 0.3,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span>{meta}</span>
        <span style={{ color: BRAND.blue, fontSize: 16, fontWeight: 800 }}>→</span>
      </div>
    </button>
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

    /* path picker cards */
    .ew-path-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(20,20,40,0.10);
      border-color: ${BRAND.blueLight};
    }
    .ew-path-card:focus-visible {
      border-color: ${BRAND.blue};
    }

    /* progress chapters: horizontally scrollable strip on small screens */
    .ew-chapters { display: flex; gap: 6px; margin-bottom: 6px; flex-wrap: wrap; }
    .ew-chapter { flex: 1; min-width: 78px; }

    /* phone frame scales down instead of overflowing */
    .ew-phone { width: 300px; height: 620px; }

    /* tap targets stay comfortable */
    .ew-btn { min-height: 44px; }

    @media (max-width: 720px) {
      .ew-shell { padding: 18px 14px !important; }

      /* stack the path picker cards */
      .ew-cards { grid-template-columns: 1fr !important; }

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
