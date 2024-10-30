import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovieById } from '../config/tmdbApi';
import Movie from '../types/movie';

interface MovieCardProps {
  movieId: number;
  isScreenSmall: boolean;
}

const MovieCard = ({ movieId, isScreenSmall }: MovieCardProps) => {
  const [movieData, setMovieData] = useState<Movie | null>(null);
  const [clickStartTime, setClickStartTime] = useState<number | null>(null);
  const [isCardHover, setIsCardHover] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsCardHover(true);
  };

  const handleMouseLeave = () => {
    setIsCardHover(false);
  };

  const fetchMovieData = async () => {
    try {
      const movieTMDB = await getMovieById(movieId);
      const movie = {
        movieId: movieId,
        title: movieTMDB.title,
        posterPath: movieTMDB.poster_path,
        runtime: movieTMDB.runtime,
      };
      setMovieData(movie);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données du film',
        error
      );
    }
  };

  useEffect(() => {
    fetchMovieData();
  }, [movieId]);

  const handleMouseDown = () => {
    setClickStartTime(Date.now());
  };

  const handleMouseUp = () => {
    if (clickStartTime) {
      const clickDuration = Date.now() - clickStartTime;

      if (clickDuration < 100) {
        console.log('hello');
        handleNavigate();
      }

      setClickStartTime(null);
    }
  };

  const handleNavigate = () => {
    navigate(`/movie/${movieId}`);
  };

  if (!movieData) {
    return (
      <div className="w-[140px] border-red-50 md:w-[180px] py-4 px-2 bg-transparent flex flex-col items-center transition duration-300 transform hover:scale-105">
        <div className="relative md:h-[240]">
          <div className="object-cover w-full h-full rounded-lg pointer-events-none" />
        </div>

        <div className="relative md:h-[240px] w-full h-[180px] bg-gray-700 animate-pulse rounded-lg"></div>

        <p className="hidden mt-2 text-xs text-center md:block text-slate-200">
          Durée: ...minutes
        </p>
      </div>
    );
  }

  return (
    <button
      className="w-[140px] md:w-[180px] py-4 px-2 bg-transparent flex flex-col items-center transition duration-300 transform md:hover:scale-105"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative md:h-[240]">
        {(isCardHover || isScreenSmall) && (
          <div
            className="absolute flex items-center justify-center w-8 cursor-pointer right-2 bottom-2 aspect-square"
            onClick={() => {
              console.log('a ajoute dans MyList');
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="cursor-pointer"
            >
              <path d="M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43" />
              <path d="M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91" />
              <line x1="2" x2="22" y1="2" y2="22" />
            </svg>
          </div>
        )}
        <img
          className="object-cover w-full h-auto rounded-lg pointer-events-none"
          src={`https://image.tmdb.org/t/p/w500${movieData.posterPath}`}
          alt={movieData.title}
        />
      </div>

      <h2 className="hidden mt-4 text-center text-white select-none md:block md:font-bold">
        {movieData.title}
      </h2>

      <p className="hidden mt-2 text-xs text-center md:block text-slate-200">
        Durée: {movieData.runtime} minutes
      </p>
    </button>
  );
};

export default MovieCard;
