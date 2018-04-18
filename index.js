var url = require("url");
var authenticator = require("./authenticator");
var express = require("express");
var config = require("./config");
var app = express();


//Add cookie parsing functionality to our Express app
app.use(require("cookie-parser")());

//Take user to twitter login page
app.get("/auth/twitter", authenticator.redirectToTwitterLoginPage);

//Tweet
app.get("/tweet", function(req, res) {
    if (!req.cookies.access_token || !req.cookies.access_token_secret) {
        return res.sendStatus(401);
    }
    authenticator.post("https://api.twitter.com/1.1/statuses/update.json",
        req.cookies.access_token,req.cookies.access_token_secret,{
            status: "Hello Charles Up in Here"
        }, function(error, data) {
            if (error) {
                return res.status(400).send(error)
            }
            res.send("Tweet Successfull");
        });
});

// The callback url that the user is redirected to after signing in
app.get(url.parse(config.oauth_callback).path, function(req, res) {
    authenticator.authenticate(req,res, function(err) {
       if (err) {
           console.log(err);
           res.sendStatus(401);
       } else {
           res.send("Authentication Successfull");
       } 
    });
});

//Listening for requests
app.listen(config.port, function() {
    console.log("Listening on port", config.port)
});
