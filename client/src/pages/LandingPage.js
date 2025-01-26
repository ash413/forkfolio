import {React, useState } from 'react'
import logo from "../images/logo2.png"
import { Link } from 'react-router-dom'

import { MdOutlineRestaurantMenu } from "react-icons/md";

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

  return (
    <div>
        {/* NAVBAR */}
        <div className="bg-orange">
            <nav className="flex items-center justify-between p-4">
            {/* Desktop view */}
                <div className="hidden md:flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <img src={logo} alt="Forkfolio Logo" className="h-24 w-24 rounded-full" />
                    </div>
                    <h1 className="text-6xl text-white font-bold ml-20">FORKFOLIO</h1>
                    <div className="space-x-4">
                        <Link to="/login" className="text-white text-lg font-bold mr-4">Log In</Link>
                        <Link to="/signup" className="bg-white text-lg text-orange px-4 py-2 font-bold rounded">Sign Up</Link>
                    </div>
                </div>

            {/* Mobile view */}
                <div className="md:hidden flex items-center justify-between w-full">
                    <img src={logo} alt="Forkfolio Logo" className="h-24 w-24 rounded-full mb-4" />
                    {/* Hamburger Menu Icon */}
                    <button onClick={toggleMenu} className="text-white text-3xl">
                        <MdOutlineRestaurantMenu/>
                    </button>
                </div>
            </nav>

            {/* Menu Dropdown for Mobile View */}
            { isMenuOpen && (
                <div className="md:hidden flex flex-col items-center bg-orange p-4">
                    <Link to="/login" className="text-white text-lg font-bold">Log In</Link>
                    <Link to="/signup" className="bg-white text-lg font-bold text-orange px-4 py-2 rounded mt-2">Sign Up</Link>
                    <a href="#features" className="text-white text-bold mt-4">Features</a>
                </div>
            )}
        </div>


        {/* HERO SECTION */}
        <section className="bg-orange text-white text-center py-12">
            <h1 className="text-4xl font-bold mb-4">Discover, Share, and Enjoy Recipes</h1>
            <p className="text-xl mb-6 px-2 pb-4">Join Forkfolio and connect with a community of food lovers. Save and share your favorite recipes.</p>
            <Link to="/signup" className="bg-white font-extrabold text-orange px-6 py-3 rounded-full text-2xl">GET STARTED</Link>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-50 py-16">
            <div className="container mx-auto text-center px-4">
                {/* Current Features */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-12">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-semibold mb-4">Create and Share Recipes</h3>
                            <p className="text-lg text-gray-600">Share your culinary creations with step-by-step instructions, ingredients lists, and beautiful photos. Express your cooking passion with the community.</p>
                        </div>
                        <div className="bg-white p-8 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-semibold mb-4">Personalized Recipe Collection</h3>
                            <p className="text-lg text-gray-600">Build your own collection of recipes that showcase your cooking style. Manage your recipes easily with options to edit or remove them anytime.</p>
                        </div>
                        <div className="bg-white p-8 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-semibold mb-4">Interactive Recipe Experience</h3>
                            <p className="text-lg text-gray-600">Engage with recipes through likes and explore diverse dishes shared by other food enthusiasts in your feed. Your cooking journey starts here.</p>
                        </div>
                    </div>
                </div>

                {/* Coming Soon Features */}
                <div className="pt-12 border-t border-gray-200">
                    <h2 className="text-3xl font-bold mb-12">
                    <span className="inline-block px-8 py-3 rounded-full bg-white shadow-lg border-2 border-orange/20">
                        <span className="bg-gradient-to-r from-orange to-yellow-500 text-transparent bg-clip-text">
                            Coming soon to Forkfolio!
                        </span>
                    </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-semibold mb-4">Save & Connect</h3>
                            <p className="text-lg text-gray-600">Save your favorite recipes for quick access and connect with fellow food enthusiasts. Share cooking tips and get inspired by others' culinary adventures.</p>
                        </div>
                        <div className="bg-white p-8 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-semibold mb-4">Smart Recipe Suggestions</h3>
                            <p className="text-lg text-gray-600">Get personalized recipe recommendations that match your mood and cravings. Whether you're feeling energetic or need comfort food, we'll help you find the perfect dish.</p>
                        </div>
                        <div className="bg-white p-8 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-semibold mb-4">Smart Recipe Discovery</h3>
                            <p className="text-lg text-gray-600">Let AI help you discover perfect recipes based on ingredients you already have in your kitchen. No more wasting food or last-minute grocery runs!</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Community Section */}
        <section className="bg-orange-100 py-12 m-4">
            <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Join Our Community!</h2>
            <p className="text-xl mb-12">Be part of a <span className='bg-gradient-to-r from-orange to-yellow-500 text-transparent bg-clip-text'>vibrant community</span> where food lovers come together to share recipes, stories, and more.</p>
            <Link to="/signup" className="bg-orange text-2xl text-white font-extrabold px-6 py-4 rounded-full">Join Now</Link>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto text-center">
            <p>&copy; 2025 vaishnavi kadam</p>
            <div className="mt-4">
                <a href="/privacy-policy" className="text-gray-400 mx-4">Privacy Policy</a>
                <a href="/terms-of-service" className="text-gray-400 mx-4">Terms of Service</a>
            </div>
            </div>
        </footer>
    </div>
  )
}

export default LandingPage