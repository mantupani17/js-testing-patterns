(function(document, window, ItemGenerator){

    function GroupGenerator(groups){
        this.groups = groups;
        this.parentElement = document.getElementById('main-container');
        this.render();
    }


    GroupGenerator.prototype.render = function(){
        for (const key in this.groups) {
            if (this.groups.hasOwnProperty(key)) {
                const element = this.groups[key];
                const parentDom = this.createParentDom(key)
                for (const item in element.items) {
                    if (element.items.hasOwnProperty(item)) {
                        const element1 = element.items[item];
                        var item_generator = new ItemGenerator(item, element1, parentDom)
                    }
                }
            }
        }
    }

    GroupGenerator.prototype.createParentDom = function(id){
        var parentDom = document.createElement('div');
        parentDom.id = id;
        parentDom.classList.add('group_container_'+id);
        this.parentElement.appendChild(parentDom);
        return parentDom;
    }

    window.GroupGenerator = GroupGenerator;

})(document, window, window.ItemGenerator)