import { Auth } from 'firebase/auth';
import User from '../types/user';
import NavBar from '../components/NavBar';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Research from '../components/Research';
import UserCard from '../components/UserCard';
import { Message } from '../types/message';
import { getDocs, query, where, collectionGroup } from 'firebase/firestore';
import { db } from '../config/firebase';
import MessageCarrousel from '../components/MessageCarrousel';
import MyListCarrousel from '../components/MyListCarrousel';
import Movie from '../types/movie';
import {
  getMovieLikedListByUserId,
  getMovieListByUserId,
} from '../service/firebaseService';
import { getMovieById } from '../config/tmdbApi';
import movieFull from '../types/movieFull';

type AccountProps = {
  userData: User;
  auth: Auth;
};

const Account = ({ userData, auth }: AccountProps) => {
  const [searchInput, setSearchInput] = useState('');
  const location = useLocation();
  const [message, setMessage] = useState<Message[]>([]);
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [movieLikedList, setMovieLikedList] = useState<Movie[]>([]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  useEffect(() => {
    setSearchInput('');

    return () => {
      setSearchInput('');
    };
  }, [location]);

  const fetchUserMessages = async (userId: string): Promise<void> => {
    const messages: Message[] = [];
    const movieMessageCollection = collectionGroup(db, 'messages');

    const userMessagesQuery = query(
      movieMessageCollection,
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(userMessagesQuery);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        userId: userData.username,
        message: data.message,
        timestamp: data.timestamp.toDate(),
        movieID: doc.ref.path.split('/')[1],
      });
    });
    setMessage(messages);
  };

  const fetchMovieList = async (userId: string) => {
    try {
      const movies: Movie[] = [];
      const moviesId = await getMovieListByUserId(userId);
      if (moviesId) {
        await Promise.all(
          moviesId.map(async (movieId) => {
            const m: movieFull = await getMovieById(parseInt(movieId));
            movies.push({
              movieId: m.id,
              title: m.title,
              posterPath: m.poster_path,
            });
          })
        );
      }

      setMovieList(movies);
    } catch (error) {
      console.error(error);
      return 'error';
    }
  };

  const fetchMovieLikedList = async (userId: string) => {
    try {
      const movies: Movie[] = [];
      const moviesId = await getMovieLikedListByUserId(userId);
      if (moviesId) {
        await Promise.all(
          moviesId.map(async (movieId) => {
            const m: movieFull = await getMovieById(parseInt(movieId));
            movies.push({
              movieId: m.id,
              title: m.title,
              posterPath: m.poster_path,
            });
          })
        );
      }

      setMovieLikedList(movies);
    } catch (error) {
      console.error(error);
      return 'error';
    }
  };

  useEffect(() => {
    fetchUserMessages(userData.id);
    fetchMovieList(userData.id);
    fetchMovieLikedList(userData.id);
  }, []);
  return (
    <div className="relative min-h-screen overflow-hidden text-white no-scrollbar bg-slate-950">
      <NavBar
        username={userData.username}
        onSearchChange={handleSearchChange}
        auth={auth}
        photo={userData.photoUrl}
      />

      {searchInput.length > 0 ? (
        <Research searchTerm={searchInput} />
      ) : (
        <div className="  md:min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)]  min-h-[calc(100vh-48px)]">
          <div className="flex flex-col h-full min-h-full md:flex-row ">
            <div className="w-full md:w-2/5">
              <UserCard userData={userData} auth={auth} />
            </div>
            <div className="flex flex-col items-center w-full overflow-y-scroll no-scrollbar md:w-3/5 font-Knewave ">
              <h1 className="p-6 text-7xl"> Hello , {userData.username}</h1>
              <h2 className="px-6 py-3 text-3xl">
                Consultez vos commentaires {'('}
                {message.length}
                {')'}:{' '}
              </h2>
              <div className="flex justify-center w-11/12">
                <MessageCarrousel messages={message} />
              </div>
              <div className="w-full max-w-[82%] mt-4  h-[1px] bg-slate-300 "></div>
              <h2 className="px-6 py-3 text-xl">
                {' '}
                Ma Liste {'('}
                {movieList.length}
                {')'}
              </h2>
              {movieList.length > 0 ? (
                <div className="w-full pr-4 ">
                  <MyListCarrousel MovieList={movieList} />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full p-6 font-normal">
                  {' '}
                  Pas de films dans la liste
                </div>
              )}
              <div className="w-full max-w-[82%] mt-4  h-[1px] bg-slate-300 "></div>

              <h2 className="px-6 text-xl">
                {' '}
                Mes coup de coeur {'('}
                {movieLikedList.length}
                {')'}
              </h2>
              <div className="w-full pr-4 ">
                {movieList.length > 0 ? (
                  <div className="w-full pr-4 ">
                    <MyListCarrousel MovieList={movieLikedList} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full p-6 font-normal">
                    Pas de films dans la liste
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="w-full h-[1px] bg-slate-300 "></div>
    </div>
  );
};
export default Account;
