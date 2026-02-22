
import {  AnimatePresence, motion} from "framer-motion";
import { useCarousel } from "../../Hooks/useCarousel";
import type{ photos } from "../../types/content";
import { useEffect } from "react";





export const HeroSection =({gallery}:{gallery:photos[]})=>{

    const{items,next}=useCarousel(gallery);
    useEffect(() => {
    const timer = setInterval(() => {
      next(); 
    }, 3000); 

    return () => clearInterval(timer);
  }, [next]);
    const containerVars ={
        initial:{opacity:0},
        animate:{
            opacity:1,
            transition:{
                staggerChildren:0.3,
                delayChildren:0.6
            },
        },
           exit:{
                opacity:0,
                transition:{duration:0.5}
            },
    };
    const wordVars={
        initial:{opacity:0,y:10},
        animate:{opacity:1,y:0},
    };
    
    return(
        <>
        <div className="carousel-container relative h-full w-full">
            <div className="carousel-grid relative h-full w-full overflow-hidden">
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
            fetchPriority={index === 0 ? "high" : "auto"}
            loading={index ===0 ? "eager" : "lazy"}
            decoding={index === 0 ? "sync" : "async"}
            className="w-full h-full object-cover pointer-events-none"  />
        
        {index===0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode ="wait">
            <motion.div
            key={item.id}
            variants={containerVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-wrap gap-x-3 px-10 items-start">
        {item.text.split(" ").map((word,i)=>(
            <motion.span
            key={i}
            variants={wordVars}
            className="text-white text-4xl md:text-6xl font-bold italic drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
        {word}
            </motion.span>
        ))}
            </motion.div>
        </AnimatePresence>
            </div>
        )}
        </motion.div>
      
    ))
}
            </div>
        </div>
        </>
    )
}

export default HeroSection;