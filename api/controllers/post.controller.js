import Post from "../models/post.model.js";
import SuggestPost from "../models/suggestpost.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(
            errorHandler(403, "No tienes permisos para crear una publicación")
        );
    }
    if (
        !req.body.title ||
        !req.body.content ||
        !req.body.domains ||
        !req.body.author ||
        !req.body.hasValidation ||
        !req.body.heuristicNumber ||
        !req.body.doi ||
        !req.body.heuristicList
    ) {
        return next(errorHandler(400, "Faltan campos obligatorios"));
    }
    const slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "");
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });
    req.slug = slug; // Store the slug in the request object for later use
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.domains && {
                domains: { $regex: req.query.domains, $options: "i" },
            }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.author && { author: req.query.author }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: "i" } },
                    {
                        content: {
                            $regex: req.query.searchTerm,
                            $options: "i",
                        },
                    },
                    {
                        domains: {
                            $regex: req.query.searchTerm,
                            $options: "i",
                        },
                    },
                ],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        res.status(200).json({ posts, totalPosts, lastMonthPosts });
    } catch (error) {
        next(error);
    }
};

export const deletepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId || !req.params.postId) {
        return next(
            errorHandler(
                403,
                "No estás autorizado para eliminar esta publicación"
            )
        );
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json("Publicación eliminada");
    } catch (error) {
        next(error);
    }
};

export const updatepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId || !req.params.postId) {
        return next(
            errorHandler(403, "No estás autorizado para editar esta publicación")
        );
    }
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    domains: req.body.domains,
                    author: req.body.author,
                    hasValidation: req.body.hasValidation,
                    heuristicNumber: req.body.heuristicNumber,
                    image: req.body.image,
                    doi: req.body.doi,
                    heuristicList: req.body.heuristicList,

                },
            },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

export const suggestpost = async (req, res, next) => {
    if (!req.body.title || !req.body.content || !req.body.domains || !req.body.author || !req.body.hasValidation || !req.body.heuristicNumber) {
        return next(errorHandler(400, "Faltan campos obligatorios"));
    }
    const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "");
    const newSuggestPost = new SuggestPost({
        ...req.body,
        slug,
        userId: req.user.id,
    });
    try {
        const savedSuggestPost = await newSuggestPost.save();
        res.status(201).json(savedSuggestPost);
    } catch (error) {
        next(error);
    }
};
// Función para obtener las publicaciones sugeridas
export const getsuggestedposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const suggestedposts = await SuggestPost.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.domains && {
                domains: { $regex: req.query.domains, $options: "i" },
            }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.author && { author: req.query.author }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: "i" } },
                    {
                        content: {
                            $regex: req.query.searchTerm,
                            $options: "i",
                        },
                    },
                    {
                        domains: {
                            $regex: req.query.searchTerm,
                            $options: "i",
                        },
                    },
                ],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalSuggestedPosts = await SuggestPost.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthSuggestedPosts = await SuggestPost.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        res.status(200).json({ suggestedposts, totalSuggestedPosts, lastMonthSuggestedPosts });
    } catch (error) {
        next(error);
    }
};

export const acceptsuggestedpost = async (req, res, next) => {
    try {
        const suggestedPost = await SuggestPost.findById(req.params.postId);
        if (!suggestedPost) {
            return next(errorHandler(404, "Sugerencia no encontrada"));
        }
        const newSuggestPost = new SuggestPost({
            ...suggestedPost._doc,
            userId: req.user.id,
        });
        await newSuggestPost.save();
        await suggestedPost.findByIdAndDelete(req.params.postId);
        res.status(200).json("Sugerencia aceptada y publicada");
    } catch (error) {
        next(error);
    }
};

export const deletesuggestedpost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId || !req.params.postId) {
        return next(
            errorHandler(
                403,
                "No estás autorizado para eliminar esta publicación"
            )
        );
    }
    try {
        await SuggestPost.findByIdAndDelete(req.params.postId);
        res.status(200).json("Sugerencia rechazada y eliminada");
    } catch (error) {
        next(error);
    }
};