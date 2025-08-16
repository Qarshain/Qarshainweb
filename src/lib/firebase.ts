import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqWtjElgQxEyIgof8MwDr58l1kdI9WpPE",
  authDomain: "qarshain.firebaseapp.com",
  projectId: "qarshain",
  storageBucket: "qarshain.firebasestorage.app",
  messagingSenderId: "45210054071",
  appId: "1:45210054071:web:56c7c182c00ef55dea0c32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Development mode - connect to emulators if available
if (import.meta.env.DEV) {
  try {
    // Uncomment these lines if you want to use Firebase emulators
    // connectAuthEmulator(auth, 'http://localhost:9099');
    // connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    console.log('Firebase emulators not available, using production');
  }
}

// Export app instance for potential use
export { app };