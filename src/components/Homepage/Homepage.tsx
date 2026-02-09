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
    <div className="w-200 h-100 m-auto pt-10 mySwiper">
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
        <SwiperSlide key={item.id} className="border-r-20 overflow-hidden w-75 h-100 ">
            <img
            src={item.url} alt="Hotel Gallery" className="w-full h-100 object-contain " 
            onLoad={() => console.log("Image Loaded")} // Debugging line
      onError={(e) => console.log("Image Error", e)}/>
        </SwiperSlide>
      ))}
     </Swiper>
<div className="flex gap-4 justify-center mt-5">
<button className="prev-btn bg-gray-200 p-2">Prev</button>
<button className="next-btn bg-gray-200 p-2">Next</button>
</div>
    </div>
);
};

function Homepage() {
    return (
        <>
        <h1>Homepage</h1>
        <CascadeSlider />
        </>
    )
}

export default Homepage
