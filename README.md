# NewJoinees

## Firebase setup

This Vite + React app uses Firebase Authentication and Cloud Firestore. Projects are saved in Firestore and are not shared between accounts.

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
5. In Firebase Console → Firestore Database, create a database.
6. Publish the rules in `firestore.rules` from Firebase Console → Firestore Database → Rules.
7. Run `npm install` and `npm run dev`.

Projects saved before Firestore was enabled remain available in the browser that created them. Firebase stores project data in Firestore and authentication account information in Firebase Authentication.
