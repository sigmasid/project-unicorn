import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { withStyles } from 'material-ui/styles';

function MultipleFormatter(value, context) {
  return (!value || value === 0) ? 'NM' : value.toFixed(1)+"x";
}

const styles = theme => ({
});

class CompChart extends Component {  
  render() {
    const { theme, comps } = this.props;
		const data = (canvas) => {

		return {
			labels: comps.map(function(index) { return (comps.length > 10 && document.body.clientWidth > 960 ? (index[0].toProperCase()).split(' ') : index[0].toProperCase() )}),
      type: 'bar',
		  datasets: 
      [{
      	label: 'Company Mutliples',
	      data: comps.map(function(index) { return index[1] }),
        datalabels: {
          align: 'end',
          anchor: 'end'
        }},
        {
          label: 'Comp Median',
          data: Array(comps.length).fill(this.props.median),
          type: 'line',
          borderDash: [5],
          radius: 0,
          hitRadius: 0,
          borderColor: theme.palette.accent,
          backgroundColor: 'rgba(255,255,255,0.0)',
          datalabels: {
            display: function(context) {
              return context.dataIndex === (context.dataset.data.length - 1); // display labels for last one
            },
            backgroundColor: theme.palette.accent,
            color: 'white',
            align: 'center',
            anchor: 'end',
            formatter: function(value, context) {
              return 'Median: ' + value.toFixed(1) + 'x';
            }
          }
        }],
		  }
		}

    return (
        <Bar data={data} height={document.body.clientWidth > 960 ? 250 : 600 } width={800} options={{
          legend: {
            display: false,
          },
          maintainAspectRatio: true,
          plugins: {
            datalabels: {
              color: 'black',
              font: {
                family: 'Roboto',
                size: document.body.clientWidth > 600 ? 16 : 12 
              },
              formatter: MultipleFormatter
            }
          },
          tooltips: {
            enabled: false
          },
          layout: {
            padding: {
                left: 0,
                right: 0,
                top: 50,
                bottom: 0
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
                fontSize: document.body.clientWidth > 600 ? 16 : 12,
                formatter: MultipleFormatter
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
                fontSize: document.body.clientWidth > 600 ? 16 : 12
							}
            }]
        	}
        }} 
        />
    );
  }
}

export default withStyles(styles, { withTheme: true })(CompChart);
