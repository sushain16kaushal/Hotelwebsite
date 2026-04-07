import type { JSX } from "react"
import type { Hotels } from "../../types/content"


function Filter({hotels}:{hotels:Hotels[]}):JSX.Element {


    return (
        <>
          <div className="flex gap-2 justify-center flex-col">
  
    {hotels.map((item)=>
    <div>
      <label key={item.id} className="flex gap-2">
      <input type="checkbox" id="toggleContent" />
      
      </label>
      </div>
    )}
    </div>
        </>
    )
}

export default Filter
