import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?isSuggested=false`);
                const data = await res.json();
                if (res.ok) {
                    setUserPosts(data.posts);
                    if (data.posts.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchPosts();
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(
                `/api/post/getposts?isSuggested=false&startIndex=${startIndex}`
            );
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
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
                setUserPosts((prev) =>
                    prev.filter((post) => post._id !== postIdToDelete)
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
            {userPosts.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Fecha actualizada</Table.HeadCell>
                            <Table.HeadCell>Portada</Table.HeadCell>
                            <Table.HeadCell>Título</Table.HeadCell>
                            <Table.HeadCell>Ver</Table.HeadCell>
                            <Table.HeadCell>Categorías</Table.HeadCell>
                            <Table.HeadCell>Borrar</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Editar</span>
                            </Table.HeadCell>
                        </Table.Head>
                        {userPosts.map((post) => (
                            <Table.Body className="divide-y" key={post._id}>
                                <Table.Row className="bg-white">
                                    <Table.Cell>
                                        {new Date(
                                            post.updatedAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
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
                                            to={`/post/${post.slug}`}
                                        >
                                            {post.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className="font-medium text-teal-500 hover:underline"
                                            to={`/post/${post.slug}`}
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
                                        <Link
                                            className="font-medium text-blue-500 hover:underline"
                                            to={`/update-post/${post._id}`}
                                        >
                                            Editar
                                        </Link>
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
                <p>No hay publicaciones aún</p>
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