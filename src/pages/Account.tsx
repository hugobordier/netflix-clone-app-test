import { Auth } from 'firebase/auth';
import User from '../types/user';
import NavBar from '../components/NavBar';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Research from '../components/Research';
import UserCard from '../components/UserCard';
import { Message } from '../types/message';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  collectionGroup,
} from 'firebase/firestore';
import { db } from '../config/firebase';

type AccountProps = {
  userData: User;
  auth: Auth;
};

const Account = ({ userData, auth }: AccountProps) => {
  const [searchInput, setSearchInput] = useState('');
  const location = useLocation();
  const [message, setMessage] = useState<Message[]>([]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  useEffect(() => {
    setSearchInput('');

    return () => {
      setSearchInput('');
    };
  }, [location]);

  const fetchUserMessages = async (userId: string): Promise<Message[]> => {
    const messages: Message[] = [];
    const movieMessageCollection = collectionGroup(db, 'messages');

    const userMessagesQuery = query(
      movieMessageCollection,
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(userMessagesQuery);

    querySnapshot.forEach((doc) => {
      //console.log(doc.data());
      const data = doc.data();
      messages.push({
        id: doc.id,
        userId: data.userId,
        message: data.message,
        timestamp: data.timestamp.toDate(),
        movieID: doc.ref.path.split('/')[1],
      });
    });
    console.log(messages);
    return messages;
  };

  useEffect(() => {
    fetchUserMessages(userData.id);
  }, []);
  return (
    <div className="relative min-h-screen overflow-hidden text-white no-scrollbar bg-slate-950">
      <NavBar
        username={userData.username}
        onSearchChange={handleSearchChange}
        auth={auth}
      />

      {searchInput.length > 0 ? (
        <Research searchTerm={searchInput} />
      ) : (
        <div className="  md:min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)]  min-h-[calc(100vh-48px)]">
          <div className="flex flex-col h-full min-h-full md:flex-row ">
            <div className="w-full md:w-2/5">
              <UserCard userData={userData} auth={auth} />
            </div>
            <div className="w-full p-6 md:p-12 md:w-3/5 font-Knewave">
              <h1 className="text-7xl"> Hello , {userData.username}</h1>
              <h2 className="mt-6 text-3xl">Consultez vos commentaires : </h2>
            </div>
          </div>
        </div>
      )}
      <div className="w-full h-[1px] bg-slate-300 "></div>
    </div>
  );
};
export default Account;