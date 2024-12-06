import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export default function EditSuggestedPost() {
    const { postSlug } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        domains: "",
        heuristicList: "",
        doi: "",
        author: "",
        hasValidation: "",
        heuristicNumber: 0,
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`/api/posts/suggested-post/${postSlug}`);
                setPost(res.data);
                setFormData({
                    title: res.data.title,
                    content: res.data.content,
                    domains: res.data.domains,
                    heuristicList: res.data.heuristicList,
                    doi: res.data.doi,
                    author: res.data.author,
                    hasValidation: res.data.hasValidation,
                    heuristicNumber: res.data.heuristicNumber,
                });
                setLoading(false);
            } catch (err) {
                setError(true);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postSlug]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/posts/updatepost/${post._id}/${currentUser._id}`, formData);
            navigate(`/suggested-post/${postSlug}`);
        } catch (err) {
            setError(true);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading post</div>;

    return (
        <div>
            <h1>Edit Suggested Post</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                />
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Content"
                    required
                />
                <input
                    type="text"
                    name="domains"
                    value={formData.domains}
                    onChange={handleChange}
                    placeholder="Domains"
                    required
                />
                <input
                    type="text"
                    name="heuristicList"
                    value={formData.heuristicList}
                    onChange={handleChange}
                    placeholder="Heuristic List"
                    required
                />
                <input
                    type="text"
                    name="doi"
                    value={formData.doi}
                    onChange={handleChange}
                    placeholder="DOI"
                    required
                />
                <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author"
                    required
                />
                <input
                    type="text"
                    name="hasValidation"
                    value={formData.hasValidation}
                    onChange={handleChange}
                    placeholder="Has Validation"
                    required
                />
                <input
                    type="number"
                    name="heuristicNumber"
                    value={formData.heuristicNumber}
                    onChange={handleChange}
                    placeholder="Heuristic Number"
                    required
                />
                <button type="submit">Update Post</button>
            </form>
        </div>
    );
}