import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { colorsArray } from '../shared/sharedFunctions.js';

const util = require('util'); //print an object
const moment = require('moment');

class StockChart extends Component {

  getChartDataset(duration, positiveGradient, negativeGradient) {
    const { chartData } = this.props;
    var shouldIndex = Object.keys(chartData).length > 1;

    return Object.keys(chartData).map((ticker, index) => {

      var currentStock = chartData[ticker].chart;

      var firstValue = currentStock[0]['close'] || currentStock[0]['marketClose'];
      var lastValue = currentStock[currentStock.length - 1]['close'] || currentStock[currentStock.length - 1]['marketClose'];
      //var volumeData = {  label: ticker,  key: 'volumeData', data: currentStock.map( dataPoint => { return dataPoint.volume || dataPoint.marketVolume }), type: 'bar', yAxisID: 'y-axis-2' };

      return {
        label: ticker,
        key: 'stockData',
        type:'line',        
        data: currentStock.map( dataPoint => { 
          var _dataPoint = dataPoint.close || dataPoint.marketClose;
          return shouldIndex ? (((_dataPoint / firstValue) - 1) * 100) : _dataPoint;
        }),
        pointRadius: 0,
        pointHitRadius: 20,
        lineTension: 0,
        fill: shouldIndex ? false : true,
        spanGaps: true,
        borderColor: shouldIndex ? colorsArray[index] : (lastValue > firstValue ? 'rgba(76,175,80,1)' : 'rgba(233, 30, 90,1)'), //green if positive, red if negative
        backgroundColor: shouldIndex ? colorsArray[index] : (lastValue > firstValue ? positiveGradient : negativeGradient),
        yAxisID: 'y-axis-1',
        datalabels: {
          display: (context) => {
            return shouldIndex ? context.dataIndex === (context.dataset.data.length - 1) : context.dataIndex === 0 || context.dataIndex === (context.dataset.data.length - 1); 
            // display labels for last one if indexed, otherwise for first and last one
          },
          backgroundColor: 'black',
          color: 'white',
          align: 'end',
          anchor: 'end',
          formatter: (value, context) => {
            return value && (shouldIndex ? value.toFixed(1)+'%' : '$'+value.toFixed(2));
          }
        }
      }
    });
  }

  getChartLabels() {
    const { chartData, duration } = this.props;
    var labelData = chartData[Object.keys(chartData)[0]].chart;

    var allLabels = labelData.map( dataPoint => { 
      var durationString = duration.replace(/[0-9]/g, '');

      switch (durationString) {
        case 'd': 
          var combinedString = dataPoint.date + "-" + dataPoint.minute;
          return moment(combinedString, "YYYYMD-HH:mm").format("h:mma");
        case 'w': return moment(dataPoint.date).format('MMM D');
        case 'm': return moment(dataPoint.date).format('MMM D');          
        case 'y': return parseInt(duration, 10) === 1 ? moment(dataPoint.date).format('MMM D') : moment(dataPoint.date).format('M/D/YY')
        default: return(dataPoint.date)
      }
    });

    return allLabels
  }

  render() {
    const { chartData, shouldRedraw, duration } = this.props;
    var shouldIndex = Object.keys(chartData).length > 1;

		const data = (canvas) => {
      const ctx = canvas.getContext("2d")
      const positiveGradient = ctx.createLinearGradient(0,0,0,500);
      const negativeGradient = ctx.createLinearGradient(0,0,0,500);

      positiveGradient.addColorStop(0.25, 'rgba(76,175,80,0.7)') // show this color at 0%;
      positiveGradient.addColorStop(0.50, 'rgba(144, 204, 147, 0.5)'); // show this color at 50%
      positiveGradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.0)'); // show this color at 50%

      negativeGradient.addColorStop(0.25, 'rgba(233, 30, 90, 0.7)') // show this color at 0%;
      negativeGradient.addColorStop(0.5, 'rgba(255, 206, 223, 0.5)'); // show this color at 50%
      negativeGradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.0)'); // show this color at 50%

		return {
			labels: this.getChartLabels(),
      type: 'line',
		  datasets: this.getChartDataset(duration, positiveGradient, negativeGradient)
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
                title: ([tooltipItem], data) => {
                  return null;
                },                
                label: (tooltipItem, data) => {

                  if (shouldIndex) {
                    console.log("data is "+util.inspect(data));
                    var label = data.datasets[tooltipItem.datasetIndex].label+": ";
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
          animation: {
            easing: 'easeOutCirc',
            duration: 400
          },
          scales: {
            yAxes: [
            {
              id: 'y-axis-1',
              gridLines: [{
          			display: false
          		}],
              ticks: {
              	display: false,
                beginAtZero: false,
                callback: (value, index, values) => {
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
                callback: (value, index, values) => {
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
