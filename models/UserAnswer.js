const mongoose = require("mongoose");

const UserAnswerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  answer: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  timezone: { type: String },
});

module.exports = mongoose.model("UserAnswer", UserAnswerSchema);