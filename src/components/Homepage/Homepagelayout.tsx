import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import useFetchcontent from "../../Hooks/useFetchcontent"
import { useEffect, useState } from "react"
import FullScreenLoader from "../FullScreenLoader"



function Homepagelayout() {
      const{data,loading,error}=useFetchcontent("/Data/Homepage.json")
      const[isready,setisready]=useState(false)
      useEffect(()=>{
        if(!loading && data){
            const timer=setTimeout(()=>{
                setisready(true);
            },1300)
            return ()=>clearTimeout(timer);
        }
      },[loading,data])
if (loading || !isready){ return <FullScreenLoader />};
if (error) return <p>its an error:- {error}</p>;
if(!data) return null;
    return (
  
        <>
        <div>
        <Header hero={data?.hero} />
        <Outlet context={data} />
        <Footer footer={data?.Footer}/>
        </div>
        </>
    )
}

export default Homepagelayout
