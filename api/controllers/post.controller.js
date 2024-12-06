import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

// Crear una nueva publicación
export const create = async (req, res, next) => {
    const isSuggested = !req.user.isAdmin;
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
        isSuggested,
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

// Obtener publicaciones
export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const isSuggested = req.query.isSuggested === 'true';
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.heuristicNumber && { heuristicNumber: req.query.heuristicNumber }),
            ...(req.query.domains && {
                domains: { $regex: new RegExp(req.query.domains.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), "i") },
            }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.author && {
            author: { $regex: new RegExp(req.query.author.split(",").map(a => a.trim()).join("|").normalize("NFD").replace(/[\u0300-\u036f]/g, ""), "i") },
            }),
            ...(req.query.hasValidation && { hasValidation: req.query.hasValidation }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), $options: "i" } },
                    {
                        content: {
                            $regex: req.query.searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), $options: "i",
                        },
                    },
                    {
                        domains: {
                            $regex: req.query.searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), $options: "i",
                        },
                    },
                    { author: { $regex: req.query.searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), $options: "i" } },
                ],
            }),
            isSuggested,
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

// Eliminar una publicación
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

// Actualizar una publicación
export const updatepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId || !req.params.postId) {
        return next(
            errorHandler(403, "No estás autorizado para editar esta publicación")
        );
    }
    try {
        const { title, ...rest } = req.body;
        const post = await Post.findById(req.params.postId);
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
                    isSuggested: false, // Cambiar isSuggested a false al aceptar el post
                },
            },
            { new: true }
        );
        // Actualizar el post
        post.title = title;
        Object.assign(post, rest);
        await post.save();
        await Comment.updateMany(
            { postId: post._id },
            { $set: { titlePost: title } }
        );
        
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

// Aceptar una publicación sugerida
export const acceptsuggestedpost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, "Post no encontrado"));
        }
        post.isSuggested = false; // Cambiar isSuggested a false
        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

// Obtener publicaciones sugeridas
export const getsuggestedposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const suggestedposts = await Post.find({
            isSuggested: true,
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

        const totalSuggestedPosts = await Post.countDocuments({ isSuggested: true });

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthSuggestedPosts = await Post.countDocuments({
            isSuggested: true,
            createdAt: { $gte: oneMonthAgo },
        });
        res.status(200).json({ suggestedposts, totalSuggestedPosts, lastMonthSuggestedPosts });
    } catch (error) {
        next(error);
    }
};

// Sugerir una publicación
export const suggestpost = async (req, res, next) => {
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
        isSuggested: true, // Marcar como sugerido
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

// Eliminar una publicación sugerida
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
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json("Sugerencia rechazada y eliminada");
    } catch (error) {
        next(error);
    }
};