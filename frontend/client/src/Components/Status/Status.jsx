import React from 'react'
import StatusUserCard from './StatusUserCard';
import { AiOutlineClose, AiOutlineCloud } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

export const Status = () => {
    const navigate=useNavigate();
    const handleNavigate=()=>{
        navigate(-1);
    }

  return (
    <div className='bg-yellow-300'>
        <div className='flex items-center px-[14vw] py-[7vh]'>
            {/* Left part */}
            <div className='left h-[85vh] bg-[#1e262c] lg:w-[30%] w-[50%] px-5'>
                <div className='pt-5 h-[13%]'>
                    <StatusUserCard/>
                </div>
                <hr/> 
                <div className='overflow-y-scroll h-[86%] pt-2'>
                    {[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((item)=><StatusUserCard/>)}
                </div>
            </div>
            {/* right part */}
            <div className='relative h-[85vh] lg:w-[70%] w-[50%] bg-black'>
                <AiOutlineClose onClick={handleNavigate} className='text-white cursor-pointer absolute top-5 right-10 text-xl'/>

            </div>
        </div>
    </div>
  )
}

export default Status;