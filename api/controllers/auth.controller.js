import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    // Validar que todos los campos estén presentes y no estén vacíos
    if (
        !username ||
        !email ||
        !password ||
        username.trim() === "" ||
        email.trim() === "" ||
        password.trim() === ""
    ) {
        next(errorHandler(400, "All fields are required!"));
    }

    try {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json("User created successfully!");
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email.trim() === "" || password.trim() === "") {
        return next(errorHandler(400, "Todos los campos son obligatorios"));
    }
    try {
        //Se valida que el usuario exista en la base de datos
        const validUser = await User.findOne({ email });
        //Si el usuario no existe se envía un error
        if (!validUser) {
            return next(errorHandler(404, "Las credenciales son incorrectas!"));
        }
        //Se valida que la contraseña sea correcta
        const validPassword = bcryptjs.compareSync(
            password,
            validUser.password
        );
        //Si la contraseña no es correcta se envía un error
        if (!validPassword) {
            return next(
                errorHandler(400, "Las credenciales son incorrectas!!")
            );
        }
        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin },
            process.env.JWT_SECRET
        );
        const { password: pass, ...rest } = validUser._doc;
        res.cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json(rest);
    } catch (error) {
        next(error);
    }
};

/*
 * Controlador para la autenticación de usuarios a través de Google.
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 *
 * @description Este controlador maneja la autenticación de usuarios utilizando Google.
 * Si el usuario ya existe en la base de datos, se genera un token JWT y se envía en una cookie.
 * Si el usuario no existe, se crea un nuevo usuario con una contraseña generada aleatoriamente,
 * se guarda en la base de datos, se genera un token JWT y se envía en una cookie.
 *
 * @throws {Error} Si ocurre un error durante el proceso de autenticación.
 */
export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin:  user.isAdmin}, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res.cookie("access_token", token, { httpOnly: true })
                .status(200)
                .json(rest);
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username:
                    req.body.name.split(" ").join("").toLowerCase() +
                    Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
                isGoogleUser: true,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie("access_token", token, { httpOnly: true })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};
