import express from "express";
import asyncHandler from "express-async-handler";
const router = express.Router();
import {
  getProducts,
  getProductbyId,
} from "../controllers/productControllers.js";

router.route("/").get(getProducts);
router.route("/:id").get(getProductbyId);

export default router;
