const express = require('express');
const bodyparser = require('body-parser')
const app = express();
const cors = require('cors');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "isu_project"
});

app.use(bodyparser.urlencoded({ extended: true }))
app.use(cors());
app.use(express.json());

app.post('/api/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sqlSelect = "SELECT fullname FROM `user_login` WHERE emailid=? and password=md5(?);"
    db.query(sqlSelect, [email, password], (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

app.post('/api/register', (req, res) => {
    const fname = req.body.fname;
    const email = req.body.email;
    const password = req.body.password;

    const sqlInsert = "INSERT INTO `user_login` (`fullname`, `emailid`, `password`) VALUES (?, ?, MD5(?));"
    db.query(sqlInsert, [fname, email, password], (err, result) => {
        if (err) console.log(err);
    })
});

app.post('/api/loadterm', (req, res) => {
    const sqlSelect = "SELECT term_id, term_name FROM `isu_cs_terms` WHERE is_active = 'Y';"
    db.query(sqlSelect, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

app.post('/api/loadsubject', (req, res) => {
    const sqlSelect = "SELECT crn, sub_code, sub_name FROM `isu_cs_subjects`"
    db.query(sqlSelect, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

app.post('/api/submit', (req, res) => {
    console.log(req.body);
    const preference = req.body.preference;
    const fname = req.body.fullname;
    const capacity = req.body.capacity;

    const sqlInsert = "INSERT INTO `user_preference` (`fullname`, `preference`, `capacity`) VALUES (?, ?, ?);";
    db.query(sqlInsert, [fname, preference, capacity], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json({ success: true, message: 'Data inserted successfully' });
    });
});

app.get('/api/user_preference', (req, res) => {
    const sqlSelect = "SELECT * FROM `user_preference`";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(result);
    });
});


app.get('/api/ex', (req, res) => {
    res.status(200).json({ "a": 1 });
})



app.listen(3001, () => {
    console.log('running on port 3001')
});