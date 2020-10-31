var HTTPModule = (function(){
    var response = {};
    var xhttp = new XMLHttpRequest();
    return {
        getCategories : function(){
            return new Promise(function(resolve, reject){
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        resolve(JSON.parse(this.response))
                    }
                };
                xhttp.open("GET", "http://costumier.in/old/api/v1/product/category", true);
                xhttp.send();
            })
        },
        getCategoryById: function(id){
            return new Promise(function(resolve, reject){
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        resolve(JSON.parse(this.response))
                    }
                };
                xhttp.open("GET", "http://costumier.in/old/api/v1/product/category/"+id, true);
                xhttp.send();
            })
        },
        getAllSubCategories: function(){
            return new Promise(function(resolve, reject){
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        resolve(JSON.parse(this.response))
                    }
                };
                xhttp.open("GET", "http://costumier.in/old/api/v1/product/sub-category", true);
                xhttp.send();
            })
        },
        getAllSubCategoriesByCatId: function(cat_id){
            return new Promise(function(resolve, reject){
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        resolve(JSON.parse(this.response))
                    }
                };
                xhttp.open("GET", "http://costumier.in/old/api/v1/product/sub-category/"+cat_id, true);
                xhttp.send();
            })
        }
    }
    


})();

