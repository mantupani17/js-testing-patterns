// object literal
var UserModule = {
    User:{
        name:'',
        age: ''
    },
    createUser: function(user){
        this.User = user;
    },
    updateUser: function(updateData){
        for (var key in updateData) {
            if (updateData.hasOwnProperty(key)) {
                var element = updateData[key];
                this.User[key] = element;
            }
        }
    },
    toString: function(){
        console.log(this.User)
    },
    log: function(){
        console.log(`LOG:: ${JSON.stringify(this.User)}`)
    }
}

// UserModule.createUser({name:'mantu', age:29});
// UserModule.log();
// UserModule.updateUser({name:'mantu pani'});
// UserModule.toString()
// UserModule.log();

// The Module Pattern
var CountModule = (function(){
    var count = 0;
    return {
        incCounter: function(){
            return count++;
        },
        decCounter: function(){
            return count--;
        },
        resetCounter: function(){
            return count = 0;
        },
        log: function(){
            console.log(`LOG:: counter ${count}`);
        }
    }
})()

// CountModule.incCounter();
// CountModule.incCounter();
// CountModule.incCounter();
// CountModule.log()
// CountModule.decCounter();
// CountModule.log()
// CountModule.resetCounter();
// CountModule.log();
// CountModule.incCounter();
// CountModule.log()



