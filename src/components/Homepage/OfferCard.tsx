
import type React from 'react';
import useFetchcontent from '../../Hooks/useFetchcontent';
import {Swiper} from 'swiper/react';
import { Navigation,Pagination } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';




const OfferCard:React.FC<any> =()=>{
     const{data,loading,error}=useFetchcontent("public/Data/Homepage.json")
if (loading) return <p>Loading content...</p>;
if (error) return <p>its an error:- {error}</p>;
if(!data || !data.Offers) return <p>no offers</p>
return(<>
<div className='w-full mt-5'>
     <Swiper modules={[Navigation,Pagination]}
     spaceBetween={50}
     slidesPerView={1.3}
     centeredSlides={true}
     loop={true}
     navigation={true}
     pagination={{clickable:true}}
     className="mySwiper pb-10">
{data?.Offers.map((item)=>(
     <SwiperSlide key={item.id}>
<div key={item.id} className='Card flex-col border-2 border-[#eaddca] max-w-full h-auto mt-5 mb-5 text-center text-3xl py-2.5 px-2 bg-linear-to-br from-[#fdfbf7] via-[#f5efe6] to-[#e2d5c3] shadow-[0_10px_30px_-15px_rgba(180,150,100,0.3)] 
     transition-all duration-500 hover:border-amber-400 hover:translate-y-1 overflow-hidden'>
<h2 className='text-center text-amber-900 font-serif text-2xl tracking-wide'>{item.title}</h2>
<div className='group w-full h-96 my-5 overflow-hidden '>
<img src={item.url} rel="" className='w-full h-full border-1.5 object-contain transition-transform duration-300 ease-in-out group-hover:scale-150 hover:cursor-zoom-in' />
</div>
<p className='text-stone-600 leading-relaxed italic'>{item.description}</p>
<div className=' flex justify-center mt-1 gap-3 items-center'>
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
