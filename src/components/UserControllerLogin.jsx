import React, { useState } from 'react';
import axios from 'axios';
import UserForm from './UserForm';
import { useNavigate } from 'react-router-dom';

import UserFormLogin from './UserFormLogin';
import bg from "../assets/bg.png"

const UserControllerLogin = () => {
  const navigate = useNavigate();
 const [message, setMessage] = useState('');

  const createUser = async (data) => {
    console.log(data)
    try {
      const response = await axios.post('http://localhost:3000/api/user/login', data);
      // navigate('/login');
      // setMessage(response.data);
      if(response.data.token){
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        navigate('/');
      }
      console.log(response.data)
      console.log(response.status)
    } catch (error) {
      setMessage('Error creating user');
    }
  };

  return (
    <div className={`bg-[url(${bg})]  `}>
      <UserFormLogin onSubmit={createUser} />
      <p>{message}</p>
    </div>
  );
};

export default UserControllerLogin;
