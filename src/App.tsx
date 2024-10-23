import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Spinner from './pages/Spinner';
import Page404 from './pages/page404';
import Register from './pages/Register';
import Home from './pages/Home';
import MovieInfo from './pages/MovieInfo';
import { getMovieById } from './config/tmdbApi';
import { useEffect, useState } from 'react';
import { auth, db } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import User from './types/user';

function App() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data() as User);
        } else {
          setError('No user data found!');
        }
      } else {
        setError('No user data found!');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError('');
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchData();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (!userData) {
    return (
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/spinner" element={<Spinner />} />
          <Route path="/*" element={<Page404 />} />
          <Route path="/home" element={<Navigate to="/login" />} />
          <Route path="/movie/:id" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/spinner" element={<Spinner />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<Page404 />} />
        <Route path="/home" element={<Home userData={userData} />} />
        <Route path="/movie/:movieId" element={<MovieInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
