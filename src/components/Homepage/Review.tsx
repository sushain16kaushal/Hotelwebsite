
import type{ Variants } from 'framer-motion';
import { motion} from 'framer-motion';
import type{ reviews } from '../../types/content';
import type { JSX } from 'react';
const containerVariants:Variants={
    hidden:{opacity:0},
    visible:{
        opacity:1,
        transition:{
            staggerChildren:0.2,
        },
    },
};
const cardVariants:Variants={
    hidden:{
   y:30,
   opacity:0
    },
    visible:{
        y:0,
        opacity:1,
    },
    exit:{
opacity:0,
y:-20,
transition:{duration:0.3}
    }
};



const Review=({reviews}:{reviews:reviews[]}):JSX.Element=>{
 
    return(
        <>
        <section className='p-6 md:p-10 h-auto m-4 md:m-10 rounded-3xl hover:translate-y-1 bg-emerald-100 overflow-hidden shadow-inner'>
          <h2 className="text-3xl text-center text-black font-serif mb-8">Customer Reviews</h2>
      <motion.div 
        className="review-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true }} 
      >
        {reviews.map((review) => (
          <motion.div 
            key={review.id}
            variants={cardVariants}
            whileHover={{y:-5,transition:{duration:0.2}}}
          className="
            bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)]
            ">
              <div className='flex gap-1'>
                {[...Array(review.rating)].map((_,i)=>(<motion.span
                key={i}
                initial={{scale:0,rotate:-30}}
                whileInView={{scale:1,rotate:0}}
                transition={{
                  type:"spring",
                  stiffness:260,
                  damping:20,
                  delay:i*0.1
                }}>
          ⭐
          </motion.span>))}
          
          </div>
            <p>"{review.text}"</p>
            <strong>- {review.name}</strong>
          </motion.div>
        ))}
      </motion.div>
        </section>
        </>
    )
}



export default Review
