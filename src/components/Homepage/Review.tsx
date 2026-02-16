
import type{ Variants } from 'framer-motion';
import { motion} from 'framer-motion';
import useFetchcontent from '../../Hooks/useFetchcontent';
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



const Review=()=>{
 const{data,loading,error}=useFetchcontent("/Data/Homepage.json")
if (loading) return <p>Loading content...</p>;
if (error) return <p>its an error:- {error}</p>;
if(!data || !data.Offers) return <p>no offers</p>
    return(
        <>
        <section className='p-10 h-auto m-10 rounded-3xl hover:translate-y-1 bg-emerald-100 overflow-hidden'>
          <h2 className="text-3xl text-center text-black">Customer Reviews</h2>
      <motion.div 
        className="review-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true }} 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '40px'
        }}
      >
        {data.Reviews.map((review) => (
          <motion.div 
            key={review.id}
            variants={cardVariants}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
          >
            <div className="stars">{"⭐".repeat(review.rating)}</div>
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
