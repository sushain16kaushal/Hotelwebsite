import type{ Herodata } from "../../types/content";
import { NavLink, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, type JSX } from "react";
import { Menu, X, User } from 'lucide-react'; // User icon add kiya
import { useAuth } from "../../context/AuthContext"; // useAuth import karo

const Header = ({ hero }: { hero: Herodata }): JSX.Element => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Auth state nikaalo
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  return (
    <div>
      {hero && (
        <section>
          <div className="pt-30">
            <h1 className="text-3xl text-neutral-900 text-center mt-1">{hero.title}</h1>
            <h2 className="text-2xl text-neutral-700 text-center mt-1.5">{hero.subtitle}</h2>
          </div>
          
          <nav className={`fixed top-6 left-0 right-0 z-100 flex px-4 pointer-events-none transition-all duration-500 ${isScrolled ? 'justify-end' : `justify-center`}`}>
            <div
              ref={menuRef}
              className={`relative pointer-events-auto flex items-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border border-stone-200/50 shadow-lg ${isOpen ? 'overflow-visible' : 'overflow-hidden'} ${isScrolled ? 'w-14 h-14 rounded-full bg-stone-900 justify-center cursor-pointer hover:scale-110' : 'w-full max-w-5xl h-16 rounded-full bg-white/80 backdrop-blur-md px-8 justify-between'}`} 
              onClick={() => isScrolled && setIsOpen(!isOpen)}
            >
              {isScrolled && (
                <div className="text-white">
                  {isOpen ? <X size={20} /> : (user?.profilePic ? <img src={user.profilePic} className="w-8 h-8 rounded-full border border-amber-500" /> : <Menu size={20} />)}
                </div>
              )}

              {!isScrolled && (
                <>
                  <span className="text-xl font-serif font-bold text-amber-900 tracking-tighter">
                    Euphoria<span className="text-stone-500 font-light">.</span>
                  </span>
                  
                  <ul className="hidden md:flex gap-8 items-center">
                    <NavLink to={"/"} className={({ isActive }) => `text-[11px] font-bold uppercase tracking-widest duration-200 ${isActive ? "text-amber-700" : "text-gray-400 hover:text-stone-900"}`}>{hero.navbar.home}</NavLink>
                    <NavLink to={"/room"} className={({ isActive }) => `text-[11px] font-bold uppercase tracking-widest duration-200 ${isActive ? "text-amber-700" : "text-gray-400 hover:text-stone-900"}`}>{hero.navbar.Hotels}</NavLink>
                    <NavLink to={"/dining"} className={({ isActive }) => `text-[11px] font-bold uppercase tracking-widest duration-200 ${isActive ? "text-amber-700" : "text-gray-400 hover:text-stone-900"}`}>{hero.navbar.Dining}</NavLink>
                    
                    {/* AUTH BUTTON DESKTOP */}
                    {user ? (
                      <div className="flex items-center gap-4 ml-4 border-l border-stone-200 pl-6">
                         <img src={user.profilePic} className="w-8 h-8 rounded-full border border-amber-200 shadow-sm" alt="user" />
                         <button onClick={logout} className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition">Logout</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => navigate('/auth')}
                        className="ml-4 px-6 py-2 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[2px] hover:bg-amber-900 transition-all active:scale-95"
                      >
                        Sign In
                      </button>
                    )}
                  </ul>
                </>
              )}

              {/* DROPDOWN MENU (Scrolled or Mobile) */}
              <div className={`absolute top-16 right-0 w-64 bg-white/95 backdrop-blur-xl border border-amber-100/50 rounded-3xl shadow-2xl p-5 transition-all duration-500 flex flex-col gap-1 z-50 ${isOpen && isScrolled ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 -translate-y-4 pointer-events-none'}`} onClick={(e) => e.stopPropagation()}>
                
                {/* User Profile in Dropdown */}
                {user && (
                  <div className="flex items-center gap-3 p-3 mb-2 bg-stone-50 rounded-2xl border border-stone-100">
                    <img src={user.profilePic} className="w-10 h-10 rounded-full border border-amber-500" />
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold text-stone-900 truncate">{user.name}</p>
                      <p className="text-[8px] text-stone-500 truncate uppercase tracking-tighter">Verified Guest</p>
                    </div>
                  </div>
                )}

                {[
                  { to: "/", label: hero.navbar.home },
                  { to: "/room", label: hero.navbar.Hotels },
                  { to: "/dining", label: hero.navbar.Dining },
                  { to: "/contact", label: hero.navbar.contact }
                ].map((link) => (
                  <NavLink key={link.to} to={link.to} className={({ isActive }) => `px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-[2px] transition-all duration-300 ${isActive ? "bg-amber-50 text-amber-800" : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"}`}>{link.label}</NavLink>
                ))}

                <div className="border-t border-stone-100 mt-3 pt-4 px-2 space-y-2">
                  {!user ? (
                    <button onClick={() => navigate('/auth')} className="w-full py-3 bg-amber-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-[2px] shadow-lg hover:bg-amber-800 transition-all">Sign In</button>
                  ) : (
                    <button onClick={logout} className="w-full py-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-[2px] hover:bg-red-100 transition-all">Logout</button>
                  )}
                  <button onClick={() => navigate('/room')} className="w-full py-3 bg-stone-900 text-[#f5efe6] rounded-xl text-[10px] font-bold uppercase tracking-[2px] shadow-lg hover:bg-amber-900 transition-all">Book A Stay</button>
                </div>
              </div>
            </div>
          </nav>
        </section>
      )}
    </div>
  );
}

export default Header;
