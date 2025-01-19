import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo2.png'

import { FaRegSquarePlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const Feed = () => {
  const [recipes, setRecipes] = useState([])
  const [user, setUser] = useState([])

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
        const response = await fetch('/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const userData = await response.json();
        setUser(userData);  // Set user data that includes profilePic
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className='flex flex-col md:flex-row m-4 gap-8 min-h-screen'>
      {/*side navbar*/}
      <div className='flex flex-col justify-between fixed w-24 ml-4 hidden md:flex'>
        <div className='space-y-8'>
          <div>
            <img src={logo} alt="Forkfolio Logo" className="h-24 w-24 rounded-full hover:opacity-80 transition-opacity cursor-pointer"/>
          </div>
          <div className='flex justify-center'>
            <FaRegSquarePlus className="h-8 w-8 hover:opacity-80 cursor-pointer transition-opacity mb-16"/>
          </div>
        </div>
        <Link to='/userprofile' >
          <img 
            src={user.profilePic}
            alt="User Profile"
            className='h-12 w-12 rounded-full hover:opacity-80 cursor-pointer transition-opacity ml-8 mt-96'
          />
        </Link>
      </div>

      {/*search bar plus feed of posts */}
      <div className='flex-1 md:ml-80'>
        
        {/*search */}
        <div className='relative mb-8'>
          <FaSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-orange'/>
          <input 
            type='text'
            placeholder='Search'
            className='w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 focus:outline-none focus:border-orange'
          />
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
                <p className="text-gray-500">Posted by: {recipe.postedBy.name}</p>
                <p className="text-gray-500">Likes: {recipe.likes}</p>
              </div>
            ))}
          </div>
      </div>
    </div>
  )
}

export default Feed