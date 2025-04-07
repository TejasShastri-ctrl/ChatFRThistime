import { BASE_API_URL } from "../../../config/api"
import { GET_ALL_MESSAGES, CREATE_NEW_MESSAGE } from "./ActionType"

export const createMessage=(messageData)=>async(dispatch)=>{
    try {
        const res = await fetch(`${BASE_API_URL}/api/messages/create`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${messageData.token}`
            },
            body:JSON.stringify(messageData.data)
        })
        const data = await res.json();
        console.log("create m - ", data);
        dispatch({type:CREATE_NEW_MESSAGE, payload:data});
    }
    catch(error) {
        console.log("create m error - ", error);
    }
}

export const getAllMessages=(messageData)=>async(dispatch)=>{
    try {
        const res = await fetch(`${BASE_API_URL}/api/messages/chat/${messageData.chatId}`, {
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${messageData.token}`
            },
        })
        const data = await res.json(); //! using await is crucial to convert Promise to Array. This was the issue all along
        console.log("all messages for current chat - ", data);
        dispatch({type:GET_ALL_MESSAGES, payload:data});
    }
    catch(error) {
        console.log("error fetching all messages for current chat - ", error);
    }
}