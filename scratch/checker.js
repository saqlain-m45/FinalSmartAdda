import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyArpIeKB0VTdRL6nXKB1TBSu_97HdR-RrQ",
  authDomain: "smart-adda-a899e.firebaseapp.com",
  projectId: "smart-adda-a899e",
  storageBucket: "smart-adda-a899e.firebasestorage.app",
  messagingSenderId: "429491212941",
  appId: "1:429491212941:web:a96c5c5fe10f69324888c4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  console.log('--- FIRESTORE DIAGNOSTIC ---');
  console.log('Project ID:', firebaseConfig.projectId);
  
  try {
    console.log('1. Testing connectivity (READ)...');
    const snap = await getDocs(collection(db, 'buses'));
    console.log('   RESULT: Success! Database reached.');
    console.log('   TOTAL BUSES:', snap.size);
    
    console.log('2. Testing permissions (WRITE)...');
    const docRef = await addDoc(collection(db, 'buses'), {
      test: true,
      timestamp: new Date().toISOString(),
      source: 'diagnostic-script'
    });
    console.log('   RESULT: Success! Document written with ID:', docRef.id);
    process.exit(0);
  } catch (e) {
    console.error('--- DIAGNOSTIC FAILED ---');
    console.error('Error Code:', e.code);
    console.error('Error Message:', e.message);
    
    if (e.message.includes('NOT_FOUND') || e.code === 'not-found') {
      console.log('\nEXPLANATION: The Firestore database "(default)" does not exist in this Firebase project.');
      console.log('ACTION: You MUST go to the Firebase Console and click "Create Database".');
    } else if (e.code === 'permission-denied') {
      console.log('\nEXPLANATION: Your Firestore rules are blocking the request.');
      console.log('ACTION: Update your rules in the Firebase Console to allow reads/writes.');
    }
    process.exit(1);
  }
}
check();
