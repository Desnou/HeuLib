import {
    Alert,
    Button,
    Datepicker,
    Dropdown,
    FileInput,
    Select,
    TextInput,
} from "flowbite-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Selection from "react-select";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const options = [
    { value: "games", label: "Games" },
    { value: "mobile", label: "Mobile" },
    { value: "systems", label: "Systems" },
    { value: "websites", label: "Websites" },
    { value: "applications", label: "Applications" },
    { value: "interfaces", label: "Interfaces" },
    { value: "computers", label: "Computers" },
    { value: "learning", label: "Learning" },
];

export default function UpdatePost() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [publishError, setPublishError] = useState(null);
    const { postId } = useParams();


    useEffect(() => { 
        try {
            const fetchPost = async () => {
            const res = await fetch(`/api/post/getposts?postId=${postId}`);
            const data = await res.json();
            if(!res.ok){
                console.log
                setPublishError(data.message);
                return;
            }
            if(res.ok){
                setPublishError(null);
                setFormData(data.posts[0]);

            }
            }
            fetchPost();
        } catch (error) {
            console.log(error.message);
        }
    }, [postId]);

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError("Por favor selecciona una imagen");
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + "-" + file.name;
            const storageRef = ref(storage, fileName);
            const upLoadTask = uploadBytesResumable(storageRef, file);
            upLoadTask.on(
                "stage_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError("Error al subir la imagen");
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(upLoadTask.snapshot.ref).then(
                        (downloadURL) => {
                            setImageUploadProgress(null);
                            setImageUploadError(null);
                            setFormData({ ...formData, image: downloadURL });
                        }
                    );
                }
            );
        } catch (error) {
            setImageUploadError("Error al subir la imagen");
            setImageUploadProgress(null);
            console.log(error);
        }
    };
    const handleCategoryChange = (selectedOption) => {
        setSelectedOptions(selectedOption);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData); // Verificar el contenido de formData antes de enviarlo
        try {
            const res = await fetch("/api/post/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
            if (res.ok) {
                setPublishError(null);
                navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            setPublishError("Error al publicar la publicación");
        }
    };
    return (
        <div className="p-4 max-w-3xl mx-auto -min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">
                Crear publicación
            </h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-col ">
                    <TextInput
                        type="text"
                        placeholder="Título"
                        required
                        id="title"
                        className="flex-1"
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        value={formData.title || ""}
                    />

                    <Selection
                        placeholder="Selecciona una categoría"
                        type="string"
                        id="category"
                        options={options}
                        value={formData.category ? formData.category.split(", ").map((cat) => ({ value: cat, label: cat })) : []}
                        onChange={(selectedOption) => {
                            handleCategoryChange(selectedOption);
                            setFormData({
                                ...formData,
                                category: selectedOption
                                    .map((option) => option.value)
                                    .join(", "),
                            });
                        }}
                        isMulti
                        isSearchable={false}
                        closeMenuOnSelect={false}
                    />
                    <TextInput
                        type="text"
                        placeholder="Autor"
                        required
                        id="author"
                        className=""
                        onChange={(e) =>
                            setFormData({ ...formData, author: e.target.value })
                        }
                    />
                    <div className="flex flex-auto gap-4">
                        <Select
                            id="hasValidation"
                            placeholder="Selecciona una opción"
                            required
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    hasValidation: e.target.value,
                                })
                            }
                        >
                            <option value="uncategorized">
                                Tiene validacion?
                            </option>
                            <option value="si">Si</option>
                            <option value="no">No</option>
                            <option value="parcial">Parcial</option>
                        </Select>
                        <Select
                            placeholder="Selecciona una opción"
                            required
                            id="heuristicCount"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    heuristicCount: e.target.value,
                                })
                            }
                        >
                            <option value="uncategorized">
                                Cantidad de heuristicas
                            </option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </Select>
                        <Datepicker
                            placeholder="Fecha de publicación"
                            id="date"
                            className=""
                        ></Datepicker>
                    </div>
                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button
                        type="button"
                        gradientDuoTone="purpleToBlue"
                        size="sm"
                        outline
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {imageUploadProgress ? (
                            <div className="w-16 h-16">
                                <CircularProgressbar
                                    value={imageUploadProgress}
                                    text={`${imageUploadProgress || 0}%`}
                                />
                            </div>
                        ) : (
                            "Subir imagen"
                        )}
                    </Button>
                </div>
                {imageUploadError && (
                    <Alert color="failure">{imageUploadError}</Alert>
                )}
                {formData.image && (
                    <img
                        src={formData.image}
                        alt="upload"
                        className="w-full h-72 object-cover"
                    />
                )}
                <ReactQuill
                    theme="snow"
                    placeholder="Escribe algo..."
                    className="h-72 mb-12"
                    required
                    onChange={(value) =>
                        setFormData({ ...formData, content: value })
                    }
                />
                <Button type="submit" gradientDuoTone="purpleToBlue">
                    Publicar
                </Button>
                {publishError && (
                    <Alert className="mt-5" color="failure">
                        {publishError}
                    </Alert>
                )}
            </form>
        </div>
    );
}
