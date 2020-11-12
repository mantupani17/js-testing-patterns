(function(document, window, Component, GroupGenerator){
    var groups = {
        screen1:{
            items:{
                'input_text':{
                    dom_type:'input',
                    type:'text',
                    placeholder:'Please enter name',
                    text: '',
                    order:2,
                    value:''
                },
                'label_1':{
                    dom_type:'label',
                    type:'',
                    placeholder:'',
                    text: 'How are you?',
                    order:1,
                    value:''
                },
                'input_number':{
                    dom_type:'input',
                    type:'number',
                    placeholder:'Please select the age',
                    text: '',
                    order:3,
                    value:''
                }
            },
            screen_title:'Screen one',
            id: 1
        },
        screen2:{
            items:{
                'label_1':{
                    dom_type:'label',
                    type:'',
                    placeholder:'',
                    text: 'Screen Two',
                    order:1,
                    value:''
                }
            },
            screen_title:'Screen two',
            id: 2
        },
        screen3:{
            items:{
                'label_1':{
                    dom_type:'label',
                    type:'',
                    placeholder:'',
                    text: 'Screen Three',
                    order:1,
                    value:''
                }
            },
            screen_title:'Screen three',
            id: 3
        }
    };
 
    var groupGenerator = new GroupGenerator(groups);
})(document, window, window.Component, window.GroupGenerator)