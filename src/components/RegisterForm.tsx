import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase'; // Import Firestore
import { useNavigate } from 'react-router-dom';
import eyeOpen from '../assets/eyeOpen.png';
import eyeClose from '../assets/eyeClose.png';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        age: age,
        email: email,
      });
      const token = await user.getIdToken();
      console.log(token);
      console.log('User registered and info saved:', user);
      navigate('/login');
    } catch (err) {
      setError('Failed to register, please check the information provided');
      console.error('Error registering:', err);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center w-1/2 bg-transparent min-w-28">
      <div className="w-full max-w-xl p-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="relative inline-block w-full mb-6">
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-700">
            Register
          </h2>
          <span className="block w-20 h-1 mx-auto mt-1 rounded-full bg-gradient-to-r from-blue-300 to-blue-700"></span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Champ pour le pseudonyme */}
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-900"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Champ pour l'âge */}
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-900"
              htmlFor="age"
            >
              Age
            </label>
            <input
              id="age"
              type="number"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          {/* Champ pour l'e-mail */}
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-900"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Champ pour le mot de passe avec l'icône d'affichage */}
          <div className="relative mb-6">
            <label
              className="block mb-2 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="w-full h-full bg-white border rounded-lg">
              <input
                id="password"
                type={passwordVisible ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-10 focus:outline-none"
              >
                <img
                  src={passwordVisible ? eyeOpen : eyeClose}
                  alt="Toggle password visibility"
                  className="w-8 h-5"
                />
              </button>
            </div>
          </div>

          {/* Message d'erreur en cas d'échec d'inscription */}
          {error && (
            <p className="mb-4 text-center text-red-500 text-ellipsis">
              {error}
            </p>
          )}

          {/* Bouton d'inscription */}
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white rounded-lg bg-gradient-to-r from-blue-300 to-blue-900 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          {/* Lien pour aller à la page de connexion */}
          <div className="relative flex flex-row justify-between w-full mt-4 text-white">
            <p onClick={() => navigate('/login')}>
              Already have an account? Login!
            </p>
            <p onClick={() => {}}>Forget Password?</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
