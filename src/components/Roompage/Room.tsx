import type { JSX } from "react"
import type { Rooms } from "../../types/content"

const Room =({rooms}:{rooms:Rooms[]}):JSX.Element=>{
    

    return (
        <>
        <div className="mt-2 flex flex-col justify-center items-center">
       {rooms.map((item)=>(
        <div className="relative flex justify-center border border-[#eaddca]  p-6 rounded-2xl m-2 hover:border-red-300 bg-white hover:scale-102 hover:cursor-pointer ">
        <div className="p-2 border-2 m-2 w-100 h-100 rounded-2xl" >
        </div>
      <div className="flex flex-col justify-center w-2xs items-center m-2" >
        <h2 className="text-3xl text-center">{item.category} Euphoria Room</h2>
        <h2 className="text-2xl text-center">Class:- {item.type}</h2>
        <h2 className="text-xl text-center">Price:- ${item.pricePerNight}/night</h2>
        <button className="p-2 border-b-blue-100 bg-amber-400 rounded-2xl mt-2 cursor-pointer hover:bg-amber-200">Know More</button>
      </div>
        </div>
       ))}
       </div>
        </>
    )
}

export default Room;
