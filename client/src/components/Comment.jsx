import { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/es";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
moment.locale("es");

export default function Comment({ comment, onLike, onEdit, onDelete }) {
    const [user, setUser] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if (res) {
                    setUser(data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getUser();
    }, [comment]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: editedContent }),
            });
            if(res.ok){
                setIsEditing(false);
                onEdit(comment, editedContent);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex p-4 border-b text-sm">
            <div className="flex-shrink-0 mr-3">
                <img
                    className="w-10 h-10 rounded-full bg-gray-200"
                    src={user.avatar}
                    alt="user.username"
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className="font-bold mr-1 text-xs truncate">
                        {user ? `@${user.username}` : "Anónimo"}
                    </span>
                    <span className="text-gray-500 text-xs">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                {isEditing ? (
                    <>
                        <Textarea
                            className="mb-2"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className="flex justify-end gap-1 text-xs">
                            <Button
                                type="button"
                                size="sm"
                                gradientDuoTone="purpleToBlue"
                                onClick={handleSave}
                            >
                                Guardar
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                gradientDuoTone="purpleToBlue"
                                outline
                                onClick={() => setIsEditing(false)}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-gray-500 pb-2">{comment.content}</p>
                        <div className="flex items-center pt-2 text-xs border-t max-w-fit gap-2">
                            <button
                                type="button"
                                onClick={() => onLike(comment._id)}
                                className={`text-gray-400 hover:text-blue-500 ${
                                    currentUser &&
                                    comment.likes.includes(currentUser._id) &&
                                    "!text-blue-500"
                                }`}
                            >
                                <FaThumbsUp className="text-sm" />
                            </button>
                            <p className="text-gray-400">
                                {comment.numberOfLikes > 0 &&
                                    comment.numberOfLikes +
                                        " " +
                                        (comment.numberOfLikes === 1
                                            ? "Me gusta"
                                            : "Me gusta")}
                            </p>
                            {currentUser &&
                                (currentUser._id === comment.userId ||
                                    currentUser.isAdmin) && (
                                    <>
                                    <button
                                        type="button"
                                        onClick={handleEdit}
                                        className="text-gray-400 hover:text-blue-500"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(comment._id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        Eliminar
                                    </button>
                                    </>

                                )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
