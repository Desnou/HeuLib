import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {   //Se crean reglas para los distintas entradas
        type: String,
        require: true,
        unique: true,
        
    },
    email: {
        type: String,
        require: true,
        unique: true,

    },
    password: {
        type: String,
        require: true,

    },
    avatar: {
        type: String,
        default: "https://i.pinimg.com/736x/2f/c9/20/2fc92053c09bd431c041d91e574be860.jpg",
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;