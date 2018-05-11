import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Card, { CardContent, CardHeader, CardActions } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Chip from 'material-ui/Chip';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';

import CompsChart from './compsChart.js';
import { getFormattedMetric, getPriorYear, maxRevenueMultiple, maxEBITDAMultiple, maxPEMultiple, SelectYear, SelectMetric } from '../shared/sharedFunctions.js';
import Loading from '../shared/loading.js';
import Message from '../shared/message.js';
import classNames from 'classnames';

import 'typeface-roboto';
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

const calcMultiples = (compSet, metric, year) => {
  var comps=[];
  var lastUpdate = undefined;

  compSet.map(function(currentCompany) {
    var debt = typeof(currentCompany.debt !== 'undefined') ? parseFloat(currentCompany.debt) : 0;
    var minority_int = typeof(currentCompany.minority_int !== 'undefined') ? parseFloat(currentCompany.minority_int) : 0;
    var cash = typeof(currentCompany.cash !== 'undefined') ? parseFloat(currentCompany.cash) : 0;
    var lt_invest = typeof(currentCompany.lt_invest !== 'undefined') ? parseFloat(currentCompany.lt_invest) : 0;

    var equity_val = currentCompany.last_price * currentCompany.shares_out;
    var currentEV = equity_val + debt + minority_int - cash - lt_invest;

    if (metric === 'rev' && !isNaN(currentCompany[metric+'_'+year])) {
      var _multiple1 = currentEV / currentCompany[metric+'_'+year];
      comps[currentCompany.name] = _multiple1 > maxRevenueMultiple || _multiple1 < 0 ? 0 : _multiple1;
    } else if (metric === 'ebitda' && !isNaN(currentCompany[metric+'_'+year])) {
      var _multiple2 = currentEV / currentCompany[metric+'_'+year];
      comps[currentCompany.name] = _multiple2 > maxEBITDAMultiple || _multiple2 < 0 ? 0 : _multiple2;
    } else if (metric === 'eps' && !isNaN(currentCompany[metric+'_'+year])) {
      var _multiple3 = currentCompany.last_price / currentCompany[metric+'_'+year];
      comps[currentCompany.name] = _multiple3 > maxPEMultiple || _multiple3 < 0 ? 0 : _multiple3;                 
    } else if (metric === 'rev_growth' && !isNaN(currentCompany['rev_'+year])) {
      var _growth = (currentCompany['rev_'+year] / currentCompany['rev_'+getPriorYear(year)] - 1) * 100;
      comps[currentCompany.name] = _growth > maxPEMultiple || _growth < -50 ? 0 : _growth;                 
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

  /**
  var lowIndex = Math.ceil(sortable.length * (lowPercentile / 100)) - 1;
  var highIndex = Math.ceil(sortable.length * (highPercentile / 100)) - 1; 
  returnObj.lowMultiple = sortable[highIndex][1]; //flipped because values are reverse sorted
  returnObj.highMultiple = sortable[lowIndex][1]; **/
  returnObj.lowMultiple = calcRange(sortable, 'low'); //flipped because values are reverse sorted
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
    //var editedArray = array.slice(1, array.length - 1);

    if (multipleType === 'low'){
      return array.length % 2 ? array[half][1] : (array[half - 1][1] + array[half][1]) / 2;
    } else {
      return array[0][1];
    }
  }
}

function formatDate(dateIn) {
   var yyyy = dateIn.getFullYear();
   var mm = dateIn.getMonth()+1; // getMonth() is zero-based
   var dd  = dateIn.getDate();
   return String(mm + '/' + dd + '/' + yyyy); // Leading zeros for mm and dd
}

class CompanyComps extends Component {
  constructor (props) {
    super(props);
    const compData = (this.props.compSet && this.props.compSet.length > 0) ? calcMultiples(this.props.compSet, this.props.selectedMetric, this.props.selectedYear) : undefined;

    this.state = { 
      selectedYear: this.props.selectedYear, 
      selectedMetric: this.props.selectedMetric,
      compData: compData
    }

    if (this.props.setMultipleRange) {
      this.props.setMultipleRange(compData ? compData.lowMultiple : undefined, compData ? compData.highMultiple : undefined);
    }
    this.categories = this.categories.bind(this);
    this.getStatType = this.getStatType.bind(this);
    this.getStatSymbol = this.getStatSymbol.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.compSet && nextProps.compSet !== this.props.compSet && nextProps.compSet.length > 0) {
      const compData = (nextProps.compSet && nextProps.compSet.length > 0) ? calcMultiples(nextProps.compSet, nextProps.selectedMetric, nextProps.selectedYear) : undefined;

      this.setState({
        compData: compData
      });

      if (this.props.setMultipleRange) {
        this.props.setMultipleRange(compData ? compData.lowMultiple : undefined, compData ? compData.highMultiple : undefined);
      }
    }
  }

  //changing the target year or multiple type
  handleChange = name => event => {
    var newCompData = calcMultiples(this.props.compSet, name === 'selectedMetric' ? event.target.value : this.state.selectedMetric, name === 'selectedYear' ? event.target.value : this.state.selectedYear);
    
    this.setState({
      [name]: event.target.value,
      compData: newCompData,
      showMessage: name==='selectedMetric' && event.target.value !== 'rev'
    });

    //update parent
    if (this.props.setMultipleRange) {
      this.props.setMultipleRange(newCompData.lowMultiple, newCompData.highMultiple);
    }
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

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ showMessage: false });
  };

  categories = classes => {
    var self = this;

    if (this.props.categories === undefined) {
      return null;
    }

    var chips = this.props.categories.map(function(key, index) {
      return (
          <Chip key={index} label={key.toProperCase()} onClick={() => self.handleClick(key)} className={self.props.selectedCategory === key ? classNames(classes.chip, classes.selectedChip) : classes.chip} />
        );
      })
    return(<div>{chips}</div>); 
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
    const { classes, theme, title, categories } = this.props;
    const {compData, selectedMetric, selectedYear} = this.state;
    const chartSubtitle = getFormattedMetric(selectedMetric, selectedYear) + this.getStatType(selectedMetric);
    var lastUpdate = compData ? formatDate(new Date(compData.lastUpdate)) : null;

    return(
    <div>
      <Card className={classes.card} >
        <CardHeader title={title || "Public Market Comparables"} subheader={chartSubtitle} className={classes.header} />
        <CardContent className={classes.cardContent} >
          <Grid container className={classes.root}>
            <Grid item xs={12}>
              {categories === undefined ? null : <Typography variant="subheading" color="textSecondary">Comparables Categories</Typography> }
              <div>{ this.categories(classes) }</div>
            </Grid>

            <Grid container className={classes.demo} justify="center" spacing={Number(theme.spacing.unit * 3)}>
              <Grid item key={'selectYear'}>
                <SelectYear classes={classes} handleChange={this.handleChange} selectedYear={this.state.selectedYear} />
              </Grid>
              <Grid item key={'selectMetric'}>
                <SelectMetric classes={classes} handleChange={this.handleChange} selectedMetric={this.state.selectedMetric} />
              </Grid>
            </Grid>
          </Grid>
          { compData !== undefined && compData.comps.length > 0 ? <CompsChart comps={compData.comps} median={compData.median} symbol={this.getStatSymbol(selectedMetric)} /> : <Loading /> }
        </CardContent>
        <CardActions className={classes.footer} >
          <Divider className={classes.footerDivider} />
          <Typography variant="caption" color={'textSecondary'} gutterBottom>
            Note: Pricing data as of { lastUpdate }.
          </Typography>
        </CardActions>
      </Card>
      <Message text={"Fast growth IPOs are typically valued on Revenue multiples."} open={this.state.showMessage} handleClose={this.handleClose} />
    </div>
    );
  }
}

CompanyComps.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(CompanyComps);