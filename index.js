const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

const JWT_SECRET_KEY = "eyJpZCI6MSwidXNlcm5hbWUiOiJ1c3VhcmlvMSIsInJvbGUiOiJzYWRtaW4iLCJpYXQiOjE3MzI4MjgzNjYsImV4cCI6MTczMjgzMTk2Nn0"


const users = [
    {
        id: 1,
        externalId: "3e427033-cf1c-4687-823c-90934c816ba8",
        username: "clase@hola.cl",
        password: "clase_2024",
        role: "admin"
    }
]

const authValidation = (req, res, next) =>{
    const authHeader = req.headers['authorization'];

    console.log("authHeader", authHeader)

    const token =  authHeader && authHeader.split(' ')[1];

    console.log("token", token)

    if(!token){
        res.status(401).json( { message: "Error, token no existe - o no proporcionado" } )
    }

    try {
        const decode = jwt.verify(token, JWT_SECRET_KEY);
        console.log("decode", decode)
        req.user = decode;
    
        next();
        
    } catch (error) {
        return res.status(403).json({ message: "Error Token Invalido" })
    }

}


app.post('/login', (req, res) => {

    const { username, password } = req.body;
    
    if(!username || !password){
        return res.status(401).json({ error:  "Bad Credentials" })
    }

    const user = users.find(user => user.username === username && user.password === password)

    if(!user){
        return res.status(401).json({ error:  "Bad Credentials" })
    }


    const JsonWebToken = jwt.sign({
        externalId: user.externalId,
        username: user.username,
        role: user.role
    }, 
    JWT_SECRET_KEY,
    {
        expiresIn: '1h'
    })

    res.status(200).json({ JsonWebToken })

});

app.get("/profile", authValidation, (req, res) => {

    console.log("req.user", req.user)
    res.json({
        message: "esta ruta es protegida"
    })
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log("Conexion JWT Server")
})
