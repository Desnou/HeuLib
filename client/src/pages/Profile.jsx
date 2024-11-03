import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  // Referencia al input de archivo
  const fileRef = useRef(null);
  
  // Obtener el usuario actual del estado global
  const { currentUser } = useSelector((state) => state.user);
  
  // Estado para almacenar el archivo seleccionado
  const [file, setFile] = useState(undefined);
  
  // Estado para almacenar el porcentaje de subida del archivo
  const [filePerc, setFilePerc] = useState(0);
  console.log(filePerc);
  
  // Estado para manejar errores de subida de archivo
  const [fileUploadError, setFileUploadError] = useState(false);
  
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({});
  
  // Efecto para manejar la subida del archivo cuando se selecciona uno
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Función para manejar la subida del archivo a Firebase Storage
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Actualizar el porcentaje de subida
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(progress);
      },
      (error) => {
        // Manejar errores de subida
        console.error('Upload failed:', error);
        setFileUploadError(true);
      },
      () => {
        // Obtener la URL de descarga del archivo subido
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={formData.avatar || currentUser.avatar}
          alt="Profile"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
            Error image upload
          </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">
              {`Uploading ${filePerc}%`}
            </span>
          ) : filePerc === 100 ? (
              <span className="text-green-700">Uploaded</span>
          ) : (
                ''
              )}
        </p>
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg "
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg "
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg "
        />

        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>

        {/* <h2 className='text-xl mt-5'>{currentUser.username}</h2> */}
        {/* <p className='text-lg text-slate-500'>{currentUser.email}</p> */}
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
