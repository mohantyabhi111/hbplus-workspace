# HB Plus Workspace — React Native + Web

Cross-platform starter app built with Expo, React Native, React Native Web and Firebase Authentication.

## Included
- Google sign-in on web (Firebase popup) and native Android/iOS (Google Sign-In SDK).
- Verified-email domain gate for `@hbplus.fit`.
- Auth-state loading, clear errors, logout and protected dashboard.
- Firestore profile persistence.
- Firestore rules that independently enforce verified `@hbplus.fit` access.
- Admin/User display role. Role records are server/admin-managed; clients cannot grant themselves admin.

## 1. Prerequisites
- Node.js LTS and npm
- Firebase project with Authentication and Firestore enabled
- Google Cloud OAuth 2.0 client configuration
- Android Studio / Xcode for native builds

## 2. Configure Firebase
1. Create a Firebase project and add a Web app.
2. In Firebase Console → Authentication → Sign-in method, enable Google.
3. In Authentication → Settings → Authorized domains, add your production web hostname and localhost for development.
4. Create Firestore in production mode.
5. Copy the Firebase web app configuration into `.env` (start from `.env.example`).
6. Set `EXPO_PUBLIC_ALLOWED_DOMAIN=hbplus.fit`.

The OAuth consent screen / Google Workspace configuration should be configured for your organization. `hd` is only a Google account-picker hint; it is NOT an authorization control. The verified email check and Firestore rules are the enforcement controls.

## 3. Google OAuth clients
Create OAuth 2.0 clients in Google Cloud Console:
- Web client: configure authorized JavaScript origins (for local development and production) and the Firebase auth handler redirect URI as required by Firebase.
- Android client: use your Android package name and SHA-1 fingerprints (debug and release).
- iOS client: use the bundle identifier.

Put the client IDs in `.env`. For native sign-in, use a development build / EAS build; the native Google Sign-In module is not supported in Expo Go. Verify the exact setup against the current `@react-native-google-signin/google-signin` documentation for your SDK versions.

## 4. Apply database security rules
Publish `firestore.rules` in Firebase Console → Firestore Database → Rules, or deploy with Firebase CLI. Do not deploy with permissive test-mode rules.

The rules allow users to read their own user document only when the Firebase ID token contains a verified email ending in `@hbplus.fit`. All other documents are denied by default.

## 5. Run
```bash
npm install
cp .env.example .env
# Fill in .env values
npm run web
```

Native:
```bash
npx expo prebuild
npx expo run:android
# or
npx expo run:ios
```

## 6. Admin role
For a production role model, provision role documents using a trusted server/Admin SDK. Example document:
`roles/{uid}` → `{ "role": "admin" }`

Do not let the client write role documents. To activate an admin role in the UI, update `AuthContext.tsx` to read `roles/{uid}` rather than a user-editable profile field, and retain server-side authorization checks for every admin operation. The current starter defaults all accounts to `user` until you wire in the trusted role lookup.

## Security notes
- Firebase client config is not a secret. Never ship service-account credentials or private OAuth client secrets in the app.
- Client-side route protection improves UX, but database/API rules are the actual authorization boundary.
- Google OAuth `hd` parameter is only a hint. Always check the Firebase user's verified email after authentication.
- For privileged backend APIs, verify the Firebase ID token server-side and enforce the same domain and role policy there.
- If you need to prevent even Firebase Auth account creation for other domains, use Firebase Authentication with Identity Platform blocking functions (`beforeUserCreated`) to reject non-organization emails. The client app alone cannot guarantee that account-creation restriction.
- Use HTTPS in production, restrict OAuth origins, and rotate credentials if exposed.
