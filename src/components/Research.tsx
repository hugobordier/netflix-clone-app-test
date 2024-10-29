import { useEffect, useState } from 'react';
import { getSearch } from '../config/tmdbApi';
import searchMovie from '../types/searchMovie';
import MovieCard from './MovieCard';

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
      <div className="">
        <h2 className="px-6 pt-2 text-3xl font-extrabold">
          Résultats pour : {searchTerm}
        </h2>
        <div className="mt-4 h-[90vh] overflow-y-auto no-scrollbar">
          {moviesSearched?.results.length !== 0 ? (
            <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9">
              {moviesSearched?.results
                .filter((movie) => movie.backdrop_path !== null)
                .filter((movie) => movie.poster_path !== null)
                .map((movie, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center w-full overflow-hidden rounded-lg"
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
