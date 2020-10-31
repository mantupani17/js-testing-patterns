var CartModule = (function(){
    var items = {};
    var itemCount = 0;
    var totalPrice = 0;
    var gst = 7;
    var taxPrice = 0;
    return {
        addItem : function(item){
             items[item.id] = item;
             totalPrice += (item.price * item.quantity);
             itemCount++;
             this.cartLog('CREATE', item);
             return items;
        },
        removeItem: function(id){
             var item = items[id];
             totalPrice -= (item.price * item.quantity);
             this.cartLog('REMOVE', item)
             delete items[id];
             if(!Object.keys(items).length){
                totalPrice = 0;
                taxPrice = 0;
             }
             return items;
        },
        updateItem: function(id, item){

        },
        viewCartDetails: function(){
            console.table(items)
            this.calculateGST()
            console.table({
                "Total Items":Object.keys(items).length,
                "Total Price" : parseFloat((totalPrice - taxPrice).toFixed(2)),
                "GST": parseFloat(taxPrice.toFixed(2)),
                "Grand Total" : parseFloat(totalPrice.toFixed(2))
            })
        },
        cartLog: function(action, item){
             console.log(`LOG:: Action ${action} | Item ${JSON.stringify(item)}`);
        },
        getTotalPrice : function(){
            return totalPrice;
        },
        totalItems: function(){
            var totalItems = Object.keys(items).length;
            return totalItems;
        },
        setGst: function(gstPer){
            gst = gstPer;
        },
        calculateGST: function(){
             taxPrice = totalPrice*(gst/100);
             totalPrice += taxPrice;
        }
    }
})();

// CartModule.setGst(10);
// CartModule.addItem({product:'item 1', quantity:2, price:70})
// CartModule.addItem({product:'item 2', price:100})
// CartModule.addItem({product:'item 3', price:90})
// CartModule.addItem({product:'item 4', price:80})
// CartModule.viewCartDetails()
// CartModule.removeItem(2);
// CartModule.viewCartDetails()
// CartModule.addItem({product:'item 5', price:110})
// CartModule.viewCartDetails()
// CartModule.getTotalPrice();
// CartModule.totalItems();

var ItemsModule = (function(){
    var items = [
        { id:1, title:'ponds powder', price:50 },
        { id:2, title:'axe powder', price:130 },
        { id:3, title:'body oil', price:50 },
        { id:4, title:'body lotion', price:143 },
        { id:5, title:'hair oil', price:155 },
        { id:6, title:'abc', price:15 },
        { id:7, title:'xyz prod', price:10 },
        { id:8, title:'pqr prod', price:30 },
        { id:9, title:'pqr prod 1', price:33 },
        { id:10, title:'pqr prod 2', price:30 },
    ];
    var selectedItem = {};

    return {
        // init: function(){},
        renderItems : function(){
            var ele = document.getElementById('item-list');
            for (var key in items) {
                if (items.hasOwnProperty(key)) {
                    var element = items[key];
                    var itemContainer = document.createElement('div');
                    itemContainer.className = 'item-container';
                    var itemName = document.createElement('span');
                    itemName.innerHTML = element.title;
                    itemContainer.appendChild(itemName);
                    var noofitems = document.createElement('input');
                    noofitems.addEventListener('change', function(event){
                        this.setQuantity(event);
                    }.bind(this));
                    noofitems.setAttribute('type', 'number');
                    itemContainer.appendChild(noofitems);
                    var addBtn = document.createElement('button');
                    addBtn.setAttribute('item-id', element.id);
                    addBtn.className = 'add-item-cart';
                    addBtn.innerHTML = '+';
                    addBtn.addEventListener('click', function(event){
                        this.addItem(event);
                    }.bind(this))
                    var remBtn = document.createElement('button');
                    remBtn.setAttribute('item-id', element.id);
                    remBtn.className = 'rem-item-cart';
                    remBtn.innerHTML = '-';
                    remBtn.addEventListener('click', function(event){
                        this.removeItem(event);
                    }.bind(this))
                    itemContainer.appendChild(addBtn);
                    itemContainer.appendChild(remBtn);
                    ele.appendChild(itemContainer);
                }
            }
        },

        addItem: function(e){
            if(!selectedItem['quantity']){
                alert('Please select quantity')
                return false;
            }
            var itemId = e.target.getAttribute('item-id');
            var item = items.filter(function(i){
                return itemId == i.id;
            })
            if(item.length){
                selectedItem['product'] = item[0].title;
                selectedItem['quantity'] = selectedItem['quantity'] || 0;
                selectedItem['price'] = item[0].price;
                selectedItem['id'] = item[0].id;
                CartModule.addItem(selectedItem)
                CartModule.viewCartDetails()
                selectedItem = {};
            }
        },

        removeItem: function(e){
            var itemId = e.target.getAttribute('item-id');
            CartModule.removeItem(itemId)
            CartModule.viewCartDetails()
        },

        setQuantity: function(e){
            selectedItem['quantity'] = parseInt(e.target.value);
        }
    }
})();





