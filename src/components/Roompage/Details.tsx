import { useParams } from "react-router-dom"
import { useOutletContext } from "react-router-dom";
import type { ContentData } from "../../types/content";
import { useState,useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
const Details = () => {
  const data = useOutletContext<ContentData>();
  const { id } = useParams<{ id: string }>();
  const hotelData = data?.hotels ?? [];
  


  const [selectedCatIndex, setSelectedCatIndex] = useState(0);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const hotel = hotelData.find((h) => h.hotelId === Number(id));
useEffect(() => {
    setActiveImgIndex(0);
    window.scrollTo(0, 0);
  }, [selectedCatIndex]);
  if (!hotel) return (
    <div className="h-screen flex items-center justify-center bg-[#f5f1ea]">
      <h2 className="text-2xl font-serif text-[#4a3f35]">Hotel not found!</h2>
    </div>
  );

  const category = hotel.roomCategories[selectedCatIndex];
const nextSlide = () => setActiveImgIndex((prev) => (prev + 1) % category.categoryImages.length);
const prevSlide = () => setActiveImgIndex((prev) => (prev - 1 + category.categoryImages.length) % category.categoryImages.length);
  return (
    <div className="min-h-screen bg-[#f5f1ea] pb-20">
      {/* --- HERO IMAGE SECTION (No Text Overlay) --- */}
      <section className="px-4 pt-6">
        <div className="relative w-full h-[70vh] md:h-[80vh] min-h-125 max-h-212.5 rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl border border-[#eaddca] bg-[#1a1a1a] group">
    
    <AnimatePresence mode="wait">
      <motion.img
        key={`${selectedCatIndex}-${activeImgIndex}`}
        src={`https://ik.imagekit.io/y4ytihgqk/${category.categoryImages[activeImgIndex]}?tr=w-1200,h-800,fo-auto,q-60,f-auto`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      
        className="w-full h-full object-cover" 
      />
    </AnimatePresence>
          <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-4 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40">
            ❮
          </button>
          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-4 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40">
            ❯
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {category.categoryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIndex(idx)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  activeImgIndex === idx ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- INFO SECTION --- */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-[#4a3f35]"
          >
            {hotel.hotelName}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#8c7e6d] italic mt-3 text-lg"
          >
            {hotel.address}
          </motion.p>
        </header>

        {/* --- CATEGORY TABS --- */}
        <section className="mb-12">
          <h3 className="text-[#4a3f35] font-semibold mb-6 uppercase tracking-widest text-sm">Select Room Category</h3>
          <div className="flex flex-wrap gap-4">
            {hotel.roomCategories.map((cat, idx) => (
              <button
                key={idx}
                onClick={(e) =>{
                  e.preventDefault();
                   setSelectedCatIndex(idx)}}
                className={`px-8 py-4 rounded-2xl border-2 transition-all duration-300 text-left min-w-[160px] ${
                  selectedCatIndex === idx
                    ? "bg-[#bc9a7c] border-[#bc9a7c] text-white shadow-lg scale-105"
                    : "bg-white border-[#eaddca] text-[#4a3f35] hover:border-[#bc9a7c]"
                }`}
              >
                <span className="block font-bold text-lg">{cat.categoryName}</span>
                <span className={`text-xs ${selectedCatIndex === idx ? "text-[#f5f1ea]" : "text-[#8c7e6d]"}`}>
                  {cat.guests}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* --- PRICING GRID --- */}
        <section className="max-w-6xl mx-auto px-6 mb-16">
  {/* Gap ko gap-8 rakha hai jo ki balanced dikhta hai */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
    <AnimatePresence mode="popLayout">
      {category?.options.map((opt, idx) => (
        <motion.div
          layout
          key={opt.type}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          // padding p-7 rakhi hai jo compact bhi hai aur spacious bhi
          className="bg-white/90 backdrop-blur-sm p-7 rounded-[35px] border border-[#eaddca] shadow-sm flex flex-col h-full hover:shadow-xl hover:border-[#bc9a7c]/50 transition-all duration-300 border-t-[5px] border-[#bc9a7c]"
        >
          {/* Header */}
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-[2px] text-[#bc9a7c] font-bold block mb-1">Select Plan</span>
            <h3 className="text-2xl font-serif font-bold text-[#4a3f35] leading-tight">{opt.type}</h3>
          </div>
          
          {/* Pricing */}
          <div className="mb-6 pb-5 border-b border-[#eaddca]/60">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-[#4a3f35]">₹{opt.pricePerNight}</span>
              <span className="text-[#8c7e6d] text-xs ml-1 font-medium">/ night</span>
            </div>
          </div>

          {/* Features - Spacing adjusted */}
          <ul className="space-y-3 mb-8 grow">
            {opt.features.map((f, i) => (
              <li key={i} className="flex items-start text-[#6d5f53] text-[13.5px] leading-snug">
                <span className="text-[#bc9a7c] mr-3 font-bold mt-0.5">✓</span> 
                {f}
              </li>
            ))}
          </ul>

          {/* Button */}
          <button className="w-full py-4 bg-[#4a3f35] text-white rounded-2xl text-sm font-bold hover:bg-[#bc9a7c] transition-all shadow-md active:scale-95 mt-auto">
            Reserve {opt.type}
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
</section>
      </div>
    </div>
  );
};

export default Details;
