import { useEffect, useState } from 'react';
import { getMoviesByCategory } from '../config/tmdbApi';
import MovieCard from './MovieCard';
import Spinner from '../pages/Spinner';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
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
    items: 2,
    slidesToSlide: 1,
  },
};

interface MovieRowInterface {
  categorie: string;
  categorieId: number;
}

const MovieRow = ({ categorie, categorieId }: MovieRowInterface) => {
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
            autoPlay={true}
            autoPlaySpeed={10000}
            infinite={true}
            className=""
            customRightArrow={<div className="absolute right-0"> &gt;</div>}
          >
            {movies.map((movie, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-center p-1"
                >
                  <MovieCard movieId={movie.id} />
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
