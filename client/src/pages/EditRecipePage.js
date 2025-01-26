import { React, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditRecipePage = () => {

    const { id } = useParams()
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null)
    const [title, setTitle] = useState('')
    const [ingredients, setIngredients] = useState([])
    const [steps, setSteps] = useState([])
    const [image, setImage] = useState('')

    useEffect(() => {
        const fetchRecipe = async() => {
            const token = localStorage.getItem('token')
            const response = await fetch(`https://forkfolio.onrender.com/recipe/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()

            setRecipe(data)
            setTitle(data.title)
            setIngredients(data.ingredients)
            setSteps(data.steps)
            setImage(data.image)
        }
        fetchRecipe()
    }, [id])

    const handleSave = async() => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`https://forkfolio.onrender.com/recipe/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title, ingredients, steps, image
                })
            })
            if (!response.ok) {
                throw new Error('Update Failed!')
            }

            navigate(`/recipe/${id}`) 
        } catch (error) {
            console.log('Update error', error)
        }
    }



  return (
    <div className='min-h-screen bg-orange flex justify-center p-6'>
        <div className='bg-white p-8 rounded-lg w-full max-w-2xl'>
            <h1 className='text-2xl font-bold mb-6'>Edit Recipe</h1>

            <div className='mb-4'>
                <label className='block mb-2'>Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='w-full border p-2 rounded'
                />
            </div>

            <div className='mb-4'>
                <label className='block mb-2'>Ingredients (comma-separated) </label>
                <textarea 
                    value={ingredients.join(', ')}
                    onChange={(e) => setIngredients(e.target.value.split(', '))}
                    className='w-full border p-2 rounded'
                    placeholder="Enter ingredients separated by commas"
                />
            </div>

            <div className='mb-4'>
                <label className='block mb-2'>Steps (one per line) </label>
                <textarea
                    value={steps.join('\n')}
                    onChange={(e) => setSteps(e.target.value.split('\n'))}
                    className='w-full border p-2 rounded'
                    placeholder="Enter steps, one per line"
                />
            </div>

            <div className='mb-4'>
                <label className='block mb-2'>Image</label>
                <input 
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className='w-full border p-2 rounded'
                />
            </div>

            <div className='flex justify-center space-x-4'>
                <button
                    onClick={handleSave}
                    className='bg-orange text-white px-4 py-2 rounded'
                >
                    Save Changes
                </button>
                <button
                    type='button'
                    onClick={(e) => navigate(`/recipe/${recipe._id}`)}
                    className='bg-gray-200 px-6 py-2 rounded-lg'
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
  )
}

export default EditRecipePage