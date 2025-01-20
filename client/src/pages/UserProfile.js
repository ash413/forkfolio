import {React, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import logo from '../images/logo2.png'
import { Link } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa6'

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null)
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/user/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(!response.ok){
          throw new Error('User profile not found!')
        }
        const data = await response.json()
        setUser(data.user)
        setRecipes(data.recipes)

      } catch (error) {
        console.log("Error fetching user profile: ", error)
      }
    }
    fetchUserProfile()
  }, [username])

  if (!user) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className='relative max-w-7xl mx-auto p-6 mb-20 md:mb-6'>
      {/* Desktop Logo - hidden on mobile */}
      <div className="absolute top-6 left-6 hidden md:block">
        <Link to='/feed'>
          <img 
            src={logo} 
            alt="Forkfolio Logo" 
            className="w-16 h-16 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
          />
        </Link>
      </div>

      {/*profile hewader */}
      <div className='flex flex-col items-center mb-6'>
        <img
          src={user.profilePic || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'}
          alt={`${user.username}'s profile`}
          className="w-28 h-28 rounded-full border-4 border-gray-200 mb-4"
        />
        <h2 className='text-3xl font-semibold'>{user.username}</h2>
        <p className='text-gray-500'>{user.bio}</p>
      </div>

      {/*recipe section / user personal; posts */}
      <div className="bg-orange p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Recipes</h3>
        {recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="bg-white p-2 rounded-lg shadow-md">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="text-lg font-semibold mb-2">{recipe.title}</h4>
                <p className="text-sm text-gray-500">{recipe.description}</p>
                <p className="flex items-center gap-1 focus:outline-none text-red-500">
                  <FaHeart /> {recipe.likes}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No recipes yet.</p>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-between px-8 md:hidden">
        <Link to='/feed'>
          <img 
            src={logo} 
            alt="Forkfolio Logo" 
            className="h-10 w-10 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
          />
        </Link>
        {/* Add other mobile navigation items if needed */}
        {user && (
          <img 
            src={user.profilePic || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'}
            alt="User Profile"
            className="h-10 w-10 rounded-full hover:opacity-80 cursor-pointer transition-opacity"
          />
        )}
      </nav>
    </div>
  )
}

export default UserProfile