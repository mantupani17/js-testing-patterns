(function(document, window){

    /**
     * @description this method is the constructor which accept the following params
     * @param {string} component 
     * @param {string} content 
     * @param {domElement} parentElement 
     * @param {options} options 
     */
    function Component(component, content, parentElement, options){
        this.content = content;
        this.component = component;
        this.parentElement = parentElement;
        this.options = options;
        this.elem = null; 
    }

    Component.prototype.register = function(){
        var ele  = document.createElement(this.component);
        ele.innerHTML = this.content;
        this.parentElement.append(ele);
        this.elem = ele;
        return this.elem;
    }

    Component.prototype.deregister = function(){
        this.elem.remove();
    }

    Component.prototype.setAttribute = function(attr, val){
        this.elem.setAttribute(attr, val);
    }

    Component.prototype.getAttribute = function(attr){
        var val = this.elem.getAttribute(attr);
        if(attr == 'style'){
            var prepareObj = val.split(';');
            val = prepareObjectFromStyle(prepareObj)
        }
        return val;
    }

    function prepareObjectFromStyle(style_array){
        var style_object = {};
        for (var iterator of style_array) {
            if(iterator){
                var split_value = iterator.split(':');
                style_object[split_value[0]] = split_value[1];
            }
        }
        return style_object;
    }

    window.Component = Component;

})(document, window)