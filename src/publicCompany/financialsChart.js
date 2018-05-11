import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { withStyles } from 'material-ui/styles';
import { colorsArray } from '../shared/sharedFunctions.js';

const util = require('util'); //print an object

const styles = () => ({
});

class FinancialsChart extends Component {
  
  constructor (props) {
    super(props);
    var newArray = (props.chartData[Object.keys(props.chartData)[0]].financials.financials).slice();

    this.state = {
      shouldRedraw: false,
      chartData: newArray.reverse()
    }
  }
    
  componentWillReceiveProps(nextProps){
    //check redraw
  }

  getChartLabels() {
    const { chartData } = this.state;

    return chartData.map( dataPoint => { 
      return dataPoint.reportDate;
    });
  }

  getChartDataset(type) {
    const { chartData, unit } = this.props;

    return Object.keys(chartData).map((ticker, index) => {
      //reverse does in place - so copy array by value first
      var currentStockFinancials = chartData[ticker].financials.financials.slice();
      var dataPoints = (currentStockFinancials.reverse()).map( dataPoint => { return dataPoint[type] / unit });

      return {
        label: ticker,
        data: dataPoints,
        borderColor: colorsArray[index],
        backgroundColor: colorsArray[index],
        datalabels: {
          display: true,
          color: 'black',
          align: 'end',
          anchor: 'end',
          formatter: function(value, context) {
            return '$'+value.toFixed(1);
          }
        }
      }
    });    
  }

  render() {
    const { selectedMetric } = this.props;

    const data = (canvas) => {
    return {
      labels: this.getChartLabels(),
      type: 'bar',
      datasets: this.getChartDataset(selectedMetric)
    }}

    return (
        <Bar data={data} height={document.body.clientWidth > 960 ? 250 : 600 } width={800} redraw={this.state.shouldRedraw} options={{
          legend: {
            display: false,
          },
          maintainAspectRatio: true,
          plugins: {
            datalabels: {
              color: 'black',
              font: {
                family: 'Roboto',
                size: document.body.clientWidth <= 600 ? 12 : 16
              },
              formatter: function (value, context) {
                return "$"+value.toFixed(1);
              }
            }
          },
          tooltips: {
            enabled: false
          },
          layout: {
            padding: {
                left: 0,
                right: document.body.clientWidth > 600 ? 0 : 25,
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
                beginAtZero: true,
                callback: function(value, index, values) {
                  return value;
                },
                fontFamily: 'Roboto',
                fontSize: document.body.clientWidth <= 600 ? 12 : 16,
                formatter: function (value, context) {
                return value.toFixed(1);
                }
              }
            }],
            xAxes: [{
              id: 'comparable companies',
              type: 'category',
              gridLines: [{
            		display: false
            	}],
              ticks: {
              	padding: 10,
                autoSkip: false,
                maxRotation: document.body.clientWidth > 960 ? 0 : 90,
                minRotation: document.body.clientWidth > 960 ? 0 : 90,
                fontFamily: 'Roboto',
                fontSize: document.body.clientWidth <= 600 ? 12 : 16
							}
            }]
        	}
        }} 
        />
    );
  }
}

export default withStyles(styles, { withTheme: true })(FinancialsChart);
