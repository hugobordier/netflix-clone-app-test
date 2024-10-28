import { useEffect, useState } from 'react';
import { getSearch } from '../config/tmdbApi';
import searchMovie from '../types/searchMovie';
import MovieCard from './MovieCard';
import { useLocation } from 'react-router-dom';

interface ResearchProps {
  searchTerm: string;
}

const Research = ({ searchTerm }: ResearchProps) => {
  const [moviesSearched, setMoviesSearched] = useState<searchMovie | null>(
    null
  );
  const fetchSearch = async (searchTerm: string) => {
    try {
      const response: searchMovie = await getSearch(searchTerm);
      setMoviesSearched(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSearch(searchTerm);
  }, [searchTerm]);

  return (
    <div className="absolute left-0 z-40 w-screen h-full overflow-visible text-white bg-black top-12 md:top-20">
      <div className="p-6">
        <h2 className="text-3xl font-extrabold">
          Résultats pour : {searchTerm}
        </h2>
        <div className="mt-4">
          {moviesSearched?.results.length !== 0 ? (
            <div className="grid gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {moviesSearched?.results
                .filter((movie) => movie.poster_path !== null) // Filtre les films sans image
                .map((movie, index) => (
                  <div
                    key={index}
                    className="w-full overflow-hidden rounded-lg"
                  >
                    <MovieCard movieId={movie.id} isScreenSmall={false} />
                  </div>
                ))}
            </div>
          ) : (
            <p>Aucun résultat pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Research;
