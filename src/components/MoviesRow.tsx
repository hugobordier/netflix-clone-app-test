import { useEffect, useState } from 'react';
import { getMoviesByCategory } from '../config/tmdbApi';
import MovieCard from './MovieCard';
import Spinner from '../pages/Spinner';
import Carousel from 'react-multi-carousel';

const responsive = {
  desktop: {
    breakpoint: { max: 1900, min: 1024 },
    items: 8,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
    slidesToSlide: 1,
  },
  superLargeDesktop: {
    breakpoint: { max: 2400, min: 1900 },
    items: 10,
  },
  supersuperLargeDesktop: {
    breakpoint: { max: 3000, min: 2400 },
    items: 13,
  },
  supersupersuperLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 18,
  },
};

interface MovieRowInterface {
  categorie: string;
  categorieId: number;
  isScreenSmall: boolean;
}

const MovieRow = ({
  categorie,
  categorieId,
  isScreenSmall,
}: MovieRowInterface) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMovies = async () => {
    try {
      const categoryId = categorieId;
      const response = await getMoviesByCategory(categoryId);
      setMovies(response);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);
      setError('Erreur lors de la récupération des films');
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mt-2 animate-slideUp">
      <h2 className="mt-2 mb-2 ml-6 font-bold md:text-2xl ">{categorie}</h2>
      <div className="mx-2 bg-gray-950/50 rounded-2xl">
        <div className="relative ">
          <Carousel
            responsive={responsive}
            autoPlaySpeed={1000}
            infinite={true}
            arrows={true}
            customLeftArrow={
              <div className="absolute z-10 flex items-center justify-center w-10 h-10 p-2 font-bold text-white rounded-full cursor-pointer left-1 bg-black/70">
                <svg
                  className="w-4 h-4 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path stroke="currentColor" d="M5 1 1 5l4 4" />
                </svg>
              </div>
            }
            customRightArrow={
              <div className="absolute z-10 flex items-center justify-center w-10 h-10 p-2 font-bold text-white rounded-full cursor-pointer right-1 bg-black/70">
                <svg
                  className="w-4 h-4 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path stroke="currentColor" d="m1 9 4-4-4-4" />
                </svg>
              </div>
            }
          >
            {movies.map((movie, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-center p-1"
                >
                  <MovieCard movieId={movie.id} isScreenSmall={isScreenSmall} />
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default MovieRow;
