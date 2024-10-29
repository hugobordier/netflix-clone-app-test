import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
//import { GoogleAuthProvider } from "firebase/auth/web-extension";

const firebaseConfig = {
  apiKey: 'AIzaSyCG2vuJnSNZSQ3L7HK84YJ0WEwgcK15NHo',
  authDomain: 'netlix-clone-app-test.firebaseapp.com',
  projectId: 'netlix-clone-app-test',
  storageBucket: 'netlix-clone-app-test.appspot.com',
  messagingSenderId: '815419413173',
  appId: '1:815419413173:web:3ec4e69ef84e86c5d1a4fc',
  measurementId: 'G-2WPN37DV3Y',
};

//const googleProvider = new GoogleAuthProvider();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore(app);

export { app, auth, db };
