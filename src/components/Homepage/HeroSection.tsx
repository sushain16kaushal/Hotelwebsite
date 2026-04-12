import { useState, useEffect } from "react";

const Counter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
};

export const HeroSection = () => {
  const [resetKey, setResetKey] = useState(0);

  return (
    // Height optimized: Mobile pe 100vh enough hai, desktop pe 120vh look deta hai
    <div className="relative h-[100vh] md:h-[120vh] w-full overflow-hidden">
      
      {/* Background Section */}
      <div className="absolute inset-0">
        <div
          className="bg-fixed w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700"
          style={{ backgroundImage: "url('/Images/HeroSection/Hotel-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative flex flex-col h-full items-center justify-center px-6 text-center text-white">
        
        {/* Heading Section */}
        <div className="animate-fadeUp space-y-4 max-w-4xl">
          <h1 
            className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Step into a space where comfort embraces you
          </h1>
          <p 
            className="text-base md:text-xl font-light opacity-90 block"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            and every night feels like a peaceful escape.
          </p>
        </div>

        {/* Stats Section: Mobile pe grid use kiya hai */}
        <div className="absolute bottom-12 md:bottom-20 w-full max-w-5xl px-4">
          <div className="grid grid-cols-3 gap-4 md:gap-10 text-white">
            
            {/* Stat Item Wrapper */}
            {[
              { label: "Guests", target: 500 },
              { label: "Rooms", target: 120 },
              { label: "Awards", target: 20 },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="animate-fadeUp flex flex-col items-center"
                onAnimationIteration={() => setResetKey((prev) => prev + 1)}
              >
                <div className="text-2xl md:text-4xl font-bold font-serif">
                  <Counter key={resetKey} target={stat.target} />+
                </div>
                <p className="text-[10px] md:text-sm uppercase tracking-[2px] mt-1 opacity-80">
                  {stat.label}
                </p>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;