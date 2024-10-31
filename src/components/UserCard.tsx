import { Auth, signOut } from 'firebase/auth';
import User from '../types/user';
import DarkModeToggle from './DarkModeToggle';
import { useNavigate } from 'react-router-dom';

type UserCardProps = {
  userData: User;
  auth: Auth;
};

const UserCard = ({ userData, auth }: UserCardProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };
  return (
    <div className="w-full h-full p-5">
      <div className="flex flex-col items-center w-full h-full p-3 bg-gray-700 rounded-xl">
        <div className="w-full max-h-[50%] flex p-3 justify-center">
          <div className="relative justify-center w-fit max-w-[600px]">
            <img
              src={
                userData.photoUrl ||
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
              }
              alt="Avatar"
              className="object-cover w-full h-full rounded-full"
            />
            <div className="absolute flex items-center justify-center w-1/4 bg-gray-800 rounded-full cursor-pointer bottom-2 right-2 h-1/4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-1/2 text-white h-1/2"
              >
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="w-full h-full m-2 mt-4 bg-gray-800 rounded-2xl">
          <div className="p-3 md:p-6">
            <h1 className="text-3xl ">
              UserName : <span className="font-bold">{userData.username}</span>
            </h1>
            <h2 className="mt-2 text-2xl">
              Age : <span className="font-bold">{userData.age} ans </span>
            </h2>
            <h2 className="mt-2 text-xl break-all ">
              UserId : <span className="font-bold">{userData.id}</span>
            </h2>
            <h2 className="mt-2 text-xl">
              Email : <span className="font-bold">{userData.email} </span>
            </h2>
            <h2 className="flex items-center h-full mt-6 text-xl whitespace-nowrap ">
              <p className="mr-2">Dark Mode : {'  '}</p>
              <div className="flex items-center w-full">
                <DarkModeToggle />
              </div>
            </h2>
            <div className="flex justify-center w-full md:w-fit">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center px-6 py-3 mt-10 mb-2 text-2xl font-medium text-center text-white rounded-full bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 me-2"
              >
                Logout{' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  className="w-12 h-12 mx-3 "
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
