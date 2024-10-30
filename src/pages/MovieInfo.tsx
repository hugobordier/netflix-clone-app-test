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
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import Toast from '../components/Toast';
import Separator from '../components/Separator';
import Reviews from '../components/Reviews';

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
  const [isTrailerNull, setIsTrailerNull] = useState(false);

  const updateIsToastVisible = (bool: boolean) => {
    setIsToastVisible(bool);
  };

  const isTrailerNullFunction = (trailer: string) => {
    const test = trailer.split('=', 2);
    console.log(test, trailer);
    if (test[1] !== 'undefined') {
      setIsTrailerNull(false);
      console.log('false');
    } else {
      setIsTrailerNull(true);
      console.log('true');
    }
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
      isTrailerNullFunction(trailerUrl);
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
    <div className="relative min-h-screen overflow-hidden text-white no-scrollbar bg-gradient-to-b from-slate-950 to-slate-700">
      {isAnimating && (
        <Confetti
          numberOfPieces={2000}
          recycle={false}
          gravity={0.2}
          className="w-full h-screen "
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
        <div className="  md:minh-[calc(100vh-80px)] min-h-[calc(100vh-48px)]">
          {isToastVisible && (
            <Toast
              message={`Votre message : ${messageForm} a bien été envoyé`}
              update={updateIsToastVisible}
            />
          )}
          <div className="flex flex-col-reverse items-center justify-center w-full mt-4 space-y-4  md:flex-row h-full md:max-h-[800px] md:min-h-[650px] md:space-y-0">
            <div className="flex max-h-[95%] h-[95%] items-center justify-around  w-[95%] md:bg-slate-800 rounded-md p-10  md:p-6 md:flex-row flex-col">
              {/* c la que ca passe de rox a a col */}
              <div
                className={`justify-center w-full  max-w-lg  overflow-hidden cursor-pointer flex select-none ${isAnimating ? 'animate-rotateFull' : ''}`}
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
                <p className="relative flex text-sm md:text-base lg:text-base 2xl:text-xl">
                  <span className="font-bold">Popularité : </span>
                  {movieData.popularity}
                  <span className="relative flex h-5 pl-2">
                    {Array(Math.floor(movieData.popularity / 40))
                      .fill(0)
                      .map((_, index) => (
                        <svg
                          key={index}
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="absolute lucide lucide-person-standing"
                          style={{
                            left: `${index * 8}px`,
                            top: `${index % 2 === 0 ? '0px' : '3px'}`,
                          }}
                        >
                          <circle cx="12" cy="5" r="1" />
                          <path d="m9 20 3-6 3 6" />
                          <path d="m6 8 6 2 6-2" />
                          <path d="M12 10v4" />
                        </svg>
                      ))}
                  </span>
                </p>
                <p className="text-sm md:text-base lg:text-base 2xl:text-xl ">
                  <span className="font-bold">Durée : </span>
                  {movieData.runtime} minutes
                </p>
                <p className="text-sm md:text-base lg:text-base 2xl:text-xl ">
                  <span className="font-bold">Date de sortie : </span>
                  {movieData.release_date}
                </p>
                <p
                  className={`text-sm md:text-base lg:text-base 2xl:text-xl ${
                    movieData.vote_average >= 8
                      ? 'text-green-500' // High rating
                      : movieData.vote_average >= 5
                        ? 'text-yellow-500' // Average rating
                        : 'text-red-500' // Low rating
                  }`}
                >
                  <span className="font-bold text-white">Votes : </span>
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
                    className="flex flex-col w-5/6 h-full gap-3 max-w-7xl"
                    onSubmit={(e) => {
                      setIsToastVisible(true);
                      handleSubmit(messageForm, e);
                    }}
                  >
                    <textarea
                      className="h-full p-2 text-sm text-black rounded-lg "
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
                    <div className="flex justify-end ">
                      <div className="p-2 cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-heart-off"
                        >
                          <line x1="2" y1="2" x2="22" y2="22" />
                          <path d="M16.5 16.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5a5.5 5.5 0 0 1 2.14-4.35" />
                          <path d="M8.76 3.1c1.15.22 2.13.78 3.24 1.9 1.5-1.5 2.74-2 4.5-2A5.5 5.5 0 0 1 22 8.5c0 2.12-1.3 3.78-2.67 5.17" />
                        </svg>
                      </div>
                      <div className="p-2 cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-star-off"
                        >
                          <path d="M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43" />
                          <path d="M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      </div>
                    </div>
                  </form>
                  <div className="w-full h-auto bg-green-600 bottom-2 right-2"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Trailer Section */}
          <Separator />
          {!isTrailerNull && (
            <>
              <div className="flex items-center justify-center w-full py-5">
                <div className="w-11/12 overflow-hidden max-w-7xl aspect-video rounded-2xl">
                  <ReactPlayer
                    url={trailer}
                    playing={true}
                    loop={true}
                    muted={true}
                    width="100%"
                    height="100%"
                    controls={true}
                  />
                </div>
              </div>
              <Separator />
            </>
          )}
          <div className="h-full">
            <Reviews movieId={movieId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieInfo;
