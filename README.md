# NewJoinees

## Firebase Authentication setup

This Vite + React app uses Firebase Authentication only. It does not require Firestore, Firebase Storage, Realtime Database, or Firebase Hosting.

1. Open Firebase Console → Project settings → Your apps.
2. Copy the Web app configuration values.
3. Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. In Firebase Console → Authentication → Sign-in method, enable Email/Password.
5. Run `npm install` and `npm run dev`.

Project editor data is kept locally in the browser so no project content is sent to Firebase. Firebase stores only the authentication account information.
