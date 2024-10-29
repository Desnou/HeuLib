import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword});
    try {
        await newUser.save()
        res.status(201).json("User created successfully!");
        
    } catch (error) {
        next(error);
        
    }
};

export const singin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        //Se valida que el usuario exista en la base de datos
        const validUser = await User.findOne({ email });
        //Si el usuario no existe se envía un error
        if (!validUser) return next(errorHandler(404, "User not found!"));
        //Se valida que la contraseña sea correcta
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        //Si la contraseña no es correcta se envía un error
        if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest);
    } catch (error) {
        next(error);
    }
};