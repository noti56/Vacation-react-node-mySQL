const jwt = require('jsonwebtoken')

const vtuser = (req, res, next) => {
    jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return res.status(403).json({ err: true, msg: err.message })
        req.user = payload
        next()
    })

}

const decodeToken = (token) => {
    const decoded = jwt.decode(token, process.env.TOKEN_SECRET)
    console.log(decoded)
    return decoded;
}


const adminVer = (req, res, next) => {
    const token = decodeToken(req.headers.token)
    const vac_id = req.params.vac_id
    // checking admin
    if (!token.isAdmin) return res.status(401).json({ err: true, msg: `you are not an admin!` })
    next()
}

module.exports = { vtuser, decodeToken, adminVer }