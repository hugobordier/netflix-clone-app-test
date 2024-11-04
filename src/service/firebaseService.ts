import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const getMovieListByUserId = async (
  userId: string
): Promise<string[] | null> => {
  try {
    const MovieListRef = doc(db, 'users', userId);
    const docSnap = await getDoc(MovieListRef);
    return docSnap.data()?.List;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getMovieLikedListByUserId = async (
  userId: string
): Promise<string[] | null> => {
  try {
    const MovieListRef = doc(db, 'users', userId);
    const docSnap = await getDoc(MovieListRef);
    return docSnap.data()?.LikedList;
  } catch (error) {
    console.error(error);
    return null;
  }
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

export const addMovieToLikedMovieList = async (
  userId: string,
  MovieId: number
) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      LikedList: arrayUnion(MovieId.toString()),
    });
    console.log(docRef);
    console.log('Valeur ajoutée avec succès !');
  } catch (error) {
    console.error("Erreur lors de l'ajout de la valeur :", error);
  }
};

export const removeMovieFromLikedMovieList = async (
  userId: string,
  movieId: number
) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      LikedList: arrayRemove(movieId.toString()),
    });
    console.log('Valeur supprimée avec succès !');
  } catch (error) {
    console.error('Erreur lors de la suppression de la valeur :', error);
  }
};
