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
export interface reviews{
  id:number,
  name:string,
  text:string,
  rating:number,
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
  Reviews:reviews[];
  Footer:{
    text1:string,
    text2:string
  }
}


