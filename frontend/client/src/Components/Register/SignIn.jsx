
import { Button, Snackbar, Alert } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { currentUser, login } from '../Redux/Auth/Action';

const SignIn = () => {

    const [openSbar, setOpenSbar] = useState(false);
    const dispatch = useDispatch();
    const auth = useSelector(store=>store)
    const token = localStorage.getItem("token")
    const navigate = useNavigate();

    const [inputData, setInputData] = useState({ email: "", password: "" });
    const handleSubmit = (e) => {
        e.preventDefault(); //important
        console.log("handling submit");
        setOpenSbar(true);
        // handleChange(e);
        dispatch(login(inputData));
    }

    const handleChange = (e) => {
        const {name,value}=e.target;
        setInputData((values)=>({...values,[name]:value}))
    }

    const handleSbarClose = () => {
        setOpenSbar(false);
    }

    useEffect(()=>{
        if(token) dispatch(currentUser(token));
    },[token])

    useEffect(() => {
        if(auth.reqUser?.full_name) {
            navigate("/")
        }
    },[auth.reqUser])

    return (
        <div>
            <div className='flex justify-center h-screen items-center'>
                <div className='w-[30%] p-10 shadow-md bg-white'>
                    <form typ onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <p className='mb-2'>Email</p>
                            <input type='text' className='py-2 outline outline-green-600 w-full rounded-md border text-black'
                                placeholder='Enter your email' name='email' value={inputData.email} onChange={(e)=>handleChange(e)} />
                        </div>

                        <div>
                            <p className='mb-2'>Password</p>
                            <input type='text' className='py-2 outline outline-green-600 w-full rounded-md border'
                                placeholder='Enter your Password' value={inputData.password} name='password' onChange={(e)=>handleChange(e)} />
                        </div>
                        {/* Pay attention to how the bg color was changed */}
                        <div className='pt-5'>
                            <Button type='submit' className='w-full' sx={{ bgcolor: 'green' }} variant='contained'>SignIn</Button>
                        </div>
                    </form>  {/* Go see app.js*/}


                    <div className='flex space-x-3 items-center mt-5'>
                        <p className='m-0'>Create New Account</p>
                        <Button variant='text' onClick={() => navigate("/signup")}>SignUp</Button>
                    </div>


                </div>

            </div>
            {/* <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Note archived"
                action={action}
                severity="success"
            /> */}

            <Snackbar open={openSbar} autoHideDuration={6000} onClose={handleSbarClose}>
                <Alert
                    onClose={handleSbarClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Logged in
                </Alert>
            </Snackbar>

        </div>
    )
}

export default SignIn