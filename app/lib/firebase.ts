import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCfWjTe6qkxlx1OlM0QYhIj76R2xCTk5zQ",
  authDomain: "resq-4459d.firebaseapp.com",
  projectId: "resq-4459d",
  storageBucket: "resq-4459d.firebasestorage.app",
  messagingSenderId: "480114293261",
  appId: "1:480114293261:web:57b0c65180052daacf7344"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);