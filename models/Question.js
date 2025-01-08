const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  categories: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", QuestionSchema);