import React from 'react';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import NumberFormat from 'react-number-format';
import pink from 'material-ui/colors/pink';
import cyan from 'material-ui/colors/cyan';
import { MenuItem } from 'material-ui/Menu';

export const maxRevenueMultiple = 20;
export const maxEBITDAMultiple = 75;
export const maxPEMultiple = 100;

export const colorsArray = [pink[500], cyan[900], cyan[500], cyan[200], cyan[50]];

export const getDurationLabel = duration => {
  const chartDurations = {"1d":"1 Day","1w":"1 Week","1m":"1 Month","3m":"3 Months","6m":"6 Months","1y":"1 Year","2y":"2 Years","5y":"5 Years"};
  return chartDurations[duration] || undefined;
}

export function Element(props) {
  const {value, label, classes, elementClass} = props;

  return (
    <div className={classes.quoteWrapper}>
      <Typography variant={'headline'} className={elementClass} >
        <NumberFormat value={value.toFixed(props.roundTo || 2)} displayType={'text'} thousandSeparator={true} prefix={props.prefix} suffix={props.suffix} />
      </Typography>
      <Typography className={classes.caption} color={'textSecondary'} variant={'caption'}>
        {label}
      </Typography>        
    </div>
  );
}


export const createDate = dateString => {
  var dateArray = dateString.split('-');
  return new Date(dateArray[0],dateArray[1]-1,dateArray[2]);
}

export const createDateTime = (dateString, timeString) => {
  var year = dateString.substring(0,4);
  var month = dateString.substring(4,6);
  var day = dateString.substring(6,8);
  var hour = timeString.split(':')[0];
  var min = timeString.split(':')[1];
  var newDate = new Date(year,month,day,hour,min);
  return newDate;
}

export const getFormattedMetric = (type, year, short) => {
  let selectedYear = year === 'cy1' ? (new Date()).getFullYear() : (new Date()).getFullYear() + 1;

  if (type === 'rev') {
    return selectedYear + (short ? 'E Rev' : 'E Revenue');
  } else if (type === 'ebitda') {
    return selectedYear + 'E EBITDA';
  } else if (type === 'eps') {
    return selectedYear + 'E P/E';
  } else if (type === 'rev_growth') {
    return selectedYear + (short ? 'E Rev' : 'E Revenue');
  }

  return '';
}

export const parseValue = (metric) => {
  return metric === '' ? 0 : metric.toString().includes('.') ? parseFloat(metric) * 1000 : parseFloat(metric.toString().replace(/,|-/gi,''));
}

export const formatMetric = (metric, isInput) => {
  if (!metric) {
    return ' ';
  } else if (metric.toString().includes('.') && isInput) {
    return metric;
  } else if (parseFloat(metric) >= 10000) {
    return Math.round(parseFloat(metric) / 1000);
  } else if (metric >= 1000) {
    return (parseFloat(metric) / 1000).toFixed(1);
  } else {
    return Math.round(parseFloat(metric));
  }
}

export const formatMultiple = (metric, isInput) => {
  if (!metric) {
    return ' ';
  } else if (metric.toString().includes('.') && isInput) {
    //if number of digits after decimal is greater than 1 then round to 1 else just return the full number
    return (metric.toString().split(".")[1].length > 1 ? parseFloat(metric).toFixed(1) : metric);
  } else if (metric.toString().includes('.')) {
    return parseFloat(metric).toFixed(1);
  } else {
    //it's a whole number so just return whole number
    return parseFloat(metric.toString().replace(/,|-| /gi,''));
  }
}

export const formatSuffix = (metric) => {
  return metric && metric >= 1000 ? 'B' : 'M';   
}


const multipleYear = [
  {
    value: 'cy1',
    label: '2018E',
  },
  {
    value: 'cy2',
    label: '2019E',
  }
];

const multipleMetric = [
  {
    value: 'rev',
    label: 'Revenue',
  },
  {
    value: 'ebitda',
    label: 'EBITDA',
  },
  {
    value: 'eps',
    label: 'P/E',
  },
  {
    value: 'rev_growth',
    label: 'Rev Growth',
  },
];

export function SelectYear(props) {
  const { classes } = props;

  return(
  <TextField 
    id="select-year" 
    select
    label="Select Year"
    className={classes.textField}
    value={props.selectedYear}
    onChange={props.handleChange('selectedYear')}
    SelectProps={{
      MenuProps: {
        className: classes.menu,
      },
    }}
    margin="normal"
  >
  
  {multipleYear.map(option => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ))}
  </TextField>
  );
}

export function SelectMetric(props) {
  const { classes } = props;

  return(
  <TextField 
    id="select-year" 
    select
    label="Select Metric"
    className={classes.textField}
    value={props.selectedMetric}
    onChange={props.handleChange('selectedMetric')}
    SelectProps={{
      MenuProps: {
        className: classes.menu,
      },
    }}
    margin="normal"
  >
  
  {multipleMetric.map(option => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ))}
  </TextField>
  );
}

export const getPriorYear = (year) => {
  if (year === 'cy1') {
    return 'cy'
  } else if (year === 'cy2') {
    return 'cy1'
  } else {
    return undefined
  }
}

export const calcMultiples = (company, metric, year) => {   
  if (company.multiple) {
    return company.multiple;
  }

  var multiple = 0;
  var debt = typeof(company.debt !== 'undefined') ? parseFloat(company.debt) : 0;
  var minority_int = typeof(company.minority_int !== 'undefined') ? parseFloat(company.minority_int) : 0;
  var cash = typeof(company.cash !== 'undefined') ? parseFloat(company.cash) : 0;
  var lt_invest = typeof(company.lt_invest !== 'undefined') ? parseFloat(company.lt_invest) : 0;

  var equity_val = company.last_price * company.shares_out;
  var currentEV = equity_val + debt + minority_int - cash - lt_invest;

  if (metric === 'rev' && !isNaN(company[metric+'_'+year])) {
    var _multiple1 = currentEV / company[metric+'_'+year];
    return _multiple1 > maxRevenueMultiple || _multiple1 < 0 ? 0 : _multiple1;
  } else if (metric === 'ebitda' && !isNaN(company[metric+'_'+year])) {
    var _multiple2 = currentEV / company[metric+'_'+year];
    return _multiple2 > maxEBITDAMultiple || _multiple2 < 0 ? 0 : _multiple2;
  } else if (metric === 'eps' && !isNaN(company[metric+'_'+year])) {
    var _multiple3 = company.last_price / company[metric+'_'+year];
    return _multiple3 > maxPEMultiple || _multiple3 < 0 ? 0 : _multiple3;                 
  } else if (metric === 'rev_growth' && !isNaN(company['rev_'+year])) {
    var _growth = (company['rev_'+year] / company['rev_'+getPriorYear(year)] - 1) * 100;
    return _growth > maxPEMultiple || _growth < -50 ? 0 : _growth;               
  }

  return multiple;
}

export const getCase = (cases, options, type) => {
  if (cases && options) {
    var caseArray = cases.filter((elem, index, array) => { return elem.ticker.toLowerCase() === options[type]});
    return caseArray.length > 0 ? caseArray[0] : undefined;
  }

  return undefined;
}