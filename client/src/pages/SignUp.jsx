import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        {/* username */}
        <input type="text" placeholder='username' 
        className='border p-3 rounded-lg' id='username'/>
        {/* email */}
        <input type="email" placeholder='email' 
        className='border p-3 rounded-lg' id='email'/>
        {/* password */}
        <input type="password" placeholder='password' 
        className='border p-3 rounded-lg' id='password'/>
        {/* Botones */}
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Sign Up</button>


      </form>
      <div className='flex gap-2 mt-5'>
        <p>Ya tienes una cuenta?</p>
        <Link to = {"/sing-in"}>
        <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>

    </div>
  )
}
