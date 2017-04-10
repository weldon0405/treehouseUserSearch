var Profile = require("./profile.js");
const renderer = require('./renderer.js');
const querystring = require('querystring');
var commonHeaders = {
    'Content-Type': 'text/html'
};

//TODO Handle HTTP route GET / and POST / i.e. Home
function home(request, response) {
    //if url == "/" && GET
    if (request.url === "/") {
        if (request.method.toLowerCase() === "get") {
            //show search
            response.writeHead(200, commonHeaders);
            renderer.view("header", {}, response);
            renderer.view("search", {}, response);
            renderer.view("footer", {}, response);
            response.end();
        } else {
            //if url == "/" && POST

            //get the post data from body
            request.on("data", function(postBody) {
                //extract the username
                var query = querystring.parse(postBody.toString());
                //redirect to /:username
                response.writeHead(303, {
                    "Location": "/" + query.username
                });
                response.end();
            });
        }
    }
}

//TODO Handle HTTP route GET /:username i.e. /weldonmalbrough
function user(request, response) {
    //if url == "/..."
    var username = request.url.replace("/", "");
    if (username.length > 0) {
        response.writeHead(200, commonHeaders);
        renderer.view("header", {}, response);
        //get JSON from treehouse
        var studentProfile = new Profile(username);
        //on "end"
        studentProfile.on("end", function(profileJSON) {
            //show profile

            //Store the values which we need
            var values = {
                avatarURL: profileJSON.gravatar_url,
                username: profileJSON.profile_name,
                badges: profileJSON.badges.length,
                javascriptPoints: profileJSON.points.JavaScript
            }
            //Simple response
            renderer.view("profile", values, response);
            renderer.view("footer", {}, response);
            response.end();
        });

        //on "error"
        studentProfile.on("error", function(error) {
            //show error
            renderer.view("error", {
                errorMessage: error.message
            }, response);
            renderer.view("search", {}, response);
            renderer.view("footer", {}, response);
            response.end();
        });
    }
}

module.exports.home = home;
module.exports.user = user;
