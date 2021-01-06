import React, { useEffect, useState } from 'react'
import { Button, TextField } from '@material-ui/core'
import {useSelector } from 'react-redux'
import {Link as MaterialLink} from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function Register({history}) {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const user = useSelector(state => state.user)

    useEffect(() => {
        if(user){
            history.push('/')
        }
    }, [user])

    const handleSubmit = async()=>{
        try {
            
            console.log('register fetch req');
            let res = await fetch('http://localhost:1000/users/register',{
                method:'POST',
                headers:{'content-type':'application/json'},
                body:JSON.stringify({userName,password,firstName,lastName})            
            })
            let data = await res.json()
            if(data.err){
                console.log(data.msg);
                setErrMsg(data.msg);
            }else{
                setErrMsg(data.msg)
                // console.log(data.hash);               
            }

        } catch (err) {
            console.log(err);            
            
        }
    }
    return (
        <div className="forms">
            
        <div className='login'>
             <TextField  onChange={(e)=>setFirstName(e.target.value)} label="first name" variant="outlined" />
             <TextField onChange={(e)=>setLastName(e.target.value)} label="last name" variant="outlined" />
             <TextField onChange={(e)=>setUserName(e.target.value)} label="username" variant="outlined" />
            <TextField onChange={(e)=>setPassword(e.target.value)} label="password" variant="outlined" type="password"/>
            <Button variant='contained' color='primary' onClick={handleSubmit} >submit</Button>
            <Link to='/login' className='link'> <MaterialLink component="button"variant="body2"  > already have an account ? login </MaterialLink></Link>
            {errMsg}
        </div>
        </div>
    )
}
