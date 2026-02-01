import { db } from '../firebase';
import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    addDoc,
    updateDoc,
    increment,
    query,
    where
} from 'firebase/firestore';
import type { Category } from '../types';

const CATEGORIES_COLLECTION = 'categories';

export async function getAllCategories(): Promise<Category[]> {
    try {
        const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
        return querySnapshot.docs.map(doc => ({
            name: doc.data().name,
            count: doc.data().count || 0, // We might need to handle count dynamically later, but for now simple storage
            id: doc.id
        } as Category & { id: string }));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export async function addCategory(name: string) {
    // Check if category already exists to avoid duplicates
    const q = query(collection(db, CATEGORIES_COLLECTION), where("name", "==", name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        throw new Error("Category already exists");
    }

    return addDoc(collection(db, CATEGORIES_COLLECTION), {
        name,
        count: 0
    });
}

export async function deleteCategory(id: string) {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
}

export async function updateCategoryCount(categoryName: string, change: number) {
    const q = query(collection(db, CATEGORIES_COLLECTION), where("name", "==", categoryName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.warn(`Category ${categoryName} not found for count update`);
        return;
    }

    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, {
        count: increment(change)
    });
}
