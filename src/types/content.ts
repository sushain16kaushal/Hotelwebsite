
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
export interface Reeldata{
id:number;
title:string;
tag:string;
videoUrl:string;
posterUrl:string;
}
export interface offer{
    id:number,
    title:string,
  url:string,
  description:string,
  price:number,
  image:string
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
export interface FullMenuItem {
  item: string;
  price: number;
  category: string;
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
  fullMenu: FullMenuItem[];
}
export interface ContentData{
  hero:Herodata;
  reeldata:Reeldata[];
  Offers:offer[];
  Reviews:reviews[];
  Footer:FooterData;
  hotels:Hotels[];
  dinings:Dining[];
}


