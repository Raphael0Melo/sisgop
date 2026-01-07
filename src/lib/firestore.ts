import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { BookDay, Productivity, ControlCarFirestore, MapForce } from '@/types';

// Generic CRUD operations
export class FirestoreService<T> {
  constructor(private collectionName: string) { }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...data,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getAll(userId?: string): Promise<T[]> {
    try {
      let q = query(collection(db, this.collectionName), orderBy('createdAt', 'desc'));

      if (userId) {
        q = query(collection(db, this.collectionName), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as T[];
    } catch (error) {
      console.error(`Error getting documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate(),
        } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting document ${id} from ${this.collectionName}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error(`Error updating document ${id} in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document ${id} from ${this.collectionName}:`, error);
      throw error;
    }
  }

  async search(field: string, value: string, userId?: string): Promise<T[]> {
    try {
      let q = query(
        collection(db, this.collectionName),
        where(field, '>=', value),
        where(field, '<=', value + '\uf8ff'),
        orderBy(field)
      );

      if (userId) {
        q = query(
          collection(db, this.collectionName),
          where('userId', '==', userId),
          where(field, '>=', value),
          where(field, '<=', value + '\uf8ff'),
          orderBy('userId'),
          orderBy(field)
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as T[];
    } catch (error) {
      console.error(`Error searching in ${this.collectionName}:`, error);
      throw error;
    }
  }
}

// Specific services for each module
export const bookDayService = new FirestoreService<BookDay>('bookDay');
export const productivityService = new FirestoreService<Productivity>('productivity');
export const controlCarService = new FirestoreService<ControlCarFirestore>('controlCar');
export const mapForceService = new FirestoreService<MapForce>('mapForce');

// Additional helper functions
export const formatFirestoreDate = (date: Date | Timestamp): string => {
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString('pt-BR');
  }
  return date.toLocaleDateString('pt-BR');
};

export const formatFirestoreDateTime = (date: Date | Timestamp): string => {
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleString('pt-BR');
  }
  return date.toLocaleString('pt-BR');
};

