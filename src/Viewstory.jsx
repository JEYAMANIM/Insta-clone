import React, { useEffect, useState } from 'react'
import { Link,Links,useNavigate, useParams} from 'react-router-dom'
import { IoArrowBackCircleSharp,IoArrowForwardCircle } from "react-icons/io5";

function Viewstory() {
  const {id,tot} = useParams()
  const[story,setStory] = useState(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    fetch(`https://my-json-server.typicode.com/JEYAMANIM/Insta-clone/story/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Story not found');
        }
        return res.json();
      })
      .then((data) => setStory(data))
      .catch((err) => {
        console.log(err);
        navigate('/'); // Safely redirects to Home when reaching the limit/end
      });
  }, [id, navigate]);
  
  return(
    <div>
       {story ? <div className='flex justify-center '>
         <div className="absolute inset-0 bg-purple-900/40 animate-pulse pointer-events-none" />
         <Link to={`http://localhost:5173/story/${Number(id)-1}/${tot}`}  className=" text-5xl z-10 hover:opacity-80 flex items-center"><IoArrowBackCircleSharp /></Link>
         <img className='h-158' src={story.mediaUrls} alt='story' />
         <Link to={`http://localhost:5173/story/${Number(id)+1}/${tot}`} className=" text-5xl z-10 hover:opacity-80 flex items-center"><IoArrowForwardCircle /></Link>
        </div> 
        : <p>loading...</p>}
    </div>
  )
}

export default Viewstory
