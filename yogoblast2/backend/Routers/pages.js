import { Router } from "express";
import home from   '../controllers/homeController.js';
import display from '../controllers/displayController.js';
import {verifyToken} from '../middleware/tokens.js';
import pagesController from "../controllers/pagesController.js";
import sessionController from '../controllers/sessionController.js';
import { Bot } from "../controllers/botConroller.js";
const { account, cart, cartDisplay,update,orders,payment } = sessionController;
const {cartegory,search,callback}=pagesController;
const router= Router();

router.get('/', (req, res) => {
  res.send("Welcome to Pages API");
});

router.get('/home',home);
router.post('/display',display);
router.get('/Acct',verifyToken,account);
router.get('/cart',verifyToken,cart); 
router.post('/cart',verifyToken,cart);
router.post('/payment',payment);
router.get('/cartDisplay',verifyToken,cartDisplay); 
router.post('/update',verifyToken,update);
router.post('/orders',verifyToken,orders);
router.post('/callback',callback);
router.get('/callback',verifyToken,callback);
router.post('/category',cartegory);
router.post('/search',search);
router.post('/chat',Bot);


export default router