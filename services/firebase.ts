import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSu5YjwKqBVXzyIUmgelXcBRXalv6oWN4",
  authDomain: "man-is-a-fool.firebaseapp.com",
  databaseURL: "https://man-is-a-fool-default-rtdb.firebaseio.com",
  projectId: "man-is-a-fool",
  storageBucket: "man-is-a-fool.appspot.com",
  messagingSenderId: "134311643887",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
