// App.js
import React, { useEffect, useMemo, useState } from 'react';
import { io } from "socket.io-client";
import UserController from './components/UserController';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';

import UserControllerLogin from './components/UserControllerLogin';
import Home from './Home';
import Messaging from './Messaging';

const App = () => {
 

  return (
   
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/signup" element={<UserController />} />
          <Route exact path="/login" element={<UserControllerLogin />} />
          <Route exact path="/" element={<Messaging />} />
         
        </Routes>
      </BrowserRouter>

    </div>
  );
};

export default App;
