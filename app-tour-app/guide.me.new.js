(function(window){
    var GuideMeNew = function(data){
        console.log(data)
        this.data = data;
        this.currentIndex = 0;
    }
    
    GuideMeNew.prototype.on = function(event, cb){
        if(event === 'init'){
            console.log(this.data)
        }else if(event === 'next'){
            this.currentIndex++;
        }else if(event === 'prev'){
            this.currentIndex--;
        }
        console.log(this.currentIndex)
        cb()
    }


    window.GuideMeNew = GuideMeNew;
})(window);
