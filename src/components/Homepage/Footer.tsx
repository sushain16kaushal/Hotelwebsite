import useFetchcontent from "../../Hooks/useFetchcontent"


function Footer() {
      const{data,loading,error}=useFetchcontent("/Data/Homepage.json")
if (loading) return <p>Loading content...</p>;
if (error) return <p>its an error:- {error}</p>;
    return (
        <>
        <div className="m-6">
        <div className="text-2xl text-center " >
      <p className="text-2xl text-blue-50 mt-8">{data?.Footer.text1}</p>
        </div>
        <div className="address mt-1 text-center">
            <p>{data?.Footer.text2}</p>
        </div>
        </div>
        </>
    )
}

export default Footer
