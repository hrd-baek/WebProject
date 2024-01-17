var num = Math.random();
var data = {
    labels: [
        "pink"
    ],
    datasets: [
        {
            data: [num, 1 - num],
            backgroundColor: [
                "#f7e600"
            ],
            hoverBackgroundColor: [
                "#f7e600"
            ]
        }]
};
var data2 = {
    labels: [
        "pink"
    ],
    datasets: [
        {
            data: [num, 1 - num],
            backgroundColor: [
                "#FF6384"
            ],
            hoverBackgroundColor: [
                "#FF6384"
            ]
        }]
};

var data3 = {
    labels: [
        "pink"
    ],
    datasets: [
        {
            data: [num*2, 1 - num],
            backgroundColor: [
                "#00498c"
            ],
            hoverBackgroundColor: [
                "#00498c"
            ]
        }]
};

window.onload = function () {
    var ctx8 = $('#goods').get(0).getContext("2d");
    window.theChart8 = new Chart(ctx8, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            legend: {
                display: false
            },
            elements: {
                center: {
                    text: Math.round(num * 100),
                    fontStyle: 'Helvetica', //Default Arial 
                    sidePadding: 15 //Default 20 (as a percentage) 
                }
            },
            maintainAspectRatio: false,
            cutoutPercentage: 70,
            animation: false,
            rotation: 1 * Math.PI,
            circumference: 1 * Math.PI
        }
    });

    var ctx9 = $('#defects').get(0).getContext("2d");
    window.theChart8 = new Chart(ctx9, {
        type: 'doughnut',
        data: data2,
        options: {
            responsive: true,
            legend: {
                display: false
            },
            elements: {
                center: {
                    text: Math.round(num * 100),
                    fontStyle: 'Helvetica', //Default Arial 
                    sidePadding: 15 //Default 20 (as a percentage) 
                }
            },
            maintainAspectRatio: false,
            cutoutPercentage: 70,
            animation: false,
            rotation: 1 * Math.PI,
            circumference: 1 * Math.PI
        }
    });

    var ctx10 = $('#all').get(0).getContext("2d");
    window.theChart8 = new Chart(ctx10, {
        type: 'doughnut',
        data: data3,
        options: {
            responsive: true,
            legend: {
                display: false
            },
            elements: {
                center: {
                    text: Math.round(num * 100*2),
                    fontStyle: 'Helvetica', //Default Arial 
                    sidePadding: 15 //Default 20 (as a percentage) 
                }
            },
            maintainAspectRatio: false,
            cutoutPercentage: 70,
            animation: false,
            rotation: 1 * Math.PI,
            circumference: 1 * Math.PI
        }
    });
}


Chart.plugins.register({
    beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
            //Get ctx from string
            var ctx = chart.chart.ctx;

            //Get options from the center object in options
            var centerConfig = chart.config.options.elements.center;
            var fontSize = centerConfig.fontSize || '50';
            var fontStyle = centerConfig.fontStyle || 'Arial';
            var txt = centerConfig.text;
            var color = centerConfig.color || '#000';
            var sidePadding = centerConfig.sidePadding || 20;
            var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
            //Start with a base font of 30px
            ctx.font = fontSize + "px " + fontStyle;

            //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
            var stringWidth = ctx.measureText(txt).width;
            var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

            // Find out how much the font can grow in width.
            var widthRatio = elementWidth / stringWidth;
            var newFontSize = Math.floor(30 * widthRatio);
            var elementHeight = (chart.innerRadius * 0.7);

            // Pick a new font size so it will not be larger than the height of label.
            var fontSizeToUse = Math.min(newFontSize, elementHeight);

            //Set font settings to draw it correctly.
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
            var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

            //반도넛일 경우
            if (chart.config.options.rotation === Math.PI && chart.config.options.circumference === Math.PI) {
                centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 1.3);
            }
            ctx.font = fontSizeToUse + "px " + fontStyle;
            ctx.fillStyle = color;

            //Draw text in center
            ctx.fillText(txt, centerX, centerY);
        }
    }
});