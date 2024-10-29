import { useState } from 'react';
import axios from 'axios';

const Test = () => {
  const [message, setMessage] = useState('');

  const send = async (message: string) => {
    axios.post('/');
  };

  return (
    <div>
      alo
      <form
        onSubmit={(e) => {
          console.log(message);
          e.preventDefault();
          return false;
        }}
      >
        <input
          className="text-white bg-black"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="oui"
          required
        ></input>
        <button type="submit">test</button>
      </form>
    </div>
  );
};

export default Test;
