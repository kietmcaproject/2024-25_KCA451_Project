// pages/api/donations.js
import connectDB from '../../utils/connectDB';
import Donation from '../../models/Donation';

connectDB();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch donations from the database
      const donations = await Donation.find();
      res.status(200).json(donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
      res.status(500).json({ message: 'Failed to fetch donations' });
    }
  } else if (req.method === 'POST') {
    try {
      // Create a new donation object from the request body
      const { item, quantity, name, phone, message, address, pincode, location } = req.body;

      // Validate incoming data
      if (!item || !quantity || !name || !phone || !address || !pincode) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Create a new donation and save it to the database
      const newDonation = new Donation({
        item,
        quantity,
        name,
        phone,
        message,
        address,
        pincode,
        location,
      });

      await newDonation.save();
      res.status(201).json(newDonation);
    } catch (error) {
      console.error('Error creating donation:', error);
      res.status(500).json({ message: 'Failed to save donation' });
    }
  } else {
    // Handle unsupported methods
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
