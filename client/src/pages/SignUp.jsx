import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';

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
        [e.target.id]: e.target.value.trim()

      });
    }; 

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.username || !formData.email || !formData.password) {
        return setError('Por favor llena todos los campos del formulario');
      }
      try {
        // Establecer el estado de carga a verdadero
        setLoading(true);
        setError(null);
        // Enviar una solicitud POST a la API de registro
        const res = await fetch('/api/auth/signup', 
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(formData),
          });
        // Obtener la respuesta de la API
        const data = await res.json();
        if (data.success === false) {
          return setError(data.message);
          
        }
        // console.log(data);
        setLoading(false);
        // setError(null);
        if(res.ok) {
          navigate('/sign-in');
        }

      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    return (
      <div className='ming-h-screen mt-20 '>
        <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
          {/* left side */}
          <div className='flex-1'>
          <Link
          to="/"
          className=" font-bold"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-4xl">
            Heuro
          </span>
          <span className=" text-4xl text-slate-700">Lib</span>
        </Link>
        <p className='text-sm mt-5'>
          Esto es una plataforma para conocer y buscar conjuntos de heruisticas de usabilidad/UX
        </p>
          </div>
          {/* right side */}

          <div className='flex-1'>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <div>
                <Label value='Ingresa un nombre de usuario'  />
                <TextInput
                  onChange={handleChange}
                  type='text'
                  placeholder='Usuario'
                  id='username'
                />
              </div>
              <div>
                <Label value='Ingresa tu email' onChange={handleChange} />
                <TextInput
                  onChange={handleChange}
                  type='email'
                  placeholder='Email'
                  id='email'
                />
              </div>
              <div>
                <Label value='Ingresa una contraseña' onChange={handleChange} />
                <TextInput
                  onChange={handleChange}
                  type='password'
                  placeholder='Contraseña'
                  id='password'
                />
              </div>
              <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
                {
                  loading ? (
                    <>
                    <Spinner size='sm'/>
                    <span className='pl-3'>Cargando...</span>
                    </>
                  ) : 'Registrarse'
                }
              </Button>
            </form>
            <div className='flex gap-2 text-sm mt-5'>
              <span>¿Ya tienes una cuenta?</span>
              <Link to='/sign-in' className='text-blue-500'>Inicia sesión</Link>
              
            </div>
            {
              error && (
                <Alert className='mt-5' color='failure'>
                  {error}
                </Alert>

              )
            }
          </div>
        </div>
      </div>
    )
}

