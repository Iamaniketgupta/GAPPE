import { Router } from "express";
import { fetchAllMessages, fetchMessages, sendMessage } from "../controllers/message.controller.js";
import { verifyAuth } from "../middlewares/auth.js";

const router = Router();

router.post('/',verifyAuth,sendMessage);
router.get('/all',verifyAuth,fetchAllMessages);
router.get('/:chatId',verifyAuth,fetchMessages);


export default router;