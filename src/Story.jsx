import React, { useState, useEffect } from 'react';
import { useNavigate

 } from 'react-router-dom';
function Story() {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate()
  let tot = 0

  useEffect(() => {
    fetch("http://localhost:3000/story")
      .then((res) => res.json())
      .then((data) => setStories(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="flex items-center gap-3 h-28 w-full overflow-x-auto p-2">
      <div className='opacity-0'>{tot=stories.length}</div> 
      {stories.length > 0 ? (
        stories.map((item) => (
          /* Using parentheses () instead of {} implicitly returns the JSX */
          <div key={item.id} onClick={() =>{navigate(`/story/${item.id}/${tot}`)} } className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
            {/* Instagram story border gradient ring */}
            <div className="p-[2px] bg-gradient-to-tr from-amber-500 via-red-500 to-purple-600 rounded-full">
              <img
                src={item.user.profilePicture}
                alt={item.user.fullName}
                className="w-14 h-14 rounded-full object-cover border-2 border-white"
              />
            </div>
            <p className="text-xs truncate w-16 text-center">{item.user.fullName}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">Loading...</p>
      )}
    </div>
  );
}

export default Story;