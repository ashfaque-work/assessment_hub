const express = require("express");
const { getQuestionsByCategory, bulkUploadQuestions } = require("../controllers/questionController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const upload = require("../middlewares/fileUpload");

router.post("/upload", authMiddleware, upload.single("file"), bulkUploadQuestions);
router.get("/:categoryId", authMiddleware, getQuestionsByCategory);

module.exports = router;