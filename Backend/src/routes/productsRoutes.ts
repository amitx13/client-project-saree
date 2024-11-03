import express from "express";
import { getProductsData } from "../controllers/productController/productscontroller";

const router = express.Router();

router.get('/getProducts',getProductsData)

export default router;