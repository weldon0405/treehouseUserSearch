const router = require('./router');
//Problem: We need a simple way to look at a users badge count and JavaScript points from a we browser
//Solution: USe Node.JS to perform the profile lookups and serve our templates via HTTP

//TODO Create a Web Server
var http = require('http');
http.createServer(function(request, response) {
    router.home(request, response);
    router.user(request, response);
}).listen(8080, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8080/');
