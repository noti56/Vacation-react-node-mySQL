import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Admin from './Admin'
import Login from './Login'
import Nav from './Nav'
import Register from './Register'
import Vacations from './Vacations'
import jwt_decode from 'jwt-decode'
import Charts from './Charts'


export default function App() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {    
    if (localStorage.token) {
      let decoded = jwt_decode(localStorage.token)
      dispatch({
        type: 'LOGIN',
        payload: decoded
      })
    }

  },[])

  return (
    <div className='app'>

 
      <BrowserRouter >
        {/* <Route path='/' component={Nav} /> */}
    
        <Route path='/' component={Nav} />
        <Route path='/login' component={Login} />
        <Route path='/charts' component={Charts} />
        <Route path='/register' component={Register} />
        <Route exact path='/' component={Vacations} />
        <Route path='/admin' component={Admin} />
        
      </BrowserRouter>


    </div>
  )
}
