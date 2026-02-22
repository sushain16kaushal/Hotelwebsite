const FullScreenLoader=()=>{

    return(
        <>
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
    <p className="mt-4 text-gray-600 font-medium animate-pulse">
      Setting up your experience...
    </p>
  </div>
  </>
    )
}
export default FullScreenLoader