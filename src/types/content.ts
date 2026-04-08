
export interface Navbar{
  home:string;
  Hotels:string;
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

export interface Hotels {
  hotelName:string,
  address:string,
  id:number,
  category:string,
  image:string,
  guests:number,
  type:string,
  pricePerNight:number,
  Features:string[]
}
export interface ContentData{
  hero:Herodata;
  Offers:offer[];
  Reviews:reviews[];
  Footer:FooterData;
  hotels:Hotels[];
}


