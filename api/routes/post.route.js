import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { 
    create, 
    deletepost, 
    getposts, 
    updatepost, 
    suggestpost, 
    getsuggestedposts, 
    deletesuggestedpost, 
    acceptsuggestedpost 
} from '../controllers/post.controller.js';

const router = express.Router();

router.post("/create", verifyToken, create);
router.get('/getposts', getposts);
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost);
router.put('/updatepost/:postId/:userId', verifyToken, updatepost);
router.post('/suggestpost', verifyToken, suggestpost);
router.get('/getsuggestedposts', verifyToken, getsuggestedposts);
router.delete('/deletesuggestedpost/:postId/:userId', verifyToken, deletesuggestedpost);
router.post('/acceptsuggestedpost/:postId', verifyToken, acceptsuggestedpost);

export default router;