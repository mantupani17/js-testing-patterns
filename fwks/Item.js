(function(document, window, Component){
    function ItemGenerator(id, item, parentDom){
        this.item = item;
        this.parentDom = parentDom;
        this.id = id;
        this.renderDom();
    }

    ItemGenerator.prototype.renderDom = function(){
        var item_parent = document.createElement('div');
        item_parent.id = this.id;
        item_parent.classList.add('item_container_'+this.id);
        item_parent.classList.add('item_container');
        this.item_parent = item_parent;
        this.parentDom.appendChild(this.item_parent); 
        if(this.item.label && this.item.label.text){
            generateLabelComponent(this.item.label, this.item_parent)
        }
        var component = new Component(this.item.dom_type, this.item.text, this.item_parent, this.item)
        component.register()
        component.setAttribute('class', this.item.class);
        if(this.item.dom_type == 'input'){
            component.setAttribute('type', this.item.type);
            component.setAttribute('placeholder', this.item.placeholder);
        }

    }

    ItemGenerator.prototype.show = function(){
        
    }

    ItemGenerator.prototype.hide = function(){

    }

    function generateLabelComponent(label_details, item_parent){
        var labelComponent = new Component('label', label_details.text, item_parent, label_details);
        labelComponent.register();
        labelComponent.setAttribute('class', 'component-title')
    }

    window.ItemGenerator = ItemGenerator;

})(document, window, Component)