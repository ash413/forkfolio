import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import { ProtectedRoute } from './components/ProtectedRoute';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/feed' element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
        />
        < Route path='/userprofile/:username' element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
        />
      </Routes>
    </Router>
  );
}

export default App;
