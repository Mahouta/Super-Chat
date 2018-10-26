const express = require('express');
const socket = require('socket.io');

var app = express();

var server = app.listen(3000, function () {
 console.log('nassma3 fik 3al port: 3000');
})

var users = [];

// socket setup
const io = socket(server);

io.sockets.on('connection', function (socket) {

  // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
  socket.on('nouveau_client', function (pseudo) {
    socket.pseudo = pseudo;
    users.push(pseudo);
    socket.broadcast.emit('pseudo', pseudo);
    io.sockets.emit('get users', users)
  });

  socket.on('disconnect', function () {
    users.splice(users.indexOf(socket.pseudo), 1);
    io.sockets.emit('get users', users);
    io.sockets.emit('disc_msg', socket.pseudo)
  })


  // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
  socket.on('message', function (data) {
    io.sockets.emit('msg', { pseudo: data.pseudo, message: data.message, date: data.date });
  })


  // Handle typing event
  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', data);
  });
});

