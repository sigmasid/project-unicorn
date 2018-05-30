import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { withStyles } from '@material-ui/core/styles';

//const util = require('util'); //print an object

const styles = theme => ({

});

class FinancialsChart extends Component {
  
  state = {
    shouldRedraw: false,
  }
    
  componentWillReceiveProps(nextProps){
    //check redraw
  }

  getChartDataset(type) {
    const { chartData, unit, theme } = this.props;

    return [{
      label: 'financials',
      data: chartData.map(obj => { return (obj.value / unit) }),
      borderColor: theme.palette.secondary.light,
      backgroundColor: theme.palette.secondary.light,
      datalabels: {
        display: true,
        color: 'black',
        align: 'end',
        anchor: 'end',
        formatter: function(value, context) {
          return '$'+value.toFixed(2);
        }
      }
    }]
  }

  render() {
    const { chartData } = this.props;

    const data = (canvas) => {
    return {
      labels: chartData.map(obj => { return obj.label }),
      type: 'bar',
      datasets: this.getChartDataset()
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
                return "$"+value.toFixed(2);
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
                return value.toFixed(2);
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
