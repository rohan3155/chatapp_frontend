// src/components/UserForm.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserForm = ({ onSubmit }) => {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');

  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name,email, password ,pic });
  };

  const postDetails = (file) => {
    setPicLoading(true);
    if (!file) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (file.type === "image/jpeg" || file.type === "image/png") {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "duu5xmdf1");
      fetch("https://api.cloudinary.com/v1_1/duu5xmdf1/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select Valid Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  // Handle file change event
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    postDetails(file);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[url('https://img.freepik.com/premium-photo/abstract-background-with-bright-orange-blue-ball-generative-ai_771703-47792.jpg?size=626&ext=jpg')] bg-cover">
    <form onSubmit={handleSubmit}
    className='flex flex-col w-2/4 gap-8 p-16 border border-white rounded-lg backdrop-blur-xl h-2/3 '
    >
    <h2 className='text-[2vw] text-center'>Signup</h2>
    <label htmlFor="email">Name</label>
      <input 
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setname(e.target.value)}
         className='px-2 py-2 text-black rounded-lg outline-none cursor-pointer placeholder:text-gray-600 '
      />
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
         className='px-2 py-2 text-black rounded-lg outline-none cursor-pointer placeholder:text-gray-600 '
      />
      <label htmlFor="email">Choose Profile Picture</label>
      <input 
        type="file"
        placeholder="file"
        // value={password}
        onChange={handleFileChange}
      />
      
      <button type="submit" disabled={picLoading} 
      className='self-center w-40 py-2 text-white bg-black rounded-lg' 
      >Submit</button>
      <div className="flex items-end justify-center gap-2 text-xl">
          <p>Already Have an Account?</p>
          <Link to={"/login"}>
            <p className='text-black cursor-pointer'>Login</p>
          </Link>
        </div>
    </form>
    </div>
  );
};

export default UserForm;
