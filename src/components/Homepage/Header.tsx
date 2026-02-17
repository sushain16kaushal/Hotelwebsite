import type{ Herodata } from "../../types/content";
import { NavLink } from "react-router-dom";

function Header({hero}:{hero:Herodata}) {
   
    return (
     <div>
        {hero && (
     <section>
        <h1 className="text-3xl text-neutral-900 text-center mt-1">{hero.title}</h1>
        <h2 className="text-2xl text-neutral-700 text-center mt-1.5">{hero.subtitle}</h2>
        <div className="flex justify-evenly mt-4">
         <NavLink to={"/"} className={({isActive})=>
         `duration-200 ${isActive ? "text-amber-700" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{hero.navbar.home}</NavLink>
          <NavLink to={"/room"} className={({isActive})=>
         `duration-200 ${isActive ? "text-amber-700" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{hero.navbar.room}</NavLink>
            <NavLink to={"/dining"} className={({isActive})=>
         `duration-200 ${isActive ? "text-amber-700" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{hero.navbar.Dining}</NavLink>
             <NavLink to={"/booking"} className={({isActive})=>
         `duration-200 ${isActive ? "text-amber-700" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{hero.navbar.booking}</NavLink>
             <NavLink to={"/contact"} className={({isActive})=>
         `duration-200 ${isActive ? "text-amber-700" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{hero.navbar.contact}</NavLink>
        </div>
     </section>
        )}

     </div>
    );
}

export default Header
