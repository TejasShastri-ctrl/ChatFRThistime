import { Button, Snackbar, Alert } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { currentUser, register } from "../../Components/Redux/Auth/Action"
import { store } from '../Redux/store';

const SignUp = () => {

    const [openSbar, setOpenSbar] = useState(false);

    const navigate = useNavigate();

    const [inputData, setInputData] = useState({ full_name: "", email: "", password: "" });

    // learn about this
    const {auth} = useSelector(store=>store)

    const dispatch=useDispatch();

    const token = localStorage.getItem("token")

    console.log('current user : ', auth.reqUser);

    const handleSubmit = (e) => {
        e.preventDefault(); //important
        console.log("handling submit", inputData);
        dispatch(register(inputData));
        setOpenSbar(true);
    }

    const handleChange = (e) => {
        const {name,value}=e.target;
        setInputData((values)=>({...values,[name]:value})) //!
    }

    const handleSbarClose = () => {
        setOpenSbar(false);
    }

    //! suspicious
    const resetAndGo=()=>{
        localStorage.setItem("token", null);
        navigate("/signup")
    }

    useEffect(() => {
        if(token) dispatch(currentUser(token))
    },[token])

    useEffect(() => {
        if(auth.reqUser?.full_name) {
            navigate("/")
        }
    },[auth.reqUser])

    return (
        <div>
            <div>
                <div className='flex flex-col justify-center min-h-screen items-center'>
                    <div className='w-[30%] p-10 shadow-md bg-white'>
                        <form onSubmit={handleSubmit} className='space-y-5'>
                            <div>
                                <p className='mb-2'>Username</p>
                                <input className='py-2 px-3 outline outline-green-600 w-full rounded-md border-1'
                                    type='text' placeholder='Enter Username' name='full_name' onChange={(e) => handleChange(e)}
                                    value={inputData.full_name}
                                />
                            </div>

                            <div>
                                <p className='mb-2'>Email</p>
                                <input className='py-2 px-3 outline outline-red-400 w-full rounded-md border-1'
                                    type='text' placeholder='Enter email:' name='email' onChange={(e) => handleChange(e)}
                                    value={inputData.email}
                                />
                            </div>

                            <div>
                                <p className='mb-2'>Password</p>
                                <input className='py-2 px-3 outline outline-red-400 w-full rounded-md border-1'
                                    type='text' placeholder='Enter password:' name='password' onChange={(e) => handleChange(e)}
                                    value={inputData.password}
                                />
                            </div>

                            <div className='pt-5'>
                                <Button type='submit' className='w-full' sx={{ bgcolor: 'green' }} variant='contained'>Sign Up</Button>
                            </div>
                        </form>

                        <div className='flex space-x-3 items-center mt-5'>
                            <p className=''>Alreday have an account?</p>
                            <Button variant='text' onClick={()=>navigate("/signin")}>Sign In</Button>
                        </div>
                    </div>
                </div>
                <Snackbar open={openSbar} autoHideDuration={6000} onClose={handleSbarClose}>
                <Alert
                    onClose={handleSbarClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Account created
                </Alert>
            </Snackbar>
            </div>
        </div>
    )
}

export default SignUp