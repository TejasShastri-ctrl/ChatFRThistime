import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const StatusUserCard = () => {

    const navigate=useNavigate();

    const handleNavigate=()=>{
        navigate("/statusViewer");
    }

  return (
    <div onClick={handleNavigate} className='flex cursor-pointer items-center p-3'>
        <div>
            <img className='h-7 w-7 lg:w-10 lg:h-10 rounded-full' src="https://www.spongebobshop.com/cdn/shop/products/SB-Standees-Spong-1_900x.jpg?v=1603744567" alt="" />
        </div>
        <div className='ml-2 text-white'>
            <p>Freakbob</p>
        </div>
    </div>
  )
}

export default StatusUserCard;