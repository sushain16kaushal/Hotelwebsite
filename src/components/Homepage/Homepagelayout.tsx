import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import useFetchcontent from "../../Hooks/useFetchcontent"



function Homepagelayout() {
      const{data,loading,error}=useFetchcontent("/Data/Homepage.json")
if (loading) return <p>Loading content...</p>;
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
