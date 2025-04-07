// The implementation in this is crucial. Give 5 mins and go over this to have a good understanding of what is happening

// Remove selected members was not working:
// The issue is that Set operations in JavaScript like delete() or add() do not trigger state updates by default because React does not detect changes in mutable structures like Set. You need to create a new instance of the Set to trigger a state update.
// Fix:
// In handleRemoveMember, create a new Set when updating the state:

import React, { useState } from 'react'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import SelectedMember from './SelectedMember';
import ChatCard from '../ChatCard/ChatCard';
import { NewGroup } from './NewGroup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchUser } from '../Redux/Auth/Action';

export const CreateGroup = ({ setisG }) => {
    const [newG, setnewG] = useState(false);
    const [groupMember, setGMember] = useState(new Set());
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const { auth } = useSelector(store => store);


    const handleBack = () => {
        navigate(-1);
    }

    const handleRemoveMember = (item) => {
        const updatedMembers = new Set(groupMember); // Create a new Set
        updatedMembers.delete(item);                 // Delete the item
        setGMember(updatedMembers);                  // Update the state
    };

    const handleSearch = (keyword) => {
        dispatch(searchUser({ keyword, token }))
    };

    return (
        <div className='w-full h-full'>
            {!newG && (<div>
                <div className='flex items-center space-x-10 bg-[#2E8B57] text-white pt-16 px-10 pb-5'>
                    <BsArrowLeft className='cursor-pointer text-2xl font-bold' onClick={handleBack} />
                    <p className='text-xl font-semibold'>Add Group Participants</p>
                </div>
                <div className='relative bg-white py-4 px-3'>
                    <div className='flex space-x-2 flex-wrap space-y-1'>
                        {groupMember.size > 0 && Array.from(groupMember).map((item) => (
                            <SelectedMember
                                key={item.id}  // Add a unique key here
                                handleRemoveMember={() => handleRemoveMember(item)}
                                member={item}
                            />
                        ))}


                    </div>
                    {/* Since it is relative*/}
                    <input type="text" onChange={(e) => {
                        handleSearch(e.target.value)
                        setQuery(e.target.value)
                    }} className='outline-none border-b border-[#8888] p-2 w-[93%]' placeholder='Search user'
                    />

                </div>

                <div className='bg-white overflow-y-scroll h-[50.2vh]'>
                    {query && auth.searchUser?.map((item) => <div onClick={() => {
                        const updatedMembers = new Set(groupMember); // Create a new Set
                        updatedMembers.add(item);                    // Add the item
                        setGMember(updatedMembers);                  // Update the state
                        setQuery("");
                    }}
                        key={item?.id}
                    >
                        <hr />
                        <ChatCard userImg={item.profile_pic} name={item.full_name} />
                    </div>)}

                </div>

                <div className='bottom-10 py-10 bg-slate-200 flex items-center justify-center'>
                    <div onClick={() => setnewG(true)} className='bg-green-600 rounded-full p-4 cursor-pointer'>
                        {/* Add an icon or text */}
                        <span className='text-white font-bold'>Create</span> {/* Example text */}
                    </div>
                    {/* <BsArrowRight className='text-white font-bold text-3xl' /> */}
                </div>


            </div>
            )}
            {newG && <NewGroup setisG={setisG} groupMember={groupMember} />}
        </div>
    )
}

export default CreateGroup;