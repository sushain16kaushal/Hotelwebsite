
import { useState,useEffect } from "react";
import type { ContentData } from "../types/content";

const useFetchcontent=(url: string)=>{
    const [data,setData]=useState<ContentData | null>(null);
    const [loading,setLoading]=useState<boolean>(true);
    const [error,setError]=useState<string | null>(null);

    useEffect(()=>{
        const controller=new AbortController();
        const fetchdata = async ()=>{
            setLoading(true);
            try{const response =await fetch(url,{signal:controller.signal});
            if(!response.ok){
                throw new Error('network response is not ok');
            }
            const result=await response.json();
            setData(result);
            setError(null);
        } catch(err:any){
            if(err.name ==='AbortError')
            {
                console.log("Fetch Aborted");
            }else{
                setError(err.message);
            }
        }finally{
            setLoading(false);
        }};
        fetchdata();
      return ()=>{
controller.abort();
      };
    }, [url]);
    return{data,loading,error};
};
export default useFetchcontent;