const mongoose = require("mongoose");
const fs = require("fs");
const Question = require("../models/Question");
const Category = require("../models/Category");
const UserAnswer = require("../models/UserAnswer");
const parseCSV = require("../utils/csvParser");

// Get Questions by Category
exports.getQuestionsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Fetch questions that belong to the specified category
    const questions = await Question.find({ categories: categoryId }).select(
      "questionText options"
    );

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "No questions found for this category." });
    }

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk Upload Questions via CSV
exports.bulkUploadQuestions = async (req, res) => {
  const { file } = req;

  try {
    const categories = await Category.find();
    const categoryMap = Object.fromEntries(categories.map(c => [c.name.toLowerCase(), c._id])); // Map category names to their IDs

    const questionsData = await parseCSV(file.path);

    const questions = questionsData.map((row) => {
      // Match categories from the CSV to database category IDs
      const categoryIds = row.categories.split(",").map(name => categoryMap[name.trim().toLowerCase()]);

      // Filter out any null values if a category name doesn't exist
      const validCategoryIds = categoryIds.filter(id => id);

      return {
        questionText: row.questionText,
        options: JSON.parse(row.options), // Ensure options are in JSON format
        categories: validCategoryIds,
      };
    });

    await Question.insertMany(questions);

    // Delete the uploaded file after successful processing
    fs.unlink(file.path, (err) => {
      if (err) console.error(`Error deleting file: ${file.path}`, err);
      else console.log(`File deleted: ${file.path}`);
    });

    res.status(201).json({ message: "Questions uploaded successfully!" });
  } catch (error) {
    // Attempt to delete the file even if an error occurs
    fs.unlink(file.path, (err) => {
      if (err) console.error(`Error deleting file: ${file.path}`, err);
    });

    res.status(500).json({ error: error.message });
  }
};

