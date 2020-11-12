(function(document, window, Component){
    var newComponent = new Component('div','hello', document.body);
    var el = newComponent.register();
    console.log(el.style)
    newComponent.setAttribute('style', 'color:blue;font-size:16px;');
    var newComponent1 = new Component('div', 'fuck you', el);
    newComponent1.register();
    newComponent1.setAttribute('style', 'color:red;font-size:16px;');
    var newComponent2 = new Component('div', 'What do you mean?', el);
    newComponent2.register();
    newComponent2.setAttribute('style', 'color:green;font-size:12px;');
    // setTimeout(function(e){
    //     // newComponent.deregister();
    // },1000)
})(document, window, window.Component)