import { GET_ALL_MESSAGES, CREATE_NEW_MESSAGE } from "./ActionType"

const initialValue={
    messages:[],
    newMessage:null,
}

export const messageReducer=(store=initialValue, {type,payload}) => {
    if(type === CREATE_NEW_MESSAGE) {
        return {...store, newMessage:payload}
    } else if(type === GET_ALL_MESSAGES) {
        return {...store, messages:payload}
    }
    return store;
}