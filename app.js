const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.port || 3000;
const mongoose = require('mongoose');
// socket IO
const app = express();
// const server  = require('http').createServer(app);
// // const io = require('socket.io').listen(server);

const api = require('./models/routes/sendmail');
app.use(express.static(path.join(__dirname, '/dist/')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    res.header('X-HTTP-Method-Override', 'Origin','Accept' , 'Content-Type', 'x-requested-with');
    res.addHeader("Access-Control-Allow-Headers", "Content-Type, authorization");
    next();
  });
// connect listen
// io.on('connection', (socket) => {
//   socket.emit('hello', {
//       greeting: 'hello quan'
//   });
//   socket.on('disconnect', function() {
//       console.log('disconnect');
//   });
// });
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
})
app.use('/api', api);
app.listen(port, () => {
    console.log('server started on port ' + port);
});
