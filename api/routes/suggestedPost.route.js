import express from 'express';
import { createSuggestedPost, getSuggestedPosts, approveSuggestedPost } from '../controllers/suggestedPost.controller.js';
import { isAdmin, isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/suggest', isAuthenticated, createSuggestedPost);
router.get('/suggested', isAdmin, getSuggestedPosts);
router.put('/approve/:id', isAdmin, approveSuggestedPost);

export default router;