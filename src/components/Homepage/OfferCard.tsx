

import useFetchcontent from '../../Hooks/useFetchcontent';
import {Swiper} from 'swiper/react';
import { Navigation,Pagination } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import type { JSX } from 'react';





const OfferCard=():JSX.Element=>{
     const{data,loading,error}=useFetchcontent("/Data/Homepage.json")
if (loading) return <p>Loading content...</p>;
if (error) return <p>its an error:- {error}</p>;
if(!data || !data.Offers) return <p>no offers</p>
return(<>
<div className='w-full my-3 h-auto  '>
     <Swiper modules={[Navigation,Pagination]}
     centeredSlides={true}
     loop={true}
     navigation={true}
     pagination={{clickable:true}}
     breakpoints={
          {
               320:{
                    slidesPerView:1,
                    spaceBetween:40,
                    
               },
            640:{
               slidesPerView:1,
               spaceBetween:60,
            }  ,
            768:{
               slidesPerView:2,
               spaceBetween:40,
            },
            1024:{
               slidesPerView:3,
               spaceBetween:30,
            }
          }
     }
     className="mySwiper pb-10">
{data?.Offers.map((item)=>(
     <SwiperSlide key={item.id}>
<div key={item.id} className='Card flex-col border-2 border-[#eaddca] max-w-full h-auto mt-5 mb-10 text-center text-3xl py-2.5 px-2 bg-red-300 shadow-[0_10px_30px_-15px_rgba(180,150,100,0.3)] 
     transition-all duration-500 hover:border-amber-400 hover:translate-y-1 overflow-hidden'>
<h2 className='text-center text-amber-900 font-serif text-2xl tracking-wide'>{item.title}</h2>
<div className='group w-full min-h-auto aspect-video my-10 overflow-hidden '>
<img src={item.url} alt='Offers' className='w-full h-full border-1.5 object-contain transition-transform duration-300 ease-in-out group-hover:scale-150 hover:cursor-zoom-in' />
</div>
<div className='p-4 m-2'>
<p className='text-stone-600 leading-relaxed italic'>{item.description}</p>
</div>
<div className=' flex justify-center mt-1 mb-8 gap-3 items-center'>
<span className='text-2xl font-bold text-amber-800'>{item.price}</span>
<button className="px-5 py-2 bg-stone-900 text-[#f5efe6] rounded-full text-sm hover:bg-amber-900 transition-colors hover:cursor-pointer">
         Reserve Now
       </button>
       </div>
</div>
</SwiperSlide>
))
}
</Swiper>
</div>
</>
)
}



   



export default OfferCard;
