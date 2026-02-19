import { useState } from "react";
 
interface Identifable{
    "id":string|number;
}
export const useCarousel =<T extends Identifable>(initialdata:T[])=>{
    const[items,setItems]=useState<T[]>(initialdata);
    const next=()=>{
        setItems((prev)=>{
            const[first,...rest]=prev;
            return[...rest,first];
        });
    }
    const prev=()=>{
        setItems((prev)=>{
        if(prev.length===0) return prev;
        const last =prev[prev.length - 1];
        const rest=prev.slice(0,-1);
        return[last,...rest]; 
    })}
    return{items,next,prev}
}