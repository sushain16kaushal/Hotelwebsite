import type { JSX } from "react"
import type { Rooms } from "../../types/content"


function Filter({rooms}:{rooms:Rooms[]}):JSX.Element {


    return (
        <>
          <div className="flex gap-2 justify-center flex-col">
  
    {rooms.map((item)=>
    <div>
      <label key={item.id} className="flex gap-2">
      <input type="checkbox" id="toggleContent" value={item.category} />
      {item.category}
      </label>
      </div>
    )}
    </div>
        </>
    )
}

export default Filter
