import { useOutletContext } from "react-router-dom"
import Room from "./Room"
import type{ ContentData } from "../../types/content"



function Roompage() {
       const data=useOutletContext<ContentData>();

    return (
      <>
      <h2 className="text-center text-3xl font-serif mt-4">Hotels</h2>
      <div className="flex justify-center gap-4"> 
      <div className="p-5  w-4xl">
      <Room hotels={data?.hotels ?? []} />
      </div>
      </div>
      </>
    )
}

export default Roompage
