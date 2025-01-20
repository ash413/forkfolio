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
        const response = await fetch('/feed', {
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
        const userId = decoded.id

        const response = await fetch(`/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userData = await response.json();
        setUser(userData);  // Set user data that includes profilePic
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
        const response = await fetch(`/search?query=${searchQuery}`, {
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




  const handleSearchClick = (userId) => {
    navigate(`/userprofile/${userId}`);
  };


  const handleLikeToggle = async(recipeId) => {
    try {
      const response = await fetch(`/recipe/${recipeId}/toggle-like`, {
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
    <div className='flex flex-col md:flex-row m-4 gap-8 min-h-screen'>
      {/*side navbar*/}
      <div className='flex flex-col justify-between fixed w-24 ml-4 hidden md:flex'>
        <div className='space-y-8'>
          <div>
            <img src={logo} alt="Forkfolio Logo" className="h-24 w-24 mb-48 ml-4 rounded-full hover:opacity-80 transition-opacity cursor-pointer"/>
          </div>
          <div className='flex justify-center'>
            <FaRegSquarePlus className="h-8 w-8 ml-6 hover:opacity-80 cursor-pointer transition-opacity"/>
          </div>
        </div>
          {user && (  // Only render this when user is not null
            <Link to={`/userprofile/${user._id}`}>
              <img 
                src={user.profilePic || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'}
                alt="User Profile"
                className='h-12 w-12 rounded-full hover:opacity-80 cursor-pointer transition-opacity ml-8 mt-72'
              />
            </Link>
          )}
      </div>

      {/*search bar plus feed of posts */}
      <div className='flex-1 md:ml-80'>
        
        {/*search */}
        <div className='relative mb-8'>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="p-4 bg-white rounded-lg shadow-md">
                <img 
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h2 className="mt-4 text-lg font-bold">{recipe.title}</h2>
                <div className='flex justify-between items-center'>
                  <p className="text-gray-500">{recipe.postedBy.name}</p>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleLikeToggle(recipe._id)}
                      className="focus:outline-none text-red-500"
                    >
                      {recipe.likedBy?.includes(user?._id) ? (
                        <FaHeart className="w-5 h-5" />
                      ) : (
                        <FaRegHeart className="w-5 h-5" />
                      )}
                    </button>
                    <span className="text-gray-500">{recipe.likes}</span>
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