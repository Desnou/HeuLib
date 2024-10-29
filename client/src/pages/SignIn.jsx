import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

// Componente principal de registro de usuario
export default function SignIn() {
    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({});
    // Hook para acceder al estado de Redux
    const { loading, error } = useSelector((state) => state.user);
    // Hook para la navegación programática
    const navigate = useNavigate();
    // Hook para despachar acciones de Redux
    const dispatch = useDispatch();

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
        
        // Despachar la acción de inicio de sesión
        dispatch(signInStart());
        // Enviar una solicitud POST a la API de registro
        const res = await fetch('/api/auth/signin', 
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
          // Despachar la acción de fallo de inicio de sesión
          dispatch(signInFailure(data.message));
          return;
        }
        // Despachar la acción de éxito de inicio de sesión
        dispatch(signInSuccess(data));
        navigate('/');

      } catch (error) {
        // Despachar la acción de fallo de inicio de sesión
        dispatch(signInFailure(error.message));
      }
    };
    return (
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          
          {/* email */}
          <input type="email" placeholder='email' 
          className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
          {/* password */}
          <input type="password" placeholder='password' 
          className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
          {/* Botones */}
          <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Loading...' : 'Sign in'}
          </button>
          <OAuth />
        </form>
        <div className='flex gap-2 mt-5'>
          <p>No tienes una cuenta?</p>
          <Link to = {"/sign-up"}>
          <span className='text-blue-700'>Registrarse</span>
          </Link>
        </div>
        {error && <p className='text-red-500 text-center'>{error}</p>}
      </div>
    )
}
