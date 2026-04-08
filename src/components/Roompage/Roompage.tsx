import { useOutletContext } from "react-router-dom"
import Room from "./Room"
import type{ ContentData } from "../../types/content"



function Roompage() {
       const data=useOutletContext<ContentData>();

    return (
      <>
      <h2 className="text-center text-3xl font-serif mt-4">Book Your Stay</h2>
      <div className="flex justify-center"> 
      <div className="max-w-7xl w-full p-4 ">
      <Room hotels={data?.hotels ?? []} />
      </div>
      </div>
      </>
    )
}

export default Roompage
