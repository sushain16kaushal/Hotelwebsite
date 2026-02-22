
import type{ ContentData } from "../../types/content";

import OfferCard from "./OfferCard";
import Review from "./Review";

import { useOutletContext } from "react-router-dom";
import  { HeroSection } from "./HeroSection";




const Homepage=()=>{
    const data=useOutletContext<ContentData>();

    return (
      
        <>
    
        <div className="min-h-screen mt-10 ">
        <div className="py-10">
        <h2 className="text-center text-xl md:text-2xl text-gray-700 px-4 ">Every corner whispers elegance</h2>
        </div>
     <div className="w-full min-h-screen flex items-center justify-center px-4">
  <div className="w-full max-w-3xl ">
        <HeroSection gallery={data?.gallery ?? []} />
        </div>
        </div>
        <div className="w-full  z-0 mt-3 md:mt-6">
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
