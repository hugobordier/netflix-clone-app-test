import axios from 'axios';

const API_KEY = '3330bf5ad1514d752a4cce6fea38a7b6';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'fr',
  },
});

export const getMovieById = async (movieId: number) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données du film', error);
    throw error;
  }
};

export const getPopularMovies = async () => {
  try {
    const response = await tmdbApi.get(`/movie/popular`);
    return response.data.results;
  } catch (error) {
    console.error('Erreur lors de la récupération des films populaires', error);
    throw error;
  }
};

export const getMoviesByCategory = async (categoryId: number) => {
  try {
    const response = await tmdbApi.get(`/discover/movie`, {
      params: {
        with_genres: categoryId,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des films par catégorie',
      error
    );
    throw error;
  }
};

export const getTrailerById = async (movieId: number) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`, {
      params: {
        language: '',
      },
    });
    return `https://www.youtube.com/watch?v=${response.data.results[0]?.key}`;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
