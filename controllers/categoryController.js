const Category = require("../models/Category");
const Question = require("../models/Question");
const { successResponse, errorResponse } = require("../utils/response");

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(successResponse(categories, "Categories retrieved successfully."));
  } catch (error) {
    res.status(500).json(errorResponse(error));
  }
};

// Get Category Stats (Category with Question Count)
exports.getCategoryStats = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "categories",
          as: "questions",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          questionCount: { $size: "$questions" },
        },
      },
    ]);
    res.json(successResponse(categories, "Category stats retrieved successfully."));
  } catch (error) {
    res.status(500).json(errorResponse(error));
  }
};

// Create Category
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    // Check if the category name already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({ error: "Category name already exists. Please choose a different name." });
    }
    
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    res.status(500).json(errorResponse(error));
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();
    res.json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    res.status(500).json(errorResponse(error));
  }
};