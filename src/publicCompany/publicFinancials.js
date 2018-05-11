import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Card, { CardContent, CardHeader } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/Menu/MenuItem';
import BarChart from './financialsChart.js';
import Loading from '../shared/loading.js';

const util = require('util'); //print an object

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

class StockChart extends Component {
  constructor (props) {
    super(props);
    
    this.handleCompTextInput = this.handleCompTextInput.bind(this);    
    this.getUnit = this.getUnit.bind(this);    
    this.getUnitLabel = this.getUnitLabel.bind(this);    

    const availableMetrics = [{name: 'totalRevenue', title: "Revenue"}, {name: 'grossProfit', title: "Gross Profit"}, {name: 'operatingIncome', title: "Operating Income"}, {name: 'netIncome', title: "Net Income"}];
    var selectedMetricValue = ((props.chartData[Object.keys(props.chartData)[0]]).financials.financials)[0]['totalRevenue'];
    var unit = this.getUnit(selectedMetricValue);
    
    this.state = { 
      priceData: props.priceData,
      value: 0,
      unit: this.getUnit(selectedMetricValue),
      unitLabel: this.getUnitLabel(unit),
      availableMetrics: availableMetrics,
      selectedMetric: 'totalRevenue'
    }
  }

  handleCompTextInput = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleAddComp = () => {
    this.props.addComp(this.state.compTicker);
  }


  handleChange = name => event => {
    var selectedMetricValue = ((this.props.chartData[Object.keys(this.props.chartData)[0]]).financials.financials)[0][event.target.value];
    var unit = this.getUnit(selectedMetricValue);
    this.setState({unit: unit, unitLabel: this.getUnitLabel(unit), selectedMetric: event.target.value});
  };

  getUnit = metric => {
    if (metric > 1000000000) {
      return 1000000000;
    } else if (metric > 1000000) {
      return 1000000;
    } else {
      return metric;
    }
  }

  getUnitLabel = unit => {
    if (unit === 1000000000) {
      return '($ in Billions)';
    } else if (unit === 1000000) {
      return '($ in Millions)';
    } else {
      return '(in $s)';
    }
  }

  formatMetricType = (type) => {
    switch(type) {
      case 'totalRevenue': return 'Revenue';
      case 'grossProfit': return 'Gross Profit';
      case 'operatingIncome': return 'Operating Income';
      case 'netIncome': return 'Net Income';
      default: return "Selected Metric";
    }
  }

  render() {
    const { classes, theme, chartData } = this.props;
    const { selectedMetric, availableMetrics, unit, unitLabel  } = this.state;
    console.log("unit is "+unit);

    if (!chartData) {
      return null;
    }

    return(
    <Card className={classes.card} >
      <CardHeader 
        title={"Quarterly "+this.formatMetricType(selectedMetric)+" Performance"} 
        subheader={unitLabel} 
        classes={{root: classes.header, action: classes.headerAction}} 
        action={
          <TextField 
            id="select-metric" 
            select
            label="Select Metric"
            className={classes.textField}
            value={selectedMetric}
            onChange={this.handleChange('selectedMetric')}
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
        { chartData ? <BarChart chartData={chartData} shouldRedraw={false} selectedMetric={selectedMetric} unit={unit} /> : <Loading /> }
      </CardContent>
      {/*<TickersList chipData={chipData} deleteComp={deleteComp} />*/}
    </Card>
    );
  }
}

StockChart.propTypes = {
  classes: PropTypes.object.isRequired,
  chartData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(StockChart);