const myQuery = require('./db')
const { vtuser, decodeToken, adminVer } = require('./verifyToken')

const router = require('express').Router()

router.post('/', vtuser, async (req, res) => {
    try {
        const token = decodeToken(req.body.token)
        if (!token) return res.status(401).json({ err: true, msg: `you are not logged in!` })
        const vacationsFullArr = await myQuery(`SELECT * FROM vacations;`)
        const followActions = await myQuery(`SELECT
         * FROM followers where user_id = ${token.id};`)
        //=============================================        
        if (!vacationsFullArr.length) return res.status(400).json({ err: false, vacationsFullArr, msg: `there is no vacations yet` })
        //====
        //creating the full array in the order of followed / unfollowed
        vacationsFullArr.forEach(vacation => {
            followActions.forEach(act => {
                if (act.vacation_id == vacation.id) {
                    vacation.isFollowed = true
                    // userFollowedArr.push(vacation)     // pushing the   
                }
            })
        })

        const notFollowed = vacationsFullArr.filter(vac => !vac.isFollowed)
        const userFollowedArr = vacationsFullArr.filter(vac => vac.isFollowed)
        let displayArr = [...userFollowedArr, ...notFollowed]
        //=============================================        
        res.status(200).json({ err: false, vacationsFullArr, displayArr, msg: `vacations sent` })


    } catch (err) {
        console.log(err);
        res.status(418).json({ err, msg: `im a teapot` })
    }
})

router.post('/follow/:vac_id', vtuser, async (req, res) => {
    try {

        const token = decodeToken(req.body.token)
        const vac_id = req.params.vac_id
        const { isFollowed } = req.body // if its true so its already followed and needs to be unfollowed
        if (!isFollowed) {
            //follow
            await myQuery(`INSERT INTO followers (user_id,vacation_id)
        VALUES (${token.id} ,${vac_id}); `)
            await myQuery(`UPDATE vacations SET followers = followers + 1 WHERE vacations.id = ${vac_id};  `)
            res.status(200).json({ err: false, msg: `follow command accepted well` })
        } else {
            //unfollow
            // await myQuery(`SELECT * FROM followers where `)
            await myQuery(`DELETE FROM followers WHERE vacation_id = ${vac_id} AND user_id = ${token.id};`) //  where the user id and vacation id(req.params.vac_id) matches the ones in client(token.id)
            await myQuery(`UPDATE vacations SET followers = followers - 1 WHERE vacations.id = ${vac_id};  `)
            res.status(200).json({ err: false, msg: `unfollowed  ` })

        }


    } catch (err) {
        console.log(err)
        res.status(418).json({ err, msg: `im a teapot` })
    }
})



//=============================================
// admin safe route for adding notes=>
router.post('/newVacation', vtuser, adminVer, async (req, res) => {
    try {

        const { vac_description, city, country, picture, price, from_date, to_date } = req.body

        //checking if all the requird data has been sent
        if (!vac_description || !city || !country || !picture || !price || !from_date || !to_date) return res.status(400).json({ err: true, msg: `dear admin you havent write all the necessery info` })

        await myQuery(`INSERT INTO vacations (vac_description, city, country, picture, price, from_date, to_date )
        VALUES ("${vac_description}","${city}","${country}","${picture}",${price},"${from_date}","${to_date}"); `)
        res.status(201).json({ err: false, msg: `${country} vacation added sucssesfuly` })
    } catch (err) {
        console.log(err)
        res.status(418).json({ err, msg: `im a teapot` })
    }
})
//==

router.delete('/:vac_id', vtuser, adminVer, async (req, res) => {
    try {
        const vac_id = req.params.vac_id
        await myQuery(`DELETE FROM followers WHERE vacation_id = ${vac_id};`)
        await myQuery(`DELETE FROM vacations WHERE id = ${vac_id};`)

        res.status(200).json({ err: false, msg: `the vacation has been deleted` })
    } catch (err) {
        console.log(err)
        res.status(418).json({ err, msg: `im a teapot` })
    }
})

router.put('/:vac_id', vtuser, adminVer, async (req, res) => {
    try {
        const { vac_description, city, country, picture, price, from_date, to_date } = req.body
        //checks if all the info is here. (must send from client ALL the OBJ every edit fetch request(PUT))
        if (!vac_description || !city || !country || !picture || !price || !from_date || !to_date) return res.status(400).json({ err: true, msg: `dear admin you havent write all the necessery info` })
        await myQuery(`UPDATE vacations
        SET vac_description = "${vac_description}", 
        city = "${city}", country = "${country}", 
        picture = "${picture}", price = "${price}", 
        from_date = "${from_date}", to_date = "${to_date}"
        WHERE id = ${req.params.vac_id}; `)
        res.status(200).json({ err: false, msg: `the vacation has been edited` })

    } catch (err) {
        console.log(err)
        res.status(418).json({ err, msg: `im a teapot` })

    }

})

//getFollows
router.post('/charts', vtuser, adminVer, async (req, res) => {
    try {

        const followActions = await myQuery(`SELECT id , followers FROM vacations WHERE followers > 0;`)
        //=======================     
        res.status(200).json({ err: false, msg: 'followers', followActions })

    } catch (err) {
        console.log(err)
        res.status(418).json({ err, msg: `im a teapot` })

    }
})

// מה שפה למטה זה פשוט עדכון אחרון ומוחשב אצלי לבונוס
router.post('/search', vtuser, async (req, res) => {
    try {
        const { target, searchQuery } = req.body
        if (!target || !searchQuery) return res.status(400).json({ err: true, msg: `you havent write all the necessery info` })
        const displayArr = await myQuery(`SELECT * FROM vacations
    WHERE vacations.${target} like "${searchQuery}%";`)

        res.status(200).json({ err: false, displayArr, msg: `vacations sent` })

    } catch (err) {
        console.log(err)
        res.status(418).json({ err, msg: `im a teapot` })

    }
})


module.exports = router



