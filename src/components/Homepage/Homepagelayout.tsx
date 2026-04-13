import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import useFetchcontent from "../../Hooks/useFetchcontent"

import FullScreenLoader from "../FullScreenLoader"



function Homepagelayout() {
  const { data, loading, error } = useFetchcontent(`https://hotelapp-tiof.onrender.com/api/data`);

  // Loading state direct handle karo, timer hata do
  if (loading) return <FullScreenLoader />; 
  if (error) return <p>its an error:- {error}</p>;
  if (!data) return null;

  return (
    <div className="fade-in"> {/* Ek simple CSS animation lagao yahan */}
      <Header hero={data?.hero} />
      <Outlet context={data} />
      <Footer footer={data?.Footer}/>
    </div>
  );
}

export default Homepagelayout
