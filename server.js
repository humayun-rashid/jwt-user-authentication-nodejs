const express = require('express')
const app =express()
const bcrypt = require('bcrypt')
app.use(express.json())
const users = []

const port = 3000
app.get('/users', function(req,res){
    res.json(users)
})


app.post('/users', async function(req,res){
    try{
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        console.log(salt)
        console.log(hashedPassword)
        const user = { name: req.body.name, email:req.body.email, password:hashedPassword }        
        users.push(user)
        res.status(201).send(user)
    } catch (err){
        res.status(500).json({message: err.message})
    }
})

app.post('users/login', async function (req,res){
    const user = users.find(user => user.name === req.body.name)
    if (user== null){
        return res.status(400).send("User was not found in the system")
    }
    try{
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send("Login is successful")
        }
        else {
            res.send("Not allowed")
        }
    } catch (err) {
        res.status(500).send()
    }

})

app.listen(port, function(){
    console.log('App is running in port 3000')
})