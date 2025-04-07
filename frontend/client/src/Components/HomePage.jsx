
import React, { useEffect, useState } from "react";
import { TbCircleDashed } from "react-icons/tb"
import { BiCommentDetail } from "react-icons/bi"
import { AiOutlineSearch } from "react-icons/ai"
import { BsEmojiSmile, BsFilter, BsMicFill, BsThreeDotsVertical } from "react-icons/bs"
import { ImAttachment } from "react-icons/im"
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { Button, Menu, MenuItem } from '@mui/material';

import ChatCard from "./ChatCard/ChatCard";
import MessageCard from "./MessageCard/MessageCard";
import "./HomePage.css"
import { Profile } from "./Profile";
import CreateGroup from "./Group/CreateGroup";
import { currentUser, logoutAction, searchUser } from "./Redux/Auth/Action";
import { createChat, getUsersChat } from "./Redux/Chat/Action";
import { useDispatch } from 'react-redux';
import { createMessage, getAllMessages } from "./Redux/Message/Action";

// Sock'N'Stomp
import SockJs from "sockjs-client/dist/sockjs";
import { over } from "stompjs"
import SockJS from "sockjs-client";

const HomePage = () => {
    const [querys, setQuerys] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [content, setContent] = useState("");
    const [isProfile, setIsProfile] = useState(false);
    const navigate = useNavigate();
    const [isG, setisG] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const token = localStorage.getItem("token");

    const { auth, chat, message } = useSelector(store => store)

    const dispatch = useDispatch();

    const handleClickOnChatCard = (userId) => {
        // setCurrentChat(item); //! no need
        console.log("After clicking on chat card, uid:", userId, "-----");
        dispatch(createChat({ token, data: { userId } })); //!vimp
        setQuerys("")
    }

    const handleSearch = (keyword) => {
        dispatch(searchUser({ keyword, token }))
    };

    const handleCreateNewMessage = () => {
        dispatch(createMessage({
            token,
            data: { chatId: currentChat.id, content: content }
        }));
        console.log("---- create new message initiated ---- ");
    }

    // the array seems to keep the current user at first index leading to issues with auth
    useEffect(() => {
        dispatch(getUsersChat({ token }));
    }, [chat.createdChat, chat.createdGroup])

    useEffect(() => {
        currentChat == null ? console.log("reading gc condition") : (currentChat.is_group == null ? console.log("gc - normal chat") : console.log("gc - group chat"));
    }, [currentChat])

    const handleNavigate = () => {
        setIsProfile(true);
    }

    const handleCloseOpenProfile = () => {
        setIsProfile(false);
    }

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCreateGroup = () => {
        setisG(true);
    }

    const mockData = [
        { id: 1, full_name: "John Doe", email: "john.doe@example.com" },
        { id: 2, full_name: "Jane Smith", email: "jane.smith@example.com" },
    ];

    useEffect(() => {
        dispatch(currentUser(token))
    }, [token])

    const handleLogout = () => {
        dispatch(logoutAction())
        navigate("/signup")
    }

    useEffect(() => {
        if (!auth.reqUser) {
            navigate("/signup")
        }
    }, [auth.reqUser])

    const handleCurrentChat = (item) => {
        setCurrentChat(item);
    }
    console.log("Active/current chat : ", currentChat);

    useEffect(() => {
        console.log("Search results newly added : ", auth.searchUser);
    }, [auth.searchUser]);

    useEffect(() => {
        if (currentChat?.id) dispatch(getAllMessages({ chatId: currentChat.id, token }));
        console.log('fetching the reducer for message (just a debugging step)')
        console.log(message.messages);
    }, [currentChat, message.newMessage]);


    //! Sock'N'Stomp Sock'N'Stomp Sock'N'Stomp Sock'N'Stomp Sock'N'Stomp
    const [stompClient, setStompClient] = useState();
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);

    const connect=()=>{
        const sock = new SockJS("http://localhost:8080/ws");
        const temp=over(sock);
        setStompClient(temp);

        const headers = {
            Authorization:`Bearer ${token}`,
            "X-XSRF-TOKEN":getCookie("XSRF-TOKEN")
        }

        temp.connect(headers, onConnect, onError);
    }

    useEffect(()=>{
        connect();
    })

    function getCookie(name) {
        const value = `; ${document.cookie} ;`
        const parts = value.split(`; ${name}=`)
        if(parts.length===2) {
            return parts.pop().split(";").shift();
        }
    }

    const onError=(error)=>{
        console.log("error state - ", error);
    }
    const onConnect=()=>{
        setConnected(true);
    }
    useEffect(()=>{
        if(message.newMessage && stompClient) {
            setMessages([...messages, message.newMessage]);
            stompClient?.send("/app/message",{},JSON.stringify(message.newMessage));
        }
    }, message.newMessage)

    useEffect(()=>{
        setMessages(message.messages);
    },message.messages)

    const onMessageRecieve=(payload)=>{
        console.log("SockNStomp recieved message - ", JSON.parse(payload.body));
        const recievedMessage = JSON.parse(payload.body);
        setMessages([...messages, recievedMessage]); //
    }

    useEffect(()=>{
        if(connected && stompClient && auth.reqUser && currentChat) {
            const subscription = stompClient.subscribe("/group/"+currentChat.id.toString, onMessageRecieve); //callback needed(onMessageRecieve)
            return ()=>{
                subscription.unsubscribe();
            }
        }
    })

    return (
        <div className="relative bg-slate-500">
            <div className="w-full py-14 bg-[#00a884]"></div>
            <div className="flex bg-[#f0f2f5] h-[90vh] absolute left-[2vw] top-[5vh] w-[96vw]">
                <div className="left w-[30%] bg-[#e8e9ec] h-full">
                    {/* Profile */}
                    {isG && <CreateGroup setisG={setisG} />}
                    {isProfile && <div className="w-full h-full"> <Profile handleCloseOpenProfile={handleCloseOpenProfile} /> </div>}
                    {!isProfile && !isG && <div className="w-full">

                        {/* Home */}
                        {!isProfile && <div className="flex justify-between items-center p-3">
                            <div onClick={handleNavigate} className="flex items-center space-x-3">
                                <img className="rounded-full w-10 h-10 cursor-pointer" src={auth.requser?.profile_picture || "https://www.spongebobshop.com/cdn/shop/products/SB-Standees-Spong-1_900x.jpg?v=1603744567"} alt="" />
                                <p>{auth.reqUser?.full_name}</p>
                            </div>
                            <div className="space-x-3 text-wxl flex">
                                <TbCircleDashed className="cursor-pointer" onClick={() => navigate("/status")} />
                                <BiCommentDetail />
                                <div>

                                    <BsThreeDotsVertical id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick} />

                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                                        <MenuItem onClick={handleCreateGroup}>Create New Group</MenuItem>
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </Menu>
                                </div>
                            </div>
                        </div>}

                        <div className="relative flex justify-center items-center bg-white py-4 px-3">
                            <input
                                className="border-none outline-none bg-slate-200 rounded-md w-[93%] pl-9 py-2"
                                type="text"
                                placeholder="search or start new chat"
                                onChange={(e) => {
                                    setQuerys(e.target.value)
                                    handleSearch(e.target.value)
                                }}
                                value={querys}
                            />

                            <AiOutlineSearch size={24} className="left-5 top-6 absolute" />
                            <div>
                                <BsFilter className="ml-4 text-3xl" />
                            </div>
                        </div>
                        {/* all users */}

                        {/* ISSUE LIED IN NOT RETURNING THE DIV AFTER MAP*/}
                        <div className="bg-white overflow-y-scroll h-[72vh] px-3">
                            {querys &&
                                auth.searchUser?.map((item) => {
                                    return (
                                        <div key={item.id} onClick={() => handleClickOnChatCard(item.id)}>

                                            <hr />
                                            <ChatCard name={item.full_name} userImg={
                                                item.profile_picture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                            } />
                                        </div>
                                    );
                                })}

                            {chat.chats.length > 0 && !querys &&
                                chat.chats?.map((item) => {
                                    return (
                                        <div key={item} onClick={() => handleCurrentChat(item)}>

                                            <hr /> {item.is_group ? (
                                                <ChatCard
                                                    name={item.chat_name}
                                                    userImg={
                                                        item.chat_image || "data:image/jpeg;base64,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"
                                                    }
                                                />
                                            ) : (
                                                <ChatCard
                                                    isChat={true}
                                                    name={
                                                        auth.reqUser?.id == item.users[0]?.id
                                                            ? item.users[1].full_name : item.users[0].full_name
                                                    }
                                                    userImage={
                                                        auth.reqUser?.id == item.users[0]?.id
                                                            ? item.users[1].profile_picture : item.users[0].profile_picture
                                                    }
                                                />
                                            )

                                            }

                                        </div>
                                    );
                                })}

                        </div>

                    </div>}
                </div>

                {/* <div className="right"> */}
                {/* default page */}
                {!currentChat && <div className="w-[70%] flex flex-col items-center justify-center">
                    <div className="max w-[70%] text-center">
                        <img src="https://img.freepik.com/premium-vector/chat-logo-design_93835-108.jpg?w=740"
                            alt="" />
                        <h1 className="text-4xl text-gray-600">AChat</h1>
                        <p className="my-9">Click on a chat to continue or create a new one</p>
                    </div>
                </div>}

                {/* IMPORTANT IMPORTANT IMPORTANT */}
                {/* Message Part */}
                {currentChat && <div className="w-[70%] relative bg-blue-200">
                    <div className="header absolute top-0 w-full bg-[#f0f2f5]">
                        <div className="flex justify-between">
                            <div className="py-3 space-x-4 flex items-center px-3">

                                <img
                                    className="w-10 h-10 rounded-full"
                                    src={
                                        currentChat.is_group
                                            ? currentChat.chat_image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                            : currentChat.users.find(user => user.id !== auth.reqUser?.id)?.profile_picture ||
                                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                    }
                                    alt="User Avatar"
                                />

                                <p>
                                    {currentChat.is_group
                                        ? currentChat.chat_name
                                        : (currentChat.users.find(user => user.id !== auth.reqUser?.id)?.full_name || "defaultname")
                                    }
                                </p>

                                {/* <p>{currentChat.is_group ? currentChat.chat_name : (auth.reqUser?.id == auth.reqUser?.id ? currentChat.users[0].full_name : "defaultname")}</p> */}
                            </div>
                            <div className="py-3 flex space-x-4 items-center px-3">
                                <AiOutlineSearch />
                                <BsThreeDotsVertical />

                            </div>
                        </div>
                    </div>
                    {/* Message section */}
                    <div className="px-10 h-[85vh] overflow-y-scroll">
                        <div className="space-y-1 flex flex-col justify-center mt-20 py-2">
                            {/* Was calling the messages from state(message.messages) but since adding SockNStomp, its being updated continuously so no need for that anymore */}
                            {messages.length > 0 && messages?.map((item, i) => (
                                <MessageCard
                                    isReqUserMessage={item.user.id === auth.reqUser.id}
                                    content={item.content}
                                />
                            ))}
                        </div>
                    </div>
                    {/* footer */}
                    <div className="footer bg-[#f0f2f5] absolute bottom-0 w-full py-3 text-2xl">
                        <div className="flex justify-between items-center px-5 relative">
                            <div className="flex space-x-2">
                                <BsEmojiSmile className="cursor-pointer" />
                                <ImAttachment />
                            </div>
                            <input className="py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]"
                                type="text" onChange={(e) => setContent(e.target.value)}
                                placeholder="Type message"
                                value={content}
                                onKeyPress={(e) => {
                                    if (e.key == "Enter") {
                                        handleCreateNewMessage();
                                        setContent("")
                                    }
                                }}
                            />
                            <BsMicFill />

                        </div>
                    </div>
                </div>
                }
            </div>
        </div>
    );
};

export default HomePage