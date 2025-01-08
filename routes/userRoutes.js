const express = require("express");
const { getUserProfile, updateUserProfile, submitAnswer, searchQuestions } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/fileUpload");
const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, upload.single("profilePicture"), updateUserProfile);
router.post("/answers", authMiddleware, submitAnswer);
router.get("/questions-search", authMiddleware, searchQuestions);

module.exports = router;