# <img src="https://avatars3.githubusercontent.com/u/13409222?s=200&v=4" width="60px" align="center" alt="Electron API Demos icon"> Dojo Electron

# Hola Mundo
### 1. Creación del Proyecto
```sh
$ npm init
```

### 2. Instalación de Electron
```sh
$ npm install --save-dev electron
```

### 3. Configuración del proyecto
En package.json:
```
    ...
    
    "scripts": {
      "start": "electron ."
    }
    
    ...
```

### 4. Ventana vacia
Se crea el archivo index.js 
```javascript
// app módulo para controlar el ciclo de vida de la aplicación
// BrowserWindow módulo para crear la ventana
const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

// variable global para la ventana, si no es global el garbage collector la puede eliminar
let win

function createWindow () {
    // Crea la ventana con dimensiones
    win = new BrowserWindow({width: 800, height: 600})
}

// Lanza la ventana
app.on('ready', createWindow)
```

### 5. Configuración del flujo de la ventana
```javascript
function createWindow () {
    // Crea la ventana con dimensiones
    win = new BrowserWindow({width: 800, height: 600})
    
    // Carga el html para la vista
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    
    // Basado en chromium - Para ver la consola de desarrollador
    win.webContents.openDevTools()
    
    // Libera el recurso cuando la ventana se cierra
    win.on('closed', () => {
      win = null
    })
    
    // Cierre para mac
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit()
        }
    })
}
```

### 6. Vista inicial
Se crea el archivo index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <h1>Hola mundo</h1>
</body>
</html>
```

# Registro de usuario
### 1. Bootstrap
Se agregan los recursos para usar bootstrap
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <title>Document</title>
</head>
<body>
    <h1 class="d-block p-2" >Hola mundo</h1>
    
    
    
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>
</html>
```

### 2. Formulario de registro
En el body
```html
    <div class="container text-center mx-auto m-5">

        <div class="col-lg-4 col-xl-8 card mx-auto" >
            <h1 class="d-block p-2">Registro</h1>
            <br>
            <form onSubmit="JavaScript:registrar(event)" id="registroForm" class="d-block p-2">

                <input class="form-control my-3" type="text" id="correo" placeholder="Correo" />
                <input class="form-control my-3" type="text" id="user" placeholder="Usuario" />
                <input class="form-control my-3" type="password" id="pass" placeholder="Contraseña" />
                <input class="form-control my-3" type="password" id="passConf" placeholder="Confirme Contraseña" />
                <br>
                <br>
                <input id="submit" type="submit" value="Registrar" class="btn btn-primary">
            <form>
            <br>
            <br>
            <p id="response" class="d-block"></p>
        </div>

    </div>
```

### 3. Se prepara la captura de datos de la vista
Se crea el archivo registro.js
```javascript
//Módulo para comunicar la vista con el controlador
const ipcRenderer = require('electron').ipcRenderer;

function registrar(event) {
    console.log('Va a registrar');
    event.preventDefault() // evita que se haga el submit del form
}
```

Se agrega en index.html el archivo registro.js
```html
<script src="js/registro.js"></script>
```

### 4. Se capturan los datos de la vista
En registro.js
```javascript
function registrar(event) {
    console.log('Va a registrar');
    event.preventDefault() // evita que se haga el submit del form
    
    // Captura datos del html
    let email = document.getElementById("email").value;
    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;
    let passConf = document.getElementById("passConf").value;

    // Envia al controlador los datos y un canal
    ipcRenderer.send('registro-submission', email, user, pass, passConf);
}
```

### 5. Se reciben y se procesan los datos de la vista
En index.js
```javascript
// Módulo para recibir desde el render
const {app, BrowserWindow, ipcMain} = require('electron')
// Módulo para hacer peticiones http
var request = require('request');

// Al final del archivo agregar
ipcMain.on('registro-submission', function (event, email, user, pass, passConf) {

    // Verificamos los campos vacios y coincidencia de contraseña y se devuelve el error
    if (email === '' || user === '' || pass === '' || passConf === ''){
        event.sender.send('error-message', 'Favor complete todos los campos');
    } else if (pass !== passConf) {
        event.sender.send('error-message', 'Las contraseñas no coinciden');
    } else { // Se guardan los datos
        request.post(
            'https://dojo-electron.herokuapp.com/registro',
            {json: {correo: email, usuario: user, password: pass}},
            function (error, response, body) {
                if (error) {
                    console.log(error);
                    event.sender.send('error-message', 'Error en el servidor');
                } else {
                    event.sender.send('registro-exitoso', 'login.html');
                }
            }
        );
    }
});
```

### 6. Se procesan las respuestas del controlador en la vista
En registro.js
```javascript
// En caso de error se muestra el mensaje
ipcRenderer.on('error-message', function (event, message) {
    const responseParagraph = document.getElementById('response');
    responseParagraph.innerHTML = message
});

// Si se registra lo redirige al login
ipcRenderer.on('registro-exitoso', function(event, file){
    window.location.replace(file);
});
```
# 
# 
# 
# Ejercicio
Realizar el login para un usuario creado con la siguiente url
```
https://dojo-electron.herokuapp.com/login
```