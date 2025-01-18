import {React, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok){
                setMessage(data.message);
                localStorage.setItem('token', data.token)
                navigate('/feed')
            } else{
                setMessage(data.message)
            }
        } catch (error) {
            setMessage('Error logging in!');
        }
    }


  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='bg-white p-8 shadow-lg rounded-lg w-96 mx-8'>
            <h2 className='text-2xl font-bold mb-4 text-center'>Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type = "email"
                    placeholder = "Email"
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 mb-4 border rounded"
                />
                <input 
                    type = "password"
                    placeholder = "Password"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 mb-4 border rounded"
                />
                <button type="Submit" className='w-full bg-orange text-white p-2 rounded'>Login</button>
            </form>
            <p className='text-center mt-4'>{message}</p>
            <p className='text-center mt-4'>
                Not a user? <Link to='/signup' className='text-orange'>Sign up now!</Link>
            </p>
        </div>
    </div>
  )
}

export default Login