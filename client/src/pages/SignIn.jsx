import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

// Componente principal de registro de usuario
export default function SignIn() {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({});
  
  const { loading, error } = useSelector((state) => state.user);
  // Hook para la navegación programática
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Restablecer el estado de error al montar el componente
  useEffect(() => {
    dispatch(signInFailure(null));
  }, [dispatch]);

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInFailure(null)); // Restablecer el estado de error al enviar el formulario
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Por favor llena todos los campos del formulario"));
    }
    try {
      dispatch(signInStart());
      // Enviar una solicitud POST a la API de registro
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      // Obtener la respuesta de la API
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(`${data.message}`));
        console.log(data.message);
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="ming-h-screen mt-20 ">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left side */}
        <div className="flex-1">
          <Link to="/" className=" font-bold">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-4xl">
              Heuristics
            </span>
            <span className=" text-4xl text-slate-700">Lib</span>
          </Link>
          <p className="text-sm mt-5">
            Esto es una plataforma para conocer y buscar conjuntos de
            heruisticas de usabilidad/UX
          </p>
        </div>
        {/* right side */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Ingresa tu email" onChange={handleChange} />
              <TextInput
                onChange={handleChange}
                type="email"
                placeholder="Email"
                id="email"
              />
            </div>
            <div>
              <Label value="Ingresa tu contraseña" onChange={handleChange} />
              <TextInput
                onChange={handleChange}
                type="password"
                placeholder="Contraseña"
                id="password"
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Cargando...</span>
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>¿No tienes una cuenta?</span>
            <Link to="/sign-up" className="text-blue-500">
              Registrarse
            </Link>
          </div>
          {error && (
            <Alert className="mt-5" color="failure">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
