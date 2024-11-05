import { useState, useRef, useLayoutEffect } from 'react';

type messageCardInterface = {
  username: string;
  date: Date;
  message: string;
  photoUrl?: string;
  maxLines: number;
};

type ParagraphProps = {
  children: React.ReactNode;
  maxLines?: number;
};

const Paragraph = ({ children, maxLines = 7 }: ParagraphProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [maxHeight, setMaxHeight] = useState('0px');
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const calculateMaxHeight = () => {
      if (paragraphRef.current) {
        const lineHeight = parseFloat(
          getComputedStyle(paragraphRef.current).lineHeight
        );
        const newMaxHeight = `${lineHeight * maxLines}px`;
        setMaxHeight(newMaxHeight);
        setShowButton(
          paragraphRef.current.scrollHeight > lineHeight * maxLines
        );
      }
    };

    calculateMaxHeight();

    const resizeObserver = new ResizeObserver(() => calculateMaxHeight());
    if (paragraphRef.current) {
      resizeObserver.observe(paragraphRef.current);
    }

    return () => {
      if (paragraphRef.current) {
        resizeObserver.unobserve(paragraphRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [maxLines]);

  return (
    <div>
      <p
        ref={paragraphRef}
        className={`px-4 mb-6 text-lg leading-relaxed text-gray-800 transition-all duration-300 ease-in-out whitespace-pre-wrap`}
        style={{
          maxHeight: isExpanded ? 'none' : maxHeight,
          overflow: isExpanded ? 'visible' : 'hidden',
        }}
      >
        {children}
      </p>
      {showButton && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-white bg-gradient-to-r mx-4 from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br  focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          {isExpanded ? 'Réduire' : 'Afficher tout'}
        </button>
      )}
    </div>
  );
};

const MessageCard = ({
  username,
  date,
  message,
  photoUrl,
  maxLines,
}: messageCardInterface) => {
  const validPhotoUrl =
    photoUrl && !photoUrl.endsWith('null') ? photoUrl : null;
  return (
    <div className="flex flex-col justify-between w-11/12 h-full py-4 border rounded-lg bg-slate-50">
      <div className="flex items-center px-4 mb-6">
        <img
          src={
            validPhotoUrl ||
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
          }
          alt="Avatar"
          className="w-12 h-12 mr-4 rounded-full"
        />
        <div>
          <div className="text-lg font-medium text-gray-800">{username}</div>
          <div className="text-gray-500">
            Écris le{' '}
            {date.toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            })}{' '}
            {date.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </div>
        </div>
      </div>
      <Paragraph maxLines={maxLines}>{message}</Paragraph>
      <div className="flex items-center justify-between px-4">
        <div>
          <a className="mr-4 text-gray-500 cursor-pointer hover:text-gray-700">
            <i className="far fa-thumbs-up"></i> Like
          </a>
          <a className="text-gray-500 cursor-pointer hover:text-gray-700">
            <i className="far fa-comment-alt"></i> Reply
          </a>
        </div>
        <div className="flex items-center">
          <a className="mr-4 text-gray-500 cursor-pointer hover:text-gray-700">
            <i className="far fa-flag"></i> Report
          </a>
          <a className="text-gray-500 cursor-pointer hover:text-gray-700">
            <i className="far fa-share-square"></i> Share
          </a>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
