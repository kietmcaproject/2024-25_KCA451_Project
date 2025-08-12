// utils/models/Donation.js
import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  item: { type: String, required: true },
  quantity: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  amount: { type: Number, required: false },  // Make amount optional
}, { timestamps: true });

export default mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
