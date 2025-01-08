const express = require("express");
const { getAllCategories, getCategoryStats, createCategory, updateCategory } = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware"); // Optional for admin-only access
const router = express.Router();

router.get("/", getAllCategories);
router.get("/stats", getCategoryStats);
router.post("/", authMiddleware, createCategory);
router.put("/:categoryId", authMiddleware, updateCategory);

module.exports = router;