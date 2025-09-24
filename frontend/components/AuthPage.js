// 'use client';
// import { useState } from 'react';
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/auth';

// export default function AuthPage() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${API_URL}/register`, { name, email, password });
//       setMessage(response.data.message);
//       alert('Registration successful! Please log in.');
//     } catch (error) {
//       setMessage(error.response.data.message);
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${API_URL}/login`, { email, password });
//       // 1. Store the JWT in localStorage
//       localStorage.setItem('token', response.data.token);
//       // 2. Redirect or update UI
//       setMessage(response.data.message);
//       alert('Login successful! Token saved to localStorage.');
//       // You would redirect the user to a dashboard here
//     } catch (error) {
//       setMessage(error.response.data.message);
//     }
//   };

//   return (
//     <div>
//       <h1>AI Escrow Resolution App</h1>
      
//       <h2>Register</h2>
//       <form onSubmit={handleRegister}>
//         <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         <button type="submit">Register</button>
//       </form>
      
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         <button type="submit">Login</button>
//       </form>
      
//       {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
//     </div>
//   );
// }