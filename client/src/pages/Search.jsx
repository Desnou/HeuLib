import { Button, Checkbox, Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import Selection from "react-select";
export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        sort: "desc",
        domains: "",
        author: "",
        hasValidation: "",
    });
    console.log(sidebarData);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const sortFromUrl = urlParams.get("sort");
        const domainsFromUrl = urlParams.get("domains");
        const authorFromUrl = urlParams.get("author");
        const hasValidationFromUrl = urlParams.get("hasValidation");
        
        if (searchTermFromUrl || sortFromUrl || domainsFromUrl || authorFromUrl || hasValidationFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                domains: domainsFromUrl,
                author: authorFromUrl,
                hasValidation: hasValidationFromUrl,
                
                
            });
        }
        if (!searchTermFromUrl) {
            setSidebarData((prevData) => ({
            ...prevData,
            searchTerm: "",
            }));
        }
        if (!sortFromUrl) {
            setSidebarData((prevData) => ({
            ...prevData,
            sort: "desc",
            }));
        }
        if (!domainsFromUrl) {
            setSidebarData((prevData) => ({
            ...prevData,
            domains: "",
            }));
        }
        if (!authorFromUrl) {
            setSidebarData((prevData) => ({
            ...prevData,
            author: "",
            }));
        }
        if (!hasValidationFromUrl) {
            setSidebarData((prevData) => ({
            ...prevData,
            hasValidation: "",
            }));
        }


        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            if (!res.ok) {
                setLoading(false);
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setLoading(false);
                if (data.posts.length === 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }
        };
        fetchPosts();
    }, [location.search]);
    const handleChange = (e) => {
        if (e.target.id === "searchTerm") {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        }
        if (e.target.id === "sort") {
            const order = e.target.value || "desc";
            setSidebarData({ ...sidebarData, sort: order });
        }
        if (e.target.id === "domains") {
            const domains = e.target.value || "";
            setSidebarData({ ...sidebarData, domains });
        }
        if (e.target.id === "author") {
            const author = e.target.value || "";
            setSidebarData({ ...sidebarData, author });
        }
        if (e.target.id === "hasValidation") {
            const hasValidation = e.target.value || "";
            setSidebarData({ ...sidebarData, hasValidation });
        }
    };
const handleDomainChange = (e) => {
    const { id, checked } = e.target;
    let updatedDomains;
    if (checked) {
        updatedDomains = [...selectedDomain, id];
    } else {
        updatedDomains = selectedDomain.filter((domain) => domain !== id);
    }
    updatedDomains.sort();
    setSelectedDomain(updatedDomains);
    setSidebarData({
        ...sidebarData,
        domains: updatedDomains.join(", "),
    });
};

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", sidebarData.searchTerm);
        urlParams.set("order", sidebarData.sort);
        urlParams.set("domains", sidebarData.domains);
        urlParams.set("author", sidebarData.author);
        urlParams.set("sort", sidebarData.sort);
        urlParams.set("hasValidation", sidebarData.hasValidation);
    
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };
    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
            return;
        }
        if (res.ok) {
            const data = await res.json();
            setPosts([...posts, ...data.posts]);
            if (data.posts.length === 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
    };
    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    <div className="flex flex-col  gap-2">
                        <label className="whitespace-nowrap font-semibold">
                            Buscar por tema:
                        </label>
                        <TextInput
                            placeholder="Buscar..."
                            id="searchTerm"
                            type="text"
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Orden:</label>
                        <Select
                            onChange={handleChange}
                            value={sidebarData.sort}
                            id="sort"
                        >
                            <option value="desc">Reciente</option>
                            <option value="asc">Antiguo</option>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Buscar por autor:</label>
                        <TextInput
                            placeholder="Autor..."
                            id="author"
                            type="text"
                            value={sidebarData.author}
                            onChange={(e) =>
                                setSidebarData({ ...sidebarData, author: e.target.value })
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Estado de validación:</label>
                        <Select
                            onChange={handleChange}
                            value={sidebarData.hasValidation}
                            id="hasValidation"
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="si">Si</option>
                            <option value="no">No</option>
                            <option value="parcial">Parcial</option>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2 mb">
                        <Label className="mb-2" htmlFor="domains">Selecciona una o más categorías :</Label>
                        <div className="flex items-center gap-2">
                            <Checkbox id="juegos" onChange={handleDomainChange} checked={selectedDomain.includes("juegos")} />
                            <Label htmlFor="juegos">Juegos</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="movil" onChange={handleDomainChange} checked={selectedDomain.includes("movil")} />
                            <Label htmlFor="movil">Movil</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="sistemas" onChange={handleDomainChange} checked={selectedDomain.includes("sistemas")} />
                            <Label htmlFor="sistemas">Sistemas</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="plataformas-web" onChange={handleDomainChange} checked={selectedDomain.includes("plataformas-web")} />
                            <Label htmlFor="plataformas-web">Plataformas Web</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="interfaces" onChange={handleDomainChange} checked={selectedDomain.includes("interfaces")} />
                            <Label htmlFor="interfaces">Interfaces</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="computadoras" onChange={handleDomainChange} checked={selectedDomain.includes("computadoras")} />
                            <Label htmlFor="Computadoras">Computadoras</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="aprendizaje" onChange={handleDomainChange} checked={selectedDomain.includes("aprendizaje")} />
                            <Label htmlFor="aprendizaje">Aprendizaje</Label>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        outline
                        gradientDuoTone="purpleToPink"
                    >
                        Aplicar filtros
                    </Button>
                </form>
            </div>
            <div className="w-full">
                <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
                    Resultados:
                </h1>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
                    {!loading && posts.length === 0 && (
                        <p className="text-sm text-gray-500 col-span-full text-center">
                            No se encontraron publicaciones.
                        </p>
                    )}
                    {loading && (
                        <p className="text-sm text-gray-500 col-span-full text-center">
                            Cargando...
                        </p>
                    )}
                    {!loading &&
                        posts &&
                        posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className="text-teal-500 text-sm hover:underline w-full col-span-full"
                        >
                            Ver mas
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
