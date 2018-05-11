import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
import { withStyles } from 'material-ui/styles';
import 'chartjs-plugin-datalabels';
import { createDate, createDateTime, colorsArray } from '../shared/sharedFunctions.js';

//const util = require('util'); //print an object
var dateFormat = require('dateformat');

class StockChart extends Component {

  getChartDataset() {
    const { chartData } = this.props;
    var shouldIndex = Object.keys(chartData).length > 1;

    return Object.keys(chartData).map((ticker, index) => {
      var currentStock = chartData[ticker].chart;
      var firstValue = (chartData[ticker].chart)[0].close;

      return {
        label: ticker,
        data: currentStock.map(function(dataPoint) { return shouldIndex ? (((dataPoint.close / firstValue) - 1) * 100) : dataPoint.close }),
        pointRadius: 0,
        pointHitRadius: 20,
        lineTension: 0,
        fill: shouldIndex ? false : true,
        spanGaps: true,
        borderColor: colorsArray[index],
        backgroundColor: colorsArray[index],
        datalabels: {
          display: function(context) {
            return shouldIndex ? context.dataIndex === (context.dataset.data.length - 1) : context.dataIndex === 0 || context.dataIndex === (context.dataset.data.length - 1); 
            // display labels for last one if indexed, otherwise for first and last one
          },
          backgroundColor: 'black',
          color: 'white',
          align: 'end',
          anchor: 'end',
          formatter: function(value, context) {
            return shouldIndex ? value.toFixed(1)+'%' : '$'+value.toFixed(2);
          }
        }
      }
    });    
  }

  getChartLabels() {
    const { chartData, duration } = this.props;
    var labelData = chartData[Object.keys(chartData)[0]].chart;

    var allLabels = labelData.map(function(dataPoint) { 
      var durationString = duration.replace(/[0-9]/g, '');

      switch (durationString) {
        case 'd': return dateFormat(createDateTime(dataPoint.date, dataPoint.minute), "h:MMtt");
        case 'w': return dateFormat(createDate(dataPoint.date), "mmm d");
        case 'm': return dateFormat(createDate(dataPoint.date), "mmm d");          
        case 'y': return parseInt(duration, 10) === 1 ? dateFormat(createDate(dataPoint.date), "mmm d") : dateFormat(createDate(dataPoint.date), "mmm yyyy")
        default: return(dataPoint.date)
      }
    });

    return allLabels
  }

  render() {
    const { chartData, shouldRedraw } = this.props;
    var shouldIndex = Object.keys(chartData).length > 1;

		const data = (canvas) => {
		return {
			labels: this.getChartLabels(),
      type: 'line',
		  datasets: this.getChartDataset()
		}}

    return (
        <Line data={data} height={document.body.clientWidth > 960 ? 250 : 800 } width={800} redraw={shouldRedraw} options={{
          legend: {
            display: false,
          },
          maintainAspectRatio: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          tooltips: {
            displayColors: false,
            callbacks: {
                title: function([tooltipItem], data) {
                  return null;
                },                
                label: function(tooltipItem, data) {
                  if (shouldIndex) {
                    var label = data.datasets[0].label+": ";
                    var prefix = tooltipItem.yLabel >= 0 ? '+' : '';
                    var value = tooltipItem.yLabel.toFixed(2);

                    return label+prefix+value+"%";
                  } else {
                    return tooltipItem.xLabel+": $"+tooltipItem.yLabel;
                  }
                }
            }
          },
          layout: {
            padding: {
              left: 40,
              right: 40,
              top: 50,
              bottom: 20
            }
        	},
          scales: {
            yAxes: [{
              id: 'multiple',
              gridLines: [{
          			display: false
          		}],
              ticks: {
              	display: false,
                beginAtZero: false,
                callback: function(value, index, values) {
                  return value;
                },
                fontFamily: 'Roboto',
                fontSize: 12,
              }
            }],
            xAxes: [{
              id: 'time',
              type: 'category',
              gridLines: [{
            		display: false
            	}],
              ticks: {
              	padding: 10,
                autoSkip: true,
                maxTicksLimit: 10,
                maxRotation: document.body.clientWidth > 960 ? 0 : 90,
                minRotation: document.body.clientWidth > 960 ? 0 : 90,
                fontFamily: 'Roboto',
                fontSize: 12,
                callback: function(value, index, values) {
                  return value
                }
							}
            }]
        	}
        }} 
        />
    );
  }
}

export default StockChart;
