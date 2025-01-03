import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import "react-circular-progressbar/dist/styles.css";
import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutSuccess,
} from "../redux/user/userSlice";

export default function DashProfile() {
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] =
        useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: currentUser.username,
    });
    const filePickerRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
            setImageFileUploadError(null); // Limpiar cualquier error previo
        }
    };
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError(
                    "No se pudo cargar la imagen (El archivo debe ser menor de 2MB)"
                );
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, avatar: downloadURL });
                    setImageFileUploading(false);
                });
            }
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);

        setUpdateUserSuccess(null);
        if (
            (!formData.username || formData.username.trim() === "") &&
            formData.username !== currentUser.username
        ) {
            setUpdateUserError("El nombre de usuario no puede estar vacío");
            return;
        }
        if ("email" in formData && formData.email.trim() === "") {
            setUpdateUserError("El email no puede estar vacío");
            return;
        }
        if (formData.password && formData.password.trim() === "") {
            setUpdateUserError("La contraseña no puede estar vacía");
            return;
        }
        if (formData.password && formData.password.length < 6) {
            setUpdateUserError(
                "La contraseña debe tener al menos 6 caracteres"
            );
            return;
        }
        if (formData.username && formData.username.length < 7) {
            setUpdateUserError(
                "El nombre de usuario debe tener al menos 7 caracteres"
            );
            return;
        }
        if (formData.username && formData.username.length > 20) {
            setUpdateUserError(
                "El nombre de usuario no puede tener más de 20 caracteres"
            );
            return;
        }
        if (formData.username && formData.username.includes(" ")) {
            setUpdateUserError(
                "El nombre de usuario no puede contener espacios"
            );
            return;
        }
        if (
            formData.username &&
            formData.username !== formData.username.toLowerCase()
        ) {
            setUpdateUserError("El nombre de usuario debe estar en minúsculas");
            return;
        }
        if (formData.username && !formData.username.match(/^[a-zA-Z0-9]+$/)) {
            setUpdateUserError(
                "El nombre de usuario solo puede contener letras y números"
            );
            return;
        }
        if (formData.email && !formData.email.includes("@")) {
            setUpdateUserError("El email no es válido");
            return;
        }
        if (formData.email && !formData.email.includes(".")) {
            setUpdateUserError("El email no es válido");
            return;
        }
        if (Object.keys(formData).length === 0) {
            setUpdateUserError("Por favor llena al menos un campo");
            return;
        }
        if (imageFileUploading) {
            setUpdateUserError("Espera a que la imagen se cargue");
            return;
        }

        if (currentUser.isGoogleUser && (formData.email || formData.password)) {
            setUpdateUserError(
                "No puedes editar el email o la contraseña de un usuario que inició sesión con Google"
            );
            return;
        }
        if (
            currentUser.username === formData.username &&
            currentUser.email === formData.email &&
            !formData.password &&
            !imageFile
        ) {
            setUpdateUserError("No se ha modificado ningún campo");
            return;
        }
        setUpdateUserError(null);
        try {
            dispatch(updateStart());
            setUpdateUserError(null);
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            setUpdateUserError(null);
            if (!res.ok) {
                setUpdateUserError(null);
                dispatch(updateFailure(data.message));
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess(
                    "El perfil se ha actualizado correctamente"
                );
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
            } else {
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignOut = async () => {
        try {
            const res = await fetch("/api/user/signout", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signOutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    // Limpiar el mensaje de error y éxito cuando el componente se desmonta o se navegue a otra página
    useEffect(() => {
        return () => {
            setUpdateUserError(null);
            setUpdateUserSuccess(null);
        };
    }, [navigate]);

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Perfil</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={filePickerRef}
                    hidden
                />
                <div
                    className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                    onClick={() => filePickerRef.current.click()}
                >
                    {imageFileUploadProgress && (
                        <CircularProgressbar
                            value={imageFileUploadProgress || 0}
                            text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(62, 231, 219, ${
                                        imageFileUploadProgress / 100
                                    })`,
                                },
                            }}
                        />
                    )}
                    <img
                        src={imageFileUrl || currentUser.avatar}
                        alt="user"
                        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                            imageFileUploadProgress &&
                            imageFileUploadProgress < 100 &&
                            "opacity-50"
                        }`}
                    />
                </div>
                {imageFileUploadError && (
                    <Alert color="failure">{imageFileUploadError}</Alert>
                )}
                <TextInput
                    type="text"
                    id="username"
                    placeholder="Usuario"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                {currentUser.isGoogleUser ? (
                    <TextInput
                        disabled
                        type="text"
                        id="email"
                        placeholder="Email"
                        defaultValue={currentUser.email}
                    />
                ) : (
                    <TextInput
                        type="email"
                        id="email"
                        placeholder="Email"
                        defaultValue={currentUser.email}
                        onChange={handleChange}
                    />
                )}
                {currentUser.isGoogleUser ? (
                    <TextInput
                        disabled
                        type="password"
                        id="password"
                        placeholder="**********"
                    />
                ) : (
                    <TextInput
                        type="password"
                        id="password"
                        placeholder="**********"
                        onChange={handleChange}
                    />
                )}
                {currentUser.isGoogleUser && (
                    <Alert color="info">
                        Los usuarios de Google no pueden actualizar su correo ni
                        su contraseña, solo su nombre de usuario.
                    </Alert>
                )}
                <Button
                    type="submit"
                    gradientDuoTone="purpleToPink"
                    outline
                    disabled={loading || imageFileUploading}
                >
                    {loading ? "Cargando..." : "Actualizar"}
                </Button>
                {currentUser.isAdmin && (
                    <Link to={"/create-post"}>
                        <Button
                            type="button"
                            gradientDuoTone="purpleToPink"
                            className="w-full"
                        >
                            Crear una publicación
                        </Button>
                    </Link>
                )}
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span
                    onClick={() => setShowModal(true)}
                    className="cursor-pointer"
                >
                    Borrar cuenta
                </span>
                <span onClick={handleSignOut} className="cursor-pointer">
                    Desconectar
                </span>
            </div>
            {updateUserSuccess && (
                <Alert color="success" className="mt-5">
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert color="failure" className="mt-5">
                    {updateUserError}
                </Alert>
            )}
            {error && (
                <Alert color="failure" className="mt-5">
                    {error}
                </Alert>
            )}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size="md"
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 ">
                            Estas seguro que quieres eliminar la cuenta?
                        </h3>
                        <div className="flex justify-center gap-5">
                            <Button color="failure" onClick={handleDeleteUser}>
                                Si, eliminar
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => setShowModal(false)}
                            >
                                No, Cancelar
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
