import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Chart from './financialsChart.js';
import Loading from '../shared/loading.js';
import ErrorMessage from '../shared/errorMessage.js';
//const moment = require('moment');
//const util = require('util'); //print an object

const styles = theme => ({
  card: {
    margin: 20
  },
  header: {
    textAlign: 'left',
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      display: 'block'
    }
  },
  headerAction: {
    marginTop: 0,
    marginRight: 0
  },
  cardContent: {
    textAlign: 'center'
  },
  textField: {
    minWidth: 150,
   [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: 20
    }
  },
  selectedChip: {
    background: theme.palette.gradient,
    color: 'white',
    '&:hover, &:active, &:focus': {
      background: theme.palette.gradient,
      color: 'white',
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      }
    }
  },
  chip: {
    margin: theme.spacing.unit,
    fontSize: '1.0rem',
    borderRadius: 32,
    padding: theme.spacing.unit,
    backgroundColor: theme.palette.background.default,
    '&:hover, &:active, &:focus': {
      background: theme.palette.gradient,
      color: 'white',
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      }
    }
  },
  footer: {
    padding: '2px 20px',
    display: 'block',
  },
  footerDivider: {
    width: '20%',
    marginBottom: 5
  },
  chipsContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }    
  },  
  tabsContainer: {
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.0), 0px 2px 2px 0px rgba(0, 0, 0, 0.0), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    [theme.breakpoints.up('lg')]: {
      display: 'none'
    }
  }
});

const getUnit = (type, metric) => {
  if (type === 'annual') {
    return metric > 1000 ? 1000 : 1;
  }

  if (metric > 1000000000) {
    return 1000000000;
  } else if (metric > 1000000) {
    return 1000000;
  } else {
    return metric;
  }
}

const getUnitLabel = (type, unit) => {
  if (type === 'annual') {
    return unit === 1000 ? '($ in Billions, Except Per Share Data)' : '($ in Millions, Except Per Share Data)';
  }

  if (unit === 1000000000) {
    return '($ in Billions)';
  } else if (unit === 1000000) {
    return '($ in Millions)';
  } else {
    return '(in $s)';
  }
}

const Financials = (props) => {
  var { classes, type, selectedMetric, handleChange, availableMetrics, chartData } = props;
  var selectedMetricValue = chartData && chartData[0].value;

  var unit = getUnit(type, selectedMetricValue); //annual financials are in millions from firebase
  var unitLabel = getUnitLabel(type, unit); 

  var selected = availableMetrics.filter(obj => { 
    return obj.name === selectedMetric 
  });
  var selectedTitle = selected[0].title;

  return (
    <Card className={classes.card} >
      <CardHeader 
        title={type.toProperCase()+" "+selectedTitle+" Performance"} 
        subheader={unitLabel} 
        classes={{root: classes.header, action: classes.headerAction}} 
        action={
          <TextField 
            id="select-metric" 
            select
            label="Select Metric"
            className={classes.textField}
            value={selectedMetric}
            onChange={handleChange('selected'+type.toProperCase()+'Metric')}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            margin="normal"
          >
          {availableMetrics.map(option => (
            <MenuItem key={option.name} value={option.name}>
              {option.title}
            </MenuItem>
          ))}
          </TextField>           
        } />
      <CardContent className={classes.cardContent} >
        { chartData ? <Chart chartData={chartData} shouldRedraw={false} selectedMetric={selectedMetric} unit={unit} /> : <Loading /> }
      </CardContent>
      {/*<TickersList chipData={chipData} deleteComp={deleteComp} />*/}
    </Card>    
  );
}

class FinancialsChart extends Component {
  constructor (props) {
    super(props);

    var selectedQuarterlyMetric = props.quarterlyMetrics[0].name;
    var selectedAnnualMetric = props.annualMetrics[0].name;

    this.state = { 
      chartData: props.chartData,
      selectedQuarterlyMetric: selectedQuarterlyMetric,
      selectedAnnualMetric: selectedAnnualMetric      
    }

    if (!props.quarterlyData) {
      props.updateData('quarterly', selectedQuarterlyMetric);
    }

    if (!props.annualData) {
      props.updateData('annual', selectedAnnualMetric);
    }   
  }

  formatQuarterlyMetric = (type) => {
    
    var selected = this.props.quarterlyMetrics.filter(obj => { 
      return obj.name === type 
    });

    return selected[0].title;

    /**
    switch(type) {
      case 'totalRevenue': return 'Revenue';
      case 'grossProfit': return 'Gross Profit';
      case 'operatingIncome': return 'Operating Income';
      case 'netIncome': return 'Net Income';
      default: return "Selected Metric";
    } **/
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });

    this.props.updateData(name === 'selectedAnnualMetric' ? 'annual' : 'quarterly', event.target.value);
  };

  render() {
    const { classes, quarterlyData, annualData, quarterlyMetrics, annualMetrics } = this.props;
    const { selectedQuarterlyMetric, selectedAnnualMetric } = this.state;

    if (!quarterlyData) {
      return <ErrorMessage message="Sorry! We don't have financial data for this stock yet." />;
    }

    return(
    <div>
    { quarterlyData && <Financials classes={classes} type='quarterly' chartData={quarterlyData} selectedMetric={selectedQuarterlyMetric} handleChange={this.handleChange} availableMetrics={quarterlyMetrics} />}
    { annualData && <Financials classes={classes} type='annual' chartData={annualData} selectedMetric={selectedAnnualMetric} handleChange={this.handleChange} availableMetrics={annualMetrics} />}
    </div>
    );
  }
}

FinancialsChart.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  quarterlyData: PropTypes.array,
  quarterlyMetrics: PropTypes.array,
  annualData: PropTypes.array,
  annualMetrics: PropTypes.array, 
  updateData: PropTypes.func.isRequired,  
};

export default withStyles(styles, { withTheme: true })(FinancialsChart);