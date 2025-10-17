import { Router } from "express";
import { exportJson, importJson } from "../controllers/backupController.js";
const router = Router();

router.get("/export", exportJson);

// Make sure your app has `app.use(express.json({ limit: "50mb" }))` to handle big files
router.post("/import", importJson);

export default router;
