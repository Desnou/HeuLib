import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashSuggestedPost() {
    const { currentUser } = useSelector((state) => state.user);
    const [suggestedPosts, setSuggestedPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState("");
    const [postIdToAccept, setPostIdToAccept] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestedPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?isSuggested=true`);
                const data = await res.json();
                if (res.ok) {
                    setSuggestedPosts(data.posts);
                    if (data.posts.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchSuggestedPosts();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = suggestedPosts.length;
        try {
            const res = await fetch(
                `/api/post/getposts?isSuggested=true&startIndex=${startIndex}`
            );
            const data = await res.json();
            if (res.ok) {
                setSuggestedPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch(
                `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
                {
                    method: "DELETE",
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setSuggestedPosts((prev) =>
                    prev.filter((post) => post._id !== postIdToDelete)
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleAcceptPost = async (postId) => {
        try {
            const res = await fetch(`/api/post/acceptsuggestedpost/${postId}`, {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setSuggestedPosts((prev) =>
                    prev.filter((post) => post._id !== postId)
                );
                navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
            {currentUser.isAdmin && suggestedPosts.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Fecha actualizada</Table.HeadCell>
                            <Table.HeadCell>Portada</Table.HeadCell>
                            <Table.HeadCell>Título</Table.HeadCell>
                            <Table.HeadCell>Ver</Table.HeadCell>
                            <Table.HeadCell>Categorías</Table.HeadCell>
                            <Table.HeadCell>Borrar</Table.HeadCell>
                            <Table.HeadCell>Aceptar</Table.HeadCell>
                        </Table.Head>
                        {suggestedPosts.map((post) => (
                            <Table.Body className="divide-y" key={post._id}>
                                <Table.Row className="bg-white">
                                    <Table.Cell>
                                        {new Date(
                                            post.updatedAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/suggested-post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-20 h-10 object-cover bg-gray-500"
                                            />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className="font-medium text-gray-900"
                                            to={`/suggested-post/${post.slug}`}
                                        >
                                            {post.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className="font-medium text-teal-500 hover:underline"
                                            to={`/suggested-post/${post.slug}`}
                                        >
                                            Ver
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{post.domains}</Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setPostIdToDelete(post._id);
                                            }}
                                            className="font-medium text-red-500 hover:underline cursor-pointer"
                                        >
                                            Borrar
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setPostIdToAccept(post._id);
                                                handleAcceptPost(post._id);
                                            }}
                                            className="font-medium text-teal-500 hover:underline cursor-pointer"
                                        >
                                            Aceptar
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className="w-full text-teal-500 self-center text-sm py-7"
                        >
                            Ver más
                        </button>
                    )}
                </>
            ) : (
                <p>No hay publicaciones sugeridas aún</p>
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
                            Estas seguro que quieres eliminar esta publicación?
                        </h3>
                        <div className="flex justify-center gap-5">
                            <Button color="failure" onClick={handleDeletePost}>
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