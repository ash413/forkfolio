import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateRecipe = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [ingredients, setIngredients] = useState([''])
    const [steps, setSteps] = useState([''])
    const [image, setImage] = useState('')

    const handleAddIngredient = () => {
        setIngredients([...ingredients, ''])
    }

    const handleAddStep = () => {
        setSteps([...steps, ''])
    }

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredients]
        newIngredients[index] = value;
        setIngredients(newIngredients)
    }

    const handleStepChange = (index, value) => {
        const newSteps = [...steps]
        newSteps[index] = value
        setSteps(newSteps)
    }


    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('https://forkfolio.onrender.com/recipe/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    ingredients: ingredients.filter( ingredient => ingredient.trim() !== '') ,
                    steps: steps.filter(step => step.trim() !== '') ,
                    image
                })
            })

            if(!response.ok){
                throw new Error('Failed to create a new recipe')
            }

            navigate('/feed')

        } catch (error) {
            console.log('Error creating new recipe!', error)
        }
    }


  return (
    <div className='min-h-screen bg-orange flex justify-center items-center p-6'>
        <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl'>
            <h1 className='text-3xl text-center font-bold mb-6'>Create New Recipe</h1>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label className='block text-gray-700 font-bold mb-2'>Recipe Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='w-full px-3 py-2 border rounded-lg'
                        required
                    />
                </div>

                <div>
                <label className='block text-gray-700 font-bold mb-2'>Image URL</label>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className='w-full px-3 py-2 border rounded-lg'
                        required
                    />
                </div>

                <div>
                    <label className='block text-gray-700 font-bold mb-2'>Ingredients</label>
                    {ingredients.map((ingredient,index) => (
                        <input
                            key={index}
                            type="text"
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                            className='w-full px-3 py-2 mb-2 border rounded-lg'
                            placeholder={`Ingredient ${index + 1}`}
                        />
                    ))}
                    <button 
                        type="button"
                        onClick={handleAddIngredient}
                        className='bg-orange text-white px-4 py-2 rounded-lg'
                    >
                        Add Ingredient
                    </button>
                </div>

                <div>
                        <label className="block text-gray-700 font-bold mb-2">Steps</label>
                        {steps.map((step, index) => (
                            <textarea
                                key={index}
                                value={step}
                                onChange={(e) => handleStepChange(index, e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg mb-2"
                                placeholder={`Step ${index + 1}`}
                                rows="2"
                            />
                        ))}
                        <button
                            type="button"
                            onClick={handleAddStep}
                            className="bg-orange text-white px-4 py-2 rounded-lg"
                        >
                            Add Step
                        </button>
                    </div>

                    <div className='flex justify-center space-x-4'>
                        <button
                            type='submit'
                            className='bg-orange text-white px-6 py-2 rounded-lg'
                        >
                            Save Recipe
                        </button>
                        <button
                            type='button'
                            onClick={(e) => navigate('/feed')}
                            className='bg-gray-200 px-6 py-2 rounded-lg'
                        >
                            Cancel
                        </button>
                    </div>

            </form>
        </div>
    </div>
  )
}

export default CreateRecipe