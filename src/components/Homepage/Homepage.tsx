
import type{ ContentData } from "../../types/content";
import type{ photos } from "../../types/content";

import { EffectCards, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide  } from "swiper/react"
import OfferCard from "./OfferCard";
import Review from "./Review";
import type { JSX } from "react";
import { useOutletContext } from "react-router-dom";

interface CascadeSliderProps {
  gallery: photos[];
}

export const CascadeSlider=({gallery}:CascadeSliderProps):JSX.Element=>{
     
return(
    <div className="relative z-10 w-[85%] sm:w-100 aspect-square min-h-100 m-auto  mb-10 mySwiper  ">
        <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards,Navigation]}
        loop={false}
        rewind={false}
        lazyPreloadPrevNext={1}
      navigation={true}
      cardsEffect={{
        slideShadows:false,
        rotate:true,
        perSlideOffset:8,
        perSlideRotate:2,
      }}
      className="mySwiper h-full w-full"
     >
      {gallery.filter(item=>item.url).map((item,index)=>(
        <SwiperSlide key={item.id} className=" aspect-square rounded-2xl overflow-hidden">
            <img
            src={item.url} alt="Hotel Gallery" width="400" height="400" className="w-full h-full object-cover" loading={index < 2 ? "eager":"lazy" } {...(index < 2 ? { fetchPriority: "high" } : {})}/>
        </SwiperSlide>
      ))}
     </Swiper>

    </div>
);
};


const Homepage=()=>{
    const data=useOutletContext<ContentData>();

    return (
      
        <>
    
        <div className="min-h-screen mt-10">
        <div className="py-10">
        <h2 className="text-center text-xl md:text-2xl text-gray-700 px-4 ">Every corner whispers elegance</h2>
        </div>
        <div className="w-full z-10 overflow-hidden px-4">
        <CascadeSlider gallery={data?.gallery ?? []} />
        </div>
        <div className="w-full  z-0 mt-10 md:mt-24">
          <h2 className="text-2xl md:text-3xl text-center text-gray-800 font-serif">Our offers</h2>
          <div className="flex my-3 w-full p-4 md:p-10">
        <OfferCard offers={data?.Offers ?? []}/>
        </div>
        </div>
        <div className="pb-10">
          <Review reviews={data?.Reviews ?? []}/>
        </div>
        </div>
        </>
    )
}

export default Homepage
