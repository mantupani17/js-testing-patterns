var conf = {
    
}

// Authorization: OAuth oauth_consumer_key="",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1598871041",oauth_nonce="KMo6ZK",oauth_version="1.0",oauth_signature="Jf1NLMZ0CT8USm4KgIjLc20fBKU%3D"
// XMLHttpRequest.setRequestHeader(header, value)



var Twitter = (function(){
    // options for initializing
    var currentDate = new Date();
    var timestamp = currentDate.getTime();
    var encodedData = window.btoa(timestamp);
    var conf = {
        url:'https://api.twitter.com',
        request_token_api:{
            end_point:'/oauth/request_token',
            method:'POST'
        },
        request_authorize_api:{
            end_point: '/oauth/authorize',
            method: 'GET'
        },
        request_authenticate_api:{
            end_point: '/oauth/authenticate',
            method: 'GET'
        },
        access_token_api:{
            end_point: '/oauth/access_token',
            method: 'GET'
        },
        oauth_consumer_key:'9aNvJGFmQc494Y5qaDCGXTvDP',
        oauth_signature: "Jf1NLMZ0CT8USm4KgIjLc20fBKU%3D",
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: timestamp,
        oauth_nonce:encodedData,
        oauth_version: "1.0",

    }
    function RequestClient(method, url, data){
        this.client = new XMLHttpRequest();
        this.request = function(header, value){
            return new Promise(function(resolve, reject){
                this.client.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        resolve(JSON.parse(this.response))
                    }
                };
                this.client.open(method, url);
                if(header && value){
                    this.client.setRequestHeader(header, value);
                }
                this.client.send();
            }.bind(this));
        }
    }
    
    return {
        init: function(){
            var clientReq = new RequestClient(conf.request_authorize_api.method, conf.url+conf.request_token_api.end_point);
            clientReq.request('Authorization', 'OAuth oauth_consumer_key="9aNvJGFmQc494Y5qaDCGXTvDP",oauth_signature_method="HMAC-SHA1",oauth_timestamp="'+conf.oauth_timestamp+'",oauth_nonce="'+conf.oauth_nonce+'",oauth_version="1.0",oauth_signature="Jf1NLMZ0CT8USm4KgIjLc20fBKU%3D"')
            .then(function(res){
                console.log(res)
            }).catch(function(err){
                console.log(err)
            })
        }   
    }

})();

Twitter.init();
