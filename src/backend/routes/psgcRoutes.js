import express from "express";
import {
    getRegions,
    getProvinces,
    getMunicipalities,
    getBarangays,
} from "../controllers/psgcController.js";

const router = express.Router();

router.get("/regions", getRegions);
router.get("/provinces", getProvinces);
router.get("/municipalities", getMunicipalities);
router.get("/barangays", getBarangays);

export default router;
