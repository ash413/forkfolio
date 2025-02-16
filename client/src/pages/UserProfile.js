import {React, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../images/logo2.png'
import { Link } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa6'
import { FaBookmark } from 'react-icons/fa6'


import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { MdLogout } from "react-icons/md";

import { MdEdit } from "react-icons/md";
import { jwtDecode } from 'jwt-decode'


const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate()

  const [isDeleteModalOpen, setIsDeleteModalOpen ] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText ] = useState('')
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState('')

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const decoded = jwtDecode(token)
        const loggedInUsername = decoded.username;

        const [profileResponse, currentUserResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/user/${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.REACT_APP_API_URL}/user/${loggedInUsername}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!profileResponse.ok || !currentUserResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const profileData = await profileResponse.json();
        const currentUserData = await currentUserResponse.json();

        setUser(profileData.user);
        setCurrentUser(currentUserData.user);
        setRecipes(profileData.recipes);

      } catch (error) {
        console.log("Error fetching user profile: ", error)
      }
    }
    fetchUserProfile()
  }, [username])


  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }


  if (!user || !currentUser) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  const handleDelete = async() => {
    if(deleteConfirmText.trim() !== user.username) return

    setIsDeleting(true)
    setError(null)

    try {
        const token = localStorage.getItem('token')
        if(!token){
          throw new Error("No authentication token found!")
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${username}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!response.ok) {
            throw new Error('Failed to delete user')
        }
        localStorage.removeItem('token')
        navigate(`/`)
    } catch (error) {
        console.log('Error deleting user', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const isCurrentUserProfile = currentUser.username === username;

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => navigate('/feed')}
          className="mt-4 text-orange hover:underline"
        >
          Return to Feed
        </button>
      </div>
    )
  }

  return (
    <div className='relative max-w-7xl mx-auto p-6 mb-20 md:mb-6'>
      {/* Desktop Logo - hidden on mobile */}
      <div className="absolute top-6 left-6 hidden md:block">
        <Link to='/feed'>
          <img 
            src={logo} 
            alt="Forkfolio Logo" 
            className="w-16 h-16 rounded-full hover:opacity-80 transition-opacity cursor-pointer "
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
        <p className='text-gray-500 py-4'>{user.bio}</p>
      </div>

      {/* edit user and delete user buttons below */}
      {isCurrentUserProfile && (
        <div className='flex flex-col items-center w-full max-w-sm mx-auto mb-20'>
        <div className='flex items-center space-x-4 pb-4'>
          <button
            onClick={() => navigate(`/edit-user/${username}`)} 
            className='flex items-center gap-1 border rounded-lg px-3 py-1 border-orange text-orange hover:shadow-md md:hover:scale-105 active:scale-105 transition-all'
          >
            <FaEdit />
            <p>Edit user</p>
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)} 
            className='flex items-center gap-1 border text-orange rounded-lg px-3 py-1 border-orange hover:shadow-md md:hover:scale-105 active:scale-105 transition-all'
          >
            <MdDelete />
            <p>Delete user</p>
          </button>
        </div>
        <div className='flex items-center justify-center'>
          <button
            onClick={handleLogout}
            className='flex items-center gap-1 border text-orange rounded-lg px-3 py-1 border-orange hover:shadow-md md:hover:scale-105 active:scale-105 transition-all'
          >
            <MdLogout />
            <p>Logout</p>
          </button>
        </div>
      </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Delete Account</h2>
            <p className="text-red-600 mb-4">Warning: This action cannot be undone!</p>
            <p>Type <strong>"{user.username}"</strong> to confirm deletion:</p>
            <input 
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full border p-2 mt-2"
              placeholder="Enter username to confirm"
            />
            {error && (
              <p className="text-red-500 mt-2">{error}</p>
            )}
            <div className="flex gap-2 mt-4">
              <button 
                onClick={handleDelete}
                disabled={deleteConfirmText.trim() !== user.username || isDeleting}
                className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setError(null)
                  setDeleteConfirmText('')
                }}
                className="bg-gray-200 text-black px-4 py-2 rounded"
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    

      {/*recipe section / user personal; posts */}
      <div className="bg-orange p-6 rounded-lg shadow-md relative">
        {isCurrentUserProfile && (
          <button
            onClick={() => navigate('/create-recipe')}  
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-4 border border-orange flex items-center justify-center hover:shadow-md hover:scale-105 transition-all"
          >
            <MdEdit className='text-orange h-8 w-8'/>
          </button>
        )}
        <h3 className="text-2xl font-semibold mb-6">Recipes</h3>
        {recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="bg-white p-2 rounded-lg shadow-md md:hover:scale-105 active:scale-105 transition-transform">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onClick={()=> navigate(`/recipe/${recipe._id}`)}
                />
                <h4 className="text-lg font-semibold mb-2">{recipe.title}</h4>
                <p className="text-sm text-gray-500">{recipe.description}</p>
                <div className='flex justify-between items-center'>
                  <p className="flex items-center gap-1 focus:outline-none text-red-500">
                    <FaHeart /> {recipe.likes}
                  </p>
                  <p className='flex items-center gap-1 focus:outline-none text-orange'>
                    <FaBookmark /> {recipe.bookmarks}
                  </p>
                </div>
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