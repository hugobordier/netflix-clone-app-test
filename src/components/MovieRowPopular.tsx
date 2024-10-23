import { useEffect, useState } from 'react';
import { getPopularMovies } from '../config/tmdbApi';
import Spinner from '../pages/Spinner';
import Movie from '../types/movie';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const MovieRowPopular = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState('');

  const nextSlide = () => {
    setDirection('right');
    setCurrentSlide((prev) => (prev + 1) % movies.length);
    console.log(direction);
  };

  const prevSlide = () => {
    setDirection('left');
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
    console.log(direction);
  };

  const fetchMovies = async () => {
    try {
      const response = await getPopularMovies();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const moviesTMDB: Movie[] = response.map((movie: any) => ({
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        overview: movie.overview,
      }));
      setMovies(moviesTMDB);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);
      setError('Erreur lors de la récupération des films');
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {}, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="relative flex justify-center overflow-hidden h-1/3">
      <div
        className={`absolute inset-0 z-0 overflow-hidden bg-center bg-cover filter blur-lg transition-all duration-700 ease-in-out`}
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w500${movies[currentSlide].posterPath})`,
        }}
      ></div>

      <div className="absolute inset-0 z-0 overflow-hidden bg-black/50"></div>

      <div
        className={`relative z-10 flex items-center justify-between w-5/6 h-full animate-slideDown`}
      >
        <div className={`w-full `}>
          <p className="w-5/6 font-extrabold text-7xl">
            {movies[currentSlide].title}
          </p>
        </div>

        <div className="flex justify-center w-full h-full">
          <img
            className={`flex h-full `}
            src={`https://image.tmdb.org/t/p/w500${movies[currentSlide].posterPath}`}
            alt={movies[currentSlide].title}
          />
        </div>

        <div className={`w-full flex justify-end`}>
          <div className="w-5/6 p-4 rounded-lg bg-slate-700/50">
            <p className="text-lg">{movies[currentSlide].overview}</p>
          </div>
        </div>
      </div>

      {/* Bouton précédent */}
      <button
        onClick={prevSlide}
        className="absolute left-0 z-30 flex items-center justify-center px-4 transform -translate-y-1/2 cursor-pointer inset-y-1/2 group focus:outline-none"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
          <svg
            className="w-4 h-4 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path stroke="currentColor" d="M5 1 1 5l4 4" />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      {/* Bouton suivant */}
      <button
        onClick={nextSlide}
        className="absolute right-0 z-30 flex items-center justify-center px-4 transform -translate-y-1/2 cursor-pointer inset-y-1/2 group focus:outline-none"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
          <svg
            className="w-4 h-4 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path stroke="currentColor" d="m1 9 4-4-4-4" />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default MovieRowPopular;
