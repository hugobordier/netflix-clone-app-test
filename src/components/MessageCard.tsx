type messageCardInterface = {
  username: string;
  date: Date;
  message: string;
  photoUrl?: string;
};

const MessageCard = ({
  username,
  date,
  message,
  photoUrl,
}: messageCardInterface) => {
  return (
    <div className="w-11/12 py-4 border rounded-lg bg-slate-50">
      <div className="flex items-center px-4 mb-6">
        <img
          src={photoUrl || 'https://randomuser.me/api/portraits/men/97.jpg'}
          alt="Avatar"
          className="w-12 h-12 mr-4 rounded-full"
        />
        <div>
          <div className="text-lg font-medium text-gray-800">{username}</div>
          <div className="text-gray-500">Ecris le {date.toLocaleString()}</div>
        </div>
      </div>
      <p className="px-4 mb-6 text-lg leading-relaxed text-gray-800">
        {message}
      </p>
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
