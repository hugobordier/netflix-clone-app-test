import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { Message } from '../types/message';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import User from '../types/user';
import { getReviews } from '../config/tmdbApi';
import tmdbReview from '../types/tmdbReview';
import MessageCard from './MessageCard';

type ReviewsInterface = {
  movieId: string | undefined;
};

const Reviews = ({ movieId }: ReviewsInterface) => {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [messagesToShow, setMessagesToShow] = useState<number>(5); // Nombre de messages à afficher initialement

  const UserIdToUser = async (userId: string): Promise<User | null> => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        return {
          id: userId,
          email: userData.email,
          username: userData.username,
          age: userData.age,
          photoUrl: userData.photoUrl,
        } as User;
      } else {
        console.error('Utilisateur non trouvé');
        return null;
      }
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données utilisateur :',
        error
      );
      return null;
    }
  };

  const fetchMessages = async () => {
    if (!movieId) return;

    try {
      // Fetch Firebase messages
      const messagesRef = collection(
        doc(db, 'MessageMovie', movieId),
        'messages'
      );
      const messagesSnapshot = await getDocs(messagesRef);
      const firebaseMessages = await Promise.all(
        messagesSnapshot.docs.map(async (doc) => {
          const messageData = doc.data();
          const user = await UserIdToUser(messageData.userId);

          return {
            id: doc.id,
            userId: messageData.userId,
            message: messageData.message,
            timestamp: messageData.timestamp.toDate(),
            user,
          } as Message;
        })
      );

      // Fetch TMDB reviews
      const tmdbReviewData = await getReviews(parseInt(movieId));
      const tmdbMessages: Message[] = tmdbReviewData.results.map(
        (res: tmdbReview) =>
          ({
            id: res.id,
            userId: 'userTMDB',
            message: res.content,
            timestamp: new Date(res.created_at),
            usernameTmdb: res.author,
          }) as Message
      );

      const combinedMessages = [...firebaseMessages, ...tmdbMessages];
      setMessages(combinedMessages);

      setDisplayedMessages(combinedMessages.slice(0, messagesToShow));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (messages) {
      setDisplayedMessages(messages.slice(0, messagesToShow));
    }
  }, [messages, messagesToShow]);

  useEffect(() => {
    fetchMessages();
  }, [movieId]);

  const handleLoadMore = () => {
    setMessagesToShow((prev) => prev + 5);
  };

  if (!messages) {
    return (
      <div className="flex items-center justify-center w-full">
        <div className="w-1/12">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <circle
              fill="#FF156D"
              stroke="#FF156D"
              stroke-width="15"
              r="15"
              cx="40"
              cy="65"
            >
              <animate
                attributeName="cy"
                calcMode="spline"
                dur="2"
                values="65;135;65;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="-.4"
              ></animate>
            </circle>
            <circle
              fill="#FF156D"
              stroke="#FF156D"
              stroke-width="15"
              r="15"
              cx="100"
              cy="65"
            >
              <animate
                attributeName="cy"
                calcMode="spline"
                dur="2"
                values="65;135;65;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="-.2"
              ></animate>
            </circle>
            <circle
              fill="#FF156D"
              stroke="#FF156D"
              stroke-width="15"
              r="15"
              cx="160"
              cy="65"
            >
              <animate
                attributeName="cy"
                calcMode="spline"
                dur="2"
                values="65;135;65;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="0"
              ></animate>
            </circle>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-4">
      <h2 className="h-full mt-4 mb-8 text-3xl font-bold">
        Discussion ({messages?.length || 0})
      </h2>
      <div className="flex flex-col items-center justify-center gap-4 my-2">
        {displayedMessages.length > 0 ? (
          displayedMessages
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((message) => (
              <div
                className="w-full flex items-center justify-center max-w-[1200px]"
                key={message.id}
              >
                <MessageCard
                  username={
                    message.user?.username ||
                    message.usernameTmdb ||
                    'Utilisateur inconnu'
                  }
                  date={message.timestamp}
                  message={message.message}
                />
              </div>
            ))
        ) : (
          <div>Aucun message trouvé.</div>
        )}
        {messages && messagesToShow < messages.length && (
          <button
            onClick={handleLoadMore}
            className="p-4 mx-4 my-4 text-white rounded-full text-nowrap bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800"
          >
            Charger plus de messages
          </button>
        )}
        <div className="h-2"></div>
      </div>
    </div>
  );
};

export default Reviews;
