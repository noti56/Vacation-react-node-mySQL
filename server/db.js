const mysql = require('mysql')

const con = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'vacations'
})




con.connect((err) => {
    if (err) {
        console.log('error connecting: ' + err.stack)
        return
    }
    console.log('connected to mysql')
})

const myQuery = (q) => {
    return new Promise((resolve, reject) => {
        con.query(q, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}


module.exports = myQuery