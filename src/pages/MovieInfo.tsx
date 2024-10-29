import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getMovieById, getTrailerById } from '../config/tmdbApi';
import { useEffect, useState } from 'react';
import movieFull from '../types/movieFull';
import ReactPlayer from 'react-player';
import NavBar from '../components/NavBar';
import Research from '../components/Research';
import Spinner from './Spinner';
import User from '../types/user';
import { Auth } from 'firebase/auth';
import Confetti from 'react-confetti';

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
  const location = useLocation();
  const [messageForm, setMessageForm] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    console.log('gogog');
    setTimeout(() => {
      setIsAnimating(false);
    }, 5000);
  };

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

  useEffect(() => {
    console.log('Location changed');
    setSearchInput('');
    fetchMovieData();
  }, [location]);

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
        searchInput.length > 0 ? 'overflow-hidden' : ''
      }`}
    >
      {isAnimating && (
        <Confetti numberOfPieces={2000} recycle={false} gravity={0.2} />
      )}
      <NavBar
        username={userData.username}
        onSearchChange={handleSearchChange}
        auth={auth}
      />
      {searchInput.length > 0 ? (
        <Research searchTerm={searchInput} />
      ) : (
        <div className="md:h-[calc(100vh-80px)] h-[calc(100vh-48px)]">
          <div className="flex flex-col items-center justify-center w-full space-y-4 md:flex-row h-2/3 md:space-y-0">
            <div className="flex h-[95%] items-center justify-around w-[95%] md:bg-slate-800 rounded-md p-4 md:p-6 md:flex-row flex-col">
              {/* c la que ca passe de rox a a col */}
              <div
                className={`justify-center w-full h-[95%] overflow-hidden cursor-pointer flex select-none ${isAnimating ? 'animate-rotateFull' : ''}`}
                onClick={handleClick}
              >
                <img
                  className="object-contain h-full px-2 rounded-lg pointer-events-none min-h-52 md:w-full min-w-72 md:px-4"
                  src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
                  alt={movieData.title}
                />
              </div>
              {/* Separator for larger screens */}
              <div className="items-center justify-center hidden w-1/12 h-full md:flex ">
                <div className="w-[2%] h-5/6 bg-white rounded-xl"></div>
              </div>
              {/* Text Information */}
              <div className="flex flex-col w-full h-full text-xs md:text-base">
                <h2 className="top-0 items-start w-full py-4 text-lg font-bold text-left md:text-3xl">
                  {movieData.title}
                </h2>
                <p className="self-center text-sm justify-self-center md:text-base">
                  {movieData.overview}
                </p>
                <p className="flex pt-3 space-x-1 text-sm md:text-lg">
                  <span className="font-bold">Genre :</span>
                  {movieData.genres.map((genre, index) => (
                    <span key={genre.id}>
                      {genre.name}
                      {index < movieData.genres.length - 1 && ', '}
                    </span>
                  ))}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-bold">Popularité : </span>
                  {movieData.popularity}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-bold">Durée : </span>
                  {movieData.runtime} minutes
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-bold">Date de sortie : </span>
                  {movieData.release_date}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-bold">Votes : </span>
                  {movieData.vote_average}/10
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-bold">Nombre de votes : </span>
                  {movieData.vote_count}
                </p>
                <div className="flex flex-col items-center justify-start w-full h-full pt-2">
                  <p className="pb-1 font-extrabold text-transparent bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text">
                    Laissez un message, svp {messageForm}
                  </p>
                  <form
                    className="w-5/6 h-1/2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                  >
                    <textarea
                      className="w-full h-[90%] p-2 text-sm text-black rounded-lg"
                      value={messageForm}
                      onChange={(e) => setMessageForm(e.target.value)}
                      placeholder="Entrez votre message"
                      required
                    />
                  </form>
                  <button
                    className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    type="submit"
                  >
                    Envoye
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trailer Section */}
          <div className="flex items-center justify-center w-full mt-6 rounded-2xl md:mt-12">
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
        </div>
      )}
    </div>
  );
};

export default MovieInfo;
