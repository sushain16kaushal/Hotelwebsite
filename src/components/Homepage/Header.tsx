import type{ Herodata } from "../../types/content";
import { NavLink } from "react-router-dom";
import {useRef,useState,useEffect, type JSX} from "react";
import { Menu, X } from 'lucide-react'
import { useNavigate } from "react-router-dom";
const Header=({hero}:{hero:Herodata}):JSX.Element=>{
   const[isScrolled,setIsScrolled]=useState(false);
   const[isOpen,setIsOpen]=useState(false);
   const menuRef=useRef<HTMLDivElement>(null);

   useEffect(()=>{
      const handleScroll =()=> setIsScrolled(window.scrollY>80);
      const handleClickOutside=(e:MouseEvent)=>{
         if(menuRef.current && !menuRef.current.contains(e.target as Node))
          setIsOpen(false);
      };
      window.addEventListener('scroll',handleScroll);
      window.addEventListener('mousedown',handleClickOutside)
      return ()=> {window.removeEventListener('scroll',handleScroll);
         window.removeEventListener('mousedown',handleClickOutside);
      }
   },[]);
  const navigate = useNavigate();
    return (
     <div>
        {hero && (
     <section>
      <div className="pt-30">
        <h1 className="text-3xl text-neutral-900 text-center mt-1">{hero.title}</h1>
        <h2 className="text-2xl text-neutral-700 text-center mt-1.5">{hero.subtitle}</h2>
        </div>
        <nav className={`fixed top-6 left-0 right-0 z-100 flex justify-center px-4 pointer-events-none ${isScrolled ? 'justify-end' :`justify-center`}`}>
        <div 
        ref={menuRef}
        className={`relative pointer-events-auto flex items-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border border-stone-200/50 shadow-lg ${isOpen ? 'overflow-visible' : 'overflow-hidden'} ${isScrolled?'w-14 h-14 rounded-full bg-stone-900 justify-center cursor-pointer hover:scale-110':'w-full max-w-4xl h-16 rounded-full bg-white/80 backdrop-blur-md px-6 justify-between'}`} onClick={()=>isScrolled && setIsOpen(!isOpen)}>
         {isScrolled && (
            <div className="text-white">
               {isOpen ? <X size={20}/> :<Menu size={20}/>}
               </div>
         )}
        
        {!isScrolled && (
         <>
          <span className="text-xl font-serif font-bold text-amber-900 tracking-tighter">
            Euphoria<span className="text-stone-500 font-light">.</span>
          </span>
          <ul className="hidden md:flex gap-8">
                 <NavLink to={"/"} className={({isActive})=>
         `duration-200 ${isActive ? "text-amber-700" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{hero.navbar.home}</NavLink>
          <NavLink to={"/room"} className={({isActive})=>
         `duration-200 ${isActive ? "text-amber-700" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{hero.navbar.Hotels}</NavLink>
            <NavLink to={"/dining"} className={({isActive})=>
         `duration-200 ${isActive ? "text-amber-700" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{hero.navbar.Dining}</NavLink>
             <NavLink to={"/booking"} className={({isActive})=>
         `duration-200 ${isActive ? "text-amber-700" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{hero.navbar.booking}</NavLink>
             <NavLink to={"/contact"} className={({isActive})=>
         `duration-200 ${isActive ? "text-amber-700" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{hero.navbar.contact}</NavLink>
          </ul>
          </>
        )}
      <div className={`
  absolute top-16 right-0 w-64 
  bg-white/90 backdrop-blur-xl 
  border border-amber-100/50 
  rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] 
  p-5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
  flex flex-col gap-1 z-50
  ${isOpen && isScrolled 
    ? 'opacity-100 scale-100 translate-y-0' 
    : 'opacity-0 scale-90 -translate-y-4 pointer-events-none'}
`} 
onClick={(e) => e.stopPropagation()}>
    
    {/* Menu Links with hover effect */}
    {[
      { to: "/", label: hero.navbar.home },
      { to: "/room", label: hero.navbar.Hotels },
      { to: "/dining", label: hero.navbar.Dining },
      { to: "/booking", label: hero.navbar.booking },
      { to: "/contact", label: hero.navbar.contact }
    ].map((link) => (
    <NavLink 
  key={link.to}
  to={link.to} 
  className={({ isActive }) => `
    px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-[2px] transition-all duration-300
    
    /* Blue color hatane ke liye ye 3 classes zaroori hain */
    select-none 
    outline-none 
    tap-highlight-transparent

    ${isActive 
      ? "bg-amber-50 text-amber-800" 
      : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"}
  `}
  /* Click ke baad focus hatane ke liye */
  style={{ WebkitTapHighlightColor: 'transparent' }}
>
  {link.label}
</NavLink>
    ))}

    {/* Bottom Button Section */}
    <div className="border-t border-stone-100 mt-3 pt-4 px-2">
      <button 
        onClick={() => navigate('/room')} 
        className="w-full py-3 bg-stone-900 text-[#f5efe6] rounded-xl text-[10px] font-bold uppercase tracking-[2px] shadow-lg hover:bg-amber-900 transition-all active:scale-95 cursor-pointer"
      >
        Book A Stay
      </button>
    </div>
</div>
        </div>
        </nav>
     </section>
        )}

     </div>
    );
   }

export default Header
