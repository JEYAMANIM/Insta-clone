import React from 'react'
import Story from './Story'
import Post from './Post'

function Feed() {
  return (
    <div className='flex flex-col h-96 '>
      <div><Story/></div>
      <div><Post/></div>
    </div>
  )
}

export default Feed