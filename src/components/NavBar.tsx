import { useState } from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { Auth, signOut } from 'firebase/auth';

interface NavBarProps {
  username: string;
  photo?: string;
  onSearchChange: (value: string) => void;
  auth: Auth;
}

const NavBar = ({ username, photo, onSearchChange, auth }: NavBarProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsSettingsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsSettingsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <nav className="flex flex-col w-screen h-12 bg-slate-900 md:h-20">
      <ul className="flex items-center justify-between h-full ">
        <li className="flex items-center w-full ">
          <img
            className="h-10 cursor-pointer md:h-16 animate-slideinLeft"
            src={logo}
            alt="logo"
            onClick={() => {
              navigate('/home');
            }}
          />
        </li>

        <li className="flex-row items-center justify-center hidden w-full gap-2 md:flex">
          <p>Bonjour {username}</p>
          <img
            className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
            src={photo || 'https://via.placeholder.com/40'}
            alt="User avatar"
          />
        </li>

        <li className="flex flex-row items-center justify-end w-full gap-4 animate-slideinRight">
          <a className="text-white rounded cursor-pointer hover:text-blue-700 md:bg-transparent md:p-0">
            Ma Liste
          </a>
          <div className="relative mr-2 md:mr-0">
            <button
              className="flex gap-2 text-white rounded cursor-pointer hover:text-blue-700 md:bg-transparent md:p-0"
              onMouseEnter={handleMouseEnter}
            >
              Settings
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>

            {isSettingsOpen && (
              <div
                className="absolute right-0 z-50 w-48 py-2 ml-5 origin-top-right rounded-md shadow-lg top-9 bg-slate-500 border-slate-800"
                onMouseLeave={handleMouseLeave}
              >
                <a className="block px-4 py-2 text-sm text-white hover:bg-gray-400">
                  Profile
                </a>
                <a className="block px-4 py-2 text-sm text-white hover:bg-gray-400">
                  Account
                </a>
                <a
                  className="flex justify-between px-4 py-2 text-sm text-white hover:bg-gray-400"
                  onClick={handleLogout}
                >
                  <p>Logout</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                </a>
              </div>
            )}
          </div>

          <div className="relative hidden pr-2 ml-3 md:block">
            <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-2">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
