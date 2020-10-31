
var GuideMe = function(data, options){
    this.GuideMe = {};
    this.data = data ;
    this.options = options;
    this.currentGuide = 0;
    this.isValidData = true;
    this.objData = keyedData();
    this.guideMsgContainer = null;
    this.nextBtn = null;
    this.prevBtn = null;
    this.bottmContainer = null;
    this.closeBtn = null;
    this.guideBox = null;
    this.eleTop = 0;
    this.eleLeft = 0;
    
    
    if(!options.isAlreadySeen){
        if(data.length > 0 && this.isValidData){
            initGuideBox();
        }else{
            console.error('The data should be an array of selector and messages.')
        }
    }else{
        console.log('Already tour has done...')
    }

    function keyedData(){
        var keyedData = {};
        for (var index = 0, len = this.data.length; index < len; index++) {
            var element = this.data[index];
            if(element.selector && element.message){
                if(!keyedData[element.selector]){
                    element['index'] = index;
                    keyedData[index] = element;
                }
            }
        }
        if(Object.keys(keyedData).length === 0){
            this.isValidData = false;
            console.error('Please provide valid data')
            return {}
        }
        return keyedData;
    }

    // move to the next tour
    function moveNextGuide(){
        /**
         * step 1: if the current index is < the items.length then render the tour
         * step 2: 
         */
        if(this.currentGuide < this.data.length){
            var el = document.querySelector('#'+this.objData[this.currentGuide].selector);
            var {curtop, curleft} = getAbsPosition(el);
            this.eleTop = curtop;
            this.eleLeft = curleft;
            this.guideBox.style.top = this.eleTop+13+'px';
            this.guideBox.style.left = this.eleLeft+50+'px';
            this.guideMsgContainer.innerHTML = this.objData[this.currentGuide].message; 
            this.currentGuide++;
        }else{
            // if the currentGuide === the length means the last slide arrived so need to close the guide
            if(this.currentGuide === this.data.length){
                this.guideMsgContainer.innerHTML = '<h1>Thank you, your tour is completed.</h1>';
                this.nextBtn.remove();
                this.prevBtn.remove();
                this.closeBtn = document.createElement('button');
                this.closeBtn.className = 'guide-btn';
                this.closeBtn.innerText = 'Close';
                this.closeBtn.addEventListener('click', endGuide.bind(this))
                this.bottmContainer.appendChild(this.closeBtn);
                return false;
            }
        }                
    }

    // move to the previous tour
    function movePrevGuide(){        
        /**
         * step 1: if the current index is == 1 then dont move previous and set the value to 0
         * step 2: if the current index is == data.length then just assign the current index = current index - 2
         */
        if(this.currentGuide === 0){
            return false;
        }
        if(this.currentGuide === this.data.length){
            this.currentGuide = this.data.length-1;
        }
        if(this.currentGuide >= 0){
            var el = document.querySelector('#'+this.objData[this.currentGuide].selector);
            var {curtop, curleft} = getAbsPosition(el);
            this.eleTop = curtop;
            this.eleLeft = curleft; 
            this.guideMsgContainer.innerHTML = this.objData[this.currentGuide-1].message;
            this.guideBox.style.top = this.eleTop+13+'px';
            this.guideBox.style.left = this.eleLeft-50+'px';
            this.currentGuide--;
        }
    }

    // end the our
    function endGuide(){
        this.guideBox.remove()
        this.options.isAlreadySeen = false;
    }

    // initialize the tour
    function initGuideBox(){
        var infoBox = document.createElement('div');
        this.guideBox = infoBox;
        infoBox.className = options.theme === 'dark' ? options.theme+'-guide-me-info' : 'guide-me-info';
        var infoContent = document.createElement('div');
        infoContent.setAttribute('id', 'guide-content');
        this.guideMsgContainer = infoContent;
        var infoBottom = document.createElement('div');
        infoContent.className = options.theme === 'dark' ? options.theme+'-guide-me-info-content' : 'guide-me-info-content';
        infoBottom.className = options.theme === 'dark' ? options.theme+'-guide-me-info-bottom-content': 'guide-me-info-bottom-content';
        moveNextGuide();        
        var nxtBtn = document.createElement('button');
        var prvBtn = document.createElement('button');
        this.nextBtn = nxtBtn;
        this.prevBtn = prvBtn;
        nxtBtn.addEventListener('click', moveNextGuide.bind(this));
        prvBtn.addEventListener('click', movePrevGuide.bind(this));
        prvBtn.className = options.theme === 'dark' ? options.theme+'-guide-me-prev-btn guide-btn': 'guide-btn guide-me-prev-btn';
        nxtBtn.className = options.theme === 'dark' ? options.theme+'-guide-me-next-btn guide-btn': 'guide-btn guide-me-next-btn';
        prvBtn.innerText = 'Prev';
        nxtBtn.innerText = 'Next';
        this.bottmContainer = infoBottom;
        infoBox.appendChild(infoContent);
        infoBottom.appendChild(prvBtn);
        infoBottom.appendChild(nxtBtn);
        infoBox.appendChild(infoBottom);
        var body = document.querySelector('body');
        body.appendChild(infoBox);
    }

    // get the absoulte position of the particular element
    function getAbsPosition(el){
        var el2 = el;
        var curtop = 0;
        var curleft = 0;
        if (document.getElementById || document.all) {
            do  {
                curleft += el.offsetLeft-el.scrollLeft;
                curtop += el.offsetTop-el.scrollTop;
                el = el.offsetParent;
                el2 = el2.parentNode;
                while (el2 != el) {
                    curleft -= el2.scrollLeft;
                    curtop -= el2.scrollTop;
                    el2 = el2.parentNode;
                }
            } while (el.offsetParent);
    
        } else if (document.layers) {
            curtop += el.y;
            curleft += el.x;
        }
        return {curtop, curleft};
    }

    // on end event Listener
    this.GuideMe.on = function(event, cb){
        if(event === 'start'){
            console.log('Start event called')
            cb('started');
        }else if(event === 'end'){
            console.log('End event called')
            cb('ended');
        }else if(event === 'init'){
            console.log('init event called')
            cb('init');
        }
    }

    return this.GuideMe;
    
}

GuideMe.prototype.on = function(event, cb){
    if(event === 'start'){
        console.log('Start event called')
        cb('started');
    }else if(event === 'end'){
        console.log('End event called')
    }
}

