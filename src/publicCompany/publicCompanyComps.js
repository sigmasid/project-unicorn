import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';

import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import CompsChart from './valuationsChart.js';
import { getFormattedMetric, getPriorYear, maxRevenueMultiple, maxEBITDAMultiple, maxPEMultiple, SelectYear, SelectMetric } from '../shared/sharedFunctions.js';
import Loading from '../shared/loading.js';
import classNames from 'classnames';

const moment = require('moment');
//const util = require('util'); //print an object

const styles = theme => ({
  card: {
    margin: 20
  },
  header: {
    textAlign: 'left'
  },
  cardContent: {
    textAlign: 'center'
  },
  textField: {
    minWidth: 150
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
  }
});

const calcMultiples = (compSet, metric, year, detailed) => {
  return detailed ? calcDetailedMultiples(compSet, metric, year) : calcIEXMultiples(compSet, metric); 
}

const calcDetailedMultiples = (compSet, metric, year) => {
  var comps=[];
  var lastUpdate = undefined;
  var useTicker = compSet.length > 10;

  compSet.map( currentCompany => {
    var debt = (currentCompany.debt && parseFloat(currentCompany.debt)) || 0;
    var minority_int = (currentCompany.minority_int && parseFloat(currentCompany.minority_int)) || 0;
    var cash = (currentCompany.cash && parseFloat(currentCompany.cash)) || 0;
    var lt_invest = (currentCompany.lt_invest && parseFloat(currentCompany.lt_invest)) || 0;

    var equity_val = currentCompany.last_price * currentCompany.shares_out;
    var currentEV = equity_val + debt + minority_int - cash - lt_invest;
    var ticker = !useTicker || currentCompany.ticker.includes(':') ? currentCompany.name : currentCompany.ticker;

    if (metric === 'rev' && !isNaN(currentCompany[metric+'_'+year])) {
      var _multiple1 = currentEV / currentCompany[metric+'_'+year];
      comps[ticker] = _multiple1 > maxRevenueMultiple || _multiple1 < 0 ? 0 : _multiple1;
    } else if (metric === 'ebitda' && !isNaN(currentCompany[metric+'_'+year])) {
      var _multiple2 = currentEV / currentCompany[metric+'_'+year];
      comps[ticker] = _multiple2 > maxEBITDAMultiple || _multiple2 < 0 ? 0 : _multiple2;
    } else if (metric === 'eps' && !isNaN(currentCompany[metric+'_'+year])) {
      var _multiple3 = currentCompany.last_price / currentCompany[metric+'_'+year];
      comps[ticker] = _multiple3 > maxPEMultiple || _multiple3 < 0 ? 0 : _multiple3;                 
    } else if (metric === 'rev_growth' && !isNaN(currentCompany['rev_'+year])) {
      var _growth = (currentCompany['rev_'+year] / currentCompany['rev_'+getPriorYear(year)] - 1) * 100;
      comps[ticker] = _growth > maxPEMultiple || _growth < -50 ? 0 : _growth;                 
    }

    if ((lastUpdate === undefined && currentCompany.last_price_update !== undefined) || (currentCompany.last_price_update !== undefined && lastUpdate !== undefined && currentCompany.last_price_update > lastUpdate)) {
      lastUpdate = currentCompany.last_price_update;
    }

    return comps;
  }); 

  var sortedObj = sortProperties(comps);
  sortedObj.lastUpdate = lastUpdate;

  return sortedObj;
};

const calcIEXMultiples = (compSet, metric) => {
  var comps=[];

  compSet.map( currentCompany => {    
    var currentEV = currentCompany.marketcap + currentCompany.debt - currentCompany.cash;

    if (metric === 'rev' && currentCompany.revenue) {
      var _multiple1 = currentEV / currentCompany.revenue;
      comps[currentCompany.symbol] = _multiple1 > maxRevenueMultiple || _multiple1 < 0 ? 0 : _multiple1;
    } else if (metric === 'ebitda' && currentCompany.EBITDA) {
      var _multiple2 = currentEV / currentCompany.EBITDA;
      comps[currentCompany.symbol] = _multiple2 > maxEBITDAMultiple || _multiple2 < 0 ? 0 : _multiple2;
    } else if (metric === 'eps' && currentCompany.ttmEPS) {
      var _multiple3 = currentCompany.price / currentCompany.ttmEPS;
      comps[currentCompany.symbol] = _multiple3 > maxPEMultiple || _multiple3 < 0 ? 0 : _multiple3;                 
    }

    return comps;
  }); 

  var sortedObj = sortProperties(comps);
  sortedObj.lastUpdate = undefined;

  return sortedObj;
};

