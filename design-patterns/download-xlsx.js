(function(document){
    var data = [
        {
            name:'mantu', 
            age:28, 
            mobile:'7873160006'
        },
        {   
            name:'mantu', 
            age:28, 
            mobile:'7873160006'
        },
        {name:'mantu', age:28, mobile:'7873160006'},
        {name:'mantu', age:28, mobile:'7873160006'},
        {name:'mantu', age:28, mobile:'7873160006'},
        {name:'mantu', age:28, mobile:'7873160006'},
        {name:'mantu', age:28, mobile:'7873160006'},
        {name:'mantu', age:28, mobile:'7873160006'}
    ];
    var EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    var EXCEL_EXTENSION = '.xlsx';
    var jsonHolder = document.getElementById('json-data');
    jsonHolder.innerHTML = JSON.stringify(data, undefined, 4);
    var dwnldBtn = document.getElementById('download-as-xlsx');
    dwnldBtn.addEventListener('click', function(e){
        // saveAsExcell('myFile');
        // console.log(XLSX, XLS, XLSX_NEW)
        // saveAsExcellInOlderMethod('my_file')
        saveAsExcellAOA('my_file');
    });

    function saveAsExcellInOlderMethod(filename){
        var workbook = {
            Sheets:{},
            SheetNames:[]
        }
        var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
        var wbout = XLSX.write(workbook,wopts);
        saveAs(new Blob([s2ab(wbout)],{type:""}), filename+'_exported_data_'+new Date().getTime()+EXCEL_EXTENSION)
    }   

    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    function saveAsExcell(filename){
        var worksheet = XLSX.utils.json_to_sheet(data);
        console.log(worksheet)
        // var workbook = {
        //     Sheets:{
        //         'data': worksheet
        //     },
        //     SheetNames:['sheet1']
        // }
        // var excellBuffer = XLSX.write(workbook, {bookType:'xlsx',type:'array'});
        // var data = new Blob([excellBuffer], {type:EXCEL_TYPE})
        // saveAs(data, filename+'_exported_data_'+new Date().getTime()+EXCEL_EXTENSION);
    }

    function saveAsExcellAOA(filename){
        var columns = Object.keys(data[0]);
        var createXLSLFormatObj = [];
        var ws_name = "sheet 1";
        createXLSLFormatObj.push(columns);
        for (var key in data) {
            var innerRowData = [];
            if (data.hasOwnProperty(key)) {
                var element = data[key];
                for(var i=0; i<columns.length; i++){
                    innerRowData.push(element[columns[i]])
                }
                createXLSLFormatObj.push(innerRowData);
            }
        }
        console.log(data, columns)
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
        console.log(ws)
        /* Add worksheet to workbook */
        XLSX.utils.book_append_sheet(wb, ws, ws_name);

        /* Write workbook and Download */
        XLSX.writeFile(wb, filename+'_exported_data_'+new Date().getTime()+EXCEL_EXTENSION);
        // XLSX.write(fileName);
    }
})(document)


