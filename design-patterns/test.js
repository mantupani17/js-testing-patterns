function __doInputTextValidation() {
    var isAllInputValid = false;
    var tempArray = []
    var allInputsValue = document.getElementsByClassName("litmus-referral-text-input");
    var k = 0;
    for (var i = 0; i < allInputsValue.length/3; i++) {
        var referralObject = {};
        var isInputValid = false;
        for (var j = 0; j < 3; j++) {
            isInputValid = true;
            if (allInputsValue[k].name && allInputsValue[k].name == "name") {
                // referralObject = JSON.parse(JSON.stringify(referralObject))
                referralObject["name"] = (allInputsValue[k].value || "");
                isInputValid = __validateUserName(allInputsValue[k].value);
                if (!isInputValid) {
                    isInputValid = false;
                }
            }
            if (allInputsValue[k].name && allInputsValue[k].name == "mobile") {
                // referralObject = JSON.parse(JSON.stringify(referralObject))
                referralObject["mobile"] = (allInputsValue[k].value || "");
                isInputValid = __validatePhoneNumber(allInputsValue[k].value);
                if (!isInputValid) {
                    isInputValid = false;
                }
            }
            if (allInputsValue[k].name && allInputsValue[k].name == "email") {
                // referralObject = JSON.parse(JSON.stringify(referralObject))
                referralObject["email"] = (allInputsValue[k].value || "");
                isInputValid = __validateEmail(allInputsValue[k].value);
                if (!isInputValid) {
                    isInputValid = false;
                }
            }
            if(isInputValid){
                k++;
            }
        }
        if (isInputValid) {
            isAllInputValid = true;
            tempArray.push(referralObject);
        }else{
            isAllInputValid = false;
        }

    }

    if(isAllInputValid){
        console.log(tempArray)
    }
}
function __validateUserName(value){
    if(value){
        return true;
    }
    return false;
}

function __validatePhoneNumber(value){
    if(value){
        return true;
    }
    return false;
}
function __validateEmail(value){
    if(value){
        return true;
    }
    return false;
}