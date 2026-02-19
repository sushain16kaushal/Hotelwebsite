import { ChevronLeft,ChevronRight } from "lucide-react";
import { motion} from "framer-motion";
import { useCarousel } from "../../Hooks/useCarousel";
import type{ photos } from "../../types/content";


export const HeroSection =({gallery}:{gallery:photos[]})=>{

    const{items,next,prev}=useCarousel(gallery);
    return(
        <>
        <div className="carousel-container relative">
            <div className="carousel-grid relative">
{items.map((item,index)=>(
        <motion.div
        key={item.id}
        layout="position"
        layoutScroll={false}
        className={`grid-item ${index===0 ?'large-div':'small-div'} overflow-hidden relative`}
        transition={{
            type:'spring',
            stiffness:180,
            damping:24,
            mass:1.1
        }}>
            <motion.img
            layout
            src={item.url}
            alt="hero"
            loading={index ===0 ? "eager" : "lazy"}
            className="w-full h-full object-contain pointer-events-none"  />
                
            <motion.div
            key={item.id}
            className="content-overlay absolute top-0 left z-50 pointer-events-none h-full"
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0}}
            transition={{delay:0.2}}
            >
        </motion.div>
        
        
        
        </motion.div>
      
    ))
}
            </div>
            <div className="controls mt-2">
<button type="button"
onMouseDown={(e)=>
    e.preventDefault()
} 
onClick={(e)=>{
     e.currentTarget.blur();
    prev();
}} className="nav-btn" aria-label="Previous">
    <ChevronLeft 
      size={24} 
      strokeWidth={2.5} 
      color="white" 
    />
  </button>

  <button type="button"
  onMouseDown={(e)=>e.preventDefault()} onClick={(e)=>{
     e.currentTarget.blur();
  next(); }} className="nav-btn" aria-label="Next">
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