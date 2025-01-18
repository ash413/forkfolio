import { React, useState } from 'react'

const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleSignup = async(e) => {
        e.preventDefault();
        try {
            const response = await fetch('/auth/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            if (response.ok){
                setMessage(data.message);
            } else {
                setMessage(data.message)
            }
        } catch (error) {
            setMessage('Error signing up!')
        }
    }

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
      <p>{message}</p>
    </div>
  )
}

export default Signup