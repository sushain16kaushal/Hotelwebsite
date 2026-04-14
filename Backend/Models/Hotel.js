import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  hotelId: { type: Number, required: true },
  hotelName: { type: String, required: true },
  address: String,
  image: String, // Main image link
  roomCategories: [
    {
      categoryName: String, // e.g., "Single Bed"
      guests: String,       // e.g., "1 Guest"
      categoryImages: [String], // Array of image names/links
      options: [
        {
          type: { type: String }, // "Standard", "Premium", "Luxury"
          pricePerNight: Number,
          features: [String]      // ["Wi-Fi", "Breakfast", etc.]
        }
      ]
    }
  ],
  // Extra fields (agar kisi hotel mein ho toh handle ho jayenge)
  category: String,
  guests: Number,
  type: String,
  pricePerNight: Number,
  Features: [String]
}, { timestamps: true });

export default mongoose.model("Hotel", hotelSchema);