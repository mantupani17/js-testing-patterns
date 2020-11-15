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
                    value:'',
                    class:'input-type',
                    label:{
                        text:'Please enter name: ',
                        color:'red'
                    }
                },
                'label_1':{
                    dom_type:'label',
                    type:'',
                    placeholder:'',
                    text: 'How are you?',
                    order:1,
                    value:'',
                    class:'label-type',
                    label:{
                        text:'',
                        color:'red'
                    }
                },
                'input_number':{
                    dom_type:'input',
                    type:'number',
                    placeholder:'Please select the age',
                    text: '',
                    order:3,
                    value:'',
                    class:'input-type',
                    label:{
                        text:'Please enter age: ',
                        color:'red'
                    }
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
                    value:'',
                    class:'label-type',
                    label:{
                        text:'',
                        color:'red'
                    }
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
                    value:'',
                    class:'label-type',
                    label:{
                        text:'Hello : ',
                        color:'red'
                    }
                }
            },
            screen_title:'Screen three',
            id: 3
        }
    };
 
    var groupGenerator = new GroupGenerator(groups);
})(document, window, window.Component, window.GroupGenerator)   