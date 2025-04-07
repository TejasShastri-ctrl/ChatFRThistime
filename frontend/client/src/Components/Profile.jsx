import React, { useState } from 'react'
import { BsArrowLeft, BsCheck2, BsPencil } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from './Redux/Auth/Action';
import { CircularProgress } from '@mui/material';

export const Profile = ({handleCloseOpenProfile}) => {
  
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername]=useState(null);
  const[tempPicture, setTempPicture] = useState(null);

  const {auth} = useSelector(store=>store);

  const dispatch = useDispatch();

  const handleNavigate = () => {
    navigate(-1);
    console.log("navigate back");
  }
  const handleFlag=()=>{
    setFlag(true);
  }

  const handleCheckClick=()=>{
    setFlag(false);
    handleUpdateName();
  }

  const handleChange=(e)=>{
    setUsername(e.target.value);
  }

  const handleUpdateName=(e)=>{
    const data = {
      id: auth.reqUser?.id, token: localStorage.getItem("token"),
      data : {
        full_name: username || auth.reqUser?.full_name
      }
    };
    dispatch(updateUser(data));
  }

  // Just use the widget. IDK what to do
  const uploadToCloudinary=(pics)=>{
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "chatpreset");
    data.append("cloud_name", "dmtctf4wl");
    fetch("https://api.cloudinary.com/v1_1/dmtctf4wl/image/upload", {
      method:"POST", body:data,
    })
    .then((res)=>res.json())
    .then((data) => {
      setTempPicture(data.secure_url.toString());
      console.log("imgurl - ", data.secure_url.toString());
      const data2 = {
        id : auth.reqUser.id, token: localStorage.getItem("token"), data : { profile_picture: data.secure_url.toString()},
      };
      dispatch(updateUser(data2));
    })
  }

  return (
    // height and width not working here, so implemented in homepage
    <div className='w-full h-full'>
      <div className='flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5'>
        <BsArrowLeft className='cursor-pointer text-2xl font-bold' onClick={handleCloseOpenProfile} />
        <p className='cursor-pointer font-semibold'>Profile</p>
      </div>

      {/* Update profile */}
      <div className='flex flex-col justify-center items-center my-12'>
        <label htmlFor='imgInput'>
          <img className='rounded-full w-[15vw] cursor-pointer' src={auth.reqUser?.profile_picture || "https://www.spongebobshop.com/cdn/shop/products/SB-Standees-Spong-1_900x.jpg?v=1603744567"} alt="" />
        </label>

        <input onChange={(e)=>uploadToCloudinary(e.target.files[0])} type='file' id='imgInput' className='hidden' />
      </div>

      {/* Name section */}
      <div className='bg-white px-3'>
        {/* <p className='py-3'>{auth.reqUser?.full_name || "noname"}</p> */}

        {!flag && <div className='w-full flex justify-between items-center'>
          <p className='py-3'>{auth.reqUser?.full_name || "change name"}</p>
          <BsPencil onClick={handleFlag} className='cursor-pointer' />
        </div>}

        {flag && <div className='w-full flex justify-between items-center py-2'>
          <input onKeyPress={handleUpdateName} onChange={handleChange} className='w-[80%] outline-none border-blue-700 p-2' type='text' placeholder='Enter your name'/>
          <BsCheck2 onClick={handleCheckClick} className='cursor-pointer text-2xl'/>
        </div>
        }

      </div>

      <div className='px-3 my-5'>
        <p className='py-10'>Information displayed here will be visible to your contacts</p>
      </div>
    </div>
  )
}

export default Profile