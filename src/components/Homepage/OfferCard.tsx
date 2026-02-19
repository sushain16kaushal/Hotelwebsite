

import type{ offer } from '../../types/content';
import {Swiper} from 'swiper/react';
import { Autoplay, Navigation,Pagination } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import type { JSX } from 'react';





const OfferCard=({offers}:{offers:offer[]}):JSX.Element=>{

return(
<>
<div className='w-screen my-2 h-auto p-10 bg-[#fdfaf5] overflow-hidden rounded-2xl '>
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
               slidesPerView:1.8,
               spaceBetween:30,
            },
            1024:{
               slidesPerView:3,
               spaceBetween:50,
            }
          }
     }
     className="mySwiper pb-16 px-10">
{offers.map((item)=>(
     <SwiperSlide key={item.id} className='transition-all duration-500 py-10 '>
   {({ isActive }) => (
     
              <div className={`
                relative flex flex-col border border-[#eaddca]  p-6 rounded-2xl 
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
