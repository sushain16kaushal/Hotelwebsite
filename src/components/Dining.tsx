
import type { JSX } from "react";
import { useOutletContext } from "react-router-dom";
import type { ContentData } from "../types/content";
const DiningComponent = (): JSX.Element => {
    const data=useOutletContext<ContentData>();
  return (
    <div className="mt-2 flex flex-wrap bg-[#f5f1ea] p-2 md:p-6">
      {data.dinings.map((item, index) => (
        <div key={index} className="w-full md:w-1/2 p-3">
          
          {/* Card Container */}
          <div className="group relative flex flex-col lg:flex-row items-center lg:items-start border border-[#dcd0c0] p-5 rounded-3xl bg-[#faf9f6] shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#c2b280] hover:-translate-y-2 h-full">
            
            {/* Image Box */}
            <div className="w-full lg:w-56 lg:h-56 h-60 shrink-0 border border-[#eaddca] rounded-2xl bg-[#fdfcfb] overflow-hidden">
              <img
                src={item.image ? `https://ik.imagekit.io/y4ytihgqk/${item.image}?tr=w-300,h-300,fo-auto,q-80` : 'https://via.placeholder.com/500x500?text=Euphoria+Dining'}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-between grow ml-0 lg:ml-6 mt-5 lg:mt-0 text-center lg:text-left w-full h-full">
              <div>
                {/* Timing Badge */}
                <span className="inline-block text-[10px] uppercase tracking-tighter bg-[#eaddca] text-[#4a3f35] px-2 py-0.5 rounded-md mb-2">
                  {item.timing}
                </span>

                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4a3f35] leading-tight">
                  {item.name}
                </h2>
                
                <p className="text-sm font-semibold text-[#bc9a7c] mt-1 italic">
                  {item.cuisine}
                </p>
                
                <p className="text-xs md:text-sm text-[#8c7e6d] mt-3 font-medium">
                  {item.address}
                </p>
              </div>
              
              <div className="mt-6">
                <button className="w-full lg:w-auto px-10 py-2.5 bg-[#bc9a7c] text-white rounded-full transition-all duration-300 cursor-pointer hover:bg-[#a67c52] hover:shadow-lg active:scale-95 text-sm font-bold shadow-md uppercase tracking-wider">
                  Choose Us
                </button>
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default DiningComponent;
