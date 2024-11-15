import { AiOutlineSearch } from "react-icons/ai";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Button, Dropdown, DropdownHeader, Navbar, TextInput } from "flowbite-react";
import { signOutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";


export default function CustomHeader() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  const handleSignOut = async () => {
    try {
        const res = await fetch('/api/user/signout', {
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
  const urlParams = new URLSearchParams(location.search);
  urlParams.set('searchTerm', searchTerm);
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
            Heuro
          </span>
          <span className="text-slate-700">Lib</span>
        </Link>
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            placeholder="Buscar..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </form>
        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
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
                  <span className="block text-sm">@{currentUser.username}</span>
                  <span className="block text-sm font-medium truncate">@{currentUser.email}</span>
                </DropdownHeader>
                <Link to={'dashboard?tab=profile'}>
                  <Dropdown.Item>Perfil</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignOut}>Desconectar</Dropdown.Item>
              </Dropdown>
            ) : (
            <Link to ='/sign-in'>
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
            )}
          
          <Navbar.Toggle/>

          </div>
          <Navbar.Collapse>
            <Navbar.Link active={path === "/"} as={'div'} >
              <Link to='/'>
                Home
              </Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/about"} as={'div'}>
              <Link to='/about'>
                About
              </Link>
            </Navbar.Link>
          </Navbar.Collapse>
    </Navbar>
  );
}
