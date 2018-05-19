var mongoose = require('mongoose'),
  Usuario = mongoose.model('User');

exports.registrar_usuario = function(req, res) {
    console.log('nuevo usuario');
    
  var new_usuario = new Usuario(req.body);
  new_usuario.save(function(err, task) {
    if (err)
      res.send(err);
    res.send('OK');
  });
};

exports.login_usuario = function(req, res) {
    console.log('login');
    
    Usuario.find({usuario: req.body.usuario, password: req.body.password}, function (err, usrs) {
        if (err){
            res.send(err);
        }
        if(usrs.length === 0){
            res.send(false);
        } else {
            res.send(true);
        }
    });
}