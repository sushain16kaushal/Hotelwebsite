import useFetchcontent from "../../Hooks/useFetchcontent"
import type React from "react"

import { EffectCards, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide  } from "swiper/react"



export const CascadeSlider:React.FC=()=>{
     const{data,loading,error}=useFetchcontent("public/Data/Homepage.json")
if (loading) return <p>Loading content...</p>;
if (error) return <p>its an error:- {error}</p>;
if(!data || !data.gallery) return <p>no images</p>
return(
    <div className="w-125 h-50 m-auto pt-10 mySwiper">
        <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards,Navigation]}
      navigation={{
        nextEl:'.next-btn',
        prevEl:'.prev-btn'
      }}
     >
      {data?.gallery.map((item)=>(
        <SwiperSlide key={item.id} className=" aspect-square rounded-2xl overflow-hidden  ">
            <img
            src={item.url} alt="Hotel Gallery" className="w-full h-full object-cover " 
           />
        </SwiperSlide>
      ))}
     </Swiper>
<div className="flex gap-4 justify-center mt-5">
<button className="prev-btn px-8 py-3 rounded-full font-semibold text-slate-900 bg-linear-to-r from-[#bfa76a] to-[#d4af37] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden cursor-pointer">Prev</button>
<button className="next-btn px-8 py-3 rounded-full font-semibold text-slate-900 bg-linear-to-r from-[#bfa76a] to-[#d4af37] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden cursor-pointer">Next</button>
</div>
    </div>
);
};

function Homepage() {
    return (
        <>
        <h2 className="text-center text-2xl text-amber-700 mt-9">Every corner whispers elegance</h2>
        <CascadeSlider />
        </>
    )
}

export default Homepage
