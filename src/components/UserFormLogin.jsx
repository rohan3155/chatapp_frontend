// src/components/UserFormLogin.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserFormLogin = ({ onSubmit }) => {

  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };



  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[url('https://img.freepik.com/premium-photo/abstract-background-with-bright-orange-blue-ball-generative-ai_771703-47792.jpg?size=626&ext=jpg')] bg-cover">
      <form onSubmit={handleSubmit} className='flex flex-col w-2/4 gap-8 p-16 border border-white rounded-lg backdrop-blur-xl h-2/3 '>
        <h2 className='text-[2vw] text-center'>Login</h2>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          className='px-2 py-2 text-black rounded-lg outline-none cursor-pointer placeholder:text-gray-600 '
        />
        <label htmlFor="email">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='px-2 py-2 text-black rounded-lg outline-none cursor-pointer placeholder:text-gray-600 h'
        />
        <button type="submit" className='self-center w-40 py-2 text-white bg-black rounded-lg'  >Submit</button>
        <div className="flex items-end justify-center gap-2 text-xl">
          <p>Dont Have Account?</p>
          <Link to={"/signup"}>
            <p className='text-black cursor-pointer'>Signup</p>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default UserFormLogin;
