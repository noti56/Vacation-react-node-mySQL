import { Button, Divider, MenuItem, Select, FormControl, InputLabel, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Search from './Search'

export default function Nav({ history }) {
    // const [renderModal, setRender] = useState(false)


    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    console.log(user);
    const logins = () => {
        if (user) {
            localStorage.removeItem('token')
            dispatch({
                type: 'LOGOUT',
                payload: ''
            })
        } else {
            history.push('/login')
        }
    }

 


    return (
        <div className='nav'>

            <Button onClick={logins} variant='contained' color={user ? ('secondary') : ('primary')} > {user ? ('Logout') : ('Login')}</Button>

            {user.isAdmin ? (<Link to='/charts'><Button variant='outlined' color='inherit' >Charts</Button></Link>) : (null)}

        {user ? ( <Search/>):(null)}  

            <Divider />

        </div>
    )
}
