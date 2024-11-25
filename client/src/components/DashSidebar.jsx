import React from "react";
import { Sidebar } from "flowbite-react";
import {
    HiAnnotation,
    HiArrowSmRight,
    HiChartPie,
    HiDocumentText,
    HiOutlineUserGroup,
    HiUser,
    HiUserGroup,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function DashSidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const [tab, setTab] = useState("");
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
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
    return (
        <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col gap-1">
                    {currentUser && currentUser.isAdmin && (
                        <Link to="/dashboard?tab=dash">
                            <Sidebar.Item
                                active={tab === "dash" || !tab}
                                icon={HiChartPie}
                                as="div"
                            >
                                Dashboard
                            </Sidebar.Item>
                        </Link>
                    )}
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item
                            active={tab === "profile"}
                            icon={HiUser}
                            label={currentUser.isAdmin ? "Admin" : "Usuario"}
                            labelColor="dark"
                            as="div"
                        >
                            Perfil
                        </Sidebar.Item>
                    </Link>
                    {currentUser.isAdmin && (
                        <Link to="/dashboard?tab=posts">
                            <Sidebar.Item
                                active={tab === "posts"}
                                icon={HiDocumentText}
                                as="div"
                            >
                                Publicaciones
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser.isAdmin && (
                        <>
                            <Link to="/dashboard?tab=suggested-posts">
                                <Sidebar.Item
                                    active={tab === "suggested-posts"}
                                    icon={HiDocumentText}
                                    as="div"
                                >
                                    Post Sugeridos
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=users">
                                <Sidebar.Item
                                    active={tab === "users"}
                                    icon={HiUserGroup}
                                    as="div"
                                >
                                    Users
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=comments">
                                <Sidebar.Item
                                    active={tab === "comments"}
                                    icon={HiAnnotation}
                                    as="div"
                                >
                                    Comentarios
                                </Sidebar.Item>
                            </Link>
                        </>
                    )}
                    <Link to="/dashboard?tab=suggest-post">
                        <Sidebar.Item
                            active={tab === "suggest-post"}
                            icon={HiDocumentText}
                            as="div"
                        >
                            Sugerir Post
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item
                        icon={HiArrowSmRight}
                        className="cursor-pointer"
                        onClick={handleSignOut}
                    >
                        Desconectarse
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
