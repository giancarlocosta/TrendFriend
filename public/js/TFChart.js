function TFChart(stockName, rawData, context, isInteractive, width, height) {
    this.stockName = stockName;
    this.context = context;
    this.isInteractive = isInteractive;
    this.rawData = rawData;
    this.width = width;
    this.height = height;
    this.chartData = null;
    this.chartOptions = null;
    this.numDataPoints = 0;

    this.setChartData(this.rawData);
    this.setChartOptions();
    
    // Create and draw actual chart
    this.chart = new google.visualization.LineChart(this.context);
    /*this.chart.setAction({
            id: 'increase',
            text: 'See All Articles',
            action: function() {
              //this.chart.draw(this.chartData, this.chartOptions); 
            }
          });*/
    this.chart.draw(this.chartData, this.chartOptions); 
}

TFChart.prototype.renderChart = function() {
    this.chart.draw(this.chartData, this.chartOptions);     
    /* Add evetn listeners here */
};

// generate some random data, quite different range
TFChart.prototype.setChartData = function(pricesAndEventsData) {
    
    // Build map of (HeadlineDate -> [{Title, ArticleLink}]
    var hMap = {};
    var stockHeadlines = pricesAndEventsData['eventsData'];

    for (var i = 0; i < stockHeadlines.length; i++) {
        var date = stockHeadlines[i]['date'].split("T"); date = date[0];      
        if (!hMap[date]) {
            hMap[date] = [{Title: stockHeadlines[i]['title'], ArticleLink: stockHeadlines[i]['link'] }];
        }
        else {
            var arr = hMap[date];
            arr.push({Title: stockHeadlines[i]['title'], ArticleLink: stockHeadlines[i]['link'] });
            hMap[date] = arr;
        }
    }
    //console.log(hMap);

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Day'); // X-Axis
    data.addColumn('number', 'Closing Price'); // Y-Axis
    // Use custom HTML content for the domain tooltip.
    data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
    data.addColumn({'type': 'string', 'role': 'style'});
    var rows = new Array();

    // Fill chart data
    var stockPrices = pricesAndEventsData['pricesData'];

    for (var i = 0; i < stockPrices.length; i++) {
        var date = stockPrices[i]['Date'];
        var headlines = !hMap[date] ? null : hMap[date];
        var pointStyle = !hMap[date] ? null : 'point { visible: true; size: 6; shape-type: circle; fill-color: #a52714';
        var closingPrice = parseInt(stockPrices[i]['Closing Price']);
        rows.push([date, closingPrice, this.generateEventTooltipContext(headlines), pointStyle]);
    }

    data.addRows(rows);
    this.numDataPoints = stockPrices.length;
    this.chartData = data;
    return data;
};


TFChart.prototype.setChartOptions = function(optOptionJSON) {
    var skip = this.numDataPoints > 40 ? 5 : (this.numDataPoints < 10 ? 1 : 3);
    var options = {
        hAxis: {
            //title: 'Date',
            titleTextStyle: { color: '#FA8072', bold: true, italic: false},
            textStyle:{color: '#FA8072'},
            gridlines: {
                color: 'transparent'
            },
            direction:-1, 
            slantedText:true, 
            slantedTextAngle:80,
            showTextEvery: skip
        },
        vAxis: {
            title: 'Closing Price',
            titleTextStyle: { color: '#FA8072', bold: true, italic: false},
            textStyle:{color: '#FA8072'},
            gridlines: {
                color: 'transparent'
            }
        },
        legend: {position: 'none'},
        animation: { duration:1000, startup: true, easing: 'linear' }, 
        explorer: {
            maxZoomOut:2,
            keepInBounds: true
        },
        backgroundColor: { fill:'transparent' },
        colors: ['#66CDAA'],
        width: this.width,
        height: this.height,
        title: this.stockName,
        titleTextStyle: { fontSize: 40, color: '#FA8072', bold: true, italic: false},
        // This line makes the entire category's tooltip active.
        focusTarget: 'category',
        tooltip: { trigger: 'selection', isHtml: true },
        enableInteractivity: this.isInteractive,
        // Makes the point visible wihtout hovering if set//pointSize: 3
        dataOpacity: 0.8
    };

    this.chartOptions = options;
    return options;
}


TFChart.prototype.generateArticle = function(headline, link) {
    return '<article><h5 class=\x22articleHeader\x22>'+ headline + '</h5><a href="' + link + '" target="_blank">&nbspRead Article Here</a></article><br/>'
}

TFChart.prototype.generateEventTooltipContext = function(headlines) {
    if (headlines === null) return "<h5 class=\x22articleHeader\x22>No articles posted on this date.</h5>";
    var html = '<h4>Articles</h4><div id="articleListDiv" style="padding:5px 5px 5px 5px; overflow-y: scroll; overflow-x: auto; width:350px; height:200px;">';
    for (var i = 0; i < headlines.length; i++) {
        html += this.generateArticle(headlines[i]['Title'], headlines[i]['ArticleLink']);
    };
    html += "</div>"
    return html;
}

TFChart.prototype.createEventDiv = function() {
    var divString = "<p>GIannnn" + 9 + "</p>"
    return divString;
}; 

// this method is called when chart is first inited as we listen for "dataUpdated" event
TFChart.prototype.zoomChart = function(event) {
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    //event.chart.zoomToIndexes(AMchartData.length - 40, AMchartData.length - 1);
};