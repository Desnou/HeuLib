import SuggestedPost from '../models/SuggestedPost.js';
import Post from '../models/Post.js';

export const createSuggestedPost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const suggestedPost = new SuggestedPost({
            title,
            content,
            category,
            author: req.user._id,
        });
        await suggestedPost.save();
        res.status(201).json({ message: 'Suggested post created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSuggestedPosts = async (req, res) => {
    try {
        const suggestedPosts = await SuggestedPost.find().populate('author', 'username');
        res.status(200).json(suggestedPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const approveSuggestedPost = async (req, res) => {
    try {
        const suggestedPost = await SuggestedPost.findById(req.params.id);
        if (!suggestedPost) {
            return res.status(404).json({ message: 'Suggested post not found' });
        }

        const post = new Post({
            title: suggestedPost.title,
            content: suggestedPost.content,
            category: suggestedPost.category,
            author: suggestedPost.author,
        });

        await post.save();
        await suggestedPost.remove();

        res.status(200).json({ message: 'Post approved and published successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};