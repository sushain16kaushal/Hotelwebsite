import useFetchcontent from "../../Hooks/useFetchcontent"



import { EffectCards, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide  } from "swiper/react"
import OfferCard from "./OfferCard";
import Review from "./Review";
import type { JSX } from "react";



export const CascadeSlider=():JSX.Element=>{
     const{data,loading,error}=useFetchcontent("/Data/Homepage.json")
if (loading) return <p>Loading content...</p>;
if (error) return <p>its an error:- {error}</p>;
if(!data || !data.gallery) return <p>no images</p>
return(
    <div className="relative z-10 w-125 h-100 min-h-100 m-auto pt-10 pb-40 mySwiper  ">
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
      }}
     >
      {data?.gallery.filter(item=>item.url).map((item,index)=>(
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
    return (
      
        <>
    
        <div className="min-h-screen">
        <div>
        <h2 className="text-center text-2xl text-gray-700 mt-9">Every corner whispers elegance</h2>
        </div>
        <div className="w-full  z-10 overflow-visible min-h-100">
        <CascadeSlider />
        </div>
        <div className="w-full  z-0 mt-65">
          <h2 className="text-3xl text-center text-gray-700">Our offers</h2>
          <div className="flex my-3 w-full p-10">
        <OfferCard/>
        </div>
        </div>
       
        <div>
          <Review/>
        </div>
        </div>
        </>
    )
}

export default Homepage
