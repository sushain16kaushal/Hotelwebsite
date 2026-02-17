export interface photos{
    id:number;
    url:string;
  
}
export interface Navbar{
  home:string;
  room:string;
  Dining:string;
  booking:string;
  contact:string;
}
export interface Herodata{
  title:string;
  subtitle:string;
  navbar:Navbar;
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
export interface FooterData{
  text1:string;
  text2:string;
}

export interface ContentData{
    
  hero:Herodata;
  gallery: photos[];
  Offers:offer[];
  Reviews:reviews[];
  Footer:FooterData;
}


