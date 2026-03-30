import MenuItem from '../models/MenuItem.js';

// GET all menu items for a business (admin)
export const getMenuItems = async (req, res) => {
  try {
    const { businessId } = req.query;
    if (!businessId) return res.status(400).json({ message: 'businessId is required' });

    const items = await MenuItem.find({ businessId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST create new menu item
export const createMenuItem = async (req, res) => {
  try {
    const { businessId, name, price, category, description, image, customizations, addons, preparationTime } = req.body;

    const item = await MenuItem.create({
      businessId,
      name,
      price,
      category,
      description,
      image,
      customizations,
      addons,
      preparationTime,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;

    const item = await MenuItem.findByIdAndUpdate(itemId, updates, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// DELETE menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await MenuItem.findByIdAndDelete(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT toggle availability
export const toggleAvailability = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { isAvailable } = req.body;

    const item = await MenuItem.findByIdAndUpdate(itemId, { isAvailable }, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
