import React from 'react';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/Menu/MenuItem';

export const getFormattedMetric = (type, year, short) => {
  let selectedYear = year === 'cy1' ? (new Date()).getFullYear() : (new Date()).getFullYear() + 1;

  if (type === 'rev') {
    return selectedYear + (short ? 'E Rev' : 'E Revenue');
  } else if (type === 'ebitda') {
    return selectedYear + 'E EBITDA';
  } else if (type === 'eps') {
    return selectedYear + 'E P/E';
  }

  return '';
}

export const formatMetric = (metric) => {
  return metric !== undefined ? (metric >= 10000 ? Math.round(metric / 1000) : (metric >= 1000 ? (metric / 1000).toFixed(1) : Math.round(metric) : 0)) : '-';
}

export const formatSuffix = (metric) => {
  return metric !== undefined ? (metric >= 1000 ? 'B' : 'M') : null;    
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
    label="Select Multiple"
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