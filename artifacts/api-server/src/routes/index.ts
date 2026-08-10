import { Router, type IRouter } from "express";
import healthRouter from "./health";
import mediaRouter from "./media";

const router: IRouter = Router();

router.use(healthRouter);
router.use(mediaRouter);

export default router;
