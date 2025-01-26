import {React, useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import logo from '../images/logo2.png'
import { jwtDecode } from 'jwt-decode';


const RecipePage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [recipe, setRecipe] = useState(null)
    const [user, setUser] = useState(null)
    const [isLiked, setIsLiked] = useState(false)

    const [isDeleteModalOpen, setIsDeleteModalOpen ] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText ] = useState('')

    useEffect(() => {
        const fetchData = async() => {
            try {
                const token = localStorage.getItem('token')
                const decoded = jwtDecode(token)
                const username = decoded.username

                const [recipeResponse, userResponse] = await Promise.all([
                    fetch(`https://forkfolio.onrender.com/recipe/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`https://forkfolio.onrender.com/user/${username}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (!recipeResponse.ok || !userResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const recipeData = await recipeResponse.json();
                const userData = await userResponse.json();

                setRecipe(recipeData);
                setUser(userData.user);
                setIsLiked(recipeData.likedBy.includes(userData.user._id));

            } catch (error) {
                console.error('Error fetching data', error);
            }
        }

        fetchData();
    }, [id])




    
    const handleLikeToggle = async() => {
        try {
            const response = await fetch(`https://forkfolio.onrender.com/recipe/${id}/toggle-like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (!response.ok){
                throw new Error('Failed to toggle like')
            }
            const data = await response.json();
    
            setRecipe(prevRecipe => ({
                ...prevRecipe,
                likes: data.likes,
                likedBy: data.likedBy
            }));
            setIsLiked(prevIsLiked => !prevIsLiked);
    
        } catch (error) {
            console.log("Error toggling like!", error)
        }
    }



    if (!recipe) {
        return <div>Loading...</div>; // Loading state
    }



    const handleDelete = async() => {
        if(deleteConfirmText.trim() !== recipe.title) return

        try {
            const token = localStorage.getItem('token')

            const response = await fetch(`https://forkfolio.onrender.com/recipe/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (!response.ok) {
                throw new Error('Failed to delete recipe')
            }
            navigate(`https://forkfolio.onrender.com/feed`)
        } catch (error) {
            console.log('Error deleting post', error)
        }
    }


    const isRecipeOwner = user && recipe && user._id === recipe.postedBy._id


    return (
        <div className="min-h-screen bg-orange flex flex-col justify-center items-center p-6">

            {/* Mobile Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 md:hidden">
                <div className="flex items-center justify-center px-6 py-2">
                    <Link to="https://forkfolio.onrender.com/feed">
                    <img 
                        src={logo} 
                        alt="Forkfolio Logo" 
                        className="h-10 w-10 rounded-full hover:opacity-80 transition-opacity"
                    />
                    </Link>
                </div>
            </div>

            {/* Hide default top logo on mobile */}
            <Link to="https://forkfolio.onrender.com/feed" className="fixed top-8 left-8 hidden md:block">
                <img src={logo} alt="Forkfolio Logo" className="w-24 h-24 rounded-full" />
            </Link>

            <div className="bg-white rounded-lg shadow-lg p-6 w-full mb-12 max-w-2xl">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                />
                
                <h1 className="text-3xl text-center font-bold mb-4">{recipe.title}</h1>
                
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
                    <p className="text-gray-700">{recipe.ingredients.join(', ')}</p>
                </div>
                
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Steps</h3>
                    <ol className="list-decimal list-inside text-gray-700">
                        {recipe.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    {recipe.postedBy && (
                        <Link 
                            to={`https://forkfolio.onrender.com/userprofile/${recipe.postedBy.username}`}
                            className="flex flex-col items-center space-y-2"
                        >
                        <img
                            src={recipe.postedBy.profilePic || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'}
                            alt="User Profile"
                            className="h-8 w-8 rounded-full"
                        />
                        </Link>
                    )}
                        <p className="text-gray-500">{recipe.postedBy.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleLikeToggle}
                            className="text-red-500"
                        >
                            {isLiked ? <FaHeart className="w-6 h-6" /> : <FaRegHeart className="w-6 h-6" />}
                        </button>
                        <p className="text-gray-500">{recipe.likes}</p>
                    </div>
                </div>
            </div>

            {isRecipeOwner && (
                <div className="w-full max-w-2xl mx-auto mt-4 flex justify-center gap-2">
                    <button 
                        onClick={() => navigate(`https://forkfolio.onrender.com/edit-recipe/${id}`)}
                        className="bg-white text-orange px-4 py-2 rounded-lg"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="bg-white text-orange px-4 py-2 rounded-lg"
                    >
                        Delete
                    </button>
                </div>
            )} 

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Delete Recipe</h2>
                        <p>Type <strong>"{recipe.title}"</strong> to confirm deletion:</p>
                        <input 
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className="w-full border p-2 mt-2"
                        />
                        <div className="flex gap-2 mt-4">
                            <button 
                                onClick={handleDelete}
                                disabled={deleteConfirmText.trim() !== recipe.title}
                                className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                Confirm Delete
                            </button>
                            <button 
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="bg-gray-200 text-black px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RecipePage