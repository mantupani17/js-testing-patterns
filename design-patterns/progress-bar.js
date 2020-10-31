var ProgressBar = (function(){
    // private attributes
    var devidePer = 0;
    var totalBarPer = 0;
    var numericForm = 0;
    var barWidth = 0;
    return {
        // default options for progress bar it can be configurable 
        options:{
            numberOfBars: 5,
            bgColor: '#66b846',
            selector: 'progress-bar-container',
            percentage: 40,
            isShow: true,
            statusLabel:true
        },
        // initializing the progress bar
        init: function(opts){
            if(Object.keys(opts).length){
                for (var key in opts) {
                    if (opts.hasOwnProperty(key)) {
                        var element = opts[key];
                        this.options[key] = element;
                    }
                }
            }
            devidePer = 100/this.options.numberOfBars;
            totalBarPer = this.options.percentage / devidePer;
            numericForm = totalBarPer*100;
            barWidth = devidePer;
            this.renderProgressBar();
            this.renderProgressStatusLabel();
            console.log(this.options)
        },

        show: function(flag){
            if(!(typeof flag === 'boolean')){
                throw(new Error('The value should be boolean.'))
            }
            this.options.isShow = flag;
            this.init({});
        },

        setPercentage: function(per){
            if(isNaN(per)){
                throw(new Error('The value should be numeric and less than equals to 100.'))
            }
            this.options.percentage = per;
            this.init({});
        },

        // Rendering the bars
        renderProgressBar: function(){
            var parent = document.getElementById(this.options.selector);
            parent.innerHTML = "";
            for (var i = 0; i < this.options.numberOfBars ; i++) {
                var childDiv = document.createElement('div');
                childDiv.className = 'my-progress-bar-span';
                childDiv.style.width = barWidth-2+"%";
                var spans = document.createElement('div');
                spans.className = 'complete';
                spans.style.backgroundColor = this.options.bgColor;
                if(numericForm >= 100){
                    spans.className = 'complete';
                    numericForm = numericForm - 100;
                }else{
                    spans.style.width = numericForm+'%';
                    numericForm = 0;
                }
                childDiv.appendChild(spans);
                if(this.options.isShow){
                    parent.appendChild(childDiv);
                }
            }
            
        },

        // Render the status label 
        renderProgressStatusLabel: function(){
            var label = document.querySelector('.my-completion-label');
            if(this.options.isShow && this.options.statusLabel){
                label.innerHTML = "Complete = "+this.options.percentage+'%';
            }else if(!this.options.isShow){
                console.log('hello')
                label.innerHTML = '';
                return;    
            }
        },

        getPercentage: function(){
            return this.options.percentage;
        }
    }
})()