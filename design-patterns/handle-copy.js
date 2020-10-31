(function(document){
    var data = 'hello world \n\n fuck you, mother ducker, sjksjdksk hello \n hjhjsd';
    var copyBtn = document.createElement('button');
    copyBtn.innerHTML = 'Copy text';
    var textarea = document.createElement('textarea');
    textarea.id = "fuck_u"
    textarea.innerHTML = data;
    // textarea.cols = 100;
    // textarea.rows = 10;
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    document.body.appendChild(copyBtn);
    

    
    copyBtn.addEventListener('click', function(){
        var range = document.createRange();
        range.selectNode(document.getElementById('fuck_u'));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        console.log(window.getSelection().addRange(range))
        var successful = document.execCommand('copy');
        console.log(successful)
    });

})(document)