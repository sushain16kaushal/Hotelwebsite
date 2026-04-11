import type { JSX } from "react"
import type { Hotels } from "../../types/content"
import { useNavigate } from "react-router-dom";

const Room = ({ hotels }: { hotels: Hotels[] }): JSX.Element => {
  const navigate = useNavigate();

  const handleBookNow = (id: number) => {
    navigate(`/room/${id}`); 
  };

  const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <div className="mt-2 flex flex-wrap bg-[#f5f1ea] p-2 md:p-6 min-h-screen">
      {hotels.map((item, index) => (
        <div key={index} className="w-full md:w-1/2 p-3">
          
          <div className="group relative flex flex-col lg:flex-row border border-[#dcd0c0] p-6 rounded-[2.5rem] bg-[#faf9f6] shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-[#bc9a7c]/40 hover:-translate-y-1 h-full overflow-hidden">
            
            {/* Portrait Image */}
            <div className="w-full lg:w-64 lg:h-[22rem] h-72 shrink-0 rounded-[2rem] bg-[#fdfcfb] overflow-hidden relative shadow-md">
              <img
                src={`https://ik.imagekit.io/y4ytihgqk/${item.image}?tr=w-500,h-800,fo-auto,q-80`}
                alt={item.hotelName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/80 backdrop-blur-md text-[#4a3f35] text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  Euphoria Exclusive
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-between grow ml-0 lg:ml-8 mt-6 lg:mt-0 w-full">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[4px] text-[#bc9a7c] font-extrabold">
                    Shimla Heritage
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#4a3f35] leading-tight mt-1 group-hover:text-[#bc9a7c] transition-colors duration-300">
                    {item.hotelName}
                  </h2>
                </div>

                {/* Google Maps Link */}
                <a 
                  href={getGoogleMapsUrl(item.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 group/addr cursor-pointer no-underline"
                >
                  <svg className="w-4 h-4 text-[#bc9a7c] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <p className="text-[11px] md:text-xs font-medium text-[#8c7e6d] group-hover/addr:text-[#bc9a7c] transition-colors leading-snug">
                    {item.address}
                  </p>
                </a>

                {/* UPDATED FEATURES (New labels) */}
               <div className="flex gap-4 pt-2 border-t border-[#eaddca]/60">
  <div className="flex flex-col">
    <span className="text-[9px] uppercase text-[#bc9a7c] font-bold tracking-tighter">Architecture</span>
    <span className="text-[11px] font-semibold text-[#4a3f35]">British Era</span>
  </div>
  <div className="flex flex-col border-l border-[#eaddca] pl-4">
    <span className="text-[9px] uppercase text-[#bc9a7c] font-bold tracking-tighter">Vibe</span>
    <span className="text-[11px] font-semibold text-[#4a3f35]">Tranquil Retreat</span>
  </div>
</div>
              </div>
              
              {/* Bottom Action Button - Updated Text */}
              <div className="mt-8 pt-6 border-t border-[#eaddca]/30">
                <button
                  onClick={() => handleBookNow(item.hotelId)} 
                  className="w-full py-4 cursor-pointer bg-[#4a3f35] text-white rounded-2xl transition-all duration-300 hover:bg-[#bc9a7c] hover:shadow-xl active:scale-95 text-xs font-bold uppercase tracking-[2px] shadow-md"
                >
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

export default Room;