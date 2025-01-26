import { React, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo2.png'

import { FaRegSquarePlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

import { jwtDecode } from 'jwt-decode';

import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const Feed = () => {
  const [recipes, setRecipes] = useState([])
  const [user, setUser] = useState(null)

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate()

  //fetching recipes from backed
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('https://forkfolio.onrender.com/feed', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        })
        if (!response.ok){
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error); 
      }
    }
    fetchRecipes();
  }, [])




  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token)
        const username = decoded.username

        const response = await fetch(`https://forkfolio.onrender.com/user/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { user } = await response.json();
        setUser(user);  
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);






  //searching database for users during searching for a user
  useEffect(() => {
    if(searchQuery.trim() === ''){
      setSearchResults([])  // This clears the results
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`https://forkfolio.onrender.com/search?query=${searchQuery}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if(!response.ok) {
          throw new Error("Failed to fetch results")
        }
        const results = await response.json();
        setSearchResults(results);
      } catch (error) {
        console.log("Error fetching search results: ", error)
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);




  const handleSearchClick = (username) => {
    navigate(`https://forkfolio.onrender.com/userprofile/${username}`);
  };


  const handleLikeToggle = async(recipeId) => {
    try {
      const response = await fetch(`https://forkfolio.onrender.com/recipe/${recipeId}/toggle-like`, {
        method: 'POST',
        headers: {
          'Authorization' : `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok){
        throw new Error('Failed to toggle like')
      }
      const data = await response.json();

      setRecipes(recipes.map(recipe => 
        recipe._id === recipeId 
          ? { 
              ...recipe, 
              likes: data.likes,
              likedBy: recipe.likedBy.includes(user._id) 
                ? recipe.likedBy.filter(id => id !== user._id)
                : [...recipe.likedBy, user._id]
            }
          : recipe
      ));
    } catch (error) {
      console.log("Error toggling like!", error)
    }
  }

  return (
    <div className='flex flex-col min-h-screen md:flex-row'>
      {/* Mobile Search Bar - Fixed at top */}
      <div className='fixed top-0 left-0 right-0 p-4 bg-white z-10 md:hidden'>
        <div className='relative'>
          <FaSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-orange'/>
          <input 
            type='text'
            placeholder='Search'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 focus:outline-none focus:border-orange'
          />
          {searchResults.length > 0 && searchQuery.trim() !== '' && (
            <div className='absolute left-0 right-0 bg-white border border-gray-200 mt-2 rounded-lg'>
              {searchResults.map((user) => (
                <div 
                  key={user._id} 
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSearchClick(user.username)}
                >
                  {user.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    {/* Desktop Sidebar */}
    <nav className="fixed px-4 top-0 h-full w-48 hidden md:flex border-r border-white">
      <div className="flex flex-col justify-between w-full py-6">
        <div className="flex flex-col items-center space-y-12">
          <Link to='https://forkfolio.onrender.com/feed'>
            <img 
              src={logo} 
              alt="Forkfolio Logo" 
              className="w-24 h-24 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
            />
          </Link>
          <div 
            onClick={() => navigate('https://forkfolio.onrender.com/create-recipe')} 
          >
            <FaRegSquarePlus
              className="h-8 w-8 hover:scale-105 cursor-pointer"/>
          </div>
        </div>
        
        {user && (
          <Link 
            to={`https://forkfolio.onrender.com/userprofile/${user.username}`}
            className="flex flex-col items-center space-y-2"
          >
            <img 
              src={user.profilePic || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'}
              alt="User Profile"
              className="h-16 w-16 rounded-full hover:opacity-80 cursor-pointer transition-opacity"
            />
          </Link>
        )}
      </div>
    </nav>

    {/* Mobile Bottom Navigation */}
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-between px-8 md:hidden">
      <Link to='https://forkfolio.onrender.com/feed'>
        <img 
          src={logo} 
          alt="Forkfolio Logo" 
          className="h-10 w-10 rounded-full hover:scale-105 cursor-pointer"
        />
      </Link>
      <FaRegSquarePlus onClick={() => navigate('https://forkfolio.onrender.com/create-recipe')} className="h-6 w-6 hover:opacity-80 cursor-pointer transition-opacity"/>
      {user && (
        <Link to={`https://forkfolio.onrender.com/userprofile/${user.username}`}>
          <img 
            src={user.profilePic || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'}
            alt="User Profile"
            className="h-10 w-10 rounded-full hover:opacity-80 cursor-pointer transition-opacity"
          />
        </Link>
      )}
    </nav>



      {/*search bar plus feed of posts */}
      <div className='bg-orange flex-1 md:pl-56 md:pr-8 md:pt-4'>
        
        {/*search */}
        <div className='relative mb-8 hidden md:block'>
          <FaSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-orange'/>
          <input 
            type='text'
            placeholder='Search'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 focus:outline-none focus:border-orange'
          />
          {searchResults.length > 0 && searchQuery.trim() !== '' && (
            <div className='absolute left-0 right-0 bg-white border border-gray-200 mt-2 rounded-lg'>
              {searchResults.map((user) => (
                <div 
                  key={user._id} 
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSearchClick(user._id)}
                >
                  {user.name}
                  </div>
              ))}
            </div>
          )}
        </div>

        {/* recipes feed */}
        <div className="mt-24 mb-20 mx-4 md:mt-0 md:mb-0 md:grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="p-2 bg-white rounded-lg shadow-md mb-4 md:mb-0 cursor-pointer hover:scale-105">
                <img 
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-40 object-cover rounded-lg"
                  onClick={()=> navigate(`https://forkfolio.onrender.com/recipe/${recipe._id}`)}
                />
                <h2 className="mt-4 text-base font-bold">{recipe.title}</h2>
                <div className='flex justify-between items-center'>
                  <p className="text-sm text-gray-500">{recipe.postedBy.name}</p>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleLikeToggle(recipe._id)}
                      className="focus:outline-none text-red-500"
                    >
                      {recipe.likedBy?.includes(user?._id) ? (
                        <FaHeart className="w-4 h-4" />
                      ) : (
                        <FaRegHeart className="w-4 h-4" />
                      )}
                    </button>
                    <span className="text-sm text-gray-500">{recipe.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  )
}

export default Feed