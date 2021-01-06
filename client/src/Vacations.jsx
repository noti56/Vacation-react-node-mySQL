import { Button, Divider, Paper } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { displayDate } from './fixDate'
import Search from './Search'

export default function Vacations({ history }) {

    const user = useSelector(state => state.user)
    const vacs = useSelector(state => state.vacs)
    const [vacations, setVacations] = useState([])
    const[reRender,setRerender] = useState(false)

    useEffect(() => {
        if (!user) {
            history.push('/login')
        }
        else if (user.isAdmin) {
            history.push('/admin')
        }

    }, [user])

    useEffect(() => {
        if(!vacs){
            (async () => {
                getData()
            })()
        }else{
            setVacations(vacs)
        }

    }, [vacs])
    const getData = async () => {

        if (!user.isAdmin) {
            const token = localStorage.getItem('token')
            let res = await fetch('http://localhost:1000/vacations/', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({ token })
            })
            // let data = await res.json()
            let data = await res.json()
            console.log(data, 'data');

            if (!data.displayArr) {
                setVacations(data.vacationsFullArr)
                console.log('from vacationFullArr')

            } else {
                setVacations(data.displayArr)
                console.log('from displayArr (fixed order array)')
            }



        }
    }

    const handleFollow = async (isFollowed, vac_id) => {
        
        const token = localStorage.getItem('token')
        let res = await fetch(`http://localhost:1000/vacations/follow/${vac_id}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'token': token
            },
            body: JSON.stringify({ token, isFollowed })
        })
        // let data = await res.json()
        let dat = await res.json()
        console.log(dat, 'data from follow/unfollow req');
        getData()
    }




    // לכל תא שקיים במערך של הכל שהאיידי של החופשה זהה לחופשה נכנס למערך חדש


    return (
        <>
        
        <div className='newVacation'> </div>
        
            <div className='main'>

                
                {vacations.length ? (
                    vacations.map((vac, i) => (
                        <Paper className='vacPaper' key={i}> <ul>
                            <Divider/>
                            <li>{vac.isFollowed ? (<Button color='secondary' variant='contained' onClick={() => handleFollow(true, vac.id)}>💘followed💘</Button>) :
                                (<Button variant='contained' color='primary' onClick={() => handleFollow(false, vac.id)}>😍follow😍</Button>)}</li>
                            <li>country: {vac.country}</li>
                            <li>city {vac.city}</li>
                            <li>description: {vac.vac_description}</li>
                            <li>price: {vac.price}</li>
                            <li><img src={vac.picture} alt="vacation picture" /></li>
                            <li>from: {displayDate(vac.from_date)}</li>
                            <li>to: {displayDate(vac.to_date)}</li>
                        </ul>
                        <Divider/>
                        </Paper>
                    ))
                ) : (null)}
            </div>
        </>
    )
}
