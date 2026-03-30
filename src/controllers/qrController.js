import Business from '../models/Business.js';
import MenuItem from '../models/MenuItem.js';
import QRCode from 'qrcode';

export const getQRInfo = async (req, res) => {
  try {
    const { businessId } = req.params;
    const business = await Business.findById(businessId).select('-ownerId -totalRevenue -totalOrders -subscriptionPlan -paymentMethods');
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getQRImage = async (req, res) => {
  try {
    const { businessId } = req.params;
    
    // Check if business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Generate QR code targeting the frontend link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const qrTargetUrl = `${frontendUrl}/${businessId}`;

    // Generate base64 Data URI
    const qrDataUrl = await QRCode.toDataURL(qrTargetUrl);
    
    res.json({ qrCode: qrDataUrl, url: qrTargetUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server Error generating QR' });
  }
};

export const getMenu = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { category } = req.query;

    let query = { businessId, isAvailable: true };
    if (category) {
      query.category = category;
    }

    const mapFn = doc => {
        // Only return necessary fields
        return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            description: doc.description,
            category: doc.category,
            customizations: doc.customizations,
            addons: doc.addons,
            image: doc.image
        };
    };

    const items = await MenuItem.find(query).select('-businessId -createdAt -updatedAt -__v');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
