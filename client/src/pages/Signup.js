import { React, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate();

    const handleSignup = async(e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://forkfolio.onrender.com/auth/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, email, username, password })
            });
            const data = await response.json();
            if (response.ok){
                setMessage(data.message);
                navigate('https://forkfolio.onrender.com/login')
            } else {
                setMessage(data.message)
            }
        } catch (error) {
            setMessage('Error signing up!')
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='bg-white p-8 shadow-lg rounded-lg w-96 mx-8'>
            <h2 className='text-2xl font-bold mb-4 text-center'>Signup</h2>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2 mb-4 border rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='w-full p-2 mb-4 border rounded'
                />
                <input
                    type="username"
                    placeholder="Username"
                    value = {username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className='w-full p-2 mb-2 border rounded'
                />
                <p className='text-sm text-gray-500 mb-4 text-center'>
                    NOTE: username can't be changed once set up!!
                </p>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='w-full p-2 mb-4 border rounded'
                />
                <button type="submit" className='w-full bg-orange text-white p-2 rounded'>Signup</button>
            </form>
            <p className='text-center mt-4'>{message}</p>
            <p className='text-center mt-4'>
                Already a user? <Link to='/login' className='text-orange'>Login  here!</Link>
            </p>
        </div>
    </div>
  )
}

export default Signup