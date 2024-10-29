import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

// Componente principal de registro de usuario
export default function SignUp() {
    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({});
    // Estado para manejar errores
    const [error, setError] = useState(null);
    // Estado para manejar el estado de carga
    const [loading, setLoading] = useState(false);
    // Hook para la navegación programática
    const navigate = useNavigate();

    // Función para manejar los cambios en los campos del formulario
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Establecer el estado de carga a verdadero
        setLoading(true);
        // Enviar una solicitud POST a la API de registro
        const res = await fetch('/api/auth/signup', 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );
        // Obtener la respuesta de la API
        const data = await res.json();
        console.log(data);
        // Manejar el caso en que la respuesta indique un error
        if(data.success === false){
          setLoading(false);
          setError(data.message);
          return;
        }
        setLoading(false);
        setError(null);
        navigate('/sign-in');

      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };
    return (
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* username */}
          <input type="text" placeholder='username' 
          className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
          {/* email */}
          <input type="email" placeholder='email' 
          className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
          {/* password */}
          <input type="password" placeholder='password' 
          className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
          {/* Botones */}
          <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Loading...' : 'Sign up'}</button>
        </form>
        <div className='flex gap-2 mt-5'>
          <p>Ya tienes una cuenta?</p>
          <Link to = {"/sign-in"}>
          <span className='text-blue-700'>Sign In</span>
          </Link>
        </div>
        {error && <p className='text-red-500 text-center'>{error}</p>}
      </div>
    )
}
