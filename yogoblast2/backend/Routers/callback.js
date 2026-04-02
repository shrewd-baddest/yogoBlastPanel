import { Router } from "express";
import callback from "../controllers/callback.js";
import { verifyToken } from "../middleware/tokens.js";

const callbackRouter = Router();

callbackRouter.post("/getCallback", callback);
callbackRouter.get("/postCallback", verifyToken, callback);

export default callbackRouter;
