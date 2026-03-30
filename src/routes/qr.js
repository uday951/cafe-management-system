import express from 'express';
import { getQRInfo, getMenu, getQRImage } from '../controllers/qrController.js';

const router = express.Router();

router.get('/:businessId', getQRInfo);
router.get('/:businessId/image', getQRImage);
router.get('/:businessId/menu', getMenu);

export default router;
