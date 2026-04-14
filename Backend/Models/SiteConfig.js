import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema({
  hero: {
    title: String,
    subtitle: String,
    navbar: {
      home: String,
      Hotels: String,
      Dining: String,
      booking: String,
      contact: String
    }
  },
  reeldata: [
    {
      id: Number,
      title: String,
      tag: String,
      videoUrl: String,
      posterUrl: String
    }
  ],
  Offers: [
    {
      id: String,
      title: String,
      description: String,
      price: String, // String rakha hai kyunki JSON mein "19999" hai
      image: String
    }
  ],
  Reviews: [
    {
      id: Number,
      name: String,
      text: String,
      rating: Number
    }
  ],
  Footer: {
    text1: String,
    text2: String
  }
}, { timestamps: true });

export default mongoose.model("SiteConfig", siteConfigSchema);