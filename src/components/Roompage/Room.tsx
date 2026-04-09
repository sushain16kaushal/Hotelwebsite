import type { JSX } from "react"
import type { Hotels } from "../../types/content"
import { useNavigate } from "react-router-dom";
const Room = ({ hotels }: { hotels: Hotels[] }): JSX.Element => {
  const navigate = useNavigate();
  const handleBookNow = (id: number) => {
    navigate(`/room/${id}`); 
  };
  return (
    <div className="mt-2 flex flex-wrap bg-[#f5f1ea] p-2 md:p-6">
      {hotels.map((item, index) => (
      
        <div key={index} className="w-full md:w-1/2 p-3">
          
          <div className="group relative flex flex-col lg:flex-row items-center lg:items-start border border-[#dcd0c0] p-5 rounded-3xl bg-[#faf9f6] shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#c2b280] hover:-translate-y-2 h-full">
            
          
            <div className="w-full lg:w-56 lg:h-56 h-64 shrink-0 border border-[#eaddca] rounded-2xl bg-[#fdfcfb] overflow-hidden">
              <img
                src={`https://ik.imagekit.io/y4ytihgqk/${item.image}?tr=w-600,h-600,fo-auto,q-80`}
                alt={item.hotelName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-between grow ml-0 lg:ml-6 mt-5 lg:mt-0 text-center lg:text-left w-full">
              <div>
              
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4a3f35] leading-tight">
                  {item.hotelName}
                </h2>
                <p className="text-sm text-[#8c7e6d] mt-2 italic">
                  {item.address}
                </p>
              </div>
              
              <div className="mt-auto">
                <button
                onClick={()=>handleBookNow(item.hotelId)} className="mt-6 w-full lg:w-auto px-10 py-3 bg-[#bc9a7c] text-white rounded-full transition-all duration-300 cursor-pointer hover:bg-[#a67c52] hover:shadow-lg active:scale-95 text-sm md:text-base font-semibold shadow-md">
                  Book Here
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Room