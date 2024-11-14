import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const test = (req, res) => {
    res.json({
        message: "Api route is working",
    });
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(
            errorHandler(
                403,
                "No estas autorizado para actualizar este usuario"
            )
        );
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(
                errorHandler(
                    400,
                    "La contraseña debe tener al menos 6 caracteres"
                )
            );
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(
                errorHandler(
                    400,
                    "El nombre de usuario debe tener entre 7 y 20 caracteres"
                )
            );
        }
        if (req.body.username.includes(" ")) {
            return next(
                errorHandler(
                    400,
                    "El nombre de usuario no puede contener espacios"
                )
            );
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(
                errorHandler(
                    400,
                    "El nombre de usuario debe estar en minúsculas"
                )
            );
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(
                errorHandler(
                    400,
                    "El nombre de usuario solo puede contener letras y números"
                )
            );
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    avatar: req.body.avatar,
                    password: req.body.password,
                },
            },
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(
            errorHandler(403, "No estas autorizado para eliminar este usuario")
        );
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("Usuario eliminado");
    } catch (error) {
        next(error);
    }
};

export const signout = (req, res, next) => {
    try {
        res
            .clearCookie("access_token")
            .status(200)
            .json("Cierre de sesión exitoso");
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, "No estas autorizado para ver todos los usuarios"));
    }
try {
        const startIndex = parseInt(req.query.startIndex) || 0; 
        const limit = parseInt(req.query.limit) || 10;
        const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;

        const users = await User.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        })
        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        });


} catch (error) {
    next(error);
}
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user){
            return next(errorHandler(404, "Usuario no encontrado"));
        }
        const { password, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
        
    }
};