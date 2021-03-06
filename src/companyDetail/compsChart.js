import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
});

class CompChart extends Component {
  
  constructor (props) {
    super(props);
    this.state = {
      shouldRedraw: false
    }
  }
    
  componentWillReceiveProps(nextProps){
    if(nextProps.symbol !== this.props.symbol){
      this.setState({shouldRedraw: true})
    } else {
      this.setState({shouldRedraw: false})
    }
  }

  render() {
    const { comps, symbol, theme } = this.props;
		const data = (canvas) => {

		return {
			labels: comps.map( index => { return (comps.length > 10 && document.body.clientWidth > 960 ? (index[0].toProperCase()).split(' ') : index[0].toProperCase() )}),
      type: 'line',
		  datasets: 
      [{
      	label: 'Company Multiples',
	      data: comps.map( index => { return index[1] }),
        backgroundColor: theme.palette.secondary.light,        
        type: 'bar',
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
          borderColor: 'black',
          backgroundColor: 'rgba(255,255,255,0.0)',
          datalabels: {
            display: function(context) {
              return context.dataIndex === (context.dataset.data.length - 1); // display labels for last one
            },
            backgroundColor: 'black',
            color: 'white',
            align: 'center',
            anchor: 'end',
            formatter: (value, context) => {
              return 'Median: ' + (symbol === 'x' ? value.toFixed(1) + symbol : value.toFixed(0) + symbol);
            }
          }
        }],
		  }
		}

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
                size: document.body.clientWidth <= 600 || comps.length > 10 ? 12 : 16
              },
              formatter: (value, context) => {
                return (!value || value === 0) ? 'NM' : (symbol === 'x' ? value.toFixed(1)+symbol : value.toFixed(0)+symbol);
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
                callback: (value, index, values) => {
                  return value;
                },
                fontFamily: 'Roboto',
                fontSize: document.body.clientWidth <= 600 || comps.length > 10 ? 12 : 16,
                formatter: (value, context) => {
                return (!value || value === 0) ? 'NM' : (symbol === 'x' ? value.toFixed(1)+symbol : value.toFixed(0)+symbol);
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
                fontSize: document.body.clientWidth <= 600 || comps.length > 10 ? 12 : 16
							}
            }]
        	}
        }} 
        />
    );
  }
}

export default withStyles(styles, { withTheme: true })(CompChart);
