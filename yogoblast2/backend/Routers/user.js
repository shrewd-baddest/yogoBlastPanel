import { Router } from "express";
import  regist  from "../controllers/registController.js";
import  login  from "../controllers/loginController.js";
 import {verifyToken, logOut } from "../middleware/tokens.js";
const router = Router();

router.post('/regist',regist);
router.post('/login',login);
router.get('/logout',verifyToken,logOut);
 

export default router;
