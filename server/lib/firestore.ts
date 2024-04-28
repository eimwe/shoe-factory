import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  QuerySnapshot,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";

import { FIRESTORE_DB } from "./firebase";

export const queryByCollection = async (
  col: string,
): Promise<(DocumentData & { id: string })[]> => {
  const colRef = collection(FIRESTORE_DB, col);
  const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(colRef);

  const docs: (DocumentData & { id: string })[] = [];

  await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const docData = doc.data();

      // Check if any fields in the document are nested documents
      const nestedFields: string[] = Object.keys(docData).filter(
        (key) => typeof docData[key] === "object",
      );

      // If there are nested documents, retrieve the referenced documents
      if (nestedFields.length > 0) {
        // Clone the document data to avoid modifying the original document
        const updatedDocData = { ...docData };

        // Loop through each nested field and retrieve the referenced documents
        await Promise.all(
          nestedFields.map(async (field) => {
            if (Array.isArray(updatedDocData[field])) {
              // If the field is an array of nested documents, loop through each nested document and fetch its data
              updatedDocData[field] = await Promise.all(
                updatedDocData[field].map(async (nestedDocRef: any) => {
                  if (nestedDocRef instanceof DocumentReference) {
                    // If the nested reference is a DocumentReference, fetch its data
                    const nestedDocSnapshot = await getDoc(nestedDocRef);
                    return nestedDocSnapshot.exists()
                      ? {
                          ...nestedDocSnapshot.data(),
                          id: nestedDocSnapshot.id,
                        }
                      : null;
                  }
                }),
              );
            } else {
              // If the field is a single nested document, retrieve its data
              const nestedDocRef: any = updatedDocData[field];
              if (nestedDocRef instanceof DocumentReference) {
                const nestedDocSnapshot = await getDoc(nestedDocRef);
                updatedDocData[field] = nestedDocSnapshot.exists()
                  ? { ...nestedDocSnapshot.data(), id: nestedDocSnapshot.id }
                  : null;
              }
            }
          }),
        );

        // Push the updated document data to the array
        docs.push({ ...updatedDocData, id: doc.id });
      } else {
        // If there are no nested documents, simply add the document data to the array
        docs.push({ ...docData, id: doc.id });
      }
    }),
  );

  return docs;
};

export const queryById = async (
  col: string,
  docId: string,
): Promise<DocumentData & { id: string }> => {
  const docRef = doc(collection(FIRESTORE_DB, col), docId);
  const docSnapshot = await getDoc(docRef);

  if (!docSnapshot.exists()) {
    throw new Error(
      `Document with ID ${docId} does not exist in collection ${col}.`,
    );
  }

  const docData = docSnapshot.data();

  // Check if any fields in the document are nested documents
  const nestedFields: string[] = Object.keys(docData).filter(
    (key) =>
      typeof docData[key] === "object" &&
      !(docData[key] instanceof DocumentReference),
  );

  // If there are nested documents, retrieve the referenced documents
  await Promise.all(
    nestedFields.map(async (field) => {
      if (Array.isArray(docData[field])) {
        // If the field is an array of nested documents, loop through each nested document and fetch its data
        docData[field] = await Promise.all(
          docData[field].map(async (nestedDocRef: any) => {
            if (nestedDocRef instanceof DocumentReference) {
              // If the nested reference is a DocumentReference, fetch its data
              const nestedDocSnapshot = await getDoc(nestedDocRef);
              return nestedDocSnapshot.exists()
                ? {
                    ...nestedDocSnapshot.data(),
                    id: nestedDocSnapshot.id,
                  }
                : null;
            }
          }),
        );
      } else {
        await Promise.all(
          Object.entries(docData).map(async ([key, value]) => {
            if (value instanceof DocumentReference) {
              const nestedDocSnapshot = await getDoc(value);
              docData[key] = nestedDocSnapshot.exists()
                ? { ...nestedDocSnapshot.data(), id: nestedDocSnapshot.id }
                : null;
            }
          }),
        );
      }
    }),
  );

  return { ...docData, id: docSnapshot.id };
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
