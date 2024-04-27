import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";

import { FIRESTORE_DB } from "./firebase";

export const queryByCollection = async (col: string) => {
  const colRef = collection(FIRESTORE_DB, col);
  const querySnapshot = await getDocs(colRef);

  const docs = Array.from(querySnapshot.docs).map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    };
  });

  return docs;
};

export const set = async (col: string, document: Object) => {
  await setDoc(doc(collection(FIRESTORE_DB, col)), document);
};

export const add = async (col: string, document: Object) => {
  const colRef = collection(FIRESTORE_DB, col);

  const docRef = await addDoc(colRef, document);

  return docRef;
};

export const del = async (col: string, id: string) => {
  const docRef = doc(FIRESTORE_DB, col, id);
  return await deleteDoc(docRef);
};
