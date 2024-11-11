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
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const options = [
    { value: "chocolate", label: "Games" },
    { value: "strawberry", label: "Mobile" },
    { value: "systems", label: "Systems" },
    { value: "websites", label: "Websites" },
    { value: "applications", label: "Applications" },
    { value: "interfaces", label: "Interfaces" },
    { value: "computers", label: "Computers" },
    { value: "learning", label: "Learning" },
];

export default function CreatePost() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
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
    const [selectedOptions, setSelectedOptions] = useState([]);
    const handleChange = (selectedOption) => {
        setSelectedOptions(selectedOption);
    };
    return (
        <div className="p-4 max-w-3xl mx-auto -min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">
                Crear publicación
            </h1>
            <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-col ">
                    <TextInput
                        type="text"
                        placeholder="Título"
                        required
                        id="title"
                        className="flex-1"
                    />

                    <Selection
                        placeholder="Selecciona una categoría"
                        id="category"
                        options={options}
                        value={selectedOptions}
                        onChange={handleChange}
                        isMulti
                        isSearchable={false}
                        closeMenuOnSelect={false}
                    />
                    <TextInput
                        type="text"
                        placeholder="Autor"
                        required
                        id="autor"
                        className=""
                    />
                    <div className="flex flex-auto gap-4">
                        <Select
                            id="hasValidation"
                            placeholder="Selecciona una opcion"
                        >
                            <option value="uncategorized">
                                Tiene validacion?
                            </option>
                            <option value="yes">Si</option>
                            <option value="no">No</option>
                            <option value="partial">Parcial</option>
                        </Select>
                        <Select
                            placeholder="Selecciona una opcion"
                            required
                            id="heuristicCount"
                        >
                            <option value="uncategorized">
                                Cantidad de heuristicas
                            </option>
                            <option value="option1">1</option>
                            <option value="option2">2</option>
                            <option value="option3">3</option>
                            <option value="option4">4</option>
                            <option value="option5">5</option>
                            <option value="option6">6</option>
                        </Select>
                        <Datepicker
                            placeholder="Fecha de publicación"
                            required
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
                {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
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
                />
                <Button type="submit" gradientDuoTone="purpleToBlue">
                    Publicar
                </Button>
            </form>
        </div>
    );
}