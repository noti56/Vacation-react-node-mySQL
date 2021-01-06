import { Button, Divider, Paper } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { displayDate } from './fixDate'
import Modal from './Modal'

export default function Admin({ history }) {
    const user = useSelector(state => state.user)
    const vacs = useSelector(state => state.vacs)
    const [vacations, setVacations] = useState([])
    const [renderModal, setRender] = useState(false)
    const [newVac, setnewVac] = useState(false)
    const [editVac, setEditVac] = useState(false)
    const [editedVac, setEditedtVac] = useState({})
    const [deleteBTN, setDelete] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        if (!user || !user.isAdmin) {
            history.push('/login')
        }
    }, [user])

    useEffect(() => {
        if (!vacs) {
            (async () => {
                // dispatch({
                //     type:'CANCELSEARCH'
                // })
                getData()
            })()
        }else{
            setVacations(vacs)
        }
    }, [renderModal,vacs])   // to refresh the data after editing PUT req / DELETE req

    const modalChoose = (setTrue) => {
        if (setTrue === 'newVac') { setnewVac(true); setEditVac(false) }
        if (setTrue === 'editVac') { setEditVac(true); setnewVac(false) }
        // הפונקציה הזו רצה או בלחיצה על עריכה או על הוספת פתק, והיא גורמת לפעולה הנכונה לקרות על פי תנאי בוליאני פשוט        
    }

    const getData = async () => {
        if (user.isAdmin) {
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
            setVacations(data.vacationsFullArr)

        }
    }
    const deleteVac = async (id) => {
        const token = localStorage.getItem('token')
        let res = await fetch(`http://localhost:1000/vacations/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'token': token
            }
        })
        let data = await res.json()
        getData()
    }




    return (
        <>
            {!renderModal ? (<div className='newVacation'><Button color='primary' variant='contained' onClick={() => { setRender(true); modalChoose('newVac') }}> 🚢✈🌴</Button></div>) : (null)}
            {renderModal ? (<Modal newVac={newVac}
                editedVac={editedVac} setRender={setRender}
                editVac={editVac}
                setDelete={setDelete}
                deleteBTN={deleteBTN}
            />) : (null)}

            {!renderModal ? (

                <div className='main adminVac' >

                    {vacations.length ? (
                        vacations.map((vac, i) => (

                            <Paper className='vacPaper' key={i} onClick={() => { setRender(true); modalChoose('editVac'); setEditedtVac(vac) }} >
                                <Divider />
                                <ul>
                                    {renderModal ? (null) :  // אם המודאל פתוח אז שלא ירנדר את שאר החופשות
                                        (<li><Button className='deleteBtn' onClick={() => { deleteVac(vac.id); setDelete(true) }} >❌</Button></li>)}
                                    <li>country: {vac.country}</li>
                                    <li>city: {vac.city}</li>
                                    <li>description: {vac.vac_description}</li>
                                    <li>price: {vac.price}</li>
                                    <li><img src={vac.picture} alt='vacation picture' /></li>
                                    <li>from: {displayDate(vac.from_date)}</li>
                                    <li>to: {displayDate(vac.to_date)}</li>
                                </ul>
                                <Divider />
                            </Paper>

                        ))
                    ) : (null)}
                </div>
            )
                : (null)}
        </>
    )
}
