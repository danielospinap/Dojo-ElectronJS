// app módulo para controlar el ciclo de vida de la aplicación
// BrowserWindow módulo para crear la ventana
// ipcMain módulo para recibir desde el render
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
var request = require('request');

// variable global para la ventana, si no es global el garbage collector la puede eliminar
let win

function createWindow () {
    // Crea la ventana con dimensiones
    win = new BrowserWindow({width: 800, height: 600})
    
    // Carga el html para la vista
    win.loadURL(url.format({
        pathname: path.join(__dirname, './view/index.html'),
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


// Lanza la ventana
app.on('ready', createWindow)


ipcMain.on('registro-submission', function (event, email, user, pass, passConf) {

    // Verificamos los campos vacios
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
