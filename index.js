let express = require('express');
let app = express();
let path = require('path');

// this line serves the css (static file) located in the public directory
app.use(express.static('public'));

//index route
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// error handler
app.use(function (req, res, next) {
    res.send("<h1>Not found</h1>");
});

let port = normalizePort(process.env.PORT || '3000');

app.listen(port, function() {
    console.log('App listening on port ' + port + '!');
});

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
}