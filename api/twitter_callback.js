(function() {

    'esversion: 6';
    // /* Added for winston log */
    var layer = 'api.feedbacks';
    var component = 'twitter_callback_get';
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
        oauth_details : {},
        access_oauth_details: {},
        queryString:{},
        callback:''
    }

    

    function execute(rqst, q, fwk) {
        console.log("Start running twitter callback API")
        
        // getting the redis client 
        fwk.getRedisCacheClient(function(err, redisCache){
            if(err){
                console.error("Redis Cache Client Error: feedbacks/twitter_requests: oauthGetReqToken: error on getting the the redis cache client : Error: ", err.toString());
                fwk.execute(cb, []);
            }else{
                var temp_token = rqst.req.query['oauth_token'] || rqst.req.query['denied']
                var oauthCachedName = 'litmus.social.twitter.oauth_details_'+temp_token;
                redisCache.get(oauthCachedName, function(err, result) {
                    if(err){
                        console.log(err)
                        rqst.res.redirect(result.callbackUrl);
                    }else{
                        if(result === null){
                            return fwk.resolveResponse(q, 4051, 200, err,'Unhandled Error.');
                        }else{
                            if(rqst.req.query && rqst.req.query.denied){
                                rqst.res.redirect(result.callbackUrl);
                            }else{
                                // if the access token is there in session and session is present
                                def_options.oauth_details = { 
                                    token: rqst.req.query['oauth_token'],
                                    verifier: rqst.req.query['oauth_verifier']
                                }

                                var url_params = 'oauth_token='+def_options.oauth_details.token+'&oauth_verifier='+def_options.oauth_details.verifier;
                                var par = JSON.parse(parseQuery(result.callbackUrl));

                                cbUrl = result.callbackUrl;
                                if(Object.keys(par).length > 0){
                                    cbUrl = cbUrl+'&'+url_params;
                                }else{
                                    cbUrl = cbUrl+'?'+url_params;
                                }
                            
                                redisCache.del(oauthCachedName);
                                rqst.res.redirect(cbUrl);
                            }                            
                        }
                        
                    }
                });
            }
        })

    }


    /**
     * parse the body and return an objects of params
     * @param {*} string 
     * @author mantU
     */
    function parseQuery(query) {
        if(query){
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
    }


    exports.execute = execute;
})();
