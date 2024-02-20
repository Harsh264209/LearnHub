
const Category = require('../Models/Category'); // Assuming Category schema is defined in a separate file
const slugify=require('slugify')


// Controller functions for CRUD operations
const createCategory = async (req, res) => {
  try {
    const {name}=req.body
    const category = new Category({name,slug:slugify(name)});
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) throw new Error('Category not found');
    res.json(category);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {

    const {name}=req.body
    const category = await Category.findByIdAndUpdate(req.params.id, {name,slug:slugify(name)}, { new: true });
    if (!category) throw new Error('Category not found');
    res.json(category);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new Error('Category not found');
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};


const getAllCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = {
    createCategory,
    getAllCategories, // Added function to export
    getCategory,
    updateCategory,
    deleteCategory
  };
