import { useDispatch } from 'react-redux';
import { addOfferBooking } from '../../store/bookingSlice';
import type{ offer } from '../../types/content';
import {Swiper} from 'swiper/react';
import { Autoplay, Navigation,Pagination } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import type { JSX } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';



const OfferCard = ({ offers }: { offers: offer[] }): JSX.Element => {
  const dispatch = useDispatch();

  const handleReserve = (item: any) => {
    dispatch(addOfferBooking(item));
    toast.success(`${item.title} reserved!`, {
      style: {
        border: '1px solid #bc9a7c',
        padding: '12px',
        color: '#4a3f35',
        background: '#faf9f6',
        borderRadius: '0.75rem',
        fontSize: '11px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      },
      iconTheme: { primary: '#bc9a7c', secondary: '#fff' },
    });
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {/* Container fix: Removed w-screen to prevent overflow, adjusted padding */}
      <div className="w-full my-2 h-auto py-6 md:py-10 bg-[#fdfaf5] overflow-hidden rounded-2xl">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          centeredSlides={true}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation={true}
          pagination={{ clickable: true }}
          breakpoints={{
            // Mobile: 1.1 slides dikhayenge taaki side waala card thoda sa dikhe (peek effect)
            320: {
              slidesPerView: 1.1,
              spaceBetween: 15,
            },
            // Tablet
            768: {
              slidesPerView: 1.8,
              spaceBetween: 30,
            },
            // Desktop
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          className="mySwiper pb-12 px-4 md:px-10"
        >
          {offers.map((item) => (
            <SwiperSlide key={item.id} className="transition-all duration-500 py-6">
              {({ isActive }) => (
                <div
                  className={`
                    relative flex flex-col border border-[#eaddca] rounded-2xl h-full
                    transition-all duration-700 ease-in-out bg-white
                    ${isActive 
                      ? 'scale-100 md:scale-105 shadow-xl opacity-100 blur-0 z-10' 
                      : 'scale-90 opacity-50 blur-[1px] md:blur-[2px] z-0'}
                  `}
                >
                  {/* Padding reduced for mobile */}
                  <div className="p-5 md:p-6 flex flex-col h-full">
                    <h2 className="text-center text-amber-900 font-serif text-xl md:text-2xl tracking-wide line-clamp-1">
                      {item.title}
                    </h2>

                    <div className="group relative w-full aspect-4/3 my-6 overflow-hidden rounded-xl bg-gray-50">
                      <img
                        src={`https://ik.imagekit.io/y4ytihgqk/${item.image}?tr=w-400,h-400`}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    <div className="mb-6 grow">
                      <p className="text-stone-600 text-sm md:text-base leading-relaxed italic line-clamp-3 text-center">
                        "{item.description}"
                      </p>
                    </div>

                    {/* Price & Button: Mobile par stack ya small flex */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto border-t border-stone-100 pt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-400 line-through">₹{item.price}</span>
                        <span className="text-xl font-bold text-amber-800">
                          ₹{Math.floor(item.price * 0.8)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleReserve(item)}
                        className="w-full sm:w-auto px-5 py-2 bg-stone-900 text-[#f5efe6] rounded-full text-xs font-semibold hover:bg-amber-900 transition-colors"
                      >
                        RESERVE NOW
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default OfferCard;
