import {React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const EditUserPage = () => {
    const navigate = useNavigate()
    const [userId,setUserId] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [bio, setBio] = useState('')
    const [profilePic, setProfilePic] = useState('')

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token')
                const decoded = jwtDecode(token)
                const currentUsername = decoded.username;

                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${currentUsername}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(!response.ok) {
                    throw new Error('Failed to fetch user data')
                }

                const data = await response.json()
                const { user } = data

                setUserId(user._id)
                setName(user.name)
                setEmail(user.email)
                //setUsername(user.username)
                //setPassword(user.password)
                setBio(user.bio || '')
                setProfilePic(user.profilePic)


            } catch (error) {
                console.log('Error fetching user data!', error)
            }
        }
        fetchUserData()
    }, [])

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const decoded = jwtDecode(token)
            const username = decoded.username;

            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    email,
                    //username,
                    bio,
                    profilePic,
                    //...(password ? { password } : {})
                })
            })
            if (!response.ok) {
                throw new Error('Failed to update profile')
            }

            navigate(`/userprofile/${username}`)

        } catch (error) {
            console.log('Error updating user profile', error)
        }
    }

  return (
    <div className='min-h-screen bg-orange flex justify-center items-center p-6'>
        <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl'>
            <h1 className='text-3xl text-center font-bold mb-6'>Edit Profile</h1>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label className='block text-gray-700 font-bold mb-6'>Name</label>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='w-full px-3 py-2 border rounded-lg'
                    />
                </div>

                <div>
                    <label className='block text-gray-700 font-bold mb-6'>Email</label>
                    <input 
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full px-3 py-2 border rounded-lg'
                    />
                </div>

                {/* deleting option to change username as its causing an issue */}
                {/*<div>
                    <label className='block text-gray-700 font-bold mb-6'>Username</label>
                    <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='w-full px-3 py-2 border rounded-lg'
                    />
                </div*/}

                <div>
                    <label className='block text-gray-700 font-bold mb-6'>Bio</label>
                    <input 
                        type="text"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className='w-full px-3 py-2 border rounded-lg'
                    />
                </div>

                <div>
                    <label className='block text-gray-700 font-bold mb-6'>Profile Picture URL</label>
                    <input 
                        type="text"
                        value={profilePic}
                        onChange={(e) => setProfilePic(e.target.value)}
                        className='w-full px-3 py-2 border rounded-lg'
                    />
                </div>


                <div className='flex justify-center space-x-4'>
                    <button
                        type='submit'
                        className='bg-orange text-white px-6 py-2 rounded-lg'
                    >
                        Save Changes
                    </button>
                    <button
                        type='button'
                        onClick={() => navigate('/feed')}
                        className='bg-gray-200 text-black px-6 py-2 rounded-lg'
                    >
                        Cancel
                    </button>
                </div>
            </form>
            
        </div>
    </div>
  )
}

export default EditUserPage