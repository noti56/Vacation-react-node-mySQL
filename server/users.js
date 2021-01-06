const router = require('express').Router()
const myQuery = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post('/register', async (req, res) => {

    try {        
        const { firstName, lastName, userName, password } = req.body
        if (!firstName || !lastName || !userName || !password) return res.status(400).json({ err: true, msg: 'info is missing' })

        const query = await myQuery(`SELECT * FROM users WHERE userName="${userName}";`)
     
        if (query.length) return res.status(400).json({ err: true, msg: 'user already exists' })

        const hash = await bcrypt.hash(password, 10);

        await myQuery(`INSERT INTO users(firstName, lastName, userName, password ) 
            VALUES('${firstName}', '${lastName}', '${userName}','${hash}');`)
        res.status(201).json({ err: false,hash,msg: `hello ${firstName}! u registered to vacations` })

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: true })
    }


})



router.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body
        if (!userName || !password) return res.status(400).json({ err: true, msg: 'info is missing' })

        const user = await myQuery(`SELECT * FROM users WHERE userName ="${userName}"`)
        if (!user.length) return res.status(400).json({ err: true, msg: `userName ${userName} does not exist` })

        const passwordMatch = await bcrypt.compare(password, user[0].password)
        if (!passwordMatch) return res.status(401).json({ err: true, msg: 'wrong password' })

        const token = jwt.sign({ ...user[0], password: 'no password here' }, process.env.JWT_SECRET)

        if(user[0].isAdmin)  res.status(200).json({ err: false, msg: `hello ${user[0].firstName} !`,token ,isAdmin :true})

        res.status(200).json({ err: false, msg: `hello ${user[0].firstName} !`,token,isAdmin:false })

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: true })
    }
})

module.exports = router