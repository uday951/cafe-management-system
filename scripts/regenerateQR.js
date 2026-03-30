import mongoose from 'mongoose';
import QRCode from 'qrcode';

const MONGODB_URI = 'mongodb+srv://udaydd6062_db_user:uday1234@cluster0.4fygtxp.mongodb.net/urbanflow?retryWrites=true&w=majority&appName=Cluster0';
const BUSINESS_ID = '69ca84ef170e0a9d7c3d864b';
const FRONTEND_URL = 'https://cafe-management-frontend-27wf.onrender.com';

await mongoose.connect(MONGODB_URI);

const Table = mongoose.model('Table', new mongoose.Schema({
  businessId: mongoose.Schema.Types.ObjectId,
  tableNumber: Number,
  qrCode: String,
}));

const tables = await Table.find({ businessId: BUSINESS_ID }).sort({ tableNumber: 1 });
console.log(`Found ${tables.length} tables`);

for (const table of tables) {
  const qrUrl = `${FRONTEND_URL}/${BUSINESS_ID}/menu?table=${table.tableNumber}`;
  table.qrCode = await QRCode.toDataURL(qrUrl);
  await table.save();
  console.log(`✅ Table ${table.tableNumber} → ${qrUrl}`);
}

console.log('✅ All QR codes updated!');
process.exit(0);
