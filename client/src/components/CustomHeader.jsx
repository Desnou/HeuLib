import { AiOutlineSearch } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    Avatar,
    Button,
    Dropdown,
    DropdownHeader,
    Navbar,
    TextInput,
} from "flowbite-react";
import { signOutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function CustomHeader() {
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [sort, setSort] = useState("");
    const [domains, setDomains] = useState("");
    const [author, setAuthor] = useState("");
    const [hasValidation, setHasValidation] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const sortFromUrl = urlParams.get("sort") || "";
        const domainsFromUrl = urlParams.get("domains") || "";
        const authorFromUrl = urlParams.get("author") || "";
        const hasValidationFromUrl = urlParams.get("hasValidation") || "";
        const searchTermFromUrl = urlParams.get("searchTerm") || "";
        

        if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
        if (sortFromUrl) setSort(sortFromUrl);
        if (domainsFromUrl) setDomains(domainsFromUrl);
        if (authorFromUrl) setAuthor(authorFromUrl);
        if (hasValidationFromUrl) setHasValidation(hasValidationFromUrl);
    }, [location.search]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // setSearchTerm("");
        // setSort("");
        // setDomains("");
        // setAuthor("");
        // setHasValidation("");
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", searchTerm || "");
        urlParams.set("sort", sort || "");
        urlParams.set("domains", domains || "");
        urlParams.set("author", author || "");
        urlParams.set("hasValidation", hasValidation || "");
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    return (
        <Navbar className="border-b-2 ">
            <Link
                to="/"
                className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold"
            >
                <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                    Heuristics
                </span>
                <span className="text-slate-700">Lib</span>
            </Link>
            <form onSubmit={handleSubmit} className="hidden lg:flex">
                <TextInput
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" color="gray">
                    <AiOutlineSearch />
                </Button>
            </form>
            <Button
                className="w-12 h-10 lg:hidden"
                color="red"
                pill
                onClick={handleSubmit}
            >
                <AiOutlineSearch />
            </Button>
            <div className="flex gap-2 md:order-2">
                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                alt="user"
                                img={currentUser.avatar}
                                rounded
                            />
                        }
                    >
                        <DropdownHeader>
                            <span className="block text-sm">
                                @{currentUser.username}
                            </span>
                            <span className="block text-sm font-medium truncate">
                                @{currentUser.email}
                            </span>
                        </DropdownHeader>
                        <Link to={"dashboard?tab=profile"}>
                            <Dropdown.Item>Perfil</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignOut}>
                            Desconectar
                        </Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to="/sign-in">
                        <Button gradientDuoTone="purpleToBlue" outline>
                            Iniciar sesión
                        </Button>
                    </Link>
                )}

                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === "/"} as={"div"}>
                    <Link to="/">Inicio</Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/about"} as={"div"}>
                    <Link to="/about">Acerca de</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}