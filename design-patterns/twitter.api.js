(function() {

    'esversion: 6';
    // /* Added for winston log */
    var layer = 'api.feedbacks';
    var component = 'twitter_request_get';
    var request = require('request');
    var console = {
        log: function() {
            require('../../framework/fwk').fwk.log(layer, component, arguments);
        },
        error: function() {
            require('../../framework/fwk').fwk.error(layer, component, arguments);
        },
        warn: function() {
            require('../../framework/fwk').fwk.warn(layer, component, arguments);
        }
    };

    var def_options = {
        CONSUMER_KEY: null,
        CONSUMER_SECRET: null,
        req_token_api: 'https://api.twitter.com/oauth/request_token',
        authorize_app_api: 'https://api.twitter.com/oauth/authorize',
        authenticate_api: 'https://api.twitter.com/oauth/authenticate',
        access_token_api: 'https://api.twitter.com/oauth/access_token',
        user_show_api: 'https://api.twitter.com/1.1/users/show.json',
        oauth_details : {},
        access_oauth_details: {},
        queryString:{}
    }

    function execute(rqst, q, fwk, res) {
        def_options.CONSUMER_KEY = '9aNvJGFmQc494Y5qaDCGXTvDP';
        def_options.CONSUMER_SECRET = 'LZ0VOO6Lkxn0cnLFDrf78SBu65T2LsKOyylo3zbT0OBF8yXfFh';
        // step 1
        console.log('Calling the twitter APIs');
        if(rqst.req.session && rqst.req.session.oauthRequestToken){
            // if the access token is there in session and session is present
            def_options.oauth_details = { 
                consumer_key: rqst.req.session.CONSUMER_KEY,
                consumer_secret: rqst.req.session.CONSUMER_SECRET,
                token: rqst.req.query['oauth_token'],
                token_secret: rqst.req.session.oauthRequestTokenSecret,
                verifier: rqst.req.query['oauth_verifier']
            }
            // calling for access token
            oauthGetAccessToken()
                .then(function(response){
                    def_options.access_oauth_details = {
                        consumer_key: rqst.req.session.CONSUMER_KEY,
                        consumer_secret: rqst.req.session.CONSUMER_SECRET,
                        token: response.oauth_token,
                        token_secret: response.oauth_token_secret
                    }
                    def_options.queryString = {
                        screen_name: response.screen_name,
                        user_id: response.user_id
                    }
                    // if everything went good just call the user details API
                    getUserDetails()
                        .then(function(user){
                            rqst.req.session.destroy();
                            return fwk.resolveResponse(q, 4100, 200, user);
                        }).catch(function(e){
                            console.log(e);
                            return fwk.resolveResponse(q, 4100, 200, e,'Sorry unable to get the access token for this request.');
                        })
                })
                .catch(function(err){
                    console.log(err);
                    return fwk.resolveResponse(q, 4100, 200, err,'Sorry unable to get the access token for this request.');
                })
        }else{
            // request comes for first time
            // if session the oauth session is not there just call for generate the token
            oauthGetReqToken()
                .then(function(response){
                    rqst.req.session = rqst.req.session || {}
                    rqst.req.session.CONSUMER_KEY = def_options.CONSUMER_KEY;
                    rqst.req.session.CONSUMER_SECRET = def_options.CONSUMER_SECRET;
                    rqst.req.session.oauthRequestToken = response.oauth_token;
                    rqst.req.session.oauthRequestTokenSecret = response.oauth_token_secret;
                    return fwk.resolveResponse(q, 4100, 200, response);
                }).catch(function(err){
                    console.log(err);
                    return fwk.resolveResponse(q, 4100, 200, err,'Not able to get the token');
                })
        }
        

    }


    /**
     * @author mantU
     * @description this method reurns the req_token and some params
     */
    function oauthGetReqToken(){
        console.log("============================Calling the oauth/request_token============================")
        return new Promise(function(resolve, reject){
            var url = def_options.req_token_api;
            var oauth = {
                callback: '',
                consumer_key: def_options.CONSUMER_KEY,
                consumer_secret : def_options.CONSUMER_SECRET
            }
            request.post({ url:url, oauth:oauth }, function (error, r, body) {
                if(error){
                    resolve(error);
                    console.log("=============================Error in oauth/request_token============================")
                }
                var params = JSON.parse(parseQuery(body));
                params['authorize_url'] = def_options.authorize_app_api+'?oauth_token='+params.oauth_token;
                params['authtenticate_url'] = def_options.authenticate_api+'?oauth_token='+params.oauth_token;
                resolve(params);
                console.log("=============================Response from oauth/request_token============================")
            });
        });
    }

    /**
     * @author mantU
     * @description getting the access token
     */
    function oauthGetAccessToken(){
        console.log("============================Calling the 1.1/users/show.json============================");
        return new Promise(function(resolve, reject){
            var acc_url = def_options.access_token_api;
            request.post({ url:acc_url, oauth:def_options.oauth_details }, function (error, r, body) {
                if(error){
                    resolve(error);
                    console.log("=============================Error in 1.1/users/show.json============================");
                }
                var params = JSON.parse(parseQuery(body));
                
                resolve(params);
                console.log("=============================Response from 1.1/users/show.json============================");
            });
        });
    }

    /**
     * @author mantU
     * @description getting the user details
     */
    function getUserDetails(){
        console.log("============================Calling the oauth/access_token============================")
        return new Promise(function(resolve, reject){
            request.get({ url:def_options.user_show_api, oauth:def_options.access_oauth_details, qs:def_options.queryString, json:true}, function (e, r, user) {
                if(e){
                    console.log('user not found');
                    resolve(e);
                }
                resolve(user);
            })
        })
        
    }

    /**
     * parse the body and return an objects of params
     * @param {*} string 
     * @author mantU
     */
    function parseQuery(string) {
        var query = string;
        var vars = query.split('&');
        var params = {};
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return JSON.stringify(params);
    }


    exports.execute = execute;
})();
