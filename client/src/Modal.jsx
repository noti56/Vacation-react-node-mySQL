import { Button, Divider, Paper, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'

export default function Modal({ newVac, editVac, setRender, editedVac, setDelete, deleteBTN }) {
    const [Vac, setVac] = useState([])
    const [token, setToken] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [header, setHeader] = useState('')

    //=====
    const [vac_description, setvac_description] = useState('')
    const [city, setcity] = useState('')
    const [country, setcountry] = useState('')
    const [picture, setpicture] = useState('')
    const [price, setprice] = useState('')
    const [from_date, setfrom_date] = useState('')
    const [to_date, setto_date] = useState('')
    //=========


    useEffect(() => {
        console.log('newVac', newVac, editVac,);
        if (deleteBTN) {
            setDelete(false)    // אם לוחצים על כפתור מחיקת מחיקה בלי ההוספה הזו זה פותח את המודאל עדיין בגלל האוןקליק על כל הקארד
            setRender(false)
        }
        else if (newVac) {
            setHeader('add a new vacation !')
        } else if (editVac) {
            setHeader('edit the vacation !')
            console.log(editedVac, 'editedVac');
            //=======
            setvac_description(editedVac.vac_description)
            setcity(editedVac.city)
            setcountry(editedVac.country)
            setpicture(editedVac.picture)
            setprice(editedVac.price)
            setfrom_date(editedVac.from_date)
            setto_date(editedVac.to_date)
        }

        setToken(localStorage.token)
    }, [])
    const handleSubmit = async () => {
        if (newVac) {
            //newVacation            
            let res = await fetch('http://localhost:1000/vacations/newVacation', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({ vac_description, city, country, picture, price, from_date, to_date })
            })
            let data = await res.json()
            console.log(data);
            if (!data.err) {

                setRender(false) // closes modal
            }
            else if (data.err) {
                setErrMsg(data.msg)
            }
        }
        else if (editVac) {
            // editedVaction!            
            let res = await fetch(`http://localhost:1000/vacations/${editedVac.id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({ vac_description, city, country, picture, price, from_date, to_date })
            })
            let data = await res.json()
            console.log(data);
            if (data.err) {
                setErrMsg(data.msg)
            } else {
                setRender(false) //closing Modal
            }

        }
    }

    return (
        <div>
            <Divider />
            <div className='headerModal'> <h3 >{header}</h3></div>
            <Divider />
            <div className="divmodal">

                <Paper className='modal'>
                    <Button variant='contained' color='primary' onClick={() => setRender(false)}>Go Back</Button>
                    <    TextField inputProps={{ min: 0, style: { textAlign: 'center' } }} id="standard-basic" value={editVac ? (vac_description) : (null)} placeholder="description" onChange={(e) => setvac_description(e.currentTarget.value)} />
                    <   TextField inputProps={{ min: 0, style: { textAlign: 'center' } }} id="standard-basic" value={editVac ? (city) : (null)} placeholder="city" onChange={(e) => setcity(e.currentTarget.value)} />
                    <  TextField inputProps={{ min: 0, style: { textAlign: 'center' } }} id="standard-basic" value={editVac ? (country) : (null)} placeholder="country" onChange={(e) => setcountry(e.currentTarget.value)} />
                    <   TextField inputProps={{ min: 0, style: { textAlign: 'center' } }} id="standard-basic" value={editVac ? (picture) : (null)} placeholder="picture" onChange={(e) => setpicture(e.currentTarget.value)} />
                    <  TextField inputProps={{ min: 0, style: { textAlign: 'center' } }} id="standard-basic" value={editVac ? (price) : (null)} placeholder="price" onChange={(e) => setprice(e.currentTarget.value)} />
                    <   TextField inputProps={{ min: 0, style: { textAlign: 'center' } }} id="standard-basic" value={editVac ? (from_date) : (null)} placeholder="from_date" onChange={(e) => setfrom_date(e.currentTarget.value)} />
                    <   TextField inputProps={{ min: 0, style: { textAlign: 'center' } }} id="standard-basic" value={editVac ? (to_date) : (null)} placeholder="to_date" onChange={(e) => setto_date(e.currentTarget.value)} />
                    <Button variant='contained' color='primary' onClick={handleSubmit}>Submit </Button>
                    {errMsg ? (<Paper>{errMsg} </Paper>) : (null)}
                </Paper>
            </div>
        </div>
    )
}
// new vac || edit vac=>
// vac_description text ,
// city VARCHAR(255) not null,
// country VARCHAR(255) not null,
// picture VARCHAR(255) not null,
// price INT not null,
// from_date DATE NOT NULL,
// to_date DATE NOT NULL,

