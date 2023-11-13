const express = require('express');
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all('/user', (req, res, next) => {
    console.log('Por aquí pasamos');
    next();
});

// Página de inicio
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Página de registro
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

// Registro de usuario
app.post('/register', (req, res) => {
    // Lógica de registro de usuario aquí
    // Guarda los datos del usuario en una base de datos, valida las entradas, etc.

    // Suponiendo que el registro se realice con éxito, redirige al usuario a la página de inicio de sesión
    res.redirect('/');
});

// Lógica de inicio de sesión
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Valida las credenciales del usuario (por ejemplo, verifícalas en tu base de datos)
    // Si las credenciales son correctas, genera un token JWT y envíalo al cliente
    if (username === 'yerly' && password === '1234') {
        const user = {
            nombre: username,
            password: password
        };

        jwt.sign({ user: user }, 'secretkey', { expiresIn: '100' }, (err, token) => {
            if (err) {
                res.status(500).json({ error: 'No se pudo generar el token' });
            } else {
                res.json({ token: token });
            }
        });
    } else {
        res.status(401).json({ auth: false, message: 'Credenciales inválidas' });
    }
});

// Ruta protegida que requiere autenticación
app.post('/sinin', verifyToken, (req, res) => {
    // Maneja la lógica de la ruta protegida aquí
    // Si el token es válido, puedes acceder a los datos del usuario en req.authData
    res.json({
        mensaje: "Ruta protegida fue accedida",
        authData: req.authData
    });
});

// Middleware para verificar el token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(401).json({ auth: false, message: 'Token no proporcionado' });
    }
}

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000, http://localhost:3000/')
});
