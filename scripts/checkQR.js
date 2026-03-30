import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://udaydd6062_db_user:uday1234@cluster0.4fygtxp.mongodb.net/urbanflow?retryWrites=true&w=majority&appName=Cluster0';
const BUSINESS_ID = '69ca84ef170e0a9d7c3d864b';

await mongoose.connect(MONGODB_URI);

const Table = mongoose.model('Table', new mongoose.Schema({
  businessId: mongoose.Schema.Types.ObjectId,
  tableNumber: Number,
  qrCode: String,
}));

const tables = await Table.find({ businessId: BUSINESS_ID });
console.log('Total tables:', tables.length);
for (const t of tables) {
  console.log(`Table ${t.tableNumber} qrCode preview:`, t.qrCode?.substring(0, 100));
}
process.exit(0);
