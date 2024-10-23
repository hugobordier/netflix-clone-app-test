import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import eyeOpen from '../assets/eyeOpen.png';
import eyeClose from '../assets/eyeClose.png';

const LoginForm = () => {
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
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError('Invalid email or password');
      console.error('Error signing in:', err);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center w-1/2 bg-transparent min-w-28">
      <div className="w-full max-w-xl p-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="relative inline-block w-full mb-6">
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-700">
            Login
          </h2>
          <span className="block w-20 h-1 mx-auto mt-1 rounded-full bg-gradient-to-r from-blue-300 to-blue-700"></span>
        </div>

        <form onSubmit={handleSubmit}>
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
          {error && (
            <p className="mb-4 text-center text-red-500 text-ellipsis">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white rounded-lg bg-gradient-to-r from-blue-300 to-blue-900 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Logging in' : 'Login'}
          </button>
          <div className="relative flex flex-row justify-between w-full mt-4 text-white">
            <p className="cursor-pointer" onClick={() => navigate('/register')}>
              No Account ? Sign in !
            </p>
            <p className="cursor-pointer" onClick={() => {}}>
              Forget Password ?
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
