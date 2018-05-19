module.exports = function(app) {
    var usuarios = require('../controllers/usuariosController');
  
    // todoList Routes
    app.route('/registro')
      .post(usuarios.registrar_usuario);
  
  
    app.route('/login')
      .post(usuarios.login_usuario);
  };
  