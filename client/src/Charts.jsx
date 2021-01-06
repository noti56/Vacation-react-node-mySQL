import { Button, Paper } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { VictoryBar, VictoryChart, VictoryAxis,VictoryTheme  } from 'victory'

export default function Charts({ history }) {
    const [followers, setFollowers] = useState([])
    const user = useSelector(state => state.user)

    useEffect(() => {
        if (!user.isAdmin || !user) {
            history.push('/')
        }
    }, [user])

    useEffect(() => {
        (async () => {
            if (user.isAdmin) {
                getData()
            }
        })()
    }, [])

    // map on the state to amount followers. and then into a new array and it will be displayed through victory


    const getData = async () => {
        if (user.isAdmin) {
            const token = localStorage.getItem('token')
            let res = await fetch('http://localhost:1000/vacations/charts', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'token': token
                },
            })

            let data = await res.json()
            const { followActions } = data

            setFollowers(followActions)
            console.log(followActions);

        }
    }

    const displayXVac = followers.map(f => 'vacation id ' + f.id)
    const displayX = followers.map(f => f.id)
    


    return (
        <>
            <Button onClick={() => { history.push('/') }} variant='contained' color='primary' >back</Button>
            {followers.length ? (<div className='charts'>
                <Paper>
                    <VictoryChart domainPadding={30}>
                        <VictoryAxis tickValues={displayX}
                            tickFormat={displayXVac}
                        />
                        <VictoryAxis dependentAxis tickFormat={(x)=>(x) }/>
                        <VictoryBar data={followers} x='id' y='followers' />
                    </VictoryChart>
                </Paper>
            </div>) : (<><br /><br /> <div className='errMsg'><p>no followings to display</p> </div> </>)}
          
        </>
    )
}
