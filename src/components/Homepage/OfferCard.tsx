

import useFetchcontent from '../../Hooks/useFetchcontent';
import {Swiper} from 'swiper/react';
import { Autoplay, Navigation,Pagination } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import type { JSX } from 'react';





const OfferCard=():JSX.Element=>{
     const{data,loading,error}=useFetchcontent("/Data/Homepage.json")
if (loading) return <p>Loading content...</p>;
if (error) return <p>its an error:- {error}</p>;
if(!data || !data.Offers) return <p>no offers</p>
return(
<>
<div className='w-screen my-2 h-auto p-10 bg-[#fdfaf5] overflow-hidden  '>
     <Swiper modules={[Navigation,Pagination,Autoplay]}
     centeredSlides={true}
     loop={true}
     autoplay={{delay:3000,disableOnInteraction:false}}
     navigation={true}
     pagination={{clickable:true}}
     breakpoints={
          {
               320:{
                    slidesPerView:1.2,
                    spaceBetween:20,
                    
               },
         
            768:{
               slidesPerView:2,
               spaceBetween:40,
            },
            1024:{
               slidesPerView:3,
               spaceBetween:50,
            }
          }
     }
     className="mySwiper pb-16 px-5">
{data?.Offers.map((item)=>(
     <SwiperSlide key={item.id} className='transition-all duration-500'>
   {({ isActive }) => (
     
              <div className={`
                relative flex flex-col border border-[#eaddca] rounded-2xl p-6 
                transition-all duration-700 ease-in-out
                ${isActive 
                  ? 'bg-white scale-105 shadow-[0_20px_50px_rgba(180,150,100,0.4)] opacity-100 blur-0 z-10' 
                  : 'bg-white/60 scale-90 opacity-40 blur-[2px] z-0'}
              `}>
<h2 className='text-center text-amber-900 font-serif text-2xl tracking-wide'>{item.title}</h2>
<div className='group relative w-full aspect-video my-10 overflow-hidden rounded-xl bg-gray-50 '>
<img src={item.url} alt='Offers' className='w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110 hover:cursor-zoom-in' />
</div>
<div className='p-4 m-2'>
<p className='text-stone-600 text-lg leading-relaxed italic'>{item.description}</p>
</div>
<div className=' flex justify-center mt-auto mb-8 gap-3 items-center px-4'>
<span className='text-2xl font-bold text-amber-800'>{item.price}</span>
<button className="px-6 py-2 bg-stone-900 text-[#f5efe6] rounded-full text-sm hover:bg-amber-900 transition-colors hover:cursor-pointer">
         Reserve Now
       </button>
       </div>
</div>
   )}
   
</SwiperSlide>
))
}
</Swiper>
</div>
</>
)
}



   



export default OfferCard;
