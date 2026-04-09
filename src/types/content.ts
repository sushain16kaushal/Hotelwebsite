
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
export interface Option {
  type: string;
  pricePerNight: number;
  features: string[];
}
export interface RoomCategory {
  categoryName: string;
  guests: string;
  options: Option[];
  categoryImages:string[];
}
export interface Hotels {
  hotelName:string,
  address:string,
  hotelId:number,
  category:string,
  roomCategories:RoomCategory[];
  image:string,
  guests:number,
  type:string,
  pricePerNight:number,
  Features:string[]
}
export interface Dining {
  id: number;
  name: string;
  cuisine: string;
  description: string;
  timing: string;
  address: string;
  image: string;
  topItems: string[];
}
export interface ContentData{
  hero:Herodata;
  Offers:offer[];
  Reviews:reviews[];
  Footer:FooterData;
  hotels:Hotels[];
  dinings:Dining[];
}


