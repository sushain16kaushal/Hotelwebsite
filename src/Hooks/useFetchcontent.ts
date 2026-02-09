
import { useState,useEffect } from "react";
import type { ContentData } from "../types/content";

const useFetchcontent=(url: string)=>{
    const [data,setData]=useState<ContentData | null>(null);
    const [loading,setLoading]=useState<boolean>(true);
    const [error,setError]=useState<string | null>(null);

    useEffect(()=>{
        const fetchdata = async ()=>{
            try{const response =await fetch(url);
            if(!response.ok){
                throw new Error('network response is not ok');
            }
            const result=await response.json();
            setData(result);
        } catch(err:any){
            setError(err.message);
        }finally{
            setLoading(false);
        }};
        fetchdata();
      
    }, [url]);
    return{data,loading,error};
};
export default useFetchcontent;