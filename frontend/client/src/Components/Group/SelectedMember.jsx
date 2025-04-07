import React from 'react'
import { AiOutlineClose } from 'react-icons/ai';

export const SelectedMember = ({ handleRemoveMember, member }) => {
    return (
        <div className='flex items-center bg-slate-300 rounded-full'>
            <img className='w-7 h-7 rounded-full' src={member.profile_pic || "https://www.spongebobshop.com/cdn/shop/products/SB-Standees-Spong-1_900x.jpg?v=1603744567"} alt="" />
            <p className='px-2'>{member.full_name}</p>
            <AiOutlineClose onClick={handleRemoveMember} className='pr-1 cursor-pointer' />

        </div>
    )
}

export default SelectedMember;