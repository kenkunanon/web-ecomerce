import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      return alert('Passwords do not match')
    }
    console.log(form)
    try {
      const res = await axios.post('http://localhost:5000/api/register', form)
      console.log(res)
      toast.success(res.data)
    }
    catch (err) {
      const errMsg = err.response?.data
      toast.error(errMsg || 'An error occurred')
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-tech-pattern"></div>
      <div className="relative w-full max-w-md p-8 bg-gray-800 bg-opacity-90 shadow-lg rounded-lg border border-green-500">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glow-effect"></div>
        </div>
        <h2 className="relative text-3xl text-center my-4 font-bold text-white">Register</h2>
        <form onSubmit={handleSubmit} className="relative space-y-4">
          <div>
            <label className="block text-gray-300">Email</label>
            <input 
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              onChange={handleChange} 
              name='email' 
              type='email' 
            />
          </div>
          <div>
            <label className="block text-gray-300">Password</label>
            <input 
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              onChange={handleChange} 
              name='password' 
              type='password' 
            />
          </div>
          <div>
            <label className="block text-gray-300">Confirm Password</label>
            <input 
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              onChange={handleChange} 
              name='confirmPassword' 
              type='password' 
            />
          </div>
          <button 
            className="w-full py-2 rounded bg-green-500 text-white font-bold shadow-lg hover:bg-green-700 transition-all"
          >
            Register
          </button>
        </form>
      </div>
      <style jsx>{`
        .bg-tech-pattern {
          background: linear-gradient(90deg, rgba(0, 255, 0, 0.2) 1px, transparent 1px),
                      linear-gradient(rgba(0, 255, 0, 0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px),
                      linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px);
          background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
          background-position: 0 0, 25px 25px, 0 0, 5px 5px;
          animation: neon-grid 2s linear infinite;
        }

        @keyframes neon-grid {
          0% {
            background-position: 0 0, 25px 25px, 0 0, 5px 5px;
          }
          100% {
            background-position: 50px 50px, 75px 75px, 10px 10px, 15px 15px;
          }
        }

        .glow-effect {
          width: 100%;
          height: 100%;
          border: 2px solid rgba(0, 255, 0, 0.5); /* Green glow effect */
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.5), 0 0 40px rgba(0, 255, 0, 0.5), 0 0 60px rgba(0, 255, 0, 0.5); /* Green glow effect */
          animation: glow-green 1.5s infinite alternate;
        }

        @keyframes glow-green {
          from {
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.5), 0 0 40px rgba(0, 255, 0, 0.5), 0 0 60px rgba(0, 255, 0, 0.5); /* Green glow effect */
          }
          to {
            box-shadow: 0 0 40px rgba(0, 255, 0, 0.8), 0 0 80px rgba(0, 255, 0, 0.8), 0 0 120px rgba(0, 255, 0, 0.8); /* Green glow effect */
          }
        }
      `}</style>
    </div>
  )
}

export default Register;