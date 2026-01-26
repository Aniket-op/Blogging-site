import { db } from '../firebase';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    query,
    where,
    orderBy,
    Timestamp,
    addDoc,
    updateDoc
} from 'firebase/firestore';
import type { Blog } from '../types';

const BLOGS_COLLECTION = 'blogs';

function docToBlog(doc: any): Blog {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
    } as Blog;
}

export async function getAllBlogs(): Promise<Blog[]> {
    try {
        const querySnapshot = await getDocs(collection(db, BLOGS_COLLECTION));
        return querySnapshot.docs.map(docToBlog);
    } catch (error) {
        console.error("Error fetching all blogs:", error);
        return [];
    }
}

export async function getPublishedBlogs(): Promise<Blog[]> {
    try {
        const q = query(
            collection(db, BLOGS_COLLECTION),
            where('status', '==', 'published')
            // orderBy('createdAt', 'desc') // Requires an index, might fail initially without it
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(docToBlog)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Client-side sort fallback
    } catch (error) {
        console.error("Error fetching published blogs:", error);
        return [];
    }
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
    const q = query(collection(db, BLOGS_COLLECTION), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return undefined;
    const doc = querySnapshot.docs[0];
    return docToBlog(doc);
}

export async function createBlog(blog: Omit<Blog, 'id'>) {
    return addDoc(collection(db, BLOGS_COLLECTION), blog);
}

export async function updateBlog(id: string, data: Partial<Blog>) {
    const docRef = doc(db, BLOGS_COLLECTION, id);
    await updateDoc(docRef, data);
}

