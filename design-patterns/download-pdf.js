(function(document){
    var dummyData = [
        {"date":"3/1856","total":46140,"disease":15,"wounds":0,"other":35,"none of others":'fucjk'},
        {"date":"4/1854","total":8571,"disease":1,"wounds":0,"other":5},
        {"date":"5/1854","total":23333,"disease":12,"wounds":0,"other":9},
        {"date":"6/1854","total":28333,"disease":11,"wounds":0,"other":6},
        {"date":"7/1854","total":28772,"disease":359,"wounds":0,"other":23},
        {"date":"8/1854","total":30246,"disease":828,"wounds":1,"other":30},
        {"date":"9/1854","total":30290,"disease":788,"wounds":81,"other":70},
        {"date":"10/1854","total":30643,"disease":503,"wounds":132,"other":128},
        {"date":"11/1854","total":29736,"disease":844,"wounds":287,"other":106},
        {"date":"12/1854","total":32779,"disease":1725,"wounds":114,"other":131},
        {"date":"1/1855","total":32393,"disease":2761,"wounds":83,"other":324},
        {"date":"2/1855","total":30919,"disease":2120,"wounds":42,"other":361},
        {"date":"3/1855","total":30107,"disease":1205,"wounds":32,"other":172},
        {"date":"4/1855","total":32252,"disease":477,"wounds":48,"other":57},
        {"date":"5/1855","total":35473,"disease":508,"wounds":49,"other":37},
        {"date":"6/1855","total":38863,"disease":802,"wounds":209,"other":31},
        {"date":"7/1855","total":42647,"disease":382,"wounds":134,"other":33},
        {"date":"8/1855","total":44614,"disease":483,"wounds":164,"other":25},
        {"date":"9/1855","total":47751,"disease":189,"wounds":276,"other":20},
        {"date":"10/1855","total":46852,"disease":128,"wounds":53,"other":18},
        {"date":"11/1855","total":37853,"disease":178,"wounds":33,"other":32},
        {"date":"12/1855","total":43217,"disease":91,"wounds":18,"other":28},
        {"date":"1/1856","total":44212,"disease":42,"wounds":2,"other":48},
        {"date":"2/1856","total":43485,"disease":24,"wounds":0,"other":19},
        {"date":"3/1856","total":46140,"disease":15,"wounds":0,"other":35}
    ];

    var utils = {
        data: dummyData,
        initDom: function(){
            var body = document.body;
            var columns = Object.keys(utils.data[0]);
            var container = document.createElement('div');
            var heading = document.createElement('div');
            heading.innerHTML = '---Highely Confidential---';
            heading.style.textAlign = 'center';
            container.appendChild(heading);
            var table = document.createElement('table');
            table.id = "table";
            table.classList.add('table');
            table.classList.add('table-striped');
            container.id = 'list';
            container.style.width = "100%";
            var thead = document.createElement('thead')
            thead.classList.add('thead-dark');
            var tbody = document.createElement('tbody');
            var tr = document.createElement('tr');
            thead.appendChild(tr);
            // utils.appendElement(thead, '');
            columns.forEach(function(val, i){
                var th = document.createElement('th');
                th.innerHTML = val;
                tr.appendChild(th)
            });
            utils.data.forEach(function(val, i){
                var tr = document.createElement('tr');
                tbody.appendChild(tr);
                for (var index = 0; index < columns.length; index++) {
                    var element = columns[index];
                    var value = val[element];
                    var td = document.createElement('td');
                    td.innerHTML = value;
                    tr.appendChild(td);
                }
            })
            table.appendChild(thead);
            table.appendChild(tbody);
            container.appendChild(table);
            var dwnldBtn = document.createElement('button');
            body.appendChild(dwnldBtn);
            dwnldBtn.innerHTML = 'Download';
            var config = {
                x: 70,
                y: 20
            };
            dwnldBtn.addEventListener('click', function(e){
                // if(columns.length > 6){
                //     config.x = 20
                // }
                var columns = Object.keys(utils.data[0]);
                var data = {
                    columns: columns,
                    data: utils.data
                }
                // utils.downloadListAsPDF(config)
                // generatePdf();
                generateAutoTable(data);
            })
            body.appendChild(container);
        },
        
        downloadListAsPDF: function(config){
            var doc = new jsPDF('p','pt','a4');
            var listContainer = document.getElementById('list');
            console.log(listContainer)

            doc.fromHTML(listContainer, config.x, config.y, {
                'width': 180,
                'elementHandlers': {}
            });
            doc.save('hello.pdf');
            // const doc = new jsPDF({
            //     orientation: "landscape",
            //     unit: "in",
            //     format: [4, 2]
            //   });
              
            //   doc.text("Hello world!", 1, 1);
            //   doc.save("two-by-four.pdf");
            
        }
    }

    function makePDF() {
        var quotes = document.getElementById('list');
        html2canvas(quotes)
            .then((canvas) => {
                // MAKE YOUR PDF
                var pdf = new jsPDF('p', 'pt', 'letter');
                console.log(quotes.clientHeight)
                for (var i = 0; i <= quotes.clientHeight/1024; i++) {
                    // This is all just html2canvas stuff
                    var srcImg  = canvas;
                    var sX      = 0;
                    var sY      = 1024*i; // start 980 pixels down for every new page
                    var sWidth  = 900;
                    var sHeight = 1024;
                    var dX      = 0;
                    var dY      = 0;
                    var dWidth  = 900;
                    var dHeight = 1024;
    
                    window.onePageCanvas = document.createElement("canvas");
                    onePageCanvas.setAttribute('width', 900);
                    onePageCanvas.setAttribute('height', 1024);
                    var ctx = onePageCanvas.getContext('2d');
                    
                    // details on this usage of this function: 
                    // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
                    ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);
    
                    // document.body.appendChild(canvas);
                    var canvasDataURL = onePageCanvas.toDataURL("image/png");
    
                    var width         = onePageCanvas.width;
                    var height        = onePageCanvas.clientHeight;
    
                    // If we're on anything other than the first page,
                    // add another page
                    if (i > 0) {
                        pdf.addPage(612, 791); //8.5" x 11" in pts (in*72)
                    }
                    // now we declare that we're working on that page
                    pdf.setPage(i+1);
                    // now we add content to that page!
                    pdf.addImage(canvasDataURL, 'PNG', 20, 20, (width*.62), (height*.62));
    
                }
                // after the for loop is finished running, we save the pdf.
                pdf.save('Test.pdf');
            });
    }

    function tableToJson(table) {
        var data = [];
        // first row needs to be headers
        var headers = [];
        for (var i=0; i<table.rows[0].cells.length; i++) {
            headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,'');
        }
        // go through cells
        for (var i=0; i<table.rows.length; i++) {
            var tableRow = table.rows[i];
            var rowData = {};
            console.log(tableRow)
            for (var j=0; j<tableRow.cells.length; j++) {
        
                rowData[ headers[j] ] = tableRow.cells[j].innerHTML == 'undefined' ? '' :tableRow.cells[j].innerHTML ;
        
            }
        
            data.push(rowData);
        }       
        
        return data; 
    }

    function generatePdf(){
        var table1 = tableToJson(document.getElementById('table')),
        cellWidth = 35,
        rowCount = 0,
        cellContents,
        leftMargin = 12,
        topMargin = 12,
        topMarginTable = 55,
        headerRowHeight = 13,
        rowHeight = 9,

         l = {
            orientation: '',
            unit: 'mm',
            format: 'a4',
            compress: true,
            fontSize: 8,
            lineHeight: 1,
            autoSize: false,
            printHeaders: true
        };

        var doc = new jsPDF(l, '', '', '');

        doc.setProperties({
            title: 'Test PDF Document',
            subject: 'This is the subject',
            author: 'author',
            keywords: 'generated, javascript, web 2.0, ajax',
            creator: 'author'
        });

        doc.cellInitialize();

        $.each(table1, function (i, row){
            rowCount++;
            console.log(row)
            $.each(row, function (j, cellContent) {
                if (rowCount == 1) {
                    doc.margins = 1;
                    doc.setFont("helvetica");
                    doc.setFontType("bold");
                    doc.setFontSize(9);
                    console.log(cellContent)
                    doc.cell(leftMargin, topMargin, cellWidth, headerRowHeight, cellContent, i)
                }else if (rowCount == 2) {
                    doc.margins = 1;
                    doc.setFont("times");
                    doc.setFontType("italic");  // or for normal font type use ------ doc.setFontType("normal");
                    doc.setFontSize(8);                    
                    doc.cell(leftMargin, topMargin, cellWidth, rowHeight, cellContent, i); 
                }else {
                    doc.margins = 1;
                    doc.setFont("courier");
                    doc.setFontType("bolditalic ");
                    doc.setFontSize(6.5);                    
                    doc.cell(leftMargin, topMargin, cellWidth, rowHeight, cellContent, i);  // 1st=left margin    2nd parameter=top margin,     3rd=row cell width      4th=Row height
                }
            })
             
        })
        doc.save('sample Report.pdf'); 
    }

    function generatePdfData(data){
        var tableData = [];
        var cols = data.columns;
        var rowData = data.data;
        for (var key in rowData) {
            if (rowData.hasOwnProperty(key)) {
                var element = rowData[key];
                var dataArray = [];
                for (var index = 0; index < cols.length; index++) {
                    var d = cols[index];
                    dataArray.push(element[d]);
                }
                tableData.push(dataArray);
            }
        }
        return tableData;
        
    }

    function generateAutoTable(data){
        var columns = data.columns;
        var rows = generatePdfData(data);
        // [
        //     [1,'John','Vilnius',22],
        //     [2,'Jack','Riga',25],
        //     [3,'Jones','Riga',25]
        // ];

        var doc = new jsPDF('p', 'pt');

        doc.setFontSize(20);
        doc.text(30, 30, 'Table'); 

        doc.autoTable(columns, rows, {
            margin: { top: 50, left: 20, right: 20, bottom: 0 },
            drawHeaderCell: function (cell, data) {
                if (cell.raw === 'ID') {//paint.Name header red
                    cell.styles.fontSize= 15;
                    cell.styles.textColor = [255,0,0];
                } else {
                    cell.styles.textColor = 255;
                    cell.styles.fontSize = 10;
                }
            },
            createdCell: function (cell, data) {
                if (cell.raw) {
                   cell.styles.fontSize= 15;
                   cell.styles.textColor = [255,0,0];
                } 
            }
        });

        doc.save('output.pdf');
    }


    utils.initDom();

    window.utils = utils;
})(document)