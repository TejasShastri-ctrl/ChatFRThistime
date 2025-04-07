import React, { useState } from 'react'
import { BsArrowLeft, BsCheck2 } from 'react-icons/bs'
import CircularProgress from '@mui/material/CircularProgress';
import { Avatar, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { createGroupChat } from '../Redux/Chat/Action';

export const NewGroup = ({groupMember, setisG}) => {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [groupName, setgroupName] = useState();
  const [groupImage, setGroupImage] = useState("https://www.spongebobshop.com/cdn/shop/products/SB-Standees-Spong-1_900x.jpg?v=1603744567");
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  //! I forgot
  const handleCreateGroup=()=>{
    let userIds = [];
    for(let user of groupMember) {
      userIds.push(user.id);
    }
    const group = {
      userIds,
      chat_name: groupName,
      chat_image: groupImage
    };
    const data = {
      group, token
    };
    dispatch(createGroupChat(data));
    setisG(false);
  }

  //!
  const uploadToCloudinary=(pics)=>{
    setIsImageUploading(true);
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatpreset");
      data.append("cloud_name", "dmtctf4wl");
      fetch("https://api.cloudinary.com/v1_1/dmtctf4wl/upload/image", {
        method:"POST", body:data,
      })
      .then((res)=>res.json())
      .then((data) => {
        setGroupImage(data.url.toString());
        console.log("imgurl", data.url.toString());
        setIsImageUploading(false);
      })
    }

  return (
    <div className='w-full h-full'>
      <div className='flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5'>
        <BsArrowLeft className='cursor-pointer text-2xl font-bold' />
        <p className='text-xl font-semibold'>New Group</p>
      </div>
      <div className='flex flex-col justify-center items-center my-12'>
        <label htmlFor='imgInput' className='relative'>
          {/* <img className="h-33 w-33 rounded-full" 
          src={groupImage || "https://thumbs.dreamstime.com/b/people-vector-icon-group-symbol-illustration-businessman-logo-multiple-users-silhouette-153483996.jpg"} alt=""/> */}
          
          {isImageUploading && <CircularProgress className='absolute top-[5rem] left-[6rem]' />}
        </label>
        <input
          type='file' 
          id='imgInput' 
          className='hidden' 
          onChange={(e) => uploadToCloudinary(e.target.files[0])}
        />
      </div>

      <div className='w-full flex justify-between items-center py-2 px-5'>
        <input className='w-full outline-none border-b-2 border-green-700 px-2 bg-transparent' placeholder='Group Subject' value={groupName} type='text' onChange={(e) => setgroupName(e.target.value)} />

      </div>

      {groupName && <div className='py-10 bg-slate-200 flex items-center justify-center'>
        <Button onClick={handleCreateGroup}> <div className='bg-[#0c977d] rounded-full p-4'>
          <BsCheck2 className='text-white font-bold text-3xl'/>
        </div>

        </Button>
      </div>}

    </div>
  )
}

/// 3:46:30