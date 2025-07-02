import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string;

const firebaseConfig = { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
