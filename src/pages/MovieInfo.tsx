import { useNavigate, useParams } from 'react-router-dom';
import { getMovieById, getTrailerById } from '../config/tmdbApi';
import { useEffect, useState } from 'react';
import movieFull from '../types/movieFull';
import ReactPlayer from 'react-player';
import NavBar from '../components/NavBar';
import Research from '../components/Research';
import Spinner from './Spinner';
import User from '../types/user';
import { Auth } from 'firebase/auth';

type MovieInfoProps = {
  userData: User;
  auth: Auth;
};

const MovieInfo = ({ userData, auth }: MovieInfoProps) => {
  const { movieId } = useParams();
  const [movieData, setMovieData] = useState<movieFull | null>(null);
  const [trailer, setTrailer] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

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
      navigate('/404');
    }
  };

  useEffect(() => {
    fetchMovieData();
  }, []);

  if (!movieData) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen text-white no-scrollbar bg-gradient-to-b from-slate-950 to-slate-900 ${
        searchInput.length > 0 ? 'overflow-hidden' : 'overflow-auto'
      }`}
    >
      <NavBar
        username={userData.username}
        onSearchChange={handleSearchChange}
        auth={auth}
      />
      {searchInput.length > 0 ? (
        <Research searchTerm={searchInput} />
      ) : (
        <>
          <div>
            {movieData.title} , {userData.username}
          </div>
          {trailer && <div>{trailer}</div>}

          <div className="flex items-center justify-center w-full rounded-2xl">
            <div className="overflow-hidden max-w-7xl aspect-video rounded-2xl">
              <ReactPlayer
                url={trailer}
                playing={true}
                loop={true}
                muted={true}
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieInfo;
