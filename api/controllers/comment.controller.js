import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId, slugPost, titlePost } = req.body;
        if (userId !== req.user.id) {
            return next(
                errorHandler(403, "No tienes permiso para realizar esta acción")
            );
        }
        const newComment = new Comment({
            content,
            postId,
            userId,
            slugPost,
            titlePost,
        });
        await newComment.save();
        res.status(200).json(newComment);
    } catch (error) {
        next(error);
    }
};

export const getPostComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort(
            {
                createdAt: -1,
            }
        );
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
};

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, "Comentario no encontrado"));
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, "Comentario no encontrado"));
        }
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(
                errorHandler(403, "No tienes permiso para realizar esta acción")
            );
        }
        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content: req.body.content,
                slugPost: req.body.slugPost, // Ensure slugPost is updated if needed
                titlePost: req.body.titlePost, // Ensure titlePost is updated if needed
            },
            { new: true }
        );
        res.status(200).json(editedComment);
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, "Comentario no encontrado"));
        }
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(
                errorHandler(403, "No tienes permiso para realizar esta acción")
            );
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({ message: "Comentario eliminado con éxito" });
    } catch (error) {
        next(error);
    }
};

export const getcomments = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(
            errorHandler(403, "No tienes permiso para realizar esta acción")
        );
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === "desc" ? -1 : 1;
        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        res.status(200).json({ comments, totalComments, lastMonthComments });
    } catch (error) {
        next(error);
    }
};
