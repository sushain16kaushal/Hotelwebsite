import { ChevronLeft,ChevronRight } from "lucide-react";
import { motion} from "framer-motion";
import { useCarousel } from "../../Hooks/useCarousel";
import type{ photos } from "../../types/content";


export const HeroSection =({gallery}:{gallery:photos[]})=>{

    const{items,next,prev}=useCarousel(gallery);
    return(
        <>
        <div className="carousel-container">
            <div className="carousel-grid">
{
    items.map((item,index)=>(
        <motion.div
        key={item.id}
        layoutId={String(item.id)}
        className={`grid-item ${index===0 ?'large-div':'small-div'} overflow-hidden`}
        transition={{
            type:'spring',
            stiffness:200,
            damping:25,
            mass:1.2
        }}>
            <motion.img
            layout
            src={item.url}
            className="w-full h-full object-cover"  />
              {index ===0 &&(
            <motion.div
            className="content-overlay"
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0}}
            transition={{delay:0.2}}
            >

        </motion.div>
        )}
        </motion.div>
      
    ))
}
            </div>
            <div className="controls">
<button onClick={prev} className="nav-btn" aria-label="Previous">
    <ChevronLeft 
      size={24} 
      strokeWidth={2.5} 
      color="white" 
    />
  </button>

  <button onClick={next} className="nav-btn" aria-label="Next">
    <ChevronRight 
      size={24} 
      strokeWidth={2.5} 
      color="white" 
    />
  </button>
            </div>
        </div>
        </>
    )
}

export default HeroSection;