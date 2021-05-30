const express = require('express')
const app = express()
const port = 3000
const database = require('./database')

app.use(express.urlencoded({ extended: true }))

var cors = require('cors');

app.use(cors({origin: 'http://localhost:3001'}))
app.use(express.json());       // to support JSON-encoded bodies


app.get('/user', (req, res) =>{
    database.query(`SELECT * FROM users WHERE email = "${(req.query.email)}" AND password = "${(req.query.password)}"`, (error, results, fields) => {
        if (results == "") {
            res.json({
                status:"404", 
                data: "No found"
            })
        }
        else{
            res.json({
                status:"200", 
                data: results
                
            })
        }
    })
})


app.get('/user/:id', (req, res) =>{
    database.query(`SELECT * FROM users WHERE id = "${(req.params.id)}"`, (error, results, fields) => {
        if (results == "") {
            
            res.json({
                status:"404", 
                data: "No found"
            })
        }
        else{
            
            res.json({
                status:"200", 
                data: results
                
            })
        }
       
    })
})

app.post('/messages', (req, res) =>{
    database.query(`INSERT INTO messages (title, content, messages.read, projet) VALUES ("${(req.body.title)}", "${(req.body.content)}", "1", "2")`, (error, results, fields) => {
        if (results == "") {
            res.json({
                status:"400", 
                data: "Bad Request"
            })
        }
        else{
            let lastId = results.insertId
            database.query(`SELECT * FROM users WHERE users.email = "${(req.body.email)}"`, (error, results1, fields) => {
                let receveur = results1[0].id
               
                database.query(`SELECT * FROM users WHERE users.email = "${(req.body.sender)}"`, (error, results2, fields) => {
                    let sender = results2[0].id
                    console.log(sender)
                    database.query(`INSERT INTO usermessages (MessageId, receveur, sender) VALUES ("${lastId}", '${receveur}', '${sender}')`, (error, results, fields) => {
                        console.log(error)
                    })
                })
            })
            res.json({
                status:"201", 
                data: results
            })
        }
    })
})

app.post('/user', (req, res) =>{
    database.query(`INSERT INTO users (email, password, tel) VALUES ("${(req.body.email)}", "${(req.body.password)}", "${(req.body.tel)}");`, (error, results, fields) => {
        if (results == "") {
            res.json({
                status:"400", 
                data: "Bad Request"
            })
        }
        else{
            console.log(req.body)
            res.json({
                status:"201", 
                data: results
                
            })
        }
    })
})



app.get('/messages/section/:url', (req, res) =>{
    database.query(`SELECT * FROM messages INNER JOIN projects ON messages.projet = projects.id WHERE projects.name = "${req.params.url}"`, (error, results, fields) => {
        res.json(results)
    })
})

app.get('/messages/project', (req, res) =>{
    database.query(`SELECT projects.name FROM projects`, (error, results, fields) => {
        res.json(results)
    })
})

app.get('/messages/unread', (req, res) =>{
    database.query(`SELECT * FROM usermessages INNER JOIN messages ON usermessages.MessageId = messages.id WHERE receveur = ${req.query.receveur} AND messages.read = 1`, (error, results, fields) => {
        res.json(results)
    })
})

app.get('/messages/read', (req, res) =>{
    database.query(`SELECT * FROM usermessages INNER JOIN messages ON usermessages.MessageId = messages.id WHERE receveur  = ${req.query.receveur} AND messages.read = 0`, (error, results, fields) => {
        res.json(results)
        console.log(req.params.receveur)
    })
})


app.get('/messages/:id', (req, res) =>{
    database.query(`SELECT * FROM usermessages INNER JOIN messages ON usermessages.MessageId = messages.id WHERE receveur = ${req.query.id}`, (error, results, fields) => {
        res.json(results)
    })
})

app.get('/tasks', (req, res) =>{
    database.query(`SELECT * FROM tasks WHERE tasks.user_id = ${req.query.id} AND tasks.date = "${req.query.date}"`, (error, results, fields) => {
        if (results == "") {
            res.json({
                status:"404", 
                data: "No data"
            })
        }
        else{
            res.json({
                status:"200", 
                data: results
                
            })
        }
    })
})

app.put('/tasks', (req, res) =>{
    database.query(`UPDATE tasks SET finished = ${req.query.finished} WHERE tasks.id = ${req.query.id};`, (error, results, fields) => {
       console.log(error)
    })
})

app.get('/markdown', (req, res) => {
    if(!req.query.file) {
        res.status(400).send();
        return 
    }

    console.log (req.query.file)
    let filename = ''
    let num = parseInt(req.query.file,10) 


    switch (num) {
        case NaN:
            res.status(400).send();
            break;
        case 1:
            filename = 'formation';
            break;
        case 2:
            filename = 'video'
            break;
        case 3:
            filename = 'quizz'
            break;
        default:
            res.status(404).send();
    }

    const fs = require('fs');


        fs.readFile(`./markdown/${filename}.md`, 'utf8' , (err, data) => {
        if(err) {
            res.status(404).send();
            return 
        }
        res.send(data);
    })
})



app.listen(port, () => {
    
})