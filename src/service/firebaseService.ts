import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const getListByUserId = async (userId: string) => {
  const ListRef = collection(db, 'List');
  const q = query(ListRef, where('userId', '==', userId));

  const ListSnapshot = await getDocs(q);
  console.log(ListSnapshot);
};

export const addMovieToMovieList = async (userId: string, MovieId: number) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      List: arrayUnion(MovieId.toString()),
    });
    console.log(docRef);
    console.log('Valeur ajoutée avec succès !');
  } catch (error) {
    console.error("Erreur lors de l'ajout de la valeur :", error);
  }
};

export const removeMovieFromMovieList = async (
  userId: string,
  movieId: number
) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      List: arrayRemove(movieId.toString()),
    });
    console.log('Valeur supprimée avec succès !');
  } catch (error) {
    console.error('Erreur lors de la suppression de la valeur :', error);
  }
};
