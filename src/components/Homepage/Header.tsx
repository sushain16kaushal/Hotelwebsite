import useFetchcontent from "../../Hooks/useFetchcontent"
import { NavLink } from "react-router-dom";

function Header() {
    const{data,loading,error}=useFetchcontent("public/Data/Homepage.json")
if (loading) return <p>Loading content...</p>;
if (error) return <p>its an error:- {error}</p>;

    return (
     <div>
        {data && (
     <section>
        <h1 className="text-3xl text-center mt-1">{data.hero.title}</h1>
        <h2 className="text-2xl text-center mt-1.5">{data.hero.subtitle}</h2>
        <div className="flex justify-evenly mt-4">
         <NavLink to={"/"} className={({isActive})=>
         `duration-200 ${isActive ? "text-orange-500" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{data.hero.navbar.home}</NavLink>
          <NavLink to={"/room"} className={({isActive})=>
         `duration-200 ${isActive ? "text-orange-500" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{data.hero.navbar.room}</NavLink>
            <NavLink to={"/dining"} className={({isActive})=>
         `duration-200 ${isActive ? "text-orange-500" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{data.hero.navbar.Dining}</NavLink>
             <NavLink to={"/booking"} className={({isActive})=>
         `duration-200 ${isActive ? "text-orange-500" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{data.hero.navbar.booking}</NavLink>
             <NavLink to={"/contact"} className={({isActive})=>
         `duration-200 ${isActive ? "text-orange-500" : "text-gray-400"} hover:bg-transparent hover:text-orange`
         }>{data.hero.navbar.contact}</NavLink>
        </div>
     </section>
        )}

     </div>
    );
}

export default Header
