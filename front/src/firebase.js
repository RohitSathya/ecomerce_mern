import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAjwL6KGXpSYsug-GEJLm9DWidYviMn22I",
    authDomain: "ecomerce-a93fb.firebaseapp.com",
    projectId: "ecomerce-a93fb",
    storageBucket: "ecomerce-a93fb.appspot.com",
    messagingSenderId: "797069013454",
    appId: "1:797069013454:web:611d647255a56d03d33b9f",
    measurementId: "G-H2V0YYZJ7Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return user;
  } catch (error) {
    throw new Error('Google sign-in failed');
  }
};
