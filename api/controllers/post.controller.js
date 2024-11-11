import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "No tienes permisos para crear una publicación"));
    }
    if (
        !req.body.title ||
        !req.body.content ||
        !req.body.category ||
        !req.body.author ||
        !req.body.hasValidation ||
        !req.body.heuristicCount
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
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next (error);
    }
};
