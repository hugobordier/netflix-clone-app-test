import { Message } from '../types/message';
import { useState } from 'react';
import MessageCard from './MessageCard';
import MovieCard from './MovieCard';

type MessageCarrouselProp = {
  messages: Message[];
};

const MessageCarrousel = ({ messages }: MessageCarrouselProp) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? messages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === messages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="w-full mx-auto rounded-lg shadow-lg ">
      {messages.length > 0 && (
        <div className="relative flex items-center justify-center">
          <div className="flex w-11/12">
            <div className="w-2/3">
              <MessageCard
                date={messages[currentIndex].timestamp}
                message={messages[currentIndex].message}
                username={messages[currentIndex].userId}
                maxLines={4}
              />
            </div>

            <MovieCard
              isScreenSmall={true}
              movieId={parseInt(messages[currentIndex].movieID!)}
              showText={false}
            />
          </div>

          <button
            onClick={handlePrev}
            className="absolute left-0 p-2 text-white transform -translate-y-1/2 bg-blue-500 rounded-full top-1/2 hover:bg-blue-600"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 p-2 text-white transform -translate-y-1/2 bg-blue-500 rounded-full top-1/2 hover:bg-blue-600"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageCarrousel;
