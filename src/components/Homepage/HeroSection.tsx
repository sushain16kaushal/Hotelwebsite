

import { useState,useEffect } from "react";

const Counter = ({ target }: { target: number }) =>
     { const [count, setCount] = useState(0); 
        useEffect(() => { let start = 0; const duration = 2000; // 2 sec 
        const increment = target / (duration / 16);
         const timer = setInterval(() => { start += increment; 
            if (start >= target) { setCount(target); 
                clearInterval(timer); } 
            else { setCount(Math.floor(start)); } }, 16);
             return () => clearInterval(timer); }, [target]);
              return <span>{count}</span>; };
               

export const HeroSection =()=>{   

const [resetKey, setResetKey] = useState(0);
  return (
    <div className="relative h-[120vh] w-full overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden">
      <div 
        className="bg-fixed top-0 left-0 w-full h-[120vh]  inset-0 -z-10 bg-cover bg-center bg-no-repeat" style={{backgroundImage:"url('/Images/HeroSection/Hotel-bg.jpg')"}}
      >
    
        <div className="absolute inset-0 bg-black/40" />
      </div>
   </div>
    
      <div className="relative flex h-full items-center justify-center text-white animate-fadeUp">
       <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight"
    style={{ fontFamily: "Playfair Display, serif" }}
>
  Step into a space where comfort embraces you,
  <br />
  <span className="text-lg md:text-xl font-light"
        style={{ fontFamily: "Inter, sans-serif" }}>
    and every night feels like a peaceful escape.
  </span>
</h1>
<div className="absolute bottom-10 w-full flex justify-center gap-10 text-white text-xl">

  <div  className="animate-fadeUp"
    onAnimationIteration={() => {
      setResetKey((prev) => prev + 1);
    }}>
    <Counter key={resetKey} target={500} />+
    <p>Guests</p>
  </div>

  <div  className="animate-fadeUp"
  onAnimationIteration={() => {
      setResetKey((prev) => prev + 1);
    }}>
    <Counter key={resetKey} target={120} />+
    <p>Rooms</p>
  </div>

  <div className="animate-fadeUp"
   onAnimationIteration={() => {
      setResetKey((prev) => prev + 1);
    }}>
    <Counter  key={resetKey} target={20} />+
    <p>Awards</p>
  </div>

</div>
      </div>
    </div>
  );


}
    


export default HeroSection;