import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function DashComments() {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState("");
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`);
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    if (data.comments.length < 10) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchComments();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(
                `/api/comment/getcomments?startIndex=${startIndex}`
            );
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments]);
                if (data.comments.length < 10) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteComment = async () => {
        setShowModal(false);
        try {
            const res = await fetch(
                `/api/comment/deleteComment/${commentIdToDelete}`,
                {
                    method: "DELETE",
                }
            );
            const data = await res.json();
            if (res.ok) {
                setComments((prev) =>
                    prev.filter((comment) => comment._id !== commentIdToDelete)
                );
                setShowModal(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
            {currentUser.isAdmin && comments.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>
                                Fecha de actualización
                            </Table.HeadCell>
                            <Table.HeadCell>
                                Contenido del comentario
                            </Table.HeadCell>
                            <Table.HeadCell>Total de me gusta</Table.HeadCell>
                            <Table.HeadCell>
                                Título de la publicación
                            </Table.HeadCell>
                            <Table.HeadCell>
                                Ver publicación
                            </Table.HeadCell>
                            
                            <Table.HeadCell>Borrar</Table.HeadCell>
                        </Table.Head>
                        {comments.map((comment) => (
                            <Table.Body className="divide-y" key={comment._id}>
                                <Table.Row className="bg-white ">
                                    <Table.Cell>
                                        {new Date(
                                            comment.updatedAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>{comment.content}</Table.Cell>
                                    <Table.Cell>
                                        {comment.numberOfLikes}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className="font-medium text-gray-900"
                                            to={`/post/${comment.slugPost}`}
                                        >
                                            {comment.titlePost}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className="text-teal-500 hover:underline"
                                            to={`/post/${comment.slugPost}`}
                                        >
                                            <span>Ir a la publicación</span>
                                        </Link>
                                    </Table.Cell>
                                   
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setCommentIdToDelete(
                                                    comment._id
                                                );
                                            }}
                                            className="font-medium text-red-500 hover:underline cursor-pointer"
                                        >
                                            Borrar
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
                <p>No hay comentarios aun</p>
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
                            Estas seguro que quieres eliminar este comentario?
                        </h3>
                        <div className="flex justify-center gap-5">
                            <Button
                                color="failure"
                                onClick={handleDeleteComment}
                            >
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
