





export const HeroSection =()=>{   


  return (
    <div className="relative h-[120vh] w-full overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden">
      <div 
        className="bg-fixed top-0 left-0 w-full h-[120vh]  inset-0 -z-10 bg-cover bg-center bg-no-repeat" style={{backgroundImage:"url('/Images/HeroSection/Hotel-bg.jpg')"}}
      >
    
        <div className="absolute inset-0 bg-black/40" />
      </div>
   </div>
    
      <div className="relative flex h-full items-center justify-center text-white">
        <h1 className="text-5xl font-bold">Wake up in Bergen</h1>
      </div>

      
    </div>
  );


}
    


export default HeroSection;