const sortProperties = obj => {
  // convert object into array
  var sortable=[];
  var returnObj = {};

  var total=0;
  var numComps=0;

  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      sortable.push([key, obj[key]]);
      total = obj[key] === 0 ? total : total + obj[key];
      numComps = obj[key] === 0 ? numComps : numComps + 1;
    }
  }
  // sort items by value
  sortable.sort(function(a, b)
  {
    return b[1]-a[1]; // compare numbers
  });

  returnObj.comps = sortable;
  returnObj.highMultiple = calcRange(sortable, 'high');
  var half = Math.floor(sortable.length / 2);
  returnObj.median = sortable.length % 2 ? sortable[half][1] : (sortable[half - 1][1] + sortable[half][1]) / 2;

  return returnObj;
}

function calcRange(array, multipleType) {
  if (array.length === 1) {
    return array[0][1];
  } else {
    var half = Math.floor(array.length / 2);
    if (multipleType === 'low'){
      return array.length % 2 ? array[half][1] : (array[half - 1][1] + array[half][1]) / 2;
    } else {
      return array[0][1];
    }
  }
}

class CompanyComps extends Component {
  constructor (props) {
    super(props);

    this.state = { 
      selectedYear: this.props.selectedYear, 
      selectedMetric: this.props.selectedMetric,
      compSet: props.compSet 
    }

    !props.compData && props.updateCompSet(props.selectedCategory);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.compSet && nextProps.compSet !== this.props.compSet && nextProps.compSet.length > 0) {
      const compData = (nextProps.compSet && nextProps.compSet.length > 0) && calcMultiples(nextProps.compSet, nextProps.selectedMetric, nextProps.selectedYear, nextProps.categories);

      this.setState({
        compData: compData
      });
    }
  }

  //changing the target year or multiple type
  handleChange = name => event => {

    var newCompData = calcMultiples(this.props.compSet, name === 'selectedMetric' ? event.target.value : this.state.selectedMetric, name === 'selectedYear' ? event.target.value : this.state.selectedYear, this.props.categories);
    
    this.setState({
      [name]: event.target.value,
      compData: newCompData
    });

    this.props.handleChange(name, event.target.value);
  };

  handleClick = category => {
    if (this.props.selectedCategory !== category) {
      this.props.updateCompSet(category);
    }

    this.setState({ 
      compData: undefined
    });
  };

  getCategories = () => {
    var self = this;
    var { categories, classes } = this.props;

    if (!categories) {
      return <Chip key={'relevant'} label={'Peers'} className={classNames(classes.chip, classes.selectedChip)} />
    }

    return (Object.keys(categories).map( (key, index) => {
      return (
          <Chip key={index} label={key.toProperCase()} onClick={() => self.handleClick(key)} className={self.props.selectedCategory === key ? classNames(classes.chip, classes.selectedChip) : classes.chip} />
        );
      }));
  }

  getStatType = (metric) => {
    if (metric === 'rev_growth') {
      return " Growth %";
    } else {
      return " Multiples";
    }
  }

  getStatSymbol = (metric) => {
    if (metric === 'rev_growth') {
      return "%";
    } else {
      return "x";
    }    
  }

  render() {
    const { classes, theme, title, categories, latestUpdate, selectedTicker, selectedName } = this.props;
    const { compData, selectedMetric, selectedYear } = this.state;

    if (!compData) {
      return <Loading />
    }

    const chartSubtitle = getFormattedMetric(selectedMetric, selectedYear) + this.getStatType(selectedMetric);
    var formattedTime = latestUpdate ? moment(latestUpdate).format('MMM DD, YYYY') : (compData && moment(new Date(compData.lastUpdate)).format('MMM DD, YYYY'));

    return(
    <Card className={classes.card} >
      <CardHeader title={title || "Public Market Comparables"} subheader={chartSubtitle} className={classes.header} />
      <CardContent className={classes.cardContent} >
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            {categories && <Typography variant="subheading" color="textSecondary">Comparables Categories</Typography> }
            {categories && this.getCategories() }
          </Grid>

          <Grid container className={classes.demo} justify="center" spacing={Number(theme.spacing.unit * 3)}>
            <Grid item key={'selectYear'}>
              <SelectYear classes={classes} handleChange={this.handleChange} selectedYear={selectedYear} categories={categories} />
            </Grid>
            <Grid item key={'selectMetric'}>
              <SelectMetric classes={classes} handleChange={this.handleChange} selectedMetric={selectedMetric} categories={categories} />
            </Grid>
          </Grid>
        </Grid>
        <CompsChart comps={compData.comps} symbol={this.getStatSymbol(selectedMetric)} median={compData.median} selectedTicker={selectedTicker} selectedName={selectedName}/>
      </CardContent>
      <CardActions className={classes.footer} >
        <Divider className={classes.footerDivider} />
        <Typography variant="caption" color={'textSecondary'} gutterBottom>
          Note: Pricing data as of { formattedTime }.
        </Typography>
      </CardActions>
    </Card>
    );
  }
}

CompanyComps.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  selectedMetric: PropTypes.string,
  selectedYear: PropTypes.string
};

export default withStyles(styles, { withTheme: true })(CompanyComps);