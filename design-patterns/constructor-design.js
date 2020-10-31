function User(name, age){
    this.name = name;
    this.age = age;
    this.toString = function(){
        console.log(`name : ${name} and age : ${age}`);
    }
}

// Note here that we are using Object.prototype.newMethod rather than
// Object.prototype so as to avoid redefining the prototype object
User.prototype.log = function(){
    console.log(`LOG:: name : ${this.name} and age : ${this.age}`);
}

var user = new User('mantu pani', '29');
user.toString();
user.log();