export interface photos{
    id:number;
    url:string;
  
}
export interface offer{
    id:number,
    title:string,
  url:string,
  description:string,
  price:number
}


export interface ContentData{
    
    hero:{
title:string;
subtitle:string;
navbar:{
     "home":string,
     "room":string,
     "Dining":string,
    "booking":string,
     "contact":string,
}
  },
  gallery: photos[];
  Offers:offer[];
}


