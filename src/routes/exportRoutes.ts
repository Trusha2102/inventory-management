import express from "express";
import { exportCSV, exportPDF } from "../controllers/exportController";

const router = express.Router();

router.get("/csv", exportCSV);
router.get("/pdf", exportPDF);

export default router;
