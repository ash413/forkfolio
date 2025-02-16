import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';

const AIChat = () => {
  const [ingredients, setIngredients] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) return;
  
    setIsLoading(true);
    setMessages(prev => [
      ...prev,
      { text: ingredients, isUser: true }
    ]);
  
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.REACT_APP_API_URL}/ai-suggestions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ingredients: ingredients.split(',') })
      });
  
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
  
      if (data.message) {
        setMessages(prev => [
          ...prev,
          { text: data.message, isUser: false }
        ]);
      
        if (data.newRecipe) {
          setMessages(prev => [
            ...prev,
            { text: data.newRecipe, isUser: false }
          ]);
        }
      } else {
        setMessages(prev => [
          ...prev,
          { text: "Here are some recipes you can make:", isUser: false },
          ...data.map(recipe => ({
            text: recipe.title,
            isUser: false,
            recipeId: recipe._id
          }))
        ]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { text: "Sorry, something went wrong. Please try again.", isUser: false }
      ]);
    } finally {
      setIsLoading(false);
      setIngredients('');
    }
  };
  

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-4">
      {/* Chat Header */}
      <div className="bg-white p-4 rounded-t-lg shadow-sm">
        <h1 className="text-xl font-bold text-orange">Recipe Assistant</h1>
        <p className="text-sm text-gray-500">What ingredients do you have?</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.isUser
                  ? 'bg-orange text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {msg.recipeId ? (
                <button
                  onClick={() => navigate(`/recipe/${msg.recipeId}`)}
                  className="text-left hover:underline"
                >
                  {msg.text}
                </button>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-3 rounded-lg">
              <div className="animate-pulse flex space-x-4">
                <div className="h-2 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-b-lg shadow-sm">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., chicken, tomatoes, garlic..."
            className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 bg-orange text-white rounded-lg hover:bg-orange-dark transition-colors"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;