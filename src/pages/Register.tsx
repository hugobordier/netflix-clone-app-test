import bg from '../assets/bg2.jpeg';
import logo from '../assets/logo.png';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  return (
    <div className="relative w-screen h-full min-h-screen overflow-x-hidden">
      <div
        className="fixed top-0 left-0 w-full h-full bg-center bg-cover blur-sm"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>
      <div className="relative flex flex-col items-center justify-center min-h-screen min-w-screen ">
        <img src={logo} alt="Logo" className="w-1/2 max-w-xl" />
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
