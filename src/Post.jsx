import React from 'react'
import { useState, useEffect } from 'react'
import { FaHeart,FaRegComment} from "react-icons/fa";
import { RiSendInsLine } from "react-icons/ri"


const mockPosts = [
  { id: 1, username: 'alex_dev', caption: 'Hello World!' }
];

function Post() {
 const [Posts, setPosts] = useState([])
 useEffect(()=>{
    fetch("http://localhost:3000/posts")
    .then((data)=>data.json())
    .then((data=>setPosts(data)))
    .catch((err)=>console.log(err))
 },[])
 return (
    <div className='flex h-full overflow-y-auto justify-content ' >
      {Posts.length > 0 ? (
        <div>
            {Posts.map((Post) => (
                <div className='m-2' key={Post.id}>
                    <div className='flex items-center gap-2 m-2'>
                        <img className="w-20 h-20 rounded-full" src={Post.user.profilePicture} alt="" />
                        <span>{Post.user.username}</span>
                    </div>
                    <img className="w-full h-64 object-cover" src={Post.content.mediaUrls[0]} alt="" />
                    <div className='flex items-center gap-2 m-2'>
                        <FaHeart />
                        <FaRegComment />
                        <RiSendInsLine/>
                    </div>
                    <div>
                        <b>{Post.engagement.likesCount} Likes</b>
                    </div>
                    <p>{Post.caption}</p>
                </div>
            ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default Post
