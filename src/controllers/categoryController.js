import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const { businessId } = req.query;
    if (!businessId) return res.status(400).json({ message: 'businessId required' });
    const cats = await Category.find({ businessId }).sort({ name: 1 });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { businessId, name } = req.body;
    const cat = await Category.create({ businessId, name });
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!cat) return res.status(404).json({ message: 'Not found' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
