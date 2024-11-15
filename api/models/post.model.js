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
        category: {
            type: String,
            required: true,
            default: "",
        },
        author: {
            type: String,
            required: true,
        },
        hasValidation: {
            type: String,
            required: true,
        },
        heuristicCount: {
            type: String,
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
    },
    { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);
export default Post;