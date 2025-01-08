const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const UserAnswer = require("../models/UserAnswer");
const Question = require("../models/Question");
const mongoose = require("mongoose");

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const profilePicture = req.file ? req.file.path : null;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    if (name) user.name = name;
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: "Email is already in use." });
      }
      user.email = email;
    }
 
    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Update profile picture if uploaded
    if (profilePicture) {
      // Remove the old profile picture if it exists
      if (user.profilePicture) {
        fs.unlink(path.resolve(user.profilePicture), (err) => {
          if (err) console.error("Error removing old profile picture:", err);
        });
      }
      user.profilePicture = profilePicture;
    }

    await user.save();
    res.json({ message: "Profile updated successfully.", profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitAnswer = async (req, res) => {
  const { questionId, answer, timezone } = req.body;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found." });
    }

    const userAnswer = new UserAnswer({
      user: req.user.userId, // User ID from the JWT
      question: questionId,
      answer,
      timezone,
      submittedAt: new Date(),
    });

    await userAnswer.save();

    res.status(201).json({
      success: true,
      message: "Answer submitted successfully.",
      data: userAnswer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchQuestions = async (req, res) => {
  const { keyword, timezone, from, to } = req.query;
  try {
    // Convert the user ID to ObjectId
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const matchConditions = {};
    if (from || to) {
      matchConditions.submittedAt = {};
      if (from) matchConditions.submittedAt.$gte = new Date(new Date(from).toISOString());
      if (to) matchConditions.submittedAt.$lte = new Date(new Date(to).toISOString());
    }

    // Tokenize the keyword: Split by spaces and create regex for each word
    const tokens = keyword
      ? keyword.split(" ").map((word) => ({
        "questionDetails.questionText": {
          $regex: new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
        },
      }))
      : [];


    const results = await UserAnswer.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "questionDetails",
        },
      },
      { $unwind: "$questionDetails" },
      {
        $match: {
          ...matchConditions,
          user: userId, // Only answers submitted by this user
          ...(tokens.length > 0 && { $or: tokens }), // Match any token
        },
      },
      {
        $addFields: {
          submitTimeInTimezone: {
            $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$submittedAt", timezone },
          },
        },
      },
      {
        $project: {
          questionText: "$questionDetails.questionText",
          userAnswer: "$answer",
          submitTimeInTimezone: 1,
        },
      },
    ]);

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};