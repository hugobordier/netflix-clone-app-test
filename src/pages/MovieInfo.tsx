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

  if (!userData) {
    navigate('/login');
  }

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

  // eslint-disable-next-line react-hooks/rules-of-hooks
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
    <div className="h-screen overflow-hidden text-white no-scrollbar bg-gradient-to-b from-slate-500 to-slate-950">
      <NavBar
        username={userData.username}
        onSearchChange={handleSearchChange}
        auth={auth}
      />
      <div>
        {movieData.title} , {userData.username}
      </div>
      {trailer && <div>{trailer}</div>}
      <div className="flex items-center justify-center w-full ">
        <div className="flex rounded-3xl w-min">
          <div className="overflow-hidden rounded-2xl">
            <ReactPlayer
              url={trailer}
              playing={true}
              loop={true}
              muted={true}
            />
          </div>
        </div>
      </div>

      {searchInput.length > 0 ? <Research searchTerm={searchInput} /> : <></>}
    </div>
  );
};

export default MovieInfo;
