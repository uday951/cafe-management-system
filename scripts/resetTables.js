import mongoose from 'mongoose';
import QRCode from 'qrcode';

const MONGODB_URI = 'mongodb+srv://udaydd6062_db_user:uday1234@cluster0.4fygtxp.mongodb.net/urbanflow?retryWrites=true&w=majority&appName=Cluster0';
const FRONTEND_URL = 'https://cafemanage.ignivance.in';
const BUSINESS_ID = '69ca84ef170e0a9d7c3d864b';

await mongoose.connect(MONGODB_URI);

const Table = mongoose.model('Table', new mongoose.Schema({
  businessId: mongoose.Schema.Types.ObjectId,
  tableNumber: Number,
  qrCode: String,
}));

// Delete all tables
await Table.deleteMany({});
console.log('🗑 All tables deleted');

// Recreate 3 tables
for (let i = 1; i <= 3; i++) {
  const qrUrl = `${FRONTEND_URL}/${BUSINESS_ID}/menu?table=${i}`;
  const qrCode = await QRCode.toDataURL(qrUrl);
  await Table.create({ businessId: BUSINESS_ID, tableNumber: i, qrCode });
  console.log(`✅ Table ${i} created → ${qrUrl}`);
}

console.log('✅ Done!');
process.exit(0);
