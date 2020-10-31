/**
 * This component is for rendering the Social media button 
 * to verify the user is already login or not
 * if login then validate the user
 */
(function(window, document, ltms) {
    /**
     * Component method for initializing all the configuration data
     * @param {*} displayElement 
     * @param {*} options 
     */    
    function LtmsSocialLogin(displayElement, options){
        this.options = options;
        this.displayElement = displayElement;
        this.displayElement.className = "ltms-social-buttons-container";

        this.fb_container = null;
        this.twtr_container = null;
        

        // creating validation element
        this.validationElement = ltms.create('div');
        this.validationElement.className = 'social-btn-validation-message';
        this.validationLable = ltms.create('h3');

        this.social_config = {
            'facebook_conf': {
                appId      : this.options.facebookAppId || '',
                cookie     : true,
                xfbml      : true,
                version    : this.options.facebookAppVersion || '',
                icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/szGrb_tkxMW.png'
            },
            'twitter_conf':{
                icon:'https://abs.twimg.com/favicons/twitter.ico'
            },
            "cdns":{
                fb_sdk:'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version='+this.options.facebookAppVersion+'&appId='+this.options.facebookAppId+'&autoLogAppEvents=1'
            },
            tickImg:'https://dashboard.litmusworld.com/img/tick-icon.svg',
        }
        
        // success img
        this.successImg = ltms.create('img');
        this.successImg.className = 'success-img';
        this.successImg.src = this.social_config['tickImg'];
        this.fbSuccessContainer = null;
        this.twtrSuccessContainer = null;

        this.isValidData = ((this.options.facebookAppId && this.options.facebookAppVersion)) ? true : false;
        
        // if the client is using this component not providing any of configuration data
        if(!this.isValidData){
            this.validationLable.innerHTML = 'Error: Social component not configured properly'
            this.validationElement.appendChild(this.validationLable);
            this.displayElement.appendChild(this.validationElement);
            return
        }
        
        // checking the user fb and twitter handle is not present
        if((this.options.facebookHandle && this.options.facebookHandle == 'undefined') && (this.options.twitterHandle && this.options.twitterHandle == 'undefined')){
            this.validationLable.innerHTML = 'Social handle details missing for Facebook and Twitter.'
            this.validationElement.appendChild(this.validationLable);
            this.displayElement.appendChild(this.validationElement);
            return
        }


        if(this.options.facebookAppId && this.options.facebookAppVersion){
            // load script files
            loadAllSocialScripts.apply(this);

            if((this.options.facebookAppId && this.options.facebookAppVersion) && (this.options.facebookHandle && this.options.facebookHandle != 'undefined')){
                renderFacebookButton.apply(this);
            }
        }

        if( this.options.twitterHandle && this.options.twitterHandle != 'undefined'){
            renderTwitterButton.apply(this);
        }
        
        this.__components = {};

        initialCall.apply(this);
    }

    // LtmsSocialLogin.prototype.setRating = function(rating) {
    //     if(typeof rating === 'object'){
    //         this.__components['sociallogin'] = rating;
    //         if (this.onRatingChange) {
    //             this.onRatingChange(rating);
    //         }
    //     }else{
    //         console.error("The rating should be an object of user instance.")
    //     }
       
    // }

    LtmsSocialLogin.prototype.getRating = function() {
        return this.__components['sociallogin']
    }

    /**
     * This method renders the facebook button
     * @author mantU
     */
    function renderFacebookButton(){
        var mainContainer = ltms.create('div');
        mainContainer.className = 'fb-main-container';
        var facebookBtnContainer = ltms.create('div');
        var statusContainer = ltms.create('div');
        statusContainer.className = 'fb-status-container';
        this.fbSuccessContainer = statusContainer;
        this.fb_container = facebookBtnContainer;
        facebookBtnContainer.className = 'facebook-container';
        var img = ltms.create('img');
        img.className = 'facebook-img';
        img.src = this.social_config['facebook_conf']['icon'];
        var link = ltms.create('a');
        var span = ltms.create('span', 'Continue with Facebook');
        span.className = 'facebook-login-title';
        link.setAttribute('href', 'javascript:void');
        link.addEventListener('click', handleFacebookLogin.bind(this));
        link.appendChild(img)
        link.appendChild(span)
        facebookBtnContainer.appendChild(link);
        mainContainer.appendChild(facebookBtnContainer);
        mainContainer.appendChild(statusContainer);
        this.displayElement.appendChild(mainContainer);
    }

    /**
     * This method renders the twitter button
     * @author mantU
     */
    function renderTwitterButton(){
        var mainContainer = ltms.create('div');
        mainContainer.className = 'twtr-main-container';
        var statusContainer = ltms.create('div');
        statusContainer.className = 'twtr-status-container';
        this.twtrSuccessContainer = statusContainer;
        var twitterBtnContainer = ltms.create('div');
        twitterBtnContainer.className = 'twitter-container';
        this.twtr_container = twitterBtnContainer;
        var img = ltms.create('img');
        img.className = 'twitter-img';
        img.src = this.social_config['twitter_conf']['icon'];
        var span = ltms.create('span', 'Continue with Twitter');
        span.className = 'twitter-login-title';
        twitterBtnContainer.appendChild(img);
        twitterBtnContainer.appendChild(span);
        twitterBtnContainer.addEventListener('click', handleTwitterLogin.bind(this))
        mainContainer.appendChild(twitterBtnContainer);
        mainContainer.appendChild(statusContainer);
        this.displayElement.appendChild(mainContainer);
    }

    /**
     * Load All script files
     */
    function loadAllSocialScripts(){
        // adding facebook sdk
        if((this.options.facebookAppId && this.options.facebookAppVersion) && (this.options.facebookHandle && this.options.facebookHandle != 'undefined')){
            var js, fjs = document.getElementsByTagName('script')[0];
            if (!document.getElementById('facebook-jssdk')) {
                js = ltms.create('script'); 
                js.id = 'facebook-jssdk';
                js.src = this.social_config['cdns']['fb_sdk'];
                fjs.parentNode.insertBefore(js, fjs);
            }
        }   
    }

    /**
     * This method will check the user is logged in or not in facebook
     */
    function handleFacebookLogin(){
        this.__components['sociallogin'] = null;
        FB.login(function(response){
            if(response.status === 'connected'){
                FB.api('/me', 'GET', {"fields":"id,name,email,first_name,last_name,link,short_name,accounts{id,username}"},function(response) {
                    if(response){
                        response['type'] = 'FACEBOOK';
                        if(this.onRatingChange){
                            if(this.options.facebookHandle && response.id){
                                if((this.options.facebookHandle == response.id) || ( this.options.facebookHandle.toLowerCase() === response.name.toLowerCase())){
                                    this.__components['sociallogin'] = 1;
                                    this.onRatingChange(1);
                                    this.fbSuccessContainer.appendChild(this.successImg)
                                    if(document.getElementsByClassName('social-btn-validation-message').length){
                                        this.validationElement.remove();
                                    }
                                }else{
                                    if(document.getElementsByClassName('success-img').length){
                                        this.fbSuccessContainer.remove();
                                        this.twtrSuccessContainer.remove();
                                    }
                                    this.validationLable.innerHTML = 'Facebook id is not matching the configured details.'
                                    this.validationElement.appendChild(this.validationLable);
                                    this.displayElement.appendChild(this.validationElement);
                                    this.onRatingChange(null)
                                }
                            }
                        }
                    }
                }.bind(this));
            }
        }.bind(this),{scope: 'public_profile,email'})
    }

    /**
     * This method will check the user is logged in or not in twitter
     */
    function handleTwitterLogin(){
        try {
            Twitter.call({
                type:'request_token',
                callbackUrl: location.href
            }).then(function(response){
                if(response && response.data && response.data.authtenticate_url){
                    location.href = response.data.authtenticate_url;
                }
            });
        } catch (error) {
            console.log(error)
        }
        
    }


    /**
     * this is a IIFE for initializing the twitter API
     */
    var Twitter = (function(){
        return {
            call: function(data){
                var xhttp = new XMLHttpRequest();
                return new Promise(function(resolve, reject){
                    var queryString = '';
                    var i = 0;
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            var val = data[key];
                            if( i === 0){
                                queryString += key+'='+val;
                                i++;
                            }else{
                                queryString += '&'+key+'='+val;
                            }
                        }
                    }

                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            resolve(JSON.parse(this.response))
                        }
                    };
                    
                    xhttp.open("POST", config['base-url']+"/api/feedbacks/twitter_requests", true);

                    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                    xhttp.send(queryString);
                })
            }
        }
    })();

    /**
     *  initialize the twitter component
     */
    function initialCall(){
        var oauth_token = getParameterByName('oauth_token');
        var oauth_verifier = getParameterByName('oauth_verifier');
        if(oauth_token && oauth_verifier){
            Twitter.call({
                oauth_token:oauth_token,
                oauth_verifier:oauth_verifier,
                type:'access_token',
                screen_name:this.options.twitterHandle
            }).then(function(response){
                if(this.options.twitterHandle && response.data.screen_name){
                    if(this.options.twitterHandle === response.data.screen_name){
                        this.__components['sociallogin'] = 1;
                        this.twtrSuccessContainer.appendChild(this.successImg);
                        this.onRatingChange(1);
                        if(document.getElementsByClassName('social-btn-validation-message').length){
                            this.validationElement.remove();
                        }
                    }else{
                        if(document.getElementsByClassName('success-img').length){
                            this.fbSuccessContainer.remove();
                            this.twtrSuccessContainer.remove();
                        }
                        this.validationLable.innerHTML = 'Twitter id is not matching the configured details.'
                        this.validationElement.appendChild(this.validationLable);
                        this.displayElement.appendChild(this.validationElement);
                        this.onRatingChange(null);
                    }
                }
            }.bind(this));
        }
    }
    
    
    // get url params from the url
    function getParameterByName(name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return '';
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }



    ltms.getEngine().registerComponent('ltms-social-button', LtmsSocialLogin, '1.0.0');

})(window, document, ltms)