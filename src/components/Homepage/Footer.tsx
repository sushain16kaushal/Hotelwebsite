
import type{ FooterData } from "../../types/content"

function Footer({footer}:{footer:FooterData}) {
    
    return (
        <>
        <div className="m-6">
        <div className="text-2xl text-center " >
      <p className="text-2xl  mt-8">{footer.text1}</p>
        </div>
        <div className="address mt-1 text-center">
            <p>{footer.text2}</p>
        </div>
        </div>
        </>
    )
}

export default Footer
