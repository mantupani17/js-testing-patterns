(function() {

    'esversion: 6';
    // /* Added for winston log */
    var layer = 'api.feedbacks';
    var component = 'twitter_request_post';
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
        access_token_api: 'https://api.twitter.com/oauth/access_token',
        authorize_app_api: 'https://api.twitter.com/oauth/authorize',
        authenticate_api: 'https://api.twitter.com/oauth/authenticate',
        access_oauth_details: {},
        queryString:{},
        callback:''
    }

    

    function execute(rqst, q, fwk) {
        console.log("Start running twitter requests API");
        
        // getting the redis client
        fwk.getRedisCacheClient(function(err, redisCache){
            if(err){
                console.error("Redis Cache Client Error: feedbacks/twitter_requests: oauthGetReqToken: error on getting the the redis cache client : Error: ", err.toString());
                fwk.execute(cb, []);
            }else{
                def_options.CONSUMER_KEY =  fwk.config.twitter_oauth_details.CONSUMER_KEY;
                def_options.CONSUMER_SECRET =  fwk.config.twitter_oauth_details.CONSUMER_SECRET;
                var postData = rqst.body;
                
                // step 1:: if the request type is request_token then generate the request token 
                if(postData && postData['type'] == 'request_token'){
                    if(postData['callbackUrl']){
                        def_options.callback = postData.callbackUrl || '';
                    }

                    // step 2:: requesting for OAUTH toke and secret
                    oauthGetReqToken()
                        .then(function(response){
                            // step 2:: save in the redis db for validating
                            // cached name or key
                            var oauthCachedName = 'litmus.social.twitter.oauth_details_'+response.oauth_token;
                            // cached value or data
                            var oauthCachedValue = {
                                oauthRequestToken: response.oauth_token,
                                oauthRequestTokenSecret: response.oauth_token_secret,
                                callbackUrl:def_options.callback
                            }
                            redisCache.set(oauthCachedName, oauthCachedValue, fwk.config.twitter_oauth_details.RED_WAIT_TIME);
                            response = {
                                authorize_url:response.authorize_url,
                                authtenticate_url: response.authtenticate_url
                            }
                            return fwk.resolveResponse(q, 0, 200, response);
                        })
                        .catch(function(err){
                            console.error(" Unhandled Error: ", err);
                            return fwk.resolveResponse(q, 4051, 200, err,'Unhandled Error.');
                        });

                }else{
                    // Step 1: if the request type is access_token then just pick the cache data from redis
                    // Step 2: return the user_screen and data
                    // if the access token is there in session and session is present
                    if(postData){
                        def_options.oauth_details = { 
                            token: postData['oauth_token'],
                            verifier: postData['oauth_verifier']
                        }

                        // calling the access token to get the user screen and keep those in redis
                        oauthGetAccessToken()
                            .then(function(response){
                                q.resolve({
                                    code:0,
                                    data: {
                                        screen_name:response.screen_name
                                    }
                                });
                            })
                            .catch(function(err){
                                console.log(err);
                                return fwk.resolveResponse(q, 4100, 200, err,'Sorry unable to get the access token for this request.');
                            });

                    }
                    
                }
            }
        })

    }


    /**
     * @author mantU
     * @description getting the access token
     */
    function oauthGetAccessToken(){
        console.log("============================Calling the oauth/access_token============================");
        return new Promise(function(resolve, reject){
            var acc_url = def_options.access_token_api;
            request.post({ url:acc_url, oauth:def_options.oauth_details }, function (error, r, body) {
                if(error){
                    resolve(error);
                    console.log("=============================Error in oauth/access_token============================");
                }
                var params = JSON.parse(parseQuery(body));
                resolve(params);
                console.log("=============================Response from oauth/access_token============================");
            });
        });
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
            console.log(oauth)
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
            if(pair[1]){
                params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
        }
        return JSON.stringify(params);
    }


    exports.execute = execute;
})();
