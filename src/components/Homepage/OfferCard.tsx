
import type React from 'react';
import useFetchcontent from '../../Hooks/useFetchcontent';




const OfferCard:React.FC<any> =()=>{
     const{data,loading,error}=useFetchcontent("public/Data/Homepage.json")
if (loading) return <p>Loading content...</p>;
if (error) return <p>its an error:- {error}</p>;
if(!data || !data.Offers) return <p>no offers</p>
return(<>
{data?.Offers.map((item)=>(
<div key={item.id} className='Card flex w-full h-20 mt-2 text-center text-3xl'>
<h2>{item.title}</h2>
<img src={item.url} rel="" />
<p>{item.description}</p>
<h3>{item.price}</h3>
</div>
))
}
</>
)
}



   



export default OfferCard;
