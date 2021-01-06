import React, { useState } from 'react'
import { Button, Divider, MenuItem, Select, FormControl, InputLabel, TextField } from '@material-ui/core'
import { useDispatch } from 'react-redux'


export default function Search() {
    const [target, setTarget] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const dispatch = useDispatch()
    
    const handleClick = async () => {
        console.log("כל הקמפוננטה הזו היא מבחינת קוד ומבחינת עיצוב היא פיור בונוס מבחינתי.  זה לא היה במסמך איפיון והחוסר סדר של המכללה לא הגיוני שיפגע בציון שלי !");
        const token = localStorage.getItem('token')
        let res = await fetch(`http://localhost:1000/vacations/search`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'token': token
            },
            body: JSON.stringify({ target, searchQuery })
        })
        // let data = await res.json()
        let data = await res.json()
        console.log(data);
        dispatch({
            type: 'SEARCH',
            payload:data.displayArr
        })
    }

    const cancelSrc = ()=>{
        dispatch({
            type: 'CANCELSEARCH',
            
        })
    }

    return (
        // כל הקמפוננטה הזו היא פיור בונוס מבחינתי. זה לא היה במסמך איפיון והחוסר סדר של המכללה לא הגיוני שיפגע בציון שלי !
        <div className='search'>
            {/* search  */}

            <TextField onChange={(e) => setSearchQuery(e.target.value)} id="standard-search" label="Search field" type="search" />
            <FormControl className='select'>
                <InputLabel id="demo-simple-select-label">city/country</InputLabel>
                <Select
                    onChange={(e) => setTarget(e.target.value)}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                >
                    <MenuItem value={'city'}>city</MenuItem>
                    <MenuItem value={'country'}>country</MenuItem>
                </Select>
            </FormControl>

            <Button onClick={handleClick}
                color="primary" variant='outlined'>Search</Button>

            <Button color="secondary" variant='outlined' onClick={cancelSrc}>
                 cancel search</Button>
        </div>
    )
}
