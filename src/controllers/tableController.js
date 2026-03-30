import Table from '../models/Table.js';
import QRCode from 'qrcode';

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://cafemanage.ignivance.in';

export const getTables = async (req, res) => {
  try {
    const { businessId } = req.query;
    if (!businessId) return res.status(400).json({ message: 'businessId required' });
    const tables = await Table.find({ businessId }).sort({ tableNumber: 1 });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createTable = async (req, res) => {
  try {
    const { businessId } = req.body;
    if (!businessId) return res.status(400).json({ message: 'businessId required' });

    const last = await Table.findOne({ businessId }).sort({ tableNumber: -1 });
    const tableNumber = last ? last.tableNumber + 1 : 1;

    const qrUrl = `${FRONTEND_URL}/${businessId}/menu?table=${tableNumber}`;
    const qrCode = await QRCode.toDataURL(qrUrl);

    const table = await Table.create({ businessId, tableNumber, qrCode });
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const regenerateQRCodes = async (req, res) => {
  try {
    const { businessId } = req.body;
    if (!businessId) return res.status(400).json({ message: 'businessId required' });

    const FRONTEND_URL_USED = process.env.FRONTEND_URL || FRONTEND_URL;
    const tables = await Table.find({ businessId });

    for (const table of tables) {
      const qrUrl = `${FRONTEND_URL_USED}/${businessId}/menu?table=${table.tableNumber}`;
      table.qrCode = await QRCode.toDataURL(qrUrl);
      await table.save();
    }

    res.json({ message: `Regenerated ${tables.length} QR codes`, frontendUrl: FRONTEND_URL_USED });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
