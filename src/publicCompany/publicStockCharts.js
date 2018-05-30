import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import AddIcon from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';

import Chart from './stockChart.js';
import TickersList from './publicTickerChips.js';
import Loading from '../shared/loading.js';
import { getDurationLabel } from '../shared/sharedFunctions.js';
import RenderSuggestionsContainer from '../shared/searchSuggestions.js';
import MaxMessage from '../shared/message.js';

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
  },
  tabRoot: {
    minWidth: 50
  }
});

class StockChart extends Component {
  constructor (props) {
    super(props);

    this.state = { 
      anchorEl: null,
      searchText: '',
      shouldRedraw: false   
    }

    this.createChartDurations = this.createChartDurations.bind(this);
    this.handleChange = this.handleChange.bind(this);    
  }

  handleClick = duration => {
    if (this.props.selectedDuration !== duration) {
      this.props.changeDuration(duration);
    }
  };

  handleChangeDuration = (event, value) => {
    if (this.props.selectedDuration !== value) {
      this.props.changeDuration(value);
    }
    this.setState({ value, shouldRedraw: true });
  };

  /**
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      anchorEl: findDOMNode(this.searchBox),
      shouldRedraw: false,
      searchResults: this.props.getSuggestions(event.target.value),
    });
  }; **/

  handleChange = name => event =>  {
    var searchText = event.target.value;

    if (!this.state.initialLoadComplete) {
      var loading = {"loading": {"name": "Searching..."}};

      this.setState({
        anchorEl: findDOMNode(this.searchBox),
        initialLoadComplete: true,
        searchResults: loading,
        shouldRedraw: false,        
        searchText: searchText
      });
    } else {
      this.setState({    
        searchText: searchText
      });      
    }
    
    this.props.getSuggestions(searchText)
    .then( data => {
      this.setState({
        searchResults: data
      });
    })
    .catch( err => {
      this.setState({
        anchorEl: undefined,
        results: undefined,
        searchText: searchText
      });
    })
    return null;
  };

  handleAddComp = (ticker) => {
    /// if total comps is greater than 5 ignore, else add

    if (Object.keys(this.props.chartData).length < 2) {
      this.setState({shouldRedraw: true});
      this.props.addComp(ticker);
      this.handleClose();
    } else {
      /// show snackbar
      this.setState({maxCompsReached: true});
    }
  }

  handleClose = () => {
    this.setState({
      anchorEl: null,
      searchResults: undefined,
      searchText: '',
      maxCompsReached: undefined
    });
  }

  createChartDurations() {
  const { classes, chartDurations, selectedDuration } = this.props;
  var self = this;

    if (!chartDurations) {
      return null;
    }

    var chips = chartDurations.map( (key, index) => {
      return (
          <Chip key={index} label={ getDurationLabel(key) } onClick={() => self.handleClick(key)} className={selectedDuration === key ? classNames(classes.chip, classes.selectedChip) : classes.chip} />
        );
      })
    return(<div className={classes.chipsContainer}>{chips}</div>); 
  }

  searchBox = null;

  render() {
    const { classes, chartData, selectedDuration, chipData, deleteComp, shouldRedraw } = this.props;
    const { searchResults, anchorEl, maxCompsReached } = this.state;

    const tabs = 
      <Paper className={classes.tabsContainer}>
        <Tabs
          value={selectedDuration}
          onChange={this.handleChangeDuration}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          <Tab label="1D" value="1d" className={classes.tabRoot} />
          <Tab label="1W" value="1w" className={classes.tabRoot} />
          <Tab label="1M" value="1m" className={classes.tabRoot} />
          <Tab label="3M" value="3m" className={classes.tabRoot} />
          <Tab label="6M" value="6m" className={classes.tabRoot} />
          <Tab label="1Y" value="1y" className={classes.tabRoot} />
          <Tab label="2Y" value="2y" className={classes.tabRoot} />
          <Tab label="5Y" value="5y" className={classes.tabRoot} />          
        </Tabs>
      </Paper>

    return(
    <Card className={classes.card} >
      <CardHeader 
        title={"Stock Price Performance"} 
        subheader={getDurationLabel(selectedDuration)} 
        classes={{root: classes.header, action: classes.headerAction}} 
        action={
          <div className={classes.searchSuggestions} ref={node => { this.searchBox = node;}}>
            <TextField
              label="Compare To"
              id="searchText"
              className={classes.textField}
              onChange={this.handleChange('searchText')}
              value={this.state.searchText}
              InputProps={{
                startAdornment: <InputAdornment position="start">Comp:</InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={this.handleClose}>{anchorEl ? <CloseIcon /> : <AddIcon />}</IconButton></InputAdornment>,
              }}
          />
            <RenderSuggestionsContainer results={searchResults} anchorEl={anchorEl} handleClose={this.handleClose} handleSelect={this.handleAddComp} />          
          </div>           
        } />
      <CardContent className={classes.cardContent} >
        { tabs }
        { this.createChartDurations() }
        { chartData && <Chart chartData={chartData} duration={selectedDuration} shouldRedraw={shouldRedraw} /> }
        { !chartData && <Loading /> }
      </CardContent>
      <TickersList chipData={chipData} deleteComp={deleteComp} />
      {maxCompsReached && <MaxMessage text={"Sorry, you can only add up to 5 comps"} handleClose={this.handleClose} open={maxCompsReached} anchorV='top' anchorH='center' />}
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