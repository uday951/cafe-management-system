import mongoose from 'mongoose';
import QRCode from 'qrcode';

const MONGODB_URI = 'mongodb+srv://udaydd6062_db_user:uday1234@cluster0.4fygtxp.mongodb.net/urbanflow?retryWrites=true&w=majority&appName=Cluster0';
const FRONTEND_URL = 'https://cafemanage.ignivance.in';

await mongoose.connect(MONGODB_URI);

const Table = mongoose.model('Table', new mongoose.Schema({
  businessId: mongoose.Schema.Types.ObjectId,
  tableNumber: Number,
  qrCode: String,
}));

const tables = await Table.find({});
console.log('Total tables found:', tables.length);

for (const table of tables) {
  const qrUrl = `${FRONTEND_URL}/${table.businessId}/menu?table=${table.tableNumber}`;
  table.qrCode = await QRCode.toDataURL(qrUrl);
  await table.save();
  console.log(`✅ Table ${table.tableNumber} (business: ${table.businessId}) → ${qrUrl}`);
}

console.log('✅ All QR codes updated!');
process.exit(0);
