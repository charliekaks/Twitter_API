var OAuth = require("oauth").OAuth;
var config = require("./config");

//create a new oauth object
var oauth = new OAuth(
    config.request_token_url,
    config.access_token_url,
    config.consumer_key,
    config.consumer_secret,
    config.oauth_version,
    config.oauth_signature,
    config.oauth_callback
);

module.exports = {
    redirectToTwitterLoginPage: function(req,res){
        //Ask twitter for a request token
        oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
            if (error) {
                console.log(error);
                res.send("Authentication failed")
            } else {
                //use the authentication token to take the user to twitter login page
                res.cookie("oauth_token", oauth_token, {httpOnly:true});
                res.cookie("oauth_token_secret", oauth_token_secret,{httpOnly:true})
                res.redirect(config.authorize_url + "?oauth_token"+ oauth_token);
            }
        });
    },
    authenticate: function(req,res, cb) {
        // Check if the requested token and temporary credentials are there
        if (!(req.cookies.oauth_token && req.cookies.oauth_token_secret && req.query.oauth_verifier)) {
            return cb("Requested does not have all the requested keys")
        }
        res.clearCookies("oauth_token");
        res.clearCookies("oauth_token_secret");

        //Tell the router authentication was successfull
        cb();
    }
}