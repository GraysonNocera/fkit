// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, type User, onAuthStateChanged } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { writable } from "svelte/store";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAF8TizOXom6UpkPtts9AcxnKceCdKPW4U",
  authDomain: "testing-fkit.firebaseapp.com",
  projectId: "testing-fkit",
  storageBucket: "testing-fkit.appspot.com",
  messagingSenderId: "164547466787",
  appId: "1:164547466787:web:d0f299715711b5e4938396",
  measurementId: "G-PR3KT93EEH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

/**
 * @returns a store with the current firebase user
 */
function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn('Auth is not initialized or not in browser');
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    }
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
  };
}

export const user = userStore();