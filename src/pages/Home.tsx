import { useState } from 'react';
import Spinner from './Spinner';
import NavBar from '../components/NavBar';
import Research from '../components/Research';
import MovieRow from '../components/MoviesRow';
import MovieRowPopular from '../components/MovieRowPopular';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Home = (userData: any) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  if (!userData) {
    return <Spinner />;
  }

  return (
    <div className="h-full overflow-hidden text-white no-scrollbar bg-gradient-to-b from-slate-500 to-slate-950">
      <NavBar
        username={userData.username}
        onSearchChange={handleSearchChange}
      />
      <MovieRowPopular />
      <MovieRow categorie="Films d'action " categorieId={28} />
      <MovieRow categorie="Films d'Adventure" categorieId={12} />
      <MovieRow categorie="Films d'Animation" categorieId={16} />
      <MovieRow categorie="Films DROLE" categorieId={35} />
      <MovieRow categorie="Films Famille" categorieId={10751} />

      {searchInput.length > 0 ? <Research searchTerm={searchInput} /> : <></>}
    </div>
  );
};

export default Home;
