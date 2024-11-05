import { AiOutlineSearch } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Navbar, TextInput } from "flowbite-react";

export default function CustomHeader() {
  const { currentUser } = useSelector((state) => state.user);
  const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2 ">
        {/* {flex justify-between items-center max-w-6xl mx-auto p-3} */}
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Heuro
          </span>
          <span className="text-slate-700">Lib</span>
        </Link>
        <form>
          <TextInput
            type="text"
            placeholder="Buscar..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
            />
        </form>
        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
          <AiOutlineSearch />
        </Button>
        {/* <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link> */}
          <div className="flex gap-2 md:order-2">
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7  object-cover"
                src={currentUser.avatar}
                alt="Profile"
              />
            ) : (
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            )}
          </Link>
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
        {/* </ul> */}
    </Navbar>
  );
}
