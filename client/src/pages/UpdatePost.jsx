import {
    Alert,
    Button,
    Checkbox,
    Datepicker,
    Dropdown,
    FileInput,
    Label,
    Select,
    Textarea,
    TextInput,
} from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function UpdatePost() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const [publishError, setPublishError] = useState(null);
    const [selectedDomain, setSelectedDomain] = useState([]);
    const { postId } = useParams();
    const { currentUser } = useSelector((state) => state.user);
    console.log(formData);

    useEffect(() => {
        try {
            const fetchPost = async () => {
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                    setPublishError(data.message);
                    return;
                }
                if (res.ok) {
                    setPublishError(null);
                    setFormData(data.posts[0]);
                    setSelectedDomain(data.posts[0].domains.split(", "));
                }
            };
            fetchPost();
        } catch (error) {
            console.log(error);
        }
    }, [postId]);

    const handleDomainChange = (e) => {
        const { id, checked } = e.target;
        let updatedDomains;
        if (checked) {
            updatedDomains = [...selectedDomain, id];
        } else {
            updatedDomains = selectedDomain.filter((domain) => domain !== id);
        }
        setSelectedDomain(updatedDomains);
        setFormData({
            ...formData,
            domains: updatedDomains.join(", "),
        });
    };
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData); // Verificar el contenido de formData antes de enviarlo
        if (selectedDomain.length === 0) {
            setPublishError("Debe seleccionar al menos una categoría.");
            return;
        }
        try {
            const res = await fetch(
                `/api/post/updatepost/${formData._id}/${currentUser._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );
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
            setPublishError("Error al realizar la publicación");
        }
    };
    return (
        <div className="p-4 max-w-3xl mx-auto -min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">
                Actualizar publicación
            </h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-col ">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">
                            Ingresa el título de la publicación
                        </Label>
                        <TextInput
                            type="text"
                            placeholder="Título"
                            required
                            id="title"
                            className="flex-1"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            value={formData.title}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="author">
                            Ingresa el nombre del autor(es)
                        </Label>
                        <TextInput
                            type="text"
                            placeholder="Autor"
                            required
                            id="author"
                            className=""
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    author: e.target.value,
                                })
                            }
                            value={formData.author}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="domains">
                            Selecciona una o más categorías
                        </Label>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="juegos"
                                onChange={handleDomainChange}
                                checked={selectedDomain.includes("juegos")}
                            />
                            <Label htmlFor="juegos">Juegos</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="movil"
                                onChange={handleDomainChange}
                                checked={selectedDomain.includes("movil")}
                            />
                            <Label htmlFor="movil">Celular</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="sistemas"
                                onChange={handleDomainChange}
                            />
                            <Label htmlFor="sistemas">Sistemas</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="plataformas-web"
                                onChange={handleDomainChange}
                                checked={selectedDomain.includes("plataformas-web")}
                            />
                            <Label htmlFor="plataformas-web">Sitios Web</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="interfaces"
                                onChange={handleDomainChange}
                                checked={selectedDomain.includes("interfaces")}
                            />
                            <Label htmlFor="interfaces">Interfaces</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="computadoras"
                                onChange={handleDomainChange}
                                checked={selectedDomain.includes("computadoras")}
                            />
                            <Label htmlFor="computadoras">Computadoras</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="aprendizaje"
                                onChange={handleDomainChange}
                                checked={selectedDomain.includes("aprendizaje")}
                            />
                            <Label htmlFor="aprendizaje">Aprendizaje</Label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Label htmlFor="">Estado de validación</Label>
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
                            value={formData.hasValidation}
                        >
                            <option value="uncategorized">
                                Tiene validación?
                            </option>
                            <option value="si">Si</option>
                            <option value="no">No</option>
                            <option value="parcial">Parcial</option>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Label>
                            Ingresa DOI o enlace de la publicación de origen
                        </Label>
                        <TextInput
                            type="text"
                            required
                            id="doi"
                            value={formData.doi}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    doi: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="flex flex-col  gap-2">
                        <Label htmlFor="heuristicNumber">
                            Cantidad de heurísticas
                        </Label>
                        <TextInput
                            className="w-fit"
                            type="number"
                            required
                            id="heuristicNumber"
                            min="1"
                            max="200"
                            value={formData.heuristicNumber}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    heuristicNumber: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="heuristicList">
                            Ingresa el listado de heurísticas
                        </Label>
                        <Textarea
                            type="text"
                            required
                            id="heuristicList"
                            value={formData.heuristicList}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    heuristicList: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="image">
                        Selecciona una imagen para la portada
                    </Label>
                    <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                        <FileInput
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            value={file}
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
                <div className="flex flex-col gap-4">
                    <Label htmlFor="content">Contenido de la publicación</Label>
                    <ReactQuill
                        theme="snow"
                        placeholder="Escribe algo..."
                        className="h-72 mb-12"
                        required
                        value={formData.content}
                        onChange={(value) =>
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                content: value,
                            }))
                        }
                    />
                </div>
                <Button type="submit" gradientDuoTone="purpleToBlue">
                    Actualizar Publicación
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
