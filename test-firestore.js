import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  console.log('Project ID:', process.env.VITE_FIREBASE_PROJECT_ID);
  try {
    const docRef = await addDoc(collection(db, 'buses'), { test: true });
    console.log('Added bus with ID:', docRef.id);
    const snap = await getDocs(collection(db, 'buses'));
    console.log('Total buses:', snap.size);
    process.exit(0);
  } catch(e) {
    console.error('Test failed:', e.message);
    process.exit(1);
  }
}
test();
