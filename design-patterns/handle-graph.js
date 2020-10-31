(function(document, bar_config){
    var data = bar_config;
    
    data = data.sort(function (a, b) {
        return d3.ascending(a.value, b.value);
    });

    var initStackedBarChart = {
        draw: function(config) {
            console.log(config)
            d3.selectAll(".graph-tooltip").remove()
            var me = this,
            domEle = config.element,
            stackKey = config.key,
            data = config.data,
            margin = {top: 20, right: 20, bottom: 30, left: 120},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom,
            xScale = d3.scaleLinear().rangeRound([0, width]),
            yScale = d3.scaleBand().rangeRound([height, 0]).padding(0.1),
            color = d3.scaleOrdinal(config.colors),
            xAxis = d3.axisBottom(xScale),
            yAxis =  d3.axisLeft(yScale).tickFormat(function(d){
                return d;
            }),
            svg = d3.select("#"+domEle).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
            var stack = d3.stack()
                .keys(stackKey)
                .order(d3.stackOrder)
                .offset(d3.stackOffsetNone);
        
            var layers= stack(data);
            data.sort(function(a, b) { return b.view_count - a.view_count; });
            yScale.domain(data.map(function(d) { 
                return d.name; 
            }));
            xScale.domain([0, d3.max(layers[layers.length - 1], function(d) { return d[0] + d[1]; }) ]).nice();
    
            var layer = svg.selectAll(".layer")
                .data(layers)
                .enter().append("g")
                .attr("class", "layer")
                .style("fill", function(d, i) { return color(i); });
            // Define the div for the tooltip
            var div = d3.select("body").append("div")	
                .attr("class", "tooltip")				
                .style("opacity", 0);  
            
            
            
              layer.selectAll("rect")
                  .data(function(d) { 
                      return d; 
                    })
                .enter().append("rect")
                  .attr("y", function(d) {
                      return yScale(d.data.name); 
                    })
                  .attr("x", function(d) {
                      return xScale(d[0]); 
                    })
                  .attr("height", yScale.bandwidth()-15)
                  .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]) })
                    .on('mouseover', function (d) {
                        var table = '<table class="table table-striped tool-tip-table"><thead><tr ><th colspan="3" style="border-bottom: 1px solid beige;">Offer Summary</th></tr></thead><tbody>';
                        var tooltipColor = ['lemon-green', 'light-green', 'green', 'violet'];
                        config.legends.forEach(function(legend, i){
                            table += '<tr><td><span class="'+tooltipColor[i]+'"></span></td><td>'+legend+'</td><td id="value_'+i+'" class="value-td">'+d.data[stackKey[i]]+'</td></tr>';
                        });  
                        table+='</tbody></table>';
                        div.transition()		
                            .duration(200)		
                            .style("opacity", .9);		
                        div.html(table)	
                            .style("left", (d3.event.pageX) + "px")		
                            .style("top", (d3.event.pageY - 28) + "px");	
                    }).on('mouseout', function () {
                        div.transition()		
                            .duration(500)		
                            .style("opacity", 0);
                    })
    
                svg.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + (height+5) + ")")
                .call(xAxis);
    
                svg.append("g")
                .attr("class", "axis axis--y")
                .attr("transform", "translate(0,0)")
                .call(yAxis);
                
            var legendContainer = d3.select("#graphic-legends")
                .append('svg')
                .attr('width', 960)
                .attr('height', 40)
                .attr('style', 'margin-top: -4px;')
                .append('g')
                .attr('transform', 'translate(250,14)')  
            
            
            
            var legendSvg = legendContainer.append('g')
        
            config.legends.forEach(function (s, i) {
                legendSvg.append('rect')
                    .attr('fill', config.colors[i])
                    .attr('width', 5)
                    .attr('height', 5)
                    .attr('x', i * 100 )
                    .attr('y', 5);
                legendSvg.append('text')
                    .attr('style', 'font-size:10px')
                    .attr('fill', 'black')
                    .attr('x', i * 100 + 10)
                    .attr('y', 10)
                    .text(s);
            });
        }
    }

    var prepareData = (function(){
        // console.log(offers)
        // var dataSets = [
        //     {data:[], name: 'Sum of Views'},
        //     {data:[], name: 'Sum of Clicked'},
        //     {data:[], name: 'Sum of Reedemed'},
        //     {data:[], name: 'Sum of Facebook Shares'}
        // ]
        var dataSets = [];
        var keys = ['view_count' , 'click_count', 'redeem_count', 'facebook_share'];
        for (var key in offers) {
            if(key < 10)
            if (offers.hasOwnProperty(key)) {
                var element = offers[key];
                element['name'] = element.offer_detail.headline
                dataSets.push(element)
            }
        }
        data = dataSets;
        // console.log(data)
        // stackedHorizontalBarChart();
        // stackedHorizontalBarChartV3();
        initStackedBarChart.draw({
            data: data,
            colors:['#bbd531', '#66b846', '#0a7139' , '#bc82f2'],
            key: keys,
            element: 'graphic',
            legends:['Sum of Views' , 'Sum of Clicked', 'Sum of Reedemed' , 'Sum of Facebook Shares']
        });
    })()
    
    var render = function(){
        //set up svg using margin conventions - we'll need plenty of room on the left for labels
        var margin = {
            top: 15,
            right: 25,
            bottom: 15,
            left: 60
        };

        var width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var svg = d3.select("#graphic").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scale.linear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d.value;
            })]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([height-200, 0], .1)
            .domain(data.map(function (d) {
                return d.name;
            }));

        //make y axis to show bar names
        var yAxis = d3.svg.axis()
            .scale(y)
            //no tick marks
            .tickSize(0)
            .orient("left");

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")

        //append rects
        bars.append("rect")
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value);
            });

        //add a value label to the right of each bar
        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
                return y(d.name) + y.rangeBand() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return x(d.value) + 3;
            })
            .text(function (d) {
                return d.value;
            });
    }

    function stackedHorizontalBarChart(){
        var legends = ['Sum of Views' , 'Sum of Clicked', 'Sum of Reedemed' , 'Sum of Facebook Shares'];
        var legendColors = ['#bbd531', '#66b846', '#0a7139' , '#bc82f2'];
        var margins = {
            top: 12,
            left: 158,
            right: 24,
            bottom: 24
        },
        legendPanel = {
            width: 180
        },
        width = 960 - margins.left - margins.right, height = 400 - margins.top - margins.bottom,
        dataset = data,
        series = dataset.map(function (d) {
            return d.name;
        }),
        dataset = dataset.map(function (d) {
            return d.data.map(function (o, i) {
                // Structure it so that your numeric
                // axis (the stacked amount) is y
                return {
                    y: o.value,
                    x: o.name
                };
            });
        }),
        stack = d3.layout.stack();
        stack(dataset);
        
        var dataset = dataset.map(function (group) {
            return group.map(function (d) {
                // Invert the x and y values, and y0 becomes x0
                return {
                    x: d.y,
                    y: d.x,
                    x0: d.y0
                };
            });
        }),
        svg = d3.select("#graphic")
            .append('svg')
            .attr('width', width + margins.left + margins.right + legendPanel.width)
            .attr('height', height + margins.top + margins.bottom)
            .append('g')
            .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')'),
            xMax = d3.max(dataset, function (group) {
                return d3.max(group, function (d) {
                    return d.x + d.x0;
                });
            }),
            xScale = d3.scale.linear()
                .domain([0, xMax])
                .range([0, width]),
            
            names = dataset[0].map(function (d) {
                return d.y;
            }),
            // _ = console.log(months),
            yScale = d3.scale.ordinal()
                .domain(names)
                .rangeRoundBands([0, height], .5),
            xAxis = d3.svg.axis()
                .scale(xScale),
            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left'),
            // colours = d3.scale.category10(),
            groups = svg.selectAll('g')
                .data(dataset)
                .enter()
                .append('g')
                .style('fill', function (d, i) {
                    // return colours(i);
                    return legendColors[i];
                }),
        rects = groups.selectAll('rect')
            .data(function (d) {
                return d;
            })
            .enter()
            .append('rect')
            .attr('x', function (d) {
                return xScale(d.x0);
            })
            .attr('y', function (d, i) {
                return yScale(d.y);
            })
            .attr('height', function (d) {
                return yScale.rangeBand();
            })
            .attr('width', function (d) {
                return xScale(d.x);
            })
            .on('mouseover', function (d) {
                var xPos = parseFloat(d3.select(this).attr('x')) / 2 + width / 2;
                var yPos = parseFloat(d3.select(this).attr('y')) + yScale.rangeBand() / 2;
        
                d3.select('#tooltip')
                    .style('left', xPos + 'px')
                    .style('top', yPos + 'px')
                    .select('#value')
                    .text(d.x);
        
                d3.select('#tooltip').classed('hidden', false);
            })
            .on('mouseout', function () {
                d3.select('#tooltip').classed('hidden', true);
            })

            
        
            svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(0,'+height+')')
                .call(xAxis);
        
            svg.append('g')
                .attr('class', 'axis')
                .call(yAxis);

            var legendContainer = d3.select("#graphic-legends")
                .append('svg')
                .attr('width', 1024)
                .attr('height', 40)
                .append('g')
                .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')  
            
            
            
            var legendSvg = legendContainer.append('g')
                .attr('transform', 'translate(' + (margins.left) + ',' + margins.top + ')') 

        
            series.forEach(function (s, i) {
                legendSvg.append('rect')
                    .attr('fill', legendColors[i])
                    .attr('width', 5)
                    .attr('height', 5)
                    .attr('x', i * 100 )
                    .attr('y', 5);
                legendSvg.append('text')
                    .attr('style', 'font-size:10px')
                    .attr('fill', 'black')
                    .attr('x', i * 100 + 10)
                    .attr('y', 10)
                    .text(s);
            });

            console.log(d3)
    }

    var dummyKeys = ["wounds", "other", "disease"];
    var dummyData = [
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
        {"date":"3/1856","total":46140,"disease":15,"wounds":0,"other":35}]

    
    // render();






















    
    // console.log(d3)
    // //sort bars based on value
    // data = data.sort(function (a, b) {
    //     return d3.ascending(a.value, b.value);
    // });

    // var margin = {
    //     top: 15,
    //     right: 25,
    //     bottom: 15,
    //     left: 60
    // };

    // var width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;

    // var svg = d3.select("#graphic").append("svg")
    //         .attr("width", width + margin.left + margin.right)
    //         .attr("height", height + margin.top + margin.bottom)
    //         .append("g")
    //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  
            
    
    // var x = d3.scale.linear()
    //         .range([0, width])
    //         .domain([0, d3.max(data, function (d) {
    //             return d.value;
    //         })]);

            
    // var y = d3.scale.ordinal()
    //     .rangeRoundBands([height, 0], .1)
    //     .domain(data.map(function (d) {
    //         return d.name;
    //     }));

    

    //     //make y axis to show bar names
    // var yAxis = d3.svg.axis()
    //         .scale(y)
    //         //no tick marks
    //         .tickSize(0)
    //         .orient("left");


    // var gy = svg.append("g")
    //         .attr("class", "y axis")
    //         // .call(yAxis)
        
        


    // var bars = svg.selectAll(".bar")
    //         .data(data)
    //         .enter()
    //         .append("g")

    //     //append rects
    // bars.append("rect")
    //         .attr("class", "bar")
    //         .attr("y", function (d) {
    //             return y(d.name);
    //         })
    //         .attr("height", 20)
    //         .attr("x", 0)
    //         .attr("width", function (d) {
    //             return x(d.value);
    //         });

    //     //add a value label to the right of each bar
    // bars.append("text")
    //         .attr("class", "label")
    //         //y position of the label is halfway down the bar
    //         .attr("y", function (d) {
    //             return y(d.name) + 20 / 2 + 4;
    //         })
    //         //x position is 3 pixels to the right of the bar
    //         .attr("x", function (d) {
    //             return x(d.value) + 3;
    //         })
    //         .text(function (d) {
    //             return d.value;
    //         });
})(document, bar_config)