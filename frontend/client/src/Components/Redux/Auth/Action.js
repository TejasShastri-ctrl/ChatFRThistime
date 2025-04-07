import { BASE_API_URL } from "../../../config/api"
import { LOGIN, REGISTER, REQ_USER, UPDATE_USER, SEARCH_USER, LOGOUG } from "./ActionType";


export const register = (data) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/signup`, {
            method: "POST", headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const resData = await res.json();
        console.log('resData token : ', resData)
        if(resData.jwt) {
            localStorage.setItem("token",resData.jwt)
        }
        console.log('registering user', resData);
        dispatch({ type: REGISTER, payload: resData });
        console.log('resdata dispatched after register')
    } catch (error) {
        console.log('error signup : ', error)
    }
}

export const login = (data) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/signin`, {
            method: "POST", headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const resData = await res.json();
        localStorage.setItem("token",resData.jwt)
        console.log('login', resData);
        dispatch({ type: LOGIN, payload: resData });
    } catch (error) {
        console.log('error signin : ', error);
    }
}

// No body as it's GET you idiot
export const currentUser = (token) => async (dispatch) => {
    console.log('token', token);
    try {
        console.log('checkpoint 1 - started try block');
        console.log('Request URL:', `${BASE_API_URL}/api/users/profile`);
        
        const res = await fetch(`${BASE_API_URL}/api/users/profile`, {
            method:"GET", headers:{
                "Content-Type" : "application/json",
                Authorization : `${token}` //used to be Bearer {token} incase things dont work out
            }
        });
        console.log('checkpoint2 - response fetched')
        const resData = await res.json();
        console.log('currUserdata', resData);
        dispatch({type:REQ_USER, payload:resData});
        console.log('after dispatch in currentUser')
    } catch (error) {
        console.log('error currUser : ', error);
    }
}

export const searchUser = (data) => async (dispatch) => {
    console.log('data sent to search api - ', data);
    try {
        const res = await fetch(`${BASE_API_URL}/api/users/search?name=${data.keyword}`, {
            method:"GET", headers:{
                "Content-Type" : "application/json",
                Authorization : `Bearer ${data.token}`
            }
        });
        const resData = await res.json();
        console.log('searched user - ', resData);
        dispatch({type:SEARCH_USER, payload:resData});
    } catch (error) {
        console.log('error searchUser : ', error);
    }
}

export const updateUser = (data) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/api/users/update/${data.id}`, {
            method:"PUT", headers:{
                "Content-Type" : "application/json",
                Authorization : `Bearer ${data.token}`
            },
            body:JSON.stringify(data.data)
        });
        const resData = await res.json();
        console.log('currUserdata', resData);
        dispatch({type:UPDATE_USER, payload:resData});
    } catch (error) {
        console.log('error searchUser : ', error);
    }
}

export const logoutAction=()=>async(dispatch)=>{
    localStorage.removeItem("token");
    dispatch({type:LOGOUG, payload:null})
    dispatch({type:REQ_USER, payload:null})
}