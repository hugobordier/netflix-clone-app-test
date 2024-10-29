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
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Toast from '../components/Toast';

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
  const [isToastVisible, setIsToastVisible] = useState(false);

  const updateIsToastVisible = (bool: boolean) => {
    setIsToastVisible(bool);
  };

  useEffect(() => {
    if (isToastVisible) {
      const timer = setTimeout(() => {
        setIsToastVisible(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isToastVisible]);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 5000);
  };

  const handleSubmit = async (
    messageForm: string,
    e: { preventDefault: () => void }
  ) => {
    e.preventDefault();
    const currentUser = auth.currentUser!.uid;

    try {
      const messagesRef = collection(
        db,
        'MessageMovie',
        movieId!.toString(),
        'messages'
      );
      await addDoc(messagesRef, {
        message: messageForm,
        userId: currentUser,
        timestamp: new Date(),
      });
      const timer = setTimeout(() => {
        setMessageForm('');
      }, 4000);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error(err);
      setMessageForm('Erreur : votre message n’a pas pu être envoyé.');
    }
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
      className={`relative min-h-screen  text-white no-scrollbar bg-gradient-to-b from-slate-950 to-slate-900 ${
        searchInput.length > 0 ? 'overflow-hidden' : ''
      }`}
    >
      {isAnimating && (
        <Confetti
          numberOfPieces={2000}
          recycle={false}
          gravity={0.2}
          className="w-full h-screen md:w-auto md:h-auto"
        />
      )}
      <NavBar
        username={userData.username}
        onSearchChange={handleSearchChange}
        auth={auth}
      />
      {searchInput.length > 0 ? (
        <Research searchTerm={searchInput} />
      ) : (
        <div className="md:h-[calc(100vh-80px)] min-h-[calc(100vh-48px)]">
          {isToastVisible && (
            <Toast
              message={`Votre message : ${messageForm} a bien été envoyé`}
              update={updateIsToastVisible}
            />
          )}
          <div className="flex flex-col-reverse items-center justify-center w-full mt-4 space-y-4  md:flex-row h-full md:max-h-[800px] md:min-h-[650px] md:space-y-0">
            <div className="flex max-h-[95%] h-[95%] items-center justify-around w-[95%] md:bg-slate-800 rounded-md p-10  md:p-6 md:flex-row flex-col">
              {/* c la que ca passe de rox a a col */}
              <div
                className={`justify-center w-full max-w-xl h-[90%] overflow-hidden cursor-pointer flex select-none ${isAnimating ? 'animate-rotateFull' : ''}`}
                onClick={handleClick}
              >
                <img
                  className="object-contain h-full px-2 rounded-lg pointer-events-none min-w-24 maw-h-5/6 min-h-52 md:w-full md:min-w-72 md:px-4"
                  src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
                  alt={movieData.title}
                />
              </div>
              {/* Separator for larger screens */}
              <div className="items-center justify-center hidden w-1/12 md:flex ">
                <div className="w-[2%] h-5/6 bg-white rounded-xl"></div>
              </div>
              {/* Text Information */}
              <div className="flex flex-col w-full h-full text-xs md:text-base ">
                <h2 className="top-0 items-start w-full py-4 text-lg font-bold text-left md:text-3xl">
                  {movieData.title}
                </h2>
                <p className="text-sm justify-self-center max-w-[800px] md:text-base">
                  {movieData.overview}
                </p>
                <p className="flex pt-3 space-x-1 text-sm md:text-lg lg:text-lg 2xl:text-xl">
                  <span className="font-bold">Genre :</span>
                  {movieData.genres.map((genre, index) => (
                    <span key={genre.id}>
                      {genre.name}
                      {index < movieData.genres.length - 1 && ', '}
                    </span>
                  ))}
                </p>
                <p className="text-sm md:text-base lg:text-base 2xl:text-xl ">
                  <span className="font-bold">Popularité : </span>
                  {movieData.popularity}
                </p>
                <p className="text-sm md:text-base lg:text-base 2xl:text-xl ">
                  <span className="font-bold">Durée : </span>
                  {movieData.runtime} minutes
                </p>
                <p className="text-sm md:text-base lg:text-base 2xl:text-xl ">
                  <span className="font-bold">Date de sortie : </span>
                  {movieData.release_date}
                </p>
                <p className="text-sm md:text-base lg:text-base 2xl:text-xl ">
                  <span className="font-bold">Votes : </span>
                  {movieData.vote_average}/10
                </p>
                <p className="text-sm md:text-base lg:text-base 2xl:text-xl ">
                  <span className="font-bold">Nombre de votes : </span>
                  {movieData.vote_count}
                </p>
                <div className="flex flex-col items-center justify-start w-full h-full pt-2 ">
                  <p className="pb-1 font-extrabold text-transparent bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text">
                    Laissez un message, svp
                  </p>
                  <form
                    className="flex flex-col w-5/6 gap-3 h-3/4 max-w-7xl"
                    onSubmit={(e) => {
                      setIsToastVisible(true);
                      handleSubmit(messageForm, e);
                    }}
                  >
                    <textarea
                      className="w-full h-full p-2 text-sm text-black rounded-lg"
                      value={messageForm}
                      onChange={(e) => setMessageForm(e.target.value)}
                      placeholder="Entrez votre message"
                      required
                    />

                    <button
                      className="text-white bg-gradient-to-r w-full from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      type="submit"
                    >
                      Envoyer
                    </button>
                  </form>
                  <div className="w-full h-auto bg-green-600 bottom-2 right-2"></div>
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
          <div className="  w-1 h-[4652px]"></div>
        </div>
      )}
    </div>
  );
};

export default MovieInfo;
