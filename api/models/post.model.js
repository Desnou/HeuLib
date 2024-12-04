import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        domains: {
            type: String,
            required: true,
        },
        heuristicList: {
            type: String,
            required: true,
        },
        doi: {
            type: String,
            required: true,
        },

        author: {
            type: String,
            required: true,
        },
        hasValidation: {
            type: String,
            required: true,
        },

        heuristicNumber: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            default:
                "https://contenthub-static.grammarly.com/blog/wp-content/uploads/2017/11/how-to-write-a-blog-post.jpeg",
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        isSuggested: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);
export default Post;
