import { useEffect, useState } from 'react';
import Spinner from './Spinner';
import NavBar from '../components/NavBar';
import Research from '../components/Research';
import MovieRow from '../components/MoviesRow';
import MovieRowPopular from '../components/MovieRowPopular';
import User from '../types/user';
import { Auth } from 'firebase/auth';

type HomeProps = {
  userData: User;
  auth: Auth;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Home = ({ userData, auth }: HomeProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [isScreenSmall, setIsScreenSmall] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleResize = () => {
    setIsScreenSmall(window.innerWidth < 750);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!userData) {
    return <Spinner />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white no-scrollbar bg-gradient-to-b from-slate-500 to-slate-950">
      <NavBar
        username={userData.username}
        onSearchChange={handleSearchChange}
        auth={auth}
      />
      {searchInput.length > 0 ? (
        <Research searchTerm={searchInput} />
      ) : (
        <>
          <MovieRowPopular />
          <MovieRow
            categorie="Films d'action "
            categorieId={28}
            isScreenSmall={isScreenSmall}
          />
          <MovieRow
            categorie="Films d'Adventure"
            categorieId={12}
            isScreenSmall={isScreenSmall}
          />
          <MovieRow
            categorie="Films d'Animation"
            categorieId={16}
            isScreenSmall={isScreenSmall}
          />
          <MovieRow
            categorie="Films DROLE"
            categorieId={35}
            isScreenSmall={isScreenSmall}
          />
          <MovieRow
            categorie="Films Famille"
            categorieId={10751}
            isScreenSmall={isScreenSmall}
          />
        </>
      )}
    </div>
  );
};

export default Home;
