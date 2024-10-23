import { useParams } from 'react-router-dom';
import { getMovieById } from '../config/tmdbApi';
import { useEffect, useState } from 'react';
import movieFull from '../types/movieFull';

const MovieInfo = () => {
  const { movieId } = useParams();
  const [movieData, setMovieData] = useState<movieFull | null>(null);
  const fetchMovieData = async () => {
    try {
      const movieTMDB = await getMovieById(parseInt(movieId!));
      setMovieData(movieTMDB);
      console.log(movieTMDB);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données du film',
        error
      );
    }
  };

  useEffect(() => {
    fetchMovieData();
  }, []);

  if (!movieData) {
    return <div>pas film la</div>;
  }

  return (
    <div>
      <div>{movieData.title}</div>
    </div>
  );
};

export default MovieInfo;
