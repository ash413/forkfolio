import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import { ProtectedRoute } from './components/ProtectedRoute';
import UserProfile from './pages/UserProfile';
import RecipePage from './pages/RecipePage';
import EditRecipePage from './pages/EditRecipePage';
import CreateRecipe from './pages/CreateRecipe';
import EditUserPage from './pages/EditUserPage';
import BookmarkedRecipes from './pages/BookmarkedRecipes';

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
        <Route path='/recipe/:id' element={
          <ProtectedRoute>
            <RecipePage />
          </ProtectedRoute>
        } 
        />
        <Route path='/edit-recipe/:id' element={
          <ProtectedRoute>
            <EditRecipePage />
          </ProtectedRoute>
        }
        />
        <Route path='/create-recipe' element={
          <ProtectedRoute>
            <CreateRecipe />
          </ProtectedRoute>
        }
        />
        <Route path='/edit-user/:username' element={
          <ProtectedRoute>
            <EditUserPage />
          </ProtectedRoute>
        } 
        />
        <Route path='/bookmarks' element={
          <ProtectedRoute>
            <BookmarkedRecipes />
          </ProtectedRoute>
        }
        />
      </Routes>
    </Router>
  );
}

export default App;
