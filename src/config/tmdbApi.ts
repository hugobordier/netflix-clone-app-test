import axios from 'axios';
import createCache from '../utils/cache';

const API_KEY = '3330bf5ad1514d752a4cce6fea38a7b6';
const BASE_URL = 'https://api.themoviedb.org/3';

const cache = createCache(500, 300000);
console.log('test');

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'fr',
  },
});

tmdbApi.interceptors.request.use((config) => {
  const cacheKey = `${config.url}?${new URLSearchParams(config.params).toString()}`;

  const cachedData = cache.get(cacheKey);
  console.log(cachedData);
  if (cachedData) {
    console.log('via cache');
    return Promise.reject({ isCached: true, data: cachedData });
  }

  return config;
});

tmdbApi.interceptors.response.use(
  (response) => {
    const cacheKey = `${response.config.url}?${new URLSearchParams(response.config.params).toString()}`;
    cache.set(cacheKey, response.data); // Stocke les données dans le cache
    console.log('via api');
    return response;
  },
  (error) => {
    if (error.isCached) {
      return Promise.resolve({ data: error.data });
    }
    return Promise.reject(error);
  }
);

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
    const randomIndex = Math.floor(
      Math.random() * (response.data.results.length + 1)
    );
    return `https://www.youtube.com/watch?v=${response.data.results[randomIndex]?.key}`;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSearch = async (search: string) => {
  try {
    const response = await tmdbApi.get(`/search/movie`, {
      params: {
        query: search,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
