import { useState } from 'react';
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
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

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
          <MovieRow categorie="Films d'action " categorieId={28} />
          <MovieRow categorie="Films d'Adventure" categorieId={12} />
          <MovieRow categorie="Films d'Animation" categorieId={16} />
          <MovieRow categorie="Films DROLE" categorieId={35} />
          <MovieRow categorie="Films Famille" categorieId={10751} />
        </>
      )}
    </div>
  );
};

export default Home;
