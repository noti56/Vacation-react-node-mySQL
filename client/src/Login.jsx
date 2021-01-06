import { Button, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import jwt_decode from 'jwt-decode'
import {Link as MaterialLink} from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function Login({history}) {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    
    const handleSubmit = async (e)=>{
        console.log('login fetch req');
        let res = await fetch('http://localhost:1000/users/login',{
            method:'POST',
            headers:{'content-type':'application/json'},
            body:JSON.stringify({userName,password})            
        })        
        let data = await res.json()
        if(data.err ){    
            console.log(data.msg);
            setErrMsg(data.msg)

        }else{
            let decoded = jwt_decode(data.token)
            console.log(decoded);
            localStorage.token = data.token // == to setItem the original token ! not the decoded one
            dispatch({
                type: 'LOGIN',
                payload:decoded
            })
            history.push('/')

        }
    }
    
    useEffect(() => {
      if(user){
          history.push('/')
      }  
    }, [user])


    return (
        <div className="forms">
        <div className='login'>            
            <TextField id="filled-basic"  variant='filled' onChange={(e)=>setUserName(e.target.value)} label="username"  />
            <TextField onChange={(e)=>setPassword(e.target.value)} label="password" variant="outlined" type="password"/>
            <Button onClick={handleSubmit} variant='contained' color='primary' >submit</Button>
           <Link to='/register' className='link'> <MaterialLink component="button"variant="body2">dont have an account ? register </MaterialLink></Link>
            {errMsg}
        </div>
        </div>
    )
}
