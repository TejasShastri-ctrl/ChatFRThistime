import { BASE_API_URL } from "../../../config/api"
import { CREATE_CHAT, CREATE_GROUP_CHAT, GET_USER_CHATS } from "./ActionType"

export const createChat=(chatData)=>async(dispatch)=>{
    try {
        const res = await fetch(`${BASE_API_URL}/api/chats/single`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${chatData.token}`
            },
            body:JSON.stringify(chatData.data)
        })
        const data = await res.json();
        console.log("create chat data - ", data);
        dispatch({type:CREATE_CHAT, payload:data});
    }
    catch(error) {
        console.log("create chat error - ", error);
    }
}

export const createGroupChat=(chatData)=>async(dispatch)=>{
    try {
        const res = await fetch(`${BASE_API_URL}/api/chats/group`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${chatData.token}`
            },
            body:JSON.stringify(chatData.group)
        })
        const data = await res.json();
        console.log("create groupchat data - ", data);
        dispatch({type:CREATE_GROUP_CHAT, payload:data});
    }
    catch(error) {
        console.log("create groupchat error - ", error);
    }
}

export const getUsersChat=(chatData)=>async(dispatch)=>{
    try {
        const res = await fetch(`${BASE_API_URL}/api/chats/user`, {
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${chatData.token}`
            },
        })
        const data = await res.json();
        console.log("get users chat data - ", data);
        dispatch({type:GET_USER_CHATS, payload:data});
    }
    catch(error) {
        console.log("getUsersChat error - ", error);
    }
}