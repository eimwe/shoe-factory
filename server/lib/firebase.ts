import { initializeApp } from "firebase/app";
import { FIREBASE_API_KEY } from "./app.consts";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "shoe-factory-d3117.firebaseapp.com",
  projectId: "shoe-factory-d3117",
  storageBucket: "shoe-factory-d3117.appspot.com",
  messagingSenderId: "550915863791",
  appId: "1:550915863791:web:84f6bc0f1f19948835171a",
};

initializeApp(firebaseConfig);

export const FIRESTORE_DB = getFirestore();
