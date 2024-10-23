import { useParams } from 'react-router-dom';
import { getMovieById, getTrailerById } from '../config/tmdbApi';
import { useEffect, useState } from 'react';
import movieFull from '../types/movieFull';
import ReactPlayer from 'react-player';

const MovieInfo = () => {
  const { movieId } = useParams();
  const [movieData, setMovieData] = useState<movieFull | null>(null);
  const [trailer, setTrailer] = useState('');
  const fetchMovieData = async () => {
    try {
      const movieTMDB = await getMovieById(parseInt(movieId!));
      setMovieData(movieTMDB);
      const trailerUrl = await getTrailerById(parseInt(movieId!));
      setTrailer(trailerUrl);
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
      <div>{trailer}</div>
      <div className="rounded-3xl">
        <ReactPlayer url={trailer} />
      </div>
    </div>
  );
};

export default MovieInfo;
