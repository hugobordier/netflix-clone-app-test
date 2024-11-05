import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovieById } from '../config/tmdbApi';
import Movie from '../types/movie';

interface MovieCardProps {
  movieId: number;
  isScreenSmall: boolean;
  showText: boolean;
}

const MovieCard = ({ movieId, isScreenSmall, showText }: MovieCardProps) => {
  const [movieData, setMovieData] = useState<Movie | null>(null);
  const [clickStartTime, setClickStartTime] = useState<number | null>(null);
  const navigate = useNavigate();

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

      if (clickDuration < 200) {
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
    >
      <div className="relative ">
        <img
          className="object-cover w-full h-auto rounded-lg pointer-events-none"
          src={`https://image.tmdb.org/t/p/w500${movieData.posterPath}`}
          alt={movieData.title}
        />
      </div>
      {showText && (
        <div>
          <h2 className="hidden mt-4 text-center text-white select-none md:block md:font-bold">
            {movieData.title}
          </h2>

          <p className="hidden mt-2 text-xs text-center md:block text-slate-200">
            Durée: {movieData.runtime} minutes
          </p>
        </div>
      )}
    </button>
  );
};

export default MovieCard;
