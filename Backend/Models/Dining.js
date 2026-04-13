import mongoose from "mongoose";

const diningSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  cuisine: String,
  description: String,
  timing: String,
  address: String,
  image: String, // Thumbnail/Main image name
  topItems: [String], // ["Siddu", "Madra", etc.]
  fullMenu: [
    {
      item: String,
      price: Number,
      category: String // e.g., "Himachali Special"
    }
  ]
}, { timestamps: true });

export default mongoose.model("Dining", diningSchema);