import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import Selection from "react-select";

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        author: "",
        sort: "desc",
        category: "",
    });
    console.log(sidebarData);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const options = [
        { value: "", label: "Sin categoría" },
        { value: "games", label: "Games" },
        { value: "mobile", label: "Mobile" },
        { value: "systems", label: "Systems" },
        { value: "websites", label: "Websites" },
        { value: "applications", label: "Applications" },
        { value: "interfaces", label: "Interfaces" },
        { value: "computers", label: "Computers" },
        { value: "learning", label: "Learning" },
    ];

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm") || "";
        const authorFromUrl = urlParams.get("author") || "";
        const sortFromUrl = urlParams.get("sort") || "desc";
        const categoryFromUrl = urlParams.get("category") || "";
        setSidebarData({
            searchTerm: searchTermFromUrl,
            author: authorFromUrl,
            sort: sortFromUrl,
            category: categoryFromUrl,
        });

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            if (!res.ok) {
                setLoading(false);
                return;
            }
            const data = await res.json();
            setPosts(data.posts);
            setLoading(false);
            setShowMore(data.posts.length === 9);
        };
        fetchPosts();
    }, [location.search]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setSidebarData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleCategoryChange = (selectedOption) => {
        setSelectedOptions(selectedOption);
        setSidebarData((prevData) => ({
            ...prevData,
            category: selectedOption.map((option) => option.value).join(", "),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", sidebarData.searchTerm);
        urlParams.set("author", sidebarData.author);
        urlParams.set("order", sidebarData.sort);
        urlParams.set("category", sidebarData.category);
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
        const data = await res.json();
        setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        setShowMore(data.posts.length === 9);
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2">
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
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">
                            Buscar por autor:
                        </label>
                        <TextInput
                            placeholder="Autor..."
                            id="author"
                            type="text"
                            value={sidebarData.author}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center gap-2">
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
                        <label className="font-semibold">Categoría:</label>
                        <Selection
                            placeholder="Selecciona una categoría"
                            type="string"
                            id="category"
                            options={options}
                            value={selectedOptions}
                            onChange={handleCategoryChange}
                            isMulti
                            isSearchable={false}
                            closeMenuOnSelect={false}
                            className=""
                        />
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
