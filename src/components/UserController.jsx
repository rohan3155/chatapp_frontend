import React, { useState } from 'react';
import axios from 'axios';
import UserForm from './UserForm';
import { useNavigate } from 'react-router-dom';



const UserController = () => {
  const navigate = useNavigate();
 const [message, setMessage] = useState('');

  const createUser = async (data) => {
    console.log(data)
    try {
      const response = await axios.post('http://localhost:3000/api/user', data);
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
    <div>
      <UserForm onSubmit={createUser} />
      <p>{message}</p>
    </div>
  );
};

export default UserController;
