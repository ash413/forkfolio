import { React, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { FaBookmark, FaHeart, FaRegHeart } from "react-icons/fa6"
import logo from '../images/logo2.png'

const BookmarkedRecipes = () => {
    const [bookmarkedRecipes, setBookmarkedRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)  // Add user state
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserAndRecipes = async() => {
            try {
                const token = localStorage.getItem('token')
                
                if(!token){
                    navigate('/login')
                    return
                }
                
                const decoded = jwtDecode(token)
                const username = decoded.username

                // Fetch user data
                const userResponse = await fetch(`/user/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user data')
                }
                const { user } = await userResponse.json()
                setUser(user)

                // Fetch bookmarked recipes
                const recipesResponse = await fetch(`/user/${username}/bookmarked`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if(!recipesResponse.ok){
                    throw new Error("Failed to fetch bookmarked recipes")
                }

                const recipes = await recipesResponse.json()
                setBookmarkedRecipes(recipes)
            } catch (error) {
                console.log("Error fetching data!", error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchUserAndRecipes()
    }, [navigate])

    const handleBookmarkToggle = async (recipeId) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`/recipe/${recipeId}/bookmark`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })

            if(!response.ok){
                throw new Error("Failed to toggle bookmark!")       
            }

            setBookmarkedRecipes(prev => prev.filter(recipe => recipe._id !== recipeId))

        } catch (error) {
            console.log("Error toggling bookmark", error)
        }
    }

    const handleLikeToggle = async(recipeId) => {
        try {
            const response = await fetch(`/recipe/${recipeId}/toggle-like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (!response.ok){
                throw new Error('Failed to toggle like')
            }
            const data = await response.json();
    
            setBookmarkedRecipes(prev => prev.map(recipe => 
                recipe._id === recipeId 
                    ? {
                        ...recipe,
                        likes: data.likes,
                        likedBy: recipe.likedBy.includes(user._id)
                            ? recipe.likedBy.filter(id => id !== user._id)
                            : [...recipe.likedBy, user._id]
                    }
                    : recipe
            ))
    
        } catch (error) {
            console.log("Error toggling like!", error)
        }
    }

    if(loading){
        return (
            <div className="min-h-screen bg-orange flex justify-center items-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-orange flex justify-center items-center">
                <div className="text-white text-xl">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-orange flex flex-col justify-center items-center p-6'>
            <Link to="/feed" className="fixed top-8 left-8 hidden md:block">
                <img src={logo} alt="Forkfolio Logo" className="w-24 h-24 rounded-full" />
            </Link>


            <div className='bg-white rounded-lg shadow-lg mb-12 p-4 md:p-12 w-full max-w-5xl'>
                <h1 className='text-3xl font-bold mb-8 text-center'>
                    Bookmarked Recipes
                </h1>

                {bookmarkedRecipes.length === 0 ? (
                    <div className='flex flex-col items-center justify-center flex-grow'>
                        <p className='text-gray-600 text-xl mb-4'>
                            No bookmarked recipes yet!
                        </p>
                        <Link 
                            to='/feed'
                            className='bg-orange text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all'
                        >
                            Explore Recipes!
                        </Link>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
                        {bookmarkedRecipes.map((recipe) => (
                            <div 
                                key={recipe._id} 
                                className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all h-full"
                            >
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-48 object-cover cursor-pointer"
                                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                                />
                                <div className="flex flex-col flex-grow p-4">
                                    <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {recipe.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-red-500">
                                            <button 
                                                onClick={() => handleLikeToggle(recipe._id)}
                                                className='flex gap-2 items-center'
                                            >
                                                {recipe.likedBy?.includes(user?._id) ? (
                                                    <FaHeart className="w-6 h-6" />
                                                ) : (
                                                    <FaRegHeart className="w-6 h-6" />
                                                )}
                                                {recipe.likes}
                                            </button>
                                        </div>
                                        <div className='flex items-center gap-2 text-orange'>
                                            <button
                                                onClick={() => handleBookmarkToggle(recipe._id)}
                                                className="flex gap-1.5 hover:text-red-500 transition-colors"
                                            >
                                                <FaBookmark className="w-5 h-5" /> {recipe.bookmarks}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/*mobile navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 md:hidden">
                <div className="flex items-center justify-center px-6 py-2">
                    <Link to="/feed">
                        <img 
                            src={logo} 
                            alt="Forkfolio Logo" 
                            className="h-10 w-10 rounded-full hover:opacity-80 transition-opacity"
                        />
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default BookmarkedRecipes