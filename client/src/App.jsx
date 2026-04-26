import React from 'react'
import { BrowserRouter as Router, Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import Home from './Pages/Home'
import { use } from 'react';
import useGetCurrentUser from './hooks/useGetCurrentUser';
import { useSelector } from 'react-redux';
export const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
import Dashboard from './Pages/Dashboard';
import Generate from './Pages/Generate';

const App = () => {
  useGetCurrentUser();
  const { userData } = useSelector((state) => state.user);
  return (
    <BrowserRouter
>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={userData ? <Dashboard /> : <Home />} />
        <Route path='/generate' element={userData ? <Generate /> : <Home />} />

      </Routes>
</BrowserRouter>  )
}

export default App